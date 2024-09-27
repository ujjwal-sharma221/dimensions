import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { Lucia, Session, User } from "lucia";
import { cache } from "react";

import prisma from "./prisma";
import { cookies } from "next/headers";

const adapter = new PrismaAdapter(prisma.session, prisma.user);

interface DatabaseUserAttributes {
  id: string;
  displayName: string;
  username: string;
  avatarUrl: string | null;
  googleId: string | null;
}

declare module "Lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },

  getUserAttributes(DatabaseUserAttributes) {
    return {
      id: DatabaseUserAttributes.id,
      username: DatabaseUserAttributes.username,
      avatarUrl: DatabaseUserAttributes.avatarUrl,
      googleId: DatabaseUserAttributes.googleId,
      displayName: DatabaseUserAttributes.displayName,
    };
  },
});

export const validateRequest = cache(
  async (): Promise<
    { user: User; session: Session } | { user: null; session: null }
  > => {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
    if (!sessionId) return { user: null, session: null };

    const res = await lucia.validateSession(sessionId);

    try {
      if (res.session && res.session.fresh) {
        const sessionCookie = lucia.createSessionCookie(res.session.id);
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );
      }
      if (!res.session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );
      }
    } catch {}

    return res;
  },
);

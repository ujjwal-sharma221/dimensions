import { cache } from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";

import prisma from "@/lib/prisma";
import { getUserDataSelect } from "@/lib/types";
import { validateRequest } from "@/lib/auth";

interface UserPageProps {
  params: { username: string };
}

interface UserProfileProps{}

const getUser = cache(async (username: string, loggedInUserId: string) => {
  const user = await prisma.user.findFirst({
    where: {
      username: {
        equals: username,
        mode: "insensitive",
      },
    },
    select: getUserDataSelect(loggedInUserId),
  });

  if (!user) return notFound();

  return user;
});

export async function generateMetadata({
  params: { username },
}: UserPageProps): Promise<Metadata> {
  const { user: loggedInUser } = await validateRequest();
  if (!loggedInUser) return {};

  const user = await getUser(username, loggedInUser.id);

  return {
    title: `${user.displayName} (@${user.username})`,
  };
}

async function UserProfile{}

const UserPage = async ({ params: { username } }: UserPageProps) => {
  const { user: loggedInUser } = await validateRequest();
  if (!loggedInUser) return null;

  const user = await getUser(username, loggedInUser.id);

  return (
    <main className="flex w-full min-w-0">
      <div className="w-full min-w-0 space-y-5"></div>
    </main>
  );
};

export default UserPage;

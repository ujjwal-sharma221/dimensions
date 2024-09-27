import { Satellite } from "lucide-react";
import { Suspense } from "react";
import Link from "next/link";

import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { UserDataSelect } from "@/lib/types";
import { UserAvatar } from "./user-avatar";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

export function TrendsSidebar() {
  return (
    <div className="spacey-y-5 top-0 hidden h-fit w-72 flex-none md:block lg:w-80">
      <Suspense fallback={<Satellite className="mx-auto animate-pulse" />}>
        <WhoTofollow />
      </Suspense>
    </div>
  );
}

async function WhoTofollow() {
  const { user } = await validateRequest();
  if (!user) return;

  const usersToFollow = await prisma.user.findMany({
    where: {
      NOT: {
        id: user.id,
      },
    },
    select: UserDataSelect,
    take: 5,
  });

  return (
    <div className="space-y-5 rounded-xl border-2 border-zinc-500 p-5 text-[#4A4947]">
      <div className="text-xl font-bold">Who to follow</div>
      <Separator />
      {usersToFollow.map((user) => (
        <div key={user.id} className="flex items-center justify-between gap-3">
          <Link
            href={`/users/${user.username}`}
            className="flex items-center gap-3"
          >
            <UserAvatar avatarUrl={user.avatarUrl} className="flex-none" />
            <div>
              <p className="line-clamp-1 break-all font-semibold hover:underline">
                {user.displayName}
              </p>
              <p className="line-clamp-1 break-all text-muted-foreground">
                @{user.username}
              </p>
            </div>
          </Link>
          <Button className="rounded-xl px-3 py-1">Follow</Button>
        </div>
      ))}
    </div>
  );
}

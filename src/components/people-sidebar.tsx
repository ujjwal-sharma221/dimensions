import { Satellite } from "lucide-react";
import { Suspense } from "react";
import Link from "next/link";

import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { UserAvatar } from "./user-avatar";
import { Separator } from "./ui/separator";
import { FollowButton } from "./follow-button";
import { getUserDataSelect } from "@/lib/types";
import { UserToolTip } from "./user-tooltip";

export function TrendsSidebar() {
  return (
    <div className="spacey-y-5 top-0 hidden h-fit w-72 flex-none md:block lg:w-80">
      <Suspense fallback={<Satellite className="mx-auto animate-pulse" />}>
        <WhoToFollow />
      </Suspense>
    </div>
  );
}

async function WhoToFollow() {
  const { user } = await validateRequest();

  if (!user) return null;

  const usersToFollow = await prisma.user.findMany({
    where: {
      NOT: {
        id: user.id,
      },
      followers: {
        none: {
          followerId: user.id,
        },
      },
    },
    select: getUserDataSelect(user.id),
    take: 5,
  });

  return (
    <div className="space-y-5 rounded-xl border-2 border-zinc-500 p-5 text-[#4A4947]">
      <div className="text-xl font-bold">Who to follow</div>
      <Separator />
      {usersToFollow.map((user) => (
        <div key={user.id} className="flex items-center justify-between gap-3">
          <UserToolTip user={user}>
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
          </UserToolTip>
          <FollowButton
            userId={user.id}
            intialState={{
              followers: user._count.followers,
              isFollowedByUser: user.followers.some(
                ({ followerId }) => followerId === user.id,
              ),
            }}
          />
        </div>
      ))}
    </div>
  );
}

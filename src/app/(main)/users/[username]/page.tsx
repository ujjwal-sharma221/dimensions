import { cache } from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";

import prisma from "@/lib/prisma";
import { FollowerInfoType, getUserDataSelect, UserDataType } from "@/lib/types";
import { validateRequest } from "@/lib/auth";
import { UserAvatar } from "@/components/user-avatar";
import { formatDate } from "date-fns";
import { formatNumber } from "@/lib/utils";
import { FollowerCount } from "@/components/follower-count";
import { FollowButton } from "@/components/follow-button";
import { UserPosts } from "./following-feed";
import { Linkify } from "@/components/linkify";
import { EditProfile } from "../../_components/edit-profile";

interface UserPageProps {
  params: { username: string };
}

interface UserProfileProps {
  user: UserDataType;
  loggedInUserId: string;
}

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

async function UserProfile({ user, loggedInUserId }: UserProfileProps) {
  const followerInfo: FollowerInfoType = {
    followers: user._count.followers,
    isFollowedByUser: user.followers.some(
      ({ followerId }) => followerId === loggedInUserId,
    ),
  };

  return (
    <div className="h-fit w-full space-y-5 rounded-xl border border-zinc-200 p-3 shadow-sm">
      <UserAvatar
        avatarUrl={user.avatarUrl}
        size={250}
        className="mx-auto size-full max-h-60 max-w-60 rounded-full"
      />
      <div className="flex flex-wrap gap-3 sm:flex-nowrap">
        <div className="me-auto space-y-3">
          <div>
            <h1 className="text-3xl font-bold">{user.displayName}</h1>
            <div className="text-muted-foreground">@{user.username}</div>
          </div>
          <div>Member since {formatDate(user.createdAt, "MMM d, yyyy")} </div>
          <div className="flex items-center gap-3">
            <span>
              Posts:{" "}
              <span className="font-semibold">
                {formatNumber(user._count.posts)}
              </span>
            </span>
            <FollowerCount userId={user.id} intialState={followerInfo} />
          </div>
        </div>
        {user.id === loggedInUserId ? (
          <EditProfile user={user} />
        ) : (
          <FollowButton userId={user.id} intialState={followerInfo} />
        )}
      </div>
      {user.bio ? (
        <>
          <hr />
          <Linkify>
            <div className="overflow-hidden whitespace-pre-line break-words">
              {user.bio}
            </div>
          </Linkify>
        </>
      ) : null}
    </div>
  );
}

const UserPage = async ({ params: { username } }: UserPageProps) => {
  const { user: loggedInUser } = await validateRequest();
  if (!loggedInUser) return null;

  const user = await getUser(username, loggedInUser.id);

  return (
    <main className="flex w-full min-w-0">
      <div className="w-full min-w-0 space-y-5">
        <UserProfile user={user} loggedInUserId={loggedInUser.id} />

        <UserPosts userId={user.id} />
      </div>
    </main>
  );
};

export default UserPage;

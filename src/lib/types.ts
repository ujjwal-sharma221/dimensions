import { Prisma } from "@prisma/client";

export function getUserDataSelect(userId: string) {
  return {
    id: true,
    displayName: true,
    username: true,
    avatarUrl: true,
    bio: true,
    createdAt: true,
    followers: {
      where: {
        followerId: userId,
      },
      select: {
        followerId: true,
      },
    },
    _count: {
      select: { followers: true, posts: true },
    },
  } satisfies Prisma.UserSelect;
}

export function getPostDataInlcuded(userId: string) {
  return {
    user: {
      select: getUserDataSelect(userId),
    },
  } satisfies Prisma.PostInclude;
}

export type PostDataType = Prisma.PostGetPayload<{
  include: ReturnType<typeof getPostDataInlcuded>;
}>;

export type PostsPageType = {
  posts: PostDataType[];
  nextCursor: string | null;
};

export type FollowerInfoType = {
  followers: number;
  isFollowedByUser: boolean;
};

export type UserDataType = Prisma.UserGetPayload<{
  select: ReturnType<typeof getUserDataSelect>;
}>;

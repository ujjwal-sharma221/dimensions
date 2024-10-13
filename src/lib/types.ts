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
    attachments: true,
    likes: {
      where: { userId },
      select: { userId: true },
    },
    Bookmark: { where: { userId }, select: { userId: true } },
    _count: {
      select: { likes: true, comments: true },
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

export type LikeInfo = {
  likes: number;
  isLikedByUser: boolean;
};

export type BookmarkInfoType = {
  isBookmarkedByUser: boolean;
};

export function getCommentDataIncluded(loggedInUserId: string) {
  return {
    user: {
      select: getUserDataSelect(loggedInUserId),
    },
  } satisfies Prisma.CommentInclude;
}

export type CommentDataType = Prisma.CommentGetPayload<{
  include: ReturnType<typeof getCommentDataIncluded>;
}>;

export type CommentsPage = {
  comments: CommentDataType[];
  prevCursor: string | null;
};

export const NotificationInclude = {
  issuer: {
    select: {
      username: true,
      displayName: true,
      avatarUrl: true,
    },
  },
  post: {
    select: {
      content: true,
    },
  },
} satisfies Prisma.NotificationInclude;

export type NotificationDataType = Prisma.NotificationGetPayload<{
  include: typeof NotificationInclude;
}>;

export type NotificationsPage = {
  notifications: NotificationDataType[];
  nextCursor: string | null;
};

export type NotificationCountType = {
  unreadCount: number;
};

export type MessageInfoCount = {
  unreadCount: number;
};

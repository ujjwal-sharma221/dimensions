import { Prisma } from "@prisma/client";

export const UserDataSelect = {
  id: true,
  displayName: true,
  username: true,
  avatarUrl: true,
} satisfies Prisma.UserSelect;

export const PostDataInclude = {
  user: {
    select: UserDataSelect,
  },
} satisfies Prisma.PostInclude;

export type PostDataType = Prisma.PostGetPayload<{
  include: typeof PostDataInclude;
}>;

export type PostsPageType = {
  posts: PostDataType[];
  nextCursor: string | null;
};

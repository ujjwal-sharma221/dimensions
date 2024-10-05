import { cache, Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { LoaderPinwheel } from "lucide-react";

import prisma from "@/lib/prisma";
import { getPostDataInlcuded, UserDataType } from "@/lib/types";
import { validateRequest } from "@/lib/auth";
import { Post } from "@/components/post/post";
import { UserToolTip } from "@/components/user-tooltip";
import { UserAvatar } from "@/components/user-avatar";
import { Linkify } from "@/components/linkify";
import { FollowButton } from "@/components/follow-button";

interface PostPageProps {
  params: { postId: string };
}

const getPost = cache(async (postId: string, loggedInUserId: string) => {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: getPostDataInlcuded(loggedInUserId),
  });

  if (!post) return notFound();

  return post;
});

export async function generateMetadata({ params: { postId } }: PostPageProps) {
  const { user } = await validateRequest();
  if (!user) return {};

  const post = await getPost(postId, user.id);

  return {
    title: `${post.user.displayName}: ${post.content.slice(0, 50)}...`,
  };
}

const PostPage = async ({ params: { postId } }: PostPageProps) => {
  const { user } = await validateRequest();
  if (!user) {
    return (
      <>
        <p className="text-center text-destructive">
          You are not authroized to view this page
        </p>
      </>
    );
  }

  const post = await getPost(postId, user.id);

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <Post post={post} />
      </div>
      <div className="sticky top-[5.25rem] hidden h-fit w-80 flex-none lg:block">
        <Suspense
          fallback={<LoaderPinwheel className="mx-auto animate-spin" />}
        >
          <UserInfoSidebar user={post.user} />
        </Suspense>
      </div>
    </main>
  );
};

interface UserInfoSidebarProps {
  user: UserDataType;
}

async function UserInfoSidebar({ user }: UserInfoSidebarProps) {
  const { user: loggedInUser } = await validateRequest();
  if (!loggedInUser) return null;

  return (
    <div className="shadown-sm space-y-5 rounded-2xl border-2 p-5">
      <div className="text-xl font-bold">About this user</div>
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
      <Linkify>
        <div className="line-clamp-6 whitespace-pre-line break-words text-muted-foreground">
          {user.bio}
        </div>
      </Linkify>
      {user.id !== loggedInUser.id && (
        <FollowButton
          userId={user.id}
          intialState={{
            followers: user._count.followers,
            isFollowedByUser: user.followers.some(
              ({ followerId }) => followerId === loggedInUser.id,
            ),
          }}
        />
      )}
    </div>
  );
}

export default PostPage;

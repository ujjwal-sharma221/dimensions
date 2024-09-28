"use client";

import Link from "next/link";

import { PostDataType } from "@/lib/types";
import { UserAvatar } from "../user-avatar";
import { formatDate } from "@/lib/utils";
import { useSession } from "@/lib/session-provider";
import { PostMore } from "./post-more";

interface PostProps {
  post: PostDataType;
}

export const Post = ({ post }: PostProps) => {
  const { user } = useSession();
  return (
    <article className="group/post space-y-3 rounded-2xl bg-[#f0f1f4] p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-wrap gap-3">
          <Link href={`/users/${post.user.username}`}>
            <UserAvatar avatarUrl={post.user.avatarUrl} />
          </Link>
          <div>
            <Link
              href={`/users/${post.user.username}`}
              className="block font-semibold transition hover:underline"
            >
              {post.user.displayName}
            </Link>

            <Link
              href={`/posts/${post.id}`}
              className="block text-sm text-muted-foreground transition hover:underline"
            >
              {formatDate(post.createdAt)}
            </Link>
          </div>
        </div>
        {post.user.id === user.id ? (
          <PostMore
            post={post}
            className="opacity-0 transition-opacity group-hover/post:opacity-100"
          />
        ) : null}
      </div>
      <div className="whitespace-pre-line break-words">{post.content}</div>
    </article>
  );
};

"use client";

import Link from "next/link";
import { Media } from "@prisma/client";
import Image from "next/image";
import { useState } from "react";

import { PostDataType } from "@/lib/types";
import { UserAvatar } from "../user-avatar";
import { cn, formatDate } from "@/lib/utils";
import { useSession } from "@/lib/session-provider";
import { PostMore } from "./post-more";
import { Linkify } from "../linkify";
import { UserToolTip } from "../user-tooltip";
import { LikeButton } from "./like-button";
import { BookmarkButton } from "./bookmark-button";
import { CommentButton } from "../comments/_components/comment-button";
import { Comments } from "../comments/_components/comments";

interface PostProps {
  post: PostDataType;
}

export const Post = ({ post }: PostProps) => {
  const { user } = useSession();
  const [showComments, setShowComments] = useState(false);

  return (
    <article className="group/post space-y-3 rounded-2xl bg-[#f0f1f4] p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-wrap gap-3">
          <UserToolTip user={post.user}>
            <Link href={`/users/${post.user.username}`}>
              <UserAvatar avatarUrl={post.user.avatarUrl} />
            </Link>
          </UserToolTip>
          <div>
            <UserToolTip user={post.user}>
              <Link
                href={`/users/${post.user.username}`}
                className="block font-semibold transition hover:underline"
              >
                {post.user.displayName}
              </Link>
            </UserToolTip>

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
      <Linkify>
        <div className="whitespace-pre-line break-words">{post.content}</div>
      </Linkify>
      {!!post.attachments.length && (
        <MediaPreviews attachments={post.attachments} />
      )}
      <hr className="text-muted-foreground" />
      <div className="flex justify-between gap-5">
        <div className="flex items-center gap-5">
          <LikeButton
            postId={post.id}
            intialState={{
              likes: post._count.likes,
              isLikedByUser: post.likes.some((like) => like.userId === user.id),
            }}
          />
          <CommentButton
            post={post}
            onClick={() => setShowComments(!showComments)}
          />
        </div>

        <BookmarkButton
          postId={post.id}
          intialState={{
            isBookmarkedByUser: post.Bookmark.some(
              (bookmark) => bookmark.userId === user.id,
            ),
          }}
        />
      </div>
      {showComments && <Comments post={post} />}
    </article>
  );
};

interface MediaPreviewsProps {
  attachments: Media[];
}

function MediaPreviews({ attachments }: MediaPreviewsProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        attachments.length > 1 && "sm:grid sm:grid-cols-2",
      )}
    >
      {attachments.map((m) => (
        <MediaPreview key={m.id} media={m} />
      ))}
    </div>
  );
}

interface MediaPreviewProps {
  media: Media;
}

function MediaPreview({ media }: MediaPreviewProps) {
  if (media.type === "IMAGE") {
    return (
      <Image
        src={media.url}
        alt="Attachment"
        width={500}
        height={500}
        className="mx-auto size-fit max-h-[30rem] rounded-2xl"
      />
    );
  }

  if (media.type === "VIDEO") {
    return (
      <div>
        <video
          src={media.url}
          controls
          className="mx-auto size-fit max-h-[30rem] rounded-2xl"
        />
      </div>
    );
  }

  return <p className="text-destructive">Unsupported media type</p>;
}

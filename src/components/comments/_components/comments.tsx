import { useInfiniteQuery } from "@tanstack/react-query";

import { CommentsPage, PostDataType } from "@/lib/types";
import { CommentInput } from "./comment-input";
import kyInstance from "@/lib/ky";
import { Comment } from "./comment";
import { Button } from "@/components/ui/button";
import { LoaderPinwheel } from "lucide-react";

interface CommentProps {
  post: PostDataType;
}

export const Comments = ({ post }: CommentProps) => {
  const { data, fetchNextPage, hasNextPage, isFetching, status } =
    useInfiniteQuery({
      queryKey: ["comments", post.id],
      queryFn: ({ pageParam }) =>
        kyInstance
          .get(
            `api/posts/${post.id}/comments`,
            pageParam ? { searchParams: { cursor: pageParam } } : {},
          )
          .json<CommentsPage>(),
      initialPageParam: null as string | null,
      getNextPageParam: (firstPage) => firstPage.prevCursor,
      select: (data) => ({
        pages: [...data.pages].reverse(),
        pageParams: [...data.pageParams].reverse(),
      }),
    });

  const comments = data?.pages.flatMap((page) => page.comments) || [];

  return (
    <div className="space-y-3">
      <CommentInput post={post} />
      {hasNextPage && (
        <Button
          className="mx-auto block"
          variant="link"
          disabled={isFetching}
          onClick={() => fetchNextPage()}
        >
          Load previous comments
        </Button>
      )}
      {status === "pending" && (
        <LoaderPinwheel className="mx-auto animate-spin" />
      )}
      {status === "success" && !comments.length && (
        <p className="text-center text-muted-foreground">
          No comments yet, people may not like you post :)
        </p>
      )}
      {status === "error" && (
        <p className="text-center text-destructive">
          An error occurred while fetching comments
        </p>
      )}

      <div className="divide-y">
        {comments.map((c) => (
          <Comment key={c.id} comment={c} />
        ))}
      </div>
    </div>
  );
};

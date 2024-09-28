"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { LoaderPinwheel } from "lucide-react";

import { PostsPageType } from "@/lib/types";
import { Post } from "@/components/post/post";
import kyInstance from "@/lib/ky";
import { InfiniteScrollContainer } from "@/components/infiniteScroll-container";
import { PostLoadingSkeleton } from "@/components/post/post-loading-skelton";

export function FollwingFeed() {
  const { data, fetchNextPage, hasNextPage, isFetching, status } =
    useInfiniteQuery({
      queryKey: ["post-feed", "following"],
      queryFn: ({ pageParam }) =>
        kyInstance
          .get(
            "/api/posts/following",
            pageParam ? { searchParams: { cursor: pageParam } } : {},
          )
          .json<PostsPageType>(),
      initialPageParam: null as string | null,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

  const posts = data?.pages.flatMap((page) => page.posts) ?? [];

  if (status === "pending") return <PostLoadingSkeleton />;

  if (status === "success" && !posts.length && !hasNextPage)
    return (
      <p className="text-center text-muted-foreground">
        This user has not posted anything yet, maybe its dealing with some
        confidence issues
      </p>
    );

  if (status === "error")
    return (
      <p className="text-center text-destructive">
        An error occurred while loading posts
      </p>
    );

  return (
    <InfiniteScrollContainer
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
      className="flex flex-col gap-4"
    >
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
      {isFetching && <LoaderPinwheel className="mx-auto my-3 animate-spin" />}
    </InfiniteScrollContainer>
  );
}

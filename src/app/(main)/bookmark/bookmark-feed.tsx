"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { LoaderPinwheel } from "lucide-react";

import { PostsPageType } from "@/lib/types";
import { Post } from "@/components/post/post";
import kyInstance from "@/lib/ky";
import { InfiniteScrollContainer } from "@/components/infiniteScroll-container";
import { PostLoadingSkeleton } from "@/components/post/post-loading-skelton";

export function BookmarkFeed() {
  const { data, fetchNextPage, hasNextPage, isFetching, status } =
    useInfiniteQuery({
      queryKey: ["post-feed", "bookmarks"],
      queryFn: ({ pageParam }) =>
        kyInstance
          .get(
            "/api/posts/bookmarked",
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
        Come on, be decisive and save something, its not your relationship we
        are talking about
      </p>
    );

  if (status === "error")
    return (
      <p className="text-center text-destructive">
        An error occurred while loading bookmarks
      </p>
    );

  return (
    <InfiniteScrollContainer
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
      className="mt-10 flex flex-col gap-4"
    >
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
      {isFetching && <LoaderPinwheel className="mx-auto my-3 animate-spin" />}
    </InfiniteScrollContainer>
  );
}

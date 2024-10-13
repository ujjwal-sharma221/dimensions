"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { LoaderPinwheel } from "lucide-react";

import { PostsPageType } from "@/lib/types";
import { Post } from "@/components/post/post";
import kyInstance from "@/lib/ky";
import { InfiniteScrollContainer } from "@/components/infiniteScroll-container";
import { PostLoadingSkeleton } from "@/components/post/post-loading-skelton";

interface SearchResultsProps {
  query: string;
}

export function SearchResults({ query }: SearchResultsProps) {
  const { data, fetchNextPage, hasNextPage, isFetching, status } =
    useInfiniteQuery({
      queryKey: ["post-feed", "search", query],
      queryFn: ({ pageParam }) =>
        kyInstance
          .get("/api/search", {
            searchParams: {
              q: query,
              ...(pageParam ? { cursor: pageParam } : {}),
            },
          })
          .json<PostsPageType>(),
      initialPageParam: null as string | null,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      gcTime: 0,
    });

  const posts = data?.pages.flatMap((page) => page.posts) ?? [];

  if (status === "pending") return <PostLoadingSkeleton />;

  if (status === "success" && !posts.length && !hasNextPage)
    return (
      <p className="text-center text-muted-foreground">
        Nothing found for this search
      </p>
    );

  if (status === "error")
    return (
      <p className="text-center text-destructive">
        An error occurred while searching
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

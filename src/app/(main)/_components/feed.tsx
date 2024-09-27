"use client";

import { useQuery } from "@tanstack/react-query";
import { LoaderPinwheel } from "lucide-react";

import { PostDataType } from "@/lib/types";
import { Post } from "@/components/post/post";

export function Feed() {
  const query = useQuery<PostDataType[]>({
    queryKey: ["for-you", "post-feed"],
    queryFn: async () => {
      const res = await fetch("/api/posts/for-you");
      if (!res.ok)
        throw new Error(`Failed to fetch posts with status code ${res.status}`);

      return res.json();
    },
  });

  if (query.status === "pending")
    return <LoaderPinwheel className="mx-auto animate-spin" />;

  if (query.status === "error")
    return (
      <p className="text-center text-destructive">
        An error occurred while loading posts
      </p>
    );

  return (
    <>
      {query.data.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </>
  );
}

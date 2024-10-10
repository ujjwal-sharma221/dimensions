"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { LoaderPinwheel } from "lucide-react";

import { NotificationsPage } from "@/lib/types";
import kyInstance from "@/lib/ky";
import { InfiniteScrollContainer } from "@/components/infiniteScroll-container";
import { PostLoadingSkeleton } from "@/components/post/post-loading-skelton";
import { Notification } from "./notification";
import { useEffect } from "react";

export function NotificationFeed() {
  const { data, fetchNextPage, hasNextPage, isFetching, status } =
    useInfiniteQuery({
      queryKey: ["notifications"],
      queryFn: ({ pageParam }) =>
        kyInstance
          .get(
            "/api/notifications",
            pageParam ? { searchParams: { cursor: pageParam } } : {},
          )
          .json<NotificationsPage>(),
      initialPageParam: null as string | null,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: () => kyInstance.patch("/api/notifications/mark-read"),
    onSuccess: () => {
      queryClient.setQueryData(["unread-notification-count"], {
        unreadCount: 0,
      });
    },
    onError(error) {
      console.error(error);
    },
  });

  useEffect(() => {
    mutate();
  }, [mutate]);

  const notifications = data?.pages.flatMap((page) => page.notifications) ?? [];

  if (status === "pending") return <PostLoadingSkeleton />;

  if (status === "success" && !notifications.length && !hasNextPage)
    return (
      <p className="text-center text-muted-foreground">
        You don&apos;t have any notifications yet
      </p>
    );

  if (status === "error")
    return (
      <p className="text-center text-destructive">
        An error occurred while loading comments
      </p>
    );

  return (
    <InfiniteScrollContainer
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
      className="mt-10 flex flex-col gap-4"
    >
      {notifications.map((n) => (
        <Notification key={n.id} notification={n} />
      ))}
      {isFetching && <LoaderPinwheel className="mx-auto my-3 animate-spin" />}
    </InfiniteScrollContainer>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BellDot, BookMarked, House, MessageSquareDot } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { NotificationCountType, MessageInfoCount } from "@/lib/types";
import kyInstance from "@/lib/ky";

export const CommandBar = ({
  className,
  intialNotificationState,
  initialMessageState,
}: {
  className?: string;
  intialNotificationState: NotificationCountType;
  initialMessageState: MessageInfoCount;
}) => {
  const { data } = useQuery({
    queryKey: ["unread-notification-count"],
    queryFn: () =>
      kyInstance
        .get("/api/notifications/unread-count")
        .json<NotificationCountType>(),
    initialData: intialNotificationState,
    refetchInterval: 60 * 1000,
  });

  const { data: messageData } = useQuery({
    queryKey: ["unread-message-count"],
    queryFn: () =>
      kyInstance.get("/api/messages/unread-count").json<MessageInfoCount>(),
    initialData: initialMessageState,
    refetchInterval: 60 * 1000,
  });

  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <div className={className}>
      <Button onClick={() => setOpen(true)} variant="outline">
        Menu
        <kbd className="">
          <span className="text-xs">(Command/Control)</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="..." />
        <CommandList>
          <CommandEmpty>No Results</CommandEmpty>
          <CommandGroup heading="Menu Items">
            <CommandItem
              onSelect={() => {
                router.push("/main");
                setOpen(false);
              }}
            >
              <House className="mr-2" />
              <Link href="/">Home</Link>
            </CommandItem>

            <CommandItem
              onSelect={() => {
                router.push("/messages");
                setOpen(false);
              }}
            >
              <div className="relative">
                <MessageSquareDot />
                {!!messageData.unreadCount && (
                  <span className="absolute -right-1 -top-1 rounded-full bg-sky-600 px-1 text-xs font-medium tabular-nums text-white">
                    {messageData.unreadCount}
                  </span>
                )}
              </div>
              <span className="ml-2 hidden lg:inline">Messages</span>
            </CommandItem>

            <CommandItem
              onSelect={() => {
                router.push("/notifications");
                setOpen(false);
              }}
            >
              <div className="relative">
                <BellDot />
                {!!data.unreadCount && (
                  <span className="absolute -right-1 -top-1 rounded-full bg-red-600 px-1 text-xs font-medium tabular-nums text-white">
                    {data.unreadCount}
                  </span>
                )}
              </div>
              <span className="ml-2 hidden lg:inline">Notifications</span>
            </CommandItem>

            <CommandItem
              onSelect={() => {
                router.push("/bookmark");
                setOpen(false);
              }}
            >
              <BookMarked className="mr-2" />
              <Link href="/messages">Bookmarks</Link>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
};

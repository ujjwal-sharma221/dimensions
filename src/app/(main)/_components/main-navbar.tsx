import { UserButton } from "@/components/user-button";
import { CommandBar } from "./command-bar";
import { ToolbarDynamic } from "@/components/tool-bar";
import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/prisma";
import streamServerClient from "@/lib/stream";

export const MainNavbar = async () => {
  const { user } = await validateRequest();
  if (!user) return null;

  const [unreadNotifications, unreadMessagesCount] = await Promise.all([
    prisma.notification.count({
      where: { receipientId: user.id, read: false },
    }),
    (await streamServerClient.getUnreadCount(user.id)).total_unread_count,
  ]);

  return (
    <div className="sticky top-0 ml-6 flex h-16 w-full items-center justify-center gap-4 lg:ml-0">
      <UserButton />
      <CommandBar
        intialNotificationState={{ unreadCount: unreadNotifications }}
        className="hidden bg-transparent lg:block"
        initialMessageState={{ unreadCount: unreadMessagesCount }}
      />
      <ToolbarDynamic />
    </div>
  );
};

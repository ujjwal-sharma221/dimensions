import { MessageCircleHeart, MessageCircleMore, UserPlus } from "lucide-react";
import Link from "next/link";

import { NotificationDataType } from "@/lib/types";
import { NotificationType } from "@prisma/client";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/user-avatar";

interface NotificationProps {
  notification: NotificationDataType;
}

export function Notification({ notification }: NotificationProps) {
  const notificationTypeMap: Record<
    NotificationType,
    { message: string; icon: JSX.Element; href: string }
  > = {
    FOLLOW: {
      message: ` ${notification.issuer.displayName} followed you`,
      icon: <UserPlus className="size-7 text-primary text-sky-600" />,
      href: `/users/${notification.issuer.username}`,
    },
    COMMENT: {
      message: ` ${notification.issuer.displayName} commented on your post`,
      icon: <MessageCircleMore className="size-7 text-primary" />,
      href: `/posts/${notification.postId}`,
    },
    LIKE: {
      message: ` ${notification.issuer.displayName} liked you post`,
      icon: <MessageCircleHeart className="size-7 text-red-500" />,
      href: `/users/${notification.postId}`,
    },
  };

  const { message, icon, href } = notificationTypeMap[notification.type];

  return (
    <Link href={href} className="block">
      <article
        className={cn(
          "flex gap-3 rounded-2xl border-dashed bg-card p-5 shadow-sm transition-colors hover:border hover:bg-card/70",
          !notification.read && "bg-primary/10",
        )}
      >
        <div className="my-1">{icon}</div>
        <div className="space-y-3">
          <UserAvatar avatarUrl={notification.issuer.avatarUrl} size={36} />
          <div>
            <span className="font-bold">{notification.issuer.displayName}</span>{" "}
            <span>{message}</span>
          </div>
          {notification.post && (
            <div className="line-clamp-3 whitespace-pre-line text-muted-foreground">
              {notification.post.content}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}

import Link from "next/link";

import { UserToolTip } from "@/components/user-tooltip";
import { CommentDataType } from "@/lib/types";
import { UserAvatar } from "@/components/user-avatar";
import { formatDate } from "@/lib/utils";
import { useSession } from "@/lib/session-provider";
import { CommentMore } from "./comment-more";

interface CommentProps {
  comment: CommentDataType;
}

export function Comment({ comment }: CommentProps) {
  const { user } = useSession();
  return (
    <div className="group/comment flex gap-3 py-3">
      <span className="hidden sm:inline">
        <UserToolTip user={comment.user}>
          <Link href={`/users/${comment.user.username}`}>
            <UserAvatar avatarUrl={comment.user.avatarUrl} size={40} />
          </Link>
        </UserToolTip>
      </span>
      <div>
        <div className="flex items-center gap-1 text-sm">
          <UserToolTip user={comment.user}>
            <Link
              href={`/users/${comment.user.username}`}
              className="font-medium hover:underline"
            >
              {comment.user.displayName}
            </Link>
          </UserToolTip>
          <span className="text-muted-foreground">
            {formatDate(comment.createdAt)}
          </span>
        </div>
        <div>{comment.content}</div>
      </div>
      {comment.user.id === user.id && (
        <CommentMore
          comment={comment}
          className="ms-auto opacity-0 transition-opacity group-hover/comment:opacity-100"
        />
      )}
    </div>
  );
}

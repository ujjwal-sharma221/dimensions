"use client";

import { PostDataType } from "@/lib/types";
import { MessageCircle } from "lucide-react";

interface CommentButtonProps {
  post: PostDataType;
  onClick: () => void;
}

export function CommentButton({ post, onClick }: CommentButtonProps) {
  return (
    <button onClick={onClick} className="flex items-center gap-2">
      <MessageCircle className="size-5" />
      <span className="text-sm font-medium tabular-nums">
        {post._count.comments}
        <span className="hidden sm:inline"> Comments</span>
      </span>
    </button>
  );
}

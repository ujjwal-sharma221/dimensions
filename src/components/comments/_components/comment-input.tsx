import { useState } from "react";
import { LoaderPinwheel, SendHorizonal } from "lucide-react";

import { PostDataType } from "@/lib/types";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSubmitCommentMutation } from "../comments-mutations";

interface CommentInputProps {
  post: PostDataType;
}

export function CommentInput({ post }: CommentInputProps) {
  const [input, setInput] = useState("");
  const mutation = useSubmitCommentMutation(post.id);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!input) return;

    mutation.mutate(
      { post, content: input },
      { onSuccess: () => setInput("") },
    );
  }

  return (
    <form className="flex w-full items-center gap-2" onSubmit={onSubmit}>
      <Input
        placeholder="Write a comment..."
        className="rounded-2xl border-black"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        autoFocus
      />
      <Button
        type="submit"
        variant="ghost"
        size="icon"
        disabled={!input.trim() || mutation.isPending}
      >
        {!mutation.isPending ? (
          <SendHorizonal />
        ) : (
          <LoaderPinwheel className="animate-spin" />
        )}
      </Button>
    </form>
  );
}

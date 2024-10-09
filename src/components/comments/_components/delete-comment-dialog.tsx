import { LoadingButton } from "@/components/loading-button";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CommentDataType } from "@/lib/types";
import { useDeleteCommentMutation } from "../comments-mutations";

interface DeleteCommentDialogProps {
  comment: CommentDataType;
  open: boolean;
  onClose: () => void;
}

export function DeleteCommentDialog({
  comment,
  open,
  onClose,
}: DeleteCommentDialogProps) {
  const mutation = useDeleteCommentMutation();
  function handleOpenChange(open: boolean) {
    if (!open || !mutation.isPending) {
      onClose();
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Delete Comment?</DialogTitle>
          <DialogDescription>
            This action is irreversible, you sure you want to delete this post?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <LoadingButton
            onClick={() => mutation.mutate(comment.id, { onSuccess: onClose })}
            loading={mutation.isPending}
            variant="destructive"
          >
            Delete
          </LoadingButton>
          <Button
            onClick={onClose}
            variant="secondary"
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

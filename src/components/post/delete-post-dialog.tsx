import { PostDataType } from "@/lib/types";
import { useDeletePostMutation } from "./editor/delete-mutations";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { LoadingButton } from "../loading-button";
import { Button } from "../ui/button";

interface DeletePostDialogProps {
  open: boolean;
  post: PostDataType;
  onClose: () => void;
}

export const DeletePostDialog = ({
  open,
  post,
  onClose,
}: DeletePostDialogProps) => {
  const mutation = useDeletePostMutation();
  function handleOpenChange(open: boolean) {
    if (!open || !mutation.isPending) {
      onClose();
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Delete Post?</DialogTitle>
          <DialogDescription>
            This action is irreversible, you sure you want to delete this post?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <LoadingButton
            onClick={() => mutation.mutate(post.id, { onSuccess: onClose })}
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
};

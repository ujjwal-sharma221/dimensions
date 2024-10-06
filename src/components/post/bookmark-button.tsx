import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { Bookmark } from "lucide-react";

import { BookmarkInfoType } from "@/lib/types";
import kyInstance from "@/lib/ky";
import { cn } from "@/lib/utils";

interface BookmarkButtonProps {
  postId: string;
  intialState: BookmarkInfoType;
}

export function BookmarkButton({ postId, intialState }: BookmarkButtonProps) {
  const queryClient = useQueryClient();
  const queryKey: QueryKey = ["bookmark-info", postId];

  const { data } = useQuery({
    queryKey: queryKey,
    queryFn: () =>
      kyInstance.get(`/api/posts/${postId}/bookmarks`).json<BookmarkInfoType>(),
    initialData: intialState,
    staleTime: Infinity,
  });

  const { mutate } = useMutation({
    mutationFn: () =>
      data.isBookmarkedByUser
        ? kyInstance.delete(`/api/posts/${postId}/bookmarks`)
        : kyInstance.post(`/api/posts/${postId}/bookmarks`),
    onMutate: async () => {
      toast.message(`Post ${data.isBookmarkedByUser ? "un" : ""}bookmarked`);
      await queryClient.cancelQueries({ queryKey });
      const prevState = queryClient.getQueryData<BookmarkInfoType>(queryKey);
      queryClient.setQueryData<BookmarkInfoType>(queryKey, () => ({
        isBookmarkedByUser: !prevState?.isBookmarkedByUser,
      }));

      return { prevState };
    },
    onError(error, variables, context) {
      queryClient.setQueryData(queryKey, context?.prevState);
      console.error(error);
      toast.error("Something went wrong");
    },
  });

  return (
    <button onClick={() => mutate()} className="flex items-center gap-2">
      <Bookmark
        className={cn(
          "size-5",
          data.isBookmarkedByUser && "fill-primary text-primary",
        )}
      />
      <span className="text-sm font-medium tabular-nums">
        {data.isBookmarkedByUser} <span className="hidden sm:inline"></span>
      </span>
    </button>
  );
}

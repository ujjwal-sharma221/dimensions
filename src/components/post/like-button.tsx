import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { Heart } from "lucide-react";

import { LikeInfo } from "@/lib/types";
import kyInstance from "@/lib/ky";
import { cn } from "@/lib/utils";

interface LikeButtonProps {
  postId: string;
  intialState: LikeInfo;
}

export function LikeButton({ postId, intialState }: LikeButtonProps) {
  const queryClient = useQueryClient();
  const queryKey: QueryKey = ["like-info", postId];

  const { data } = useQuery({
    queryKey: queryKey,
    queryFn: () =>
      kyInstance.get(`/api/posts/${postId}/likes`).json<LikeInfo>(),
    initialData: intialState,
    staleTime: Infinity,
  });

  const { mutate } = useMutation({
    mutationFn: () =>
      data.isLikedByUser
        ? kyInstance.delete(`/api/posts/${postId}/likes`)
        : kyInstance.post(`/api/posts/${postId}/likes`),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });
      const prevState = queryClient.getQueryData<LikeInfo>(queryKey);
      queryClient.setQueryData<LikeInfo>(queryKey, () => ({
        likes: (prevState?.likes || 0) + (prevState?.isLikedByUser ? -1 : 1),
        isLikedByUser: !prevState?.isLikedByUser,
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
      <Heart
        className={cn(
          "size-5",
          data.isLikedByUser && "fill-red-500 text-red-500",
        )}
      />
      <span className="text-sm font-medium tabular-nums">
        {data.likes} <span className="hidden sm:inline">likes</span>
      </span>
    </button>
  );
}

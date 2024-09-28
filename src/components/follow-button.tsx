"use client";

import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useFollowerInfo } from "@/hooks/user-follower-info";
import { FollowerInfoType } from "@/lib/types";
import { Button } from "./ui/button";
import kyInstance from "@/lib/ky";

interface FollowButtonProps {
  userId: string;
  intialState: FollowerInfoType;
}

export const FollowButton = ({ userId, intialState }: FollowButtonProps) => {
  const queryClient = useQueryClient();
  const { data } = useFollowerInfo(userId, intialState);

  const queryKey: QueryKey = ["follower-info", userId];

  const { mutate } = useMutation({
    mutationFn: () =>
      data.isFollowedByUser
        ? kyInstance.delete(`/api/users/${userId}/followers`)
        : kyInstance.post(`/api/users/${userId}/followers`),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });

      const prevState = queryClient.getQueryData<FollowerInfoType>(queryKey);
      queryClient.setQueryData<FollowerInfoType>(queryKey, () => ({
        followers:
          (prevState?.followers || 0) + (prevState?.isFollowedByUser ? -1 : 1),
        isFollowedByUser: !prevState?.isFollowedByUser,
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
    <Button
      onClick={() => mutate()}
      variant={data.isFollowedByUser ? "secondary" : "default"}
    >
      {data.isFollowedByUser ? "Unfollow" : "Follow"}
    </Button>
  );
};

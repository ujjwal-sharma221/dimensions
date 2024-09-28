import { useQuery } from "@tanstack/react-query";

import { FollowerInfoType } from "@/lib/types";
import kyInstance from "@/lib/ky";

export const useFollowerInfo = (
  userId: string,
  intialState: FollowerInfoType,
) => {
  const query = useQuery({
    queryKey: ["follower-info", userId],
    queryFn: () =>
      kyInstance.get(`/api/users/${userId}/followers`).json<FollowerInfoType>(),
    initialData: intialState,
    staleTime: Infinity,
  });

  return query;
};

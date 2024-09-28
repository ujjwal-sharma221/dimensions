"use client";

import { useFollowerInfo } from "@/hooks/user-follower-info";
import { FollowerInfoType } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

interface FollwerCountProps {
  userId: string;
  intialState: FollowerInfoType;
}

export function FollowerCount({ userId, intialState }: FollwerCountProps) {
  const { data } = useFollowerInfo(userId, intialState);

  return (
    <span>
      Followers:{" "}
      <span className="font-semibold">{formatNumber(data.followers)}</span>
    </span>
  );
}

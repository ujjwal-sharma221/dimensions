"use client";

import { useQuery } from "@tanstack/react-query";
import { HTTPError } from "ky";
import Link from "next/link";

import kyInstance from "@/lib/ky";
import { UserDataType } from "@/lib/types";
import { UserToolTip } from "./user-tooltip";

interface UserLinkTooltipProps extends React.PropsWithChildren {
  username: string;
}

export const UserLinkTooltip = ({
  children,
  username,
}: UserLinkTooltipProps) => {
  const { data } = useQuery({
    queryKey: ["user-data", username],
    queryFn: () =>
      kyInstance.get(`/api/users/username/${username}`).json<UserDataType>(),
    retry(failureCount, error) {
      if (error instanceof HTTPError && error.response.status === 404)
        return false;

      return failureCount < 3;
    },
    staleTime: Infinity,
  });

  if (!data)
    return (
      <Link href={`/users/${username}`} className="hover:underline">
        {children}
      </Link>
    );

  return (
    <UserToolTip user={data}>
      <Link
        href={`/users/${username}`}
        className="text-[#EF5A6F] hover:underline"
      >
        {children}
      </Link>
    </UserToolTip>
  );
};

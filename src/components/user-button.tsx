"use client";

import Link from "next/link";
import { TentTree, UserRound } from "lucide-react";

import { useSession } from "@/lib/session-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { UserAvatar } from "./user-avatar";
import { logout } from "@/app/(auth)/actions/logout.action";
import { cn } from "@/lib/utils";

interface UserButtonProps {
  className?: string;
}

export const UserButton = ({ className }: UserButtonProps) => {
  const { user } = useSession();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={cn("flex-none rounded-full", className)}>
          <UserAvatar avatarUrl={user.avatarUrl} size={40} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Logged in as @{user.username}</DropdownMenuLabel>
        <DropdownMenuSeparator></DropdownMenuSeparator>
        <Link href={`/users/${user.username}`}>
          <DropdownMenuItem>
            {" "}
            <UserRound className="mr-2 size-4" /> Profile
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator></DropdownMenuSeparator>
        <DropdownMenuItem
          className="coursor-pointer"
          onClick={() => {
            logout();
          }}
        >
          <TentTree className="mr-2 size-4" /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

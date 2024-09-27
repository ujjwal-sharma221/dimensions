import Image from "next/image";

import placeholderImage from "@/assets/user-placeholder.webp";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  className?: string;
  avatarUrl: string | null | undefined;
  size?: number;
}

export const UserAvatar = ({ className, avatarUrl, size }: UserAvatarProps) => {
  return (
    <Image
      src={avatarUrl || placeholderImage}
      alt="User Avatar"
      width={size ?? 48}
      height={size ?? 48}
      className={cn(
        "aspect-square h-fit flex-none rounded-full bg-secondary object-cover",
        className,
      )}
    />
  );
};

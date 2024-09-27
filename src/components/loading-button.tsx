import { LoaderPinwheel } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "./ui/button";

interface LoadingButtonProps extends ButtonProps {
  loading: boolean;
}

export const LoadingButton = ({
  loading,
  disabled,
  className,
  ...props
}: LoadingButtonProps) => {
  return (
    <Button
      disabled={loading || disabled}
      className={cn("flex items-center gap-2", className)}
      {...props}
    >
      {loading && <LoaderPinwheel className="size-5 animate-spin" />}
      {props.children}
    </Button>
  );
};

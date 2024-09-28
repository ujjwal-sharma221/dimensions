import { UserButton } from "@/components/user-button";
import { CommandBar } from "./command-bar";
import { ToolbarDynamic } from "@/components/tool-bar";

export const MainNavbar = () => {
  return (
    <div className="sticky top-0 ml-6 flex h-16 w-full items-center justify-center gap-4 lg:ml-0">
      <UserButton />
      <CommandBar className="hidden bg-transparent lg:block" />
      <ToolbarDynamic />
    </div>
  );
};

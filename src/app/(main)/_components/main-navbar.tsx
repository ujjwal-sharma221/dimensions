import { UserButton } from "@/components/user-button";
import { CommandBar } from "./command-bar";
import { ToolbarDynamic } from "@/components/tool-bar";
import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const MainNavbar = async () => {
  const { user } = await validateRequest();
  if (!user) return null;

  const unreadNotifications = await prisma.notification.count({
    where: { receipientId: user.id, read: false },
  });

  return (
    <div className="sticky top-0 ml-6 flex h-16 w-full items-center justify-center gap-4 lg:ml-0">
      <UserButton />
      <CommandBar
        intialState={{ unreadCount: unreadNotifications }}
        className="hidden bg-transparent lg:block"
      />
      <ToolbarDynamic />
    </div>
  );
};

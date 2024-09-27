import { redirect } from "next/navigation";

import { validateRequest } from "@/lib/auth";
import SessionProvider from "@/lib/session-provider";
import { MainNavbar } from "./_components/main-navbar";
import MenuBar from "./_components/menu-bar";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await validateRequest();
  if (!session.user) redirect("/");

  return (
    <SessionProvider value={session}>
      <div className="flex min-h-screen flex-col">
        <MainNavbar />
        <div className="mx-auto flex w-full max-w-7xl grow gap-5">
          {children}
        </div>
        <MenuBar className="sticky bottom-0 flex w-full justify-center gap-5 border-t bg-card p-3 lg:hidden" />
      </div>
    </SessionProvider>
  );
}

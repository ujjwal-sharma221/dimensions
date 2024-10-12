"use client";

import { LoaderPinwheel } from "lucide-react";
import { Chat as StreamChat } from "stream-chat-react";
import { useState } from "react";

import { useIntialiseChatClient } from "@/hooks/useInitialiseChatClient";
import { ChatSidebar } from "./chat-sidebar";
import { ChatChannel } from "./chat-channel";

export function Chat() {
  const chatClient = useIntialiseChatClient();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!chatClient)
    return <LoaderPinwheel className="mx-auto my-3 animate-spin" />;

  return (
    <main className="relative w-full overflow-hidden rounded-2xl bg-zinc-100">
      <div className="absolute bottom-0 top-0 flex w-full">
        <StreamChat client={chatClient}>
          <ChatSidebar
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
          <ChatChannel
            open={!sidebarOpen}
            openSidebar={() => setSidebarOpen(true)}
          />
        </StreamChat>
      </div>
    </main>
  );
}

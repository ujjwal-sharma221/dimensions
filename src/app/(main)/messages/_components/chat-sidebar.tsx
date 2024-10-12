import {
  ChannelList,
  ChannelPreviewMessenger,
  ChannelPreviewUIComponentProps,
} from "stream-chat-react";
import { MessageSquarePlus, SquareX } from "lucide-react";
import { useCallback, useState } from "react";

import { useSession } from "@/lib/session-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NewChatDialog } from "./new-chat-dialog";

interface ChatSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function ChatSidebar({ open, onClose }: ChatSidebarProps) {
  const { user } = useSession();

  const ChannelPreviewCustom = useCallback(
    (props: ChannelPreviewUIComponentProps) => {
      return (
        <ChannelPreviewMessenger
          {...props}
          onSelect={() => {
            props.setActiveChannel?.(props.channel, props.watchers);
            onClose();
          }}
        />
      );
    },
    [onClose],
  );

  return (
    <div
      className={cn(
        "size-full flex-col border-e md:flex md:w-72",
        open ? "flex" : "hidden",
      )}
    >
      <MenuHeader onClose={onClose} />
      <ChannelList
        filters={{
          type: "messaging",
          members: { $in: [user.id] },
        }}
        showChannelSearch
        options={{ state: true, presence: true, limit: 8 }}
        sort={{ last_message_at: -1 }}
        additionalChannelSearchProps={{
          searchForChannels: true,
          searchQueryParams: {
            channelFilters: {
              filters: { members: { $in: [user.id] } },
            },
          },
        }}
        Preview={ChannelPreviewCustom}
      ></ChannelList>
    </div>
  );
}

interface MenuHeaderProps {
  onClose: () => void;
}

function MenuHeader({ onClose }: MenuHeaderProps) {
  const [showChatDialog, setShowChatDialog] = useState(false);
  return (
    <>
      <div className="flex items-center gap-3 p-2">
        <div className="h-full md:hidden">
          <Button size="icon" variant="ghost" onClick={onClose}>
            <SquareX className="size-5" />
          </Button>
        </div>
        <h1 className="me-auto text-xl font-semibold md:ms-2">Messages</h1>
        <Button
          size="icon"
          variant="ghost"
          title="Start new Chat"
          onClick={() => setShowChatDialog(true)}
        >
          <MessageSquarePlus className="size-5" />
        </Button>
      </div>
      {showChatDialog ? (
        <NewChatDialog
          onOpenChange={setShowChatDialog}
          onChatCreated={() => {
            setShowChatDialog(false);
            onClose();
          }}
        />
      ) : null}
    </>
  );
}

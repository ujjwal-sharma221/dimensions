import { Metadata } from "next";

import { Chat } from "./_components/chat";

export const metadata: Metadata = {
  title: "Messages",
};

const MessagesPage = () => {
  return <Chat></Chat>;
};

export default MessagesPage;

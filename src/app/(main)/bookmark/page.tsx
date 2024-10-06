import { Metadata } from "next";

import { BookmarkFeed } from "./bookmark-feed";

export const metadata: Metadata = {
  title: "Bookmarks",
};

const BookmarksPage = () => {
  return (
    <main className="mt-10 flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <div className="rounded-2xl bg-zinc-800 p-5 text-white shadow-sm">
          <h1 className="text-center text-2xl font-bold">Bookmarks</h1>
        </div>
        <BookmarkFeed />
      </div>
    </main>
  );
};

export default BookmarksPage;

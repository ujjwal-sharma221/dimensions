import { TrendsSidebar } from "@/components/people-sidebar";
import PostEditor from "@/components/post/editor/post-editor";
import { PeopleSidebar } from "@/components/trends-sidebar";
import { Feed } from "../_components/feed";

const MainPage = () => {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <PeopleSidebar />
      <div className="w-full min-w-0 space-y-5">
        <PostEditor />
        <Feed />
      </div>
      <TrendsSidebar />
    </main>
  );
};
export default MainPage;

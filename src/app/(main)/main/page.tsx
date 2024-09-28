import { TrendsSidebar } from "@/components/people-sidebar";
import PostEditor from "@/components/post/editor/post-editor";
import { PeopleSidebar } from "@/components/trends-sidebar";
import { Feed } from "../_components/feed";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FollwingFeed } from "../_components/following-feed";

const MainPage = () => {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <PeopleSidebar />
      <div className="w-full min-w-0 space-y-5">
        <PostEditor />
        <Tabs defaultValue="for-you">
          <TabsList>
            <TabsTrigger value="for-you">For You</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
          </TabsList>

          <TabsContent value="for-you">
            <Feed />
          </TabsContent>
          <TabsContent value="following">
            <FollwingFeed />
          </TabsContent>
        </Tabs>
      </div>
      <TrendsSidebar />
    </main>
  );
};
export default MainPage;

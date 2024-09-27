import { TrendsSidebar } from "@/components/people-sidebar";
import PostEditor from "@/components/post/editor/post-editor";
import { Post } from "@/components/post/post";
import { PeopleSidebar } from "@/components/trends-sidebar";
import prisma from "@/lib/prisma";
import { PostDataInclude } from "@/lib/types";

const MainPage = async () => {
  const posts = await prisma.post.findMany({
    include: PostDataInclude,
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="flex w-full min-w-0 gap-5">
      <PeopleSidebar />
      <div className="w-full min-w-0 space-y-5">
        <PostEditor />
        {posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>
      <TrendsSidebar />
    </main>
  );
};
export default MainPage;

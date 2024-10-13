import { NextRequest } from "next/server";

import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getPostDataInlcuded, PostsPageType } from "@/lib/types";

export async function GET(req: NextRequest) {
  try {
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;
    const q = req.nextUrl.searchParams.get("q") || "";

    const pageSize = 10;

    const searchQuery = q.split(" ").join(" & ");

    const { user } = await validateRequest();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const posts = await prisma.post.findMany({
      where: {
        OR: [
          {
            content: {
              search: searchQuery,
            },
          },
          {
            user: {
              displayName: {
                search: searchQuery,
              },
            },
          },
          {
            user: {
              username: {
                search: searchQuery,
              },
            },
          },
        ],
      },
      include: getPostDataInlcuded(user.id),
      orderBy: { createdAt: "desc" },
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
    });

    const nextCursor = posts.length > pageSize ? posts[pageSize].id : null;
    const data: PostsPageType = {
      posts: posts.slice(0, pageSize),
      nextCursor,
    };

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

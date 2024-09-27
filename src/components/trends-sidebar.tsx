import { Satellite } from "lucide-react";
import { Suspense } from "react";
import { unstable_cache } from "next/cache";
import Link from "next/link";

import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Separator } from "./ui/separator";
import { formatNumber } from "@/lib/utils";

export function PeopleSidebar() {
  return (
    <div className="spacey-y-5 top-0 hidden h-fit w-72 flex-none md:block lg:w-80">
      <Suspense fallback={<Satellite className="mx-auto animate-pulse" />}>
        <TrendingTopics />
      </Suspense>
    </div>
  );
}

const getTrendingTopics = unstable_cache(
  async () => {
    const result = await prisma.$queryRaw<{ hashtag: string; count: bigint }[]>`
            SELECT LOWER(unnest(regexp_matches(content, '#[[:alnum:]_]+', 'g'))) AS hashtag, COUNT(*) AS count
            FROM posts
            GROUP BY (hashtag)
            ORDER BY count DESC, hashtag ASC
            LIMIT 5
        `;

    return result.map((row) => ({
      hashtag: row.hashtag,
      count: Number(row.count),
    }));
  },
  ["trending_topics"],
  {
    revalidate: 3 * 60 * 60,
  },
);

async function TrendingTopics() {
  const { user } = await validateRequest();
  if (!user) return;
  const trendingTopics = await getTrendingTopics();
  return (
    <div className="space-y-5 rounded-xl border-2 border-zinc-500 p-5 text-[#4A4947]">
      <div className="text-xl font-bold">Trending Topics</div>
      <Separator />
      {trendingTopics.map(({ hashtag, count }) => {
        const title = hashtag.split("#")[1];

        return (
          <Link key={title} href={`/hashtag/${title}`} className="block">
            <p
              className="line-clamp-1 break-all font-semibold hover:underline"
              title={hashtag}
            >
              {hashtag}
            </p>
            <p className="text-sm text-muted-foreground">
              {formatNumber(count)} {count === 1 ? "post" : "posts"}
            </p>
          </Link>
        );
      })}
    </div>
  );
}

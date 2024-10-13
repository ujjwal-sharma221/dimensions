import { Metadata } from "next";
import { SearchResults } from "./search-results";

interface SearchPageProps {
  searchParams: { q: string };
}

export function generateMetadata({
  searchParams: { q },
}: SearchPageProps): Metadata {
  return { title: `Search  results  for "${q}"` };
}

const SearchPage = ({ searchParams: { q } }: SearchPageProps) => {
  return (
    <main className="mt-10 flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <div className="rounded-2xl bg-zinc-800 p-5 text-white shadow-sm">
          <h1 className="line-clamp-2 break-all text-center text-2xl font-bold">
            Search Results for &quot;{q}&quot;
          </h1>
        </div>
        <SearchResults query={q} />
      </div>
    </main>
  );
};

export default SearchPage;

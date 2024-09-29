import Link from "next/link";
import { LinkIt, LinkItUrl } from "react-linkify-it";
import { UserLinkTooltip } from "./user-link-tooltip";

interface LinkifyProps {
  children: React.ReactNode;
}

export function Linkify({ children }: LinkifyProps) {
  return (
    <div>
      <LinkifyUsername>
        <LinkifyHashtags>
          <LinkifyUrl>{children}</LinkifyUrl>
        </LinkifyHashtags>
      </LinkifyUsername>
    </div>
  );
}

function LinkifyUrl({ children }: LinkifyProps) {
  return (
    <LinkItUrl className="font-semibold text-[#EF5A6F] hover:underline">
      {children}
    </LinkItUrl>
  );
}

function LinkifyUsername({ children }: LinkifyProps) {
  return (
    <LinkIt
      regex={/(@[a-zA-Z0-9_-]+)/}
      component={(match, key) => {
        const username = match.slice(1);
        return (
          <UserLinkTooltip key={key} username={username}>
            {match}
          </UserLinkTooltip>
        );
      }}
    >
      {children}
    </LinkIt>
  );
}

function LinkifyHashtags({ children }: LinkifyProps) {
  return (
    <LinkIt
      regex={/(#[a-zA-Z0-9]+)/}
      component={(match, key) => (
        <Link
          key={key}
          href={`/hashtag/${match.slice(1)}`}
          className="font-semibold text-[#EF5A6F] hover:underline"
        >
          {match}
        </Link>
      )}
    >
      {children}
    </LinkIt>
  );
}

import Link from "next/link";

interface HeaderTextProps {
  firstHeading: string;
  secondHeading: string;
  href: string;
  link: string;
}

export const HeaderText = ({
  firstHeading,
  secondHeading,
  href,
  link,
}: HeaderTextProps) => {
  return (
    <div className="">
      <div className="">
        <div>{firstHeading}</div>
        <div>
          {secondHeading}
          <span className="ml-1">
            <Link
              href={href}
              className="font-semibold capitalize hover:underline"
            >
              {link}
            </Link>
          </span>
        </div>
      </div>
      <div className="mt-8 border-[0.2px] border-dashed border-black"></div>
    </div>
  );
};

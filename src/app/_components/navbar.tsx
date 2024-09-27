import Link from "next/link";

export const Navbar = () => {
  return (
    <nav className="fixed top-0 flex h-16 w-full items-center justify-between bg-transparent px-2">
      <Link href="/">(Main)</Link>
      <div className="flex items-center gap-2">
        <Link href="/login">(Login)</Link>/<Link href="/signup">(SignUp)</Link>
      </div>
    </nav>
  );
};

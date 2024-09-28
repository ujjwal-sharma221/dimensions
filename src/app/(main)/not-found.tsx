import { TowerControl } from "lucide-react";

export default function NotFound() {
  return (
    <main className="mt-12 flex h-full w-full flex-col items-center justify-center space-y-3 text-center">
      <h1 className="text-3xl font-bold">Not Found</h1>
      <p className="">The page you are looking for does not exist! </p>
      <TowerControl />
    </main>
  );
}

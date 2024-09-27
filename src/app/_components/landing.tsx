import { GridLayout } from "./grid";

export const Landing = () => {
  return (
    <div>
      <div className="flex h-screen items-center justify-center">
        <div className="gradeint-text animate-gradeint bg-clip-text text-center text-7xl font-bold text-transparent lg:text-8xl">
          Dimensions
        </div>
      </div>
      <GridLayout />
    </div>
  );
};

import Image from "next/image";

import heroImage from "@/assets/hero-image.webp";

export const GridLayout = () => {
  return (
    <div className="-mt-16 flex h-full w-full items-center justify-center">
      <div className="grid h-full w-full grid-cols-1 grid-rows-3 gap-4 rounded-lg p-2 shadow-md sm:grid-cols-2 md:grid-cols-4">
        <div className="col-span-1 row-span-1 flex items-center justify-center rounded-lg p-2 text-3xl font-semibold shadow-md sm:row-span-2">
          <p className="inline-block bg-gradient-to-r from-zinc-500 via-stone-600 to-zinc-900 bg-clip-text text-transparent">
            Because nothing says &apos;clean code&apos; like 280 characters of
            unsolicited advice.
          </p>
        </div>

        <div className="col-span-1 row-span-1 flex items-center justify-center rounded-lg shadow-md sm:col-span-2 sm:row-span-2 md:col-span-3">
          <video controls autoPlay loop muted preload="none">
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>
        </div>

        <div className="col-span-1 row-span-1 flex items-center justify-center rounded-lg bg-black p-2 text-2xl font-semibold text-white shadow-md sm:col-span-2 sm:row-span-4 md:col-span-2">
          <p>
            &quot;Empowering developers to connect, collaborate, and share
            knowledge through concise insights and meaningful code, one line at
            a time.&quot;
          </p>
        </div>

        <div className="bg-tan-200 col-span-1 row-span-1 flex items-center justify-center rounded-lg shadow-md sm:col-span-2 sm:row-span-4 md:col-span-2">
          <Image
            src={heroImage}
            alt="logo"
            className="h-fit w-fit object-cover"
          />
        </div>
      </div>
    </div>
  );
};

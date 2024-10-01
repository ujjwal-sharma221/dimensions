import type { Metadata } from "next";
import { Toaster } from "sonner";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { fileRouter } from "./api/uploadthing/core";
import { extractRouterConfig } from "uploadthing/server";

import localFont from "next/font/local";
import "./globals.css";
import ReactQueryProvider from "@/lib/reactQuery-provider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: { template: "%s | Dimensions", default: "Dimensions" },
  description: "for nerds, by nerds",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} p-2 antialiased`}
      >
        <NextSSRPlugin routerConfig={extractRouterConfig(fileRouter)} />
        <ReactQueryProvider>
          {children}
          <Toaster closeButton richColors position="top-right" />
        </ReactQueryProvider>
      </body>
    </html>
  );
}

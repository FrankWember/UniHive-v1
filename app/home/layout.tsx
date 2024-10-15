import type { Metadata } from "next";
import { Suspense } from "react";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "Unihive | Home",
  description: "Digitally empowered campus life. Enjoy your university experience!",
};

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col justify-center items-center w-full h-screen">
      {children}
      <Suspense><Navbar /></Suspense>
    </div>
  );
}

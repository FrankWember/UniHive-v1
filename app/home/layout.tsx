import type { Metadata } from "next";
import { Suspense } from "react";
import { Navbar } from "@/components/navbar";
import { ConvexClientProvider } from "@/components/providers/convex-provider";
import { ModeProvider } from "@/contexts/mode-context";

export const metadata: Metadata = {
  title: "Home",
  description: "Digitally empowered campus life. Enjoy your university experience!",
};

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <ConvexClientProvider>
      <ModeProvider>
        <div className="flex flex-col justify-center items-center w-full h-screen">
          {children}
          <Suspense><Navbar /></Suspense>
        </div>
      </ModeProvider>
    </ConvexClientProvider>
  );
}

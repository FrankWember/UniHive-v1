import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider"


export const metadata: Metadata = {
  title: "Unihive | Authentication",
  description: "Digitally empowered campus life. Enjoy your university experience!",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
        {children}
    </div>
  );
}

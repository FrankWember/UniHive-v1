import type { Metadata } from "next";


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
    <div className="flex justify-center items-center w-full h-screen">
        {children}
    </div>
  );
}

import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider"
import { Analytics } from "@vercel/analytics/react"
import { SessionProvider } from "next-auth/react";
import { APP_URL } from "@/constants/paths";

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
  title: {
    default: "Unihive",
    template: "%s | unihive"
  },
  metadataBase: new URL(APP_URL),
  keywords: [
    "Unihive Marketplace", "Marketplace for University Students", "Student Marketplace", "Buy and Sell University Products", "Unihive", "University Services", "Student Services", "Campus Marketplace", "Unihive Platform", "Digital Marketplace for Students"
  ],
  openGraph: {
    title: "Unihive Marketplace",
    description: "A Platform for University Students to share their products and servcies",
    creators: ["@Unihive"],
    images: [`${APP_URL}/Unihive.png`],
    url: APP_URL,
    siteName: "Unihive",
    
  },
  twitter: {
    card: "summary_large_image",
    creator: "@Unihive",
    title: "Unihive Marketplace",
    site: APP_URL,
    description: "A Platform for University Students to share their products and servcies",
    images: [`${APP_URL}/Unihive.png`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <link
            rel="icon"
            href="/icon?<generated>"
            type="image/<generated>"
            sizes="<generated>"
          />
          <link
            rel="apple-touch-icon"
            href="/apple-icon?<generated>"
            type="image/<generated>"
            sizes="<generated>"
          />
          <link 
            rel="icon" 
            href="/favicon.ico" 
            sizes="32x32" 
            />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-background text-foreground selection:bg-red-200 selection:text-red-500 dark:selection:bg-red-900 dark:selection:text-red-500 w-screen h-screen`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Analytics />
          </ThemeProvider>
        </body>
      </html>
    </SessionProvider>
  );
}

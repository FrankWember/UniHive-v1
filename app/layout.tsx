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
    default: "DormBiz – Hustle Smarter on Campus",
    template: "%s | DormBiz"
  },
  metadataBase: new URL(APP_URL),
  description:
    "Get services from students on campus – tutoring, photography, tech support & more. DormBiz connects students with talents to those who need them. Now live at SIUE.",
  keywords: [
    "DormBiz", "DormBiz Marketplace", "Student Marketplace", "Campus Services", "University Side Hustle", "Freelance Student Work", "Peer-to-Peer Campus Platform", "Buy and Sell on Campus", "SIUE Student Services", "DormBiz SIUE"
  ],
  openGraph: {
    title: "DormBiz – Hustle Smarter on Campus",
    description:
      "DormBiz is a student-powered marketplace. Find or offer services like tutoring, tech support, and more – exclusively for college students. Launched at SIUE.",
    url: APP_URL,
    siteName: "DormBiz",
    images: [`${APP_URL}/DormBiz.png`],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DormBiz – Hustle Smarter on Campus",
    creator: "@dormbiz",
    description:
      "The marketplace for college students to offer & discover services – from tutoring to tech help. Exclusively for students. DormBiz is live at SIUE.",
    site: "https://www.instagram.com/dormbiz",
    images: [`${APP_URL}/DormBiz.png`],
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
  
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" sizes="180x180" href="/DormBiz.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/DormBiz.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/DormBiz.png" />
        <link rel="manifest" href="/site.webmanifest" />
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

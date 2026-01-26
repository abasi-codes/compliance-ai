import type { Metadata } from "next";
import { DM_Serif_Display, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { HeaderWrapper, MainContent } from "@/components/layout";

const dmSerifDisplay = DM_Serif_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Compliance AI - Enterprise Compliance Assessment",
  description: "AI-powered multi-framework compliance assessment platform for NIST CSF, ISO 27001, and SOC 2",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSerifDisplay.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable} antialiased bg-background min-h-screen font-sans`}
      >
        <HeaderWrapper />
        <MainContent>{children}</MainContent>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { DM_Serif_Display, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { HeaderWrapper, MainContent } from "@/components/layout";
import { AuthProvider } from "@/lib/auth";

const dmSerifDisplay = DM_Serif_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

const inter = Inter({
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
        className={`${dmSerifDisplay.variable} ${inter.variable} ${ibmPlexMono.variable} antialiased bg-background min-h-screen font-sans`}
      >
        <AuthProvider>
          <HeaderWrapper />
          <MainContent>{children}</MainContent>
        </AuthProvider>
      </body>
    </html>
  );
}

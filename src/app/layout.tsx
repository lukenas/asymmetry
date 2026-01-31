import type { Metadata } from "next";
import { Manrope, IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Asymmetry",
  description: "Insights on applied AI and product from builders in the trenches and those pushing the frontier.",
  icons: {
    icon: "/asym-dark-logo.png",
    apple: "/asym-dark-logo.png",
  },
  openGraph: {
    title: "Asymmetry",
    description: "Insights on applied AI and product from builders in the trenches and those pushing the frontier.",
    images: [
      {
        url: "/asym-dark-meta.png",
        width: 1200,
        height: 630,
        alt: "Asymmetry",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Asymmetry",
    description: "Insights on applied AI and product from builders in the trenches and those pushing the frontier.",
    images: ["/asym-dark-meta.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${manrope.variable} ${ibmPlexMono.variable} ${spaceGrotesk.variable} font-sans antialiased bg-asym-light dark:bg-asym-dark dark:text-asym-light`} suppressHydrationWarning>
        <Header />
        {children}
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";


//Geist() loads the Geist Sans font and stores it in a variable named geistSans.
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Geist_Mono() loads the Geist Mono font and stores it in a variable named geistMono.
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Load ITC Avant Garde Gothic Std fonts
const avantGardeMedium = localFont({
  src: "../public/font/ITC Avant Garde Gothic Std Medium.otf",
  variable: "--font-avant-garde-medium",
});

const avantGardeBook = localFont({
  src: "../public/font/ITC Avant Garde Gothic Std Book.otf",
  variable: "--font-avant-garde-book",
});


export const metadata: Metadata = {
  title: "Hop Art House",
  description: "Where human creativity lives and the people who value it come together.",
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#F7C41A",
};

//Destructure children from props, and the props must match the type Readonly<{ children: React.ReactNode }>.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${avantGardeMedium.variable} ${avantGardeBook.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}

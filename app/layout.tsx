import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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


export const metadata: Metadata = {
  title: "Hop Art House",
  description: "Where human creativity lives and the people who value it come together.",
};

//Destructure children from props, and the props must match the type Readonly<{ children: React.ReactNode }>.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}

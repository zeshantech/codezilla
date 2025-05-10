import "@/app/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "@/app/provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CodeZilla",
  description: "Practice programming problems",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <main className="min-h-screen">{children}</main>
        </Providers>
      </body>
    </html>
  );
}

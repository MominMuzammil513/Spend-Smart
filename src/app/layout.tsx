import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Providers from "./Provider";
import NavBar from "./components/Navbar";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "finance tracker",
  description: "Now tracking the daily personal finance made easy",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {/* Red background div */}
          {/* <div className="fixed bg-red-500 inset-0 z-40"></div> */}

          {/* Green background div */}
          {/* <div className="flex w-full max-w-md items-center space-x-2 px-3 fixed top-0 left-0 right-0 mx-auto backdrop-blur-sm bg-white/40 dark:bg-zinc-800/65 rounded-b-lg shadow-lg border border-white p-6 z-50"></div> */}

          <NavBar />
          <Toaster />
          {children}
        </Providers>
      </body>
    </html>
  );
}

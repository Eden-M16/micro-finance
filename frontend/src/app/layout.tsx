import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Web3Provider } from "@/lib/Web3Context";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EthioLend | Decentralized Microfinance",
  description: "A decentralized microfinance platform for Ethiopia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">      {/* ← MUST HAVE */}
      <body className={inter.className}>   {/* ← MUST HAVE */}
        <Web3Provider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">{children}</main>
          </div>
        </Web3Provider>
      </body>
    </html>
  );
}
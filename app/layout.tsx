import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "Todo App",
  description: "Lista zadań zbudowana w Next.js",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <body className="min-h-screen bg-gray-950">
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}

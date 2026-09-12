import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CompareBar from "@/components/CompareBar";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Specrix — Rekomendasi & Perbandingan HP dan Laptop",
    template: "%s | Specrix",
  },
  description:
    "Temukan dan bandingkan spesifikasi HP & laptop sesuai budget kamu. Database lengkap, akurat, dan mudah dibandingkan.",
  keywords: ["HP", "laptop", "spesifikasi", "perbandingan", "rekomendasi", "beli hp", "beli laptop"],
  openGraph: {
    siteName: "Specrix",
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={`${geist.className} bg-gray-950 text-gray-100 antialiased`}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <CompareBar />
        <Footer />
      </body>
    </html>
  );
}

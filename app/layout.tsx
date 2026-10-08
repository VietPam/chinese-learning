import type { Metadata, Viewport } from "next";
import "./globals.css";
import localFont from "next/font/local";

const quicksand = localFont({
  src: "./fonts/quicksand-variable.ttf",
  variable: "--font-quicksand",
  display: "swap",
  weight: "300 700",
});

export const metadata: Metadata = {
  title: "Pinyin mỗi ngày",
  description: "Học Pinyin qua những câu nhắn tin quen thuộc mỗi ngày.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" className={`${quicksand.variable} font-sans`}>
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: {
    default: "Highway Express | हाइवे एक्सप्रेस",
    template: "%s | Highway Express",
  },
  description:
    "Highway Express - दाङ, नेपालको विश्वसनीय डिजिटल समाचार पोर्टल। स्थानीय, राष्ट्रिय र अन्तर्राष्ट्रिय समाचार।",
  keywords: [
    "दाङ समाचार",
    "नेपाल समाचार",
    "Highway Express",
    "Dang news",
    "Nepal news",
    "KP Ghimire",
  ],
  openGraph: {
    siteName: "Highway Express",
    locale: "ne_NP",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ne" className="h-full">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-gray-50 antialiased">
        <Header />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

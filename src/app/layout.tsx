import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mahmutbey Yıldız Anaokulu | Geleceğin Parlayan Yıldızları",
  description: "Mahmutbey Yıldız Anaokulu olarak sevgi, ilgi ve değerlerimizle modern eğitim binamızda 2-6 yaş arası çocuklarımıza eğitim veriyoruz.",
  keywords: ["Mahmutbey Anaokulu", "Yıldız Anaokulu", "Bağcılar Okul Öncesi", "Kreş", "Robotik Kodlama", "MEB Müfredatı"],
  openGraph: {
    title: "Mahmutbey Yıldız Anaokulu",
    description: "Değerlerle büyüyen, bilimle gelişen, sevgiyle öğrenen bir nesil için buradayız.",
    locale: "tr_TR",
    type: "website",
  },
  other: {
    "Cache-Control": "no-cache, no-store, must-revalidate",
    "Pragma": "no-cache",
    "Expires": "0",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`scroll-smooth ${nunito.variable}`}>
      <body className={`antialiased text-slate-800 bg-slate-50 selection:bg-amber-200 selection:text-amber-900 ${nunito.className}`}>
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Noto_Sans_KR, Sora } from "next/font/google";
import "./globals.css";

const notoSansKR = Noto_Sans_KR({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const sora = Sora({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Crypto Tax Saver - 가상자산 절세 시뮬레이터",
  description:
    "2027년 가상자산 과세 대비, 1분 만에 예상 세금과 절세액을 확인하세요",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${notoSansKR.variable} ${sora.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

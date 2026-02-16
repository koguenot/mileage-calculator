import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import RightClickGuard from "./RightClickGuard";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "대한항공·아시아나 마일리지 가치 계산기 | 현금 vs 마일 비교 판독",
  description:
    "보유한 마일리지, 지금 쓰는 게 이득일까요? 출발지만 입력하면 현금 구매와 마일리지 예매 중 무엇이 유리한지 실시간으로 비교해 드립니다.",
  keywords: [
    "대한항공 마일리지 계산기",
    "아시아나 마일리지 계산기",
    "대한항공 뉴욕 마일리지",
    "인천 뉴욕 마일리지",
    "인천 LA 마일리지",
    "한국 미국 항공권 마일리지",
    "마일리지 vs 현금",
    "FSC 마일리지",
  ],
  openGraph: {
    title: "대한항공·아시아나 마일리지 가치 계산기 | 현금 vs 마일 비교 판독",
    description:
      "보유한 마일리지, 지금 쓰는 게 이득일까요? 출발지만 입력하면 현금 구매와 마일리지 예매 중 무엇이 유리한지 실시간으로 비교해 드립니다.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${inter.variable} font-sans antialiased text-base`}
      >
        <RightClickGuard />
        <div className="relative z-0">{children}</div>
      </body>
    </html>
  );
}

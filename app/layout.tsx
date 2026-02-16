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
    "미주 노선 항공권 결제 전 필수 체크! 유류세와 성수기 할증을 반영하여 마일리지와 현금 중 어떤 결제가 더 유리한지 즉시 판독해 드립니다.",
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
      "미주 노선 항공권 결제 전 필수 체크! 유류세와 성수기 할증을 반영하여 마일리지와 현금 중 어떤 결제가 더 유리한지 즉시 판독해 드립니다.",
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

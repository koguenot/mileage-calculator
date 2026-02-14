/**
 * 항공사별 공식 규정·성수기 설정 (FSC 전용: 대한항공, 아시아나)
 * - 대한항공: https://www.koreanair.com/contents/skypass/use-miles/award-ticket/redemption
 * - 아시아나: https://flyasiana.com/C/KR/KO/contents/using-miles-using-mileage-tickets (미주 2026-2027 성수기)
 */

import type { AirlineId } from "./routes";

/** 출발지 구분 (한국 출발 / 미국 출발) */
export type DepartureDirection = "kr" | "us";

export interface PeakSeasonRange {
  start: string; // YYYY-MM-DD
  end: string;
}

/** 항공사·출발지별 성수기 기간 (2026-2027, 공식 데이터 기준) */
export const PEAK_SEASON_RANGES: Record<
  AirlineId,
  Record<DepartureDirection, PeakSeasonRange[]>
> = {
  /** 대한항공(KE) 성수기 - 국제선 성수기 기간 (공식 표 기준, 26·27년 구분) */
  "korean-air": {
    /** 26·27년 국제선 (미주 출발 외) = 한국발 */
    kr: [
      // 2026년
      { start: "2026-01-02", end: "2026-01-11" },
      { start: "2026-02-13", end: "2026-02-22" },
      { start: "2026-02-27", end: "2026-02-28" },
      { start: "2026-03-01", end: "2026-03-02" },
      { start: "2026-05-01", end: "2026-05-05" },
      { start: "2026-07-24", end: "2026-07-31" },
      { start: "2026-08-01", end: "2026-08-16" },
      { start: "2026-09-23", end: "2026-09-27" },
      { start: "2026-10-02", end: "2026-10-05" },
      { start: "2026-10-08", end: "2026-10-11" },
      { start: "2026-12-25", end: "2026-12-27" },
      // 2027년
      { start: "2027-01-02", end: "2027-01-11" },
      { start: "2027-02-05", end: "2027-02-09" },
      { start: "2027-04-30", end: "2027-04-30" },
      { start: "2027-05-01", end: "2027-05-05" },
      { start: "2027-05-13", end: "2027-05-16" },
      { start: "2027-07-24", end: "2027-07-31" },
      { start: "2027-08-01", end: "2027-08-18" },
      { start: "2027-09-10", end: "2027-09-19" },
      { start: "2027-10-01", end: "2027-10-04" },
      { start: "2027-10-08", end: "2027-10-11" },
    ],
    /** 26·27년 국제선 (미주 출발) = 미주발 */
    us: [
      // 2026년
      { start: "2026-02-20", end: "2026-02-21" },
      { start: "2026-05-14", end: "2026-05-31" },
      { start: "2026-06-01", end: "2026-06-27" },
      { start: "2026-07-31", end: "2026-07-31" },
      { start: "2026-08-01", end: "2026-08-01" },
      { start: "2026-08-07", end: "2026-08-08" },
      { start: "2026-09-26", end: "2026-09-27" },
      { start: "2026-10-03", end: "2026-10-04" },
      { start: "2026-12-10", end: "2026-12-26" },
      // 2027년
      { start: "2027-02-12", end: "2027-02-13" },
      { start: "2027-05-07", end: "2027-05-08" },
      { start: "2027-05-13", end: "2027-05-31" },
      { start: "2027-06-01", end: "2027-06-26" },
      { start: "2027-07-30", end: "2027-07-31" },
      { start: "2027-08-06", end: "2027-08-07" },
      { start: "2027-09-17", end: "2027-09-18" },
      { start: "2027-12-09", end: "2027-12-25" },
    ],
  },
  /** 아시아나(OZ) 성수기 - 마일리지항공권 성수기 기간 (공식 팝업 기준, 26·27년 구분) */
  asiana: {
    /** 26·27년 국제선 (미주지역 이외 출발 시) = 한국발 */
    kr: [
      // 2026년
      { start: "2026-01-01", end: "2026-01-04" },
      { start: "2026-02-13", end: "2026-02-22" },
      { start: "2026-02-27", end: "2026-03-02" },
      { start: "2026-05-01", end: "2026-05-05" },
      { start: "2026-07-24", end: "2026-07-31" },
      { start: "2026-08-01", end: "2026-08-16" },
      { start: "2026-09-23", end: "2026-09-27" },
      { start: "2026-10-02", end: "2026-10-05" },
      { start: "2026-10-08", end: "2026-10-11" },
      { start: "2026-12-25", end: "2026-12-27" },
      // 2027년
      { start: "2027-01-02", end: "2027-01-11" },
      { start: "2027-02-05", end: "2027-02-09" },
      { start: "2027-04-30", end: "2027-05-05" },
      { start: "2027-05-13", end: "2027-05-16" },
      { start: "2027-07-24", end: "2027-08-18" },
      { start: "2027-09-10", end: "2027-09-19" },
      { start: "2027-10-01", end: "2027-10-04" },
      { start: "2027-10-08", end: "2027-10-11" },
    ],
    /** 26·27년 국제선 (미주지역 출발 시) = 미주발 */
    us: [
      // 2026년
      { start: "2026-02-20", end: "2026-02-21" },
      { start: "2026-05-14", end: "2026-05-31" },
      { start: "2026-06-01", end: "2026-06-27" },
      { start: "2026-07-31", end: "2026-08-01" },
      { start: "2026-08-07", end: "2026-08-08" },
      { start: "2026-09-26", end: "2026-09-27" },
      { start: "2026-10-03", end: "2026-10-04" },
      { start: "2026-12-10", end: "2026-12-26" },
      // 2027년
      { start: "2027-02-12", end: "2027-02-13" },
      { start: "2027-05-07", end: "2027-05-08" },
      { start: "2027-05-13", end: "2027-06-26" },
      { start: "2027-07-30", end: "2027-07-31" },
      { start: "2027-08-06", end: "2027-08-07" },
      { start: "2027-09-17", end: "2027-09-18" },
      { start: "2027-12-09", end: "2027-12-25" },
    ],
  },
};

/** 선택한 날짜가 해당 항공사·출발지 성수기인지 */
export function isPeakSeason(
  airline: AirlineId,
  direction: DepartureDirection,
  dateStr: string
): boolean {
  const ranges = PEAK_SEASON_RANGES[airline]?.[direction];
  if (!ranges?.length) return false;
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return false;
  const t = d.getTime();
  return ranges.some(({ start, end }) => {
    const s = new Date(start).getTime();
    const e = new Date(end).getTime();
    return t >= s && t <= e;
  });
}

export interface AirlineConfig {
  bookingUrl: string;
  /** 미주 출발 선택 시 사용 (영문 예약 페이지) */
  bookingUrlEn: string;
  regulationUrl: string;
  brandColor: string;
  brandRingClass: string;
  displayName: string;
}

export const AIRLINE_CONFIG: Record<AirlineId, AirlineConfig> = {
  "korean-air": {
    displayName: "대한항공",
    bookingUrl: "https://www.koreanair.com/kr/ko/booking",
    bookingUrlEn: "https://www.koreanair.com/flights/en-us/",
    regulationUrl: "https://www.koreanair.com/contents/skypass/use-miles/award-ticket/redemption",
    brandColor: "#5BA3D0",
    brandRingClass: "border-l-4 border-[#5BA3D0]/50",
  },
  asiana: {
    displayName: "아시아나항공",
    bookingUrl: "https://flyasiana.com/C/KR/KO/index",
    bookingUrlEn: "https://flyasiana.com/C/US/EN/index",
    regulationUrl: "https://flyasiana.com/C/KR/KO/contents/using-miles-using-mileage-tickets",
    brandColor: "#C4A052",
    brandRingClass: "border-l-4 border-amber-400/50",
  },
};

/**
 * 미주 노선 데이터 (IATA 표준, 편도 기준) - FSC 전용
 * - 출발: 인천(ICN) 또는 미주
 * - 항공사: 대한항공(KE), 아시아나(OZ)
 * - 편도 마일리지: KE 이코노미 35,000/52,500, 프레스티지 62,500/92,500
 * - OZ 이코노미 35,000/52,500, 비즈니스 스마티움 62,500/93,750
 */

export type AirlineId = "korean-air" | "asiana";

/** 좌석 등급 (편도 기준) */
export type SeatClassId = "economy" | "business";

/** IATA 항공사 코드 */
export const AIRLINE_IATA: Record<AirlineId, string> = {
  "korean-air": "KE",
  asiana: "OZ",
};

/** IATA 출발 공항 (인천) */
export const ORIGIN_AIRPORT = "ICN" as const;

export interface RouteOption {
  value: string;
  displayLabel: string;
  cityLabel: string;
  airportCode: string;
  note?: string;
}

/** API 연동용 노선 선택 페이로드 */
export interface RouteSelectionPayload {
  origin: typeof ORIGIN_AIRPORT;
  destination: string;
  airline: string;
}

export const AIRLINES: { value: AirlineId; label: string; iata: string }[] = [
  { value: "korean-air", label: "대한항공", iata: "KE" },
  { value: "asiana", label: "아시아나항공", iata: "OZ" },
];

/** 항공사별 미주 노선 (인천 출발) */
export const ROUTES_BY_AIRLINE: Record<AirlineId, RouteOption[]> = {
  "korean-air": [
    { value: "icn-jfk", displayLabel: "뉴욕 (JFK)", cityLabel: "뉴욕", airportCode: "JFK" },
    { value: "icn-lax", displayLabel: "로스앤젤레스 (LAX)", cityLabel: "로스앤젤레스", airportCode: "LAX" },
    { value: "icn-sfo", displayLabel: "샌프란시스코 (SFO)", cityLabel: "샌프란시스코", airportCode: "SFO" },
    { value: "icn-ord", displayLabel: "시카고 (ORD)", cityLabel: "시카고", airportCode: "ORD" },
    { value: "icn-iad", displayLabel: "워싱턴D.C. (IAD)", cityLabel: "워싱턴D.C.", airportCode: "IAD" },
    { value: "icn-atl", displayLabel: "애틀랜타 (ATL)", cityLabel: "애틀랜타", airportCode: "ATL" },
    { value: "icn-las", displayLabel: "라스베이거스 (LAS)", cityLabel: "라스베이거스", airportCode: "LAS" },
    { value: "icn-sea", displayLabel: "시애틀 (SEA)", cityLabel: "시애틀", airportCode: "SEA" },
    { value: "icn-dfw", displayLabel: "댈러스 (DFW)", cityLabel: "댈러스", airportCode: "DFW" },
    { value: "icn-bos", displayLabel: "보스턴 (BOS)", cityLabel: "보스턴", airportCode: "BOS" },
    { value: "icn-hnl", displayLabel: "호놀룰루 (HNL)", cityLabel: "호놀룰루", airportCode: "HNL" },
    { value: "icn-yvr", displayLabel: "밴쿠버 (YVR)", cityLabel: "밴쿠버", airportCode: "YVR" },
    { value: "icn-yyz", displayLabel: "토론토 (YYZ)", cityLabel: "토론토", airportCode: "YYZ" },
  ],
  asiana: [
    { value: "icn-jfk", displayLabel: "뉴욕 (JFK)", cityLabel: "뉴욕", airportCode: "JFK" },
    { value: "icn-lax", displayLabel: "로스앤젤레스 (LAX)", cityLabel: "로스앤젤레스", airportCode: "LAX" },
    { value: "icn-sfo", displayLabel: "샌프란시스코 (SFO)", cityLabel: "샌프란시스코", airportCode: "SFO" },
    { value: "icn-sea", displayLabel: "시애틀 (SEA)", cityLabel: "시애틀", airportCode: "SEA" },
    { value: "icn-hnl", displayLabel: "호놀룰루 (HNL)", cityLabel: "호놀룰루", airportCode: "HNL" },
  ],
};

/** 편도 마일리지 (평수기/성수기) - 대한항공·아시아나 FSC 전용 */
export const MILES_ONE_WAY: Record<
  AirlineId,
  Record<SeatClassId, { offPeak: number; peak: number }>
> = {
  "korean-air": {
    economy: { offPeak: 35000, peak: 52500 },
    business: { offPeak: 62500, peak: 92500 },
  },
  asiana: {
    economy: { offPeak: 35000, peak: 52500 },
    business: { offPeak: 62500, peak: 93750 },
  },
};

/** 항공사별 좌석 등급 옵션 */
export const SEAT_CLASS_OPTIONS_BY_AIRLINE: Record<
  AirlineId,
  { value: SeatClassId; label: string }[]
> = {
  "korean-air": [
    { value: "economy", label: "이코노미 (3.5만 / 5.25만)" },
    { value: "business", label: "프레스티지 (6.25만 / 9.25만)" },
  ],
  asiana: [
    { value: "economy", label: "이코노미 (3.5만 / 5.25만)" },
    { value: "business", label: "비즈니스 스마티움 (6.25만 / 9.375만)" },
  ],
};

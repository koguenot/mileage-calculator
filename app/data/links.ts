/**
 * 외부 버튼·링크 URL 통합 관리
 * - 이 파일에서 URL만 수정하면 모든 버튼에 반영됩니다.
 * - 모든 외부 링크는 EXTERNAL_LINK_PROPS 로 새 창(_blank)에서 열립니다.
 */

/** 외부 링크용 공통 속성: 새 창에서 열기 + 보안(noopener noreferrer) */
export const EXTERNAL_LINK_PROPS = {
  target: "_blank" as const,
  rel: "noopener noreferrer nofollow",
} as const;

/** 수익화·외부 링크 URL (새 창 _blank 로 열림) */
export const EXTERNAL_LINKS = {
  /** 실시간 일반석 최저가 검색 */
  economyCompare: "https://myrealt.rip/UvpLc5",
  /** 비즈니스석 단독 특가 */
  businessCompare: "https://www.trip.com/t/WbMLLx2QVT2",
  /** 마일리지 적립 카드 (date 파라미터는 필요 시 갱신) */
  mileageCard: "https://www.card-gorilla.com/chart/type?sub=M&term=monthly&date=2026-01-13",
  /** 미국 여행 eSIM */
  esimDeal: "https://go.saily.site/aff_c?offer_id=101&aff_id=12215",
  /** 비즈니스 특가 알림 (실제 URL로 교체 후 사용) */
  businessAlert: "#",
} as const;

/** 수익화 버튼/카드 문구 (외부 서비스 명칭 없이 혜택 중심) */
export const EXTERNAL_LABELS = {
  economyCompare: "실시간 일반석 최저가 검색하기",
  businessCompare: "비즈니스석 단독 특가 확인하기",
  mileageCard: "마일리지 적립 가성비 1위 카드 보기",
  esimDeal: "미국 여행 필수템, 핸쵸슨 단독 할인 eSIM",
  businessAlert: "비즈니스 특가 알림 설정하기",
} as const;

/** @deprecated EXTERNAL_LINKS 사용 권장. 동일 객체 재export */
export const AFFILIATE_LINKS = EXTERNAL_LINKS;

/** @deprecated EXTERNAL_LABELS 사용 권장. 동일 객체 재export */
export const AFFILIATE_LABELS = EXTERNAL_LABELS;

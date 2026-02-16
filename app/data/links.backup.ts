/**
 * [복제본] links.ts 백업
 * - 실제 앱에서 사용하는 파일은 links.ts 입니다.
 * - 링크/문구 수정은 links.ts 에서 하시고, 복원이 필요할 때만 이 파일을 참고하세요.
 * - 복원: 이 파일 내용을 links.ts 에 덮어쓰면 됩니다.
 *
 * 최종 백업 기준: 위 주석 작성 시점
 */

/** 외부 링크용 공통 속성: 새 창에서 열기 + 보안 */
export const EXTERNAL_LINK_PROPS = {
  target: "_blank" as const,
  rel: "noopener noreferrer nofollow",
} as const;

/** 3번째 버튼 슬롯 (한국: 렌터카, 미국: 공항 픽업) */
export type Slot3 = { link: string; label: string };

/** 미국 출발 탭 전용: 6번 버튼 항공사별 신용카드 링크 */
export type USACreditCardLinks = {
  KOREAN_AIR: string;
  ASIANA: string;
};

/** 출발지별 링크·문구 구조 */
export type DirectionLinks = {
  bookingLabel: string;
  links: {
    economyCompare: string;
    hotelDeal: string;
    esimDeal: string;
    mileageCard: string;
  };
  slot3: Slot3;
  labels: {
    economyCompare: string;
    hotelDeal: string;
    esimDeal: string;
    mileageCard: string;
  };
  usaCreditCard?: USACreditCardLinks;
};

/** 한국 출발 탭용 (한글) */
export const KOREA_LINKS: DirectionLinks = {
  bookingLabel: "공식 홈페이지 예약",
  links: {
    economyCompare: "https://www.trip.com/t/rlYJPsIXXT2",
    hotelDeal: "https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1934398&hl=en-us&city=318",
    esimDeal: "https://go.saily.site/aff_c?offer_id=101&aff_id=12215",
    mileageCard: "https://www.samsungcard.com/home/card/cardinfo/PGHPPCCCardCardinfoDetails001?code=AAP1452",
  },
  slot3: {
    link: "https://getrentacar.tpk.lu/ymNoImkB",
    label: "미국 현지 렌터카 최저가",
  },
  labels: {
    economyCompare: "실시간 일반석 최저가",
    hotelDeal: "미국 현지 인기 호텔",
    esimDeal: "미국 여행 필수 eSIM",
    mileageCard: "마일리지 적립 카드 추천",
  },
};

/** 미국 출발 탭용 (영어) */
export const USA_LINKS: DirectionLinks = {
  bookingLabel: "Book on Official Website",
  links: {
    economyCompare: "https://www.trip.com/t/qP1KCxraXT2",
    hotelDeal: "https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1934398&hl=en-us&city=14690",
    esimDeal: "https://go.saily.site/aff_c?offer_id=101&aff_id=12215",
    mileageCard: "",
  },
  slot3: {
    link: "https://www.trip.com/t/MPozwDFbXT2",
    label: "Airport Pickup & Transfers",
  },
  labels: {
    economyCompare: "Lowest Economy Rates",
    hotelDeal: "Top-Rated Korea Hotels",
    esimDeal: "Korea Travel eSIM",
    mileageCard: "Best Mileage Credit Cards",
  },
  usaCreditCard: {
    KOREAN_AIR: "https://www.skypassvisa.com/credit/welcome.do?exp=&lang=en&redirect=homeSec1",
    ASIANA: "https://www.referyourchasecard.com/19u/7BA7HJYGDP",
  },
};

/** 출발지에 맞는 링크 객체 반환 */
export function getLinksByDirection(direction: "kr" | "us"): DirectionLinks {
  return direction === "us" ? USA_LINKS : KOREA_LINKS;
}

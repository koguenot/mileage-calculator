"use client";

import { useState, useRef, useEffect } from "react";
import {
  AIRLINES,
  ROUTES_BY_AIRLINE,
  MILES_ONE_WAY,
  SEAT_CLASS_OPTIONS_BY_AIRLINE,
  AIRLINE_IATA,
  ORIGIN_AIRPORT,
  type AirlineId,
  type RouteOption,
  type RouteSelectionPayload,
  type SeatClassId,
} from "./data/routes";
import {
  isPeakSeason,
  AIRLINE_CONFIG,
  type DepartureDirection,
} from "./data/airlines";
import { getLinksByDirection, EXTERNAL_LINK_PROPS } from "./data/links";

/** 외부 연결(새 창) 표시 아이콘 */
function LinkOutIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

const THRESHOLD_KR = 15; // 원/마일
const GAUGE_MAX_KR = 25;
const THRESHOLD_US = 1.5; // ¢/mile (CPM)
const GAUGE_MAX_US = 3;
const ASTRA_BLUE = "#0073AA";

/** YYYY-MM-DD → MM/DD/YY */
function formatDateMMDDYY(ymd: string): string {
  if (!ymd || ymd.length < 10) return "";
  const [y, m, d] = ymd.split("-");
  return `${m}/${d}/${y.slice(-2)}`;
}

function getFilteredRoutes(routes: RouteOption[], query: string): RouteOption[] {
  if (!query.trim()) return routes;
  const q = query.trim().toLowerCase();
  return routes.filter(
    (r) =>
      r.cityLabel.toLowerCase().includes(q) ||
      r.displayLabel.toLowerCase().includes(q) ||
      r.airportCode.toLowerCase().includes(q)
  );
}

function buildSelectionPayload(
  airline: AirlineId,
  selectedRoute: RouteOption | undefined
): RouteSelectionPayload | null {
  if (!selectedRoute) return null;
  return {
    origin: ORIGIN_AIRPORT,
    destination: selectedRoute.airportCode,
    airline: AIRLINE_IATA[airline],
  };
}

/** 편도 필요 마일 (출발지·성수기 반영) */
function getRequiredMiles(
  airline: AirlineId,
  seatClass: SeatClassId,
  direction: DepartureDirection,
  travelDate: string
): number {
  const tier = MILES_ONE_WAY[airline][seatClass];
  if (!travelDate) return tier.offPeak;
  return isPeakSeason(airline, direction, travelDate) ? tier.peak : tier.offPeak;
}

export default function Home() {
  const [direction, setDirection] = useState<DepartureDirection>("kr");
  const [airline, setAirline] = useState<AirlineId>("korean-air");
  const [route, setRoute] = useState<string>(ROUTES_BY_AIRLINE["korean-air"][0].value);
  const [seatClass, setSeatClass] = useState<SeatClassId>("economy");
  const [travelDate, setTravelDate] = useState("");
  const [routeSearch, setRouteSearch] = useState("");
  const [routeOpen, setRouteOpen] = useState(false);
  const [cashPrice, setCashPrice] = useState("");
  const [taxFuel, setTaxFuel] = useState("");
  const [miles, setMiles] = useState("");
  const [result, setResult] = useState<{
    valuePerMile: number;
    recommendation: "mileage" | "cash";
    isPeak?: boolean;
    direction: DepartureDirection;
  } | null>(null);
  const routeListRef = useRef<HTMLDivElement>(null);

  const currentRoutes = ROUTES_BY_AIRLINE[airline];
  const selectedRouteOption = currentRoutes.find((r) => r.value === route);
  const filteredRoutes = getFilteredRoutes(currentRoutes, routeSearch);
  const selectionPayload = buildSelectionPayload(airline, selectedRouteOption);
  const config = AIRLINE_CONFIG[airline];
  const seatOptions = SEAT_CLASS_OPTIONS_BY_AIRLINE[airline];
  const isPeak = !!travelDate && isPeakSeason(airline, direction, travelDate);
  const requiredMiles = getRequiredMiles(airline, seatClass, direction, travelDate);

  useEffect(() => {
    const exists = currentRoutes.some((r) => r.value === route);
    if (!exists) setRoute(currentRoutes[0].value);
    setMiles(requiredMiles.toLocaleString());
  }, [airline]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setMiles(requiredMiles.toLocaleString());
  }, [route, seatClass, travelDate, direction, requiredMiles]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (routeListRef.current && !routeListRef.current.contains(e.target as Node)) {
        setRouteOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cash = Number(cashPrice.replace(/,/g, ""));
    const tax = Number(taxFuel.replace(/,/g, "")) || 0;
    const m = Number(miles.replace(/,/g, ""));

    if (!cash || !m || m <= 0) {
      setResult(null);
      return;
    }

    const netCash = Math.max(0, cash - tax);
    if (direction === "us") {
      const centsPerMile = (netCash * 100) / m;
      setResult({
        valuePerMile: centsPerMile,
        recommendation: centsPerMile >= THRESHOLD_US ? "mileage" : "cash",
        isPeak,
        direction: "us",
      });
    } else {
      const valuePerMile = netCash / m;
      setResult({
        valuePerMile,
        recommendation: valuePerMile >= THRESHOLD_KR ? "mileage" : "cash",
        isPeak,
        direction: "kr",
      });
    }
  };

  const isUsResult = result?.direction === "us";
  const gaugeMax = isUsResult ? GAUGE_MAX_US : GAUGE_MAX_KR;
  const gaugePercent = result
    ? Math.min((result.valuePerMile / gaugeMax) * 100, 100)
    : 0;
  const thresholdLinePercent = isUsResult
    ? (THRESHOLD_US / GAUGE_MAX_US) * 100
    : (THRESHOLD_KR / GAUGE_MAX_KR) * 100;

  const handleSelectRoute = (r: RouteOption) => {
    setRoute(r.value);
    setRouteSearch("");
    setRouteOpen(false);
  };

  return (
    <div className="min-h-screen bg-stone-50/80">
      <main className="mx-auto max-w-xl px-4 py-12 sm:px-6 sm:py-24">
        <header className="mb-10 text-center sm:mb-12">
          <h1 className="text-xl font-bold leading-snug tracking-tight text-stone-800 sm:text-3xl sm:leading-tight">
            항공권 마일리지 vs 현금
            <br />
            지금 뭐가 더 <span className="text-[var(--color-astra)]">이득일까?</span>
          </h1>
          <p className="mt-3 text-sm text-stone-500 sm:text-base">
            <span className="inline-flex items-center gap-1">✅ 유류할증료 포함</span> 미주 노선 마일리지 효율 판독기 (by 핸쵸슨)
          </p>
        </header>

        {/* 출발지 탭 */}
        <div className="mb-6 flex justify-center">
          <div
            role="tablist"
            aria-label="출발지 선택"
            className="inline-flex rounded-xl border border-stone-200 bg-white p-1 shadow-sm"
          >
            <button
              type="button"
              role="tab"
              aria-selected={direction === "kr"}
              className={`rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                direction === "kr"
                  ? "bg-[var(--color-astra)] text-white"
                  : "text-stone-600 hover:bg-stone-50"
              }`}
              onClick={() => setDirection("kr")}
            >
              한국 출발
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={direction === "us"}
              className={`rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                direction === "us"
                  ? "bg-[var(--color-astra)] text-white"
                  : "text-stone-600 hover:bg-stone-50"
              }`}
              onClick={() => setDirection("us")}
            >
              미국 출발
            </button>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className={`rounded-2xl border border-stone-200/80 bg-white p-6 shadow-sm transition-colors sm:p-8 ${config.brandRingClass}`}
        >
          <p className="mb-5 text-center text-xs text-stone-500">
            핸쵸슨 Data: 실시간 IATA 표준 코드가 적용된 계산기입니다
          </p>
          <div className="space-y-5">
            <div>
              <label
                htmlFor="airline"
                className="mb-1.5 block text-center text-xs font-medium uppercase tracking-wider text-stone-500"
              >
                항공사
              </label>
              <select
                id="airline"
                value={airline}
                onChange={(e) => setAirline(e.target.value as AirlineId)}
                className="w-full rounded-lg border border-stone-200 bg-stone-50/50 px-4 py-3 text-center text-stone-800 outline-none transition focus:border-stone-400 focus:ring-2 focus:ring-[var(--color-astra)]/30"
                aria-label="항공사 선택 대한항공 아시아나"
              >
                {AIRLINES.map((a) => (
                  <option key={a.value} value={a.value}>
                    {a.label}
                  </option>
                ))}
              </select>
            </div>

            <div ref={routeListRef} className="relative">
              <label
                htmlFor="route-search"
                className="mb-1.5 block text-center text-xs font-medium uppercase tracking-wider text-stone-500"
              >
                노선 (도시명 검색)
              </label>
              <input
                id="route-search"
                type="text"
                role="combobox"
                aria-expanded={routeOpen}
                aria-controls="route-listbox"
                aria-autocomplete="list"
                aria-label="노선 선택 인천 출발 미주 도시 검색"
                placeholder="도시명·공항코드 검색 (예: 뉴욕, JFK, 시애틀)"
                value={routeOpen ? routeSearch : selectedRouteOption?.displayLabel ?? ""}
                onChange={(e) => {
                  setRouteSearch(e.target.value);
                  setRouteOpen(true);
                }}
                onFocus={() => setRouteOpen(true)}
                className="w-full rounded-lg border border-stone-200 bg-stone-50/50 px-4 py-3 text-center text-stone-800 placeholder:text-stone-400 outline-none transition focus:border-stone-400 focus:ring-2 focus:ring-[var(--color-astra)]/30"
              />
              {routeOpen && (
                <ul
                  id="route-listbox"
                  role="listbox"
                  className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-lg border border-stone-200 bg-white py-1 shadow-lg"
                >
                  {filteredRoutes.length === 0 ? (
                    <li className="px-4 py-3 text-sm text-stone-500">
                      검색 결과 없음
                    </li>
                  ) : (
                    filteredRoutes.map((r) => (
                      <li
                        key={r.note ? `${r.value}-${r.note}` : r.value}
                        role="option"
                        aria-selected={r.value === route}
                        className={`cursor-pointer px-4 py-2.5 text-sm transition ${
                          r.value === route
                            ? "bg-stone-100 text-stone-900 font-medium"
                            : "text-stone-700 hover:bg-stone-50"
                        }`}
                        onClick={() => handleSelectRoute(r)}
                      >
                        <span>{r.displayLabel}</span>
                        {r.note && (
                          <span className="ml-2 inline-flex items-center rounded bg-amber-100 px-1.5 py-0.5 text-xs font-medium text-amber-800">
                            {r.note}
                          </span>
                        )}
                      </li>
                    ))
                  )}
                </ul>
              )}
            </div>

            <div>
              <label
                htmlFor="travel-date"
                className="mb-1.5 block text-center text-xs font-medium uppercase tracking-wider text-stone-500"
              >
                출발 예정일
              </label>
              <div className="relative flex min-h-12 items-center overflow-hidden rounded-lg border border-stone-200 bg-stone-50/50 focus-within:border-stone-400 focus-within:ring-2 focus-within:ring-[var(--color-astra)]/30">
                <input
                  id="travel-date"
                  type="date"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  min="2026-01-01"
                  max="2028-12-31"
                  aria-label="출발 예정일 선택"
                  className="relative min-h-[44px] flex-1 cursor-pointer appearance-none border-0 bg-transparent px-4 py-3 text-center outline-none [color-scheme:light] [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0"
                  style={{ color: "transparent" }}
                />
                <span
                  className="pointer-events-none absolute left-0 right-8 flex items-center justify-center text-stone-800"
                  aria-hidden
                >
                  {travelDate ? formatDateMMDDYY(travelDate) : "MM/DD/YY"}
                </span>
                <span className="pointer-events-none shrink-0 pr-3 text-xl leading-none text-stone-400" aria-hidden>🗓</span>
              </div>
              {travelDate && (
                <p
                  className={`mt-1.5 text-center text-xs font-medium ${
                    isPeak ? "text-red-600" : "text-blue-600"
                  }`}
                >
                  {isPeak ? "성수기 반영됨" : "평수기 반영됨"}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="seat"
                className="mb-1.5 block text-center text-xs font-medium uppercase tracking-wider text-stone-500"
              >
                좌석 등급 (편도 기준)
              </label>
              <select
                id="seat"
                value={seatClass}
                onChange={(e) => setSeatClass(e.target.value as SeatClassId)}
                className="w-full rounded-lg border border-stone-200 bg-stone-50/50 px-4 py-3 text-center text-stone-800 outline-none transition focus:border-stone-400 focus:ring-2 focus:ring-[var(--color-astra)]/30"
                aria-label="좌석 등급"
              >
                {seatOptions.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="cash"
                className="mb-1.5 block text-center text-xs font-medium uppercase tracking-wider text-stone-500"
              >
                {direction === "us"
                  ? "현금가 (USD, 편도)"
                  : "현재 항공권 현금가 (원, 편도)"}
              </label>
              <input
                id="cash"
                type="text"
                inputMode="numeric"
                placeholder={direction === "us" ? "예: 850" : "예: 750,000"}
                value={cashPrice}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, "");
                  setCashPrice(v ? Number(v).toLocaleString() : "");
                }}
                className="w-full rounded-lg border border-stone-200 bg-stone-50/50 px-4 py-3 text-center text-stone-800 placeholder:text-stone-400 outline-none transition focus:border-stone-400 focus:ring-2 focus:ring-[var(--color-astra)]/30"
              />
            </div>

            <div>
              <label
                htmlFor="tax-fuel"
                className="mb-1.5 block text-center text-xs font-medium uppercase tracking-wider text-stone-500"
              >
                {direction === "us"
                  ? "세금 및 유류할증료 (USD)"
                  : "세금 및 유류할증료 (원)"}
              </label>
              <input
                id="tax-fuel"
                type="text"
                inputMode="numeric"
                placeholder={direction === "us" ? "예: 150" : "예: 150,000"}
                value={taxFuel}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, "");
                  setTaxFuel(v ? Number(v).toLocaleString() : "");
                }}
                className="w-full rounded-lg border border-stone-200 bg-stone-50/50 px-4 py-3 text-center text-stone-800 placeholder:text-stone-400 outline-none transition focus:border-stone-400 focus:ring-2 focus:ring-[var(--color-astra)]/30"
              />
            </div>

            <div>
              <label
                htmlFor="miles"
                className="mb-1.5 block text-center text-xs font-medium uppercase tracking-wider text-stone-500"
              >
                예약에 필요한 마일리지 (편도 기준)
              </label>
              <input
                id="miles"
                type="text"
                inputMode="numeric"
                placeholder="노선·좌석·출발일 선택 시 자동 입력"
                value={miles}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, "");
                  setMiles(v ? Number(v).toLocaleString() : "");
                }}
                className="w-full rounded-lg border border-stone-200 bg-stone-50/50 px-4 py-3 text-center text-stone-800 placeholder:text-stone-400 outline-none transition focus:border-stone-400 focus:ring-2 focus:ring-[var(--color-astra)]/30"
              />
              <p className="mt-1.5 text-center text-xs text-stone-500">
                노선·좌석·출발지·출발일 선택 시 자동 입력 (편도, 성수기 반영)
              </p>
            </div>
          </div>

          <button
            type="submit"
            className="mt-8 w-full rounded-xl py-3.5 text-sm font-medium text-white transition hover:opacity-90 active:opacity-95"
            style={{ backgroundColor: ASTRA_BLUE }}
          >
            판독하기
          </button>
        </form>

        {result && (
          <section
            className="mt-8 rounded-2xl border border-stone-200/80 bg-white p-5 shadow-sm sm:p-8 text-center tabular-nums"
            aria-live="polite"
          >
            {isUsResult ? (
              <>
                <p className="text-lg font-semibold text-stone-800">
                  Value:{" "}
                  <span className="text-[var(--color-astra)]">
                    {result.valuePerMile.toFixed(1)} ¢/mile
                  </span>
                </p>
                <p className="mt-1 mb-4 text-xs font-medium uppercase tracking-wider text-stone-500">
                  (Cash − Tax/Fuel) × 100 ÷ Miles · One-way
                </p>
              </>
            ) : (
              <>
                <p className="text-lg font-semibold text-stone-800">
                  계산에 사용된 가치:{" "}
                  <span className="text-[var(--color-astra)]">
                    {result.valuePerMile.toFixed(1)}원/마일
                  </span>
                </p>
                <p className="mt-1 mb-4 text-xs font-medium uppercase tracking-wider text-stone-500">
                  (현금가 − 유류·세금) ÷ 필요마일 · 편도 기준
                </p>
              </>
            )}
            <div className="mx-auto relative h-4 w-full max-w-xs overflow-hidden rounded-full bg-stone-100">
              <div
                className="absolute left-0 top-0 h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${gaugePercent}%`,
                  backgroundColor:
                    result.recommendation === "mileage"
                      ? ASTRA_BLUE
                      : "rgb(168 162 158)",
                }}
              />
              <div
                className="absolute top-0 h-full w-0.5 bg-stone-400"
                style={{ left: `${thresholdLinePercent}%` }}
                title={isUsResult ? "1.5¢ 기준" : "15원 기준"}
              />
            </div>
            <p className="mt-2 text-sm text-stone-500 tabular-nums">
              <span className="font-semibold text-stone-700">
                {isUsResult
                  ? `${result.valuePerMile.toFixed(1)} ¢`
                  : `${result.valuePerMile.toFixed(1)}원`}
              </span>
              <span className="ml-1">/ 마일</span>
              <span className="ml-2 text-stone-400">
                | 기준 {isUsResult ? "1.5¢" : `${THRESHOLD_KR}원`}
              </span>
              <span className="ml-2 text-stone-500">(편도 기준)</span>
              {result.isPeak && (
                <span className="ml-2 text-xs text-red-600">(성수기 반영)</span>
              )}
            </p>

            <div
              className={`mt-6 rounded-xl px-4 py-4 text-center ${
                result.recommendation === "mileage"
                  ? "text-white"
                  : "bg-stone-100 text-stone-700"
              }`}
              style={
                result.recommendation === "mileage"
                  ? { backgroundColor: ASTRA_BLUE }
                  : undefined
              }
            >
              <p className="text-sm font-medium">
                {result.recommendation === "mileage"
                  ? "마일리지 권장"
                  : "현금 결제 권장"}
              </p>
              <p className="mt-1 text-xs opacity-90">
                {isUsResult
                  ? result.recommendation === "mileage"
                    ? "1.5¢/mile 이상이므로 마일리지 사용이 유리합니다."
                    : "1.5¢/mile 미만이므로 현금 결제가 유리합니다."
                  : result.recommendation === "mileage"
                    ? "1마일당 가치가 15원 이상이므로 마일리지 사용이 유리합니다."
                    : "1마일당 가치가 15원 미만이므로 현금 결제가 유리합니다."}
              </p>
            </div>

            {isUsResult ? (
              <p className="mt-4 text-xs italic text-stone-500">
                미국 업계 표준 가치인 1.5¢/mile을 기준으로 판독된 결과입니다.
              </p>
            ) : (
              <p className="mt-4 text-xs italic text-stone-500">
                *유류할증료 최적화를 위해 한국발, 미주발 각각 편도 발권을 권장합니다.
              </p>
            )}

            {/* 하단 광고: 출발지별 언어·내용 (모바일 2열 / PC 3열 2줄) — 6버튼, USA 6번은 항공사별 링크 */}
            {(() => {
              const dirLinks = getLinksByDirection(direction);
              const link = (url: string) => (url && url !== "#" ? url : "#");
              const creditCardHref =
                direction === "us" && dirLinks.usaCreditCard
                  ? link(
                      dirLinks.usaCreditCard[airline === "korean-air" ? "KOREAN_AIR" : "ASIANA"]
                    )
                  : link(dirLinks.links.mileageCard);
              const baseBtn =
                "flex min-h-[3.25rem] w-full items-center justify-center rounded-lg border px-3 py-3 text-center text-sm font-medium leading-snug transition hover:shadow-md active:shadow-sm break-words";
              return (
                <div className="mt-8 grid w-full max-w-4xl mx-auto grid-cols-2 gap-3 lg:grid-cols-3">
                  <a
                    href={direction === "us" ? config.bookingUrlEn : config.bookingUrl}
                    {...EXTERNAL_LINK_PROPS}
                    className={`${baseBtn} bg-white`}
                    style={{ borderColor: config.brandColor, color: config.brandColor }}
                  >
                    {dirLinks.bookingLabel}
                  </a>
                  <a
                    href={link(dirLinks.links.economyCompare)}
                    {...EXTERNAL_LINK_PROPS}
                    className={`${baseBtn} border-stone-200 bg-stone-50/80 text-stone-700 hover:bg-white`}
                  >
                    {dirLinks.labels.economyCompare}
                  </a>
                  <a
                    href={link(dirLinks.slot3.link)}
                    {...EXTERNAL_LINK_PROPS}
                    className={`${baseBtn} border-stone-200 bg-stone-50/80 text-stone-700 hover:bg-white`}
                  >
                    {dirLinks.slot3.label}
                  </a>
                  <a
                    href={link(dirLinks.links.hotelDeal)}
                    {...EXTERNAL_LINK_PROPS}
                    className={`${baseBtn} border-stone-200 bg-stone-50/80 text-stone-700 hover:bg-white`}
                  >
                    {dirLinks.labels.hotelDeal}
                  </a>
                  <a
                    href={link(dirLinks.links.esimDeal)}
                    {...EXTERNAL_LINK_PROPS}
                    className={`${baseBtn} border-stone-200 bg-stone-50/80 text-stone-700 hover:bg-white`}
                  >
                    {dirLinks.labels.esimDeal}
                  </a>
                  <a
                    href={creditCardHref}
                    {...EXTERNAL_LINK_PROPS}
                    className={`${baseBtn} border-stone-200 bg-stone-50/80 text-stone-700 hover:bg-white`}
                  >
                    {dirLinks.labels.mileageCard}
                  </a>
                </div>
              );
            })()}

            <p className="mt-6 text-center text-[11px] leading-snug text-stone-400">
              본 화면은 Handchosen의 자산입니다. 캡처하여 블로그, 카페 등에 게시할 경우 반드시 출처(
              <a
                href="https://mileage.handchosen.kr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-500 underline underline-offset-1 hover:text-stone-600"
              >
                https://mileage.handchosen.kr
              </a>
              )를 포함해야 합니다.
            </p>
          </section>
        )}

        <nav className="sr-only" aria-hidden="true">
          <h2>지원 노선</h2>
          <p>
            대한항공 마일리지 계산기: 인천 뉴욕, 인천 LA, 인천 샌프란시스코,
            인천 시카고, 인천 워싱턴D.C., 인천 애틀랜타, 인천 라스베이거스, 인천
            시애틀, 인천 댈러스, 인천 보스턴, 인천 호놀룰루, 인천 밴쿠버, 인천
            토론토. 아시아나 마일리지 계산기: 인천 뉴욕, 인천 LA, 인천
            샌프란시스코, 인천 시애틀, 인천 호놀룰루.
          </p>
        </nav>
      </main>
    </div>
  );
}

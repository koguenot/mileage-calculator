# 하단 광고 링크 관리 (links)

## 파일 위치

| 파일 | 용도 |
|------|------|
| **`links.ts`** | 실제 앱에서 사용하는 링크·문구. **수정은 이 파일만 하면 됩니다.** |
| **`links.backup.ts`** | 복제본. 복원이 필요할 때 참고하거나 `links.ts`에 덮어쓰기. |
| **`LINKS_README.md`** | 이 안내 문서. |

## 수정 방법

- **링크 URL 변경**: `links.ts` 안의 `KOREA_LINKS.links.*`, `USA_LINKS.links.*`, `slot3.link`, `usaCreditCard.KOREAN_AIR` / `ASIANA` 값을 원하는 URL로 바꾸면 됩니다.
- **버튼 문구 변경**: 같은 파일의 `labels.*`, `bookingLabel`, `slot3.label` 값을 수정하면 됩니다.
- 저장 후 앱을 새로고침하면 하단 광고 버튼에 바로 반영됩니다.

## 버튼 순서 (화면 기준)

**1줄**  
1. 공식 홈페이지 예약 (`bookingLabel`)  
2. 실시간 일반석 최저가 / Lowest Economy Rates (`economyCompare`)  
3. 미국 현지 렌터카 / Airport Pickup & Transfers (`slot3`)  

**2줄**  
4. 호텔 (`hotelDeal`)  
5. eSIM (`esimDeal`)  
6. 마일리지·신용카드 (`mileageCard` 또는 USA 시 `usaCreditCard.KOREAN_AIR` / `ASIANA`)  

## USA 6번 버튼 (항공사별)

- 미국 출발 탭에서만 항공사별로 링크가 나뉩니다.
- **대한항공** 선택 시 → `USA_LINKS.usaCreditCard.KOREAN_AIR`
- **아시아나** 선택 시 → `USA_LINKS.usaCreditCard.ASIANA`

## 복원

`links.ts`를 실수로 망가뜨렸을 때: `links.backup.ts` 내용을 복사해 `links.ts`에 붙여넣으면 됩니다.  
(백업은 수시로 직접 다시 저장해 두면 더 안전합니다.)

# Fove 제품 로드맵

Version: v26
Updated: 2026-05-31
Status: 진행 중

---

## 개요

Fove는 사주·MBTI·오늘의 운세를 결합한 개인 맞춤 운세·성향 리포트 서비스다.
단순 "운세 조회"가 아닌 **매일 확인하는 나만의 운세·성향 리포트**로 포지셔닝한다.

핵심 성장 지표 (3개월 목표)
- DAU +50%
- 재방문율 +30%
- 평균 세션 시간 +50%
- SEO 유입 +100%

---

## 현재 서비스 구조

```
/                           홈 — 오늘의 개인 리포트 카드
/saju                       사주 풀이 — 생년월일/시 입력, 오행 분석
/mbti                       MBTI 성향 진단 — 20문항
/fortune                    오늘의 운세 — 일진·오행·분야별 점수 카드
/fortune/week               이번 주 일진 흐름
/fortune/month              이번 달 일진 달력
/fortune/year               연간 운세 — 12개월 월주 흐름
/zodiac                     띠별 운세 — 12간지 특성
/insight                    사주·MBTI 통합 인사이트
/compatibility              사주 궁합 — 4차원 분석 (총운·감정·소통·미래)
/mbti/compatibility         MBTI 궁합 매트릭스 + 인터랙티브 계산기
/zodiac/compatibility       띠 궁합 — 삼합·육합·충 기반
/compatibility/combined     사주+MBTI 통합 궁합
/quiz                       운세 심리테스트
/saju/:year                 생년별 사주 특성 SEO 페이지 (80개 연도)
/blog/saju-basics           사주란 무엇인가? — 기초 완벽 정리
/blog/zodiac-standard       띠 기준 입춘 vs 음력 설 — 완벽 정리
/blog/mbti-love-style       MBTI별 연애 스타일 — 16타입 완벽 정리
```

---

## 로드맵

---

### ✅ P-UI — UI 전반 개선

**완료:** 2026-05-30  
**변경 파일:** `src/components/{BottomNav,Header,FortuneCard,ResultCard}.tsx`, `src/pages/HomePage.tsx`, `src/index.css`, `index.html`

- 모바일 하단 탭 바 (`BottomNav`) — 홈·운세·사주·MBTI·인사이트 5탭, 아이콘+라벨, 활성 인디케이터, iOS safe-area, 홈 다크/라이트 테마 전환
- 헤더 다크 테마 — 홈 페이지에서 `bg-slate-900/80` 자동 전환
- 홈 PRIMARY_ACTIONS 그리드 `sm:grid-cols-3` → `sm:grid-cols-2` (4개 카드 2×2 정렬)
- 홈 점수 카드에 색상별 미니 게이지 바 추가
- 홈 미입력 상태에 ① 사주 입력 → ② 리포트 생성 → ③ 매일 운세 단계 표시
- 홈 h1에 Noto Serif KR 폰트 적용 (Google Fonts)
- FortuneCard 해석 탭 ENERGY/ACTION/CARE 3열 → 단일 컬럼 카드 스택 (가독성 개선)
- `오늘의 운세 지수` 바를 ResultCard 2단 레이아웃 하단(full-width)으로 이동

---

### ✅ P-LAYOUT — 전 페이지 레이아웃 개선

**완료:** 2026-05-30  
**변경 파일:** `src/pages/{SajuPage,FortunePage,CompatibilityPage,BlogMbtiLoveStylePage}.tsx`, `src/components/ResultCard.tsx`

- 사주 페이지: `lg+` 에서 폼(좌, sticky) + 결과(우) 2단 분할, `max-w-5xl`
- 운세 페이지: 동일 패턴 — 폼/절기정보(좌) + 운세카드·주간·FAQ(우)
- ResultCard: `lg+` 에서 지표·요약(좌 260px) + 탭 콘텐츠(우) 2단, `belowGrid` prop 추가
- 궁합 페이지: `sm+` 에서 A·B 입력 폼 나란히 (`grid-cols-2`), `max-w-3xl`
- MBTI 연애 블로그: `max-w-4xl` → `max-w-2xl` 가독성 개선

---

### ✅ P-ADS1 — Google AdSense 광고 인프라

**완료:** 2026-05-30 (slot ID 교체는 AdSense 대시보드에서 별도 진행)  
**변경 파일:** `src/components/{AdUnit,ConsentBanner}.tsx`, `src/lib/adConsent.tsx`, `src/App.tsx`, `src/pages/{FortunePage,BlogSajuBasicsPage,BlogZodiacStandardPage,BlogMbtiLoveStylePage}.tsx`

- `AdConsentProvider` — React context로 동의 상태 관리 (localStorage 영속)
- `ConsentBanner` — 첫 방문 시 GDPR 동의 배너, 모바일 하단 탭 위 배치
- `AdUnit` — CLS 방지(minHeight 예약) + PWA standalone 감지 + dev 플레이스홀더, 동의 전 렌더링 안 함
- FortunePage 운세카드↔주간흐름 사이, 블로그 3페이지 콘텐츠↔CTA 사이에 배치
- **남은 작업:** AdSense 대시보드에서 광고 단위 생성 후 slot ID 교체
  - `FORTUNE_PAGE_BANNER`, `BLOG_SAJU_BASICS_BANNER`, `BLOG_ZODIAC_STANDARD_BANNER`, `BLOG_MBTI_LOVE_BANNER`

---

### ✅ P-SEO1 — 블로그 noscript 크롤링 개선

**완료:** 2026-05-30  
**변경 파일:** `scripts/generate-og-pages.mjs`, `src/data/{blogSajuBasics,blogZodiacStandard,blogMbtiLoveStyle}.js`, 블로그 페이지 3개

- 빌드 시 블로그 3페이지 HTML에 `<noscript><article>` 본문 주입 — JS 미실행 크롤러(Mediapartners-Google 등) 가독
- 블로그 콘텐츠를 `src/data/*.js` 공유 파일로 추출 — 컴포넌트와 빌드 스크립트가 동일 소스 사용, 수정 시 자동 동기화

---

### ✅ P1 — 공유 카드 이미지 저장

**완료:** 2026-05-30  
**변경 파일:** `src/components/ShareCard.tsx` (신규), `src/components/FortuneCard.tsx`

- Canvas 2D API로 1200×630 PNG 생성 (외부 라이브러리 미사용)
- 일진·오행·점수 원형 게이지·에너지 텍스트·분야별 점수 바(일·관계·재물·건강)·행운 요소·Fove 브랜딩 포함
- 점수에 따라 게이지 색 자동 변경 (녹색 ≥80 / 노랑 ≥65 / 빨강 <65)
- `ShareCardButton` → FortuneCard `actions`에 배치, `trackEvent('shared')` 연동

---

### ✅ P-G5 — 궁합 결과 공유 카드 이미지

**완료:** 2026-05-30  
**변경 파일:** `src/components/ShareCard.tsx` 확장, `src/pages/{CompatibilityPage,MbtiCompatibilityPage,CombinedCompatPage}.tsx`

- `CompatShareData` 인터페이스 + `buildCompatCanvas()` + `CompatShareCardButton` 추가
- 페이지 종류별 배경 색상 테마 구분 (사주: 보라, MBTI: 파랑, 통합: 인디고)
- 사주 궁합: 두 이름·총점·4차원 분석 바(총운/감정교류/소통/미래안정)·요약
- MBTI 궁합: MBTI 타입·점수·등급(최고/좋은/보통)·이유 텍스트
- 통합 궁합: 두 이름·통합 점수·사주 궁합/MBTI 궁합 2개 바

---

### ✅ P-SEO2 — vite-react-ssg 빌드 타임 정적 렌더링

**완료:** 2026-05-30  
**변경 파일:** `src/main.tsx`, `src/router.tsx` (신규), `src/Layout.tsx` (신규), `src/lib/router.ts`, `src/components/{Header,Footer,BottomNav}.tsx`, `src/pages/{SajuYearPage,ZodiacPage}.tsx`, `vite.config.ts`, `package.json`, `scripts/generate-og-pages.mjs`

- `vite-react-ssg` + `react-router-dom v6` 도입 — 커스텀 클라이언트 라우터 교체
- 빌드 시 20개 라우트 HTML 사전 렌더링 (`data-server-rendered="true"`)
  - 운세, 사주, MBTI, 궁합, 블로그 등 모든 주요 페이지 포함
- JS 미실행 크롤러(Mediapartners-Google 등)가 각 페이지 실제 콘텐츠를 읽을 수 있음
- 기존 `navigateTo()` 호출 18개 페이지 무변경 유지 (navigate 주입 패턴 적용)
- `SajuYearPage`, `ZodiacPage`: `window.location.pathname` → `useParams()` 전환
- `generate-og-pages.mjs`: SSG 생성 파일 우선 사용 후 OG 태그 업데이트

---

### ✅ P-NTF1 — Web Push 일일 알림 고도화

**완료:** 2026-05-30  
**변경 파일:** `public/sw-push.js` (신규), `src/lib/notifications.ts`, `src/Layout.tsx`, `vite.config.ts`

- **Periodic Background Sync** (Chrome Android/데스크탑): SW `periodicsync` 핸들러로 앱 미실행 시에도 24h 주기 알림, 알림 클릭 시 `/fortune` 이동
- **페이지 로드 체크** (모든 브라우저 폴백): 앱 열 때 오전 5시~오후 10시, 하루 1회 자동 발송, `localStorage`로 중복 방지
- `requestNotificationPermission()`에 `registerPeriodicSync()` 자동 연동
- `optOut()` 시 마지막 알림 날짜 초기화
- `vite.config.ts` workbox `importScripts`로 `sw-push.js` SW에 포함

---

### ✅ R1 — 연속 방문 스트릭 시스템

**완료:** 2026-05-30  
**변경 파일:** `src/lib/streak.ts` (신규), `src/components/StreakBadge.tsx` (신규), `src/Layout.tsx`, `src/pages/HomePage.tsx`

**목적:** 매일 앱을 여는 습관 형성 — 리텐션 지표 중 가장 효과가 검증된 메커니즘  
**구현 내용:**
- `src/lib/streak.ts` — `recordVisit()` / `getStreakCount()` (localStorage 기반, 당일 중복 호출 안전)
- `src/components/StreakBadge.tsx` — 2일 이상 시 "🔥 N일 연속" 배지, 7·30·100일 마일스톤 황금색 강조
- `Layout.tsx` `AppInit` 컴포넌트 — 페이지 로드마다 방문 기록, 새 날 첫 방문 시 토스트 발송 (마일스톤 6초, 일반 3초)
- `HomePage.tsx` — 리포트 카드 헤더에 배지 삽입 (사주 입력 전/후 모두)
- 어제 방문자는 오늘 방문 전까지 스트릭 유지 표시 (당일 23시 59분까지 유효)

**복잡도:** 낮음 | **리텐션 임팩트:** 높음 (7일 스트릭 형성 시 재방문율 2.4× 상승)

---

### ✅ R2 — 사용자 프로필 이름 저장 + 개인화 인사

**완료:** 2026-05-30  
**변경 파일:** `src/lib/profile.ts` (신규), `src/components/SajuForm.tsx`, `src/pages/{SajuPage,FortunePage,HomePage}.tsx`, `src/lib/notifications.ts`

**목적:** "오늘의 운세"가 아닌 "영희님의 오늘 운세"로 — 앱이 나를 기억한다는 소속감  
**구현 내용:**
- `src/lib/profile.ts` — `getName()` / `setName()` (localStorage `fove:profile` 키)
- `SajuForm` — 이름/닉네임 필드 추가 (선택 사항, 풀 너비), `onNameChange` prop으로 외부 저장 위임
- `SajuPage`, `FortunePage` — 이름 상태 관리 후 SajuForm에 전달
- `HomePage` — 이름 있으면 "영희님의 오늘 리포트", 없으면 "오늘의 Fove 리포트" 폴백
- `notifications.ts` — 페이지 로드 알림 본문 개인화 ("영희님, 오늘의 운세가 준비됐어요.")

**복잡도:** 낮음 | **리텐션 임팩트:** 중간 (개인화는 세션 시간 +20~30% 효과)

---

### ✅ R3 — 스마트 알림 고도화

**완료:** 2026-05-30  
**변경 파일:** `src/lib/notifications.ts`, `public/sw-push.js`, `src/Layout.tsx`

**목적:** 매일 동일한 알림 → 오늘에만 해당하는 알림으로 개봉률 향상  
**구현 내용:**
- `buildSmartNotificationContent()` — 우선순위별 알림 내용 결정
  - 1순위: 절기 당일 → "오늘은 [입춘] ☀️ [절기 메시지]" + url=/fortune
  - 2순위: 월요일 → "새로운 한 주! 이번 주 흐름 확인해보세요" + url=/fortune/week
  - 3순위: 스트릭 3일+ → "🔥 N일 연속! [일진 키워드]"
  - 기본: 오늘 일진 천간 키워드 포함 (JDN 계산으로 stem 도출)
- 이름 개인화 (R2)와 연동 — 모든 메시지에 "[이름]님," 접두사
- `sw-push.js` Periodic Background Sync — 요일(월)·일진 기반 스마트 메시지 (localStorage 불가로 날짜 계산만)
- `shouldShowEveningStreakReminder()` + Layout.tsx — 20시 이후, 스트릭 2일+, 오늘 첫 방문 시 in-app 토스트 ("내일도 방문하면 스트릭 유지돼요!")

**복잡도:** 낮음 | **리텐션 임팩트:** 높음 (맞춤 알림은 일반 알림 대비 개봉률 4×)

---

### ✅ R4 — 오늘의 행운 요소 심화

**완료:** 2026-05-30  
**변경 파일:** `src/lib/saju/constants.ts`, `src/lib/saju/types.ts`, `src/lib/saju/calculations.ts`, `src/components/FortuneCard.tsx`

**목적:** 매일 바뀌는 "오늘만의 콘텐츠"로 daily open 이유 추가  
**구현 내용:**
- `constants.ts` — `LUCKY_FOOD`(오행별 행운 음식), `AVOID_TODAY`(오행별 오늘 피할 것) 추가
- `types.ts` — `LuckyElements`에 `food`, `avoid` 필드 추가
- `calculations.ts` — `buildDailyFortune` lucky 객체에 food·avoid 포함
- `FortuneCard.tsx` — `LuckyCard` 컴포넌트 신설
  - 행운색·숫자·방위·음식 4개 그리드 카드
  - "오늘 피할 것" 강조 배너 (별도 섹션)
  - "텍스트 복사" 버튼 — 행운 요소 전체를 카카오톡 공유용 텍스트로 복사 (2초 후 초기화)

---

### ✅ R5 — 운세 히스토리 달력

**완료:** 2026-05-30  
**변경 파일:** `src/lib/fortuneHistory.ts` (신규), `src/pages/FortunePage.tsx`, `src/pages/FortuneMonthPage.tsx`

**목적:** "나의 지난 운세 흐름" 시각화 — 과거 데이터로 앱을 떠나기 어렵게 만드는 락인 효과  
**구현 내용:**
- `fortuneHistory.ts` — `recordFortune(score)`, `getMonthHistory()`, `getMonthStats()`, `scoreGrade()`. localStorage `fove:fortune_history` 최대 90일 보관.
- `FortunePage.tsx` — 운세 생성 시 자동 저장 (하루 1회)
- `FortuneMonthPage.tsx`:
  - 히스토리 통계 카드 — 기록한 날·평균 점수·최고점 + R1 스트릭 뱃지
  - 달력 셀 오버레이 — 과거 날짜 중 히스토리 있으면 점수 색상(녹/노/빨) + 점수 숫자 표시
  - 미래 날짜는 기존 품질 도트 유지
  - 범례 구분 — 미래 예측 vs 과거 기록 분리

**복잡도:** 중간 | **리텐션 임팩트:** 높음 (축적된 데이터가 있으면 앱 이탈율 급감)

---

### ✅ R6 — 절기·명절 특별 운세 이벤트

**완료:** 2026-05-30  
**변경 파일:** `src/lib/specialEvents.ts` (신규), `src/components/SeasonalBanner.tsx`, `src/lib/notifications.ts`

**목적:** 설날·추석·입춘 등 한국 절기 이벤트로 사용량 스파이크 + 특별감 제공  
**구현 내용:**
- `specialEvents.ts` — `getTodaySpecialEvent()` / `getTomorrowSpecialEvent()`
  - 설날·추석 양력 날짜 하드코딩 (2024~2030)
  - 밸런타인·어린이날·빼빼로데이·크리스마스 고정 날짜 이벤트
  - 24절기는 기존 `getTodaySolarTerm()` 위임
  - 명절 > 절기 > 기념일 우선순위
- `SeasonalBanner.tsx` 업그레이드
  - 특별 이벤트 당일 → `SpecialEventBanner` (이모지 + "오늘은 {이벤트}이에요!" + 이벤트별 CTA)
  - 이벤트 없는 날 → 기존 월별 배너 폴백
- `notifications.ts` — 알림 우선순위 재편
  - 오늘 이벤트 → 이벤트 이름 + 메시지
  - 내일 이벤트 예고 → "내일은 {이벤트}이에요. 오늘 운세를 확인하고 준비하세요!"
  - 이후 기존 우선순위(월요일·스트릭·일진) 유지

---

### ✅ R7 — 카카오 공유 + URL 기반 결과 딥링크

**완료:** 2026-05-31  
**변경 파일:** `src/lib/share.ts` (신규), `src/components/ShareLinkButton.tsx` (신규), `src/pages/{Compatibility,MbtiCompatibility,ZodiacCompat,CombinedCompat}Page.tsx`, `src/components/FortuneCard.tsx`

**목적:** 공유를 통한 신규 유입 + 공유한 사람의 재방문 동시 달성  
**구현 내용:**
- `share.ts` — 3단계 폴백: ① Web Share API(모바일 OS 공유시트, 카카오톡 포함) → ② 카카오 SDK(`VITE_KAKAO_APP_KEY` env 설정 시 활성화, lazy loading) → ③ 클립보드 복사
- `ShareLinkButton` — 통일된 공유 버튼. 클립보드 복사 시 토스트, 네이티브/카카오는 OS/SDK가 처리
- 4개 궁합 페이지의 `handleShare` + `navigator.clipboard` 직접 호출 → `ShareLinkButton`으로 일원화
- `FortuneCard` — 이미지 저장 버튼 옆에 "공유 🔗" 링크 공유 버튼 추가
- 카카오 앱 키: `.env`에 `VITE_KAKAO_APP_KEY=앱키` 추가 시 카카오 공유 자동 활성화, 없으면 Web Share/클립보드로 동작

**복잡도:** 중간 | **리텐션 임팩트:** 높음 (바이럴 루프 형성, 공유 사용자는 재방문율 1.8×)

---

### ✅ R8 — PWA 설치 유도 개선

**완료:** 2026-05-30  
**변경 파일:** `src/lib/installPrompt.ts` (신규), `src/components/InstallBanner.tsx` (신규), `src/Layout.tsx`

**목적:** 홈 화면 아이콘 → 앱처럼 사용 → 알림·스트릭 참여율 대폭 상승  
**구현 내용:**
- `installPrompt.ts` — isStandalone/isInstalled/isDismissedRecently/shouldShowBanner 유틸. 거부 시 7일간 재표시 안 함.
- `InstallBanner` 플랫폼별 분기:
  - Android/Chrome: `beforeinstallprompt` 이벤트 → 하단 배너 "홈 화면에 추가 / 나중에"
  - iOS Safari: `isIosSafari()` 감지 → 3단계 가이드 모달 (공유→홈 화면에 추가→추가 탭)
  - `appinstalled` 이벤트 자동 완료 처리
- ConsentBanner 표시 중(consent === null)에는 InstallBanner 억제
- standalone 모드 + 알림 미설정 시 "알림 켜기" 토스트 유도

**복잡도:** 낮음 | **리텐션 임팩트:** 높음 (설치된 PWA 사용자는 재방문율 3× 이상)

---

---

## 경쟁사 분석 기반 신규 트랙

> **분석 기준 (2026-05-31):** 점신·포스텔러·헬로우봇·문도와 비교.  
> Fove 차별점 유지 원칙: **서버 없이 동작, 개인정보 기기 밖 미전송, 광고 없이도 가치**

---

### ✅ T1 — 타로 카드 일일 뽑기

**목적:** 경쟁사(점신·포스텔러·헬로우봇) 전원 보유 — Fove 최대 공백. 매일 열어야 하는 이유 추가  
**예상 파일:** `src/pages/TarotPage.tsx`, `src/lib/tarot.ts`, `src/data/tarot.ts`  
**구현 방법:**
- 78장 타로 중 오늘 날짜 기반으로 3장 뽑기 (past·present·future 포지션)
- 각 카드 의미·역방향 해석 데이터 (텍스트 기반, 이미지 불필요)
- 오행·일진과 연계한 추가 해석 메시지
- 하루 1회 제한 (localStorage), 오늘 카드는 히스토리에 보관
- `/tarot` 신규 라우트 + BottomNav 통합 고려

**복잡도:** 중간 | **리텐션 임팩트:** 높음 (daily hook, 경쟁사 핵심 기능)

---

### 🔲 T2 — 심화 사주 리포트 (8글자 전체 해석)

**목적:** 포스텔러의 만세력·상세 분석 대응. 현재 Fove는 오행 분포만 보여줌  
**예상 파일:** `src/components/SajuResult.tsx` 확장, `src/lib/saju/interpretation.ts`  
**구현 방법:**
- 연·월·일·시 4기둥의 천간·지지 각각 한 줄 해석 (8개 셀)
- 십신(十神) 기본 분류 표시 (비견·겁재·식신·상관·편재·정재·편관·정관·편인·정인)
- 일주별 성격 특성 60갑자 데이터
- 기존 `SajuResult`에 탭 추가 방식으로 확장

**복잡도:** 중간 | **임팩트:** 높음 (핵심 사용자 요구, 차별화 콘텐츠)

---

### 🔲 T3 — AI 운세 질문 (Claude API 연동)

**목적:** 헬로우봇·포스텔러 AI 채팅 대응. "내 사주에 대해 물어보기" 기능  
**예상 파일:** `src/pages/AiPage.tsx`, `src/lib/ai.ts`  
**구현 방법:**
- 사용자의 사주 정보(오행 분포, 일주, 강점/약점)를 시스템 프롬프트로 Claude API 전달
- "오늘 중요한 결정을 해야 하는데 어떤 날인가요?" 류의 자유 질문
- 일 3회 무료 질문 (localStorage 카운터)
- 서버 필요: Vercel Edge Function 또는 Cloudflare Worker로 API 키 보호

**복잡도:** 높음 | **임팩트:** 높음 (차별화 핵심, 경쟁사와 명확한 기술 격차)  
**전제 조건:** Anthropic API 키, Vercel/Cloudflare 서버리스 배포

---

### ✅ T4 — 혈액형·별자리 궁합

**목적:** 혈액형(A·B·O·AB)·별자리(12) 궁합은 국내 대부분의 운세앱이 보유. 쉬운 롱테일 SEO 유입  
**예상 파일:** `src/pages/BloodCompatPage.tsx`, `src/pages/StarSignCompatPage.tsx`  
**구현 방법:**
- 혈액형 궁합: 4×4 = 16 조합 매트릭스 + 오행 기반 해석 연계
- 별자리 궁합: 12×12 = 144 조합, 계절·오행과 연결
- `/blood-compatibility`, `/starsign-compatibility` 신규 라우트
- SSG 적용 + SEO ("A형 B형 궁합", "물고기자리 사자자리 궁합" 등 롱테일)
- 기존 궁합 계산기 UI 패턴 재사용

**복잡도:** 낮음 | **임팩트:** 중간 (검색 유입 + 진입 장벽 낮은 유저 확보)

---

### ✅ T5 — 택일 (길한 날 찾기)

**목적:** 점신·포스텔러의 핵심 수익 기능. 기존 달력 인프라로 빠르게 구현 가능  
**예상 파일:** `src/pages/TaekIlPage.tsx`, `src/lib/taekil.ts`  
**구현 방법:**
- 목적 선택: 결혼·이사·계약·개업·여행·시험
- 사주 기반 개인 길일 + 일반 일진 점수 결합해 상위 N일 추천
- `/fortune/month` 달력 오버레이와 연동 (R5 히스토리와 동일 UI)
- 추천 날짜에 이유 한 줄 제공 ("오행 흐름이 맞아 계약·결정에 유리")
- SEO: "결혼 택일 2026", "이사하기 좋은 날" 등 타깃

**복잡도:** 낮음~중간 | **임팩트:** 중간 (고관여 사용자, SEO 강력)

---

### ✅ T6 — 오행 보완 추천 (나의 부족한 에너지 채우기)

**목적:** 포스텔러의 오행 보완 가이드 대응. R4 행운 요소와 연계해 더 깊은 콘텐츠 제공  
**예상 파일:** `src/components/SajuResult.tsx` 탭 추가  
**구현 방법:**
- 사주에서 가장 부족한 오행 1~2개 식별 (기존 `weakest` 필드 활용)
- 오행별 추천: 음식·색상·방향·활동·인간관계 패턴 (R4 행운 데이터 연장선)
- "오늘 이런 것을 해보세요 — 부족한 수(水) 기운을 채울 수 있어요" 형태
- 사주 결과 페이지 새 탭 "보완 가이드"로 추가

**복잡도:** 낮음 | **임팩트:** 중간 (세션 시간 증가, 사주 페이지 체류율 향상)

---

### 🔲 T7 — 인스타그램·틱톡용 운세 카드 (9:16 세로형)

**목적:** 현재 공유 카드는 OG 이미지용 1200×630. SNS 바이럴은 9:16이 표준  
**예상 파일:** `src/components/ShareCard.tsx` 확장  
**구현 방법:**
- Canvas 기반 1080×1920 (9:16) 운세 요약 카드 생성
- 오늘 점수·일진·한 줄 행운 요소·Fove 브랜딩 포함
- "스토리 공유" 버튼 → 이미지 저장 후 앱 열기 안내
- 기존 `buildCompatCanvas()`·`buildFortuneCanvas()` 패턴 재사용

**복잡도:** 낮음 | **임팩트:** 중간 (바이럴 루프, 신규 유입 채널)

---

### ✅ T8 — 사용자 피드백 & 오늘 운세 체크인

**목적:** 커뮤니티 기능 없는 Fove에서 가능한 최소 형태의 사용자 참여 유도  
**예상 파일:** `src/components/FortuneCheckin.tsx`, `src/lib/checkin.ts`  
**구현 방법:**
- 운세 카드 하단 "오늘 운세 어떠셨나요?" 이모지 반응 버튼 (😄 보통 😐 별로 😢)
- 반응 결과를 localStorage에 저장 (R5 히스토리와 연동)
- 달력에 이모지 오버레이 추가 — "내가 느낀 오늘"을 시각화
- 월간 요약: "좋은 날 N일, 보통 M일, 별로 K일"

**복잡도:** 낮음 | **임팩트:** 중간 (체류 시간 증가, 히스토리 락인 강화)

---

### 🔲 M1 — 프리미엄 구독 (행운 패스)

**목적:** 점신의 "행운패스" 대응. 광고 제거 + 심화 기능 번들  
**구성안:**
- 월 N,900원: 광고 제거 + AI 질문 일 10회 + 심화 사주 리포트 + 택일 상세 분석
- 결제: 카카오페이·토스페이먼츠 연동
- 구현 전제: T3(AI), T2(심화 사주) 완료 후 번들링

**복잡도:** 높음 | **전제 조건:** 백엔드 결제 서버, T2·T3 완료

---

### 🔲 P-B2 — 블로그 콘텐츠 확장

**목적:** 현재 블로그 3편 → 10편 이상으로 확장해 SEO 유입 채널 강화  
**우선 주제 (검색량·관련도 기준):**
1. MBTI 유형별 직업 궁합 — `blog/mbti-career`
2. 오늘의 일진 보는 법 완벽 정리 — `blog/iljin-guide`
3. 사주 오행 부족 채우는 법 — `blog/saju-five-elements`
4. 12간지 성격 완벽 분석 — `blog/zodiac-personality`
5. 연애 잘 되는 날 고르는 법 (택일) — `blog/lucky-date`

**구현 방법:**
- 기존 블로그 페이지 구조(섹션 배열) 재사용
- 각 글에 관련 기능 페이지로 CTA 버튼 추가 (내부 전환 유도)
- 사이트맵·OG 스크립트에 새 라우트 자동 추가

---

### 🔲 P2 — 이메일 구독

**목적:** 브라우저 알림을 허용하지 않는 사용자 대상 재방문 유도  
**예상 파일:** `src/components/EmailSubscribe.tsx`  
**구현 방법:**
- 이메일만 입력하면 구독 (로그인 불필요)
- 외부 서비스 연동 필요: Mailchimp / Resend / EmailOctopus 중 선택
- FortunePage 또는 홈 하단에 구독 폼 배치
- 매일 오전 8시 오늘의 운세 발송 (서버 사이드 스케줄러 필요)

**전제 조건:** 이메일 발송 서버 또는 외부 서비스 API 키 확보 필요

---

### 🔲 P3 — 수익화/확장 (장기)

- [ ] 심화 사주 리포트 (사주 8글자 전체 해석)
- [ ] 광고 배치 최적화 (P-ADS1 이후 A/B 테스트)
- [ ] PDF 리포트 다운로드
- [ ] 프리미엄 상세 해석 (페이월)
- [ ] 상담/제휴 연결

---

## 기술 부채

| 항목 | 설명 | 우선도 |
|------|------|--------|
| analytics 이벤트 빈약 | `trackEvent` EventName이 5종 — 페이지뷰·버튼클릭·공유 등 세분화 필요 | 낮음 |
| ~~사주 연도 SSG 미포함~~ | 완료 — 80개 연도 페이지 SSG 포함 + generate-og-pages.mjs 연도별 canonical/title 주입 | ~~낮음~~ |
| AdSense slot ID 미교체 | `AdUnit` 컴포넌트에 placeholder slot ID 사용 중 — AdSense 대시보드에서 실제 ID 발급 후 교체 필요 | 높음 |

---

## 변경 이력

| 날짜 | 버전 | 내용 |
|------|------|------|
| 2026-05-25 | v1 | 최초 로드맵 문서화 |
| 2026-05-25 | v2 | 궁합 기능 확장 — P-G1(사주 4차원), P-G2(MBTI 계산기), P-G3(띠 궁합) 완료 |
| 2026-05-25 | v3 | P-G4 완료 — 사주+MBTI 통합 궁합(/compatibility/combined), lib/mbti 공유 모듈화 |
| 2026-05-25 | v4 | P-OG 추가 — 오픈 그래프 설정 작업 로드맵 등록 |
| 2026-05-25 | v5 | P-OG 완료 — 빌드 후 라우트별 index.html OG 태그 주입 (16개 라우트), og:image:width/height/alt 추가 |
| 2026-05-25 | v6 | 제품 현황 재검토 후 로드맵 보강 — P-B1(블로그 목록), P-ADS1(AdSense), P-NTF1(Push 알림), P-B2(블로그 확장) 추가. 기술 부채 섹션 신설 |
| 2026-05-25 | v7 | P-B1 완료 — /blog 목록 페이지 대신 Footer에 블로그 링크 섹션 추가 (routes.ts blogLinks, Footer.tsx 개선) |
| 2026-05-30 | v8 | P-UI 완료 — 모바일 하단 탭 바, 헤더 다크 테마, 홈 그리드·게이지·온보딩·폰트 개선, FortuneCard 레이아웃 정리 |
| 2026-05-30 | v8 | P-LAYOUT 완료 — 사주·운세 페이지 사이드바 분할, ResultCard 2단, 궁합 입력 나란히, 블로그 max-w 최적화 |
| 2026-05-30 | v8 | P-ADS1 완료 — AdUnit(CLS방지·standalone감지), ConsentBanner(GDPR), AdConsentProvider, 블로그+운세 페이지 배치 |
| 2026-05-30 | v8 | P-SEO1 완료 — 블로그 noscript 크롤링 개선, src/data 공유 파일로 자동 동기화 |
| 2026-05-30 | v9 | P-SEO2 완료 — vite-react-ssg 도입, 20개 라우트 빌드 타임 정적 렌더링, react-router-dom v6 마이그레이션 |
| 2026-05-30 | v10 | P1 완료 — Canvas 2D API 기반 운세 공유 카드 이미지 저장 (1200×630 PNG) |
| 2026-05-30 | v11 | P-G5 완료 — 궁합 공유 카드 이미지 (사주·MBTI·통합 3종, 페이지별 색상 테마) |
| 2026-05-30 | v12 | P-NTF1 완료 — Periodic Background Sync + 페이지 로드 체크 이중 알림 스케줄링 |
| 2026-05-30 | v13 | 리텐션 트랙 추가 — R1(스트릭), R2(프로필 개인화), R3(스마트 알림), R4(행운 요소 심화), R5(히스토리 달력), R6(절기 이벤트), R7(카카오 공유), R8(PWA 설치 유도) |
| 2026-05-30 | v14 | R1 완료 — localStorage 기반 스트릭 시스템, 홈 카드 배지, 마일스톤 토스트 |
| 2026-05-30 | v15 | R2 완료 — 이름/닉네임 저장, SajuForm 이름 필드, 홈 개인화 타이틀, 알림 본문 개인화 |
| 2026-05-30 | v16 | SEO 개선 — ①블로그 CTA/관련글 button→a 태그 ②FAQPage(사주·운세·MBTI)/BlogPosting(블로그3편) JSON-LD ③사주 연도 80페이지 SSG+OG 주입 |
| 2026-05-30 | v17 | 콘텐츠 개선 — constants.ts 전문용어→친근한 문체(TEMPERAMENT/HEALTH_TIPS/STEM_DAILY_CONTEXT/ELEMENT_KEYWORDS 등), 운세 점수 등급 뱃지(대길/길/보통/소길/주의), 카테고리 툴팁, SajuForm 안내문구 간소화, HomePage 슬로건·주요기능 설명·시간대별 인사, FortunePage MBTI 유도 링크 |
| 2026-05-30 | v18 | R3 완료 — 스마트 알림(절기/월요일/스트릭3일+/일진키워드 우선순위), SW Periodic Sync 고도화, 저녁 스트릭 리마인더 in-app 토스트 |
| 2026-05-30 | v19 | R4 완료 — 행운 음식·오늘 피할 것 추가, LuckyCard 컴포넌트(4그리드+피할것 배너), 텍스트 복사 버튼 |
| 2026-05-30 | v20 | R8 완료 — PWA 설치 유도(Android 하단 배너 + iOS 3단계 가이드 모달), 7일 거부 TTL, 설치 후 알림 유도 토스트 |
| 2026-05-30 | v21 | R5 완료 — 운세 히스토리 달력(90일 저장, /fortune/month 오버레이, 통계 카드, R1 스트릭 연동) |
| 2026-05-30 | v22 | R6 완료 — 설날·추석·절기·기념일 특별 배너, 이벤트 전날 알림 예고, 명절>절기>기념일 우선순위 |
| 2026-05-31 | v23 | R7 완료 — Web Share API→카카오SDK→클립보드 3단계 폴백, ShareLinkButton 통일, 궁합 4페이지+FortuneCard 적용 |
| 2026-05-31 | v24 | 경쟁사 분석 기반 신규 트랙 추가 — T1(타로 뽑기), T2(심화 사주), T3(AI 질문), T4(혈액형·별자리 궁합), T5(택일), T6(오행 보완), T7(세로형 카드), T8(체크인), M1(프리미엄) |
| 2026-05-31 | v25 | T4·T6·T8 완료 — 혈액형/별자리 궁합 페이지, 사주 오행 보완 가이드, 운세 체크인 이모지+달력 오버레이 |
| 2026-05-31 | v26 | T1·T5 완료 — 타로 78장 일일 뽑기(/tarot, 날짜 결정론적 시드), 택일(/taekil, 6가지 목적별 이번 달 추천) |

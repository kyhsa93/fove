# Fove 제품 로드맵

Version: v9
Updated: 2026-05-30
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

### 🔲 P1 — 공유 카드 이미지 저장

**목적:** 결과를 이미지로 저장해 카카오톡·인스타그램 공유 유도  
**예상 파일:** `src/components/ShareCard.tsx`  
**구현 방법:**
- `html2canvas` 또는 `canvas` API로 운세 요약 카드를 PNG로 렌더링
- 오늘의 한 줄 요약 + 총운 점수 + 행운 키워드 포함
- "이미지 저장" + "링크 복사" 버튼을 FortuneCard 하단에 추가
- trackEvent 연동 (`shared` 이벤트 활용)

---

### 🔲 P-G5 — 궁합 결과 공유 카드 이미지

**목적:** 궁합 결과 SNS 공유 유도, 바이럴 채널화  
**전제:** P1(공유 카드) 구현 후 ShareCard 컴포넌트 재사용  
**예상 파일:** `src/components/ShareCard.tsx` 확장, `src/pages/CompatibilityPage.tsx` 등  
**구현 방법:**
- ShareCard를 궁합 요약 (두 사람 이름 + 총점 + 차트)으로 확장
- 사주 궁합·MBTI 궁합·통합 궁합 세 페이지에 동일 컴포넌트 배치

---

### 🔲 P-ADS1 — Google AdSense 광고 배치

**목적:** ads.txt가 이미 존재하지만 실제 광고 코드가 없음. 수익화 빠른 시작  
**예상 파일:** `index.html`, `src/components/AdUnit.tsx`  
**구현 방법:**
- AdSense 스크립트를 `index.html` `<head>`에 추가
- `AdUnit` 래퍼 컴포넌트 작성 — dev 환경에서는 플레이스홀더 렌더링
- FortunePage, ZodiacPage, BlogPage 등 콘텐츠 섹션 사이에 배치
- 모바일/데스크톱 반응형 슬롯 구분

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

### 🔲 P-NTF1 — Web Push 일일 알림 고도화

**목적:** `lib/notifications.ts` 인프라가 있지만 실제 알림 예약(스케줄링)이 없음. 재방문율 개선  
**예상 파일:** `public/sw.js` (Service Worker), `src/lib/notifications.ts` 확장  
**구현 방법:**
- Service Worker에 `setTimeout`/`setInterval` 기반 로컬 알림 스케줄 추가
  - 매일 오전 8시 "오늘의 운세 준비됐어요" 알림
- FortunePage에 opt-in UI 개선 (현재 동의 UI 확인 후 보완)
- Push API (VAPID) 서버리스 연동은 P2 이메일과 함께 검토

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
| 사주 연도 SSG 미포함 | `/saju/:year` 80개 연도 페이지 — `ssgOptions.includedRoutes`에 추가하면 사전 렌더링 가능 | 낮음 |
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

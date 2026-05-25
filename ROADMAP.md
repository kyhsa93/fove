# Fove 제품 로드맵

Version: v1
Updated: 2026-05-25
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
/           홈 — 오늘의 개인 리포트 카드 (사주 데이터 있을 때)
/saju       사주 풀이 — 생년월일/시 입력, 오행 분석
/mbti       MBTI 성향 진단 — 20문항
/fortune    오늘의 운세 — 일진·오행·분야별 점수 카드
/fortune/week   이번 주 일진 흐름
/fortune/month  이번 달 일진 달력 (좋은날/조심할날 표시)
/fortune/year   연간 운세 — 12개월 월주 흐름
/zodiac     띠별 운세 — 12간지 특성
/insight    사주·MBTI 통합 인사이트 (신규)
/compatibility  궁합 보기 (신규)
/quiz       운세 심리테스트 (신규)
/saju/:year 생년별 사주 특성 SEO 페이지 (신규)
```

---

## 로드맵

### ✅ P1 — 즉시 개선 (완료)

- [x] **분야별 숫자 점수 카드** — 일·업무 / 사랑·관계 / 재물 / 건강 점수를 숫자+바+설명으로 표시
  - `src/lib/saju/types.ts` — `FortuneCategoryScores` 타입 추가
  - `src/lib/saju/calculations.ts` — 분야별 점수 산출 로직
  - `src/components/FortuneCard.tsx` — 점수 카드 UI
- [x] **FAQ 신뢰도 콘텐츠 확장** — 사주 계산 기준(입춘/절기), 오행·십간 설명, MBTI 참고 안내
  - `src/pages/FortunePage.tsx`
- [x] **홈 첫 화면 개편** — 총운+분야별 점수 4칸 리포트 카드, 첫 방문자용 CTA 카드
  - `src/pages/HomePage.tsx`

### ✅ P2 — 재방문 기능 (완료)

- [x] **운세 캘린더 좋은날/조심할날 표시** — 사주 데이터 기반(개인화) 또는 오행 일반 기준
  - `src/pages/FortuneMonthPage.tsx`
- [x] **어제·오늘·내일 3칸 비교** — 일진·오행·점수·행동 요약 비교 카드
  - `src/pages/FortunePage.tsx`
- [x] **브라우저 알림 구독** — Notification API 권한 요청, localStorage 구독 상태 관리
  - `src/lib/notifications.ts`
  - `src/pages/FortunePage.tsx`

### ✅ P3 — 차별화 기능 (완료)

- [x] **사주·MBTI 통합 인사이트 페이지** `/insight`
  - 오행 성향 × MBTI 타입 교차 해석 메시지
  - 직업·재물·건강·관계 성향 분석
  - `src/pages/InsightPage.tsx`
- [x] **궁합 보기** `/compatibility`
  - 두 사람 생년월일 → 오행 기반 궁합 점수 + 관계 해석
  - 연인/친구/직장 탭
  - `src/pages/CompatibilityPage.tsx`
- [x] **운세 심리테스트** `/quiz`
  - 연애 패턴, 돈 새는 습관 테스트
  - 결과 공유 지원
  - `src/pages/QuizPage.tsx`

### ✅ P4-a — SEO 기반 (완료)

- [x] **생년별 사주 특성 페이지** `/saju/:year` (예: `/saju/1993`)
  - 연주 오행·띠·성향·직업·재물·건강 분석
  - 페이지 자체 메타 태그 (SEO 최적화)
  - `src/pages/SajuYearPage.tsx`
- [x] **sitemap 확장** — insight / compatibility / quiz / saju/:year (80년치) 포함, 총 106개 URL
  - `scripts/generate-sitemap.mjs`

---

### 🔲 P1-미완 — 공유 카드 이미지 저장

**목적:** 결과를 이미지로 저장해 카카오톡·인스타그램 공유 유도  
**예상 파일:** `src/components/ShareCard.tsx`  
**구현 방법:**
- `html2canvas` 또는 `canvas` API로 운세 요약 카드를 PNG로 렌더링
- 오늘의 한 줄 요약 + 총운 점수 + 행운 키워드 포함
- "이미지 저장" + "링크 공유" 버튼을 FortuneCard 하단에 추가

---

### 🔲 P2-미완 — 이메일 구독

**목적:** 브라우저 알림을 허용하지 않는 사용자 대상 재방문 유도  
**예상 파일:** `src/components/EmailSubscribe.tsx`  
**구현 방법:**
- 이메일만 입력하면 구독 (로그인 불필요)
- 외부 서비스 연동 필요: Mailchimp / Resend / EmailOctopus 중 선택
- FortunePage 또는 홈 하단에 구독 폼 배치
- 매일 오전 8시 오늘의 운세 발송 (서버 사이드 스케줄러 필요)

**전제 조건:** 이메일 발송 서버 또는 외부 서비스 API 키 확보 필요

---

### 🔲 P3-미완 — 시즌성 콘텐츠 배너

**목적:** 시기별 검색 트래픽 확보, 재방문 이유 제공  
**구현 방법:** FortunePage 상단 또는 홈에 배너 섹션 추가

| 시기 | 콘텐츠 |
|------|--------|
| 1월 | 신년운세, 올해의 키워드 |
| 설날 | 토정비결, 가족운 |
| 3월 | 학업운, 이직운 |
| 5월 | 연애운, 결혼운 |
| 7~8월 | 여행운 |
| 9월 | 취업운, 시험운 |
| 11~12월 | 내년 미리보기, 연말 운세 |

---

### 🔲 P4-b — SEO 추가 페이지

- [ ] `/mbti/compatibility` — MBTI 16타입 궁합 매트릭스 SEO 페이지
- [ ] `/blog/saju-basics` — 사주란 무엇인가 (입문 설명 콘텐츠)
- [ ] `/blog/zodiac-standard` — 띠 기준은 입춘인가 음력 설인가
- [ ] `/blog/mbti-love-style` — MBTI별 연애 스타일

---

### 🔲 P4-c — 궁합 결과 URL 공유

**목적:** "친구에게 궁합 보내기" 바이럴 유도  
**구현 방법:**
```
/compatibility?a=1993-01-15&b=1995-05-10&type=love
```
- URL 파라미터에서 두 사람 생년월일·궁합 유형 파싱
- 결과 페이지 OG 태그 동적 설정 (CompatibilityPage 내부)
- "이 결과 공유하기" 버튼으로 URL 복사

---

### 🔲 P5 — 수익화/확장 (장기)

- [ ] 심화 사주 리포트 (사주 8글자 전체 해석)
- [ ] 광고 배치 최적화 (섹션 사이 자연스러운 배치)
- [ ] PDF 리포트 다운로드
- [ ] 프리미엄 상세 해석 (페이월)
- [ ] 상담/제휴 연결

---

## 기술 부채

- [ ] `CompatibilityPage.tsx` 입력 폼 UX 개선 — 현재 이름 입력과 날짜 입력이 분리되어 어색함
- [ ] `FortunePage.tsx` `setBirthDate` destructuring 정리 — 3칸 비교 추가 후 실제 미사용 가능성 점검
- [ ] 브라우저 알림 Service Worker 연동 — 현재는 탭이 열려있을 때만 알림 가능, 백그라운드 알림 미지원

---

## 변경 이력

| 날짜 | 버전 | 내용 |
|------|------|------|
| 2026-05-25 | v1 | plan.md + test.md 통합, 완료/미완 구분, 로드맵 문서화 |

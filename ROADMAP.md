# Fove 제품 로드맵

Version: v6
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
| 사주 연도 SEO 비 pre-rendered | `/saju/:year` 동적 라우팅 — Googlebot이 크롤하려면 JS 실행 필요 | 낮음 |

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

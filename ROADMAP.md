# Fove 제품 로드맵

Version: v30
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
/                           홈 — 개인 운세 리포트, 스트릭 배지, 시간대별 인사
/saju                       사주 풀이 — 년/월/일 직접 입력, 오행 분석, 8글자 십신 그리드, 오행 보완 가이드
/mbti                       MBTI 성향 진단 — 20문항
/fortune                    오늘의 운세 — 일진·분야별 점수·행운 요소·체크인
/fortune/week               이번 주 일진 흐름
/fortune/month              이번 달 일진 달력 (히스토리 오버레이·체크인 이모지)
/fortune/year               연간 운세 — 12개월 월주 흐름
/zodiac                     띠별 운세 — 12간지 특성
/insight                    사주·MBTI 통합 인사이트
/compatibility              사주 궁합 — 4차원 분석
/mbti/compatibility         MBTI 궁합 매트릭스
/zodiac/compatibility       띠 궁합 — 삼합·육합·충 기반
/compatibility/combined     사주+MBTI 통합 궁합
/blood-compatibility        혈액형 궁합 — A/B/O/AB 16조합
/starsign-compatibility     별자리 궁합 — 12별자리 원소 기반
/tarot                      타로 일일 뽑기 — 78장, 날짜 기반 3장
/taekil                     택일 — 결혼·이사·계약·개업·여행·시험
/quiz                       운세 심리테스트
/saju/:year                 생년별 사주 특성 SEO 페이지 (80개 연도)
/blog/saju-basics           사주란 무엇인가? — 기초 완벽 정리
/blog/zodiac-standard       띠 기준 입춘 vs 음력 설 — 완벽 정리
/blog/mbti-love-style       MBTI별 연애 스타일 — 16타입 완벽 정리
/blog/iljin-guide           오늘의 일진 보는 법 — 천간·지지·오행 완벽 정리
/blog/mbti-career           MBTI 유형별 직업 궁합 — 16타입 강점 직군 분석
```

---

## 완료된 작업

| 분류 | 항목 | 완료일 | 핵심 내용 |
|------|------|--------|---------|
| 인프라 | P-UI | 05-30 | 하단 탭 바, 헤더 다크 테마, 홈 게이지·온보딩·폰트 |
| 인프라 | P-LAYOUT | 05-30 | 사주·운세 2단 레이아웃, ResultCard 분할, 궁합 폼 나란히 |
| 인프라 | P-SEO1·2 | 05-30 | vite-react-ssg SSG, 사주 연도 80페이지, FAQPage·BlogPosting JSON-LD, 블로그 a태그 |
| 인프라 | P-NTF1 | 05-30 | Periodic Background Sync + 페이지 로드 체크 이중 알림 |
| 인프라 | P-ADS1 | 05-30 | AdSense AdUnit, GDPR ConsentBanner (slot ID 교체 필요) |
| 공유 | P1·P-G5 | 05-30 | Canvas 1200×630 운세·궁합 공유 카드 |
| 리텐션 | R1 | 05-30 | 스트릭 시스템 — 홈 배지, 마일스톤 토스트 |
| 리텐션 | R2 | 05-30 | 이름 저장 + 홈·알림 개인화 |
| 리텐션 | R3 | 05-30 | 스마트 알림 — 절기·요일·스트릭·일진 우선순위, 저녁 리마인더 |
| 리텐션 | R4 | 05-30 | 행운 음식·오늘 피할 것, LuckyCard, 텍스트 복사 |
| 리텐션 | R5 | 05-30 | 운세 히스토리 달력 — 90일 저장, 점수 오버레이, 통계 카드 |
| 리텐션 | R6 | 05-30 | 절기·명절 특별 배너, 이벤트 전날 알림 예고 |
| 리텐션 | R7 | 05-31 | Web Share API→카카오SDK→클립보드 공유, 궁합 URL 딥링크 |
| 리텐션 | R8 | 05-30 | PWA 설치 유도 — Android 배너, iOS 3단계 모달 |
| 콘텐츠 | 콘텐츠 개선 | 05-31 | 전문용어→친근한 문체, 점수 등급 뱃지, 시간대별 인사, SajuForm 숫자 직접 입력 |
| 경쟁사 | T1 | 05-31 | 타로 78장 일일 뽑기 — 날짜 결정론적 시드, 3포지션 |
| 경쟁사 | T2 | 05-31 | 심화 사주 — 8글자 십신(十神) 그리드, 색상 뱃지·범례 |
| 경쟁사 | T4 | 05-31 | 혈액형(16조합)·별자리(144조합) 궁합 페이지 |
| 경쟁사 | T5 | 05-31 | 택일 — 6가지 목적별 이번 달 좋은 날 순위 |
| 경쟁사 | T6 | 05-31 | 오행 보완 가이드 — 음식·색상·방위·활동·건강 |
| 경쟁사 | T7 | 05-31 | 9:16 세로형 스토리 카드 (인스타·틱톡 최적화) |
| 경쟁사 | T8 | 05-31 | 운세 체크인 — 이모지 반응, 달력 오버레이, 월간 통계 |
| 내비게이션 | NAV | 05-31 | 고립 페이지 진입점 전수 정비 — 타로(홈 카드), 택일·퀴즈(navLinks+인페이지 CTA), 띠궁합·혈액형·별자리 궁합(관련 페이지 CTA) |
| 블로그 | P-B2 (1·2) | 05-31 | 일진 가이드·MBTI 직업 궁합 블로그 페이지 — 데이터·페이지·라우트·Footer 링크 |

---

## 남은 작업

---

### 🔲 P-B2 — 블로그 콘텐츠 확장 (3~5편 잔여)

**목적:** SEO 유입 채널 강화. 현재 5편 → 목표 10편 이상  
**복잡도:** 낮음 | **SEO 임팩트:** 높음

**잔여 주제:**
3. 사주 오행 부족 채우는 법 — `/blog/saju-five-elements`
4. 12간지 성격 완벽 분석 — `/blog/zodiac-personality`
5. 연애 잘 되는 날 고르는 법 (택일) — `/blog/lucky-date`

**구현:** 기존 블로그 구조(섹션 배열) 재사용, 각 글에 관련 기능 CTA 추가

---

### 🔲 P-SEO3 — og:image 전 페이지 추가

**목적:** 소셜 공유 시 이미지 없어 CTR 저하 — 카카오·인스타 링크 공유 미리보기 개선  
**복잡도:** 낮음 | **SEO 임팩트:** 높음

**현황:** 전체 페이지에 `og:image` 미설정. `Layout.tsx` 기본 메타에도 없음  
**구현:**
- `/public`에 기본 og 이미지(1200×630) 추가 → `Layout.tsx`에 기본 og:image 설정
- 사주·운세·궁합 등 핵심 페이지는 공유 카드(Canvas)가 이미 있으므로 해당 이미지 URL 활용

---

### 🔲 P-SEO4 — 핵심 페이지 메타·JSON-LD 보강

**목적:** 주요 기능 페이지 크롤러 유입 강화  
**복잡도:** 낮음 | **SEO 임팩트:** 높음

**현황:**
- `SajuPage`, `MbtiPage`, `FortunePage`, `ZodiacPage` — 동적 메타 업데이트 없음 (Layout 기본값에만 의존)
- `TaekIlPage`, `QuizPage`, `BloodCompatPage` — JSON-LD 스키마 없음

**구현:**
- 위 5개 페이지에 `useEffect` 내 `document.title` + og 메타 설정 추가 (BlogSajuBasicsPage 패턴 동일 적용)
- `TaekIlPage` → `FAQPage` JSON-LD, `QuizPage` → `Quiz` JSON-LD, `BloodCompatPage` → `FAQPage` JSON-LD 추가

---

### 🔲 P-UX1 — 페이지 내 CTA·공유 완성도 정비

**목적:** 페이지 간 기능 연결 일관성 확보, 이탈 방지  
**복잡도:** 낮음

**현황 (구체적 누락):**
- `TarotPage` — 결과 이후 사주·운세 연결 CTA 없음
- `TaekIlPage` — 결과 공유 버튼 없음 (다른 기능 페이지 대비 불일치)
- `QuizPage` — 결과 화면에서 운세·인사이트 등 관련 기능 링크 없음
- `BloodCompatPage` — 이름/호칭 입력 필드 없음, `CompatShareCardButton` 없음 (ZodiacCompatPage 대비 불일치)

**구현:** 각 페이지 결과 섹션 하단에 관련 기능 버튼·공유 UI 추가

---

### 🔲 P-UX2 — 모바일 입력 UX 개선

**목적:** 모바일 터치 영역 확보, 입력 편의성 향상  
**복잡도:** 낮음

**현황:**
- `SajuForm.tsx:189-224` — 년/월/일 입력 필드 너비 `w-12(48px)` → 모바일 터치 기준(44px 이상 권고) 아슬아슬
- `ZodiacCompatPage.tsx:119-134` — 일부 버튼 패딩 작아 터치 영역 미달

**구현:** 입력 필드 너비 확대, 버튼 패딩 최소 `py-2.5` 이상 통일

---

### 🔲 T3 — AI 운세 질문 (서버 필요)

**목적:** 헬로우봇·포스텔러 AI 채팅 대응. "내 사주로 질문하기"  
**복잡도:** 높음 | **전제 조건:** Anthropic API 키 + Vercel/Cloudflare Worker (API 키 보호용)

**구현:**
- 사용자 사주(오행·일주·강점/약점)를 시스템 프롬프트로 Claude API 전달
- 일 3회 무료 질문 (localStorage 카운터)
- 서버리스 함수로 API 키 노출 방지

---

### 🔲 P2 — 이메일 구독 (서버 필요)

**목적:** Push 알림 미허용 사용자 재방문 유도  
**복잡도:** 높음 | **전제 조건:** Mailchimp / Resend / EmailOctopus API 키 + 스케줄러

**구현:** 이메일 입력 → 매일 오전 8시 오늘의 운세 발송

---

### 🔲 M1 — 프리미엄 구독 (서버+결제 필요)

**목적:** 점신 "행운패스" 대응. 광고 제거 + 심화 기능 번들  
**복잡도:** 높음 | **전제 조건:** 결제 서버 (카카오페이·토스페이먼츠), T3 완료 후 번들링

**구성안:** 광고 제거 + AI 질문 일 10회 + 택일 상세 분석 (월 N,900원)

---

### 🔲 P3 — 기타 장기 과제

- [ ] PDF 리포트 다운로드
- [ ] 광고 배치 A/B 테스트 (P-ADS1 slot ID 교체 후)
- [ ] 상담/제휴 연결 페이지

---

## 기술 부채

| 항목 | 설명 | 우선도 |
|------|------|--------|
| AdSense slot ID 미교체 | `AdUnit` placeholder slot ID → AdSense 대시보드에서 실제 ID 발급 후 교체 | **높음** |
| analytics 이벤트 빈약 | `trackEvent` 5종 → 페이지뷰·버튼클릭 등 세분화 필요 | 낮음 |
| 궁합 페이지 중복 로직 | `getInitialState()`, `ScoreBar` 컴포넌트가 `CompatibilityPage` · `ZodiacCompatPage` · `BloodCompatPage`에 각각 구현됨 → 공통 훅/컴포넌트로 추출 | 낮음 |
| 궁합 페이지 로딩 상태 누락 | `CompatibilityPage`, `BloodCompatPage`, `ZodiacCompatPage` — useMemo 계산 중 로딩 표시 없음 (SajuPage는 있음) | 낮음 |

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
/                       홈 — 오늘의 개인 리포트 카드
/saju                   사주 풀이 — 생년월일/시 입력, 오행 분석
/mbti                   MBTI 성향 진단 — 20문항
/fortune                오늘의 운세 — 일진·오행·분야별 점수 카드
/fortune/week           이번 주 일진 흐름
/fortune/month          이번 달 일진 달력
/fortune/year           연간 운세 — 12개월 월주 흐름
/zodiac                 띠별 운세 — 12간지 특성
/insight                사주·MBTI 통합 인사이트
/compatibility          사주 궁합 — 4차원 분석 (총운·감정·소통·미래)
/mbti/compatibility     MBTI 궁합 매트릭스 + 인터랙티브 계산기
/zodiac/compatibility   띠 궁합 — 삼합·육합·충 기반
/quiz                   운세 심리테스트
/saju/:year             생년별 사주 특성 SEO 페이지
```

---

## 로드맵

---

### ✅ P-OG — 오픈 그래프(Open Graph) 설정

**목적:** SNS 공유 시 미리보기 카드(제목·설명·이미지) 노출로 클릭률 향상  
**예상 파일:** `src/app/layout.tsx`, 각 페이지 `page.tsx`  
**구현 방법:**
- `next/metadata`의 `openGraph` 필드를 루트 레이아웃에 기본값으로 설정
- `/fortune`, `/compatibility`, `/saju`, `/mbti` 등 주요 페이지별 동적 메타데이터 (`generateMetadata`) 개별 설정
- `og:title`, `og:description`, `og:image`, `og:url`, `og:type` 포함
- Twitter Card(`twitter:card`, `twitter:image`) 병행 설정
- 공유 미리보기 이미지: 정적 기본 이미지 + 페이지별 커스텀 이미지 분리

---

### 🔲 P-G5 — 궁합 결과 공유 카드 이미지

**목적:** 궁합 결과 SNS 공유 유도, 바이럴 채널화  
**전제:** P1(공유 카드) 구현 후 연계

---

### 🔲 P1 — 공유 카드 이미지 저장

**목적:** 결과를 이미지로 저장해 카카오톡·인스타그램 공유 유도  
**예상 파일:** `src/components/ShareCard.tsx`  
**구현 방법:**
- `html2canvas` 또는 `canvas` API로 운세 요약 카드를 PNG로 렌더링
- 오늘의 한 줄 요약 + 총운 점수 + 행운 키워드 포함
- "이미지 저장" + "링크 공유" 버튼을 FortuneCard 하단에 추가

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
- [ ] 광고 배치 최적화 (섹션 사이 자연스러운 배치)
- [ ] PDF 리포트 다운로드
- [ ] 프리미엄 상세 해석 (페이월)
- [ ] 상담/제휴 연결

---

## 기술 부채

_항목 없음 — 모두 해소됨_

---

## 변경 이력

| 날짜 | 버전 | 내용 |
|------|------|------|
| 2026-05-25 | v1 | 최초 로드맵 문서화 |
| 2026-05-25 | v2 | 궁합 기능 확장 — P-G1(사주 4차원), P-G2(MBTI 계산기), P-G3(띠 궁합) 완료 |
| 2026-05-25 | v3 | P-G4 완료 — 사주+MBTI 통합 궁합(/compatibility/combined), lib/mbti 공유 모듈화 |
| 2026-05-25 | v4 | P-OG 추가 — 오픈 그래프 설정 작업 로드맵 등록 |
| 2026-05-25 | v5 | P-OG 완료 — 빌드 후 라우트별 index.html OG 태그 주입 (16개 라우트), og:image:width/height/alt 추가 |

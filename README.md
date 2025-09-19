# Dot Image Generator

Vite + React + Tailwind 환경에서 텍스트/이미지를 도트로 렌더링하고 PNG로 다운로드할 수 있습니다.

## 요구 사항

- Node.js 18+ (권장 LTS)

## 설치 및 실행

```bash
npm install
npm run dev
# 브라우저에서 http://localhost:5173 접속
```

프로덕션 빌드는 다음과 같습니다.

```bash
npm run build
npm run preview   # 빌드 결과 미리보기
```

## 파일 구조

- `index.html` — Vite 엔트리 (root div 및 모듈 스크립트)
- `src/main.jsx` — React 마운트 및 글로벌 스타일 로드
- `src/App.jsx` — 앱 본문 (캔버스 기반 도트 렌더러)
- `src/index.css` — Tailwind 엔트리 (`@tailwind base/components/utilities`)
- `tailwind.config.js`, `postcss.config.js` — Tailwind/PostCSS 설정
- `vite.config.js` — Vite + React 플러그인 설정

## 참고

- 기존 CDN/Babel 기반은 제거하고, 최신 Vite 개발 서버(HMR 포함)로 전환했습니다.
- Tailwind는 JIT(기본)로 동작하며, 사용된 클래스만 번들에 포함됩니다.

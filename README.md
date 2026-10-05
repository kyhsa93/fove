# fove

양력 생년월일과 태어난 시간으로 사주팔자를 계산하고, MBTI 성향 검사와 오늘의 운세를 함께 보여주는 웹 앱.

사이트: https://kyhsa93.github.io/fove/

화면 목록과 앞으로 할 일은 [ROADMAP.md](ROADMAP.md)에 있다.

## 구조

- React + `vite-react-ssg`로 라우트마다 정적 HTML을 미리 만든다. Tailwind.
- `npm run build` 뒤에 `postbuild`가 `scripts/generate-sitemap.mjs`(사이트맵)와 `scripts/generate-og-pages.mjs`(공유 미리보기 페이지)를 돌린다.
- `scripts/generateSolarTerms.mjs` — 절기 표 `src/solarTerms.ts`를 만든다. 빌드에 끼어 있지 않으니 표를 바꿀 때만 손으로 돌린다.
- `.github/workflows/deploy-github-pages.yml` — `main`에 푸시하면 `npm ci` → `npm run build` → `dist`를 Pages에 배포한다.

## 로컬 실행

```
npm ci
npm run dev        # 개발 서버
npm run build      # dist에 정적 산출물
npm run preview    # 빌드 결과 보기 (5173)
```

`base`는 production 빌드에서만 `/fove/`다(`vite.config.ts`).

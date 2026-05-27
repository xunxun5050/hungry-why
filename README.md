# 오늘은 왜 배고프지?

명세 기반 토이 프로젝트입니다. 사용자 프로필 + 위치/날씨/시간 정보를 바탕으로 배고픈 이유를 재치 있게 분석하고, 지금 먹기 좋은 메뉴 1개를 추천합니다.

## 실행 방법

```bash
npm install
npm run dev
```

## 환경 변수

현재 필수 환경 변수는 없습니다.

- 날씨 조회: Open-Meteo(Geocoding + Forecast) 사용, API 키 불필요
- 분석/추천: 앱 내부 분석 로직 사용

## 배포 (GitHub Pages)

이 레포는 GitHub Actions로 빌드 후 GitHub Pages에 배포하도록 설정되어 있습니다.

- 배포 워크플로우: `.github/workflows/deploy-pages.yml`
- 예상 배포 주소: `https://xunxun5050.github.io/hungry-why/`

처음 1회는 GitHub 레포 `Settings → Pages`에서 `Build and deployment`의 `Source`를 `GitHub Actions`로 설정해야 할 수 있어요.

## 폴더 구조

```text
src/
├── components/
├── services/
├── hooks/
└── App.jsx
```

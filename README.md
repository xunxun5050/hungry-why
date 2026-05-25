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

## 폴더 구조

```text
src/
├── components/
├── services/
├── hooks/
└── App.jsx
```

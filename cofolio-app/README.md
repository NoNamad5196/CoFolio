# CoFolio 앱

실행·구현·제약 사항은 [루트 README](../README.md), 구조는 [아키텍처 문서](../docs/redesign-v2-architecture.md), 검증 결과는 [QA 기록](../docs/redesign-v2-qa.md)을 참고하세요.

Node.js 24.12 이상이 필요합니다.

```powershell
npm ci
npm run dev
```

- 개발 UI: http://127.0.0.1:5173
- API와 production UI: http://127.0.0.1:4174
- 검사: `npm test`, `npm run lint`, `npm run build`
- production: `npm run build` 후 `npm start`
- 서버 전용 AI 설정: `.env.example` 참고. 키 없이도 규칙 기반 분석 가능.
- 로컬 저장: `data/cofolio.sqlite`와 사용자별 HTTP-only 세션, 별도 비회원 localStorage.
- 운영: [cofolio-app.vercel.app](https://cofolio-app.vercel.app), Vercel + Supabase Auth/PostgreSQL. [배포 문서](../docs/deployment.md)

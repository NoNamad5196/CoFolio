# CoFolio Workspace V2

개발자 취업용 프로젝트 경험을 근거와 연결해 분석하고 포트폴리오로 정리하는 작업 공간입니다.

공개 GitHub / README / 직접 입력 → 근거 확인 → 누락 정보 보완 → 개선 제안 검토 → Builder → Preview / Export 흐름이 동작합니다.

운영 주소: [cofolio-app.vercel.app](https://cofolio-app.vercel.app). Vercel API와 Supabase Auth/PostgreSQL을 사용합니다. [배포 기록](docs/deployment.md)

## 실행

Node.js **24.12 이상**이 필요합니다. Node 내장 SQLite와 TypeScript 실행을 사용합니다.

```powershell
cd cofolio-app
npm ci
npm run dev
```

[개발 화면](http://127.0.0.1:5173)을 열면 됩니다. 위 명령은 Vite(5173)와 API(4174)를 함께 실행합니다. GitHub 가져오기는 서버에서 인터넷에 연결할 수 있어야 합니다.

API 키 없이도 근거 연결, 8개 항목 점검, 사용자 진술을 재구성한 제안, 저장과 내보내기가 동작합니다. 첫 화면은 비어 있으며 예시 자료는 사용자가 선택할 때만 추가됩니다.

## 구현한 기능

- **Import:** 공개 GitHub 저장소의 실제 metadata·언어·README, README 붙여넣기, 직접 입력. 저장소 URL 검증, 요청 제한·타임아웃·오류 후 재시도.
- **Workspace:** 프로젝트 탐색기, 7개 경험 필드, 근거 자료와 8개 분석 기준. README의 명시된 문제·구현 절을 원문으로 발췌하고 개인 진술과 구분.
- **분석:** 문제 정의 / 기술 선택 / 구현 깊이 / 본인 기여 / 문제 해결 / 결과·성과 / 문서화 / 직무 연관성을 충분·보완 필요·부족·근거 없음으로 표시.
- **직무:** 백엔드·프론트엔드·AI·게임의 검토 초점. 숫자 점수나 합격 확률을 만들지 않음.
- **개선 Diff:** 원문·제안·이유·사용 근거, 적용·거절·직접 수정. 원문이나 직무가 바뀌면 재분석이 필요하며 자동으로 덮어쓰지 않음.
- **Builder:** 기본 정보·기술·포함할 프로젝트·순서·별도 설명 편집, 실시간/전체 미리보기, Markdown·독립 HTML 다운로드.
- **인증·저장:** 이메일/비밀번호 가입·로그인·로그아웃, 운영 환경 Supabase Auth·PostgreSQL 저장, 사용자 RLS와 충돌 감지. 로컬 개발은 SQLite, 체험 자료는 별도 localStorage에 보관.
- **복구:** 저장 상태·백업, API 실패 안내, 손상된 체험 데이터 덮어쓰기 방지, 분석 실패 시 규칙 기반 처리.

## 디자인 기준

[Notion의 2026-09-11 재설계 결정](https://app.notion.com/p/35a7cdef782d81af9b8ffcca837fe420)이 제품 기준입니다. 사용자가 제공한 [최종 Figma Make](https://www.figma.com/make/KpsMyE47m5jvFtKUa0veg9/CoFolio?p=f&t=ys03fvZ0rwEHTiaX-0)의 실제 화면과 다운로드한 소스를 확인해 UI 기준으로 삼았습니다.

밝은 중성 배경, 블루/인디고 포인트, 224px 탐색기, 편집·근거 분석 영역, Dashboard·Diff·Builder 구성을 반영했습니다. Figma의 샘플 점수는 근거 상태로 바꾸고 개인 기여나 성과를 자동 채워 넣지 않았습니다.

## 선택적 AI 설정

기존 파일이 없다면 `cofolio-app/.env.example`을 `.env.local`로 복사하고 아래 값을 서버 환경에 설정합니다. 기존 `.env.local`은 덮어쓰지 마세요.

```dotenv
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash
```

로컬은 서버 재시작, Vercel은 환경변수 설정 후 재배포하고 분석 버튼으로 호출합니다. 운영 환경의 실제 AI 호출은 로그인이 필요하며 비회원은 규칙 분석을 사용합니다. **실제 모델 호출 검증은 사용자의 요청으로 추후 진행합니다.** 이번 QA는 키 없는 규칙 경로와 모의 모델의 성공·실패·잘못된 출력 경로를 검증했습니다.

모델 호출은 서버에서만 실행됩니다. Vite는 `PUBLIC_` 접두사의 환경변수만 노출하므로 기존 `VITE_GEMINI_API_KEY`도 클라이언트에 포함하지 않습니다. 새 키는 반드시 `GEMINI_API_KEY`를 사용하세요.

## 검증

```powershell
cd cofolio-app
npm test
npm run lint
npm run build
```

`build`에 프런트·서버 TypeScript 검사가 포함됩니다. 검증 범위는 [QA 기록](docs/redesign-v2-qa.md)을 참고하세요. 새 활성 코드에 lint를 적용하며, 사용자의 기존 수정 사항이 있는 비활성 V1은 보존했습니다. `npm run lint:legacy`는 별도 검사입니다.

## 빌드 결과 실행

```powershell
cd cofolio-app
npm run build
npm start
```

[빌드 화면](http://127.0.0.1:4174)에서 정적 앱과 API가 함께 제공됩니다. 기본 바인딩은 로컬 컴퓨터의 `127.0.0.1`입니다.

SQLite 데이터는 `cofolio-app/data/cofolio.sqlite`에 저장되고 Git에서 제외됩니다. 서버 재시작 후에도 유지됩니다. 운영 시 영구 디스크와 HTTPS 프록시가 필요하며 `DATABASE_PATH`, `APP_ORIGIN`, `COOKIE_SECURE=true`를 설정합니다. Node의 SQLite 실험 기능 경고는 런타임 안내입니다.

Vercel에서는 `api/[...path].ts`와 `api/auth/[action].ts`가 `server/cloud.ts`의 API를 실행합니다. 기존 V1 Supabase 테이블을 보존하고 별도 `cofolio_v2` schema에 저장합니다. 서버리스 환경에서는 SQLite를 사용하지 않습니다. 배포 명령·환경변수·인증 콜백은 [배포 문서](docs/deployment.md)를 참고하세요.

## 구조와 문서

```text
cofolio-app/
  src/v2/          화면, 상태, 도메인, 규칙 분석, 내보내기
  api/             Vercel 함수 진입점
  server/          로컬/클라우드 API, 인증, SQLite, GitHub import, AI 단계
  supabase/        운영 DB migration, RLS와 transactional RPC
  tests/           도메인/실제 HTTP/DB 통합 테스트
  scripts/dev.ts   UI와 API 동시 실행
  src/pages/       기존 V1 보존 (활성 진입점에서 사용하지 않음)
docs/
  redesign-v2-plan.md
  redesign-v2-architecture.md
  redesign-v2-qa.md
  sql/supabase-v2-reference.sql
```

- [구현 판단과 계획](docs/redesign-v2-plan.md)
- [데이터·API·AI 구조](docs/redesign-v2-architecture.md)
- [실제 검증 결과와 후순위 범위](docs/redesign-v2-qa.md)

로컬 SQLite 계정과 운영 Supabase 계정은 별개입니다. V1 및 로컬 자료의 자동 이전은 제공하지 않습니다. 실제 운영 migration은 `cofolio-app/supabase/migrations/`가 기준이며 `docs/sql/`은 초기 설계 참고안입니다.

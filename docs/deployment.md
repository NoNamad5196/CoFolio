# Vercel 운영 배포

2026-09-11, 사용자의 직접 배포 요청에 따라 V2를 공개했다.

- 운영 주소: [cofolio-app.vercel.app](https://cofolio-app.vercel.app)
- 검증한 배포: `dpl_ByUz7UL3u6hxqRSCS1fUKQ6uYskW`
- Vercel: `nonamad5196s-projects/cofolio-app`, Vite, Node `24.x`
- Supabase: `cofolio` (`xdcvztmaznexgopaccxq`), Seoul
- 작업 브랜치: `redesign-v2`. 2026-09-11 운영 배포는 CLI로 작업 디렉터리에서 수행했다. 2026-10-04 사용자의 요청으로 V2 코드·배포 설정·검증 문서를 Git 커밋과 `master` 반영 대상으로 정리했다.

## 구성

정적 UI + `api/[...path].ts` 및 `api/auth/[action].ts` → `server/cloud.ts` → Supabase Auth/PostgreSQL.

Vercel Vite 구성에서 인증 하위 경로가 별도 함수 진입점을 필요로 해 `/api/auth/*`를 명시했다. 두 함수는 동일 handler를 사용한다. `api/tsconfig.json`은 함수 빌드의 Node 타입과 TypeScript 상대 경로 변환을 설정한다. SPA rewrite는 `/api/`를 제외한다.

로컬 `npm run dev`와 `npm start`는 SQLite 서버를 사용한다. 로컬 자료와 운영 자료는 자동 동기화하지 않는다. 기존 V1 public 테이블도 보존했다.

## 환경변수와 인증

| 변수 | 용도 |
| --- | --- |
| `SUPABASE_URL`, `SUPABASE_ANON_KEY` | 서버 Supabase 연결 |
| `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` | 현재 프로젝트에 이미 설정된 서버 호환 별칭 |
| `GEMINI_API_KEY` | 선택 사항, 실제 AI를 켤 때 서버에 설정 |
| `GEMINI_MODEL` | 선택 사항, 기본 `gemini-2.5-flash` |

Vite는 `PUBLIC_`만 노출한다. 기존 `VITE_` 키도 클라이언트에 주입하지 않으며 service_role 키는 사용하지 않는다. 기존 Groq 설정은 V2에서 사용하지 않는다. 현재 Gemini 키가 없어 규칙 분석을 제공한다. 실제 모델 검증은 사용자가 추후 진행하기로 했다.

Supabase Site URL은 `https://cofolio-app.vercel.app`, 허용 Redirect URL은 `https://cofolio-app.vercel.app/api/auth/callback`이다. 가입 확인이 필요하면 메일 확인을 안내하고 동일 브라우저의 PKCE callback으로 세션을 교환한다. 이번 QA에서는 메일을 발송하지 않아 실제 메일 전달은 미검증이다.

## DB

`cofolio-app/supabase/migrations/`의 001 → 002 → 003을 적용했다. 이미 적용한 운영 DB에 001을 다시 실행하지 않는다.

- 001: 별도 `cofolio_v2` schema, 7개 관계와 migration 이력, RLS, load/save RPC.
- 002: 저장 함수의 PL/pgSQL 변수 참조 수정.
- 003: revision 충돌을 `PT409`로 반환해 [Supabase의 40001 재시도 문제](https://supabase.com/docs/guides/troubleshooting/high-cpu-and-infinite-transaction-retries-when-using-custom-error-codes-in-rpc-functions-77326b)를 회피.

8개 테이블의 RLS 활성화를 확인했다. authenticated 사용자만 public RPC를 호출할 수 있고 private schema는 Data API에 노출하지 않는다. 사용자 JWT, SECURITY INVOKER, 소유자 lock, revision, 부모-소유자 복합 외래키로 관계 저장을 보호한다.

## 배포와 복구

```powershell
cd cofolio-app
npm test
npm run lint
npm run build
vercel deploy --prod --skip-domain --yes
vercel curl /api/health --deployment <후보-배포-URL>
vercel curl /api/auth/session --deployment <후보-배포-URL>
vercel promote <검증한-배포-URL> --yes
```

후보 배포는 운영 환경변수를 사용한다. 대표 주소 연결 후 health의 `storage: supabase`, 인증 세션, 로그인·저장·새로고침을 확인한다. 새 배포에 문제가 생기면 위 검증 배포 ID를 `vercel promote`에 지정해 복구할 수 있다. DB migration은 배포 rollback과 별개다.

## 운영 검증 결과

- 공개 API의 health 200, 비회원 session, workspace 401, 잘못된 callback 303.
- 실제 `octocat/Hello-World` GitHub와 한국어 README 가져오기.
- 승인받은 계정 2개의 로그인·HttpOnly/Secure 쿠키·로그아웃.
- 근거·분석·제안을 포함한 저장·조회, 다른 계정의 조회/덮어쓰기 차단.
- stale revision HTTP 409, 잘못된 Origin HTTP 403.
- 잘못된 관계 저장의 전체 rollback, 동시 저장 1회 성공·1회 충돌.
- 실제 브라우저 로그인 → Builder 편집 → 저장 → 재접속 → 복원 → 미리보기 → 로그아웃. 최종 콘솔 error/warn 0.
- QA 계정 2개 및 연결된 테스트 자료 삭제 완료. 기존 계정 유지.
- 자동 테스트 26개, 활성 코드 lint, TypeScript, Vercel production build 통과.

실제 메일 전달·Gemini 호출·비밀번호 재설정/OAuth·V1/SQLite 자료 이전은 이번 운영 QA 범위 밖이다. 요청 제한은 함수 인스턴스별이며 전역 분산 제한은 후속 운영 개선 범위다. 기존 화면·반응형·내보내기 검증은 [V2 QA 기록](redesign-v2-qa.md)을 참고한다.

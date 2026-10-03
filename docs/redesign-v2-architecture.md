# V2 구조와 동작

## 범위

React 19 / TypeScript / Vite / React Router와 기존 공통 SVG Icon을 유지했다. 기존 Builder·Context·Local save·Export·LLM·Preview를 읽고 패턴만 참고했으며, V2의 근거·revision·소유권 모델은 새로 구현했다. 최종 Figma의 탐색 SVG와 UI 구성을 사용했다. 기존 V1 소스와 사용자의 수정은 보존하고 main/App 진입점을 V2로 전환했다.

## 화면과 상태

- `WorkspaceApp`: 공통 Shell, route, 오류 경계, 모바일 탐색.
- `WorkspaceContext`: 로그인 여부에 따른 로드, 650ms 저장 debounce, 직렬 저장 queue, 분석과 제안 적용.
- `workspaceState`: 안정적인 Context와 hook. Provider에서 분리해 개발 중 Fast Refresh의 Context 교체 오류를 방지.
- `domain`: Zod 도메인과 전이. 데이터 version=2, project revision, suggestion pending/applied/rejected/stale.
- `analysis`: 제공된 진술과 자료에만 의존하는 로컬 기준 분석.
- `export`: Builder와 동일한 포함 여부·순서·설명·연락처를 Markdown/HTML로 렌더링. HTML escape와 URL protocol 검사.

분석 중 원문을 바꾸면 오래된 결과가 최신 편집을 덮어쓰지 않는다. 제안 적용은 revision·before 원문·현재 직무를 검증한다. 적용 후 다른 대기 제안은 재검토 대상으로 표시한다. 거절은 원문을 바꾸지 않는다.

## Import와 근거

공개 GitHub URL은 `https://github.com/owner/repo`만 허용한다. GitHub REST의 metadata, languages, README를 서버에서 요청한다. 임의 URL/내부 주소나 저장소 전체 코드는 가져오지 않는다. metadata 오류는 재시도 가능 오류로, README 부재는 가져온 metadata를 유지한 안내로 처리한다.

README 보관은 최대 24,000자, 기본 근거 발췌는 최대 12,000자다. 명시된 소개·문제·구현 절은 각각 최대 3,000자를 프로젝트 차원의 근거로 연결한다. 사용자 진술 필드는 자동 채우지 않는다. 입력한 README와 직접 진술은 사용자가 제공한 자료이며 독립적으로 검증된 사실이 아니다. 공개 저장소의 배포 URL도 주소의 존재만 가져오며 서비스 실행 성공을 의미하지 않는다.

근거 종류는 `repository / readme / user`다. 원문, 출처 URL, 수집 시각, 검증 여부, 해당 경험 필드를 저장한다. 코드 실행·테스트 실행·개인 담당 범위 추론은 하지 않는다.

## AI Pipeline

1. **Input:** Zod로 프로젝트/직무 입력 검증.
2. **Project extraction:** 근거 ID와 원문 인용 배열. 모델 인용이 실제 발췌에 포함되는지 검사.
3. **Evidence:** 저장소 사실과 사용자 진술 분리. 모델에는 최대 24개 × 2,400자만 전달.
4. **Gap analysis:** 8개 criterion이 중복 없이 존재해야 함. schema, 근거 ID, 개인 경험 필드의 user 출처를 검사.
5. **Suggestion / Rewrite:** 사용자 진술만 제공. 제안 field/after/reason/evidenceIds 검증, 새 숫자 방지, 자동 적용 금지.
6. **UI 검토:** before/after와 이유·근거를 보여주고 사용자가 적용·수정·거절.

Gemini REST에 JSON schema를 전달하고 응답을 다시 Zod로 검증한다. 각 원격 단계 timeout은 25초다. 잘못된 JSON·누락 필드·네트워크 실패·근거 없는 인용은 서비스 오류로 전파하지 않고 단계별 규칙 결과로 대체한다. engine을 `rules / hybrid / ai`로 구분한다.

키가 없으면 원격 호출 없이 규칙 분석을 사용한다. 빈 개인 기여/기술 선택/성과를 채우지 않고, 규칙 rewrite는 이미 입력된 진술을 순서대로 재구성한다. 입력이 너무 길면 잘라서 주장하지 않고 제안을 생략한다.

schema·인용·숫자 검사는 비수치적 과장까지 완전히 증명하지 못한다. 모델 문장에 대한 최종 사실 검토는 적용 전 사용자가 수행한다. 실제 Gemini 호출 품질·응답 호환성 검증은 사용자가 키 설정을 미뤄 아직 수행하지 않았다.

## 저장과 인증

로컬은 Node 내장 SQLite, Vercel은 Supabase Auth/PostgreSQL을 사용한다. UI와 API 응답 schema는 동일하고 서버 진입점만 구분한다.

| 관계 | 역할 |
| --- | --- |
| users → sessions | 로컬 scrypt·7일 세션 / 운영 Supabase Auth·서버 쿠키 |
| users → portfolios | 사용자당 1개 작업 공간, role, document, server revision |
| portfolios → projects | 순서와 프로젝트 문서 |
| projects → evidence | 원문·출처 |
| projects → analyses | 최신 분석과 분석 직무 |
| projects → suggestions | 적용·거절 기록과 대기 제안 |
| target_roles | 백엔드·프론트엔드·AI·게임 |

로컬은 SQLite 외래키·WAL·transaction, 운영은 PostgreSQL RPC transaction과 RLS로 관련 행을 함께 저장한다. 문서 snapshot과 관계 테이블을 동시에 유지한다. 서버가 세션으로 user_id를 결정하며 클라이언트의 사용자 ID를 신뢰하지 않는다. 운영 RPC는 `auth.uid()`와 SECURITY INVOKER로 소유권을 제한한다. 서버 revision이 다르면 HTTP 409로 반환해 조용한 덮어쓰기를 막는다.

비회원은 `cofolio.workspace.v2.guest`에 저장한다. 계정 자료는 브라우저에 캐시하지 않고 서버에서 로드한다. 로그인·로그아웃은 체험과 계정 자료를 합치지 않는다. 손상된 체험 자료는 유지하고 백업/계정 이용을 안내한다.

쿠키는 HttpOnly·SameSite=Lax이며 HTTPS 운영 시 Secure를 켠다. 변경 요청은 Origin과 JSON content type을 검사한다. 로그인/import/analyze 요청 제한, 요청 본문 크기 제한, 경로와 URL 검증이 있다. API 키·비밀번호·본문은 로그에 출력하지 않는다.

## HTTP API

| Method | 경로 | 기능 |
| --- | --- | --- |
| GET | /api/health | API/저장 방식/AI 설정 유무 |
| GET | /api/auth/session | 현재 사용자 |
| POST | /api/auth/register | 가입, 운영 이메일 확인 필요 상태 지원 |
| GET | /api/auth/callback | Supabase PKCE 이메일 확인 code 교환 |
| POST | /api/auth/login | 로그인 |
| POST | /api/auth/logout | 세션 제거 |
| GET | /api/workspace | 로그인한 사용자 자료 |
| PUT | /api/workspace | 소유권·revision 검증 후 저장 |
| POST | /api/import | 공개 GitHub / README / 직접 입력 |
| POST | /api/analyze | 단계별 분석과 제안 |

Import/분석은 비회원 체험에도 제공한다. 오류는 400/401/403/404/409/413/429/500 등으로 구분하고 UI에서 한국어로 표시한다. 세션이나 API가 끊겨도 편집 중인 내용을 유지하고 백업할 수 있다.

## Supabase 운영 어댑터

[실제 migration](../cofolio-app/supabase/migrations/)을 기존 cofolio 프로젝트에 적용했다. `cofolio_v2`의 7개 관계와 migration 이력 테이블에 RLS를 켰으며 V1 public 테이블은 보존했다. private schema를 Data API에 노출하지 않고 `public.cofolio_v2_load/save` 두 RPC만 authenticated 역할에 허용한다. service_role 키를 사용하지 않는다.

`api/[...path].ts` → `server/cloud.ts` → Supabase Auth·RPC로 연결한다. HttpOnly·Secure·SameSite=Lax 쿠키에 세션을 보관하고 `getUser()`로 검증한다. 첫 저장도 소유자 advisory transaction lock으로 직렬화하며, 문서와 자식 관계가 한 transaction으로 저장된다. 부모-소유자 복합 외래키가 다른 사용자 관계 삽입을 막는다.

충돌은 `PT409`를 사용한다. Supabase의 [40001 재시도 문제](https://supabase.com/docs/guides/troubleshooting/high-cpu-and-infinite-transaction-retries-when-using-custom-error-codes-in-rpc-functions-77326b)를 원격 QA에서 확인하고 회피했다. Supabase 네트워크 요청은 15초로 제한한다. 로그인/import/analyze 제한은 함수 인스턴스별이며 전역 분산 rate limiter는 후속 운영 개선 범위다. 실제 AI는 로그인 사용자에게만 제공한다.

가입 확인이 필요하면 UI에 메일 확인을 안내하며 PKCE callback을 처리한다. 실제 메일 전달은 이번 QA에서 발송하지 않았다. 비밀번호 재설정·OAuth·V1/SQLite 자동 이전은 후순위다. 환경 설정은 [배포 문서](deployment.md)를 따른다.

설계 시 확인한 공식 문서: [GitHub contents API](https://docs.github.com/en/rest/repos/contents?apiVersion=2022-11-28), [Gemini structured output](https://ai.google.dev/gemini-api/docs/structured-output), [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security).

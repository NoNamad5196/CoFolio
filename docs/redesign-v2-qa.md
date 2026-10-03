# CoFolio V2 QA 기록

검증일: 2026-09-11. 브랜치: `redesign-v2`. Windows / Node 24.12 / Chrome 및 Codex 인앱 브라우저를 사용했다. 로컬 QA 후 Vercel/Supabase 운영 검증을 추가했다.

## 최종 결과

| 확인 | 결과 |
| --- | --- |
| `npm test` | 26개 통과, 실패 0 |
| `npm run lint` | 활성 V2·API·테스트·진입점 통과 |
| `npm run build` | 프런트/서버 TypeScript 검사와 production build 통과 |
| `npm audit fix` | 기존 호환 버전 범위의 취약 의존성 수정, 보고된 취약점 0 |
| `git diff --check` | 공백 오류 없음 |
| Production UI + API | 4174 포트에서 실제 브라우저 열기 성공 |
| Vercel 운영 UI + API | `https://cofolio-app.vercel.app`, Supabase 인증·저장·사용자 격리 검증 완료 |
| Production console | error/warn 0 |
| 브라우저 크기 | 1440×1000, 768×1024, 390×844 및 넓은 production 화면 확인 |

V1의 기존 수정 파일은 보존했다. 비활성 V1 lint 오류는 별도 `lint:legacy` 대상이며 이번 활성 V2 검사 통과와 구분한다. Node의 SQLite ExperimentalWarning은 서버 플랫폼 안내다.

## 실제 브라우저 확인

| 화면 / 동작 | 확인한 내용 |
| --- | --- |
| Dashboard | 빈 상태, 사용자가 선택하는 예시 진입, 프로젝트 수·최신 분석·제안·다음 보완 항목 |
| GitHub Import | 실제 `octocat/Hello-World` metadata와 README 가져오기, 개인 기여 자동 입력 없음 |
| README Import | 한국어 주문 관리 README 입력과 보존, 개인 진술과 출처 구분 |
| 직접 입력 | 별도 계정의 테스트 프로젝트 생성 |
| Workspace | 프로젝트 설명·문제·구현·기여·기술 선택·문제 해결 입력, 자동 저장 |
| Evidence | README와 사용자 진술 표시, 근거 없는 개인 성과가 missing으로 유지됨 |
| 분석 / 재분석 | 8개 기준, 보완 질문, 규칙 engine 안내, 편집 후 재분석 표시 |
| 직무 변경 | 백엔드/게임 전환에 따라 다른 관련 근거·검토 초점, 4개 직무 선택 |
| Diff | 원문과 제안 비교, 사용 근거·이유 표시, 거절 시 원문 유지 |
| Diff 직접 수정 / 적용 | 수정한 텍스트가 원문에 반영, 대기/적용/거절 기록 유지, 적용 후 읽기 전용 표시 |
| Builder | 이름·소개·기술 입력, 프로젝트 순서 이동, 포함 제외, 변경 내용 미리보기 반영 |
| Export | Markdown·HTML을 실제로 다운로드하고 파일 내용 확인. 제외한 프로젝트는 포함되지 않음 |
| Auth / Save | 실제 가입·로그인·로그아웃, 서버 재시작/새로고침 후 계정 자료 복원 |
| 체험/계정 격리 | 로그인 후 별도 작업 공간, 로그아웃 후 기존 체험 프로젝트 복원 |
| 모바일/태블릿 | 메뉴·폼·편집·미리보기 확인, 숨긴 메뉴의 접근성 트리 제외, 가로 넘침 없음 |
| Production | 빌드 정적 파일·API 통합 화면, 초기 빈 상태와 정상 저장, 콘솔 오류 없음 |

브라우저 QA에는 명시적으로 `QA ·` 접두사를 붙인 합성 프로젝트와 테스트 계정을 사용했다. 실제 사용자의 경력/성과가 아니다. 운영 QA 계정 2개는 사용자 승인 후 생성했으며 검증 후 삭제했다. 체험 자료는 브라우저 origin별로 다르다.

## Vercel / Supabase 추가 검증

[배포 기록](deployment.md)에 운영 주소와 최종 배포 ID를 기록했다. 공개 주소에서 GitHub/README import, 쿠키 로그인, 근거·분석·제안 저장, 조회, 다른 계정 접근 차단, HTTP 409/403, 로그아웃을 검증했다. DB RPC로 동시 저장과 실패 시 transaction rollback도 확인했다. 브라우저에서 Builder 소개를 편집·저장하고 재접속 후 복원했으며 미리보기와 로그아웃을 확인했다. 최종 콘솔 error/warn은 0건이다.

## 자동 테스트 범위

- 실제 모양의 GitHub 응답과 UTF-8 README, metadata만 있는 저장소, HTTP 403/404, URL·SSRF 차단.
- README의 문제·구현 절 발췌, 개인 기여·선택 이유·성과를 저장소에서 추론하지 않음.
- 4개 직무의 검토 초점, 사용자 진술 provenance, 입력을 변경하지 않는 제안 생성.
- 직접 수정 적용·거절·stale 제안 차단, 과도하게 긴 입력에 대한 안전한 제안 생략.
- 모의 모델 3단계 성공, 네트워크 실패, schema 누락, 잘못된 인용, 중복 기준, 없는 수치 생성 차단, 부분 fallback.
- HTML script escape, 안전하지 않은 URL 제외, 포함 여부·순서 일치, 예시 배지와 프로필 링크 유지.
- DB 재연결 후 관계 데이터 복원, 다른 사용자 소유권 차단, revision 충돌, 비밀번호 해시·세션 만료/삭제 구조.
- 실제 로컬 HTTP API의 가입·로그인·저장·로그아웃·사용자 격리·잘못된 Origin과 인증 오류.
- 클라우드 handler의 비회원 import/분석, 입력·Origin·경로 오류, 이메일 확인 대기 상태, 요청 제한.

테스트는 Node test runner로 실행하며 DB 테스트는 임시 SQLite 또는 메모리 DB를 사용한다. AI 성공·실패 테스트는 주입한 모의 단계이며 실제 Gemini 응답을 사용하지 않았다.

## 발견 후 수정한 문제

- 실행 환경의 네트워크 차단: 실제 GitHub 요청이 허용된 서버 실행으로 재검증.
- 개발 중 Context Fast Refresh 오류: Context/hook과 Provider 모듈 분리.
- Diff 적용 뒤 오래된 거절 제안으로 선택 이동: 최근 제안 선택 유지.
- 적용된 제안에 편집 UI가 남음: 처리 완료 후 읽기 전용 표시.
- 모바일 숨겨진 탐색 메뉴가 접근성 트리에 남음: visibility와 expanded 상태 반영.
- 화면 이동 후 이전 스크롤 위치 유지: route 변경 시 본문 스크롤 초기화.
- export에서 프로필 GitHub/예시 표시 누락: preview와 일치하도록 반영.
- 과도한 진술 연결이 출력 schema 제한을 넘음: 원문을 자르지 않고 제안 생략.
- 활성 의존성 audit 경고: 호환 업데이트 후 0건 확인.
- Vercel 제외 패턴이 V1 `src/data`까지 제외: `/data/`로 한정.
- 함수 빌드의 TypeScript 상대 경로/Node 타입 오류: 별도 API tsconfig 추가.
- 저장 RPC 변수 참조 오류: 명시적 PL/pgSQL label로 수정.
- 충돌 시 Supabase 40001 재시도: `PT409`로 변경 후 동시 저장 재검증.
- Vercel 인증 하위 경로 404: `api/auth/[action].ts` 추가 후 공개 API와 브라우저 재검증.

## 추후 검증 / 후순위

1. **실제 Gemini API 호출:** 사용자가 키 설정을 나중에 진행하기로 하여 미실행. 서버 `GEMINI_API_KEY` 설정 후 실제 출력 품질·schema 호환성·timeout 경로를 확인할 것.
2. **가입 메일 전달:** 이메일 확인 대기 UI와 PKCE callback은 구현했지만 실제 확인 메일은 발송하지 않았다.
3. **확장 기능:** private GitHub/OAuth, 소스 코드·테스트 실행 검증, PDF·공개 링크, 협업, 비밀번호 재설정, 전역 분산 요청 제한.
4. **데이터 편의:** V1/SQLite 자동 이전·백업 JSON 가져오기, 프로젝트 삭제·휴지통, 분석 전체 이력 보존. 현재 백업은 다운로드를 제공하며 최신 분석과 최근 제안 처리 기록을 저장함.

현재 완료 범위는 로컬 Workspace V2와 Vercel/Supabase 운영 배포다. 위 후순위 기능이 구현된 것처럼 표시하지 않는다.

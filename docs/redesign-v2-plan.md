# CoFolio Workspace V2 구현 계획

기준일: 2026-09-11. 브랜치: `redesign-v2`.

## Source of Truth
- [Notion 최신 재설계 결정](https://app.notion.com/p/35a7cdef782d81af9b8ffcca837fe420)의 상단 `2026-09-11 재설계 결정`을 확인했다.
- Developer Workspace × Career Intelligence. 자연스러운 한국어, 프로젝트 탐색기 / 편집 / 근거 분석의 3열 구조.
- 사용자가 제공한 [최종 Figma Make](https://www.figma.com/make/KpsMyE47m5jvFtKUa0veg9/CoFolio?p=f&t=ys03fvZ0rwEHTiaX-0)의 실제 화면과 코드 다운로드를 확인했다. 최종 밝은 중성색·블루/인디고 UI를 적용했다. Figma 샘플의 숫자 점수는 사용자의 요구대로 근거 상태로 바꿨다.

## 기존 코드 판단
| 판단 | 대상 | 이유 |
|---|---|---|
| KEEP | React 19, TypeScript, Vite, Router, 아이콘 SVG | 가볍고 현재 실행 가능한 기반 |
| REFACTOR | Context와 local save 개념, 입력 폼, Markdown/HTML export | 버전 검증, 사용자 격리, 근거와 제안 모델, HTML escape 필요 |
| REBUILD | Dashboard, Builder, Preview, Import, 분석, 인증·저장 | 기존 순차 폼과 범용 SaaS UI는 Workspace에 맞지 않음 |
| REMOVE from active app | 랜딩 가격표·템플릿·임의 숫자 점수, 거대한 단일 프롬프트, 브라우저 LLM SDK | 최신 방향과 불일치; v1 소스는 기존 수정 사항 보존을 위해 남김 |

## 실행
1. Zod 도메인 스키마, 직무별 기준, evidence provenance, 분석 / 제안의 상태·revision 설계.
2. Node 24 API + SQLite 영구 저장과 계정 인증. User → Portfolio → Project → Evidence / Analysis / Suggestion 관계, 모든 조회·수정에서 소유권 검증. 비회원 체험은 별도 브라우저 저장.
3. 공개 GitHub metadata + bounded README import, README 직접 붙여넣기, 수동 입력. 확인하지 않은 개인 기여·기술 선택·성과는 추정하지 않음.
4. 추출 → 근거 → gap → 제안 pipeline. 주요 출력 검증, 증거 인용 검증, LLM 오류 시 명확히 표시된 규칙 기반 fallback. API 키는 서버 전용.
5. 프로젝트 탐색 / 편집 / 분석 3열 Workspace, 대시보드, Diff 적용·거절·수정, 직무 변경, Builder 순서·포함 여부, Preview, Markdown/HTML export.
6. 테스트 및 실제 브라우저 QA: 생성→분석→보완→재분석→Diff→Builder→저장→미리보기. 인증 격리·실패·입력 오류·좁은 화면. TypeScript, lint, production build, README.

## 저장 기술 결정
초기 로컬 MVP는 Node 내장 SQLite로 완성했다. 이후 사용자의 직접 Vercel 배포 요청에 따라 Supabase Auth·PostgreSQL 어댑터와 Vercel 함수를 추가했다. 기존 V1 테이블을 보존하고 별도 `cofolio_v2` schema에 migration을 적용했다. 최신 운영 구성은 [배포 문서](deployment.md)가 기준이다.

## 완료 기준
실제 import, 근거 연결·누락 정보·직무별 분석, 자동 덮어쓰기 없는 제안, Builder, 영구 저장·소유권, 오류 복구, 브라우저 QA, responsive, build, 문서.

## 실행 결과
위 기능을 V2 활성 경로에 구현했다. 상세 범위와 검증은 [구조](redesign-v2-architecture.md), [QA](redesign-v2-qa.md), [README](../README.md)에 기록한다. 실제 Gemini 호출 검증은 사용자의 요청으로 추후 진행하며, 이번에는 규칙 기반 경로와 모의 출력 검증을 완료한다.

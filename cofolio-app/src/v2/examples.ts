import { makeProject } from "./domain.ts";
import { analyzeRules, collectEvidence, ruleSuggestions } from "./analysis.ts";
import type { Project } from "./domain.ts";
export function exampleProjects(): Project[] {
  const commerce = makeProject("쇼핑몰 주문 관리 시스템", "example");
  commerce.stack = ["NestJS", "TypeScript", "PostgreSQL"];
  commerce.period = "2026.03 — 2026.06";
  commerce.fields = {
    summary: "팀 프로젝트에서 주문 관리 서비스를 개발했습니다.",
    problem:
      "동시에 주문이 발생하면 재고가 음수가 되는 문제가 있었습니다. 주문이 취소된 경우 재고가 복구되어야 했습니다.",
    implementation:
      "주문 생성 API와 재고 테이블을 구현했습니다. 주문 처리와 재고 갱신을 하나의 트랜잭션으로 처리했습니다.",
    contribution: "",
    techReason: "",
    troubleshooting:
      "동시 주문 테스트에서 재고 초과 차감을 확인했습니다. 행 잠금을 적용한 후 동일한 테스트를 반복해 재고가 음수가 되지 않는지 확인했습니다.",
    outcome: "",
  };
  const chat = makeProject("실시간 채팅 서비스", "example");
  chat.stack = ["React", "TypeScript", "Socket.io"];
  chat.fields.summary = "소규모 스터디를 위한 실시간 채팅 서비스입니다.";
  chat.fields.contribution =
    "메시지 목록 컴포넌트와 소켓 연결 상태 관리, 연결이 끊겼을 때 재시도하는 UI를 직접 구현했습니다.";
  const model = makeProject("이미지 분류 실험 기록", "example");
  model.stack = ["Python", "PyTorch", "FastAPI"];
  model.fields.summary =
    "분류 모델의 실험 조건과 평가 결과를 기록하는 프로젝트입니다.";
  model.fields.problem =
    "실험마다 데이터 분할과 설정이 달라 모델 성능을 동일한 조건에서 비교하기 어려웠습니다.";
  return [commerce, chat, model].map((p) => ({
    ...p,
    evidence: collectEvidence(p),
    analysis: analyzeRules(p, "backend"),
    suggestions: ruleSuggestions(p),
  }));
}

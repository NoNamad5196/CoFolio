import { z } from "zod";
export async function api<T>(
  path: string,
  schema: z.ZodType<T>,
  data?: unknown,
  method = "POST",
): Promise<T> {
  const response = await fetch(`/api${path}`, {
    method: data === undefined ? "GET" : method,
    credentials: "same-origin",
    headers:
      data === undefined ? undefined : { "Content-Type": "application/json" },
    body: data === undefined ? undefined : JSON.stringify(data),
    signal: AbortSignal.timeout(path === "/analyze" ? 100000 : 35000),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok)
    throw new Error(
      typeof result.error === "string"
        ? result.error
        : "서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.",
    );
  return schema.parse(result);
}

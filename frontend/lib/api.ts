const baseUrl = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
).replace(/\/$/, "");

export function responseMessage(value: unknown): string | undefined {
  if (typeof value === "string" && value.length > 0) return value;
  if (
    value &&
    typeof value === "object" &&
    "message" in value &&
    typeof value.message === "string"
  )
    return value.message;
  return undefined;
}

export async function request(path: string, method = "GET", body?: unknown) {
  let response: Response;
  try {
    response = await fetch(`${baseUrl}/api/v1/${path}`, {
      method,
      cache: "no-store",
      headers:
        body === undefined ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(15000),
    });
  } catch {
    throw new Error(
      "Unable to connect to the backend. Check that the Spring Boot server is running.",
    );
  }
  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }
  if (!response.ok)
    throw new Error(
      responseMessage(data) ?? `Request failed (HTTP ${response.status}).`,
    );
  return data;
}

export function errorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "The request could not be completed.";
}
export function money(amount: number) {
  return `${new Intl.NumberFormat("en", { maximumFractionDigits: 2 }).format(amount)} ⃁`;
}

import type { AuthConfig } from "./types.js";

export function buildAuthHeaders(auth: AuthConfig): Record<string, string> {
  if (auth.type === "none" || !auth.token) return {};

  if (auth.type === "bearer") {
    return { Authorization: `Bearer ${auth.token}` };
  }

  if (auth.type === "apiKey") {
    const header = auth.headerName ?? "X-API-Key";
    return { [header]: auth.token };
  }

  return {};
}

export function attachAuthToUrl(url: string, auth: AuthConfig): string {
  if (auth.type !== "apiKey" || !auth.token) return url;
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}api_key=${encodeURIComponent(auth.token)}`;
}

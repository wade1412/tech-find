const DEFAULT_ALLOWED_ORIGINS = new Set([
  "https://tech-find.vercel.app",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
]);

const getAllowedOrigins = () => {
  const configuredOrigins =
    Deno.env
      .get("ALLOWED_CORS_ORIGINS")
      ?.split(",")
      .map((origin) => origin.trim())
      .filter(Boolean) ?? [];

  return new Set([...DEFAULT_ALLOWED_ORIGINS, ...configuredOrigins]);
};

export const getCorsHeaders = (
  request: Request,
): Record<string, string> | null => {
  const requestOrigin = request.headers.get("Origin");

  if (requestOrigin && !getAllowedOrigins().has(requestOrigin)) {
    return null;
  }

  return {
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Origin":
      requestOrigin ?? "https://tech-find.vercel.app",
    Vary: "Origin",
  };
};

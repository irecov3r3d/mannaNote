/**
 * Gemini model defaults shared by client (Settings, saved prefs) and server.
 *
 * gemini-2.0-flash was shut down on June 1, 2026. Google's documented
 * replacement is gemini-3.6-flash (no shutdown date announced as of Nov 2026).
 * See https://ai.google.dev/gemini-api/docs/deprecations
 */
export const DEFAULT_GEMINI_MODEL = "gemini-3.6-flash";

/** Model ids that no longer answer API calls (or never will again). */
const RETIRED_GEMINI_MODEL_PATTERNS: RegExp[] = [
  /^gemini-pro$/i,
  /^gemini-pro-vision$/i,
  /^gemini-1\.0-/i,
  /^gemini-1\.5-/i,
  /^gemini-2\.0-/i,
  /^gemini-2\.5-(pro|flash)-preview/i,
  /^gemini-2\.5-flash-lite-preview/i,
  /^gemini-3-pro-preview$/i,
];

export function isRetiredGeminiModel(model: string): boolean {
  const id = model.trim().replace(/^models\//, "");
  return RETIRED_GEMINI_MODEL_PATTERNS.some((re) => re.test(id));
}

/** Blank or retired ids fall back to the current default. */
export function normalizeGeminiModel(model?: string | null): string {
  const id = String(model ?? "").trim().replace(/^models\//, "");
  if (!id || isRetiredGeminiModel(id)) return DEFAULT_GEMINI_MODEL;
  return id;
}

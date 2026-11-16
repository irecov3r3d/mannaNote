/**
 * Provider-agnostic completion used by the MannaNote server functions.
 *
 * Default: xAI grok-4.5 via the platform-injected XAI_API_KEY (server-only).
 * Optional: the user's own Gemini key, stored locally and passed per request,
 * or a server-side GEMINI_API_KEY / GOOGLE_API_KEY env var.
 *
 * Fallback order:
 *  - provider "xai": XAI_API_KEY, else Gemini (user key, then server key)
 *  - provider "gemini": user key, then server key, else XAI_API_KEY
 * When nothing is configured a single clear error explains what to add.
 * Never log keys. Never send them back to the client.
 */
import { normalizeGeminiModel } from "./gemini-models.ts";

export const NO_AI_PROVIDER_ERROR =
  "No AI provider is configured. Add a Google AI Studio (Gemini) key in Settings, or set GEMINI_API_KEY or XAI_API_KEY on the server.";

export function serverGeminiKey(): string {
  return (
    process.env.GEMINI_API_KEY?.trim() ||
    process.env.GOOGLE_API_KEY?.trim() ||
    ""
  );
}

export type CompletionInput = {
  system: string;
  user: string;
  maxTokens?: number;
  provider: "xai" | "gemini";
  geminiApiKey?: string;
  geminiModel?: string;
};

export type CompletionResult =
  | { ok: true; text: string; provider: "xai" | "gemini" }
  | { ok: false; error: string };

async function completeXai(
  system: string,
  user: string,
  maxTokens: number,
): Promise<CompletionResult> {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) {
    return { ok: false, error: "Grok is not available in this environment." };
  }
  const res = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "grok-4.5",
      temperature: 0.35,
      max_tokens: maxTokens,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    return {
      ok: false,
      error: `Grok request failed (${res.status})${errText ? `: ${errText.slice(0, 180)}` : ""}`,
    };
  }
  const body = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const text = body.choices?.[0]?.message?.content ?? "";
  if (!text) return { ok: false, error: "Grok returned an empty response." };
  return { ok: true, text, provider: "xai" };
}

async function completeGemini(
  system: string,
  user: string,
  maxTokens: number,
  apiKey: string,
  model: string,
): Promise<CompletionResult> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: [{ role: "user", parts: [{ text: user }] }],
      generationConfig: {
        temperature: 0.35,
        maxOutputTokens: maxTokens,
        responseMimeType: "application/json",
      },
    }),
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    return {
      ok: false,
      error: `Gemini request failed (${res.status})${errText ? `: ${errText.slice(0, 180)}` : ""}`,
    };
  }
  const body = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  const text =
    body.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ??
    "";
  if (!text) return { ok: false, error: "Gemini returned an empty response." };
  return { ok: true, text, provider: "gemini" };
}

export async function completeJson(
  input: CompletionInput,
): Promise<CompletionResult> {
  const maxTokens = input.maxTokens ?? 3500;
  const xaiKey = process.env.XAI_API_KEY?.trim() || "";
  const geminiKey = input.geminiApiKey?.trim() || serverGeminiKey();
  const model = normalizeGeminiModel(input.geminiModel);

  const useGemini = input.provider === "gemini" ? Boolean(geminiKey) || !xaiKey : !xaiKey;
  if (useGemini) {
    if (!geminiKey) return { ok: false, error: NO_AI_PROVIDER_ERROR };
    return completeGemini(input.system, input.user, maxTokens, geminiKey, model);
  }
  return completeXai(input.system, input.user, maxTokens);
}

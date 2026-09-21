/**
 * Provider-agnostic completion used by the MannaNote server functions.
 *
 * Default: xAI grok-4.5 via the platform-injected XAI_API_KEY (server-only).
 * Optional: the user's own Gemini key, stored locally and passed per request.
 * Never log keys. Never send them back to the client.
 */

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
  if (input.provider === "gemini") {
    const key = input.geminiApiKey?.trim();
    if (!key) {
      return {
        ok: false,
        error: "Add a Google AI Studio key in Settings to use Gemini.",
      };
    }
    return completeGemini(
      input.system,
      input.user,
      maxTokens,
      key,
      input.geminiModel?.trim() || "gemini-2.0-flash",
    );
  }
  return completeXai(input.system, input.user, maxTokens);
}

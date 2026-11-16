import type { AiClientOpts } from "@/lib/ai/server";
import type { Preferences } from "./types";
import { normalizeGeminiModel } from "@/lib/ai/gemini-models";

export function aiOptsFromPrefs(prefs?: Preferences | null): AiClientOpts {
  return {
    provider: prefs?.aiProvider ?? "xai",
    geminiApiKey: prefs?.geminiApiKey || undefined,
    geminiModel: normalizeGeminiModel(prefs?.geminiModel),
  };
}

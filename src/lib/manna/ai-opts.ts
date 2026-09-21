import type { AiClientOpts } from "@/lib/ai/server";
import type { Preferences } from "./types";

export function aiOptsFromPrefs(prefs?: Preferences | null): AiClientOpts {
  return {
    provider: prefs?.aiProvider ?? "xai",
    geminiApiKey: prefs?.geminiApiKey || undefined,
    geminiModel: prefs?.geminiModel || undefined,
  };
}

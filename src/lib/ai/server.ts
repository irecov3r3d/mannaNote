import { createServerFn } from "@tanstack/react-start";
import type {
  ActiveLens,
  AudioOverviewData,
  ClaimVerification,
  DifferentiatorAnalysis,
  MindMapData,
  SourcePayload,
  StudyMode,
} from "@/lib/manna/types";
import {
  analysisSystem,
  analysisUser,
  audioSystem,
  audioUser,
  claimSystem,
  claimUser,
  mindMapSystem,
  mindMapUser,
} from "./prompts";
import {
  coerceAnalysis,
  coerceAudio,
  coerceMindMap,
  extractJsonObject,
} from "./parse";

export type AiClientOpts = {
  provider: "xai" | "gemini";
  geminiApiKey?: string;
  geminiModel?: string;
};

type AnalysisInput = AiClientOpts & {
  sources: SourcePayload[];
  activeLens: ActiveLens;
  mode: StudyMode;
  focusQuestion?: string;
};

type ClaimInput = AiClientOpts & {
  query: string;
  sources: SourcePayload[];
  activeLens: ActiveLens;
};

type MindMapInput = AiClientOpts & {
  sources: SourcePayload[];
  activeLens: ActiveLens;
  mode: StudyMode;
  focusQuestion?: string;
};

type AudioInput = AiClientOpts & {
  sources: SourcePayload[];
  activeLens: ActiveLens;
  mode: StudyMode;
  length: "short" | "standard";
  focusQuestion?: string;
};

export type AnalysisOk = {
  ok: true;
  analysis: DifferentiatorAnalysis;
  provider: "xai" | "gemini";
};
export type MindMapOk = {
  ok: true;
  data: MindMapData;
  provider: "xai" | "gemini";
};
export type AudioOk = {
  ok: true;
  data: AudioOverviewData;
  provider: "xai" | "gemini";
};
export type ClaimOk = {
  ok: true;
  analysis: DifferentiatorAnalysis;
  verification: ClaimVerification;
  provider: "xai" | "gemini";
};
export type AiErr = { ok: false; error: string };

function guardSources(sources: SourcePayload[]): string | null {
  if (!sources?.length) return "Select at least one source.";
  const chars = sources.reduce(
    (n, s) => n + s.chunks.reduce((m, c) => m + c.text.length, 0),
    0,
  );
  if (chars < 40) return "The selected sources do not contain enough text.";
  return null;
}

async function runComplete(
  input: import("./complete.server.ts").CompletionInput,
) {
  const { completeJson } = await import("./complete.server.ts");
  return completeJson(input);
}

export const fetchAiStatus = createServerFn({ method: "POST" }).handler(
  async () => {
    return { xai: Boolean(process.env.XAI_API_KEY) };
  },
);

export const fetchDifferentiatorAnalysis = createServerFn({ method: "POST" })
  .validator((input: AnalysisInput) => input)
  .handler(async ({ data }): Promise<AnalysisOk | AiErr> => {
    const blocked = guardSources(data.sources);
    if (blocked) return { ok: false, error: blocked };
    const result = await runComplete({
      provider: data.provider,
      geminiApiKey: data.geminiApiKey,
      geminiModel: data.geminiModel,
      maxTokens: 4200,
      system: analysisSystem(data.mode),
      user: analysisUser({
        lens: data.activeLens,
        mode: data.mode,
        sources: data.sources,
        focusQuestion: data.focusQuestion,
      }),
    });
    if (!result.ok) return result;
    try {
      const analysis = coerceAnalysis(extractJsonObject(result.text));
      return { ok: true, analysis, provider: result.provider };
    } catch (err) {
      return {
        ok: false,
        error:
          err instanceof Error
            ? err.message
            : "Could not parse the analysis JSON.",
      };
    }
  });

export const fetchClaimVerification = createServerFn({ method: "POST" })
  .validator((input: ClaimInput) => input)
  .handler(async ({ data }): Promise<ClaimOk | AiErr> => {
    if (!data.query?.trim()) return { ok: false, error: "Enter a claim to verify." };
    const blocked = guardSources(data.sources);
    if (blocked) return { ok: false, error: blocked };
    const result = await runComplete({
      provider: data.provider,
      geminiApiKey: data.geminiApiKey,
      geminiModel: data.geminiModel,
      maxTokens: 2800,
      system: claimSystem(),
      user: claimUser({
        lens: data.activeLens,
        claim: data.query.trim(),
        sources: data.sources,
      }),
    });
    if (!result.ok) return result;
    try {
      const analysis = coerceAnalysis(extractJsonObject(result.text));
      const verification: ClaimVerification = analysis.claims[0] ?? {
        claim: data.query.trim(),
        evidence: analysis.tradition_a.summary,
        counter_arguments: analysis.tradition_b.summary,
        confidence: 0.45,
        citations: [
          ...analysis.tradition_a.citations,
          ...analysis.tradition_b.citations,
        ],
      };
      return { ok: true, analysis, verification, provider: result.provider };
    } catch (err) {
      return {
        ok: false,
        error:
          err instanceof Error
            ? err.message
            : "Could not parse the verification JSON.",
      };
    }
  });

export const fetchMindMapData = createServerFn({ method: "POST" })
  .validator((input: MindMapInput) => input)
  .handler(async ({ data }): Promise<MindMapOk | AiErr> => {
    const blocked = guardSources(data.sources);
    if (blocked) return { ok: false, error: blocked };
    const result = await runComplete({
      provider: data.provider,
      geminiApiKey: data.geminiApiKey,
      geminiModel: data.geminiModel,
      maxTokens: 3200,
      system: mindMapSystem(data.mode),
      user: mindMapUser({
        lens: data.activeLens,
        mode: data.mode,
        sources: data.sources,
        focusQuestion: data.focusQuestion,
      }),
    });
    if (!result.ok) return result;
    try {
      const parsed = coerceMindMap(extractJsonObject(result.text));
      if (!parsed.nodes.length) {
        return { ok: false, error: "The model returned an empty concept graph." };
      }
      return { ok: true, data: parsed, provider: result.provider };
    } catch (err) {
      return {
        ok: false,
        error:
          err instanceof Error
            ? err.message
            : "Could not parse the mind map JSON.",
      };
    }
  });

export const fetchAudioOverviewScript = createServerFn({ method: "POST" })
  .validator((input: AudioInput) => input)
  .handler(async ({ data }): Promise<AudioOk | AiErr> => {
    const blocked = guardSources(data.sources);
    if (blocked) return { ok: false, error: blocked };
    const result = await runComplete({
      provider: data.provider,
      geminiApiKey: data.geminiApiKey,
      geminiModel: data.geminiModel,
      maxTokens: data.length === "short" ? 2200 : 3400,
      system: audioSystem(data.mode, data.length),
      user: audioUser({
        lens: data.activeLens,
        mode: data.mode,
        sources: data.sources,
        length: data.length,
        focusQuestion: data.focusQuestion,
      }),
    });
    if (!result.ok) return result;
    try {
      const parsed = coerceAudio(extractJsonObject(result.text));
      if (!parsed.script.trim()) {
        return { ok: false, error: "The model returned an empty script." };
      }
      return { ok: true, data: parsed, provider: result.provider };
    } catch (err) {
      return {
        ok: false,
        error:
          err instanceof Error
            ? err.message
            : "Could not parse the overview script.",
      };
    }
  });

export const fetchStudioSpeech = createServerFn({ method: "POST" })
  .validator((input: { text: string }) => input)
  .handler(
    async ({
      data,
    }): Promise<{ ok: true; audioBase64: string; mime: string } | AiErr> => {
      const apiKey = process.env.XAI_API_KEY;
      if (!apiKey) {
        return { ok: false, error: "Studio voice is not available here." };
      }
      const text = data.text.trim().slice(0, 1400);
      if (text.length < 8) {
        return { ok: false, error: "Nothing to speak." };
      }
      const res = await fetch("https://api.x.ai/v1/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ text, voice_id: "eve" }),
      });
      if (!res.ok) {
        return {
          ok: false,
          error: `Studio voice failed (${res.status}). Use browser playback instead.`,
        };
      }
      const buf = new Uint8Array(await res.arrayBuffer());
      let binary = "";
      const chunk = 0x8000;
      for (let i = 0; i < buf.length; i += chunk) {
        binary += String.fromCharCode(...buf.subarray(i, i + chunk));
      }
      const audioBase64 = btoa(binary);
      const mime = res.headers.get("content-type") || "audio/mpeg";
      return { ok: true, audioBase64, mime };
    },
  );

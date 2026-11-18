import { afterEach, beforeEach, describe, it } from "node:test";
import assert from "node:assert/strict";
import { completeJson, NO_AI_PROVIDER_ERROR } from "./complete.server.ts";
import { DEFAULT_GEMINI_MODEL } from "./gemini-models.ts";

type Call = { url: string; init: RequestInit };
const ENV_KEYS = ["XAI_API_KEY", "GEMINI_API_KEY", "GOOGLE_API_KEY"] as const;
let saved: Record<string, string | undefined> = {};
let calls: Call[] = [];
const realFetch = globalThis.fetch;

function json(body: unknown) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

beforeEach(() => {
  saved = Object.fromEntries(ENV_KEYS.map((k) => [k, process.env[k]]));
  for (const k of ENV_KEYS) delete process.env[k];
  calls = [];
  globalThis.fetch = (async (url: string | URL, init?: RequestInit) => {
    const u = String(url);
    calls.push({ url: u, init: init ?? {} });
    if (u.includes("api.x.ai")) {
      return json({ choices: [{ message: { content: '{"ok":"xai"}' } }] });
    }
    return json({ candidates: [{ content: { parts: [{ text: '{"ok":"gemini"}' }] } }] });
  }) as typeof fetch;
});

afterEach(() => {
  globalThis.fetch = realFetch;
  for (const k of ENV_KEYS) {
    if (saved[k] === undefined) delete process.env[k];
    else process.env[k] = saved[k];
  }
});

const base = { system: "s", user: "u" };

describe("completeJson provider fallback", () => {
  it("uses Grok when XAI_API_KEY is set", async () => {
    process.env.XAI_API_KEY = "x";
    const r = await completeJson({ ...base, provider: "xai" });
    assert.deepEqual(r, { ok: true, text: '{"ok":"xai"}', provider: "xai" });
    assert.match(calls[0].url, /api\.x\.ai/);
  });

  it("falls back to the user's Gemini key when Grok is missing", async () => {
    const r = await completeJson({ ...base, provider: "xai", geminiApiKey: "g" });
    assert.equal(r.ok && r.provider, "gemini");
    assert.match(calls[0].url, new RegExp(`models/${DEFAULT_GEMINI_MODEL}:generateContent`));
    assert.match(calls[0].url, /key=g/);
  });

  it("falls back to a server GEMINI_API_KEY", async () => {
    process.env.GEMINI_API_KEY = "srv";
    const r = await completeJson({ ...base, provider: "gemini" });
    assert.equal(r.ok && r.provider, "gemini");
    assert.match(calls[0].url, /key=srv/);
  });

  it("migrates a retired saved model before calling Gemini", async () => {
    await completeJson({
      ...base,
      provider: "gemini",
      geminiApiKey: "g",
      geminiModel: "gemini-2.0-flash",
    });
    assert.doesNotMatch(calls[0].url, /gemini-2\.0-flash/);
    assert.match(calls[0].url, new RegExp(DEFAULT_GEMINI_MODEL));
  });

  it("Gemini selected without any Gemini key uses Grok if available", async () => {
    process.env.XAI_API_KEY = "x";
    const r = await completeJson({ ...base, provider: "gemini" });
    assert.equal(r.ok && r.provider, "xai");
  });

  it("returns one clear error when nothing is configured", async () => {
    for (const provider of ["xai", "gemini"] as const) {
      const r = await completeJson({ ...base, provider });
      assert.deepEqual(r, { ok: false, error: NO_AI_PROVIDER_ERROR });
    }
    assert.equal(calls.length, 0);
  });
});

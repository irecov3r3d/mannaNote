import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_GEMINI_MODEL,
  isRetiredGeminiModel,
  normalizeGeminiModel,
} from "./gemini-models.ts";

describe("gemini model defaults", () => {
  it("default is not a retired model", () => {
    assert.equal(isRetiredGeminiModel(DEFAULT_GEMINI_MODEL), false);
    assert.notEqual(DEFAULT_GEMINI_MODEL, "gemini-2.0-flash");
  });

  it("migrates retired ids (gemini-2.0-flash shut down June 1, 2026)", () => {
    for (const id of [
      "gemini-2.0-flash",
      "gemini-2.0-flash-001",
      "gemini-2.0-flash-lite",
      "models/gemini-2.0-flash",
      "gemini-1.5-pro",
      "gemini-pro",
    ]) {
      assert.equal(normalizeGeminiModel(id), DEFAULT_GEMINI_MODEL, id);
    }
  });

  it("keeps current ids and blanks fall back", () => {
    assert.equal(normalizeGeminiModel("gemini-3.8-flash"), "gemini-3.8-flash");
    assert.equal(normalizeGeminiModel(" gemini-3.6-flash "), "gemini-3.6-flash");
    assert.equal(normalizeGeminiModel(""), DEFAULT_GEMINI_MODEL);
    assert.equal(normalizeGeminiModel(undefined), DEFAULT_GEMINI_MODEL);
    assert.equal(normalizeGeminiModel(null), DEFAULT_GEMINI_MODEL);
  });
});

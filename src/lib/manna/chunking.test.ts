import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { chunkText, selectChunksForModel } from "./chunking.ts";

const para = (n: number, len = 300) => `P${n} ` + "word ".repeat(Math.ceil(len / 5)).trim();

describe("chunkText", () => {
  it("returns nothing for blank input", () => {
    assert.deepEqual(chunkText("   \n\n  ", "s"), []);
  });

  it("keeps a short text as one chunk", () => {
    const chunks = chunkText("In the beginning.", "src");
    assert.equal(chunks.length, 1);
    assert.equal(chunks[0].text, "In the beginning.");
    assert.equal(chunks[0].sourceId, "src");
    assert.equal(chunks[0].index, 0);
  });

  it("splits long text into ordered chunks whose offsets point at their text", () => {
    const text = Array.from({ length: 12 }, (_, i) => para(i)).join("\r\n\r\n\r\n");
    const normalized = text.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
    const chunks = chunkText(text, "src");
    assert.ok(chunks.length > 1);
    chunks.forEach((c, i) => {
      assert.equal(c.index, i);
      assert.ok(c.id.startsWith("src-"));
      assert.ok(c.text.length <= 900 + 400, `chunk ${i} too long`);
      assert.equal(normalized.slice(c.startOffset, c.endOffset).trim(), c.text);
    });
    assert.equal(new Set(chunks.map((c) => c.id)).size, chunks.length);
    const joined = chunks.map((c) => c.text).join("\n\n");
    for (let i = 0; i < 12; i += 1) assert.ok(joined.includes(`P${i} `));
  });
});

describe("selectChunksForModel", () => {
  const chunks = Array.from({ length: 30 }, (_, i) => ({
    id: `c${i}`,
    sourceId: "s",
    index: i,
    text: "x".repeat(i === 0 ? 2000 : 50),
    startOffset: 0,
    endOffset: 0,
  }));

  it("caps to head + tail in order and clips long chunks", () => {
    const out = selectChunksForModel(chunks, 6, 100);
    assert.deepEqual(out.map((c) => c.index), [0, 1, 2, 27, 28, 29]);
    assert.equal(out[0].text.length, 101);
    assert.ok(out[0].text.endsWith("…"));
  });

  it("returns everything when under the cap", () => {
    assert.equal(selectChunksForModel(chunks.slice(0, 4)).length, 4);
  });
});

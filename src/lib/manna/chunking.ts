import { uid } from "@/lib/utils";
import type { SourceChunk } from "./types";

const TARGET = 900;
const MIN_FLUSH = 220;

/** Split a source into citation-sized passages, preserving offsets. */
export function chunkText(text: string, sourceId: string): SourceChunk[] {
  const normalized = text.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  if (!normalized) return [];

  const paragraphs = normalized.split(/\n{2,}/);
  const chunks: SourceChunk[] = [];
  let buf = "";
  let bufStart = 0;
  let cursor = 0;
  let index = 0;

  const flush = (end: number) => {
    const body = buf.trim();
    if (!body) return;
    chunks.push({
      id: `${sourceId}-${uid().slice(0, 8)}-${index}`,
      sourceId,
      index,
      text: body,
      startOffset: bufStart,
      endOffset: end,
    });
    index += 1;
    buf = "";
  };

  for (const para of paragraphs) {
    const at = normalized.indexOf(para, cursor);
    const start = at >= 0 ? at : cursor;
    if (buf && buf.length + para.length + 2 > TARGET && buf.length >= MIN_FLUSH) {
      flush(start);
      bufStart = start;
    }
    if (!buf) bufStart = start;
    buf = buf ? `${buf}\n\n${para}` : para;
    cursor = start + para.length;
  }
  flush(normalized.length);

  if (chunks.length === 0) {
    chunks.push({
      id: `${sourceId}-0`,
      sourceId,
      index: 0,
      text: normalized,
      startOffset: 0,
      endOffset: normalized.length,
    });
  }
  return chunks;
}

/** Cap context sent to the model: first + last + densest middle chunks. */
export function selectChunksForModel(
  chunks: SourceChunk[],
  maxChunks = 12,
  maxChars = 1200,
): { index: number; text: string }[] {
  const clipped = chunks.map((c) => ({
    index: c.index,
    text: c.text.length > maxChars ? `${c.text.slice(0, maxChars).trimEnd()}…` : c.text,
  }));
  if (clipped.length <= maxChunks) return clipped;
  const head = clipped.slice(0, Math.ceil(maxChunks / 2));
  const tail = clipped.slice(-Math.floor(maxChunks / 2));
  const seen = new Set(head.map((c) => c.index));
  const merged = [...head];
  for (const c of tail) {
    if (!seen.has(c.index)) {
      merged.push(c);
      seen.add(c.index);
    }
  }
  return merged.sort((a, b) => a.index - b.index);
}

import { uid, wordCount } from "@/lib/utils";
import { chunkText, selectChunksForModel } from "./chunking";
import { getDb } from "./db";
import { SAMPLE_LIBRARY } from "./samples";
import type {
  ConfidenceLevel,
  SourcePayload,
  SourceRecord,
} from "./types";

export async function addSource(opts: {
  title: string;
  text: string;
  confidenceLevel: ConfidenceLevel;
  lensTags: string[];
  filename?: string;
  mime?: string;
  origin?: SourceRecord["metadata"]["origin"];
}): Promise<SourceRecord> {
  const db = getDb();
  const now = Date.now();
  const record: SourceRecord = {
    id: uid(),
    title: opts.title.trim() || "Untitled source",
    fullText: opts.text.trim(),
    confidenceLevel: opts.confidenceLevel,
    lensTags: opts.lensTags,
    metadata: {
      filename: opts.filename,
      mime: opts.mime,
      wordCount: wordCount(opts.text),
      origin: opts.origin ?? "upload",
    },
    createdAt: now,
    updatedAt: now,
  };
  const chunks = chunkText(record.fullText, record.id);
  await db.transaction("rw", db.sources, db.chunks, async () => {
    await db.sources.put(record);
    await db.chunks.bulkPut(chunks);
  });
  return record;
}

export async function updateSource(
  id: string,
  patch: Partial<
    Pick<SourceRecord, "title" | "confidenceLevel" | "lensTags" | "fullText">
  >,
): Promise<void> {
  const db = getDb();
  const current = await db.sources.get(id);
  if (!current) return;
  const next: SourceRecord = {
    ...current,
    ...patch,
    updatedAt: Date.now(),
  };
  if (patch.fullText && patch.fullText !== current.fullText) {
    next.metadata = {
      ...next.metadata,
      wordCount: wordCount(patch.fullText),
    };
    const chunks = chunkText(next.fullText, id);
    await db.transaction("rw", db.sources, db.chunks, async () => {
      await db.chunks.where("sourceId").equals(id).delete();
      await db.sources.put(next);
      await db.chunks.bulkPut(chunks);
    });
    return;
  }
  await db.sources.put(next);
}

export async function deleteSource(id: string): Promise<void> {
  const db = getDb();
  await db.transaction("rw", db.sources, db.chunks, db.notes, async () => {
    await db.sources.delete(id);
    await db.chunks.where("sourceId").equals(id).delete();
    await db.notes.where("sourceId").equals(id).delete();
  });
}

export async function loadSampleLibrary(): Promise<number> {
  const db = getDb();
  const existing = await db.sources.toArray();
  const titles = new Set(existing.map((s) => s.title));
  let added = 0;
  for (const sample of SAMPLE_LIBRARY) {
    if (titles.has(sample.title)) continue;
    await addSource({
      title: sample.title,
      text: sample.text,
      confidenceLevel: sample.confidenceLevel,
      lensTags: sample.lensTags,
      origin: "sample",
    });
    added += 1;
  }
  return added;
}

export async function toPayloads(ids: string[]): Promise<SourcePayload[]> {
  const db = getDb();
  const payloads: SourcePayload[] = [];
  for (const id of ids) {
    const source = await db.sources.get(id);
    if (!source) continue;
    const chunks = await db.chunks.where("sourceId").equals(id).sortBy("index");
    payloads.push({
      id: source.id,
      title: source.title,
      confidenceLevel: source.confidenceLevel,
      lensTags: source.lensTags,
      chunks: selectChunksForModel(chunks),
    });
  }
  return payloads;
}

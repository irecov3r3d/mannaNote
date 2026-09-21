/**
 * Local vault — IndexedDB via Dexie.
 *
 * This is intentionally client-only. Do not import from server functions.
 * Schema notes:
 *  - sources hold full text so the reader can open a work offline
 *  - chunks are the citation unit the AI must quote against
 *  - comparisons / overviews store structured JSON, not prose blobs
 *  - preferences.id is always "main" (single-user local app)
 */
import Dexie, { type Table } from "dexie";
import type {
  ComparisonRecord,
  NoteRecord,
  OverviewRecord,
  Preferences,
  SourceChunk,
  SourceRecord,
} from "./types";
import { DEFAULT_LENS } from "./lenses";

export class MannaDB extends Dexie {
  sources!: Table<SourceRecord, string>;
  chunks!: Table<SourceChunk, string>;
  preferences!: Table<Preferences, string>;
  comparisons!: Table<ComparisonRecord, string>;
  notes!: Table<NoteRecord, string>;
  overviews!: Table<OverviewRecord, string>;

  constructor() {
    super("MannaNote");
    this.version(1).stores({
      sources: "id, createdAt, confidenceLevel, title",
      chunks: "id, sourceId, index",
      preferences: "id",
      comparisons: "id, createdAt",
      notes: "id, sourceId, createdAt",
      overviews: "id, createdAt, type",
    });
  }
}

let instance: MannaDB | null = null;

export function getDb(): MannaDB {
  if (typeof indexedDB === "undefined") {
    throw new Error("MannaNote vault requires a browser with IndexedDB.");
  }
  if (!instance) instance = new MannaDB();
  return instance;
}

export const DEFAULT_PREFS: Preferences = {
  id: "main",
  activeLens: DEFAULT_LENS,
  theme: "dark",
  onboardingComplete: false,
  aiProvider: "xai",
  geminiApiKey: "",
  geminiModel: "gemini-2.0-flash",
};

export async function ensurePreferences(): Promise<Preferences> {
  const db = getDb();
  const existing = await db.preferences.get("main");
  if (existing) return existing;
  await db.preferences.put(DEFAULT_PREFS);
  return DEFAULT_PREFS;
}

export async function updatePreferences(
  patch: Partial<Omit<Preferences, "id">>,
): Promise<Preferences> {
  const db = getDb();
  const current = await ensurePreferences();
  const next = { ...current, ...patch, id: "main" as const };
  await db.preferences.put(next);
  if (patch.theme) {
    try {
      localStorage.setItem("mannanote-theme", patch.theme);
    } catch {
      /* ignore quota */
    }
  }
  if (patch.onboardingComplete) {
    try {
      localStorage.setItem("mannanote-onboarded", "1");
    } catch {
      /* ignore */
    }
  }
  return next;
}

export async function clearVault(): Promise<void> {
  const db = getDb();
  await Promise.all([
    db.sources.clear(),
    db.chunks.clear(),
    db.comparisons.clear(),
    db.notes.clear(),
    db.overviews.clear(),
  ]);
}

import { create } from "zustand";
import type { ConfidenceLevel, StudyMode } from "./types";

type UIState = {
  sourceA: string | null;
  sourceB: string | null;
  extraSourceIds: string[];
  studyMode: StudyMode;
  viewingSourceId: string | null;
  highlightChunk: number | null;
  vaultQuery: string;
  vaultConfidence: ConfidenceLevel | "all";
  focusQuestion: string;
  setSourceA: (id: string | null) => void;
  setSourceB: (id: string | null) => void;
  toggleExtra: (id: string) => void;
  setStudyMode: (mode: StudyMode) => void;
  openSource: (id: string, chunk?: number | null) => void;
  closeSource: () => void;
  setVaultQuery: (q: string) => void;
  setVaultConfidence: (c: ConfidenceLevel | "all") => void;
  setFocusQuestion: (q: string) => void;
};

export const useMannaUI = create<UIState>((set) => ({
  sourceA: null,
  sourceB: null,
  extraSourceIds: [],
  studyMode: "differentiator",
  viewingSourceId: null,
  highlightChunk: null,
  vaultQuery: "",
  vaultConfidence: "all",
  focusQuestion: "",
  setSourceA: (id) => set({ sourceA: id }),
  setSourceB: (id) => set({ sourceB: id }),
  toggleExtra: (id) =>
    set((s) => ({
      extraSourceIds: s.extraSourceIds.includes(id)
        ? s.extraSourceIds.filter((x) => x !== id)
        : [...s.extraSourceIds, id],
    })),
  setStudyMode: (mode) => set({ studyMode: mode }),
  openSource: (id, chunk = null) =>
    set({ viewingSourceId: id, highlightChunk: chunk }),
  closeSource: () => set({ viewingSourceId: null, highlightChunk: null }),
  setVaultQuery: (q) => set({ vaultQuery: q }),
  setVaultConfidence: (c) => set({ vaultConfidence: c }),
  setFocusQuestion: (q) => set({ focusQuestion: q }),
}));

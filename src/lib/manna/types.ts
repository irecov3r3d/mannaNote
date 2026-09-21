/**
 * MannaNote vault schema.
 *
 * Everything the user loads, annotates, or generates lives in IndexedDB
 * (see db.ts). These types are the contract between the vault, the study
 * workspace, and the AI layer — keep them in sync when adding modes.
 */

export type ConfidenceLevel = "primary" | "scholarly" | "reference" | "web";

export type StudyMode =
  | "isolation"
  | "comparative"
  | "differentiator"
  | "inversion";

export type LensFamily =
  | "christian"
  | "gnostic"
  | "vedic"
  | "hebrew"
  | "buddhist"
  | "philosophical"
  | "secular"
  | "custom";

export type ActiveLens = {
  family: LensFamily;
  branch: string;
  customLabel?: string;
};

export type SourceChunk = {
  id: string;
  sourceId: string;
  index: number;
  text: string;
  startOffset: number;
  endOffset: number;
};

export type SourceRecord = {
  id: string;
  title: string;
  fullText: string;
  confidenceLevel: ConfidenceLevel;
  lensTags: string[];
  metadata: {
    filename?: string;
    mime?: string;
    wordCount: number;
    origin?: "upload" | "paste" | "sample";
  };
  createdAt: number;
  updatedAt: number;
};

export type AiProvider = "xai" | "gemini";

export type Preferences = {
  id: "main";
  activeLens: ActiveLens;
  theme: "dark" | "light";
  onboardingComplete: boolean;
  aiProvider: AiProvider;
  geminiApiKey: string;
  geminiModel: string;
};

export type Citation = {
  sourceId: string;
  sourceTitle: string;
  chunkIndex: number;
  quote: string;
};

export type TraditionBlock = {
  label: string;
  summary: string;
  citations: Citation[];
};

export type ClaimVerification = {
  claim: string;
  evidence: string;
  counter_arguments: string;
  confidence: number;
  citations: Citation[];
};

export type DifferentiatorAnalysis = {
  topic: string;
  tradition_a: TraditionBlock;
  tradition_b: TraditionBlock;
  additional_traditions?: TraditionBlock[];
  core_divergence: string;
  underlying_axioms: string;
  historical_context: string;
  confidence_notes: string;
  claims: ClaimVerification[];
};

export type ComparisonRecord = {
  id: string;
  sourceIds: string[];
  mode: StudyMode;
  lens: ActiveLens;
  topic: string;
  analysis: DifferentiatorAnalysis;
  createdAt: number;
};

export type NoteRecord = {
  id: string;
  sourceId: string;
  quote: string;
  chunkIndex?: number;
  text: string;
  createdAt: number;
};

export type MindMapNode = {
  id: string;
  label: string;
  detail?: string;
  tradition?: string;
  sourceId?: string;
  citation?: string;
  parentId?: string | null;
};

export type MindMapData = {
  topic: string;
  mermaid: string;
  nodes: MindMapNode[];
};

export type AudioBeat = {
  heading: string;
  narration: string;
};

export type AudioOverviewData = {
  title: string;
  durationHint: string;
  script: string;
  beats: AudioBeat[];
};

export type OverviewRecord = {
  id: string;
  type: "mindmap" | "audio";
  sourceIds: string[];
  mode: StudyMode;
  lens: ActiveLens;
  title: string;
  payload: MindMapData | AudioOverviewData;
  createdAt: number;
};

export type SourcePayload = {
  id: string;
  title: string;
  confidenceLevel: ConfidenceLevel;
  lensTags: string[];
  chunks: { index: number; text: string }[];
};

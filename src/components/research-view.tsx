import { useLiveQuery } from "dexie-react-hooks";
import { Loader2, ShieldQuestion } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AnalysisReport } from "@/components/analysis-report";
import { ConfidenceBadge } from "@/components/confidence-badge";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import {
  fetchClaimVerification,
  fetchDifferentiatorAnalysis,
} from "@/lib/ai/server";
import { aiOptsFromPrefs } from "@/lib/manna/ai-opts";
import { getDb } from "@/lib/manna/db";
import { STUDY_MODES } from "@/lib/manna/lenses";
import { useMannaUI } from "@/lib/manna/store";
import type { ComparisonRecord, DifferentiatorAnalysis, SourceRecord } from "@/lib/manna/types";
import { toPayloads } from "@/lib/manna/vault";
import { uid } from "@/lib/utils";
import { cn, truncate } from "@/lib/utils";

function SourceSelect({
  label,
  value,
  onChange,
  sources,
  exclude,
}: {
  label: string;
  value: string | null;
  onChange: (id: string | null) => void;
  sources: SourceRecord[];
  exclude?: string | null;
}) {
  return (
    <label className="block min-w-0">
      <span className="text-[11px] font-medium tracking-wide text-muted-foreground">
        {label}
      </span>
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || null)}
        className="mt-1 h-11 w-full rounded-md border border-input bg-paper px-3 text-sm text-foreground"
      >
        <option value="">Choose a source</option>
        {sources
          .filter((s) => s.id !== exclude)
          .map((s) => (
            <option key={s.id} value={s.id}>
              {s.title}
            </option>
          ))}
      </select>
    </label>
  );
}

function TextPane({ source }: { source?: SourceRecord }) {
  const openSource = useMannaUI((s) => s.openSource);
  if (!source) {
    return (
      <div className="flex min-h-32 items-center rounded-xl bg-paper px-4 py-6 text-sm text-muted-foreground shadow-[var(--shadow-border)]">
        Select a source to read it here.
      </div>
    );
  }
  return (
    <button
      type="button"
      onClick={() => openSource(source.id)}
      className="block w-full rounded-xl bg-paper p-4 text-left shadow-[var(--shadow-border)]"
    >
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <p className="font-serif text-lg leading-snug">{source.title}</p>
        <ConfidenceBadge level={source.confidenceLevel} compact />
      </div>
      <p className="source-prose line-clamp-6 whitespace-pre-wrap">
        {truncate(source.fullText, 900)}
      </p>
      <p className="mt-3 text-[11px] text-muted-foreground">Open full text</p>
    </button>
  );
}

export function ResearchView() {
  const sources = useLiveQuery(
    () => getDb().sources.orderBy("createdAt").reverse().toArray(),
    [],
  );
  const prefs = useLiveQuery(() => getDb().preferences.get("main"), []);
  const history = useLiveQuery(
    () => getDb().comparisons.orderBy("createdAt").reverse().limit(12).toArray(),
    [],
  );
  const sourceA = useMannaUI((s) => s.sourceA);
  const sourceB = useMannaUI((s) => s.sourceB);
  const extraSourceIds = useMannaUI((s) => s.extraSourceIds);
  const setSourceA = useMannaUI((s) => s.setSourceA);
  const setSourceB = useMannaUI((s) => s.setSourceB);
  const toggleExtra = useMannaUI((s) => s.toggleExtra);
  const studyMode = useMannaUI((s) => s.studyMode);
  const setStudyMode = useMannaUI((s) => s.setStudyMode);
  const focusQuestion = useMannaUI((s) => s.focusQuestion);
  const setFocusQuestion = useMannaUI((s) => s.setFocusQuestion);
  const [pane, setPane] = useState<"a" | "b" | "analysis">("analysis");
  const [busy, setBusy] = useState<"compare" | "claim" | null>(null);
  const [analysis, setAnalysis] = useState<DifferentiatorAnalysis | null>(null);
  const [claim, setClaim] = useState("");

  const list = sources ?? [];
  const a = list.find((s) => s.id === sourceA);
  const b = list.find((s) => s.id === sourceB);

  const selectedIds = useMemo(() => {
    const ids = [sourceA, sourceB, ...extraSourceIds].filter(
      (id): id is string => Boolean(id),
    );
    return [...new Set(ids)];
  }, [sourceA, sourceB, extraSourceIds]);

  async function runCompare() {
    if (!prefs) return;
    if (selectedIds.length < 2) {
      toast.error("Choose at least two sources.");
      return;
    }
    setBusy("compare");
    try {
      const payloads = await toPayloads(selectedIds);
      const res = await fetchDifferentiatorAnalysis({
        data: {
          ...aiOptsFromPrefs(prefs),
          sources: payloads,
          activeLens: prefs.activeLens,
          mode: studyMode,
          focusQuestion: focusQuestion || undefined,
        },
      });
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      setAnalysis(res.analysis);
      setPane("analysis");
      const record: ComparisonRecord = {
        id: uid(),
        sourceIds: selectedIds,
        mode: studyMode,
        lens: prefs.activeLens,
        topic: res.analysis.topic,
        analysis: res.analysis,
        createdAt: Date.now(),
      };
      await getDb().comparisons.put(record);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Analysis failed.");
    } finally {
      setBusy(null);
    }
  }

  async function runClaim() {
    if (!prefs) return;
    if (!claim.trim()) {
      toast.error("Enter a claim to verify.");
      return;
    }
    if (selectedIds.length < 1) {
      toast.error("Select sources to weigh the claim against.");
      return;
    }
    setBusy("claim");
    try {
      const payloads = await toPayloads(selectedIds);
      const res = await fetchClaimVerification({
        data: {
          ...aiOptsFromPrefs(prefs),
          query: claim.trim(),
          sources: payloads,
          activeLens: prefs.activeLens,
        },
      });
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      setAnalysis(res.analysis);
      setPane("analysis");
      await getDb().comparisons.put({
        id: uid(),
        sourceIds: selectedIds,
        mode: studyMode,
        lens: prefs.activeLens,
        topic: res.analysis.topic || claim.trim(),
        analysis: res.analysis,
        createdAt: Date.now(),
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Verification failed.");
    } finally {
      setBusy(null);
    }
  }

  if (list.length < 1) {
    return (
      <div className="rounded-xl bg-card px-5 py-10 text-center shadow-[var(--shadow-border)]">
        <p className="font-serif text-2xl">Research needs sources</p>
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
          Add at least two texts in the Vault, then return here to compare them.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-serif text-3xl tracking-tight">Research</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Two texts, one lens, four modes. Distinctions are kept on purpose.
        </p>
      </div>

      <div className="grid gap-1 rounded-xl bg-muted p-1 sm:grid-cols-4">
        {STUDY_MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setStudyMode(m.id)}
            className={cn(
              "rounded-lg px-3 py-2.5 text-left transition-colors duration-150",
              studyMode === m.id
                ? "bg-card text-foreground shadow-[var(--shadow-border)]"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <p className="text-sm font-medium">{m.label}</p>
            <p className="mt-0.5 hidden text-[11px] leading-snug sm:block">
              {m.short}
            </p>
          </button>
        ))}
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {STUDY_MODES.find((m) => m.id === studyMode)?.detail}
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <SourceSelect
          label="Text A"
          value={sourceA}
          onChange={setSourceA}
          sources={list}
          exclude={sourceB}
        />
        <SourceSelect
          label="Text B"
          value={sourceB}
          onChange={setSourceB}
          sources={list}
          exclude={sourceA}
        />
      </div>

      {list.length > 2 && (
        <div>
          <p className="text-[11px] font-medium tracking-wide text-muted-foreground">
            Additional witnesses
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {list
              .filter((s) => s.id !== sourceA && s.id !== sourceB)
              .map((s) => {
                const on = extraSourceIds.includes(s.id);
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => toggleExtra(s.id)}
                    className={cn(
                      "h-9 rounded-full px-3 text-xs",
                      on
                        ? "bg-secondary text-foreground"
                        : "text-muted-foreground hover:bg-muted",
                    )}
                  >
                    {s.title}
                  </button>
                );
              })}
          </div>
        </div>
      )}

      <Input
        value={focusQuestion}
        onChange={(e) => setFocusQuestion(e.target.value)}
        placeholder="Optional focus question (does not license blending)"
      />

      <Button
        size="lg"
        className="w-full sm:w-auto"
        disabled={busy !== null || selectedIds.length < 2}
        onClick={() => void runCompare()}
      >
        {busy === "compare" && <Loader2 className="size-4 animate-spin" />}
        Run {STUDY_MODES.find((m) => m.id === studyMode)?.label} pass
      </Button>

      <div className="flex rounded-md bg-muted p-0.5 md:hidden">
        {(
          [
            ["a", "Text A"],
            ["b", "Text B"],
            ["analysis", "Analysis"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setPane(id)}
            className={cn(
              "h-9 flex-1 rounded text-xs font-medium",
              pane === id ? "bg-card text-foreground" : "text-muted-foreground",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className={cn(pane !== "a" && "max-md:hidden")}>
          <TextPane source={a} />
        </div>
        <div className={cn(pane !== "b" && "max-md:hidden")}>
          <TextPane source={b} />
        </div>
      </div>

      <section
        className={cn(
          "rounded-xl bg-card p-4 shadow-[var(--shadow-border)] md:block",
          pane !== "analysis" && "max-md:hidden",
        )}
      >
        {analysis ? (
          <AnalysisReport analysis={analysis} />
        ) : (
          <p className="py-6 text-center text-sm text-muted-foreground">
            Analysis appears here with citations after a pass.
          </p>
        )}
      </section>

      <section className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
        <div className="flex items-center gap-2">
          <ShieldQuestion className="size-4 text-muted-foreground" />
          <h2 className="font-serif text-xl">Claim verification</h2>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Test a strong or consensus-style claim against the selected sources.
        </p>
        <Textarea
          className="mt-3 min-h-24"
          value={claim}
          onChange={(e) => setClaim(e.target.value)}
          placeholder="e.g. John and Thomas teach the same doctrine of the Word."
        />
        <Button
          className="mt-3"
          variant="outline"
          disabled={busy !== null || !claim.trim() || selectedIds.length < 1}
          onClick={() => void runClaim()}
        >
          {busy === "claim" && <Loader2 className="size-4 animate-spin" />}
          Weigh this claim
        </Button>
      </section>

      {history && history.length > 0 && (
        <section>
          <h2 className="font-serif text-xl">Past analyses</h2>
          <ul className="mt-3 space-y-2">
            {history.map((h) => (
              <li key={h.id}>
                <button
                  type="button"
                  onClick={() => {
                    setAnalysis(h.analysis);
                    setPane("analysis");
                    if (h.sourceIds[0]) setSourceA(h.sourceIds[0]);
                    if (h.sourceIds[1]) setSourceB(h.sourceIds[1]);
                  }}
                  className="w-full rounded-xl bg-card px-4 py-3 text-left shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]"
                >
                  <p className="font-medium">{h.topic}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {h.mode} · {h.lens.branch}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

import { useLiveQuery } from "dexie-react-hooks";
import { FileUp, Search, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ConfidenceBadge, ConfidenceDot } from "@/components/confidence-badge";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { extractFromFile, titleFromText } from "@/lib/manna/extract";
import { getDb } from "@/lib/manna/db";
import { CONFIDENCE_LADDER, suggestConfidence } from "@/lib/manna/lenses";
import { useMannaUI } from "@/lib/manna/store";
import type { ConfidenceLevel } from "@/lib/manna/types";
import { addSource, deleteSource, loadSampleLibrary, updateSource } from "@/lib/manna/vault";
import { formatDate, truncate } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function VaultView() {
  const sources = useLiveQuery(
    () => getDb().sources.orderBy("createdAt").reverse().toArray(),
    [],
  );
  const prefs = useLiveQuery(() => getDb().preferences.get("main"), []);
  const query = useMannaUI((s) => s.vaultQuery);
  const setQuery = useMannaUI((s) => s.setVaultQuery);
  const confFilter = useMannaUI((s) => s.vaultConfidence);
  const setConf = useMannaUI((s) => s.setVaultConfidence);
  const openSource = useMannaUI((s) => s.openSource);
  const fileRef = useRef<HTMLInputElement>(null);
  const [pasteOpen, setPasteOpen] = useState(false);
  const [pasteTitle, setPasteTitle] = useState("");
  const [pasteText, setPasteText] = useState("");
  const [pasteConf, setPasteConf] = useState<ConfidenceLevel>("primary");
  const [busy, setBusy] = useState(false);

  const filtered = (sources ?? []).filter((s) => {
    if (confFilter !== "all" && s.confidenceLevel !== confFilter) return false;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      s.title.toLowerCase().includes(q) ||
      s.lensTags.some((t) => t.toLowerCase().includes(q)) ||
      s.fullText.toLowerCase().includes(q)
    );
  });

  async function ingestFile(file: File) {
    setBusy(true);
    try {
      const doc = await extractFromFile(file);
      const conf = suggestConfidence(doc.title, doc.text);
      await addSource({
        title: doc.title,
        text: doc.text,
        confidenceLevel: conf,
        lensTags: prefs?.activeLens ? [prefs.activeLens.family] : [],
        filename: doc.filename,
        mime: doc.mime,
        origin: "upload",
      });
      toast.success(`Added “${doc.title}” as ${conf}.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not import that file.");
    } finally {
      setBusy(false);
    }
  }

  async function savePaste() {
    const text = pasteText.trim();
    if (!text) return;
    setBusy(true);
    try {
      const title = pasteTitle.trim() || titleFromText(text);
      await addSource({
        title,
        text,
        confidenceLevel: pasteConf,
        lensTags: prefs?.activeLens ? [prefs.activeLens.family] : [],
        origin: "paste",
      });
      setPasteOpen(false);
      setPasteTitle("");
      setPasteText("");
      toast.success(`Added “${title}”.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save the source.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl tracking-tight">Vault</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sources stay on this device. Every later citation points back here.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <input
            ref={fileRef}
            type="file"
            accept=".txt,.md,.html,.htm,.pdf,.epub,text/plain,application/pdf,application/epub+zip"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (file) void ingestFile(file);
            }}
          />
          <Button
            variant="outline"
            onClick={() => fileRef.current?.click()}
            disabled={busy}
          >
            <FileUp className="size-4" />
            Upload
          </Button>
          <Button onClick={() => setPasteOpen(true)} disabled={busy}>
            Paste text
          </Button>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search titles, tags, or passages"
            className="pl-9"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {(["all", ...CONFIDENCE_LADDER.map((c) => c.id)] as const).map((id) => {
            const active = confFilter === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setConf(id)}
                className={cn(
                  "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3 text-xs font-medium",
                  active
                    ? "bg-secondary text-foreground"
                    : "bg-transparent text-muted-foreground hover:bg-muted",
                )}
              >
                {id !== "all" && <ConfidenceDot level={id} />}
                {id === "all" ? "All" : CONFIDENCE_LADDER.find((c) => c.id === id)?.label}
              </button>
            );
          })}
        </div>
      </div>

      {!sources && <p className="mt-10 text-sm text-muted-foreground">Loading vault…</p>}

      {sources && sources.length === 0 && (
        <div className="mt-12 rounded-xl bg-card px-5 py-10 text-center shadow-[var(--shadow-border)]">
          <p className="font-serif text-2xl">An empty desk</p>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Upload a PDF or EPUB, paste a passage, or load the four sample primaries.
          </p>
          <Button
            className="mt-6"
            variant="outline"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              try {
                const n = await loadSampleLibrary();
                toast.success(n ? `Loaded ${n} texts.` : "Samples already present.");
              } finally {
                setBusy(false);
              }
            }}
          >
            Load sample library
          </Button>
        </div>
      )}

      {sources && sources.length > 0 && filtered.length === 0 && (
        <p className="mt-10 text-sm text-muted-foreground">No sources match that filter.</p>
      )}

      <ul className="mt-6 space-y-2">
        {filtered.map((s) => (
          <li key={s.id}>
            <article className="flex items-stretch gap-1 rounded-xl bg-card p-2 shadow-[var(--shadow-border)]">
              <button
                type="button"
                onClick={() => openSource(s.id)}
                className="min-w-0 flex-1 rounded-lg p-3 text-left hover:bg-muted/60"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-serif text-lg leading-snug">{s.title}</h2>
                  <ConfidenceBadge level={s.confidenceLevel} compact />
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {truncate(s.fullText, 140)}
                </p>
                <p className="mt-2 text-[11px] text-muted-foreground">
                  {s.metadata.wordCount} words · {formatDate(s.createdAt)}
                  {s.lensTags.length ? ` · ${s.lensTags.join(", ")}` : ""}
                </p>
              </button>
              <div className="flex flex-col justify-center gap-1 pr-1">
                <select
                  aria-label="Confidence"
                  value={s.confidenceLevel}
                  onChange={(e) =>
                    void updateSource(s.id, {
                      confidenceLevel: e.target.value as ConfidenceLevel,
                    })
                  }
                  className="h-9 rounded-md border border-border bg-paper px-2 text-[11px] text-foreground"
                >
                  {CONFIDENCE_LADDER.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Delete source"
                  onClick={async () => {
                    await deleteSource(s.id);
                    toast("Source removed.");
                  }}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </article>
          </li>
        ))}
      </ul>

      <Dialog open={pasteOpen} onOpenChange={setPasteOpen}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Paste a source</DialogTitle>
            <DialogDescription>
              Plain text is stored locally and chunked for citations.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="paste-title">Title</Label>
              <Input
                id="paste-title"
                value={pasteTitle}
                onChange={(e) => setPasteTitle(e.target.value)}
                placeholder="Optional — first line is used if blank"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="paste-body">Text</Label>
              <Textarea
                id="paste-body"
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
                placeholder="Paste the passage or full work"
                className="min-h-40"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Confidence ladder</Label>
              <div className="flex flex-wrap gap-1.5">
                {CONFIDENCE_LADDER.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setPasteConf(c.id)}
                    className={cn(
                      "inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-xs",
                      pasteConf === c.id
                        ? "bg-secondary text-foreground"
                        : "text-muted-foreground hover:bg-muted",
                    )}
                  >
                    <ConfidenceDot level={c.id} />
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <Button onClick={savePaste} disabled={busy || !pasteText.trim()}>
                Add to vault
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

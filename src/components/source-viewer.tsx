import { useLiveQuery } from "dexie-react-hooks";
import { StickyNote, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { ConfidenceBadge } from "@/components/confidence-badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { getDb } from "@/lib/manna/db";
import { useMannaUI } from "@/lib/manna/store";
import { uid } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function SourceViewer() {
  const viewingSourceId = useMannaUI((s) => s.viewingSourceId);
  const highlightChunk = useMannaUI((s) => s.highlightChunk);
  const closeSource = useMannaUI((s) => s.closeSource);
  const source = useLiveQuery(
    () => (viewingSourceId ? getDb().sources.get(viewingSourceId) : undefined),
    [viewingSourceId],
  );
  const chunks = useLiveQuery(
    () =>
      viewingSourceId
        ? getDb().chunks.where("sourceId").equals(viewingSourceId).sortBy("index")
        : [],
    [viewingSourceId],
  );
  const notes = useLiveQuery(
    () =>
      viewingSourceId
        ? getDb().notes.where("sourceId").equals(viewingSourceId).reverse().sortBy("createdAt")
        : [],
    [viewingSourceId],
  );
  const [noteOpen, setNoteOpen] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [quote, setQuote] = useState("");
  const highlightRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (highlightRef.current) {
      highlightRef.current.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, [highlightChunk, chunks?.length, viewingSourceId]);

  const body = useMemo(() => {
    if (!source) return null;
    if (chunks && chunks.length > 0) {
      return chunks.map((chunk) => {
        const active = highlightChunk === chunk.index;
        return (
          <p
            key={chunk.id}
            ref={active ? (el) => { highlightRef.current = el; } : undefined}
            className={cn(
              "source-prose mb-4 rounded-md px-1 py-0.5 transition-colors duration-200",
              active && "bg-lens/15",
            )}
          >
            {chunk.text}
          </p>
        );
      });
    }
    return (
      <div className="source-prose whitespace-pre-wrap">{source.fullText}</div>
    );
  }, [source, chunks, highlightChunk]);

  if (!viewingSourceId) return null;

  async function saveNote() {
    if (!source || !noteText.trim()) return;
    await getDb().notes.add({
      id: uid(),
      sourceId: source.id,
      quote: quote.trim(),
      chunkIndex: highlightChunk ?? undefined,
      text: noteText.trim(),
      createdAt: Date.now(),
    });
    setNoteText("");
    setQuote("");
    setNoteOpen(false);
    toast.success("Note saved.");
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background/80">
      <div className="flex min-h-0 flex-1 flex-col bg-background md:mx-auto md:my-6 md:w-full md:max-w-3xl md:rounded-xl md:shadow-[var(--shadow-border)]">
        <header className="flex items-start justify-between gap-3 border-b border-border px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
          <div className="min-w-0">
            <p className="font-serif text-xl leading-snug text-foreground">
              {source?.title ?? "Source"}
            </p>
            {source && (
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <ConfidenceBadge level={source.confidenceLevel} />
                <span className="text-[11px] text-muted-foreground">
                  {source.metadata.wordCount} words
                </span>
              </div>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setNoteOpen((v) => !v)}
              aria-label="Add note"
            >
              <StickyNote className="size-4" />
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={closeSource} aria-label="Close">
              <X className="size-4" />
            </Button>
          </div>
        </header>
        {noteOpen && (
          <div className="space-y-2 border-b border-border bg-card px-4 py-3">
            <Textarea
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder="Quoted line (optional)"
              className="min-h-16"
            />
            <Textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Your annotation"
              className="min-h-20"
            />
            <div className="flex justify-end">
              <Button size="sm" onClick={saveNote} disabled={!noteText.trim()}>
                Save note
              </Button>
            </div>
          </div>
        )}
        <div className="min-h-0 flex-1 overflow-y-auto bg-paper px-5 py-5">
          {body}
          {notes && notes.length > 0 && (
            <aside className="mt-8 border-t border-border pt-4">
              <p className="text-xs font-medium tracking-wide text-muted-foreground">
                Notes
              </p>
              <ul className="mt-3 space-y-3">
                {notes.map((n) => (
                  <li key={n.id} className="rounded-lg bg-card p-3 shadow-[var(--shadow-border)]">
                    {n.quote && (
                      <p className="font-serif text-sm italic text-muted-foreground">
                        “{n.quote}”
                      </p>
                    )}
                    <p className="mt-1 text-sm leading-relaxed">{n.text}</p>
                  </li>
                ))}
              </ul>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}

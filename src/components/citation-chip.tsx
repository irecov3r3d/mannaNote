import type { Citation } from "@/lib/manna/types";
import { useMannaUI } from "@/lib/manna/store";
import { cn } from "@/lib/utils";

export function CitationChip({
  cite,
  className,
}: {
  cite: Citation;
  className?: string;
}) {
  const openSource = useMannaUI((s) => s.openSource);
  const label = cite.sourceTitle || "Source";
  const idx = Number.isFinite(cite.chunkIndex) ? cite.chunkIndex + 1 : null;
  return (
    <button
      type="button"
      title={cite.quote || label}
      onClick={() => {
        if (cite.sourceId) openSource(cite.sourceId, cite.chunkIndex);
      }}
      className={cn(
        "inline-flex max-w-full items-center gap-1 rounded-full border border-border bg-paper px-2 py-0.5 text-left text-[11px] text-muted-foreground transition-colors duration-150 hover:border-foreground/30 hover:text-foreground",
        className,
      )}
    >
      <span className="truncate">
        {label}
        {idx != null ? ` · ${idx}` : ""}
      </span>
    </button>
  );
}

export function CitationList({ citations }: { citations: Citation[] }) {
  if (!citations?.length) return null;
  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {citations.map((c, i) => (
        <CitationChip key={`${c.sourceId}-${c.chunkIndex}-${i}`} cite={c} />
      ))}
    </div>
  );
}

import { confidenceMeta } from "@/lib/manna/lenses";
import type { ConfidenceLevel } from "@/lib/manna/types";
import { cn } from "@/lib/utils";

export function ConfidenceDot({
  level,
  className,
}: {
  level: ConfidenceLevel;
  className?: string;
}) {
  const meta = confidenceMeta(level);
  return (
    <span
      className={cn("inline-block size-2 shrink-0 rounded-full", meta.swatch, className)}
      aria-hidden
    />
  );
}

export function ConfidenceBadge({
  level,
  compact = false,
}: {
  level: ConfidenceLevel;
  compact?: boolean;
}) {
  const meta = confidenceMeta(level);
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-muted-foreground">
      <ConfidenceDot level={level} />
      {compact ? meta.label.split(" ")[0] : meta.label}
    </span>
  );
}

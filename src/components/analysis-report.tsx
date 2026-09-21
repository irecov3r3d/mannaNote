import { CitationList } from "@/components/citation-chip";
import type { ClaimVerification, DifferentiatorAnalysis } from "@/lib/manna/types";
import { cn } from "@/lib/utils";

function Meter({ value }: { value: number }) {
  const pct = Math.round(Math.min(1, Math.max(0, value)) * 100);
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-foreground/80"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-[11px] tabular-nums text-muted-foreground">{pct}%</span>
    </div>
  );
}

export function ClaimCard({ claim }: { claim: ClaimVerification }) {
  return (
    <article className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
      <div className="flex items-start justify-between gap-3">
        <p className="font-medium leading-snug text-foreground">{claim.claim}</p>
        <Meter value={claim.confidence} />
      </div>
      <dl className="mt-3 space-y-2 text-sm leading-relaxed">
        <div>
          <dt className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
            Evidence
          </dt>
          <dd className="mt-0.5 text-foreground/90">{claim.evidence}</dd>
        </div>
        <div>
          <dt className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
            Counter-reading
          </dt>
          <dd className="mt-0.5 text-foreground/90">{claim.counter_arguments}</dd>
        </div>
      </dl>
      <CitationList citations={claim.citations} />
    </article>
  );
}

export function AnalysisReport({
  analysis,
  className,
}: {
  analysis: DifferentiatorAnalysis;
  className?: string;
}) {
  const extras = analysis.additional_traditions ?? [];
  return (
    <div className={cn("space-y-5", className)}>
      <header>
        <p className="text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
          Analysis
        </p>
        <h2 className="mt-1 font-serif text-2xl tracking-tight">{analysis.topic}</h2>
      </header>

      <div className="grid gap-3 md:grid-cols-2">
        {[analysis.tradition_a, analysis.tradition_b, ...extras].map((t, i) => (
          <section
            key={`${t.label}-${i}`}
            className="rounded-xl bg-paper p-4 shadow-[var(--shadow-border)]"
          >
            <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
              {i === 0 ? "Text A" : i === 1 ? "Text B" : `Witness ${i + 1}`}
            </p>
            <h3 className="mt-1 font-serif text-lg leading-snug">{t.label}</h3>
            <p className="mt-2 text-sm leading-relaxed text-foreground/90">{t.summary}</p>
            <CitationList citations={t.citations} />
          </section>
        ))}
      </div>

      <section className="space-y-3 rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
        <Block title="Core divergence" body={analysis.core_divergence} />
        <Block title="Underlying axioms" body={analysis.underlying_axioms} />
        <Block title="Historical context" body={analysis.historical_context} />
        <Block title="Confidence notes" body={analysis.confidence_notes} />
      </section>

      {analysis.claims.length > 0 && (
        <section className="space-y-3">
          <p className="text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
            Claim verification
          </p>
          {analysis.claims.map((c, i) => (
            <ClaimCard key={`${c.claim}-${i}`} claim={c} />
          ))}
        </section>
      )}
    </div>
  );
}

function Block({ title, body }: { title: string; body: string }) {
  if (!body) return null;
  return (
    <div>
      <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
        {title}
      </p>
      <p className="mt-1 text-sm leading-relaxed">{body}</p>
    </div>
  );
}

import { ArrowLeft, ArrowRight, BookMarked } from "lucide-react";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DEFAULT_LENS, LENS_FAMILIES } from "@/lib/manna/lenses";
import { updatePreferences } from "@/lib/manna/db";
import type { LensFamily } from "@/lib/manna/types";
import { loadSampleLibrary } from "@/lib/manna/vault";
import { cn } from "@/lib/utils";

function Footer({ children }: { children: ReactNode }) {
  return (
    <div className="mt-8 flex justify-end max-md:fixed max-md:inset-x-0 max-md:bottom-0 max-md:z-10 max-md:bg-background/95 max-md:px-5 max-md:py-3 max-md:pb-[max(0.75rem,env(safe-area-inset-bottom))] max-md:backdrop-blur-sm">
      {children}
    </div>
  );
}

export function Onboarding() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [family, setFamily] = useState<LensFamily>(DEFAULT_LENS.family);
  const [branch, setBranch] = useState(DEFAULT_LENS.branch);
  const [customLabel, setCustomLabel] = useState("");
  const [busy, setBusy] = useState(false);

  const meta = LENS_FAMILIES.find((f) => f.family === family)!;

  async function finish(withSamples: boolean) {
    setBusy(true);
    try {
      await updatePreferences({
        activeLens: {
          family,
          branch: family === "custom" ? customLabel.trim() || "Custom" : branch,
          customLabel: family === "custom" ? customLabel.trim() : undefined,
        },
        onboardingComplete: true,
      });
      if (withSamples) {
        const n = await loadSampleLibrary();
        toast.success(
          n
            ? `Loaded ${n} primary texts into the vault.`
            : "Sample texts were already in the vault.",
        );
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save preferences.");
      setBusy(false);
    }
  }

  return (
    <main className="min-h-dvh bg-background px-5 py-10 pb-[max(5rem,env(safe-area-inset-bottom))] md:px-10">
      <div className="mx-auto flex min-h-[calc(100dvh-5rem)] max-w-2xl flex-col">
        <p className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
          MannaNote
        </p>
        {step === 1 && (
          <section className="mt-8 flex flex-1 flex-col">
            <h1 className="font-serif text-4xl leading-[1.1] tracking-tight text-foreground md:text-5xl">
              Where do you stand when you read?
            </h1>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground">
              Choose a primary interpretive lens. Every comparison, map, and
              spoken overview will keep this standing point visible — and will
              refuse to blend rival claims into a single essence.
            </p>
            <div className="mt-8 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {LENS_FAMILIES.map((f) => (
                <button
                  key={f.family}
                  type="button"
                  onClick={() => {
                    setFamily(f.family);
                    setBranch(f.branches[0] ?? f.label);
                  }}
                  className={cn(
                    "rounded-xl bg-card p-4 text-left shadow-[var(--shadow-border)] transition-[box-shadow,transform] duration-150 hover:shadow-[var(--shadow-border-hover)]",
                    family === f.family && "ring-2 ring-ring/70",
                  )}
                >
                  <p className="font-serif text-lg text-foreground">{f.label}</p>
                  <p className="mt-1 text-sm leading-snug text-muted-foreground">
                    {f.blurb}
                  </p>
                </button>
              ))}
            </div>
            <Footer>
              <Button onClick={() => setStep(2)} className="pr-3.5">
                Continue
                <ArrowRight className="size-4" />
              </Button>
            </Footer>
          </section>
        )}

        {step === 2 && (
          <section className="mt-8 flex flex-1 flex-col">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="mb-6 inline-flex h-11 items-center gap-2 self-start text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              Lenses
            </button>
            <h1 className="font-serif text-4xl leading-[1.1] tracking-tight">
              Refine the branch
            </h1>
            <p className="mt-3 max-w-lg text-base leading-relaxed text-muted-foreground">
              {meta.blurb} You can change this later from Settings without
              losing the vault.
            </p>
            {family === "custom" ? (
              <div className="mt-8 max-w-md space-y-2">
                <p className="text-xs font-medium tracking-wide text-muted-foreground">
                  Name your lens
                </p>
                <Input
                  value={customLabel}
                  onChange={(e) => setCustomLabel(e.target.value)}
                  placeholder="e.g. Process theology, Spinozist, Islamic kalam"
                />
              </div>
            ) : (
              <div className="mt-8 flex flex-col gap-2">
                {meta.branches.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBranch(b)}
                    className={cn(
                      "rounded-xl bg-card px-4 py-3.5 text-left font-medium shadow-[var(--shadow-border)] transition-shadow duration-150",
                      branch === b && "ring-2 ring-ring/70",
                    )}
                  >
                    {b}
                  </button>
                ))}
              </div>
            )}
            <Footer>
              <Button
                onClick={() => setStep(3)}
                disabled={family === "custom" && !customLabel.trim()}
                className="pr-3.5"
              >
                Continue
                <ArrowRight className="size-4" />
              </Button>
            </Footer>
          </section>
        )}

        {step === 3 && (
          <section className="mt-8 flex flex-1 flex-col">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="mb-6 inline-flex h-11 items-center gap-2 self-start text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              Branch
            </button>
            <h1 className="font-serif text-4xl leading-[1.1] tracking-tight">
              Begin with a small library
            </h1>
            <p className="mt-3 max-w-lg text-base leading-relaxed text-muted-foreground">
              Four public-domain primaries — John, Thomas, the Dhammapada, and
              Plato’s cave — so you can run a differentiator pass immediately.
              Or start with an empty vault and upload your own.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                disabled={busy}
                onClick={() => finish(true)}
                className="pr-3.5"
              >
                <BookMarked className="size-4" />
                Load sample texts
              </Button>
              <Button
                size="lg"
                variant="outline"
                disabled={busy}
                onClick={() => finish(false)}
              >
                Start empty
              </Button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

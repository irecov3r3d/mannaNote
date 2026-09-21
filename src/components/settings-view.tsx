import { useLiveQuery } from "dexie-react-hooks";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { fetchAiStatus } from "@/lib/ai/server";
import { clearVault, getDb, updatePreferences } from "@/lib/manna/db";
import { LENS_FAMILIES } from "@/lib/manna/lenses";
import { loadSampleLibrary } from "@/lib/manna/vault";
import type { AiProvider } from "@/lib/manna/types";
import { cn } from "@/lib/utils";

export function SettingsView() {
  const prefs = useLiveQuery(() => getDb().preferences.get("main"), []);
  const [xai, setXai] = useState<boolean | null>(null);
  const [geminiKey, setGeminiKey] = useState("");
  const [geminiModel, setGeminiModel] = useState("gemini-2.0-flash");
  const [customLabel, setCustomLabel] = useState("");
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    fetchAiStatus().then((s) => setXai(s.xai)).catch(() => setXai(false));
  }, []);

  useEffect(() => {
    if (!prefs) return;
    setGeminiKey(prefs.geminiApiKey);
    setGeminiModel(prefs.geminiModel);
    setCustomLabel(prefs.activeLens.customLabel ?? "");
  }, [prefs]);

  if (!prefs) {
    return <p className="text-sm text-muted-foreground">Loading settings…</p>;
  }

  const family = prefs.activeLens.family;
  const meta = LENS_FAMILIES.find((f) => f.family === family)!;

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <div>
        <h1 className="font-serif text-3xl tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Lens, appearance, and how analyses are generated. The vault never leaves this device.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="font-serif text-xl">Interpretive lens</h2>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {LENS_FAMILIES.map((f) => (
            <button
              key={f.family}
              type="button"
              onClick={() =>
                void updatePreferences({
                  activeLens: {
                    family: f.family,
                    branch: f.branches[0] ?? f.label,
                    customLabel:
                      f.family === "custom" ? customLabel || "Custom" : undefined,
                  },
                })
              }
              className={cn(
                "rounded-xl bg-card px-4 py-3 text-left shadow-[var(--shadow-border)]",
                family === f.family && "ring-2 ring-ring/70",
              )}
            >
              <p className="font-medium">{f.label}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{f.blurb}</p>
            </button>
          ))}
        </div>
        {family !== "custom" ? (
          <div className="flex flex-col gap-2">
            {meta.branches.map((b) => (
              <button
                key={b}
                type="button"
                onClick={() =>
                  void updatePreferences({
                    activeLens: { ...prefs.activeLens, branch: b },
                  })
                }
                className={cn(
                  "rounded-xl bg-card px-4 py-3 text-left text-sm shadow-[var(--shadow-border)]",
                  prefs.activeLens.branch === b && "ring-2 ring-ring/70",
                )}
              >
                {b}
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-1.5">
            <Label htmlFor="custom-lens">Custom lens name</Label>
            <Input
              id="custom-lens"
              value={customLabel}
              onChange={(e) => setCustomLabel(e.target.value)}
              onBlur={() =>
                void updatePreferences({
                  activeLens: {
                    family: "custom",
                    branch: customLabel.trim() || "Custom",
                    customLabel: customLabel.trim() || "Custom",
                  },
                })
              }
            />
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-xl">Appearance</h2>
        <div className="flex h-14 items-center justify-between rounded-xl bg-card px-4 shadow-[var(--shadow-border)]">
          <div>
            <p className="text-sm font-medium">Dark desk</p>
            <p className="text-xs text-muted-foreground">Paper-on-ink for long sessions</p>
          </div>
          <Switch
            checked={prefs.theme !== "light"}
            onCheckedChange={(on) =>
              void updatePreferences({ theme: on ? "dark" : "light" })
            }
          />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-xl">AI engine</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Analyses run through Grok by default. No key is required from you.
          Optionally route calls through your own Google AI Studio (Gemini) key;
          it is stored only in this browser and sent with each request.
        </p>
        <p className="text-xs text-muted-foreground">
          Grok status:{" "}
          {xai == null ? "checking…" : xai ? "available" : "unavailable in this environment"}
        </p>
        <div className="flex gap-2">
          {(["xai", "gemini"] as AiProvider[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => void updatePreferences({ aiProvider: p })}
              className={cn(
                "h-11 flex-1 rounded-xl bg-card text-sm shadow-[var(--shadow-border)]",
                prefs.aiProvider === p && "ring-2 ring-ring/70",
              )}
            >
              {p === "xai" ? "Grok" : "Gemini"}
            </button>
          ))}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="gemini-key">Google AI Studio API key</Label>
          <Input
            id="gemini-key"
            type="password"
            autoComplete="off"
            value={geminiKey}
            onChange={(e) => setGeminiKey(e.target.value)}
            onBlur={() => void updatePreferences({ geminiApiKey: geminiKey.trim() })}
            placeholder="Only needed if you select Gemini"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="gemini-model">Gemini model</Label>
          <Input
            id="gemini-model"
            value={geminiModel}
            onChange={(e) => setGeminiModel(e.target.value)}
            onBlur={() =>
              void updatePreferences({
                geminiModel: geminiModel.trim() || "gemini-2.0-flash",
              })
            }
          />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-xl">Vault data</h2>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={async () => {
              const n = await loadSampleLibrary();
              toast.success(n ? `Added ${n} sample texts.` : "Samples already present.");
            }}
          >
            Load sample library
          </Button>
          <Button
            variant={confirmClear ? "destructive" : "outline"}
            onClick={async () => {
              if (!confirmClear) {
                setConfirmClear(true);
                return;
              }
              await clearVault();
              setConfirmClear(false);
              toast("Vault cleared. Preferences were kept.");
            }}
          >
            {confirmClear ? "Confirm clear vault" : "Clear vault"}
          </Button>
        </div>
        {confirmClear && (
          <p className="text-xs text-muted-foreground">
            This removes sources, notes, comparisons, and overviews. Press again to confirm.
          </p>
        )}
      </section>
    </div>
  );
}

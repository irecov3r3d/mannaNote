import { useLiveQuery } from "dexie-react-hooks";
import { useEffect, useState, type ReactNode } from "react";
import { Toaster } from "sonner";
import { Onboarding } from "@/components/onboarding";
import { SourceViewer } from "@/components/source-viewer";
import { ensurePreferences, getDb } from "@/lib/manna/db";

export function MannaProvider({ children }: { children: ReactNode }) {
  const [onboarded, setOnboarded] = useState(false);
  const prefs = useLiveQuery(() => {
    if (typeof indexedDB === "undefined") return undefined;
    return getDb().preferences.get("main");
  }, []);

  useEffect(() => {
    try {
      if (localStorage.getItem("mannanote-onboarded") === "1") {
        setOnboarded(true);
      }
    } catch {
      /* ignore */
    }
    void ensurePreferences();
  }, []);

  useEffect(() => {
    if (!prefs) return;
    const root = document.documentElement;
    root.classList.toggle("dark", prefs.theme !== "light");
    root.classList.toggle("light", prefs.theme === "light");
    try {
      localStorage.setItem("mannanote-theme", prefs.theme);
    } catch {
      /* ignore */
    }
    setOnboarded(prefs.onboardingComplete);
  }, [prefs]);

  const theme = prefs?.theme === "light" ? "light" : "dark";

  if (!onboarded) {
    return (
      <>
        <Onboarding />
        <Toaster theme={theme} />
      </>
    );
  }

  return (
    <>
      {children}
      <SourceViewer />
      <Toaster theme={theme} />
    </>
  );
}

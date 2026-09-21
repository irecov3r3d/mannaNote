import { Link, useRouterState } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";
import { BookOpen, GitCompare, Map, Settings } from "lucide-react";
import type { ReactNode } from "react";
import { getDb } from "@/lib/manna/db";
import { lensLabel } from "@/lib/manna/lenses";
import { cn } from "@/lib/utils";

const TABS = [
  { to: "/", label: "Vault", icon: BookOpen },
  { to: "/research", label: "Research", icon: GitCompare },
  { to: "/overviews", label: "Overviews", icon: Map },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const prefs = useLiveQuery(() => getDb().preferences.get("main"), []);
  const lens = prefs ? lensLabel(prefs.activeLens) : "Lens";

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/90 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 backdrop-blur-sm md:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="font-serif text-xl tracking-tight text-foreground">
              MannaNote
            </p>
            <p className="truncate text-[11px] tracking-wide text-muted-foreground">
              {lens}
            </p>
          </div>
          <nav className="hidden items-center gap-1 md:flex">
            {TABS.map((tab) => {
              const active =
                tab.to === "/"
                  ? pathname === "/"
                  : pathname.startsWith(tab.to);
              return (
                <Link
                  key={tab.to}
                  to={tab.to}
                  className={cn(
                    "inline-flex h-11 items-center gap-2 rounded-md px-3 text-sm transition-colors duration-150",
                    active
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <tab.icon className="size-4" />
                  {tab.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-28 pt-5 md:px-8 md:pb-12">
        {children}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm md:hidden">
        <ul className="grid grid-cols-4">
          {TABS.map((tab) => {
            const active =
              tab.to === "/"
                ? pathname === "/"
                : pathname.startsWith(tab.to);
            return (
              <li key={tab.to}>
                <Link
                  to={tab.to}
                  className={cn(
                    "flex h-14 flex-col items-center justify-center gap-0.5 text-[11px]",
                    active ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  <tab.icon className="size-5" strokeWidth={active ? 2.2 : 1.8} />
                  {tab.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

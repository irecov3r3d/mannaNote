import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { ResearchView } from "@/components/research-view";

export const Route = createFileRoute("/research")({ component: ResearchPage });

function ResearchPage() {
  return (
    <AppShell>
      <ResearchView />
    </AppShell>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { OverviewsView } from "@/components/overviews-view";

export const Route = createFileRoute("/overviews")({ component: OverviewsPage });

function OverviewsPage() {
  return (
    <AppShell>
      <OverviewsView />
    </AppShell>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { VaultView } from "@/components/vault-view";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <AppShell>
      <VaultView />
    </AppShell>
  );
}

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { MindMapData, MindMapNode } from "@/lib/manna/types";
import { useMannaUI } from "@/lib/manna/store";
import { cn } from "@/lib/utils";

function traditionTone(t?: string) {
  const v = (t || "").toLowerCase();
  if (v === "a" || v.includes("text a")) return "border-l-conf-scholarly";
  if (v === "b" || v.includes("text b")) return "border-l-conf-web";
  if (v === "shared") return "border-l-conf-reference";
  return "border-l-lens";
}

function buildTree(nodes: MindMapNode[]): { node: MindMapNode; children: MindMapNode[] }[] {
  const byParent = new Map<string | "root", MindMapNode[]>();
  for (const n of nodes) {
    const key = n.parentId || "root";
    const list = byParent.get(key) ?? [];
    list.push(n);
    byParent.set(key, list);
  }
  const roots = nodes.filter((n) => !n.parentId);
  const fallback = roots.length ? roots : nodes.slice(0, 1);
  function kids(id: string): MindMapNode[] {
    return (byParent.get(id) ?? []).filter((c) => c.id !== id);
  }
  return fallback.map((node) => ({ node, children: kids(node.id) }));
}

function NodeCard({
  node,
  depth,
  children,
}: {
  node: MindMapNode;
  depth: number;
  children?: ReactNode;
}) {
  const openSource = useMannaUI((s) => s.openSource);
  const clickable = Boolean(node.sourceId);
  return (
    <div className="min-w-0">
      <button
        type="button"
        disabled={!clickable}
        onClick={() => {
          if (node.sourceId) openSource(node.sourceId, 0);
        }}
        className={cn(
          "w-full rounded-lg border-l-2 bg-card px-3 py-2.5 text-left shadow-[var(--shadow-border)] transition-shadow duration-150",
          traditionTone(node.tradition),
          clickable && "hover:shadow-[var(--shadow-border-hover)]",
          depth === 0 && "bg-paper",
        )}
      >
        <p className="text-[11px] tracking-wide text-muted-foreground">
          {node.tradition || (depth === 0 ? "Topic" : "Concept")}
        </p>
        <p className="font-medium leading-snug text-foreground">{node.label}</p>
        {node.detail && (
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{node.detail}</p>
        )}
        {node.citation && (
          <p className="mt-1 font-serif text-xs italic text-foreground/80">“{node.citation}”</p>
        )}
      </button>
      {children}
    </div>
  );
}

function Branch({
  node,
  all,
  depth,
}: {
  node: MindMapNode;
  all: MindMapNode[];
  depth: number;
}) {
  const children = all.filter((n) => n.parentId === node.id);
  return (
    <NodeCard node={node} depth={depth}>
      {children.length > 0 && (
        <div
          className={cn(
            "mt-2 grid gap-2 pl-3",
            children.length > 1 && depth < 1 ? "sm:grid-cols-2" : "grid-cols-1",
          )}
        >
          {children.map((c) => (
            <Branch key={c.id} node={c} all={all} depth={depth + 1} />
          ))}
        </div>
      )}
    </NodeCard>
  );
}

function MermaidBlock({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const mermaid = (await import("mermaid")).default;
        const dark = document.documentElement.classList.contains("dark");
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "loose",
          theme: dark ? "dark" : "neutral",
          fontFamily: "Figtree, sans-serif",
        });
        const id = `mm_${Math.random().toString(36).slice(2)}`;
        const { svg } = await mermaid.render(id, chart);
        if (!cancelled && ref.current) {
          ref.current.innerHTML = svg;
          const svgEl = ref.current.querySelector("svg");
          svgEl?.classList.add("mx-auto", "max-w-full");
        }
      } catch {
        if (!cancelled) setErr("Diagram could not be drawn from the returned syntax.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [chart]);

  if (err) {
    return <p className="text-sm text-muted-foreground">{err}</p>;
  }
  return <div ref={ref} className="overflow-x-auto py-2" />;
}

export function MindMapView({ data }: { data: MindMapData }) {
  const [tab, setTab] = useState<"graph" | "diagram">("graph");
  const trees = useMemo(() => buildTree(data.nodes), [data.nodes]);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-serif text-2xl tracking-tight">{data.topic}</h2>
        {data.mermaid && (
          <div className="flex rounded-md bg-muted p-0.5 text-xs">
            <button
              type="button"
              className={cn(
                "h-8 rounded px-2.5",
                tab === "graph" ? "bg-card text-foreground" : "text-muted-foreground",
              )}
              onClick={() => setTab("graph")}
            >
              Graph
            </button>
            <button
              type="button"
              className={cn(
                "h-8 rounded px-2.5",
                tab === "diagram" ? "bg-card text-foreground" : "text-muted-foreground",
              )}
              onClick={() => setTab("diagram")}
            >
              Diagram
            </button>
          </div>
        )}
      </div>
      {tab === "diagram" && data.mermaid ? (
        <MermaidBlock chart={data.mermaid} />
      ) : (
        <div className="space-y-3">
          {trees.map(({ node }) => (
            <Branch key={node.id} node={node} all={data.nodes} depth={0} />
          ))}
        </div>
      )}
    </div>
  );
}

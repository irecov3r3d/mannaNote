export function extractJsonObject(raw: string): unknown {
  const trimmed = raw.trim();
  const fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const body = fence?.[1]?.trim() ?? trimmed;
  const start = body.indexOf("{");
  const end = body.lastIndexOf("}");
  if (start < 0 || end <= start) {
    throw new Error("The model did not return a JSON object.");
  }
  const slice = body.slice(start, end + 1);
  try {
    return JSON.parse(slice);
  } catch {
    const repaired = slice
      .replace(/,\s*}/g, "}")
      .replace(/,\s*]/g, "]");
    return JSON.parse(repaired);
  }
}

function asString(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}

function asNumber(v: unknown, fallback = 0): number {
  return typeof v === "number" && Number.isFinite(v) ? v : fallback;
}

function asCite(v: unknown) {
  const o = v && typeof v === "object" ? (v as Record<string, unknown>) : {};
  return {
    sourceId: asString(o.sourceId),
    sourceTitle: asString(o.sourceTitle),
    chunkIndex: Math.max(0, Math.round(asNumber(o.chunkIndex, 0))),
    quote: asString(o.quote),
  };
}

function asTradition(v: unknown, fallbackLabel: string) {
  const o = v && typeof v === "object" ? (v as Record<string, unknown>) : {};
  const citations = Array.isArray(o.citations) ? o.citations.map(asCite) : [];
  return {
    label: asString(o.label, fallbackLabel),
    summary: asString(o.summary),
    citations,
  };
}

function asClaim(v: unknown) {
  const o = v && typeof v === "object" ? (v as Record<string, unknown>) : {};
  const citations = Array.isArray(o.citations) ? o.citations.map(asCite) : [];
  const confidence = Math.min(1, Math.max(0, asNumber(o.confidence, 0.5)));
  return {
    claim: asString(o.claim),
    evidence: asString(o.evidence),
    counter_arguments: asString(o.counter_arguments || o.counterArguments),
    confidence,
    citations,
  };
}

export function coerceAnalysis(raw: unknown) {
  const o = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const claims = Array.isArray(o.claims) ? o.claims.map(asClaim) : [];
  const additional = Array.isArray(o.additional_traditions)
    ? o.additional_traditions.map((t, i) => asTradition(t, `Tradition ${i + 3}`))
    : [];
  return {
    topic: asString(o.topic, "Comparison"),
    tradition_a: asTradition(o.tradition_a, "Text A"),
    tradition_b: asTradition(o.tradition_b, "Text B"),
    additional_traditions: additional,
    core_divergence: asString(o.core_divergence || o.coreDivergence),
    underlying_axioms: asString(o.underlying_axioms || o.underlyingAxioms),
    historical_context: asString(o.historical_context || o.historicalContext),
    confidence_notes: asString(o.confidence_notes || o.confidenceNotes),
    claims,
  };
}

export function coerceMindMap(raw: unknown) {
  const o = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const nodes = Array.isArray(o.nodes)
    ? o.nodes.map((n, i) => {
        const x = n && typeof n === "object" ? (n as Record<string, unknown>) : {};
        return {
          id: asString(x.id, `n${i}`),
          label: asString(x.label, `Node ${i + 1}`),
          detail: asString(x.detail) || undefined,
          tradition: asString(x.tradition) || undefined,
          sourceId: asString(x.sourceId) || undefined,
          citation: asString(x.citation) || undefined,
          parentId:
            x.parentId === null || x.parentId === undefined
              ? (i === 0 ? null : asString(x.parentId) || null)
              : asString(x.parentId),
        };
      })
    : [];
  return {
    topic: asString(o.topic, "Concept map"),
    mermaid: asString(o.mermaid),
    nodes,
  };
}

export function coerceAudio(raw: unknown) {
  const o = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const beats = Array.isArray(o.beats)
    ? o.beats.map((b) => {
        const x = b && typeof b === "object" ? (b as Record<string, unknown>) : {};
        return {
          heading: asString(x.heading, "Beat"),
          narration: asString(x.narration),
        };
      })
    : [];
  const script =
    asString(o.script) ||
    beats
      .map((b) => `${b.heading}. ${b.narration}`)
      .join("\n\n");
  return {
    title: asString(o.title, "Overview"),
    durationHint: asString(o.durationHint, "a few minutes"),
    script,
    beats,
  };
}

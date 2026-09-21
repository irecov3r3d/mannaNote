import { o as lensLabel } from "./lenses-BzzZXy4v.mjs";
import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/server-Bi6pe2QA.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
/**
* MannaNote system doctrine — this is the product's differentiator.
*
* Isolation: stay inside the lens.
* Comparative: preserve distinctions, map without merging.
* Differentiator: name the clash; never blend.
* Inversion: flip the lens and steelman the other side.
*
* Adding a study mode later: add a STUDY_MODE_INSTRUCTIONS entry and a
* matching item in STUDY_MODES (lenses.ts). The JSON schemas below stay
* stable so the UI does not have to change.
*/
var CORE_DOCTRINE = `You are MannaNote, a comparative research engine for scripture, philosophy, and dense primary texts.

HARD RULES — never violate:
1. Never synthesize distinct theological, philosophical, or doctrinal concepts into a generic blend unless the user explicitly commands synthesis in the focus question.
2. Always identify exact points of departure. Prefer the tradition's own terms over translator-friendly paraphrases that erase difference.
3. Always return citations that quote or closely paraphrase the provided source text. Every citation must include sourceTitle, sourceId, chunkIndex, and a short quote taken from that chunk.
4. Respect the active Interpretive Lens and the selected Study Mode exactly.
5. Prefer differentiation over forced harmony. Agreement is allowed only when the texts themselves warrant it, and must still note remaining gaps.
6. Return valid JSON only — no markdown fences, no preamble, no commentary outside JSON.
7. If the sources do not support a claim, say so in confidence_notes. Do not invent quotations.
8. Treat Source Confidence labels as epistemic weight: Primary Text outranks commentary; General Web is a lead, never proof.`;
var STUDY_MODE_INSTRUCTIONS = {
	isolation: `STUDY MODE = Isolation.
Interpret every source as if you stand entirely inside the active Interpretive Lens. Do not import foreign doctrinal machinery, later scholarly fashions, or rival canons. If a source comes from another tradition, describe how the active lens would read it — without converting it into that lens. Keep the foreign source's own claims visible, then show the lens's reception.`,
	comparative: `STUDY MODE = Comparative.
Place the traditions side by side in their own vocabulary. You may note analogies, but you must not collapse them. Each tradition_a / tradition_b summary should be something an adherent would recognize. Flag false friends (same word, different meaning).`,
	differentiator: `STUDY MODE = Differentiator (default posture of this engine).
Actively surface exact points of divergence, the underlying axioms that make the clash necessary, and the historical or cultural reasons it arose. Do not merge, harmonize, or "both-and" the conflict. If a popular synthesis exists, name it as a later construction and show what it erases.`,
	inversion: `STUDY MODE = Inversion.
Deliberately flip the active Interpretive Lens. Steelman the reading that most threatens the lens. Read the sources adversarially against the user's standing point. The goal is critical pressure, not mockery and not conversion.`
};
function formatSources(sources) {
	return sources.map((s, i) => {
		const role = i === 0 ? "TEXT A" : i === 1 ? "TEXT B" : `CONTEXT ${i + 1}`;
		const chunks = s.chunks.map((c) => `[chunk ${c.index}] ${c.text}`).join("\n");
		return `### ${role}: ${s.title}
id: ${s.id}
confidence: ${s.confidenceLevel}
lens_tags: ${s.lensTags.join(", ") || "none"}
${chunks}`;
	}).join("\n\n");
}
function lensBlock(lens) {
	return `ACTIVE INTERPRETIVE LENS: ${lensLabel(lens)}
family: ${lens.family}
branch: ${lens.branch}${lens.customLabel ? `\ncustom: ${lens.customLabel}` : ""}`;
}
function analysisSystem(mode) {
	return `${CORE_DOCTRINE}

${STUDY_MODE_INSTRUCTIONS[mode]}

OUTPUT SCHEMA (JSON object):
{
  "topic": "short name for the comparison",
  "tradition_a": {
    "label": "tradition or work name for text A",
    "summary": "how this text stands, in its own terms",
    "citations": [{ "sourceId": "", "sourceTitle": "", "chunkIndex": 0, "quote": "" }]
  },
  "tradition_b": { "label": "", "summary": "", "citations": [] },
  "additional_traditions": [],
  "core_divergence": "the precise point of departure, not a vague contrast",
  "underlying_axioms": "the assumptions that make the divergence necessary",
  "historical_context": "why this clash exists in history or culture",
  "confidence_notes": "what is solid vs. inferential; flag thin evidence",
  "claims": [
    {
      "claim": "a strong or consensus-style claim that appeared in the analysis",
      "evidence": "what in the sources supports it",
      "counter_arguments": "alternative reading or opposing evidence",
      "confidence": 0.0,
      "citations": [{ "sourceId": "", "sourceTitle": "", "chunkIndex": 0, "quote": "" }]
    }
  ]
}
Include 2–4 claims. confidence is 0–1. Quotes must be short (≤ 40 words) and from the provided chunks.`;
}
function analysisUser(opts) {
	const focus = opts.focusQuestion?.trim() ? `\nFOCUS QUESTION (do not use this as a license to blend concepts): ${opts.focusQuestion.trim()}\n` : "";
	return `${lensBlock(opts.lens)}
STUDY MODE: ${opts.mode}
${focus}
SOURCES:
${formatSources(opts.sources)}`;
}
function claimSystem() {
	return `${CORE_DOCTRINE}

You are verifying a user claim against the provided sources only.

OUTPUT SCHEMA:
{
  "claim": "restated claim",
  "evidence": "what the sources actually show",
  "counter_arguments": "best alternative reading from the same or opposing sources",
  "confidence": 0.0,
  "citations": [{ "sourceId": "", "sourceTitle": "", "chunkIndex": 0, "quote": "" }],
  "topic": "short label",
  "tradition_a": { "label": "supporting line", "summary": "", "citations": [] },
  "tradition_b": { "label": "challenging line", "summary": "", "citations": [] },
  "core_divergence": "what the claim conceals or flattens, if anything",
  "underlying_axioms": "",
  "historical_context": "",
  "confidence_notes": "",
  "claims": []
}
Fill claims with a one-item array repeating this verification so the UI can reuse the comparison renderer. If sources are silent, confidence must be low and evidence must say so.`;
}
function claimUser(opts) {
	return `${lensBlock(opts.lens)}
CLAIM TO VERIFY:
${opts.claim}

SOURCES:
${formatSources(opts.sources)}`;
}
function mindMapSystem(mode) {
	return `${CORE_DOCTRINE}

${STUDY_MODE_INSTRUCTIONS[mode]}

Build a concept graph that PRESERVES distinctions between traditions. Do not create a "universal essence" parent that swallows both sides. Shared words may appear as a node only if you immediately branch into divergent meanings.

OUTPUT SCHEMA:
{
  "topic": "graph title",
  "mermaid": "a mermaid flowchart TD definition using quoted labels; no reserved words as node ids",
  "nodes": [
    {
      "id": "root",
      "label": "short label",
      "detail": "one sentence",
      "tradition": "A | B | shared | lens",
      "sourceId": "optional source id",
      "citation": "optional short quote",
      "parentId": null
    }
  ]
}
Rules for nodes:
- One root with parentId null.
- 8–16 nodes total.
- tradition A and B must both appear as first-level branches when two primary texts are present.
- Nodes that quote a source must include sourceId matching a provided id.
- mermaid must be valid flowchart TD syntax and reflect the same hierarchy.`;
}
function mindMapUser(opts) {
	const focus = opts.focusQuestion?.trim() ? `\nFOCUS: ${opts.focusQuestion.trim()}\n` : "";
	return `${lensBlock(opts.lens)}
STUDY MODE: ${opts.mode}
${focus}
SOURCES:
${formatSources(opts.sources)}`;
}
function audioSystem(mode, length) {
	const beats = length === "short" ? "4–5" : "6–8";
	return `${CORE_DOCTRINE}

${STUDY_MODE_INSTRUCTIONS[mode]}

Write a spoken overview in the manner of a careful private podcast: two voices of thought, not a TED blend. No host banter, no "welcome back". Direct, oral, precise.

OUTPUT SCHEMA:
{
  "title": "episode title",
  "durationHint": "about N minutes",
  "script": "the full spoken script, with paragraph breaks",
  "beats": [{ "heading": "section name", "narration": "spoken prose" }]
}
${beats} beats. The script must concatenate the narrations in order. Name each tradition. End by restating the unresolved divergence, not a moral.`;
}
function audioUser(opts) {
	const focus = opts.focusQuestion?.trim() ? `\nFOCUS: ${opts.focusQuestion.trim()}\n` : "";
	return `${lensBlock(opts.lens)}
STUDY MODE: ${opts.mode}
LENGTH: ${opts.length}
${focus}
SOURCES:
${formatSources(opts.sources)}`;
}
function extractJsonObject(raw) {
	const trimmed = raw.trim();
	const body = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1]?.trim() ?? trimmed;
	const start = body.indexOf("{");
	const end = body.lastIndexOf("}");
	if (start < 0 || end <= start) throw new Error("The model did not return a JSON object.");
	const slice = body.slice(start, end + 1);
	try {
		return JSON.parse(slice);
	} catch {
		const repaired = slice.replace(/,\s*}/g, "}").replace(/,\s*]/g, "]");
		return JSON.parse(repaired);
	}
}
function asString(v, fallback = "") {
	return typeof v === "string" ? v : fallback;
}
function asNumber(v, fallback = 0) {
	return typeof v === "number" && Number.isFinite(v) ? v : fallback;
}
function asCite(v) {
	const o = v && typeof v === "object" ? v : {};
	return {
		sourceId: asString(o.sourceId),
		sourceTitle: asString(o.sourceTitle),
		chunkIndex: Math.max(0, Math.round(asNumber(o.chunkIndex, 0))),
		quote: asString(o.quote)
	};
}
function asTradition(v, fallbackLabel) {
	const o = v && typeof v === "object" ? v : {};
	const citations = Array.isArray(o.citations) ? o.citations.map(asCite) : [];
	return {
		label: asString(o.label, fallbackLabel),
		summary: asString(o.summary),
		citations
	};
}
function asClaim(v) {
	const o = v && typeof v === "object" ? v : {};
	const citations = Array.isArray(o.citations) ? o.citations.map(asCite) : [];
	const confidence = Math.min(1, Math.max(0, asNumber(o.confidence, .5)));
	return {
		claim: asString(o.claim),
		evidence: asString(o.evidence),
		counter_arguments: asString(o.counter_arguments || o.counterArguments),
		confidence,
		citations
	};
}
function coerceAnalysis(raw) {
	const o = raw && typeof raw === "object" ? raw : {};
	const claims = Array.isArray(o.claims) ? o.claims.map(asClaim) : [];
	const additional = Array.isArray(o.additional_traditions) ? o.additional_traditions.map((t, i) => asTradition(t, `Tradition ${i + 3}`)) : [];
	return {
		topic: asString(o.topic, "Comparison"),
		tradition_a: asTradition(o.tradition_a, "Text A"),
		tradition_b: asTradition(o.tradition_b, "Text B"),
		additional_traditions: additional,
		core_divergence: asString(o.core_divergence || o.coreDivergence),
		underlying_axioms: asString(o.underlying_axioms || o.underlyingAxioms),
		historical_context: asString(o.historical_context || o.historicalContext),
		confidence_notes: asString(o.confidence_notes || o.confidenceNotes),
		claims
	};
}
function coerceMindMap(raw) {
	const o = raw && typeof raw === "object" ? raw : {};
	const nodes = Array.isArray(o.nodes) ? o.nodes.map((n, i) => {
		const x = n && typeof n === "object" ? n : {};
		return {
			id: asString(x.id, `n${i}`),
			label: asString(x.label, `Node ${i + 1}`),
			detail: asString(x.detail) || void 0,
			tradition: asString(x.tradition) || void 0,
			sourceId: asString(x.sourceId) || void 0,
			citation: asString(x.citation) || void 0,
			parentId: x.parentId === null || x.parentId === void 0 ? i === 0 ? null : asString(x.parentId) || null : asString(x.parentId)
		};
	}) : [];
	return {
		topic: asString(o.topic, "Concept map"),
		mermaid: asString(o.mermaid),
		nodes
	};
}
function coerceAudio(raw) {
	const o = raw && typeof raw === "object" ? raw : {};
	const beats = Array.isArray(o.beats) ? o.beats.map((b) => {
		const x = b && typeof b === "object" ? b : {};
		return {
			heading: asString(x.heading, "Beat"),
			narration: asString(x.narration)
		};
	}) : [];
	const script = asString(o.script) || beats.map((b) => `${b.heading}. ${b.narration}`).join("\n\n");
	return {
		title: asString(o.title, "Overview"),
		durationHint: asString(o.durationHint, "a few minutes"),
		script,
		beats
	};
}
function guardSources(sources) {
	if (!sources?.length) return "Select at least one source.";
	if (sources.reduce((n, s) => n + s.chunks.reduce((m, c) => m + c.text.length, 0), 0) < 40) return "The selected sources do not contain enough text.";
	return null;
}
async function runComplete(input) {
	const { completeJson } = await import("./complete.server-CBkaTAqe.mjs");
	return completeJson(input);
}
var fetchAiStatus_createServerFn_handler = createServerRpc({
	id: "5dd7c70f55cd7061f1b86e0829f7b92f918f5467bff2f8376fbcfc1db413c188",
	name: "fetchAiStatus",
	filename: "src/lib/ai/server.ts"
}, (opts) => fetchAiStatus.__executeServer(opts));
var fetchAiStatus = createServerFn({ method: "POST" }).handler(fetchAiStatus_createServerFn_handler, async () => {
	return { xai: Boolean(process.env.XAI_API_KEY) };
});
var fetchDifferentiatorAnalysis_createServerFn_handler = createServerRpc({
	id: "e0f0b5da3664ee23fbd1707844445e52ff63a2b78c0a562ac86d9cb0269e6202",
	name: "fetchDifferentiatorAnalysis",
	filename: "src/lib/ai/server.ts"
}, (opts) => fetchDifferentiatorAnalysis.__executeServer(opts));
var fetchDifferentiatorAnalysis = createServerFn({ method: "POST" }).validator((input) => input).handler(fetchDifferentiatorAnalysis_createServerFn_handler, async ({ data }) => {
	const blocked = guardSources(data.sources);
	if (blocked) return {
		ok: false,
		error: blocked
	};
	const result = await runComplete({
		provider: data.provider,
		geminiApiKey: data.geminiApiKey,
		geminiModel: data.geminiModel,
		maxTokens: 4200,
		system: analysisSystem(data.mode),
		user: analysisUser({
			lens: data.activeLens,
			mode: data.mode,
			sources: data.sources,
			focusQuestion: data.focusQuestion
		})
	});
	if (!result.ok) return result;
	try {
		return {
			ok: true,
			analysis: coerceAnalysis(extractJsonObject(result.text)),
			provider: result.provider
		};
	} catch (err) {
		return {
			ok: false,
			error: err instanceof Error ? err.message : "Could not parse the analysis JSON."
		};
	}
});
var fetchClaimVerification_createServerFn_handler = createServerRpc({
	id: "a03d3d9c417910348249aaf952ee15eed8330ea14f1bbe0808509483bcfd39ce",
	name: "fetchClaimVerification",
	filename: "src/lib/ai/server.ts"
}, (opts) => fetchClaimVerification.__executeServer(opts));
var fetchClaimVerification = createServerFn({ method: "POST" }).validator((input) => input).handler(fetchClaimVerification_createServerFn_handler, async ({ data }) => {
	if (!data.query?.trim()) return {
		ok: false,
		error: "Enter a claim to verify."
	};
	const blocked = guardSources(data.sources);
	if (blocked) return {
		ok: false,
		error: blocked
	};
	const result = await runComplete({
		provider: data.provider,
		geminiApiKey: data.geminiApiKey,
		geminiModel: data.geminiModel,
		maxTokens: 2800,
		system: claimSystem(),
		user: claimUser({
			lens: data.activeLens,
			claim: data.query.trim(),
			sources: data.sources
		})
	});
	if (!result.ok) return result;
	try {
		const analysis = coerceAnalysis(extractJsonObject(result.text));
		return {
			ok: true,
			analysis,
			verification: analysis.claims[0] ?? {
				claim: data.query.trim(),
				evidence: analysis.tradition_a.summary,
				counter_arguments: analysis.tradition_b.summary,
				confidence: .45,
				citations: [...analysis.tradition_a.citations, ...analysis.tradition_b.citations]
			},
			provider: result.provider
		};
	} catch (err) {
		return {
			ok: false,
			error: err instanceof Error ? err.message : "Could not parse the verification JSON."
		};
	}
});
var fetchMindMapData_createServerFn_handler = createServerRpc({
	id: "e1e280427dd50b527756d8d469bbf555572726e32b7a6bccf667533a38820f9b",
	name: "fetchMindMapData",
	filename: "src/lib/ai/server.ts"
}, (opts) => fetchMindMapData.__executeServer(opts));
var fetchMindMapData = createServerFn({ method: "POST" }).validator((input) => input).handler(fetchMindMapData_createServerFn_handler, async ({ data }) => {
	const blocked = guardSources(data.sources);
	if (blocked) return {
		ok: false,
		error: blocked
	};
	const result = await runComplete({
		provider: data.provider,
		geminiApiKey: data.geminiApiKey,
		geminiModel: data.geminiModel,
		maxTokens: 3200,
		system: mindMapSystem(data.mode),
		user: mindMapUser({
			lens: data.activeLens,
			mode: data.mode,
			sources: data.sources,
			focusQuestion: data.focusQuestion
		})
	});
	if (!result.ok) return result;
	try {
		const parsed = coerceMindMap(extractJsonObject(result.text));
		if (!parsed.nodes.length) return {
			ok: false,
			error: "The model returned an empty concept graph."
		};
		return {
			ok: true,
			data: parsed,
			provider: result.provider
		};
	} catch (err) {
		return {
			ok: false,
			error: err instanceof Error ? err.message : "Could not parse the mind map JSON."
		};
	}
});
var fetchAudioOverviewScript_createServerFn_handler = createServerRpc({
	id: "2c758841df9e5d56f1a3c55fdd5a78a2f60a65e2783362b790907b39c66aa49d",
	name: "fetchAudioOverviewScript",
	filename: "src/lib/ai/server.ts"
}, (opts) => fetchAudioOverviewScript.__executeServer(opts));
var fetchAudioOverviewScript = createServerFn({ method: "POST" }).validator((input) => input).handler(fetchAudioOverviewScript_createServerFn_handler, async ({ data }) => {
	const blocked = guardSources(data.sources);
	if (blocked) return {
		ok: false,
		error: blocked
	};
	const result = await runComplete({
		provider: data.provider,
		geminiApiKey: data.geminiApiKey,
		geminiModel: data.geminiModel,
		maxTokens: data.length === "short" ? 2200 : 3400,
		system: audioSystem(data.mode, data.length),
		user: audioUser({
			lens: data.activeLens,
			mode: data.mode,
			sources: data.sources,
			length: data.length,
			focusQuestion: data.focusQuestion
		})
	});
	if (!result.ok) return result;
	try {
		const parsed = coerceAudio(extractJsonObject(result.text));
		if (!parsed.script.trim()) return {
			ok: false,
			error: "The model returned an empty script."
		};
		return {
			ok: true,
			data: parsed,
			provider: result.provider
		};
	} catch (err) {
		return {
			ok: false,
			error: err instanceof Error ? err.message : "Could not parse the overview script."
		};
	}
});
var fetchStudioSpeech_createServerFn_handler = createServerRpc({
	id: "71c8387d2ea500298ff894e872136b840a15551ceb8adc581b970cb5035b1259",
	name: "fetchStudioSpeech",
	filename: "src/lib/ai/server.ts"
}, (opts) => fetchStudioSpeech.__executeServer(opts));
var fetchStudioSpeech = createServerFn({ method: "POST" }).validator((input) => input).handler(fetchStudioSpeech_createServerFn_handler, async ({ data }) => {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return {
		ok: false,
		error: "Studio voice is not available here."
	};
	const text = data.text.trim().slice(0, 1400);
	if (text.length < 8) return {
		ok: false,
		error: "Nothing to speak."
	};
	const res = await fetch("https://api.x.ai/v1/tts", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			text,
			voice_id: "eve"
		})
	});
	if (!res.ok) return {
		ok: false,
		error: `Studio voice failed (${res.status}). Use browser playback instead.`
	};
	const buf = new Uint8Array(await res.arrayBuffer());
	let binary = "";
	const chunk = 32768;
	for (let i = 0; i < buf.length; i += chunk) binary += String.fromCharCode(...buf.subarray(i, i + chunk));
	return {
		ok: true,
		audioBase64: btoa(binary),
		mime: res.headers.get("content-type") || "audio/mpeg"
	};
});
//#endregion
export { fetchAiStatus_createServerFn_handler, fetchAudioOverviewScript_createServerFn_handler, fetchClaimVerification_createServerFn_handler, fetchDifferentiatorAnalysis_createServerFn_handler, fetchMindMapData_createServerFn_handler, fetchStudioSpeech_createServerFn_handler };

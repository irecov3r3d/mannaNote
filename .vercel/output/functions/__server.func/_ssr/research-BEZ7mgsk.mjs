import { i as __toESM } from "../_runtime.mjs";
import { i as STUDY_MODES } from "./lenses-BzzZXy4v.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { f as LoaderCircle, o as ShieldQuestion } from "../_libs/lucide-react.mjs";
import { t as useLiveQuery } from "../_libs/dexie-react-hooks.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { _ as truncate, a as Input, c as Button, d as cn, g as toPayloads, m as getDb, n as useMannaUI, r as ConfidenceBadge, s as Textarea, v as uid } from "./router-BMxYl8Bj.mjs";
import { t as AppShell } from "./app-shell-PANkDzPg.mjs";
import { i as fetchDifferentiatorAnalysis, r as fetchClaimVerification } from "./server-DXtzt49m.mjs";
import { t as aiOptsFromPrefs } from "./ai-opts-y9OC_FR2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/research-BEZ7mgsk.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CitationChip({ cite, className }) {
	const openSource = useMannaUI((s) => s.openSource);
	const label = cite.sourceTitle || "Source";
	const idx = Number.isFinite(cite.chunkIndex) ? cite.chunkIndex + 1 : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		title: cite.quote || label,
		onClick: () => {
			if (cite.sourceId) openSource(cite.sourceId, cite.chunkIndex);
		},
		className: cn("inline-flex max-w-full items-center gap-1 rounded-full border border-border bg-paper px-2 py-0.5 text-left text-[11px] text-muted-foreground transition-colors duration-150 hover:border-foreground/30 hover:text-foreground", className),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "truncate",
			children: [label, idx != null ? ` · ${idx}` : ""]
		})
	});
}
function CitationList({ citations }) {
	if (!citations?.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-2 flex flex-wrap gap-1.5",
		children: citations.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CitationChip, { cite: c }, `${c.sourceId}-${c.chunkIndex}-${i}`))
	});
}
function Meter({ value }) {
	const pct = Math.round(Math.min(1, Math.max(0, value)) * 100);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-1.5 w-24 overflow-hidden rounded-full bg-muted",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-full rounded-full bg-foreground/80",
				style: { width: `${pct}%` }
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "text-[11px] tabular-nums text-muted-foreground",
			children: [pct, "%"]
		})]
	});
}
function ClaimCard({ claim }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-medium leading-snug text-foreground",
					children: claim.claim
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meter, { value: claim.confidence })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "mt-3 space-y-2 text-sm leading-relaxed",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
					className: "text-[11px] font-medium tracking-wide text-muted-foreground uppercase",
					children: "Evidence"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
					className: "mt-0.5 text-foreground/90",
					children: claim.evidence
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
					className: "text-[11px] font-medium tracking-wide text-muted-foreground uppercase",
					children: "Counter-reading"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
					className: "mt-0.5 text-foreground/90",
					children: claim.counter_arguments
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CitationList, { citations: claim.citations })
		]
	});
}
function AnalysisReport({ analysis, className }) {
	const extras = analysis.additional_traditions ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("space-y-5", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase",
				children: "Analysis"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-1 font-serif text-2xl tracking-tight",
				children: analysis.topic
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 md:grid-cols-2",
				children: [
					analysis.tradition_a,
					analysis.tradition_b,
					...extras
				].map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-xl bg-paper p-4 shadow-[var(--shadow-border)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] font-medium tracking-wide text-muted-foreground uppercase",
							children: i === 0 ? "Text A" : i === 1 ? "Text B" : `Witness ${i + 1}`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-1 font-serif text-lg leading-snug",
							children: t.label
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm leading-relaxed text-foreground/90",
							children: t.summary
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CitationList, { citations: t.citations })
					]
				}, `${t.label}-${i}`))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-3 rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Block, {
						title: "Core divergence",
						body: analysis.core_divergence
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Block, {
						title: "Underlying axioms",
						body: analysis.underlying_axioms
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Block, {
						title: "Historical context",
						body: analysis.historical_context
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Block, {
						title: "Confidence notes",
						body: analysis.confidence_notes
					})
				]
			}),
			analysis.claims.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase",
					children: "Claim verification"
				}), analysis.claims.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClaimCard, { claim: c }, `${c.claim}-${i}`))]
			})
		]
	});
}
function Block({ title, body }) {
	if (!body) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-[11px] font-medium tracking-wide text-muted-foreground uppercase",
		children: title
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-1 text-sm leading-relaxed",
		children: body
	})] });
}
function SourceSelect({ label, value, onChange, sources, exclude }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block min-w-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-[11px] font-medium tracking-wide text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
			value: value ?? "",
			onChange: (e) => onChange(e.target.value || null),
			className: "mt-1 h-11 w-full rounded-md border border-input bg-paper px-3 text-sm text-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
				value: "",
				children: "Choose a source"
			}), sources.filter((s) => s.id !== exclude).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
				value: s.id,
				children: s.title
			}, s.id))]
		})]
	});
}
function TextPane({ source }) {
	const openSource = useMannaUI((s) => s.openSource);
	if (!source) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-32 items-center rounded-xl bg-paper px-4 py-6 text-sm text-muted-foreground shadow-[var(--shadow-border)]",
		children: "Select a source to read it here."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: () => openSource(source.id),
		className: "block w-full rounded-xl bg-paper p-4 text-left shadow-[var(--shadow-border)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-2 flex flex-wrap items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-serif text-lg leading-snug",
					children: source.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfidenceBadge, {
					level: source.confidenceLevel,
					compact: true
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "source-prose line-clamp-6 whitespace-pre-wrap",
				children: truncate(source.fullText, 900)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-[11px] text-muted-foreground",
				children: "Open full text"
			})
		]
	});
}
function ResearchView() {
	const sources = useLiveQuery(() => getDb().sources.orderBy("createdAt").reverse().toArray(), []);
	const prefs = useLiveQuery(() => getDb().preferences.get("main"), []);
	const history = useLiveQuery(() => getDb().comparisons.orderBy("createdAt").reverse().limit(12).toArray(), []);
	const sourceA = useMannaUI((s) => s.sourceA);
	const sourceB = useMannaUI((s) => s.sourceB);
	const extraSourceIds = useMannaUI((s) => s.extraSourceIds);
	const setSourceA = useMannaUI((s) => s.setSourceA);
	const setSourceB = useMannaUI((s) => s.setSourceB);
	const toggleExtra = useMannaUI((s) => s.toggleExtra);
	const studyMode = useMannaUI((s) => s.studyMode);
	const setStudyMode = useMannaUI((s) => s.setStudyMode);
	const focusQuestion = useMannaUI((s) => s.focusQuestion);
	const setFocusQuestion = useMannaUI((s) => s.setFocusQuestion);
	const [pane, setPane] = (0, import_react.useState)("analysis");
	const [busy, setBusy] = (0, import_react.useState)(null);
	const [analysis, setAnalysis] = (0, import_react.useState)(null);
	const [claim, setClaim] = (0, import_react.useState)("");
	const list = sources ?? [];
	const a = list.find((s) => s.id === sourceA);
	const b = list.find((s) => s.id === sourceB);
	const selectedIds = (0, import_react.useMemo)(() => {
		const ids = [
			sourceA,
			sourceB,
			...extraSourceIds
		].filter((id) => Boolean(id));
		return [...new Set(ids)];
	}, [
		sourceA,
		sourceB,
		extraSourceIds
	]);
	async function runCompare() {
		if (!prefs) return;
		if (selectedIds.length < 2) {
			toast.error("Choose at least two sources.");
			return;
		}
		setBusy("compare");
		try {
			const payloads = await toPayloads(selectedIds);
			const res = await fetchDifferentiatorAnalysis({ data: {
				...aiOptsFromPrefs(prefs),
				sources: payloads,
				activeLens: prefs.activeLens,
				mode: studyMode,
				focusQuestion: focusQuestion || void 0
			} });
			if (!res.ok) {
				toast.error(res.error);
				return;
			}
			setAnalysis(res.analysis);
			setPane("analysis");
			const record = {
				id: uid(),
				sourceIds: selectedIds,
				mode: studyMode,
				lens: prefs.activeLens,
				topic: res.analysis.topic,
				analysis: res.analysis,
				createdAt: Date.now()
			};
			await getDb().comparisons.put(record);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Analysis failed.");
		} finally {
			setBusy(null);
		}
	}
	async function runClaim() {
		if (!prefs) return;
		if (!claim.trim()) {
			toast.error("Enter a claim to verify.");
			return;
		}
		if (selectedIds.length < 1) {
			toast.error("Select sources to weigh the claim against.");
			return;
		}
		setBusy("claim");
		try {
			const payloads = await toPayloads(selectedIds);
			const res = await fetchClaimVerification({ data: {
				...aiOptsFromPrefs(prefs),
				query: claim.trim(),
				sources: payloads,
				activeLens: prefs.activeLens
			} });
			if (!res.ok) {
				toast.error(res.error);
				return;
			}
			setAnalysis(res.analysis);
			setPane("analysis");
			await getDb().comparisons.put({
				id: uid(),
				sourceIds: selectedIds,
				mode: studyMode,
				lens: prefs.activeLens,
				topic: res.analysis.topic || claim.trim(),
				analysis: res.analysis,
				createdAt: Date.now()
			});
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Verification failed.");
		} finally {
			setBusy(null);
		}
	}
	if (list.length < 1) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl bg-card px-5 py-10 text-center shadow-[var(--shadow-border)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-serif text-2xl",
			children: "Research needs sources"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mx-auto mt-2 max-w-sm text-sm text-muted-foreground",
			children: "Add at least two texts in the Vault, then return here to compare them."
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-serif text-3xl tracking-tight",
				children: "Research"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Two texts, one lens, four modes. Distinctions are kept on purpose."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-1 rounded-xl bg-muted p-1 sm:grid-cols-4",
				children: STUDY_MODES.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setStudyMode(m.id),
					className: cn("rounded-lg px-3 py-2.5 text-left transition-colors duration-150", studyMode === m.id ? "bg-card text-foreground shadow-[var(--shadow-border)]" : "text-muted-foreground hover:text-foreground"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium",
						children: m.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-0.5 hidden text-[11px] leading-snug sm:block",
						children: m.short
					})]
				}, m.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm leading-relaxed text-muted-foreground",
				children: STUDY_MODES.find((m) => m.id === studyMode)?.detail
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceSelect, {
					label: "Text A",
					value: sourceA,
					onChange: setSourceA,
					sources: list,
					exclude: sourceB
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceSelect, {
					label: "Text B",
					value: sourceB,
					onChange: setSourceB,
					sources: list,
					exclude: sourceA
				})]
			}),
			list.length > 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] font-medium tracking-wide text-muted-foreground",
				children: "Additional witnesses"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 flex flex-wrap gap-1.5",
				children: list.filter((s) => s.id !== sourceA && s.id !== sourceB).map((s) => {
					const on = extraSourceIds.includes(s.id);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => toggleExtra(s.id),
						className: cn("h-9 rounded-full px-3 text-xs", on ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-muted"),
						children: s.title
					}, s.id);
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: focusQuestion,
				onChange: (e) => setFocusQuestion(e.target.value),
				placeholder: "Optional focus question (does not license blending)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "lg",
				className: "w-full sm:w-auto",
				disabled: busy !== null || selectedIds.length < 2,
				onClick: () => void runCompare(),
				children: [
					busy === "compare" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }),
					"Run ",
					STUDY_MODES.find((m) => m.id === studyMode)?.label,
					" pass"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex rounded-md bg-muted p-0.5 md:hidden",
				children: [
					["a", "Text A"],
					["b", "Text B"],
					["analysis", "Analysis"]
				].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setPane(id),
					className: cn("h-9 flex-1 rounded text-xs font-medium", pane === id ? "bg-card text-foreground" : "text-muted-foreground"),
					children: label
				}, id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 md:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cn(pane !== "a" && "max-md:hidden"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextPane, { source: a })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cn(pane !== "b" && "max-md:hidden"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextPane, { source: b })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: cn("rounded-xl bg-card p-4 shadow-[var(--shadow-border)] md:block", pane !== "analysis" && "max-md:hidden"),
				children: analysis ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnalysisReport, { analysis }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "py-6 text-center text-sm text-muted-foreground",
					children: "Analysis appears here with citations after a pass."
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldQuestion, { className: "size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-serif text-xl",
							children: "Claim verification"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Test a strong or consensus-style claim against the selected sources."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						className: "mt-3 min-h-24",
						value: claim,
						onChange: (e) => setClaim(e.target.value),
						placeholder: "e.g. John and Thomas teach the same doctrine of the Word."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "mt-3",
						variant: "outline",
						disabled: busy !== null || !claim.trim() || selectedIds.length < 1,
						onClick: () => void runClaim(),
						children: [busy === "claim" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }), "Weigh this claim"]
					})
				]
			}),
			history && history.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-serif text-xl",
				children: "Past analyses"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 space-y-2",
				children: history.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => {
						setAnalysis(h.analysis);
						setPane("analysis");
						if (h.sourceIds[0]) setSourceA(h.sourceIds[0]);
						if (h.sourceIds[1]) setSourceB(h.sourceIds[1]);
					},
					className: "w-full rounded-xl bg-card px-4 py-3 text-left shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: h.topic
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-0.5 text-[11px] text-muted-foreground",
						children: [
							h.mode,
							" · ",
							h.lens.branch
						]
					})]
				}) }, h.id))
			})] })
		]
	});
}
function ResearchPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResearchView, {}) });
}
//#endregion
export { ResearchPage as component };

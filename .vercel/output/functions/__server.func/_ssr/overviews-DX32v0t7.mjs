import { i as __toESM } from "../_runtime.mjs";
import { i as STUDY_MODES } from "./lenses-BzzZXy4v.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as Square, f as LoaderCircle, l as Play, u as Pause } from "../_libs/lucide-react.mjs";
import { t as useLiveQuery } from "../_libs/dexie-react-hooks.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as Button, d as cn, g as toPayloads, m as getDb, n as useMannaUI, p as formatDate, v as uid } from "./router-BMxYl8Bj.mjs";
import { t as AppShell } from "./app-shell-PANkDzPg.mjs";
import { a as fetchMindMapData, n as fetchAudioOverviewScript, o as fetchStudioSpeech } from "./server-DXtzt49m.mjs";
import { t as aiOptsFromPrefs } from "./ai-opts-y9OC_FR2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/overviews-DX32v0t7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function traditionTone(t) {
	const v = (t || "").toLowerCase();
	if (v === "a" || v.includes("text a")) return "border-l-conf-scholarly";
	if (v === "b" || v.includes("text b")) return "border-l-conf-web";
	if (v === "shared") return "border-l-conf-reference";
	return "border-l-lens";
}
function buildTree(nodes) {
	const byParent = /* @__PURE__ */ new Map();
	for (const n of nodes) {
		const key = n.parentId || "root";
		const list = byParent.get(key) ?? [];
		list.push(n);
		byParent.set(key, list);
	}
	const roots = nodes.filter((n) => !n.parentId);
	const fallback = roots.length ? roots : nodes.slice(0, 1);
	function kids(id) {
		return (byParent.get(id) ?? []).filter((c) => c.id !== id);
	}
	return fallback.map((node) => ({
		node,
		children: kids(node.id)
	}));
}
function NodeCard({ node, depth, children }) {
	const openSource = useMannaUI((s) => s.openSource);
	const clickable = Boolean(node.sourceId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-w-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			disabled: !clickable,
			onClick: () => {
				if (node.sourceId) openSource(node.sourceId, 0);
			},
			className: cn("w-full rounded-lg border-l-2 bg-card px-3 py-2.5 text-left shadow-[var(--shadow-border)] transition-shadow duration-150", traditionTone(node.tradition), clickable && "hover:shadow-[var(--shadow-border-hover)]", depth === 0 && "bg-paper"),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] tracking-wide text-muted-foreground",
					children: node.tradition || (depth === 0 ? "Topic" : "Concept")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-medium leading-snug text-foreground",
					children: node.label
				}),
				node.detail && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs leading-relaxed text-muted-foreground",
					children: node.detail
				}),
				node.citation && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 font-serif text-xs italic text-foreground/80",
					children: [
						"“",
						node.citation,
						"”"
					]
				})
			]
		}), children]
	});
}
function Branch({ node, all, depth }) {
	const children = all.filter((n) => n.parentId === node.id);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NodeCard, {
		node,
		depth,
		children: children.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("mt-2 grid gap-2 pl-3", children.length > 1 && depth < 1 ? "sm:grid-cols-2" : "grid-cols-1"),
			children: children.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Branch, {
				node: c,
				all,
				depth: depth + 1
			}, c.id))
		})
	});
}
function MermaidBlock({ chart }) {
	const ref = (0, import_react.useRef)(null);
	const [err, setErr] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		(async () => {
			try {
				const mermaid = (await import("../_libs/mermaid+[...].mjs").then((n) => n.t)).default;
				const dark = document.documentElement.classList.contains("dark");
				mermaid.initialize({
					startOnLoad: false,
					securityLevel: "loose",
					theme: dark ? "dark" : "neutral",
					fontFamily: "Figtree, sans-serif"
				});
				const id = `mm_${Math.random().toString(36).slice(2)}`;
				const { svg } = await mermaid.render(id, chart);
				if (!cancelled && ref.current) {
					ref.current.innerHTML = svg;
					ref.current.querySelector("svg")?.classList.add("mx-auto", "max-w-full");
				}
			} catch {
				if (!cancelled) setErr("Diagram could not be drawn from the returned syntax.");
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [chart]);
	if (err) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted-foreground",
		children: err
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref,
		className: "overflow-x-auto py-2"
	});
}
function MindMapView({ data }) {
	const [tab, setTab] = (0, import_react.useState)("graph");
	const trees = (0, import_react.useMemo)(() => buildTree(data.nodes), [data.nodes]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-4 flex items-center justify-between gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-serif text-2xl tracking-tight",
			children: data.topic
		}), data.mermaid && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex rounded-md bg-muted p-0.5 text-xs",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: cn("h-8 rounded px-2.5", tab === "graph" ? "bg-card text-foreground" : "text-muted-foreground"),
				onClick: () => setTab("graph"),
				children: "Graph"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: cn("h-8 rounded px-2.5", tab === "diagram" ? "bg-card text-foreground" : "text-muted-foreground"),
				onClick: () => setTab("diagram"),
				children: "Diagram"
			})]
		})]
	}), tab === "diagram" && data.mermaid ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MermaidBlock, { chart: data.mermaid }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-3",
		children: trees.map(({ node }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Branch, {
			node,
			all: data.nodes,
			depth: 0
		}, node.id))
	})] });
}
function SourceMulti({ sources, selected, onToggle }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex flex-wrap gap-1.5",
		children: sources.map((s) => {
			const on = selected.includes(s.id);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => onToggle(s.id),
				className: cn("h-9 rounded-full px-3 text-xs", on ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-muted"),
				children: s.title
			}, s.id);
		})
	});
}
function AudioPlayer({ data }) {
	const [speaking, setSpeaking] = (0, import_react.useState)(false);
	const [paused, setPaused] = (0, import_react.useState)(false);
	const [studioBusy, setStudioBusy] = (0, import_react.useState)(false);
	const audioRef = (0, import_react.useRef)(null);
	const urlRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		return () => {
			window.speechSynthesis?.cancel();
			if (urlRef.current) URL.revokeObjectURL(urlRef.current);
			audioRef.current?.pause();
		};
	}, []);
	function playBrowser() {
		window.speechSynthesis?.cancel();
		audioRef.current?.pause();
		const utter = new SpeechSynthesisUtterance(data.script);
		utter.rate = .95;
		utter.onend = () => {
			setSpeaking(false);
			setPaused(false);
		};
		window.speechSynthesis.speak(utter);
		setSpeaking(true);
		setPaused(false);
	}
	function stopAll() {
		window.speechSynthesis?.cancel();
		audioRef.current?.pause();
		setSpeaking(false);
		setPaused(false);
	}
	function togglePause() {
		if (!speaking) return;
		if (paused) {
			window.speechSynthesis.resume();
			audioRef.current?.play();
			setPaused(false);
		} else {
			window.speechSynthesis.pause();
			audioRef.current?.pause();
			setPaused(true);
		}
	}
	async function playStudio() {
		setStudioBusy(true);
		try {
			const res = await fetchStudioSpeech({ data: { text: data.script.slice(0, 1400) } });
			if (!res.ok) {
				toast.error(res.error);
				return;
			}
			const bytes = Uint8Array.from(atob(res.audioBase64), (c) => c.charCodeAt(0));
			const blob = new Blob([bytes], { type: res.mime });
			if (urlRef.current) URL.revokeObjectURL(urlRef.current);
			const url = URL.createObjectURL(blob);
			urlRef.current = url;
			window.speechSynthesis?.cancel();
			const audio = new Audio(url);
			audioRef.current = audio;
			audio.onended = () => {
				setSpeaking(false);
				setPaused(false);
			};
			await audio.play();
			setSpeaking(true);
			setPaused(false);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Studio voice failed.");
		} finally {
			setStudioBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-serif text-2xl tracking-tight",
			children: data.title
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-muted-foreground",
			children: data.durationHint
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 flex flex-wrap gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: playBrowser,
					className: "pr-3.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-4" }), "Play script"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					onClick: togglePause,
					disabled: !speaking,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "size-4" }), paused ? "Resume" : "Pause"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "ghost",
					onClick: stopAll,
					disabled: !speaking,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "size-4" }), "Stop"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					onClick: () => void playStudio(),
					disabled: studioBusy,
					children: [studioBusy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }), "Studio voice"]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6 space-y-4",
			children: data.beats.length ? data.beats.map((b, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-serif text-lg",
				children: b.heading
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm leading-relaxed whitespace-pre-wrap",
				children: b.narration
			})] }, `${b.heading}-${i}`)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "source-prose whitespace-pre-wrap",
				children: data.script
			})
		})
	] });
}
function OverviewsView() {
	const sources = useLiveQuery(() => getDb().sources.orderBy("createdAt").reverse().toArray(), []);
	const prefs = useLiveQuery(() => getDb().preferences.get("main"), []);
	const history = useLiveQuery(() => getDb().overviews.orderBy("createdAt").reverse().toArray(), []);
	const studyMode = useMannaUI((s) => s.studyMode);
	const setStudyMode = useMannaUI((s) => s.setStudyMode);
	const sourceA = useMannaUI((s) => s.sourceA);
	const sourceB = useMannaUI((s) => s.sourceB);
	const extraSourceIds = useMannaUI((s) => s.extraSourceIds);
	const focusQuestion = useMannaUI((s) => s.focusQuestion);
	const [picked, setPicked] = (0, import_react.useState)([]);
	const [busy, setBusy] = (0, import_react.useState)(null);
	const [map, setMap] = (0, import_react.useState)(null);
	const [audio, setAudio] = (0, import_react.useState)(null);
	const [length, setLength] = (0, import_react.useState)("short");
	const list = sources ?? [];
	(0, import_react.useEffect)(() => {
		if (picked.length === 0) {
			const seed = [
				sourceA,
				sourceB,
				...extraSourceIds
			].filter((id) => Boolean(id));
			if (seed.length) setPicked([...new Set(seed)]);
		}
	}, [sourceA, sourceB]);
	const selected = (0, import_react.useMemo)(() => picked.length ? picked : list.slice(0, 2).map((s) => s.id), [picked, list]);
	function toggle(id) {
		setPicked((cur) => {
			const base = cur.length ? cur : selected;
			return base.includes(id) ? base.filter((x) => x !== id) : [...base, id];
		});
	}
	async function persist(type, title, payload) {
		if (!prefs) return;
		await getDb().overviews.put({
			id: uid(),
			type,
			sourceIds: selected,
			mode: studyMode,
			lens: prefs.activeLens,
			title,
			payload,
			createdAt: Date.now()
		});
	}
	async function runMap() {
		if (!prefs) return;
		if (selected.length < 1) {
			toast.error("Select at least one source.");
			return;
		}
		setBusy("map");
		try {
			const payloads = await toPayloads(selected);
			const res = await fetchMindMapData({ data: {
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
			setMap(res.data);
			await persist("mindmap", res.data.topic, res.data);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Mind map failed.");
		} finally {
			setBusy(null);
		}
	}
	async function runAudio() {
		if (!prefs) return;
		if (selected.length < 1) {
			toast.error("Select at least one source.");
			return;
		}
		setBusy("audio");
		try {
			const payloads = await toPayloads(selected);
			const res = await fetchAudioOverviewScript({ data: {
				...aiOptsFromPrefs(prefs),
				sources: payloads,
				activeLens: prefs.activeLens,
				mode: studyMode,
				length,
				focusQuestion: focusQuestion || void 0
			} });
			if (!res.ok) {
				toast.error(res.error);
				return;
			}
			setAudio(res.data);
			await persist("audio", res.data.title, res.data);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Overview failed.");
		} finally {
			setBusy(null);
		}
	}
	if (list.length < 1) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl bg-card px-5 py-10 text-center shadow-[var(--shadow-border)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-serif text-2xl",
			children: "Nothing to map yet"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mx-auto mt-2 max-w-sm text-sm text-muted-foreground",
			children: "Add sources in the Vault first. Overviews are built from the texts you hold."
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-serif text-3xl tracking-tight",
				children: "Overviews"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Concept graphs and spoken scripts that keep traditions distinct."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-1 rounded-xl bg-muted p-1 sm:grid-cols-4",
				children: STUDY_MODES.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setStudyMode(m.id),
					className: cn("rounded-lg px-3 py-2 text-sm", studyMode === m.id ? "bg-card font-medium shadow-[var(--shadow-border)]" : "text-muted-foreground"),
					children: m.label
				}, m.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-2 text-[11px] font-medium tracking-wide text-muted-foreground",
				children: "Sources in this overview"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceMulti, {
				sources: list,
				selected,
				onToggle: toggle
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: () => void runMap(),
						disabled: busy !== null,
						children: [busy === "map" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }), "Generate mind map"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex rounded-md bg-muted p-0.5",
						children: ["short", "standard"].map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setLength(id),
							className: cn("h-9 rounded px-3 text-xs capitalize", length === id ? "bg-card text-foreground" : "text-muted-foreground"),
							children: id
						}, id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						onClick: () => void runAudio(),
						disabled: busy !== null,
						children: [busy === "audio" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }), "Audio-style overview"]
					})
				]
			}),
			map && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MindMapView, { data: map })
			}),
			audio && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AudioPlayer, { data: audio })
			}),
			history && history.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-serif text-xl",
				children: "History"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 space-y-2",
				children: history.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => {
						if (h.type === "mindmap") setMap(h.payload);
						else setAudio(h.payload);
					},
					className: "w-full rounded-xl bg-card px-4 py-3 text-left shadow-[var(--shadow-border)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: h.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-0.5 text-[11px] text-muted-foreground",
						children: [
							h.type === "mindmap" ? "Mind map" : "Audio overview",
							" · ",
							h.mode,
							" ·",
							" ",
							formatDate(h.createdAt)
						]
					})]
				}) }, h.id))
			})] })
		]
	});
}
function OverviewsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OverviewsView, {}) });
}
//#endregion
export { OverviewsPage as component };

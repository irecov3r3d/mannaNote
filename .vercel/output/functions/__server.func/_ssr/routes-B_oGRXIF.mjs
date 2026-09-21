import { i as __toESM } from "../_runtime.mjs";
import { s as suggestConfidence, t as CONFIDENCE_LADDER } from "./lenses-BzzZXy4v.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as DialogOverlay$1, i as DialogDescription$1, n as DialogClose, o as DialogPortal$1, r as DialogContent$1, s as DialogTitle$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { c as Search, m as FileUp, r as Trash2, t as X } from "../_libs/lucide-react.mjs";
import { t as useLiveQuery } from "../_libs/dexie-react-hooks.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { _ as truncate, a as Input, b as updateSource, c as Button, d as cn, f as deleteSource, h as loadSampleLibrary, i as ConfidenceDot, l as addSource, m as getDb, n as useMannaUI, o as Label, p as formatDate, r as ConfidenceBadge, s as Textarea } from "./router-BMxYl8Bj.mjs";
import { t as AppShell } from "./app-shell-PANkDzPg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-B_oGRXIF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Dialog = Dialog$1;
var DialogPortal = DialogPortal$1;
function DialogOverlay({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
		className: cn("fixed inset-0 z-50 bg-background/70 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
		...props
	});
}
function DialogContent({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
		className: cn("fixed top-[50%] left-[50%] z-50 grid w-[calc(100%-2rem)] max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 rounded-xl bg-card p-5 text-card-foreground shadow-[var(--shadow-border)] duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
			className: "absolute top-3 right-3 rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "sr-only",
				children: "Close"
			})]
		})]
	})] });
}
function DialogHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex flex-col gap-1.5 pr-8", className),
		...props
	});
}
function DialogTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
		className: cn("font-serif text-xl font-medium tracking-tight", className),
		...props
	});
}
function DialogDescription({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
		className: cn("text-sm text-muted-foreground", className),
		...props
	});
}
function decodeEntities(html) {
	return html.replace(/&nbsp;/gi, " ").replace(/&/gi, "&").replace(/</gi, "<").replace(/>/gi, ">").replace(/"/gi, "\"").replace(/&#39;/gi, "'").replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n))).replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)));
}
function stripMarkup(html) {
	return decodeEntities(html.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "").replace(/<br\s*\/?>/gi, "\n").replace(/<\/(p|div|h[1-6]|li|tr|blockquote)>/gi, "\n\n").replace(/<[^>]+>/g, " ")).replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").replace(/[ \t]{2,}/g, " ").trim();
}
async function extractPdf(file) {
	const pdfjs = await import("../_libs/pdfjs-dist.mjs").then((n) => n.t);
	const workerUrl = (await import("./pdf.worker.min-CA4SejP6.mjs")).default;
	pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
	const data = new Uint8Array(await file.arrayBuffer());
	const doc = await pdfjs.getDocument({ data }).promise;
	const pages = [];
	const limit = Math.min(doc.numPages, 80);
	for (let i = 1; i <= limit; i += 1) {
		const line = (await (await doc.getPage(i)).getTextContent()).items.map((item) => "str" in item ? item.str : "").join(" ");
		pages.push(line);
	}
	if (doc.numPages > 80) pages.push(`\n\n[Truncated: ${doc.numPages - 80} further pages were not imported.]`);
	return pages.join("\n\n").replace(/[ \t]{2,}/g, " ").trim();
}
async function extractEpub(file) {
	const zip = await (await import("../_libs/jszip+[...].mjs").then((n) => /* @__PURE__ */ __toESM(n.t()))).default.loadAsync(await file.arrayBuffer());
	const container = await zip.file("META-INF/container.xml")?.async("string");
	if (!container) {
		const htmlFiles = Object.keys(zip.files).filter((n) => /\.(x?html|htm|xml)$/i.test(n));
		const parts = [];
		for (const name of htmlFiles.slice(0, 40)) {
			const xml = await zip.file(name)?.async("string");
			if (xml) parts.push(stripMarkup(xml));
		}
		return parts.filter(Boolean).join("\n\n");
	}
	const opfHref = container.match(/full-path="([^"]+)"/)?.[1] ?? container.match(/full-path='([^']+)'/)?.[1];
	if (!opfHref) throw new Error("EPUB container has no package document.");
	const opfDir = opfHref.includes("/") ? opfHref.slice(0, opfHref.lastIndexOf("/") + 1) : "";
	const opf = await zip.file(opfHref)?.async("string");
	if (!opf) throw new Error("Could not read the EPUB package document.");
	const manifest = /* @__PURE__ */ new Map();
	const itemRe = /<item\b[^>]*id="([^"]+)"[^>]*href="([^"]+)"[^>]*>/gi;
	let m;
	while (m = itemRe.exec(opf)) manifest.set(m[1], m[2]);
	const hrefIdRe = /<item\b[^>]*href="([^"]+)"[^>]*id="([^"]+)"[^>]*>/gi;
	while (m = hrefIdRe.exec(opf)) if (!manifest.has(m[2])) manifest.set(m[2], m[1]);
	const spineIds = [];
	const spineRe = /<itemref\b[^>]*idref="([^"]+)"[^>]*>/gi;
	while (m = spineRe.exec(opf)) spineIds.push(m[1]);
	const parts = [];
	for (const id of spineIds.slice(0, 50)) {
		const href = manifest.get(id);
		if (!href) continue;
		const path = `${opfDir}${href}`.replace(/\/{2,}/g, "/");
		const xml = await zip.file(path)?.async("string");
		if (xml) {
			const text = stripMarkup(xml);
			if (text) parts.push(text);
		}
	}
	return parts.join("\n\n").trim();
}
async function extractFromFile(file) {
	const filename = file.name;
	const title = filename.replace(/\.[^.]+$/, "") || "Untitled source";
	const mime = file.type || "application/octet-stream";
	const lower = filename.toLowerCase();
	if (lower.endsWith(".pdf") || mime.includes("pdf")) {
		const text = await extractPdf(file);
		if (!text) throw new Error("No extractable text in this PDF.");
		return {
			title,
			text,
			mime: "application/pdf",
			filename
		};
	}
	if (lower.endsWith(".epub") || mime.includes("epub")) {
		const text = await extractEpub(file);
		if (!text) throw new Error("No extractable text in this EPUB.");
		return {
			title,
			text,
			mime: "application/epub+zip",
			filename
		};
	}
	const raw = await file.text();
	const text = lower.endsWith(".html") || lower.endsWith(".htm") || mime.includes("html") ? stripMarkup(raw) : raw.replace(/\u0000/g, "").trim();
	if (!text) throw new Error("That file appears to be empty.");
	return {
		title,
		text,
		mime,
		filename
	};
}
function titleFromText(text, fallback = "Untitled source") {
	return text.split(/\n/).map((l) => l.trim()).find((l) => l.length > 2 && l.length < 90) || fallback;
}
function VaultView() {
	const sources = useLiveQuery(() => getDb().sources.orderBy("createdAt").reverse().toArray(), []);
	const prefs = useLiveQuery(() => getDb().preferences.get("main"), []);
	const query = useMannaUI((s) => s.vaultQuery);
	const setQuery = useMannaUI((s) => s.setVaultQuery);
	const confFilter = useMannaUI((s) => s.vaultConfidence);
	const setConf = useMannaUI((s) => s.setVaultConfidence);
	const openSource = useMannaUI((s) => s.openSource);
	const fileRef = (0, import_react.useRef)(null);
	const [pasteOpen, setPasteOpen] = (0, import_react.useState)(false);
	const [pasteTitle, setPasteTitle] = (0, import_react.useState)("");
	const [pasteText, setPasteText] = (0, import_react.useState)("");
	const [pasteConf, setPasteConf] = (0, import_react.useState)("primary");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const filtered = (sources ?? []).filter((s) => {
		if (confFilter !== "all" && s.confidenceLevel !== confFilter) return false;
		const q = query.trim().toLowerCase();
		if (!q) return true;
		return s.title.toLowerCase().includes(q) || s.lensTags.some((t) => t.toLowerCase().includes(q)) || s.fullText.toLowerCase().includes(q);
	});
	async function ingestFile(file) {
		setBusy(true);
		try {
			const doc = await extractFromFile(file);
			const conf = suggestConfidence(doc.title, doc.text);
			await addSource({
				title: doc.title,
				text: doc.text,
				confidenceLevel: conf,
				lensTags: prefs?.activeLens ? [prefs.activeLens.family] : [],
				filename: doc.filename,
				mime: doc.mime,
				origin: "upload"
			});
			toast.success(`Added “${doc.title}” as ${conf}.`);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not import that file.");
		} finally {
			setBusy(false);
		}
	}
	async function savePaste() {
		const text = pasteText.trim();
		if (!text) return;
		setBusy(true);
		try {
			const title = pasteTitle.trim() || titleFromText(text);
			await addSource({
				title,
				text,
				confidenceLevel: pasteConf,
				lensTags: prefs?.activeLens ? [prefs.activeLens.family] : [],
				origin: "paste"
			});
			setPasteOpen(false);
			setPasteTitle("");
			setPasteText("");
			toast.success(`Added “${title}”.`);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not save the source.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-serif text-3xl tracking-tight",
				children: "Vault"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Sources stay on this device. Every later citation points back here."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						ref: fileRef,
						type: "file",
						accept: ".txt,.md,.html,.htm,.pdf,.epub,text/plain,application/pdf,application/epub+zip",
						className: "hidden",
						onChange: (e) => {
							const file = e.target.files?.[0];
							e.target.value = "";
							if (file) ingestFile(file);
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						onClick: () => fileRef.current?.click(),
						disabled: busy,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileUp, { className: "size-4" }), "Upload"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => setPasteOpen(true),
						disabled: busy,
						children: "Paste text"
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 flex flex-col gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: query,
					onChange: (e) => setQuery(e.target.value),
					placeholder: "Search titles, tags, or passages",
					className: "pl-9"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-1.5 overflow-x-auto pb-1",
				children: ["all", ...CONFIDENCE_LADDER.map((c) => c.id)].map((id) => {
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setConf(id),
						className: cn("inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3 text-xs font-medium", confFilter === id ? "bg-secondary text-foreground" : "bg-transparent text-muted-foreground hover:bg-muted"),
						children: [id !== "all" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfidenceDot, { level: id }), id === "all" ? "All" : CONFIDENCE_LADDER.find((c) => c.id === id)?.label]
					}, id);
				})
			})]
		}),
		!sources && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-10 text-sm text-muted-foreground",
			children: "Loading vault…"
		}),
		sources && sources.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-12 rounded-xl bg-card px-5 py-10 text-center shadow-[var(--shadow-border)]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-serif text-2xl",
					children: "An empty desk"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground",
					children: "Upload a PDF or EPUB, paste a passage, or load the four sample primaries."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-6",
					variant: "outline",
					disabled: busy,
					onClick: async () => {
						setBusy(true);
						try {
							const n = await loadSampleLibrary();
							toast.success(n ? `Loaded ${n} texts.` : "Samples already present.");
						} finally {
							setBusy(false);
						}
					},
					children: "Load sample library"
				})
			]
		}),
		sources && sources.length > 0 && filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-10 text-sm text-muted-foreground",
			children: "No sources match that filter."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-6 space-y-2",
			children: filtered.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "flex items-stretch gap-1 rounded-xl bg-card p-2 shadow-[var(--shadow-border)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => openSource(s.id),
					className: "min-w-0 flex-1 rounded-lg p-3 text-left hover:bg-muted/60",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-serif text-lg leading-snug",
								children: s.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfidenceBadge, {
								level: s.confidenceLevel,
								compact: true
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: truncate(s.fullText, 140)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-[11px] text-muted-foreground",
							children: [
								s.metadata.wordCount,
								" words · ",
								formatDate(s.createdAt),
								s.lensTags.length ? ` · ${s.lensTags.join(", ")}` : ""
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col justify-center gap-1 pr-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						"aria-label": "Confidence",
						value: s.confidenceLevel,
						onChange: (e) => void updateSource(s.id, { confidenceLevel: e.target.value }),
						className: "h-9 rounded-md border border-border bg-paper px-2 text-[11px] text-foreground",
						children: CONFIDENCE_LADDER.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: c.id,
							children: c.label
						}, c.id))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon-sm",
						"aria-label": "Delete source",
						onClick: async () => {
							await deleteSource(s.id);
							toast("Source removed.");
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
					})]
				})]
			}) }, s.id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: pasteOpen,
			onOpenChange: setPasteOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "max-h-[90dvh] overflow-y-auto",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Paste a source" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Plain text is stored locally and chunked for citations." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "paste-title",
								children: "Title"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "paste-title",
								value: pasteTitle,
								onChange: (e) => setPasteTitle(e.target.value),
								placeholder: "Optional — first line is used if blank"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "paste-body",
								children: "Text"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								id: "paste-body",
								value: pasteText,
								onChange: (e) => setPasteText(e.target.value),
								placeholder: "Paste the passage or full work",
								className: "min-h-40"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Confidence ladder" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-1.5",
								children: CONFIDENCE_LADDER.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setPasteConf(c.id),
									className: cn("inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-xs", pasteConf === c.id ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-muted"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfidenceDot, { level: c.id }), c.label]
								}, c.id))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex justify-end pt-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: savePaste,
								disabled: busy || !pasteText.trim(),
								children: "Add to vault"
							})
						})
					]
				})]
			})
		})
	] });
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VaultView, {}) });
}
//#endregion
export { Home as component };

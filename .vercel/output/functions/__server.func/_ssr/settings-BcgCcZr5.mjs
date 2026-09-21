import { i as __toESM } from "../_runtime.mjs";
import { r as LENS_FAMILIES } from "./lenses-BzzZXy4v.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as useLiveQuery } from "../_libs/dexie-react-hooks.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as Input, c as Button, d as cn, h as loadSampleLibrary, m as getDb, o as Label, u as clearVault, y as updatePreferences } from "./router-BMxYl8Bj.mjs";
import { t as AppShell } from "./app-shell-PANkDzPg.mjs";
import { t as fetchAiStatus } from "./server-DXtzt49m.mjs";
import { n as SwitchThumb, t as Switch$1 } from "../_libs/@radix-ui/react-switch+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-BcgCcZr5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Switch({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch$1, {
		className: cn("peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-border transition-colors data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50", className),
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchThumb, { className: "pointer-events-none block size-5 translate-x-0.5 rounded-full bg-paper shadow-sm transition-transform data-[state=checked]:translate-x-[1.35rem] data-[state=checked]:bg-primary-foreground" })
	});
}
function SettingsView() {
	const prefs = useLiveQuery(() => getDb().preferences.get("main"), []);
	const [xai, setXai] = (0, import_react.useState)(null);
	const [geminiKey, setGeminiKey] = (0, import_react.useState)("");
	const [geminiModel, setGeminiModel] = (0, import_react.useState)("gemini-2.0-flash");
	const [customLabel, setCustomLabel] = (0, import_react.useState)("");
	const [confirmClear, setConfirmClear] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		fetchAiStatus().then((s) => setXai(s.xai)).catch(() => setXai(false));
	}, []);
	(0, import_react.useEffect)(() => {
		if (!prefs) return;
		setGeminiKey(prefs.geminiApiKey);
		setGeminiModel(prefs.geminiModel);
		setCustomLabel(prefs.activeLens.customLabel ?? "");
	}, [prefs]);
	if (!prefs) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted-foreground",
		children: "Loading settings…"
	});
	const family = prefs.activeLens.family;
	const meta = LENS_FAMILIES.find((f) => f.family === family);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-xl space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-serif text-3xl tracking-tight",
				children: "Settings"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Lens, appearance, and how analyses are generated. The vault never leaves this device."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-xl",
						children: "Interpretive lens"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-1 gap-2 sm:grid-cols-2",
						children: LENS_FAMILIES.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => void updatePreferences({ activeLens: {
								family: f.family,
								branch: f.branches[0] ?? f.label,
								customLabel: f.family === "custom" ? customLabel || "Custom" : void 0
							} }),
							className: cn("rounded-xl bg-card px-4 py-3 text-left shadow-[var(--shadow-border)]", family === f.family && "ring-2 ring-ring/70"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium",
								children: f.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-0.5 text-xs text-muted-foreground",
								children: f.blurb
							})]
						}, f.family))
					}),
					family !== "custom" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-col gap-2",
						children: meta.branches.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => void updatePreferences({ activeLens: {
								...prefs.activeLens,
								branch: b
							} }),
							className: cn("rounded-xl bg-card px-4 py-3 text-left text-sm shadow-[var(--shadow-border)]", prefs.activeLens.branch === b && "ring-2 ring-ring/70"),
							children: b
						}, b))
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "custom-lens",
							children: "Custom lens name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "custom-lens",
							value: customLabel,
							onChange: (e) => setCustomLabel(e.target.value),
							onBlur: () => void updatePreferences({ activeLens: {
								family: "custom",
								branch: customLabel.trim() || "Custom",
								customLabel: customLabel.trim() || "Custom"
							} })
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-serif text-xl",
					children: "Appearance"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex h-14 items-center justify-between rounded-xl bg-card px-4 shadow-[var(--shadow-border)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium",
						children: "Dark desk"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Paper-on-ink for long sessions"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
						checked: prefs.theme !== "light",
						onCheckedChange: (on) => void updatePreferences({ theme: on ? "dark" : "light" })
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-xl",
						children: "AI engine"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm leading-relaxed text-muted-foreground",
						children: "Analyses run through Grok by default. No key is required from you. Optionally route calls through your own Google AI Studio (Gemini) key; it is stored only in this browser and sent with each request."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: [
							"Grok status:",
							" ",
							xai == null ? "checking…" : xai ? "available" : "unavailable in this environment"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-2",
						children: ["xai", "gemini"].map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => void updatePreferences({ aiProvider: p }),
							className: cn("h-11 flex-1 rounded-xl bg-card text-sm shadow-[var(--shadow-border)]", prefs.aiProvider === p && "ring-2 ring-ring/70"),
							children: p === "xai" ? "Grok" : "Gemini"
						}, p))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "gemini-key",
							children: "Google AI Studio API key"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "gemini-key",
							type: "password",
							autoComplete: "off",
							value: geminiKey,
							onChange: (e) => setGeminiKey(e.target.value),
							onBlur: () => void updatePreferences({ geminiApiKey: geminiKey.trim() }),
							placeholder: "Only needed if you select Gemini"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "gemini-model",
							children: "Gemini model"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "gemini-model",
							value: geminiModel,
							onChange: (e) => setGeminiModel(e.target.value),
							onBlur: () => void updatePreferences({ geminiModel: geminiModel.trim() || "gemini-2.0-flash" })
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-xl",
						children: "Vault data"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: async () => {
								const n = await loadSampleLibrary();
								toast.success(n ? `Added ${n} sample texts.` : "Samples already present.");
							},
							children: "Load sample library"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: confirmClear ? "destructive" : "outline",
							onClick: async () => {
								if (!confirmClear) {
									setConfirmClear(true);
									return;
								}
								await clearVault();
								setConfirmClear(false);
								toast("Vault cleared. Preferences were kept.");
							},
							children: confirmClear ? "Confirm clear vault" : "Clear vault"
						})]
					}),
					confirmClear && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "This removes sources, notes, comparisons, and overviews. Press again to confirm."
					})
				]
			})
		]
	});
}
function SettingsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsView, {}) });
}
//#endregion
export { SettingsPage as component };

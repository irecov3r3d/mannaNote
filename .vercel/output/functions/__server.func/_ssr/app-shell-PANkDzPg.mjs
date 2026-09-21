import { o as lensLabel } from "./lenses-BzzZXy4v.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { d as useRouterState, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as Map, h as BookOpen, p as GitCompare, s as Settings } from "../_libs/lucide-react.mjs";
import { t as useLiveQuery } from "../_libs/dexie-react-hooks.mjs";
import { d as cn, m as getDb } from "./router-BMxYl8Bj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app-shell-PANkDzPg.js
var import_jsx_runtime = require_jsx_runtime();
var TABS = [
	{
		to: "/",
		label: "Vault",
		icon: BookOpen
	},
	{
		to: "/research",
		label: "Research",
		icon: GitCompare
	},
	{
		to: "/overviews",
		label: "Overviews",
		icon: Map
	},
	{
		to: "/settings",
		label: "Settings",
		icon: Settings
	}
];
function AppShell({ children }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const prefs = useLiveQuery(() => getDb().preferences.get("main"), []);
	const lens = prefs ? lensLabel(prefs.activeLens) : "Lens";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "sticky top-0 z-30 border-b border-border bg-background/90 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 backdrop-blur-sm md:px-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-6xl items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-serif text-xl tracking-tight text-foreground",
							children: "MannaNote"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-[11px] tracking-wide text-muted-foreground",
							children: lens
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "hidden items-center gap-1 md:flex",
						children: TABS.map((tab) => {
							const active = tab.to === "/" ? pathname === "/" : pathname.startsWith(tab.to);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: tab.to,
								className: cn("inline-flex h-11 items-center gap-2 rounded-md px-3 text-sm transition-colors duration-150", active ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(tab.icon, { className: "size-4" }), tab.label]
							}, tab.to);
						})
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "mx-auto w-full max-w-6xl flex-1 px-4 pb-28 pt-5 md:px-8 md:pb-12",
				children
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm md:hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "grid grid-cols-4",
					children: TABS.map((tab) => {
						const active = tab.to === "/" ? pathname === "/" : pathname.startsWith(tab.to);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: tab.to,
							className: cn("flex h-14 flex-col items-center justify-center gap-0.5 text-[11px]", active ? "text-foreground" : "text-muted-foreground"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(tab.icon, {
								className: "size-5",
								strokeWidth: active ? 2.2 : 1.8
							}), tab.label]
						}) }, tab.to);
					})
				})
			})
		]
	});
}
//#endregion
export { AppShell as t };

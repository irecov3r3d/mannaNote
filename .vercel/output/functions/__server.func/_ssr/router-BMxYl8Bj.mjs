import { i as __toESM } from "../_runtime.mjs";
import { a as confidenceMeta, n as DEFAULT_LENS, r as LENS_FAMILIES } from "./lenses-BzzZXy4v.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { f as Slot } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as Dexie } from "../_libs/dexie.mjs";
import { _ as createRootRoute, g as createFileRoute, h as lazyRouteComponent, l as Scripts, m as Outlet, p as createRouter, u as HeadContent, y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as ArrowRight, g as BookMarked, i as StickyNote, n as TriangleAlert, t as X, v as ArrowLeft } from "../_libs/lucide-react.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
import { t as useLiveQuery } from "../_libs/dexie-react-hooks.mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { t as create } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/vault-CoE7OAw-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function uid() {
	if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
	return `id_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
function wordCount(text) {
	const trimmed = text.trim();
	if (!trimmed) return 0;
	return trimmed.split(/\s+/).length;
}
function formatDate(ts) {
	return new Intl.DateTimeFormat(void 0, {
		month: "short",
		day: "numeric",
		hour: "numeric",
		minute: "2-digit"
	}).format(ts);
}
function truncate(text, n) {
	const t = text.replace(/\s+/g, " ").trim();
	if (t.length <= n) return t;
	return `${t.slice(0, n - 1).trimEnd()}…`;
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,background-color,box-shadow,transform,opacity] duration-150 ease-out disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] active:not-disabled:scale-[0.96]", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground hover:bg-primary/90",
			secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
			outline: "border border-border bg-transparent hover:bg-muted text-foreground",
			ghost: "hover:bg-muted text-foreground",
			destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
			lens: "bg-lens/15 text-lens hover:bg-lens/25"
		},
		size: {
			default: "h-11 px-4",
			sm: "h-9 px-3 text-xs",
			lg: "h-12 px-5",
			icon: "size-11",
			"icon-sm": "size-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild = false, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		"data-slot": "button",
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		...props
	});
}
/**
* Local vault — IndexedDB via Dexie.
*
* This is intentionally client-only. Do not import from server functions.
* Schema notes:
*  - sources hold full text so the reader can open a work offline
*  - chunks are the citation unit the AI must quote against
*  - comparisons / overviews store structured JSON, not prose blobs
*  - preferences.id is always "main" (single-user local app)
*/
var MannaDB = class extends Dexie {
	sources;
	chunks;
	preferences;
	comparisons;
	notes;
	overviews;
	constructor() {
		super("MannaNote");
		this.version(1).stores({
			sources: "id, createdAt, confidenceLevel, title",
			chunks: "id, sourceId, index",
			preferences: "id",
			comparisons: "id, createdAt",
			notes: "id, sourceId, createdAt",
			overviews: "id, createdAt, type"
		});
	}
};
var instance = null;
function getDb() {
	if (typeof indexedDB === "undefined") throw new Error("MannaNote vault requires a browser with IndexedDB.");
	if (!instance) instance = new MannaDB();
	return instance;
}
var DEFAULT_PREFS = {
	id: "main",
	activeLens: DEFAULT_LENS,
	theme: "dark",
	onboardingComplete: false,
	aiProvider: "xai",
	geminiApiKey: "",
	geminiModel: "gemini-2.0-flash"
};
async function ensurePreferences() {
	const db = getDb();
	const existing = await db.preferences.get("main");
	if (existing) return existing;
	await db.preferences.put(DEFAULT_PREFS);
	return DEFAULT_PREFS;
}
async function updatePreferences(patch) {
	const db = getDb();
	const next = {
		...await ensurePreferences(),
		...patch,
		id: "main"
	};
	await db.preferences.put(next);
	if (patch.theme) try {
		localStorage.setItem("mannanote-theme", patch.theme);
	} catch {}
	if (patch.onboardingComplete) try {
		localStorage.setItem("mannanote-onboarded", "1");
	} catch {}
	return next;
}
async function clearVault() {
	const db = getDb();
	await Promise.all([
		db.sources.clear(),
		db.chunks.clear(),
		db.comparisons.clear(),
		db.notes.clear(),
		db.overviews.clear()
	]);
}
var TARGET = 900;
var MIN_FLUSH = 220;
/** Split a source into citation-sized passages, preserving offsets. */
function chunkText(text, sourceId) {
	const normalized = text.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
	if (!normalized) return [];
	const paragraphs = normalized.split(/\n{2,}/);
	const chunks = [];
	let buf = "";
	let bufStart = 0;
	let cursor = 0;
	let index = 0;
	const flush = (end) => {
		const body = buf.trim();
		if (!body) return;
		chunks.push({
			id: `${sourceId}-${uid().slice(0, 8)}-${index}`,
			sourceId,
			index,
			text: body,
			startOffset: bufStart,
			endOffset: end
		});
		index += 1;
		buf = "";
	};
	for (const para of paragraphs) {
		const at = normalized.indexOf(para, cursor);
		const start = at >= 0 ? at : cursor;
		if (buf && buf.length + para.length + 2 > TARGET && buf.length >= MIN_FLUSH) {
			flush(start);
			bufStart = start;
		}
		if (!buf) bufStart = start;
		buf = buf ? `${buf}\n\n${para}` : para;
		cursor = start + para.length;
	}
	flush(normalized.length);
	if (chunks.length === 0) chunks.push({
		id: `${sourceId}-0`,
		sourceId,
		index: 0,
		text: normalized,
		startOffset: 0,
		endOffset: normalized.length
	});
	return chunks;
}
/** Cap context sent to the model: first + last + densest middle chunks. */
function selectChunksForModel(chunks, maxChunks = 12, maxChars = 1200) {
	const clipped = chunks.map((c) => ({
		index: c.index,
		text: c.text.length > maxChars ? `${c.text.slice(0, maxChars).trimEnd()}…` : c.text
	}));
	if (clipped.length <= maxChunks) return clipped;
	const head = clipped.slice(0, Math.ceil(maxChunks / 2));
	const tail = clipped.slice(-Math.floor(maxChunks / 2));
	const seen = new Set(head.map((c) => c.index));
	const merged = [...head];
	for (const c of tail) if (!seen.has(c.index)) {
		merged.push(c);
		seen.add(c.index);
	}
	return merged.sort((a, b) => a.index - b.index);
}
var SAMPLE_LIBRARY = [
	{
		title: "Gospel of John 1:1–18",
		confidenceLevel: "primary",
		lensTags: ["christian", "primary"],
		text: `In the beginning was the Word, and the Word was with God, and the Word was God. He was in the beginning with God. All things were made through him, and without him was not any thing made that was made. In him was life, and the life was the light of men. The light shines in the darkness, and the darkness has not overcome it.

There was a man sent from God, whose name was John. He came as a witness, to bear witness about the light, that all might believe through him. He was not the light, but came to bear witness about the light.

The true light, which gives light to everyone, was coming into the world. He was in the world, and the world was made through him, yet the world did not know him. He came to his own, and his own people did not receive him. But to all who did receive him, who believed in his name, he gave the right to become children of God, who were born, not of blood nor of the will of the flesh nor of the will of man, but of God.

And the Word became flesh and dwelt among us, and we have seen his glory, glory as of the only Son from the Father, full of grace and truth. (John bore witness about him, and cried out, “This was he of whom I said, ‘He who comes after me ranks before me, because he was before me.’”) For from his fullness we have all received, grace upon grace. For the law was given through Moses; grace and truth came through Jesus Christ. No one has ever seen God; the only God, who is at the Father’s side, he has made him known.`
	},
	{
		title: "Gospel of Thomas, selected logia",
		confidenceLevel: "primary",
		lensTags: [
			"gnostic",
			"christian",
			"primary"
		],
		text: `These are the secret sayings which the living Jesus spoke and which Didymos Judas Thomas wrote down.

(1) And he said, “Whoever finds the interpretation of these sayings will not experience death.”

(2) Jesus said, “Let him who seeks continue seeking until he finds. When he finds, he will become troubled. When he becomes troubled, he will be astonished, and he will rule over the All.”

(3) Jesus said, “If those who lead you say to you, ‘See, the kingdom is in the sky,’ then the birds of the sky will precede you. If they say to you, ‘It is in the sea,’ then the fish will precede you. Rather, the kingdom is inside of you, and it is outside of you. When you come to know yourselves, then you will become known, and you will realize that it is you who are the sons of the living Father. But if you will not know yourselves, you dwell in poverty and it is you who are that poverty.”

(13) Jesus said to his disciples, “Compare me to someone and tell me whom I am like.” Simon Peter said to him, “You are like a righteous angel.” Matthew said to him, “You are like a wise philosopher.” Thomas said to him, “Master, my mouth is wholly incapable of saying whom you are like.” Jesus said, “I am not your master. Because you have drunk, you have become intoxicated from the bubbling spring which I have measured out.”

(50) Jesus said, “If they say to you, ‘Where did you come from?’, say to them, ‘We came from the light, the place where the light came into being on its own accord and established itself and became manifest through their image.’ If they say to you, ‘Is it you?’, say, ‘We are its children, we are the elect of the living Father.’ If they ask you, ‘What is the sign of your father in you?’, say to them, ‘It is movement and repose.’”

(77) Jesus said, “It is I who am the light which is above them all. It is I who am the all. From me did the all come forth, and unto me did the all extend. Split a piece of wood, and I am there. Lift up the stone, and you will find me there.”

(113) His disciples said to him, “When will the kingdom come?” Jesus said, “It will not come by waiting for it. It will not be a matter of saying ‘here it is’ or ‘there it is.’ Rather, the kingdom of the Father is spread out upon the earth, and men do not see it.”`
	},
	{
		title: "Dhammapada 1 — The Twin Verses",
		confidenceLevel: "primary",
		lensTags: ["buddhist", "primary"],
		text: `Mind precedes all mental states. Mind is their chief; they are all mind-wrought. If with an impure mind a person speaks or acts, suffering follows him like the wheel that follows the foot of the ox.

Mind precedes all mental states. Mind is their chief; they are all mind-wrought. If with a pure mind a person speaks or acts, happiness follows him like his never-departing shadow.

“He abused me, he struck me, he overpowered me, he robbed me.” Those who harbor such thoughts do not still their hatred.

“He abused me, he struck me, he overpowered me, he robbed me.” Those who do not harbor such thoughts still their hatred.

Hatred is never appeased by hatred in this world. By non-hatred alone is hatred appeased. This is a law eternal.

There are those who do not realize that one day we all must die. But those who do realize this settle their quarrels.

Just as a storm throws down a weak tree, so does Mara overpower the man who lives for the pursuit of pleasures, who is uncontrolled in his senses, immoderate in eating, indolent, and dissipated.

Just as a storm cannot prevail against a rocky mountain, so Mara can never overpower the man who lives meditating on the impurities, who is controlled in his senses, moderate in eating, and filled with faith and earnest effort.

Whoever holds himself dear should cultivate wholesome states. The wise one should watch over himself during one of the three watches of the night.

The fool who knows his foolishness is wise at least to that extent; but the fool who thinks himself wise is a fool indeed.`
	},
	{
		title: "Plato, Republic VII — The Cave",
		confidenceLevel: "primary",
		lensTags: ["philosophical", "primary"],
		text: `Next, said I, compare the effect of education and of the lack of it upon our nature to a condition like the following: imagine human beings living in an underground cave-like dwelling, with a long entrance reaching up toward the light along the whole width of the cave. They have been there from childhood, with their necks and legs in bonds, so that they remain in the same place and see only in front of them, unable to turn their heads because of the bond. Light reaches them from a fire burning far above and behind them. Between the fire and the prisoners, there is a path along which a low wall has been built, like the screen in front of puppeteers above which they show their puppets.

See also, then, men along this wall carrying all kinds of artifacts, which project above the wall — statues of men and other animals, made of stone and wood and all kinds of materials. And as is likely, some of the carriers utter sounds while others are silent.

They are like us, I said. For in the first place, do you think such men would have seen anything of themselves or of one another except the shadows cast by the fire on the wall of the cave in front of them?

How could they, he said, if they were compelled to keep their heads motionless throughout life?

And what about the things carried along the wall? Would they not see only the shadows of those?

Yes, certainly.

If they could converse with one another, do you not think they would suppose that the names they used applied to the things they see passing before them?

They would have to.

And if their prison also had an echo from the wall opposite them, whenever one of the carriers uttered a sound, do you think they would believe that the passing shadow was the speaker?

By Zeus, I do.

Then in every way such prisoners would consider the truth to be nothing other than the shadows of the artifacts.

And if one of them were freed and suddenly compelled to stand up, turn his neck, and walk toward the light, he would suffer pain, and because of the dazzle he would be unable to see the things whose shadows he had seen before. And if someone dragged him by force up the rough, steep path and did not let him go until he had dragged him into the light of the sun, would he not be pained and irritated at being so dragged? And when he came into the light, would his eyes not be filled with its beam, so that he would not be able to see even one of the things now said to be the true ones?

He would need, I think, to become accustomed before he could see things in the world above. At first he would most easily see shadows, then the images of men and other things in water, then the things themselves. From there he would go on to the things in heaven and heaven itself, looking at the light of the stars and the moon more easily than at the sun and its light by day.

Last of all he would be able to see the sun — not its appearances in water or in some alien place, but the sun itself, in its own region, and be able to contemplate it as it is.

And after that he would already be able to conclude about it that this is what provides the seasons and the years, and is the steward of all things in the visible region, and is in a certain way the cause of all those things they used to see.

If he recalled his first dwelling, and the wisdom there, and his fellow prisoners, do you not think he would consider himself happy for the change and pity them?`
	}
];
async function addSource(opts) {
	const db = getDb();
	const now = Date.now();
	const record = {
		id: uid(),
		title: opts.title.trim() || "Untitled source",
		fullText: opts.text.trim(),
		confidenceLevel: opts.confidenceLevel,
		lensTags: opts.lensTags,
		metadata: {
			filename: opts.filename,
			mime: opts.mime,
			wordCount: wordCount(opts.text),
			origin: opts.origin ?? "upload"
		},
		createdAt: now,
		updatedAt: now
	};
	const chunks = chunkText(record.fullText, record.id);
	await db.transaction("rw", db.sources, db.chunks, async () => {
		await db.sources.put(record);
		await db.chunks.bulkPut(chunks);
	});
	return record;
}
async function updateSource(id, patch) {
	const db = getDb();
	const current = await db.sources.get(id);
	if (!current) return;
	const next = {
		...current,
		...patch,
		updatedAt: Date.now()
	};
	if (patch.fullText && patch.fullText !== current.fullText) {
		next.metadata = {
			...next.metadata,
			wordCount: wordCount(patch.fullText)
		};
		const chunks = chunkText(next.fullText, id);
		await db.transaction("rw", db.sources, db.chunks, async () => {
			await db.chunks.where("sourceId").equals(id).delete();
			await db.sources.put(next);
			await db.chunks.bulkPut(chunks);
		});
		return;
	}
	await db.sources.put(next);
}
async function deleteSource(id) {
	const db = getDb();
	await db.transaction("rw", db.sources, db.chunks, db.notes, async () => {
		await db.sources.delete(id);
		await db.chunks.where("sourceId").equals(id).delete();
		await db.notes.where("sourceId").equals(id).delete();
	});
}
async function loadSampleLibrary() {
	const existing = await getDb().sources.toArray();
	const titles = new Set(existing.map((s) => s.title));
	let added = 0;
	for (const sample of SAMPLE_LIBRARY) {
		if (titles.has(sample.title)) continue;
		await addSource({
			title: sample.title,
			text: sample.text,
			confidenceLevel: sample.confidenceLevel,
			lensTags: sample.lensTags,
			origin: "sample"
		});
		added += 1;
	}
	return added;
}
async function toPayloads(ids) {
	const db = getDb();
	const payloads = [];
	for (const id of ids) {
		const source = await db.sources.get(id);
		if (!source) continue;
		const chunks = await db.chunks.where("sourceId").equals(id).sortBy("index");
		payloads.push({
			id: source.id,
			title: source.title,
			confidenceLevel: source.confidenceLevel,
			lensTags: source.lensTags,
			chunks: selectChunksForModel(chunks)
		});
	}
	return payloads;
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-BMxYl8Bj.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: errorMessage(error)
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
function Input({ className, type, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		"data-slot": "input",
		className: cn("flex h-11 w-full min-w-0 rounded-md border border-input bg-paper px-3 text-base text-foreground shadow-none transition-[box-shadow,border-color] duration-150 outline-none placeholder:text-muted-foreground/80 focus-visible:border-ring focus-visible:ring-ring/40 focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 md:text-sm", className),
		...props
	});
}
function Textarea({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		"data-slot": "textarea",
		className: cn("flex min-h-28 w-full rounded-md border border-input bg-paper px-3 py-2 text-base text-foreground outline-none placeholder:text-muted-foreground/80 focus-visible:border-ring focus-visible:ring-ring/40 focus-visible:ring-[3px] disabled:opacity-50 md:text-sm", className),
		...props
	});
}
function Label({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: cn("text-xs font-medium tracking-wide text-muted-foreground", className),
		...props
	});
}
function Footer({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-8 flex justify-end max-md:fixed max-md:inset-x-0 max-md:bottom-0 max-md:z-10 max-md:bg-background/95 max-md:px-5 max-md:py-3 max-md:pb-[max(0.75rem,env(safe-area-inset-bottom))] max-md:backdrop-blur-sm",
		children
	});
}
function Onboarding() {
	const [step, setStep] = (0, import_react.useState)(1);
	const [family, setFamily] = (0, import_react.useState)(DEFAULT_LENS.family);
	const [branch, setBranch] = (0, import_react.useState)(DEFAULT_LENS.branch);
	const [customLabel, setCustomLabel] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const meta = LENS_FAMILIES.find((f) => f.family === family);
	async function finish(withSamples) {
		setBusy(true);
		try {
			await updatePreferences({
				activeLens: {
					family,
					branch: family === "custom" ? customLabel.trim() || "Custom" : branch,
					customLabel: family === "custom" ? customLabel.trim() : void 0
				},
				onboardingComplete: true
			});
			if (withSamples) {
				const n = await loadSampleLibrary();
				toast.success(n ? `Loaded ${n} primary texts into the vault.` : "Sample texts were already in the vault.");
			}
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not save preferences.");
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "min-h-dvh bg-background px-5 py-10 pb-[max(5rem,env(safe-area-inset-bottom))] md:px-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex min-h-[calc(100dvh-5rem)] max-w-2xl flex-col",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase",
					children: "MannaNote"
				}),
				step === 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-8 flex flex-1 flex-col",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-serif text-4xl leading-[1.1] tracking-tight text-foreground md:text-5xl",
							children: "Where do you stand when you read?"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 max-w-lg text-base leading-relaxed text-muted-foreground",
							children: "Choose a primary interpretive lens. Every comparison, map, and spoken overview will keep this standing point visible — and will refuse to blend rival claims into a single essence."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-8 grid grid-cols-1 gap-2 sm:grid-cols-2",
							children: LENS_FAMILIES.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => {
									setFamily(f.family);
									setBranch(f.branches[0] ?? f.label);
								},
								className: cn("rounded-xl bg-card p-4 text-left shadow-[var(--shadow-border)] transition-[box-shadow,transform] duration-150 hover:shadow-[var(--shadow-border-hover)]", family === f.family && "ring-2 ring-ring/70"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-serif text-lg text-foreground",
									children: f.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm leading-snug text-muted-foreground",
									children: f.blurb
								})]
							}, f.family))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: () => setStep(2),
							className: "pr-3.5",
							children: ["Continue", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
						}) })
					]
				}),
				step === 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-8 flex flex-1 flex-col",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setStep(1),
							className: "mb-6 inline-flex h-11 items-center gap-2 self-start text-sm text-muted-foreground hover:text-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), "Lenses"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-serif text-4xl leading-[1.1] tracking-tight",
							children: "Refine the branch"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 max-w-lg text-base leading-relaxed text-muted-foreground",
							children: [meta.blurb, " You can change this later from Settings without losing the vault."]
						}),
						family === "custom" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 max-w-md space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium tracking-wide text-muted-foreground",
								children: "Name your lens"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: customLabel,
								onChange: (e) => setCustomLabel(e.target.value),
								placeholder: "e.g. Process theology, Spinozist, Islamic kalam"
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-8 flex flex-col gap-2",
							children: meta.branches.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setBranch(b),
								className: cn("rounded-xl bg-card px-4 py-3.5 text-left font-medium shadow-[var(--shadow-border)] transition-shadow duration-150", branch === b && "ring-2 ring-ring/70"),
								children: b
							}, b))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: () => setStep(3),
							disabled: family === "custom" && !customLabel.trim(),
							className: "pr-3.5",
							children: ["Continue", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
						}) })
					]
				}),
				step === 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-8 flex flex-1 flex-col",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setStep(2),
							className: "mb-6 inline-flex h-11 items-center gap-2 self-start text-sm text-muted-foreground hover:text-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), "Branch"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-serif text-4xl leading-[1.1] tracking-tight",
							children: "Begin with a small library"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 max-w-lg text-base leading-relaxed text-muted-foreground",
							children: "Four public-domain primaries — John, Thomas, the Dhammapada, and Plato’s cave — so you can run a differentiator pass immediately. Or start with an empty vault and upload your own."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-10 flex flex-col gap-3 sm:flex-row",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "lg",
								disabled: busy,
								onClick: () => finish(true),
								className: "pr-3.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookMarked, { className: "size-4" }), "Load sample texts"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "lg",
								variant: "outline",
								disabled: busy,
								onClick: () => finish(false),
								children: "Start empty"
							})]
						})
					]
				})
			]
		})
	});
}
function ConfidenceDot({ level, className }) {
	const meta = confidenceMeta(level);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-block size-2 shrink-0 rounded-full", meta.swatch, className),
		"aria-hidden": true
	});
}
function ConfidenceBadge({ level, compact = false }) {
	const meta = confidenceMeta(level);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "inline-flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfidenceDot, { level }), compact ? meta.label.split(" ")[0] : meta.label]
	});
}
var useMannaUI = create((set) => ({
	sourceA: null,
	sourceB: null,
	extraSourceIds: [],
	studyMode: "differentiator",
	viewingSourceId: null,
	highlightChunk: null,
	vaultQuery: "",
	vaultConfidence: "all",
	focusQuestion: "",
	setSourceA: (id) => set({ sourceA: id }),
	setSourceB: (id) => set({ sourceB: id }),
	toggleExtra: (id) => set((s) => ({ extraSourceIds: s.extraSourceIds.includes(id) ? s.extraSourceIds.filter((x) => x !== id) : [...s.extraSourceIds, id] })),
	setStudyMode: (mode) => set({ studyMode: mode }),
	openSource: (id, chunk = null) => set({
		viewingSourceId: id,
		highlightChunk: chunk
	}),
	closeSource: () => set({
		viewingSourceId: null,
		highlightChunk: null
	}),
	setVaultQuery: (q) => set({ vaultQuery: q }),
	setVaultConfidence: (c) => set({ vaultConfidence: c }),
	setFocusQuestion: (q) => set({ focusQuestion: q })
}));
function SourceViewer() {
	const viewingSourceId = useMannaUI((s) => s.viewingSourceId);
	const highlightChunk = useMannaUI((s) => s.highlightChunk);
	const closeSource = useMannaUI((s) => s.closeSource);
	const source = useLiveQuery(() => viewingSourceId ? getDb().sources.get(viewingSourceId) : void 0, [viewingSourceId]);
	const chunks = useLiveQuery(() => viewingSourceId ? getDb().chunks.where("sourceId").equals(viewingSourceId).sortBy("index") : [], [viewingSourceId]);
	const notes = useLiveQuery(() => viewingSourceId ? getDb().notes.where("sourceId").equals(viewingSourceId).reverse().sortBy("createdAt") : [], [viewingSourceId]);
	const [noteOpen, setNoteOpen] = (0, import_react.useState)(false);
	const [noteText, setNoteText] = (0, import_react.useState)("");
	const [quote, setQuote] = (0, import_react.useState)("");
	const highlightRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (highlightRef.current) highlightRef.current.scrollIntoView({
			block: "center",
			behavior: "smooth"
		});
	}, [
		highlightChunk,
		chunks?.length,
		viewingSourceId
	]);
	const body = (0, import_react.useMemo)(() => {
		if (!source) return null;
		if (chunks && chunks.length > 0) return chunks.map((chunk) => {
			const active = highlightChunk === chunk.index;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				ref: active ? (el) => {
					highlightRef.current = el;
				} : void 0,
				className: cn("source-prose mb-4 rounded-md px-1 py-0.5 transition-colors duration-200", active && "bg-lens/15"),
				children: chunk.text
			}, chunk.id);
		});
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "source-prose whitespace-pre-wrap",
			children: source.fullText
		});
	}, [
		source,
		chunks,
		highlightChunk
	]);
	if (!viewingSourceId) return null;
	async function saveNote() {
		if (!source || !noteText.trim()) return;
		await getDb().notes.add({
			id: uid(),
			sourceId: source.id,
			quote: quote.trim(),
			chunkIndex: highlightChunk ?? void 0,
			text: noteText.trim(),
			createdAt: Date.now()
		});
		setNoteText("");
		setQuote("");
		setNoteOpen(false);
		toast.success("Note saved.");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex flex-col bg-background/80",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-h-0 flex-1 flex-col bg-background md:mx-auto md:my-6 md:w-full md:max-w-3xl md:rounded-xl md:shadow-[var(--shadow-border)]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "flex items-start justify-between gap-3 border-b border-border px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-serif text-xl leading-snug text-foreground",
							children: source?.title ?? "Source"
						}), source && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1 flex flex-wrap items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfidenceBadge, { level: source.confidenceLevel }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[11px] text-muted-foreground",
								children: [source.metadata.wordCount, " words"]
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex shrink-0 items-center gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon-sm",
							onClick: () => setNoteOpen((v) => !v),
							"aria-label": "Add note",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StickyNote, { className: "size-4" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon-sm",
							onClick: closeSource,
							"aria-label": "Close",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
						})]
					})]
				}),
				noteOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2 border-b border-border bg-card px-4 py-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: quote,
							onChange: (e) => setQuote(e.target.value),
							placeholder: "Quoted line (optional)",
							className: "min-h-16"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: noteText,
							onChange: (e) => setNoteText(e.target.value),
							placeholder: "Your annotation",
							className: "min-h-20"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex justify-end",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								onClick: saveNote,
								disabled: !noteText.trim(),
								children: "Save note"
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-h-0 flex-1 overflow-y-auto bg-paper px-5 py-5",
					children: [body, notes && notes.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
						className: "mt-8 border-t border-border pt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium tracking-wide text-muted-foreground",
							children: "Notes"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-3 space-y-3",
							children: notes.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "rounded-lg bg-card p-3 shadow-[var(--shadow-border)]",
								children: [n.quote && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "font-serif text-sm italic text-muted-foreground",
									children: [
										"“",
										n.quote,
										"”"
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm leading-relaxed",
									children: n.text
								})]
							}, n.id))
						})]
					})]
				})
			]
		})
	});
}
function MannaProvider({ children }) {
	const [onboarded, setOnboarded] = (0, import_react.useState)(false);
	const prefs = useLiveQuery(() => {
		if (typeof indexedDB === "undefined") return void 0;
		return getDb().preferences.get("main");
	}, []);
	(0, import_react.useEffect)(() => {
		try {
			if (localStorage.getItem("mannanote-onboarded") === "1") setOnboarded(true);
		} catch {}
		ensurePreferences();
	}, []);
	(0, import_react.useEffect)(() => {
		if (!prefs) return;
		const root = document.documentElement;
		root.classList.toggle("dark", prefs.theme !== "light");
		root.classList.toggle("light", prefs.theme === "light");
		try {
			localStorage.setItem("mannanote-theme", prefs.theme);
		} catch {}
		setOnboarded(prefs.onboardingComplete);
	}, [prefs]);
	const theme = prefs?.theme === "light" ? "light" : "dark";
	if (!onboarded) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Onboarding, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, { theme })] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		children,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceViewer, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, { theme })
	] });
}
var styles_default = "/assets/styles-DwskTHyc.css";
var APP_NAME = "MannaNote";
var THEME_BOOT = `(function(){try{var t=localStorage.getItem("mannanote-theme");document.documentElement.classList.toggle("dark",t!=="light");}catch(e){document.documentElement.classList.add("dark");}})();`;
var Route$4 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "description",
				content: "Comparative research and knowledge OS with interpretive lenses, citations, and differentiator analysis."
			},
			{
				name: "theme-color",
				content: "#121314"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,400..700;1,400..700&family=Newsreader:ital,opsz,wght@0,6..72,400..700;1,6..72,400..700&display=swap"
			}
		]
	}),
	component: RootDocument
});
function RootDocument() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		className: "dark antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			className: "min-h-dvh bg-background text-foreground",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", { dangerouslySetInnerHTML: { __html: THEME_BOOT } }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MannaProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
			]
		})]
	});
}
var $$splitComponentImporter$3 = () => import("./routes-B_oGRXIF.mjs");
var Route$3 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./overviews-DX32v0t7.mjs");
var Route$2 = createFileRoute("/overviews")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./research-BEZ7mgsk.mjs");
var Route$1 = createFileRoute("/research")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./settings-BcgCcZr5.mjs");
var Route = createFileRoute("/settings")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var rootRouteChildren = {
	IndexRoute: Route$3.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$4
	}),
	OverviewsRoute: Route$2.update({
		id: "/overviews",
		path: "/overviews",
		getParentRoute: () => Route$4
	}),
	ResearchRoute: Route$1.update({
		id: "/research",
		path: "/research",
		getParentRoute: () => Route$4
	}),
	SettingsRoute: Route.update({
		id: "/settings",
		path: "/settings",
		getParentRoute: () => Route$4
	})
};
var routeTree = Route$4._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { truncate as _, Input as a, updateSource as b, Button as c, cn as d, deleteSource as f, toPayloads as g, loadSampleLibrary as h, ConfidenceDot as i, addSource as l, getDb as m, useMannaUI as n, Label as o, formatDate as p, ConfidenceBadge as r, Textarea as s, router_exports as t, clearVault as u, uid as v, updatePreferences as y };

//#region node_modules/.nitro/vite/services/ssr/assets/lenses-BzzZXy4v.js
var LENS_FAMILIES = [
	{
		family: "christian",
		label: "Christian",
		blurb: "Canonical and ecclesial readings of scripture and tradition.",
		branches: [
			"Protestant",
			"Catholic",
			"Orthodox",
			"Gnostic-influenced",
			"Mystical / Contemplative"
		]
	},
	{
		family: "gnostic",
		label: "Gnostic",
		blurb: "Knowledge, emanation, and liberation from the material order.",
		branches: [
			"Valentinian",
			"Sethian",
			"Thomasine",
			"Hermetic"
		]
	},
	{
		family: "vedic",
		label: "Vedic",
		blurb: "Dharma, brahman, and the inner path of the Indic corpus.",
		branches: [
			"Advaita Vedanta",
			"Dvaita",
			"Yoga",
			"Bhakti"
		]
	},
	{
		family: "hebrew",
		label: "Hebrew",
		blurb: "Tanakh, rabbinic argument, and Jewish mystical reading.",
		branches: [
			"Rabbinic",
			"Kabbalistic",
			"Second Temple",
			"Karaite"
		]
	},
	{
		family: "buddhist",
		label: "Buddhist",
		blurb: "Dukkha, anatta, and the cessation of clinging.",
		branches: [
			"Theravada",
			"Mahayana",
			"Vajrayana",
			"Zen"
		]
	},
	{
		family: "philosophical",
		label: "Philosophical",
		blurb: "Reasoned inquiry without a required confessional frame.",
		branches: [
			"Platonic",
			"Aristotelian",
			"Stoic",
			"Existential",
			"Phenomenological"
		]
	},
	{
		family: "secular",
		label: "Secular Academic",
		blurb: "Historical-critical, literary, and anthropological methods.",
		branches: [
			"Historical-critical",
			"Literary",
			"Anthropological",
			"Comparative religion"
		]
	},
	{
		family: "custom",
		label: "Custom",
		blurb: "Name your own standing point and keep it explicit.",
		branches: ["Custom"]
	}
];
var STUDY_MODES = [
	{
		id: "isolation",
		label: "Isolation",
		short: "Stay inside the lens",
		detail: "Read every source strictly through the active interpretive lens. No imported frameworks, no cross-contamination."
	},
	{
		id: "comparative",
		label: "Comparative",
		short: "Side by side",
		detail: "Hold each tradition in its own terms. Map correspondences without collapsing them."
	},
	{
		id: "differentiator",
		label: "Differentiator",
		short: "Surface the clash",
		detail: "Name exact points of departure, underlying axioms, and historical reasons for the split. Never merge unless asked."
	},
	{
		id: "inversion",
		label: "Inversion",
		short: "Read against the grain",
		detail: "Flip the active lens. Steelman the opposing view and stress-test your standing point."
	}
];
var CONFIDENCE_LADDER = [
	{
		id: "primary",
		label: "Primary Text",
		hint: "The source itself — scripture, treatise, original document.",
		swatch: "bg-conf-primary"
	},
	{
		id: "scholarly",
		label: "Scholarly Source",
		hint: "Peer-reviewed, academic, or carefully edited commentary.",
		swatch: "bg-conf-scholarly"
	},
	{
		id: "reference",
		label: "Reference / Commentary",
		hint: "Study notes, encyclopedias, traditional commentaries.",
		swatch: "bg-conf-reference"
	},
	{
		id: "web",
		label: "General Web / Secondary",
		hint: "Blogs, summaries, unvetted pages — treat as leads, not proof.",
		swatch: "bg-conf-web"
	}
];
function lensLabel(lens) {
	const familyName = LENS_FAMILIES.find((f) => f.family === lens.family)?.label ?? lens.family;
	if (lens.family === "custom") return lens.customLabel?.trim() || lens.branch || "Custom";
	if (lens.branch && lens.branch !== familyName) return `${familyName} · ${lens.branch}`;
	return familyName;
}
function confidenceMeta(level) {
	return CONFIDENCE_LADDER.find((c) => c.id === level) ?? CONFIDENCE_LADDER[3];
}
function suggestConfidence(title, text) {
	const hay = `${title}\n${text.slice(0, 1200)}`.toLowerCase();
	if (/\b(gospel|upanishad|dhammapada|torah|genesis|quran|sutra|republic|nicomachean|treatise|epistle)\b/.test(hay)) return "primary";
	if (/\b(journal|university|cambridge|oxford|brill|commentary critical)\b/.test(hay)) return "scholarly";
	if (/\b(study bible|notes|encyclopedia|wiki|commentary)\b/.test(hay)) return "reference";
	return "web";
}
var DEFAULT_LENS = {
	family: "philosophical",
	branch: "Platonic"
};
//#endregion
export { confidenceMeta as a, STUDY_MODES as i, DEFAULT_LENS as n, lensLabel as o, LENS_FAMILIES as r, suggestConfidence as s, CONFIDENCE_LADDER as t };

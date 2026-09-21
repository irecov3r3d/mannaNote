//#region node_modules/.nitro/vite/services/ssr/assets/ai-opts-y9OC_FR2.js
function aiOptsFromPrefs(prefs) {
	return {
		provider: prefs?.aiProvider ?? "xai",
		geminiApiKey: prefs?.geminiApiKey || void 0,
		geminiModel: prefs?.geminiModel || void 0
	};
}
//#endregion
export { aiOptsFromPrefs as t };

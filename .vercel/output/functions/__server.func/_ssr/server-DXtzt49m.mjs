import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/server-DXtzt49m.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var fetchAiStatus = createServerFn({ method: "POST" }).handler(createSsrRpc("5dd7c70f55cd7061f1b86e0829f7b92f918f5467bff2f8376fbcfc1db413c188"));
var fetchDifferentiatorAnalysis = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("e0f0b5da3664ee23fbd1707844445e52ff63a2b78c0a562ac86d9cb0269e6202"));
var fetchClaimVerification = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("a03d3d9c417910348249aaf952ee15eed8330ea14f1bbe0808509483bcfd39ce"));
var fetchMindMapData = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("e1e280427dd50b527756d8d469bbf555572726e32b7a6bccf667533a38820f9b"));
var fetchAudioOverviewScript = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("2c758841df9e5d56f1a3c55fdd5a78a2f60a65e2783362b790907b39c66aa49d"));
var fetchStudioSpeech = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("71c8387d2ea500298ff894e872136b840a15551ceb8adc581b970cb5035b1259"));
//#endregion
export { fetchMindMapData as a, fetchDifferentiatorAnalysis as i, fetchAudioOverviewScript as n, fetchStudioSpeech as o, fetchClaimVerification as r, fetchAiStatus as t };

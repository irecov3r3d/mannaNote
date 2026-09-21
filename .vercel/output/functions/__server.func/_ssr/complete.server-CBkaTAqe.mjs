//#region node_modules/.nitro/vite/services/ssr/assets/complete.server-CBkaTAqe.js
async function completeXai(system, user, maxTokens) {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return {
		ok: false,
		error: "Grok is not available in this environment."
	};
	const res = await fetch("https://api.x.ai/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: "grok-4.5",
			temperature: .35,
			max_tokens: maxTokens,
			messages: [{
				role: "system",
				content: system
			}, {
				role: "user",
				content: user
			}]
		})
	});
	if (!res.ok) {
		const errText = await res.text().catch(() => "");
		return {
			ok: false,
			error: `Grok request failed (${res.status})${errText ? `: ${errText.slice(0, 180)}` : ""}`
		};
	}
	const text = (await res.json()).choices?.[0]?.message?.content ?? "";
	if (!text) return {
		ok: false,
		error: "Grok returned an empty response."
	};
	return {
		ok: true,
		text,
		provider: "xai"
	};
}
async function completeGemini(system, user, maxTokens, apiKey, model) {
	const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
	const res = await fetch(url, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			systemInstruction: { parts: [{ text: system }] },
			contents: [{
				role: "user",
				parts: [{ text: user }]
			}],
			generationConfig: {
				temperature: .35,
				maxOutputTokens: maxTokens,
				responseMimeType: "application/json"
			}
		})
	});
	if (!res.ok) {
		const errText = await res.text().catch(() => "");
		return {
			ok: false,
			error: `Gemini request failed (${res.status})${errText ? `: ${errText.slice(0, 180)}` : ""}`
		};
	}
	const text = (await res.json()).candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ?? "";
	if (!text) return {
		ok: false,
		error: "Gemini returned an empty response."
	};
	return {
		ok: true,
		text,
		provider: "gemini"
	};
}
async function completeJson(input) {
	const maxTokens = input.maxTokens ?? 3500;
	if (input.provider === "gemini") {
		const key = input.geminiApiKey?.trim();
		if (!key) return {
			ok: false,
			error: "Add a Google AI Studio key in Settings to use Gemini."
		};
		return completeGemini(input.system, input.user, maxTokens, key, input.geminiModel?.trim() || "gemini-2.0-flash");
	}
	return completeXai(input.system, input.user, maxTokens);
}
//#endregion
export { completeJson };

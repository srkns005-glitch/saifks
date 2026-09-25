const ALLOWED_ORIGINS = new Set(["https://saifks.com", "https://www.saifks.com", "https://srkns005-glitch.github.io"]);
const LANGUAGES = new Set(["ar", "fr", "de", "es", "tr", "ko", "ja", "zh"]);

exports.handler = async function (event) {
  const origin = event.headers?.origin || event.headers?.Origin || "";
  const allowed = ALLOWED_ORIGINS.has(origin);
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Vary": "Origin",
    ...(allowed ? { "Access-Control-Allow-Origin": origin } : {})
  };
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: allowed ? 204 : 403, headers: { ...headers, "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type" }, body: "" };
  }
  if (!allowed || event.httpMethod !== "POST") return { statusCode: 403, headers, body: '{"error":"Forbidden"}' };
  try {
    const { texts, targetLang } = JSON.parse(event.body || "{}");
    if (!LANGUAGES.has(targetLang) || !Array.isArray(texts) || !texts.length || texts.length > 4 ||
        texts.some(text => typeof text !== "string" || text.length > 700)) {
      return { statusCode: 400, headers, body: '{"error":"Invalid request"}' };
    }
    const translated = await Promise.all(texts.map(async text => {
      if (!text.trim()) return text;
      const url = new URL("https://translate.googleapis.com/translate_a/single");
      url.search = new URLSearchParams({ client: "gtx", sl: "en", tl: targetLang, dt: "t", q: text }).toString();
      const response = await fetch(url, { signal: AbortSignal.timeout(7000) });
      if (!response.ok) throw new Error("Upstream " + response.status);
      const data = await response.json();
      return (data?.[0] || []).map(part => part?.[0] || "").join("") || text;
    }));
    return { statusCode: 200, headers, body: JSON.stringify({ translated }) };
  } catch (error) {
    console.error("Hero translation failed", error);
    return { statusCode: 502, headers, body: '{"error":"Translation unavailable"}' };
  }
};

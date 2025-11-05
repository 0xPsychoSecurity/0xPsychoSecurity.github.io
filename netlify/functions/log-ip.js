export async function handler(event) {
  // Basic request info
  const headers = Object.fromEntries(Object.entries(event.headers || {}).map(([k, v]) => [k.toLowerCase(), v]));
  const dnt = headers["x-dnt"] || headers["dnt"] || "0";
  const ua = headers["user-agent"] || "";
  const referer = headers["referer"] || "";
  const rawXff = headers["x-forwarded-for"] || "";
  const xffList = rawXff.split(",").map(s => s.trim()).filter(Boolean);
  const candidates = [
    headers["x-nf-client-connection-ip"],
    headers["x-real-ip"],
    ...xffList
  ].filter(Boolean);

  const ipv4Regex = /(?<![\d.])((?:\d{1,3}\.){3}\d{1,3})(?![\d.])/;
  let ipv4 = "";
  let ipv6 = "";
  for (const c of candidates) {
    // Extract embedded IPv4 if present (e.g., ::ffff:1.2.3.4)
    const v4m = c.match(ipv4Regex);
    if (!ipv4 && v4m) ipv4 = v4m[1];
    // Heuristic for IPv6: contains ':' and not purely IPv4
    if (!ipv6 && c.includes(":") && !c.match(/^\s*(?:\d{1,3}\.){3}\d{1,3}\s*$/)) {
      ipv6 = c;
    }
    if (ipv4 && ipv6) break;
  }
  const ip = ipv4 || ipv6 || "";
  const url = headers["x-forwarded-host"] ? `${headers["x-forwarded-proto"] || "https"}://${headers["x-forwarded-host"]}${event.rawUrl?.split(headers["x-forwarded-host"])[1] || ""}` : event.rawUrl || "";

  // 1) Skip known bots/crawlers
  const uaLower = ua.toLowerCase();
  const botPatterns = [
    "bot", "crawler", "spider", "crawl", "fetch", "wget", "curl", "python-requests",
    "headless", "puppeteer", "playwright", "lighthouse", "monitor", "uptime",
    "googlebot", "bingbot", "duckduckbot", "baiduspider", "yandexbot", "twitterbot",
    "slackbot", "discordbot", "facebookexternalhit", "whatsapp"
  ];
  if (botPatterns.some(p => uaLower.includes(p))) {
    return { statusCode: 204, body: "" };
  }

  // 2) Geo: prefer Netlify geo header; fallback to ipapi.co
  let country = ""; let countryCode = ""; let city = "";
  try {
    const geoRaw = headers["x-nf-geo"];
    if (geoRaw) {
      const g = JSON.parse(geoRaw);
      country = g.country || "";
      countryCode = (g.country_code || g.countryCode || "").toUpperCase();
      city = g.city || "";
    }
  } catch (_) {}

  if (!countryCode && ip) {
    try {
      const r = await fetch(`https://ipapi.co/${encodeURIComponent(ip)}/json/`, { headers: { "User-Agent": "netlify-func" } });
      if (r.ok) {
        const j = await r.json();
        country = j.country_name || country;
        countryCode = (j.country || countryCode || "").toUpperCase();
        city = j.city || city;
      }
    } catch (_) {}
  }

  // 3) Flag emoji from country code
  const flagEmoji = countryCode ? countryCode
    .replace(/[^A-Z]/g, "")
    .split("")
    .map(c => String.fromCodePoint(0x1F1E6 - 65 + c.charCodeAt(0)))
    .join("") : "🏳️";

  // 4) Build Discord embed
  const now = new Date().toISOString();
  const color = 0x00CED1; // teal
  const description = `${flagEmoji} New visitor ${country ? `from ${country}` : ""}`.trim();
  const embed = {
    title: "Visitor Log",
    description,
    color,
    fields: [
      { name: "IPv4", value: ipv4 || "-", inline: true },
      { name: "IPv6", value: ipv6 || "-", inline: true },
      { name: "Country", value: country || countryCode || "-", inline: true },
      { name: "City", value: city || "-", inline: true },
      { name: "DNT", value: dnt, inline: true },
      { name: "User-Agent", value: ua ? (ua.length > 256 ? ua.slice(0, 253) + "..." : ua) : "-", inline: false },
      { name: "Referrer", value: referer || "-", inline: false },
      { name: "URL", value: url || "-", inline: false },
      { name: "Time", value: now, inline: false }
    ]
  };

  const payload = { embeds: [embed] };

  // 5) Webhook from env
  const b64 = process.env.DISCORD_WEBHOOK_B64 || "";
  const direct = process.env.DISCORD_WEBHOOK_URL || "";
  const webhook = b64 ? Buffer.from(b64, "base64").toString("utf8") : direct;
  if (!webhook || !/^https:\/\/(?:discord(?:app)?\.com)\/api\/webhooks\//.test(webhook)) {
    return { statusCode: 500, body: "Webhook not configured" };
  }

  // 6) Send
  try {
    const resp = await fetch(webhook, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!resp.ok) {
      return { statusCode: 502, body: "Failed to deliver" };
    }
    return { statusCode: 204, body: "" };
  } catch (_) {
    return { statusCode: 500, body: "Error" };
  }
}

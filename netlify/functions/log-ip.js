export async function handler(event) {
  const dnt = event.headers["x-dnt"] || event.headers["dnt"] || "0";
  const ua = event.headers["user-agent"] || "";
  const referer = event.headers["referer"] || "";
  const ip = event.headers["x-nf-client-connection-ip"] || event.headers["x-real-ip"] || (event.headers["x-forwarded-for"] || "").split(",")[0] || "";
  const url = event.headers["x-forwarded-host"] ? `${event.headers["x-forwarded-proto"] || "https"}://${event.headers["x-forwarded-host"]}${event.rawUrl?.split(event.headers["x-forwarded-host"])[1] || ""}` : event.rawUrl || "";

  const now = new Date().toISOString();
  const payload = {
    content: `IP: ${ip}\nDNT: ${dnt}\nUA: ${ua}\nRef: ${referer}\nURL: ${url}\nTime: ${now}`.slice(0, 1900)
  };

  const b64 = process.env.DISCORD_WEBHOOK_B64 || "";
  const direct = process.env.DISCORD_WEBHOOK_URL || "";
  const webhook = b64 ? Buffer.from(b64, "base64").toString("utf8") : direct;

  if (!webhook || !/^https:\/\/(?:discord(?:app)?\.com)\/api\/webhooks\//.test(webhook)) {
    return { statusCode: 500, body: "Webhook not configured" };
  }

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
  } catch (e) {
    return { statusCode: 500, body: "Error" };
  }
}

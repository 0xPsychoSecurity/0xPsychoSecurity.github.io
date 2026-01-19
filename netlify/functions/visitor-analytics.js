export async function handler(event) {
  console.log('Function started');
  console.log('Event:', JSON.stringify(event, null, 2));
  
  try {
    // Get Discord webhook URL from Netlify environment variable
    const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;
    console.log('Discord webhook URL:', DISCORD_WEBHOOK_URL ? 'Set' : 'Not set');
    
    if (!DISCORD_WEBHOOK_URL) {
      console.error('Discord webhook URL not configured');
      return { statusCode: 500, body: 'Discord webhook URL not configured' };
    }

    // Get client IP address
    const clientIP = event.headers['x-forwarded-for'] || 
                     event.headers['x-real-ip'] || 
                     event.headers['x-client-ip'] || 
                     event.headers['cf-connecting-ip'] || 
                     event.headers['x-forwarded'] ||
                     event.headers['forwarded'] ||
                     event.headers['x-cluster-client-ip'] ||
                     'Unknown';
    console.log('Client IP:', clientIP);

    // Parse request body for additional data
    let requestData = {};
    try {
      if (event.body) {
        requestData = JSON.parse(event.body);
        console.log('Request body parsed successfully');
      }
    } catch (error) {
      console.error('Error parsing request body:', error);
    }

    // Get additional request information
    const userAgent = event.headers['user-agent'] || 'Unknown';
    const referer = event.headers['referer'] || 'Direct';
    const timestamp = new Date().toISOString();
    console.log('User Agent:', userAgent);
    console.log('Referer:', referer);

    // Get IP geolocation data
    let geoData = {
      country: 'Unknown',
      country_code: 'Unknown',
      city: 'Unknown',
      region: 'Unknown',
      org: 'Unknown',
      timezone: 'Unknown',
      isVpn: false
    };

    // Only fetch geolocation if enabled in request
    if (requestData.includeLocation) {
      try {
        console.log('Fetching geolocation for IP:', clientIP);
        // Try to get geolocation from IPAPI
        const geoResponse = await fetch(`https://ipapi.co/${clientIP}/json/`);
        console.log('Geo API response status:', geoResponse.status);
        
        if (geoResponse.ok) {
          const geo = await geoResponse.json();
          console.log('Geo data:', geo);
          
          // VPN detection (basic heuristic - common VPN ASNs and datacenters)
          const vpnASNs = ['AS13335', 'AS8075', 'AS14061', 'AS16509', 'AS20940', 'AS9009', 'AS174', 'AS32590', 'AS54113'];
          const vpnOrgs = ['cloudflare', 'digital ocean', 'amazon', 'google', 'microsoft', 'oracle', 'vultr', 'linode', 'hetzner'];
          const isVpn = vpnASNs.includes(geo.asn) || vpnOrgs.some(vpnOrg => geo.org?.toLowerCase().includes(vpnOrg));
          
          geoData = {
            country: geo.country_name || 'Unknown',
            country_code: geo.country || 'Unknown',
            city: geo.city || 'Unknown',
            region: geo.region || 'Unknown',
            org: geo.org || geo.asn_org || 'Unknown',
            timezone: geo.timezone || 'Unknown',
            isVpn: isVpn
          };
        } else {
          console.log('Geo API failed with status:', geoResponse.status);
        }
      } catch (error) {
        console.error('Error fetching geolocation:', error);
      }
    } else {
      console.log('Geolocation not enabled, skipping');
    }

    console.log('Final geo data:', geoData);

    // Generate country flag emoji
    const getFlagEmoji = (countryCode) => {
      if (!countryCode || countryCode.length !== 2) return '🌍';
      const codePoints = [...countryCode.toUpperCase()].map(char => 
        0x1F1E6 + (char.charCodeAt(0) - 65)
      );
      return String.fromCodePoint(...codePoints);
    };

    const flagEmoji = getFlagEmoji(geoData.country_code);

    // Create Discord embed
    const embed = {
      title: '🔍 New Visitor Detected',
      description: `${flagEmoji} New visitor from ${geoData.country}`,
      color: 0x00CED1, // Discord blue color
      fields: []
    };

    // Add basic fields
    embed.fields.push({
      name: '🌐 IP Address',
      value: `[${clientIP}](https://check-host.net/ip-info?host=${encodeURIComponent(clientIP)})`,
      inline: true
    });

    // Add geolocation fields only if enabled
    if (requestData.includeLocation) {
      embed.fields.push(
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
          name: '🛡️ VPN/Proxy',
          value: geoData.isVpn ? '🟡 Likely VPN/Proxy' : '🟢 Not detected',
          inline: true
        }
      );
    }

    // Add other fields
    embed.fields.push(
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
    );

    embed.footer = {
      text: 'Visitor Analytics • 0xPsychoSecurity',
      icon_url: 'https://gifdb.com/images/high/blue-eyes-blinking-c6dsaui90crc5ydf.gif' // Custom icon URL
    };
    embed.timestamp = timestamp;

    // Add thumbnail only if enabled
    if (requestData.includeImage && requestData.photo) {
      try {
        // Validate base64 image
        if (typeof requestData.photo === 'string' && requestData.photo.startsWith('data:image/')) {
          embed.thumbnail = {
            url: requestData.photo
          };
          console.log('Image thumbnail added');
        }
      } catch (error) {
        console.error('Error processing image:', error);
      }
    } else {
      console.log('Image capture not enabled, skipping');
    }

    // Create Discord webhook payload
    const webhookPayload = {
      embeds: [embed]
    };

    console.log('About to send webhook');
    console.log('Webhook URL:', DISCORD_WEBHOOK_URL);
    console.log('Webhook payload:', JSON.stringify(webhookPayload, null, 2));

    // Send to Discord webhook
    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(webhookPayload)
    });

    console.log('Webhook sent');
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Discord webhook error response:', errorText);
      return { 
        statusCode: response.status, 
        body: `Discord webhook error: ${response.statusText} - ${errorText}` 
      };
    }

    console.log('Webhook successful');
    return { statusCode: 204, body: 'Success' };
  } catch (error) {
    console.error('Function error:', error);
    console.error('Error stack:', error.stack);
    return { statusCode: 500, body: `Internal server error: ${error.message}` };
  }
}

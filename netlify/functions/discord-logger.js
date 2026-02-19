exports.handler = async function(event, context) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  
  if (!webhookUrl) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Discord webhook URL not configured' })
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const payload = JSON.parse(event.body || '{}');
    
    const { type, data, visitorInfo } = payload;
    
    let embed = {
      title: '🔔 New Site Visit',
      color: 0x7289da,
      timestamp: new Date().toISOString(),
      footer: {
        text: 'Syn\'s Site Analytics'
      }
    };

    switch(type) {
      case 'page_view':
        embed.title = '📊 Page View';
        embed.fields = [
          { name: 'Page', value: data.page || 'unknown', inline: true },
          { name: 'Referrer', value: data.referrer || 'direct', inline: true }
        ];
        break;
        
      case 'visitor_info':
        embed.title = '👤 Visitor Info';
        embed.fields = [
          { name: 'IP', value: visitorInfo.ip || 'unknown', inline: true },
          { name: 'Country', value: visitorInfo.country || 'unknown', inline: true },
          { name: 'City', value: visitorInfo.city || 'unknown', inline: true },
          { name: 'User Agent', value: visitorInfo.userAgent ? visitorInfo.userAgent.substring(0, 100) : 'unknown' }
        ];
        break;
        
      case 'email_click':
        embed.title = '📧 Email Button Clicked';
        embed.color = 0x00ff00;
        embed.fields = [
          { name: 'IP', value: visitorInfo?.ip || 'unknown', inline: true },
          { name: 'Time', value: new Date().toLocaleString(), inline: true }
        ];
        break;
        
      case 'pgp_download':
        embed.title = '🔐 PGP Key Downloaded';
        embed.color = 0xffaa00;
        embed.fields = [
          { name: 'IP', value: visitorInfo?.ip || 'unknown', inline: true },
          { name: 'Time', value: new Date().toLocaleString(), inline: true }
        ];
        break;
        
      default:
        embed.fields = [
          { name: 'Event Type', value: type || 'unknown' },
          { name: 'Data', value: JSON.stringify(data || {}).substring(0, 500) }
        ];
    }

    const discordPayload = {
      embeds: [embed]
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(discordPayload)
    });

    if (!response.ok) {
      throw new Error(`Discord webhook failed: ${response.status}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
    
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};

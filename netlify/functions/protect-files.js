exports.handler = async (event, context) => {
  const request = event.request;
  const url = new URL(request.url);
  const path = url.pathname;
  const referer = request.headers.get('referer') || '';
  const userAgent = request.headers.get('user-agent') || '';
  
  // Allowed origins for accessing files
  const allowedOrigins = [
    'https://0xpsychosecurity.github.io',
    'https://fuckyourshittybiolink.netlify.app'
  ];
  
  // Check if request is from allowed origin
  const isAllowedOrigin = allowedOrigins.some(origin => {
    return referer.startsWith(origin) || referer.includes(origin);
  });
  
  // Block curl and common CLI tools
  const isCurl = userAgent.toLowerCase().includes('curl') || 
                userAgent.toLowerCase().includes('wget') ||
                userAgent.toLowerCase().includes('httpie') ||
                userAgent.toLowerCase().includes('powershell') ||
                userAgent.toLowerCase().includes('python-requests') ||
                userAgent.toLowerCase().includes('axios') ||
                userAgent.toLowerCase().includes('node-fetch');
  
  // Block bots and AI crawlers
  const isBot = userAgent.toLowerCase().includes('bot') ||
               userAgent.toLowerCase().includes('crawler') ||
               userAgent.toLowerCase().includes('spider') ||
               userAgent.toLowerCase().includes('scraper') ||
               userAgent.toLowerCase().includes('gptbot') ||
               userAgent.toLowerCase().includes('chatgpt') ||
               userAgent.toLowerCase().includes('claude') ||
               userAgent.toLowerCase().includes('anthropic') ||
               userAgent.toLowerCase().includes('perplexity') ||
               userAgent.toLowerCase().includes('youbot') ||
               userAgent.toLowerCase().includes('bytespider') ||
               userAgent.toLowerCase().includes('petalbot') ||
               userAgent.toLowerCase().includes('googlebot') ||
               userAgent.toLowerCase().includes('bingbot') ||
               userAgent.toLowerCase().includes('slurp') ||
               userAgent.toLowerCase().includes('duckduckbot') ||
               userAgent.toLowerCase().includes('baiduspider') ||
               userAgent.toLowerCase().includes('yandexbot') ||
               userAgent.toLowerCase().includes('facebookexternalhit') ||
               userAgent.toLowerCase().includes('twitterbot') ||
               userAgent.toLowerCase().includes('linkedinbot') ||
               userAgent.toLowerCase().includes('applebot') ||
               userAgent.toLowerCase().includes('ia_archiver') ||
               userAgent.toLowerCase().includes('archive.org_bot');
  
  // Block if not from allowed origin or if it's a bot/curl
  if (!isAllowedOrigin || isCurl || isBot) {
    return {
      statusCode: 403,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
      body: `<!DOCTYPE html>
<html>
<head>
    <title>Access Denied</title>
    <style>
        body {
            background: #000;
            color: #fff;
            font-family: 'Courier New', monospace;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            text-align: center;
        }
        .container {
            border: 2px solid #ff0000;
            padding: 30px;
            border-radius: 10px;
            background: rgba(255, 0, 0, 0.1);
        }
        h1 {
            color: #ff0000;
            margin-bottom: 20px;
        }
        p {
            margin: 10px 0;
            font-size: 16px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>ACCESS DENIED</h1>
        <p>Direct file access is not permitted.</p>
        <p>Please visit the homepage to view content.</p>
        <p>IP: ${event.headers.get('x-forwarded-for') || 'Unknown'}</p>
        <p>User Agent: ${userAgent.substring(0, 100)}...</p>
    </div>
</body>
</html>`
    };
  }
  
  // If allowed, try to serve the actual file
  try {
    // For assets, construct the file path
    let filePath = path;
    
    // Remove leading slash if present
    if (filePath.startsWith('/')) {
      filePath = filePath.substring(1);
    }
    
    // Map common paths to actual files
    const fileMap = {
      'script.js': 'script.js',
      'assets/': 'assets/'
    };
    
    // Return 404 for any direct file access attempt
    return {
      statusCode: 404,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      },
      body: `<!DOCTYPE html>
<html>
<head>
    <title>File Not Found</title>
    <style>
        body {
            background: #000;
            color: #fff;
            font-family: 'Courier New', monospace;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            text-align: center;
        }
        .container {
            border: 2px solid #ff6b6b;
            padding: 30px;
            border-radius: 10px;
            background: rgba(255, 107, 107, 0.1);
        }
        h1 {
            color: #ff6b6b;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>404 - FILE NOT FOUND</h1>
        <p>The requested file does not exist or is not accessible.</p>
        <p>Please visit the homepage to view content.</p>
    </div>
</body>
</html>`
    };
    
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'text/html; charset=utf-8'
      },
      body: '<!DOCTYPE html><html><head><title>Error</title></head><body><h1>Server Error</h1></body></html>'
    };
  }
};

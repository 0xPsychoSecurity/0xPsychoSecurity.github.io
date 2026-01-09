exports.handler = async (event, context) => {
  const request = event.request;
  const url = new URL(request.url);
  const path = url.pathname;
  const referer = request.headers.get('referer') || '';
  const userAgent = request.headers.get('user-agent') || '';
  const accept = request.headers.get('accept') || '';
  const acceptLanguage = request.headers.get('accept-language') || '';
  const acceptEncoding = request.headers.get('accept-encoding') || '';
  const clientIP = event.headers.get('x-forwarded-for') || 
                   event.headers.get('x-real-ip') || 
                   'unknown';
  
  // Rate limiting - block IPs making too many requests
  const requestCount = parseInt(event.headers.get('x-request-count') || '1');
  const timestamp = Date.now();
  
  // Check for rapid fire requests (common in scraping)
  const requestTime = event.headers.get('x-request-time') || timestamp;
  const timeDiff = timestamp - parseInt(requestTime);
  const isRapidFire = timeDiff < 100; // Less than 100ms between requests
  
  if (requestCount > 10 || isRapidFire) {
    return {
      statusCode: 429,
      headers: { 'Content-Type': 'text/html' },
      body: '<!DOCTYPE html><html><head><title>Rate Limited</title></head><body><h1>Too Many Requests</h1></body></html>'
    };
  }
  
  // Block common datacenter/VPN IPs (simplified check)
  const suspiciousIPs = [
    '192.168.', '10.', '172.', '127.', // Private ranges
    '8.8.8.', '1.1.1.', '208.67.222.', // Common DNS
    '34.', '35.', '52.', '54.', // AWS ranges
    '104.', '107.', '172.', '185.', // Various cloud providers
  ];
  
  const isSuspiciousIP = suspiciousIPs.some(ip => clientIP.startsWith(ip));
  
  // Advanced headless detection via request patterns
  const requestMethod = request.method;
  const requestHeaders = Object.fromEntries(request.headers.entries());
  const headerCount = Object.keys(requestHeaders).length;
  
  // Headless browsers often have fewer headers
  const minimalHeaders = headerCount < 5 ||
                       !requestHeaders['accept-language'] ||
                       !requestHeaders['accept-encoding'] ||
                       !requestHeaders['sec-fetch-dest'] ||
                       !requestHeaders['sec-fetch-mode'] ||
                       !requestHeaders['sec-fetch-site'];
  
  // Check for missing browser-specific headers
  const missingBrowserHeaders = !requestHeaders['sec-ch-ua'] ||
                              !requestHeaders['sec-ch-ua-mobile'] ||
                              !requestHeaders['sec-ch-ua-platform'];
  
  // Check for suspicious accept headers
  const suspiciousAccept = !accept || 
                         accept === '*/*' ||
                         accept.includes('application/json') ||
                         accept.includes('text/plain') ||
                         !accept.includes('text/html');
  
  // Check for suspicious timing patterns
  const suspiciousTiming = requestCount > 5 || 
                        isRapidFire ||
                        requestHeaders['x-forwarded-for'] && requestHeaders['x-forwarded-for'].includes(',') ||
                        requestHeaders['via'] && requestHeaders['via'].includes('cloudflare');
  
  // Check for automated tool signatures
  const automatedSignatures = userAgent.includes('Python') ||
                             userAgent.includes('Java') ||
                             userAgent.includes('Go-http') ||
                             userAgent.includes('Ruby') ||
                             userAgent.includes('PHP') ||
                             userAgent.includes('Node.js') ||
                             userAgent.includes('curl/') ||
                             userAgent.includes('wget/') ||
                             userAgent.includes('axios/') ||
                             userAgent.includes('requests/') ||
                             userAgent.includes('httpie') ||
                             userAgent.includes('fetch/') ||
                             userAgent.includes('libwww') ||
                             userAgent.includes('lwp-trivial') ||
                             userAgent.includes('winhttp') ||
                             userAgent.includes('Microsoft-WebDAV') ||
                             userAgent.includes('Scrapy') ||
                             userAgent.includes('BeautifulSoup') ||
                             userAgent.includes('Selenium') ||
                             userAgent.includes('PhantomJS') ||
                             userAgent.includes('HeadlessChrome') ||
                             userAgent.includes('ChromeHeadless') ||
                             userAgent.includes('SlimerJS') ||
                             userAgent.includes('HtmlUnit') ||
                             userAgent.includes('jsdom') ||
                             userAgent.includes('Test') ||
                             userAgent.includes('Bot') ||
                             userAgent.includes('Crawler') ||
                             userAgent.includes('Spider') ||
                             userAgent.includes('Scraper');
  
  // Additional headless detection via headers
  const suspiciousHeaders = !acceptLanguage || 
                          acceptLanguage === '' ||
                          !accept || 
                          accept.includes('application/json') ||
                          accept.includes('text/html') && !accept.includes('text/css') && !accept.includes('image/') ||
                          request.headers.get('sec-fetch-dest') === 'empty' ||
                          request.headers.get('sec-fetch-user') === '?0' ||
                          request.headers.get('sec-ch-ua-mobile') === '?0' && !userAgent.includes('Mobile');
  
  // Check for automated behavior patterns
  const automatedBehavior = path.includes('?ping=') || 
                         path.includes('?v=') ||
                         path.includes('?t=') ||
                         url.searchParams.size > 0 ||
                         path.includes('random-bg.js');
  
  // Allowed origins for accessing files (only when embedded in homepage)
  const allowedOrigins = [
    'https://0xpsychosecurity.github.io',
    'https://fuckyourshittybiolink.netlify.app'
  ];
  
  // Check if request is from allowed origin AND has proper referer
  const isAllowedOrigin = allowedOrigins.some(origin => {
    return referer.startsWith(origin) || referer.includes(origin);
  });
  
  // Additional check: ensure referer is from homepage, not just domain
  const isFromHomepage = referer.includes('/index.html') || 
                        referer.endsWith('/') || 
                        referer.endsWith('.io') || 
                        referer.endsWith('.app');
  
  // Block direct file access - only allow when embedded in homepage
  const isDirectFileAccess = !isFromHomepage || 
                           path.includes('?') || 
                           url.searchParams.size > 0 ||
                           !referer || 
                           referer === '' ||
                           referer.includes('file://') ||
                           referer.includes('data://');
  
  // Block curl and common CLI tools
  const isCurl = userAgent.toLowerCase().includes('curl') || 
                userAgent.toLowerCase().includes('wget') ||
                userAgent.toLowerCase().includes('httpie') ||
                userAgent.toLowerCase().includes('powershell') ||
                userAgent.toLowerCase().includes('python-requests') ||
                userAgent.toLowerCase().includes('axios') ||
                userAgent.toLowerCase().includes('node-fetch');
  
  // Block headless browsers and automated tools
  const isHeadless = userAgent.toLowerCase().includes('headless') ||
                    userAgent.toLowerCase().includes('phantomjs') ||
                    userAgent.toLowerCase().includes('selenium') ||
                    userAgent.toLowerCase().includes('webdriver') ||
                    userAgent.toLowerCase().includes('playwright') ||
                    userAgent.toLowerCase().includes('puppeteer') ||
                    userAgent.toLowerCase().includes('chromeless') ||
                    userAgent.toLowerCase().includes('jsdom') ||
                    userAgent.toLowerCase().includes('htmlunit') ||
                    userAgent.toLowerCase().includes('trident') ||
                    userAgent.toLowerCase().includes('webkit') && !userAgent.toLowerCase().includes('safari') ||
                    userAgent.toLowerCase().includes('mozilla/5.0') && userAgent.toLowerCase().includes('applewebkit') && userAgent.toLowerCase().includes('chrome') && userAgent.toLowerCase().includes('safari') ||
                    userAgent.toLowerCase().includes('mozilla/5.0') && userAgent.toLowerCase().includes('applewebkit') && userAgent.toLowerCase().includes('version/') && userAgent.toLowerCase().includes('safari') ||
                    !userAgent.includes('Mozilla') && !userAgent.includes('WebKit') && !userAgent.includes('Chrome') && !userAgent.includes('Safari') && !userAgent.includes('Firefox') && !userAgent.includes('Edge') ||
                    userAgent.length < 20 ||
                    userAgent.match(/headless/i) ||
                    userAgent.match(/phantom/i) ||
                    userAgent.match(/selenium/i) ||
                    userAgent.match(/webdriver/i) ||
                    userAgent.match(/playwright/i) ||
                    userAgent.match(/puppeteer/i);
  
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
  
  // Block if not from allowed origin OR if it's direct file access OR bot/curl/headless/suspicious/automated/IP
  if (!isAllowedOrigin || isDirectFileAccess || isCurl || isBot || isHeadless || suspiciousHeaders || automatedBehavior || isSuspiciousIP || minimalHeaders || missingBrowserHeaders || suspiciousAccept || suspiciousTiming || automatedSignatures) {
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
            max-width: 600px;
        }
        h1 {
            color: #ff0000;
            margin-bottom: 20px;
            font-size: 24px;
        }
        p {
            margin: 10px 0;
            font-size: 16px;
            line-height: 1.4;
        }
        .details {
            font-size: 12px;
            color: #ccc;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>ACCESS DENIED</h1>
        <p><strong>Direct file access is not permitted.</strong></p>
        <p>Files can only be viewed when embedded in the homepage.</p>
        <p>Please visit the main site to view content.</p>
        <div class="details">
            <p>Request: ${path}</p>
            <p>IP: ${clientIP}</p>
            <p>User Agent: ${userAgent.substring(0, 100)}...</p>
            <p>Referer: ${referer || 'None'}</p>
            <p>Time: ${new Date().toISOString()}</p>
        </div>
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

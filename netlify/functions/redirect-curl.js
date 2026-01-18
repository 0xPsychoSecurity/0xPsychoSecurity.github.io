const https = require('https');

exports.handler = async (event, context) => {
  const userAgent = event.headers['user-agent'] || '';
  const referer = event.headers['referer'] || '';
  
  const curlPatterns = [
    /curl/i,
    /wget/i,
    /python-requests/i,
    /axios/i,
    /httpie/i,
    /fetch/i,
    /libwww/i,
    /perl/i,
    /java/i,
    /go-http/i
  ];
  
  const isCurl = curlPatterns.some(pattern => pattern.test(userAgent));
  
  const hasNoAcceptHeader = !event.headers['accept'] || event.headers['accept'].includes('*/*');
  const hasNoAcceptLanguage = !event.headers['accept-language'];
  
  if (isCurl || (hasNoAcceptHeader && hasNoAcceptLanguage)) {
    return {
      statusCode: 302,
      headers: {
        'Location': 'https://example.com/redirect-target',
        'Cache-Control': 'no-cache'
      }
    };
  }
  
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html'
    },
    body: '<!DOCTYPE html><html><head><title>Normal Browser</title></head><body><h1>Welcome normal browser user!</h1></body></html>'
  };
};

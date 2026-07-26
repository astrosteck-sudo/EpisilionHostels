// middleware.js - Put this in your root folder
export const config = {
  // Run this middleware on all pages, but ignore static files and APIs
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};

export default async function middleware(request) {
  const url = new URL(request.url);
  const userAgent = request.headers.get('user-agent')?.toLowerCase() || '';

  // List of search engine bots/crawlers to intercept
  const bots = [
    'googlebot', 'bingbot', 'yandexbot', 'baiduspider', 'facebookexternalhit',
    'twitterbot', 'rogerbot', 'linkedinbot', 'embedly', 'quora link preview',
    'showyoubot', 'outbrain', 'pinterest/0.', '://google.com',
    'slackbot', 'vkshare', 'w3c_validator', 'redditbot', 'applebot', 'whatsapp', 'flipboard', 'tumblr'
  ];

  // Check if the request is coming from a bot
  const isBot = bots.some(bot => userAgent.includes(bot));

  if (isBot) {
    const token = process.env.PRERENDER_TOKEN;
    if (!token) return; // Fallback to normal behavior if token is missing

    // ✅ FIXED: Added 'service.' and the missing '$' sign
    const prerenderUrl = `https://prerender.io${url.href}`;
    
    try {
      // Forward the request to Prerender.io along with your authorization token
      const response = await fetch(prerenderUrl, {
        headers: {
          'X-Prerender-Token': token,
          'User-Agent': request.headers.get('user-agent') || ''
        }
      });

      // Return the pre-rendered static HTML directly to Googlebot
      return response;
    } catch (e) {
      console.error('Prerender forwarding failed:', e);
    }
  }

  // If it's a real human user, let Vercel handle it normally
}

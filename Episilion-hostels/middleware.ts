// middleware.ts - Place in your root folder
export const config = {
  // Catch all pages, but completely ignore backend API routes and static asset types
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};

export default async function middleware(request: Request) {
  const url = new URL(request.url);
  const userAgent = request.headers.get('user-agent')?.toLowerCase() || '';

  // Comprehensive list of search bots to intercept
  const bots = [
    'googlebot', 'bingbot', 'yandexbot', 'baiduspider', 'facebookexternalhit',
    'twitterbot', 'rogerbot', 'linkedinbot', 'embedly', 'quora link preview',
    'showyoubot', 'outbrain', 'pinterest/0.', '://google.com',
    'slackbot', 'vkshare', 'w3c_validator', 'redditbot', 'applebot', 'whatsapp', 'flipboard', 'tumblr'
  ];

  const isBot = bots.some(bot => userAgent.includes(bot));

  if (isBot) {
    const token = process.env.PRERENDER_TOKEN;
    if (!token) return; // Standard edge middleware bypass: returning nothing continues the request normally

    const prerenderUrl = `https://prerender.io{url.href}`;
    
    try {
      const response = await fetch(prerenderUrl, {
        headers: {
          'X-Prerender-Token': token,
          'User-Agent': request.headers.get('user-agent') || ''
        }
      });

      return response;
    } catch (e) {
      console.error('Prerender proxy transmission failed:', e);
    }
  }

  // Returning nothing tells Vercel to let real human traffic pass straight through
}

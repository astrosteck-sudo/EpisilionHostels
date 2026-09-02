// middleware.ts - MUST be in your absolute root folder (next to package.json)
export const config = {
  // Catch all routes except backend APIs and static asset folders
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};

export default async function middleware(request: Request) {
  const url = new URL(request.url);
  const userAgent = request.headers.get('user-agent')?.toLowerCase() || '';

  const bots = [
  'googlebot', 'bingbot', 'yandexbot', 'baiduspider', 'facebookexternalhit',
  'twitterbot', 'rogerbot', 'linkedinbot', 'embedly', 'quora link preview',
  'showyoubot', 'outbrain', 'pinterest/0.', '://google.com',
  'slackbot', 'vkshare', 'w3c_validator', 'redditbot', 'applebot', 'whatsapp', 'flipboard', 'tumblr',
  'prerender',
  // AI crawlers
  'gptbot', 'chatgpt-user', 'oai-searchbot',
  'claudebot', 'claude-web', 'anthropic-ai',
  'perplexitybot', 'perplexity-user',
  'ccbot', 'google-extended', 'bytespider', 'diffbot', 'youbot'
];

  const isBot = bots.some(bot => userAgent.includes(bot));

  if (isBot) {
    const token = process.env.PRERENDER_TOKEN;
    if (!token) return; // Silent fallback if token env variable is missing

    const prerenderUrl = `https://prerender.io${url.href}`;
    
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
}

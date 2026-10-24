Episilion Hostels Frontend

## Project overview

Episilion Hostels is a student-focused hostel discovery and booking platform for UPSA (University of Professional Studies, Accra), helping students find safe, verified, and affordable accommodation close to campus. The product addresses a common challenge for university students: locating trustworthy hostels near campus, comparing options, understanding pricing and amenities, and booking or enquiring without a lot of back-and-forth. The frontend is built around a hostel search experience that supports browsing, filtering, comparison, and direct booking-related flows.

## Key features

- Hostel browsing and search with filtering by gender, price, and hostel name search logic in the main landing experience.
- Ask Episilion, an AI-powered hostel search and chat assistant with a free-tier usage limit and a paid subscription upgrade flow.
- Hostel comparison tools to evaluate multiple options side by side.
- User accounts with sign up, login, OAuth sign-in, favorites, and review submission flows.
- Hostel manager portal with a separate manager login and dashboard for updating listing details and pricing.
- SEO-focused hostel detail pages using `react-helmet-async`, including canonical URLs, Open Graph tags, meta descriptions, and structured JSON-LD data.
- Payment integration for subscription upgrades and checkout redirects.

## Tech stack

The frontend is a Vite-based React application using the following libraries from `package.json`:

- React 19
- React Router DOM 7
- Vite
- Axios
- `react-helmet-async` for SEO metadata
- `react-bootstrap-icons`
- Framer Motion
- GSAP
- Geolib
- Day.js
- Validator
- UUID
- DOMPurify

The app talks to a separate Node.js/Express backend for live hostel data, authentication, reviews, manager updates, favorites, and AI-powered search flows. In the broader project context, that backend is the data and business-logic layer for the platform, with MySQL-backed storage and NVIDIA-hosted AI models supporting the Ask Episilion assistant.

## Getting started

From the frontend project directory:

```bash
npm install
npm run dev
```

For a production build:

```bash
npm run build
```

### Production prerendering and SEO

The production build generates the sitemap and hostel route list from the live
hostel API, then uses Puppeteer to prerender the configured public routes into
HTML. This gives search engines route-specific page content and metadata rather
than only the client-side app shell.

During prerendering, two routes are processed at a time to limit browser and
memory pressure on build containers. Chromium is configured to avoid relying
on `/dev/shm`, which can be limited in CI environments. Third-party network
requests are skipped to avoid waiting on external services such as embedded
maps; same-origin API requests are still allowed. The app waits up to 20
seconds for the hostel API before completing its loading state and notifying
the prerenderer that the page is ready. The prerenderer also has a 25-second
fallback after navigation so a missing ready event cannot fail the entire
deployment.

Hostel detail pages can only be prerendered with their listing content when the
hostel API is reachable and returns data during the build. If the API is
unavailable or times out, the app can finish rendering without that data, so
the fallback may capture the page before its listing data is available. Check
the build logs and generated hostel pages if SEO output looks incomplete.

### Adding features without destabilizing builds

The latest successful Vercel deployment completed its Vite build in about 49
seconds (54 seconds total) with an initial JavaScript bundle of about 708 kB
minified (211 kB gzip). Vite reported that this chunk exceeds its 500 kB
warning threshold. This warning is not itself a build failure: the deployment
completed successfully. Treat the current bundle size and build time as a
baseline to monitor as features are added, rather than assuming bundle size
caused the earlier prerender timeouts.

For each significant feature:

1. Check whether the feature needs to load on the initial page. For heavy,
   route-specific screens or optional interactions, consider React
   `lazy()`/dynamic imports so their code is downloaded only when needed.
2. Prefer existing dependencies and import only the icons, assets, and
   components the feature uses. Avoid adding a large dependency for a small
   piece of functionality.
3. Run `npm run build` and compare the reported JavaScript/CSS chunk sizes and
   build duration with the baseline. Investigate a growing initial chunk or a
   new warning; do not just raise Vite's warning limit to hide the increase.
4. If code splitting affects public pages, inspect the generated HTML for
   representative static and hostel routes. Confirm route-specific content
   and SEO metadata are still present, and that prerendering still completes.
5. Review the complete deployment log. A chunk-size warning is distinct from a
   failed build; for failures, identify the first actual error and whether it
   occurred during route navigation, app readiness, or asset loading before
   changing prerender settings.

Keep the prerender route concurrency and readiness behavior conservative.
Changes to route loading, API timing, or prerender timeouts must be checked
against generated hostel pages so a faster build does not silently remove
listing content needed for search indexing.

There is no `.env.example` file in this frontend repository at the moment, so the app currently does not define any frontend environment variables in source control. If your local environment requires backend URLs or API configuration, those values need to be added in a local `.env` file outside the repo or in your deployment settings.

## Project structure

The frontend is organized around a SPA structure under `src/`:

- `src/App.jsx` — global route configuration and page layout, including the catch-all 404 route and core pages.
- `src/HomePage/HomePage.jsx` — hostel search, filters, suggestions, and listing views.
- `src/MoreDetailsPage/MoreDetailsPage.jsx` — hostel detail view with booking/review information, Open Graph SEO metadata, and structured data.
- `src/AskEpisilionPage/AskEpisilionPage.jsx` — AI chat assistant and paid subscription flow.
- `src/HostelManagerPage/HostelManagerPage.jsx` — manager dashboard for hostel owners.
- `src/logins/` — signup, login, OAuth success/error handling, and related account flows.
- `src/CompareHostelsPage/` — hostel comparison experience.
- `src/UserProfilPage/` — user profile area and account actions.
- `src/NotFoundPage/NotFoundPage.jsx` — custom 404 page with noindex directives for bad or invalid URLs.
- `src/UTILS/` — shared helper functions for slugs, location logic, and device ID handling.
- `src/services/` — API and payment-related service integrations.

## Known limitations / notes

- This is a client-side React SPA using `BrowserRouter`, so URL handling is performed in the browser rather than on a server-rendered backend.
- That means SEO and routing considerations matter: invalid or undefined hostel URL paths should be treated carefully, and a custom noindex 404 page is used to prevent search engines from indexing broken or soft-404 URLs.
- The app depends on a separate backend for live data and business logic, so local development and deployment require that backend to be reachable and configured correctly.
- Because this project is a production-facing frontend for a real site, the frontend focuses on user experience and SEO surfaces rather than being a standalone static demo.
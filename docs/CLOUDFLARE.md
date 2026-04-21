# Cloudflare Deployment Guide

## Overview

The portfolio deploys to Cloudflare Workers (not Pages).
Astro's Cloudflare adapter builds for Workers natively.
Static assets served via Workers Assets. SSR routes run on the Worker.

Note: Astro dropped Pages support. Cloudflare recommends Workers for all new projects.
Workers gives full access to the Cloudflare platform (KV, R2, D1, AI, Turnstile, etc.).

## Prerequisites

- Cloudflare account with mariaangelika.com registered
- GitHub repo connected to Cloudflare for auto-deploy
- Wrangler CLI installed (`npm install -D wrangler`)
- Node.js 18+

## Local Development

```bash
npm run dev          # Astro dev server (hot reload)
npm run preview      # Build + preview with Wrangler (workerd runtime, matches prod)
```

Use `npm run preview` to test Cloudflare-specific features (bindings, KV, etc.)
before deploying. This runs on the actual workerd runtime.

## Deploy

### Option A: CLI (manual)
```bash
npm run build
npx wrangler deploy
```

### Option B: Git integration (recommended)
1. Push to GitHub
2. Cloudflare auto-builds and deploys on every push to `main`
3. Preview deployments on PRs

Setup in Cloudflare dashboard:
- Workers & Pages → Create → Import Git repository
- Select repo → Framework: Astro
- Build command: `npm run build`
- Build output: `dist`
- If it routes to Workers instead of Pages, that's correct (new default)

## Custom Domain

mariaangelika.com is already on Cloudflare Registrar.
In the Workers dashboard, go to your project → Custom Domains → Add mariaangelika.com.
SSL is automatic.

## Environment Variables / Secrets

Set in Cloudflare dashboard (Settings → Variables), never in wrangler.jsonc:

| Variable | Purpose | Where |
|----------|---------|-------|
| ANTHROPIC_API_KEY | Claude API for chat widget | Secret |
| TURNSTILE_SECRET_KEY | Contact form CAPTCHA server-side validation | Secret |
| TURNSTILE_SITE_KEY | Contact form CAPTCHA client-side | Variable |
| ENVIRONMENT | production / development | Variable |

## Cloudflare Services Setup

### Turnstile (contact form CAPTCHA)
1. Dashboard → Turnstile → Add site
2. Enter mariaangelika.com
3. Choose "Managed" mode
4. Copy site key (client) and secret key (server)

### Email Routing (contact form → your inbox)
1. Dashboard → Email → Email Routing
2. Add destination address (your email)
3. Create routing rule for contact@mariaangelika.com

### Workers KV (if needed for sessions/chat history)
Astro's Cloudflare adapter auto-provisions KV namespace named SESSION on deploy.
No manual setup needed unless you want custom namespaces.

## Gotchas

- Cloudflare dashboard may silently route to Workers instead of Pages.
  This is the correct behavior for new projects. Don't fight it.
- Auto Minify can break React hydration. If you see hydration mismatch
  errors, disable it: Speed → Optimization → Auto Minify → uncheck JS.
- Add `.assetsignore` in `public/` if needed to exclude files from
  the Workers Assets bundle.
- For prerendered static pages (like /about), add `export const prerender = true`
  in the frontmatter to skip SSR for those routes.

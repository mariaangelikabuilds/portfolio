# Tech Stack Reference

## Core Framework

**Astro** — static-first site builder with island architecture.
Why: Ships zero JS by default. React components hydrate only where needed.
Cloudflare Workers native via @astrojs/cloudflare adapter.
Beats Next.js here because no edge runtime gotchas on Cloudflare.

## Languages

- Astro components: `.astro` files (HTML-like with frontmatter)
- Interactive islands: React (`.tsx`) — for animations, chat widget, interactive elements
- Logic/utilities: TypeScript throughout
- Styling: Tailwind CSS v4 (utility classes in markup)
- Server logic: TS in Astro frontmatter or Cloudflare Worker bindings

## Dependencies

### Production
```
astro                    — core framework
@astrojs/cloudflare      — Cloudflare Workers adapter
@astrojs/react           — React island integration
@astrojs/tailwind        — Tailwind integration
react                    — interactive components
react-dom                — DOM rendering
framer-motion            — animations (React islands only)
@anthropic-ai/sdk        — Claude API for chat widget (server-side only)
```

### Dev
```
tailwindcss              — utility CSS
wrangler                 — Cloudflare CLI for local dev + deploy
prettier                 — formatting
```

## Project Structure

```
mariaangelika.com/
├── CLAUDE.md                    # Project constitution (Claude Code reads this)
├── wrangler.jsonc               # Cloudflare Workers config
├── astro.config.mjs             # Astro config with Cloudflare adapter
├── tailwind.config.mjs          # Tailwind config
├── package.json
├── public/
│   ├── favicon.svg
│   ├── fonts/                   # Self-hosted fonts (no Google Fonts CDN)
│   └── images/                  # Static images (optimized)
├── src/
│   ├── layouts/
│   │   └── BaseLayout.astro     # Shell: head, nav, footer
│   ├── components/
│   │   ├── Nav.astro            # Fixed left panel nav
│   │   ├── Hero.astro           # Landing hero section
│   │   ├── ProjectCard.astro    # Work preview cards
│   │   ├── StackDisplay.astro   # Tech stack visual
│   │   ├── ContactForm.tsx      # React island (Turnstile + Worker)
│   │   └── ChatWidget.tsx       # React island (Claude API)
│   ├── pages/
│   │   ├── index.astro          # Landing page
│   │   ├── about.astro          # About page
│   │   ├── contact.astro        # Contact page
│   │   └── work/
│   │       └── [slug].astro     # Dynamic case study pages
│   ├── content/
│   │   └── work/                # Case study markdown files
│   │       ├── portfolio.md
│   │       ├── phishing-sim.md
│   │       ├── ai-tool.md
│   │       └── n8n-pipeline.md
│   └── styles/
│       └── global.css           # Tailwind base + custom properties
├── docs/
│   ├── STACK.md                 # This file
│   ├── REFERENCES.md            # Design references
│   └── CLOUDFLARE.md            # Deployment guide
└── .gitignore
```

## Cloudflare Services Used

| Service | Purpose | Free Tier |
|---------|---------|-----------|
| Workers | SSR + API routes | 100K req/day |
| Workers Assets | Static file serving | Included |
| KV | Session storage (if needed) | 100K reads/day |
| Turnstile | Contact form CAPTCHA | Unlimited |
| Email Routing | Contact form forwarding | 25 addresses |

## Build Commands

```bash
npm run dev          # Local dev server (Astro + Wrangler)
npm run build        # Build for production
npm run preview      # Preview with Wrangler (workerd runtime)
npm run deploy       # Deploy to Cloudflare Workers
```

## Init Commands (Run Once)

```bash
# Create the project (select strict TypeScript when prompted)
npm create astro@latest mariaangelika.com -- --template minimal

cd mariaangelika.com

# Add integrations
npx astro add cloudflare
npx astro add react
npx astro add tailwind

# Add animation + AI
npm install framer-motion @anthropic-ai/sdk

# Add Cloudflare CLI
npm install -D wrangler

# Init git
git init
git branch -M main
```

## Wrangler Config (wrangler.jsonc)

```jsonc
{
  "name": "mariaangelika-portfolio",
  "compatibility_date": "2026-04-20",
  "compatibility_flags": ["nodejs_compat"],
  "assets": {
    "binding": "ASSETS",
    "directory": "./dist"
  },
  "vars": {
    "ENVIRONMENT": "production"
  }
  // ANTHROPIC_API_KEY goes in Cloudflare dashboard secrets, not here
}
```

## Astro Config (astro.config.mjs)

```ts
import { defineConfig } from 'astro/config'
import cloudflare from '@astrojs/cloudflare'
import react from '@astrojs/react'
import tailwind from '@astrojs/tailwind'

export default defineConfig({
  output: 'server',
  adapter: cloudflare(),
  integrations: [react(), tailwind()],
  site: 'https://mariaangelika.com',
})
```

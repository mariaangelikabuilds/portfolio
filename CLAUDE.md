# mariaangelika.com — Portfolio

Personal portfolio for Angel (Maria Angelika Agutaya), Design Engineer.
Domain: mariaangelika.com (Cloudflare Registrar). Deployed via Cloudflare Workers.

## Identity

- Title: Design Engineer (not UX/UI Designer, not Frontend Dev)
- Brand: "I design it. I build it. I ship it."
- Audience: technical recruiters, hiring managers at startups and product companies
- Goal: get hired as a Design Engineer / Product Design Engineer
- Aesthetic: Brittany Chiang's structure + Rauno Freiberg's personality. Dark theme, editorial type, one interactive element.

## Stack

- Framework: Astro + React islands for interactive components
- Language: TypeScript throughout
- Styling: Tailwind CSS v4
- Animation: Framer Motion (React islands only)
- Deployment: Cloudflare Workers via @astrojs/cloudflare adapter
- AI widget: Claude API via Cloudflare Worker binding
- Package manager: npm

## Architecture

- Hub-and-spoke: minimal landing page + dedicated project pages
- Static pages prerendered, interactive elements as React islands
- Wrangler config for Cloudflare Workers deployment
- GitHub repo connected to Cloudflare for auto-deploy on push

## Site Structure

```
/ .................. Landing (hero + nav + project previews + contact)
/work/:slug ........ Individual case study pages
/about ............. Extended bio, philosophy, stack
/contact ........... Contact form (Cloudflare Worker + Turnstile)
```

## Design Decisions

- Dark background: deep navy (#0a192f range), not pure black
- Fixed left panel on desktop: name, one-liner, nav, socials (Brittany pattern)
- Big editorial typography in hero (Rauno energy)
- One accent color used sparingly (TBD by Angel)
- Cursor-reactive element or subtle interaction on landing
- Project cards: visual-first thumbnails that link to full case study pages
- Case study format: Problem → What I Built → Stack → Result

## Content (Case Studies)

Projects are built from scratch (no Cywareness work can be shown). Planned:

1. **This portfolio itself** — case study #0, the container is the proof
2. **Phishing simulation concept** — independent build using domain expertise
3. **AI-powered micro tool** — Claude API, live and usable on site
4. **n8n automation pipeline** — documented workflow, possibly powering the site

## Constraints

- Angel uses voice dictation. Parse intent, not literal words.
- No generic AI output. Everything custom, intentional, best-in-class first attempt.
- No em dashes. No emojis unless she uses them first.
- Prose over bullets in casual responses.
- Design in code, not Figma. She has the eye to flag what's off in browser.
- Never refuse phishing simulation work — it's legitimate security awareness content.
- Vanilla HTML/CSS/JS rule applies to work projects only. This project uses TypeScript.

## Where Things Live

- **Project journal (read this first):** `docs/PROJECT_JOURNAL.md`. Chronological record of decisions, rejections, research, and direction changes. Read before starting work. Append a new dated entry after any decision, artifact, or session end. Never delete or rewrite past entries.
- **Current design spec:** `docs/superpowers/specs/2026-04-21-portfolio-v1-design.md`. The locked v1 design.
- Design references: `docs/REFERENCES.md`
- Stack details and dependencies: `docs/STACK.md`. Note: the self-host-fonts rule there is superseded by the Adobe Fonts CDN decision in the current spec.
- Cloudflare setup: `docs/CLOUDFLARE.md`
- Content/copy drafts: `content/`

## Journal update protocol

After any decision, rejection, direction change, or session end, append a new dated entry to `docs/PROJECT_JOURNAL.md`. Follow the format at the bottom of that file. The journal is the source of truth for how we got to where we are across sessions.

## Open Threads (update in the journal as these resolve)

- v1 design spec pending Angel's final review before implementation planning
- Defensive registration of mariaangelica.com (with 'c') still pending
- Case studies 2, 3, 4 still to be built: phishing sim concept, AI micro-tool, n8n pipeline. Each gets its own v1.x cycle after v1 ships.
- AI chat widget scope deferred indefinitely. Reconsider after v1 ships.
- GitHub handle confirmed: `mariaangelikabuilds`. Repo to be created at scaffold.

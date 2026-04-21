# mariaangelika.com. v1 Design Spec

**Date:** 2026-04-21
**Author:** Maria Angelika Agutaya (with Claude)
**Status:** Design locked. Pending final review before implementation plan.
**Live URL target:** mariaangelika.com
**Deploy target:** Cloudflare Workers

---

## Purpose

A portfolio that doubles as a case study in the role it's hiring for. First-time recruiters clicking through should understand in 10 seconds that the person who designed the site also engineered it. The site itself is the proof.

## Scope (v1)

Ships in ~6-7 days (updated from 5 after adding Flip-morph + Grid Rules easter egg). Three surfaces:

1. Landing page (`/`). Hero, selected work preview, inline contact form.
2. One case study page (`/work/portfolio`). The self-referential one.
3. Form endpoint (`/api/contact`). Cloudflare Worker plus Turnstile plus Email Routing.

Out of v1 (full list in "Out of Scope" below): `/about` page, AI chat widget, additional case studies, writing/blog, `/experiments` or `/ui` index.

## Locked decisions

| Decision | Value | Source |
|---|---|---|
| Framework | Astro 5 plus React islands | docs/STACK.md |
| Language | TypeScript throughout | docs/STACK.md |
| Styling | Tailwind CSS v4 | docs/STACK.md |
| Hosting | Cloudflare Workers via `@astrojs/cloudflare` | docs/STACK.md |
| Content model | Astro content collections (zod-validated frontmatter) | Brainstorm 2026-04-21 |
| Palette | Deep navy `#0a192f` plus cream `#f5e6c8`. No chromatic accent. | Brainstorm Q4 |
| Typography | Freight Big Pro (display, ideally variable-weight), Neue Haas Grotesk Display/Text (body), Input Mono (mono). All via Adobe Fonts. | Brainstorm Q5 |
| Hero copy | "Design Engineer. The site you're reading is the portfolio." | Brainstorm Q6 iteration |
| Motion system | Three motions total. See Motion System section below. | Motion research 2026-04-21 |
| Case study angle | Pure design-engineering process ("Designing in the browser, no Figma"). No pivot framing. | Brainstorm Q3 |
| Contact | Real Cloudflare Worker endpoint, Turnstile CAPTCHA, Email Routing | Brainstorm Q6 final |
| Voice | First-person, declarative, technical precision without academic distance. No buzzwords, no casual tics. See `memory/project_portfolio_voice.md`. | Brainstorm voice revision |

## Motion system

Three motions total. Everything else on the site is static. No scroll-triggered fade-ups. No stagger reveals. No cursor-following gradient. No mount animations.

### Motion 1: Proximity-responsive hero typography (always-on, landing only)

On the hero area of the landing page, the cursor's Euclidean distance to each glyph continuously modulates that glyph's font weight. No hover state, no click. Moving the cursor across the hero area causes letters closest to the cursor to thicken; letters far from the cursor settle to the baseline weight. The effect is that the type itself senses reader presence.

- Primary implementation: CSS variable `--wght` per glyph, updated via rAF loop, bound to `font-variation-settings: 'wght' var(--wght)` on each character wrapped in a `<span>`.
- If Freight Big Pro Variable is not available on Adobe Fonts, fallback is opacity-layered cross-fade between two static weights (Book and Medium). Same visual behavior, slightly more DOM.
- Only active within the hero bounding box. Does not extend into scroll zone or panel.
- Reference pattern: Exat microsite, April 2026.
- Build cost: ~2-3 hours, ~80 lines vanilla JS + CSS.

### Motion 2: Flip-morph nav-to-title (navigation WOW moment)

When the reader clicks `Work` in the left panel (or clicks a Selected Work card on the landing), the link's bounding box animates into the case study page's H1 on the destination page. One continuous element, not a fade-out then fade-in.

- Implementation: GSAP Flip plugin plus Astro View Transitions API (shared element transition via `transition:name="case-study-title"`).
- Only visible when actually navigating. v1 has one case study, so the morph happens on exactly one navigation path. Scales to three paths when case study 2 ships.
- Reference pattern: Joffrey Spitzer portfolio, Feb 2026.
- Build cost: ~4-6 hours (includes fallback for browsers without View Transitions API).

### Motion 3: Grid Rules easter egg (click-triggered discoverability)

A small Input Mono cross (`+`) sits in the bottom-right of the fixed left panel. Clicking it toggles a "grid rules" mode: thin cream guide lines animate out from viewport edges to frame every element tagged `data-rules`. A second click retracts them. The site's underlying layout grid becomes briefly visible.

- Implementation: vanilla JS with `getBoundingClientRect()` per tagged element, guide lines drawn as absolutely positioned `<div>` rules animated in with CSS transforms.
- Tagged elements: hero, each section heading, each Selected Work card, contact form block, each case study decision block.
- Reference pattern: Corentin Bernadou portfolio, March 2026.
- Build cost: ~3-4 hours, ~120 lines.

## Architecture

### File structure

```
portfolio/
├── CLAUDE.md                          # existing
├── wrangler.jsonc                     # existing (pending init)
├── astro.config.mjs
├── tailwind.config.mjs
├── package.json
├── tsconfig.json
├── public/
│   ├── favicon.svg
│   └── assets/decisions/              # decision artifacts (screenshots)
├── src/
│   ├── layouts/
│   │   └── BaseLayout.astro           # head (Adobe Fonts link), nav, footer, HTML source easter egg
│   ├── components/
│   │   ├── LeftPanel.astro            # fixed identity panel (desktop)
│   │   ├── MobileHeader.astro         # mobile nav equivalent
│   │   ├── Hero.tsx                   # React island: proximity-responsive variable font weight
│   │   ├── GridRulesToggle.tsx        # React island: the + cross + grid guide lines
│   │   ├── WorkPreview.astro          # single case study card for landing
│   │   ├── ContactForm.tsx            # React island: form plus Turnstile
│   │   ├── HeroCopyToggle.tsx         # React island embedded in case study (A/B hero demo)
│   │   └── FooterEcho.astro           # "The site you just read was the portfolio."
│   ├── content/
│   │   ├── config.ts                  # collection schema (zod)
│   │   └── work/
│   │       └── portfolio.md           # v1's one case study
│   ├── pages/
│   │   ├── index.astro                # landing
│   │   ├── work/
│   │   │   └── [slug].astro           # dynamic case study route
│   │   └── api/
│   │       └── contact.ts             # Worker endpoint: POST only, Turnstile validate, Email Routing
│   └── styles/
│       └── global.css                 # Tailwind v4 base plus CSS custom properties
└── docs/                              # existing
```

### Island boundaries

React islands hydrate only for motion and interaction. Everything else is static/SSR. Islands:

1. `Hero.tsx`. Proximity-responsive variable font weight on hero glyphs. Pointer-move listener, rAF loop, per-glyph `--wght` CSS variable.
2. `GridRulesToggle.tsx`. Click state + `getBoundingClientRect` per tagged element + guide line rendering.
3. `ContactForm.tsx`. Controlled form, renders Turnstile widget, posts to `/api/contact`, handles success/error states.
4. `HeroCopyToggle.tsx`. Pure CSS/state toggle between two hero copy options. Embedded in case study body as the live decision artifact.

Flip-morph (Motion 2) is not an island. It's a page-transition behavior implemented via Astro View Transitions with a GSAP Flip fallback script loaded in `BaseLayout`.

All other components (`LeftPanel`, `WorkPreview`, `FooterEcho`, `MobileHeader`) render to static HTML with zero client JS.

### Content model

Astro content collection at `src/content/work/` with zod schema:

```ts
import { defineCollection, z } from 'astro:content';

const work = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    tagline: z.string(),
    category: z.enum(['case-study', 'experiment', 'writing']),
    stack: z.array(z.string()),
    year: z.number(),
    timeToShip: z.string(),
    heroImage: z.string().optional(),
    order: z.number(),
    publishedAt: z.date(),
  }),
});

export const collections = { work };
```

Rendering logic on landing:
- If `collections.work.map(e => e.data.category).distinct().length === 1`, render as one flat "Selected work" section.
- If more than one category has entries, render grouped sections (one per category: "Case studies", "Experiments", "Writing").

v1 has one entry (`portfolio.md`), so the flat branch always renders.

## Landing page

### Layout, desktop (≥1024px)

Two-column flex:

**Fixed left panel (38% width).** Scrolls with viewport but visually anchored. Contains:
- Name (two lines, Freight Big Pro ~28px)
- Bio sentence (Neue Haas ~13px): "Design Engineer. Based in the Philippines. Open to new roles."
- Nav links (Neue Haas body, ~14px, no numbering): `Work`, `Contact`. Current section gets a 1px cream left border.
- CTA sentence (Neue Haas ~13px): "Fork the code. Send a note. Read the case study." Each sentence is a link.
- Socials sentence (Neue Haas ~12px): "GitHub, LinkedIn, email." Each word is a link.
- Grid Rules cross (Input Mono `+`, ~14px, bottom-right of panel)
- Right border: 1px dashed cream at 15% opacity

No circle-dot availability badge. No numbered 01/02 nav. No middle-dot separators.

**Right column (62% width).** Scrolls independently. Sections in order:
1. Hero
2. Selected work
3. Contact
4. Footer echo

### Layout, mobile (<1024px)

Left panel collapses. Top bar:
- Compact monogram `MA` plus "Menu" text label (overlay for nav plus socials plus availability sentence)
- Sections stack single-column: Hero, Work, Contact, Footer echo
- Hero type reduces to ~26-32px
- Grid Rules cross accessible via the menu overlay (not on main screen)

### Hero

- **H1:** "Design Engineer." Freight Big Pro ~72px desktop / ~32px mobile.
- **H2 (sub):** "The site you're reading is the portfolio." Freight Big Pro ~48px / ~26px mobile.
- Every character wrapped in `<span data-glyph>` for proximity-weight targeting (Motion 1).
- Static on load. No fade-in, no stagger.
- Proximity-responsive variable font weight is always active on desktop. On mobile (touch, no cursor), a one-time on-load weight cascade plays across the hero as a single gesture then settles.

### Selected work section

- Heading: "Selected work" in Freight Big Pro ~28px. One thin 1px cream rule above, 1px opacity 30%.
- No "01 ·" mono prefix.
- One card per case study entry. v1 has one card (portfolio).
- Card grid: 80px thumbnail (left), title/tagline/stack (middle), year (right).
- Hover: title gets 1px underline with 4px offset.
- Clicks route to `/work/[slug]`. This click is where Motion 2 fires.
- The card's title element has `transition:name="case-study-title"` for View Transitions.

### Contact section

- Heading: "Contact" in Freight Big Pro ~28px with thin 1px cream rule above.
- Body sentence (Neue Haas ~15px): "Want to work together? Fill the form below. The message goes to my inbox directly. Turnstile keeps the bots out."
- Form fields (Neue Haas):
  - Name (required)
  - Email (required, HTML5 validation)
  - Message (required, textarea)
- Turnstile widget renders inline above submit
- Submit button: outlined, Neue Haas bold "Send"
- Success state: message replaces form with Neue Haas confirmation line
- Error state: inline error above submit, form state preserved

### Footer echo

At the bottom of the right column, below contact:

- Thin cream divider
- Line in Freight Big Pro ~24px: *"The site you just read was the portfolio."*
- Below, stack signal line in Input Mono ~10px: `Built with Astro + React islands. Running on Cloudflare Workers. Type via Adobe Fonts.`

### HTML source easter egg

In `BaseLayout.astro` `<head>`, an ASCII comment block:

```html
<!--
  Built by Maria Angelika Agutaya. mariaangelika.com
  Astro + React islands · Tailwind v4 · Cloudflare Workers
  Type: Freight Big Pro · Neue Haas Grotesk · Input Mono
  Form: Worker endpoint + Turnstile + Email Routing
  Motion: proximity variable weight · flip-morph · grid rules
  Source: github.com/mariaangelikabuilds/portfolio
-->
```

## Case study page (`/work/portfolio`)

### Layout

- Same fixed left panel as landing (identity anchor stays constant)
- Back-to-index link in panel: "Index" in Neue Haas, same size as other nav items
- `Contact` nav item rendered at 45% opacity (ghost, still clickable, returns to `/#contact`)
- Right column content width capped at **640px max** (essay rhythm). Decision blocks, stack tables, and hero visuals break out to full right-column width as inset artifacts.

### Section order

1. **Eyebrow sentence.** Neue Haas ~13px: "Case study, 2026."
2. **Title.** Freight Big Pro ~44px: `mariaangelika.com`. This is the Motion 2 morph target (`transition:name="case-study-title"`).
3. **Tagline.** Neue Haas ~16px, one line.
4. **Context sentence.** Neue Haas ~13px, not a table of mono fields: "Designed, built, and shipped in five days on Astro plus Cloudflare Workers."
5. **Hero visual.** Recording or screenshot of the live site (captured post-launch via Tella.tv or ScreenToGif).
6. **The problem.** Prose section (~150 words).
7. **What I built.** Prose section (~300 words) with embedded decision blocks (see below) and the embedded `HeroCopyToggle` interactive demo.
8. **Stack.** Prose intro (~40 words) plus two-column table.
9. **Result.** Prose section (~80 words). Includes Lighthouse screenshot.
10. **Foot navigation.** Back to index plus placeholder for next case study.

### Target length

~1,000 words total body prose. Scannable in one sitting. Scales up for case studies 2-4 once attention is earned.

### Decision blocks

Left-bordered inset boxes. Structure: decision label (Neue Haas small caps) plus body text plus optional artifact image on the right. Four decision blocks for case study #1:

1. **Decision: no chromatic accent.** Body: "Tested five accent colors. Cream on navy forced type to carry everything, which was the point. Color would have been a crutch." Artifact: screenshot of the accent color brainstorm comparison.
2. **Decision: foundry type over the v0-default stack.** Body: "Inter, Fraunces, Space Grotesk, Instrument Serif. The AI-generated-site stack. Picked Freight Big Pro, Neue Haas Grotesk, Input Mono from Adobe Fonts instead. Signals human taste, not a template." Artifact: screenshot of the typography brainstorm comparison.
3. **Decision: hero is about this site, not me.** Body: "First draft had a three-verb brand line. It was doing work the work should do. Replaced it with 'The site you're reading is the portfolio.' The hero points at evidence instead of chanting." Artifact: the embedded `HeroCopyToggle` demo. Readers click to swap between the rejected and shipped hero lines.
4. **Decision: Brittany's structure, Rauno's personality.** Body: "Fixed left identity panel keeps things recruiter-scannable. Motion and mono captions carry personality without breaking scanability. Three motions total, one per category: proximity hero, flip-morph navigation, grid rules easter egg." Artifact: screenshot of the landing wireframe.

### Inline interactive demo

The `HeroCopyToggle.tsx` island sits inside decision block #3. Reader clicks a toggle. The site's hero area (rendered as a mini preview inside the decision block) swaps between:

- **Before:** "I design it. I build it. I ship it." (three lines, strikethrough treatment)
- **After:** "The site you're reading is the portfolio." (two lines, cream)

CSS transition on the swap. Pure state, no backend. Cost: ~30 lines of React plus CSS.

### Decision artifacts pipeline

Each decision artifact is a PNG screenshot, stored at `public/assets/decisions/`. Generation:

1. The brainstorm mockup HTML files live at `.superpowers/brainstorm/1795-1776776197/content/*.html`. These are the source.
2. Before implementation, capture each to PNG using Edge headless (already validated in brainstorm session): `msedge --headless --screenshot=<out.png> --window-size=1280,1400 file:///<path>/accent-color.html`.
3. Output: `accent-color.png`, `typography.png`, `hero-before-after.png`, `landing-layout.png`.
4. Reference in `portfolio.md` frontmatter or inline markdown.

## Contact form implementation

### Endpoint: `POST /api/contact`

- Runs as Cloudflare Worker via Astro's Cloudflare adapter
- Request body (JSON): `{ name, email, message, turnstileToken }`
- Server-side steps:
  1. Validate body shape with zod. Reject 400 on malformed.
  2. Validate Turnstile token via POST to `https://challenges.cloudflare.com/turnstile/v0/siteverify` with `TURNSTILE_SECRET_KEY`. Reject 403 on fail.
  3. Compose outbound email: subject `Contact form. {name}`, body plaintext.
  4. Send via Cloudflare Email Routing: POST to Worker's bound email sender, or forward via `MAILGUN`-like alternative if Email Routing doesn't support outbound sends programmatically. Flag: verify this during implementation. Cloudflare Email Routing historically supports *inbound* routing. For outbound-from-worker, we may need Cloudflare Email Workers or a SMTP binding.
  5. Return 200 JSON `{ ok: true }` on success, 500 on outbound send failure.

### Environment variables

Secrets (set via Cloudflare dashboard, never in `wrangler.jsonc`):
- `TURNSTILE_SECRET_KEY`
- Outbound email credentials (TBD based on implementation path above)

Vars (can live in `wrangler.jsonc`):
- `TURNSTILE_SITE_KEY` (public, used client-side in `ContactForm.tsx`)
- `CONTACT_DESTINATION` (email to forward to, e.g., `hi@mariaangelika.com`)
- `ENVIRONMENT`

### Client-side (`ContactForm.tsx`)

- Controlled form with `useState` for fields plus status
- Turnstile widget rendered via script tag in `BaseLayout`'s `<head>` (`https://challenges.cloudflare.com/turnstile/v0/api.js`), callback stores token
- On submit: POST to `/api/contact` as JSON, handle 200/400/403/500 with distinct messages
- Success: replace form with cream Neue Haas confirmation
- Error: inline error above submit, preserve field values

### Domain plus DNS

- `mariaangelika.com` already registered on Cloudflare Registrar
- Worker deployed, custom domain added via Workers dashboard
- Email Routing: destination address configured, rule for `hi@mariaangelika.com` to Angel's inbox

## Deploy strategy

- GitHub repo connected to Cloudflare (Workers & Pages, Import Git repository, Astro framework)
- `main` branch auto-deploys to production (mariaangelika.com)
- PRs get preview URLs
- Build command: `npm run build`
- Build output: `dist/`
- Node version: 20+

## Voice

See `C:\Users\Angel\.claude\projects\D--2026-Workspace-portfolio\memory\project_portfolio_voice.md` for full rules. Every string that ships (case study prose, nav labels, error messages, form placeholders, meta descriptions, OG descriptions) passes the voice test: first-person, declarative, technical without academic distance, no banned words.

## Out of scope for v1 (explicit deferral list)

Tracked here so nothing is accidentally omitted from v1.1 planning:

- `/about` page. Deferred until v1.2 or later.
- AI chat widget (Claude API via Worker binding). Deferred indefinitely. Reconsider after v1 ships.
- Case studies 2, 3, 4 (phishing sim, AI micro-tool, n8n pipeline). Each gets its own v1.1+ cycle.
- Cursor-preview on work list hover. Deferred to v1.1 when case study #2 lands. Needs 2+ items to be worthwhile.
- `/experiments` or `/ui` index page. Deferred to v2.
- Writing / blog. Deferred indefinitely.
- Self-hosted fonts. Deferred. Adobe Fonts CDN is the v1 path.
- Dark/light theme toggle. Out of scope. Dark is the only mode.
- Internationalization. Out of scope.
- Analytics. Out of scope for v1. Reconsider once the site is live.

## Success criteria

v1 ships successfully if and only if:

1. `https://mariaangelika.com` loads landing page with all sections rendered
2. Lighthouse mobile scores: Performance ≥95, Accessibility ≥95, Best Practices ≥95, SEO ≥95
3. Case study page `/work/portfolio` loads with all four decision blocks, embedded `HeroCopyToggle` demo, and full ~1,000-word body prose
4. Contact form successfully submits an email to Angel's inbox when filled correctly
5. Turnstile rejects automated submission attempts
6. Site loads correctly on mobile (390px width minimum)
7. HTML source easter egg is present in rendered output
8. No console errors in browser DevTools on any page
9. View-source check: fonts load from Adobe Fonts CDN (not local). No Google Fonts references anywhere.
10. Deploy is wired to GitHub to Cloudflare auto-build on `main`
11. Proximity hero motion is active on desktop and responds to cursor movement smoothly (60fps, no jank)
12. Flip-morph nav-to-title transition plays when navigating from landing to case study
13. Grid Rules easter egg toggles on/off via the panel `+` cross and reveals guide lines on tagged elements

## Open questions and flags for implementation

- **Freight Big Pro variable weight availability.** The proximity hero motion works best with a variable-weight version of Freight Big Pro on Adobe Fonts. Verify at activation time. If only static weights ship, implement the opacity-layered cross-fade fallback (Book and Medium cross-fade per glyph).
- **View Transitions API support.** The flip-morph relies on View Transitions plus GSAP Flip. Safari support has been inconsistent. Ensure GSAP Flip fallback triggers for browsers that skip the View Transition.
- **Email Routing outbound send path.** Cloudflare Email Routing is primarily for inbound. Outbound-from-Worker may need Email Workers (Cloudflare's newer outbound API, if available in 2026) or a lightweight SMTP service (Resend's own API, Postmark, or similar). Resolve during implementation. Fallback is Resend's free tier which is easiest.
- **Adobe Fonts project setup.** Angel needs to add `mariaangelika.com` to the Adobe Fonts web project and activate Freight Big Pro (variable if available, static weights otherwise), Neue Haas Grotesk Display/Text, Input Mono before the site goes live. If any font is unavailable at activation time, the substitution is: Neue Haas Grotesk fallback per Q5 (already decided). Others block launch.
- **Hero recording tool.** Tella.tv recommended for capturing the live-site recording for case study #1's hero visual. Done post-launch, not a build blocker.
- **Self-host rule in STACK.md.** Currently reads "Self-host all fonts (no Google Fonts CDN). Put in public/fonts/." This conflicts with Adobe Fonts CDN. Update STACK.md to reflect the v1 choice (Adobe Fonts CDN) before implementation.
- **GitHub handle:** `mariaangelikabuilds`. Currently empty. Repo for this project will be created at `github.com/mariaangelikabuilds/portfolio` during the scaffold phase of implementation.

---

## Change log

- **2026-04-21.** Initial design spec created from brainstorm session.
- **2026-04-21.** Revised for voice: removed em dashes and AI tics per CLAUDE.md rule.
- **2026-04-21.** Revised for AI-smell: dropped cursor gradient, mount staggers, 01/02 section labels, circle-dot availability badge, three-field mono meta strip. Committed to three-motion system: proximity hero variable font weight, flip-morph nav-to-title, grid rules easter egg.

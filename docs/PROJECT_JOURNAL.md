# mariaangelika.com — Project Journal

Running record of decisions, rejections, research, and direction changes. Updated at end of every session and after any real decision. Future sessions read this first to pick up context.

Newest entries at the top.

---

## 2026-04-21. Session 1d: Phases 3 through 12 complete (v1 code-complete)

Rolled through eleven plan tasks in one pass. Entire v1 codebase is now in place; only Cloudflare deploy remains blocked on secrets.

### Completed
- **Task 11.** `src/pages/index.astro` rewritten with hero, Selected Work (pulled from `getCollection`), Contact section shell, FooterEcho. `src/components/WorkPreview.astro` card component with `transition:name` for Motion 2. All sections marked `data-rules` for Motion 3. Uses Astro 6 API `entry.data.slug`. Commit: `c859080`.
- **Tasks 12, 13.** `src/pages/work/[slug].astro` case study route with `export const prerender = true` (bakes to static HTML in Worker bundle). `src/components/DecisionBlock.astro` inset component with optional image or named slot. Astro 6 API `render(entry)` imported from `astro:content`. Commit: `8d027aa`.
- **Task 14 (Motion 1).** `src/components/hero-logic.ts` with pure `calcGlyphWeight` linear-interp function. `tests/hero.test.ts` with 3 Vitest cases (all pass). `src/components/Hero.tsx` React island using rAF loop to write `fontVariationSettings` per glyph based on cursor distance. Wired into `index.astro` with `client:load` for both hero lines. Added vitest devDep and `test` / `test:watch` scripts. Commit: `d9b9bfd`.
- **Tasks 15, 16 (Motion 2).** `ClientRouter` mounted in `BaseLayout` head to activate View Transitions. `src/scripts/flip-fallback.ts` using GSAP Flip captures source rect on click to `/work/*`, replays from sessionStorage on next page for browsers without `startViewTransition`. Commit: `5cc8eb7`.
- **Task 17 (Motion 3).** `src/components/GridRulesToggle.tsx` island listens on `#grid-rules-toggle` button, overlays `[data-rules]` elements with outlines + mono dimension labels. Mounted `client:load` in `BaseLayout`. Commit: `4f955a4`.
- **Task 18.** `src/components/HeroCopyToggle.tsx` A/B demo component. Commit: `28e7b0e`.
- **Tasks 19, 20.** `src/components/ContactForm.tsx` client:visible island with Turnstile widget + fetch POST. `src/pages/api/contact.ts` SSR endpoint (`prerender = false`) with zod validation, Turnstile siteverify, Resend outbound. `src/pages/api/contact-schema.ts` + 4 Vitest cases (all pass). Turnstile api.js loaded async in BaseLayout. Reads env via `locals.runtime.env` with `process.env` fallback. Installed `resend`. Commit: `33d535f`.
- **Task 21.** Converted `portfolio.md` to `portfolio.mdx`. Installed `@astrojs/mdx`, updated `astro.config.mjs` integrations and `content.config.ts` glob to `**/*.{md,mdx}`. Prose: problem, what I built, 4 `<DecisionBlock>` components (no chromatic accent, foundry type, hero about the site, Brittany's structure), stack table, result. Decision #3 embeds `<HeroCopyToggle client:visible />` inline. Commit: `b048e40`.
- **Task 22.** `scripts/capture-decision-artifacts.sh` Edge headless capture script. Three PNGs in `public/assets/decisions/`: accent-color, typography, landing-layout. Referenced by DecisionBlocks in MDX. Commit: `c3a6c6d`.

### Plan deviations and fixes this session

- **Astro 6 content API corrections.** As flagged in session 1c: `entry.render()` replaced with `render(entry)` imported from `astro:content`; `entry.slug` replaced with `entry.data.slug`. Applied to Task 11 (WorkPreview) and Task 12 (case study route).
- **Prerender flag needed on dynamic route.** `getStaticPaths()` was getting ignored in SSR mode. Added `export const prerender = true` to `/work/[slug].astro` so it bakes to static HTML at build time. `/api/contact` has `prerender = false` to stay SSR.
- **MDX chosen over inline createRoot mount.** Plan flagged two options for mounting `HeroCopyToggle` inside the case study markdown. Took the MDX path for clean inline imports. Added `@astrojs/mdx` integration.
- **Edge headless capture broken twice before working.**
  1. First run: produced two identical PNGs (accent-color and typography had same SHA). Added unique `--user-data-dir` per call. Still identical.
  2. Second run: inspected a PNG, it was "ERR_FILE_NOT_FOUND". The MinGW `/d/...` path in `file://` URLs doesn't resolve on native Windows Edge. Fixed with `cygpath -m` conversion to `D:/...` format.
- **CSS added beyond plan.** Plan omitted CSS rules for the Hero-island-generated `.hero-mount`, `.hero-line-mount`, `.hero-word` spans. Without `display: block` on line-mount and `display: inline-block` on word, per-glyph spans would collide. Added to `index.astro` `<style>` block.
- **Stack label updated.** Case study MDX frontmatter says `Astro 6` (scaffold is actually 6.1.8), not the plan's `Astro 5`. Truth for recruiters.

### Current state at end of session 1d
- 23 commits on main, all pushed to `github.com/mariaangelikabuilds/portfolio`
- `npx astro build` passes clean (prerenders `/work/portfolio/index.html`)
- `npm test` passes 7/7 (3 hero-logic + 4 contact-schema)
- Three React islands hydrating on the landing: `Hero` x2 (client:load), `ContactForm` (client:visible), `GridRulesToggle` (client:load via BaseLayout), plus `HeroCopyToggle` (client:visible inside case study MDX)
- All artifact PNGs captured and committed
- `.env` still has empty `PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`, `RESEND_API_KEY` — blocks real form submissions and Task 24 deploy

### What blocks v1 launch
1. Angel needs to create Turnstile widget in Cloudflare dashboard → get site key + secret → fill `.env`.
2. Angel needs Resend account + verified `mariaangelika.com` sending domain → get API key → fill `.env`.
3. Angel runs `wrangler secret put` for each secret, then `wrangler deploy` (or via dashboard GitHub auto-deploy).
4. Angel attaches custom domain `mariaangelika.com` in Cloudflare Workers dashboard.

### Tasks deferred (pending browser verification or Angel action)
- **Task 23:** mobile polish pass — needs Angel's eye on iPhone/iPad breakpoints in DevTools device mode.
- **Task 24:** Cloudflare deploy — blocked on secrets above.
- **Tasks 25-27:** Lighthouse run, cross-browser check, tag v1.0, final journal entry. Post-deploy work.

### What to check in the browser on pickup
- `http://localhost:4321/` — Motion 1 (cursor-responsive hero weight), work card → case study navigation, Motion 3 (`+` button toggles grid rules overlay), contact form renders (won't submit — empty site key).
- `http://localhost:4321/work/portfolio` — case study prose, 4 decision blocks with PNG artifacts, HeroCopyToggle A/B demo inline.

---

## 2026-04-21. Session 1c: Phase 2 complete (layout shell)

All five Phase 2 tasks done. Layout shell components built and mounted on landing scaffold. Pushed to origin.

### Completed
- **Task 6:** `src/styles/global.css` created with design tokens (palette, fonts, layout, motion). `src/layouts/BaseLayout.astro` created with title/description props, Adobe Fonts `<link>` loaded from `PUBLIC_ADOBE_FONTS_URL` env var, HTML source easter egg comment, `<slot />`. `src/pages/index.astro` rewritten as minimal placeholder using BaseLayout. Commit: `df009dd`.
- **Task 7:** Content collection schema created with zod validation for the work collection. `portfolio.md` stub with full frontmatter, placeholder body. Commit: `6ef7e12`.
- **Task 8:** `src/components/LeftPanel.astro` — fixed identity panel, 38% width desktop, hidden on mobile. Contains name, bio sentence, nav (Work + Contact with active state, or Index when showBackLink is true), CTA triplet with three linked sentences, socials sentence, `+` grid-rules-toggle button. Commit: `7bb44d9`.
- **Task 9:** `src/components/MobileHeader.astro` — sticky top bar with MA monogram and Menu button. Slide-down overlay with Work/Contact/bio/socials. Vanilla JS script toggles aria-hidden on click. Shown only below 1024px. Commit: `8ec219a`.
- **Task 10:** `src/components/FooterEcho.astro` — 1px cream divider, 24px Freight Big Pro echo line ("The site you just read was the portfolio."), 10px Input Mono stack signal line. Max width 640px. Commit: `00b04cd`.
- **Post-task fix:** Replaced JSX-style `{' '}` whitespace with natural HTML spaces in LeftPanel and MobileHeader (subagent flagged Astro may render those as literal text). Safer approach. Commit: `482a203`.

### Plan deviations (important for downstream tasks)

- **Astro 6 content collections API change.** The plan used the legacy `src/content/config.ts + type: 'content'` pattern. Astro 6 removed that. New pattern:
  - Config moved to `src/content.config.ts` (root of src, not inside content/)
  - Uses `glob` loader from `astro/loaders` with pattern and base path
  - Downstream API changes:
    - `entry.render()` → `render(entry)` (import `render` from `astro:content`)
    - `entry.slug` → `entry.id` or `entry.data.slug` (file stem is the ID)
    - `getCollection('work')` unchanged
  - **Affects Task 11** (landing page consumes collection for Selected Work) **and Task 12** (case study dynamic route calls `render`). Both task prompts must inject the corrected API.

### Adobe Fonts live
- Project ID: `aef3aiw`
- URL: `https://use.typekit.net/aef3aiw.css`
- Activated fonts: Freight Big Pro, Neue Haas Grotesk Display, Neue Haas Grotesk Text, Input Mono (assumed — URL returns 200, actual font availability verified at browser render time in Task 11+)
- `.env` stored at project root, gitignored, contains `PUBLIC_ADOBE_FONTS_URL` and empty placeholders for TURNSTILE/RESEND keys

### Current state at end of Phase 2
- 12 commits on main, all pushed
- Build passes clean
- All layout shell components built and mounted in temporary landing scaffold
- Ready for Phase 3: Task 11 (composing the real landing page with Hero + Selected Work + Contact sections, replacing the placeholder scaffold)

### Next session entry points
- **Task 11 (landing page composition):** Must use Astro 6 content collection API — `getCollection('work')` is fine but entry has `.id` not `.slug`, and `render(entry)` replaces `entry.render()`. Update Task 11 prompt when dispatching.
- **Task 12 (case study dynamic route):** Same API note as Task 11. Also: `getStaticPaths` pattern unchanged, but `params.slug` now comes from `entry.id` or `entry.data.slug`.
- **Angel prep for Phase 3 (optional):** If you want the site auto-deploying on every push before Phase 3 work, connect the GitHub repo to Cloudflare in the dashboard: Workers & Pages → Import a Repository → select `mariaangelikabuilds/portfolio` → Framework: Astro → Build: `npm run build` → Build output: `dist`. That's a 2-minute setup.

---

## 2026-04-21. Session 1b: Phase 1 implementation (scaffold and repo)

Same-day continuation. Executed Phase 1 of the implementation plan via subagent-driven development. Five tasks done, four commits, repo live.

### Completed
- **Task 1:** Astro 6.1.8 minimal template scaffolded with TypeScript strict. Preserved existing CLAUDE.md + docs/. Commit: `f3ace2f chore: scaffold Astro minimal template`.
- **Task 2:** Integrations installed: `@astrojs/cloudflare` 13.1.10, `@astrojs/react` 5.0.3, `@tailwindcss/vite` 4.2.4 + `tailwindcss` 4.0.0, `gsap` 3.15.0, `zod` 4.3.6. `astro.config.mjs` configured with all three integrations plus Tailwind Vite plugin. Commit: `bf8de26 chore: add cloudflare, react, tailwind v4 integrations`.
- **Task 3:** `wrangler.jsonc` configured with ENVIRONMENT, TURNSTILE_SITE_KEY (empty placeholder), CONTACT_DESTINATION vars. `package.json` scripts gained `preview` (astro build + wrangler dev) and `deploy` (astro build + wrangler deploy). Commit: `e917687 chore: configure wrangler vars and add preview/deploy scripts`.
- **Task 4:** `.gitignore` expanded with `.dev.vars`, `.env.local`, `.env.production`. `public/.assetsignore` created with `_worker.js` and `_routes.json`. Commit: `528e191 chore: configure gitignore and cloudflare assets ignore`.
- **Task 5:** GitHub repo created at https://github.com/mariaangelikabuilds/portfolio (public). All four commits pushed to origin/main.

### Plan deviations noted
- Plan referenced Astro 5; actual is Astro 6.1.8 (current stable April 2026). No functional impact — all referenced APIs work identically.
- Plan expected `nodejs_compat` compatibility flag. Cloudflare adapter defaulted to `global_fetch_strictly_public` instead (newer, stricter flag). Preserved adapter's choice.
- Plan expected `dist/_worker.js/index.js` as Worker entry. Astro 6 adapter uses package-resolved path `@astrojs/cloudflare/entrypoints/server` with `dist/client/` + `dist/server/` output structure. Preserved adapter's layout.
- Plan listed `astro preview` as default preview script. Upgraded to `astro build && wrangler dev` so local preview uses real workerd runtime (matches production).

### Flagged for later
- Cloudflare adapter flagged implicit `IMAGES` and `SESSION` bindings it expects at runtime. Not used by v1 (no Cloudflare Images, no KV sessions). If build warnings surface during deploy, add `disableImagesService: true` to adapter config.
- Node engine requirement in `package.json` is `>=22.12.0` (Astro 6 default). Fine for current machine and Cloudflare's build runners.

### Next session (Phase 2 onward)
Human gate before Phase 2: Angel must activate fonts in Adobe Fonts before design tokens and base layout can be built.

**Angel's prep for session 2:**
1. Go to fonts.adobe.com → Web Projects → create or edit project for `mariaangelika.com`
2. Activate: Freight Big Pro (all available weights, prefer variable if listed), Neue Haas Grotesk Display, Neue Haas Grotesk Text, Input Mono
3. Copy the `use.typekit.net/[project-id].css` URL from the embed code
4. Open a terminal in `D:\2026 Workspace\portfolio` and create `.env` with:
   ```
   PUBLIC_ADOBE_FONTS_URL=https://use.typekit.net/[project-id].css
   ```
5. Paste the spec + plan + journal references into a fresh Claude Code session and say "Phase 2 ready." Claude picks up from Task 6.

Current repo state: scaffolded project on GitHub, build passes, no site content yet.

---

## 2026-04-21. Session 1: brainstorm to design spec

### Context at session start

Project existed only as docs (no code yet): `CLAUDE.md`, `docs/STACK.md`, `docs/REFERENCES.md`, `docs/CLOUDFLARE.md`. Domain `mariaangelika.com` registered on Cloudflare. Deploy target: Cloudflare Workers via `@astrojs/cloudflare`. Open threads documented: accent color, case study content, AI widget scope, interactive element.

### Session goal

Go from docs-only to a locked design spec ready for implementation planning. Outcome: `docs/superpowers/specs/2026-04-21-portfolio-v1-design.md`.

### Session arc

Ran the `superpowers:brainstorming` skill. Visual companion started in `.superpowers/brainstorm/` (gitignored). Worked through six clarifying questions, five design sections, two research dispatches, and four rounds of tweaks before locking the spec.

### Six locked clarifying decisions

| # | Question | Decision | Why |
|---|---|---|---|
| 1 | v1 scope | Landing + 1 self-referential case study + contact form. Ships in ~5 days. | Contract ends 2026-05-15. Job hunt needs live URL on resume this week. |
| 2 | Hero interactive element | Kinetic hero typography plus ambient cursor gradient | "One bold interactive element" from docs. Kinetic plus ambient gives hero energy without competing. |
| 3 | Case study #1 angle | Pure design-engineering process. No pivot framing. | "Security to DE pivot" framing would make recruiters read every choice through a career-changer lens. The case study IS the evidence. |
| 4 | Accent color | No chromatic accent. Cream off-white (#f5e6c8) on deep navy (#0a192f). | Type does all the work. 2026 power move. Differentiator from Brittany-clone slate plus cyan saturation. |
| 5 | Typography | Freight Big Pro plus Neue Haas Grotesk Display/Text plus Input Mono (Adobe Fonts) | Rejected AI-default stack (Inter, Fraunces, Space Grotesk, Instrument Serif). Foundry fonts signal human taste. |
| 6 | Contact form scope | Real Cloudflare Worker plus Turnstile plus Email Routing | The form itself becomes evidence for case study #1. Not a mailto. |

### Hero copy. Three iterations.

1. **Draft:** "I design it. I build it. I ship it." Rejected. Reads as corny motivational-poster chant. Fine as a brand line (LinkedIn, email sig), wrong as hero H1.
2. **Second attempt:** "Currently. Shipping tiered phishing simulations while building this site." Rejected. Signals busy/unavailable, shoos recruiters.
3. **Locked:** "Design Engineer. The site you're reading is the portfolio." Meta self-reference that ties hero to case study #1's thesis. Distinctive. No other DE portfolio uses this move.

### Voice. Locked and saved to memory.

Techy-professional but approachable. First-person declarative, technically precise without academic distance, contractions fine, zero buzzwords, zero casual tics. Full rules saved to `memory/project_portfolio_voice.md`. Applies to every string on the site.

### Five design sections presented and approved

1. **Architecture plus content model.** Astro plus React islands. Content collections with zod schema. `category` enum supports `case-study`, `experiment`, `writing`. Landing page flat-renders when one category has content, auto-groups when multiple do.
2. **Landing page layout.** Fixed left identity panel (38% desktop) plus scrolling right column. Hero, then Selected Work, then Contact, then Footer echo. Mobile stacks single-column.
3. **Case study page.** Same fixed left panel (identity anchor). Right column at 640px max prose width (Mariana essay rhythm). Decision blocks and stack tables break out full-width. Four decision blocks. Embedded A/B hero-copy toggle as inline interactive demo.
4. **Contact form implementation.** POST `/api/contact` endpoint. Zod-validated body, then Turnstile verify, then outbound email via Email Routing. Flagged: outbound path TBD at implementation.
5. **Deploy.** GitHub to Cloudflare auto-build on `main`. Custom domain attached. Secrets in Cloudflare dashboard.

### Final tweaks adopted from portfolio research

| Tweak | Source | Status |
|---|---|---|
| Verb-triplet CTA: `Fork the code · Send a note · Read the case study` | Thomas Paul Mann pattern | Adopted v1 |
| Stack signal footer plus HTML source ASCII comment easter egg | Research recommendation | Adopted v1 |
| Case study prose column narrowed to ~640px | Mariana Castilho pattern | Adopted v1 |
| Inline A/B hero-copy toggle demo in case study | Maxime Heckel inline-demo pattern | Adopted v1 |
| Footer echo: "The site you just read was the portfolio." | Bryce Wilner structural repetition | Adopted v1 |
| Cursor-preview on work hover | Mariana pattern | Deferred to v1.1. Needs 2+ items to be worthwhile. |
| Triple-descriptor opening ("Designer. Engineer. Shipper.") | Steven Tey pattern | Rejected. Reintroduces the chant pattern already killed. |

### Research dispatched during session

1. **Adobe Fonts pairings outside the AI-default stack.** Surfaced Freight Big, Publico, Canela, Neue Haas Grotesk, National 2, Aktiv Grotesk as candidates. Final: Freight Big Pro plus Neue Haas Grotesk plus Input Mono after Angel verified availability in her Adobe Fonts library.
2. **Open Design Engineer jobs.** 10 roles prioritized. Top matches: Resend, Peec AI, Framer. LinkedIn profile could not be fetched (999/anti-bot). Positioning diagnosis deferred until Angel pastes current headline/About.
3. **Best-in-class DE portfolios (round 1).** Rauno, Emil, Paco, Brittany, Lee, Mariana, Thomas. Mariana identified as closest aesthetic sibling (structural). Thomas as copy reference.
4. **Best-in-class DE portfolios (round 2, deeper).** Bryce Wilner (type-native), Maxime Heckel (inline-demo essays), Shu Ding (restraint), Anthony Fu (Tokyo-based). Maxime identified as the closest 2026 aesthetic sibling the first pass missed.

### Incidents worth remembering

- **"AI shipped shit" moment.** After several rounds of increasingly elaborate case study mockups with CSS-recreated mini-artifacts, Angel flagged the preview as looking AI-generated. Root cause: brainstorm viewer uses system fallback fonts (Georgia, -apple-system). CSS mini-mockups read as template-art regardless of tuning. Lesson saved to `memory/feedback_stop_iterating_mockups_past_decisions.md`: stop iterating once decisions are locked. Skip to real code with Adobe Fonts activated.
- **"Are you sure?" challenge.** Early on, recommended a hedged hybrid option (B's spine plus C's intro for case study angle). Angel caught the hedge. Committed to pure B and saved lesson to `memory/feedback_no_hedging.md`: never recommend a "safe middle" labeled as recommended. Commit to the best option with reasoning and trust the user to push back.
- **AI-default font rejection.** Proposed Instrument Serif plus Inter plus Fraunces plus Space Grotesk. Angel caught the stack as "fonts most commonly used with websites built in AI." Saved to `memory/feedback_avoid_ai_default_fonts.md`: skip Google Fonts CDN trendy stack. Use foundry fonts (Pangram, Klim, Grilli, Dinamo, Commercial Type, Monotype).
- **Identity question.** Mid-session, Angel asked: "Am I really a design engineer? Or just someone that vibe codes with a UX UI background?" Answered honestly: yes, by the 2026 definition (taste plus judgment plus ships plus knows when output is wrong). The tools don't define the role. Output and judgment do. Bars to deliberately train on: debug without AI, defend architectural choices in interviews, read code others wrote.

### Memories created this session

All live in `C:\Users\Angel\.claude\projects\D--2026-Workspace-portfolio\memory\`:

- `feedback_no_hedging.md`. Commit to the best option with reasoning. No "safe hybrid" picks labeled as recommended.
- `feedback_avoid_ai_default_fonts.md`. Skip the Inter/Geist/Space Grotesk/Fraunces/Instrument Serif/JetBrains Mono cluster.
- `project_portfolio_voice.md`. First-person declarative, technical precise, banned-word list.
- `feedback_stop_iterating_mockups_past_decisions.md`. CSS recreations in fallback fonts always read as AI-generated. Lock and move to real code.

### Artifacts generated this session

- `docs/superpowers/specs/2026-04-21-portfolio-v1-design.md`. The locked design spec.
- Brainstorm mockup HTML files at `.superpowers/brainstorm/1795-1776776197/content/`:
  - `accent-color.html`. 5-swatch comparison (basis for decision artifact).
  - `typography.html`. 4-pairing comparison (basis for decision artifact).
  - `landing-layout.html`. Desktop plus mobile wireframe.
  - `case-study-layout.html`. Case study page wireframe.
  - `case-study-voice-v2.html`. Case study with revised voice.
  - `case-study-voice-v3-with-artifacts.html`. The "AI shipped shit" version. Reference for what NOT to do.
  - `hero-before-after.html`. Rejected vs shipped hero (basis for A/B toggle demo).
- One successful Edge headless screenshot test: `screenshots/accent-test.png`. Proof-of-concept for decision-artifact PNG generation.

### What's next (session 2)

1. Angel reviews the spec at `docs/superpowers/specs/2026-04-21-portfolio-v1-design.md`, flags anything she wants changed.
2. Update `docs/STACK.md` self-host rule to reflect Adobe Fonts CDN decision.
3. Invoke `superpowers:writing-plans` skill to produce the implementation plan from the spec.
4. Capture decision artifact PNGs from the brainstorm HTMLs (Edge headless to `public/assets/decisions/`).
5. Begin implementation. First phase: project scaffold (`npm create astro`, integrations, git init).
6. Angel adds `mariaangelika.com` to Adobe Fonts web project and activates Freight Big Pro, Neue Haas Grotesk Display/Text, Input Mono.

### Cross-session notes

- LinkedIn profile could not be auto-fetched. Angel should paste current headline plus About plus featured links at the top of session 2 for positioning rewrite.
- Outbound email path from Worker (Email Routing vs Email Workers vs external service like Resend) needs verification at implementation time.
- Cywareness contract ends 2026-05-15. Portfolio MUST be live plus on resume before that date.
- GitHub handle: `mariaangelikabuilds`. Currently empty. Repo for this project will be created at `github.com/mariaangelikabuilds/portfolio` during implementation scaffold phase.

### Post-spec revisions (same session, later in day)

After the spec was initially written, Angel asked for a review of the DESIGN (not the spec doc) for "1% AI smell." This triggered a final round of revisions. All AI-coded patterns identified and dropped:

- Ambient cursor gradient (the Brittany-clone signature now universal to AI-generated portfolios). Dropped.
- Framer-motion `y: 12 → 0, stagger 80ms` hero reveal on mount. Dropped.
- Mono numbered section labels (`01 · Selected Work`, `02 · Contact`). Replaced with editorial Freight Big Pro headings.
- Circle-dot availability badge (`○ OPEN TO ROLES`). Replaced with plain bio sentence: "Design Engineer. Based in the Philippines. Open to new roles."
- Three-field mono meta strip on case study (`ROLE · STACK · TIME`). Replaced with Neue Haas sentence.
- Middle-dot separators (·) between CTA items. Replaced with period-break sentence rhythm.

Then Angel pushed back on the motion proposals as "options out there but you just haven't found them." Ran a dedicated deep research pass on distinctive motion patterns from 2025-2026. Surfaced Exat microsite's proximity-responsive variable font weight, Spitzer's flip-morph nav-to-title, Bernadou's grid rules easter egg. Angel committed to all three.

**Final motion system (three motions total):**

1. **Proximity-responsive hero typography** (always-on, landing only). Cursor distance modulates each hero glyph's variable font weight. Reference: Exat microsite. Build cost: ~2-3 hours.
2. **Flip-morph nav-to-title** (navigation WOW moment). Work link morphs into case study H1 on navigate. GSAP Flip + Astro View Transitions. Reference: Joffrey Spitzer portfolio. Build cost: ~4-6 hours.
3. **Grid Rules easter egg** (click-triggered). `+` cross in left panel toggles design-grid guide lines visible across tagged elements. Reference: Corentin Bernadou portfolio. Build cost: ~3-4 hours.

Everything else static. No scroll fades. No mount staggers. No gradient blobs.

**Timeline impact:** Original 5-day ship estimate revised to 6-7 days to accommodate the three-motion build. Still fits before 2026-05-15 contract end.

**Spec revised to reflect all of the above.** Change log updated. Session 2 picks up from the locked three-motion spec.

---

## Update protocol

When a decision, rejection, research dispatch, artifact creation, or direction change happens in this project, add a new dated entry at the top of this file. New entries follow the structure above where applicable, or use a shorter format for small updates:

```
## YYYY-MM-DD. Session N: [short title]

Brief context, then bulleted list of: decisions made, decisions rejected, artifacts generated, next steps.
```

Do not delete or rewrite past entries. They are the historical record. Only append.

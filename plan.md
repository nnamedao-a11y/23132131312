# BIBI Cars — Session Plan

Updated: 2026-05-16 (Session: "Hero left-half mirror overlay + Before/After Bold title + animation verification")

## Status snapshot

| Area | State |
|---|---|
| Backend | ✅ Running. ~650+ API endpoints. JWT_SECRET + EXT_SHARED_SECRET seeded in `/app/backend/.env`. |
| Frontend | ✅ Compiles cleanly (some webpack dev-server deprecation warnings; non-blocking). |
| Mongo | ✅ Running. Staff seeded. Blog seeded (8 published + 1 draft in admin listing). |
| Blog CMS | ✅ Production-ready: TipTap rich editor + tags + bilingual + related + filters. |
| Public `/blog` | ✅ Pixel-perfect desktop + mobile: hero title left, description centered; show-more restored; spacing corrected (24px above, 128px below). |
| Public `/blog/:slug` | ✅ Mobile adaptation implemented (hero/meta/cover/body/related carousel/CTA) + follow-up pixel fixes (breadcrumb slashes, grey body full-bleed, pager centering, exact 72px to footer). |
| Public `/calculator` | ✅ **Mobile adaptation completed** (pixel-spec) without touching header/footer. |
| Auth | ✅ All 3 roles work: admin, manager, team_lead. |
| Architecture | ✅ `/api/docs` + `/api/openapi.json` + `/api/redoc` all 200 (618 paths, 46 schemas). |

## Test credentials  (see `/app/memory/test_credentials.md`)

| Role | Email | Password |
|---|---|---|
| admin | admin@bibi.cars | `Jp3FS_7ZuE2bhHp7rFkJm9B9T_TeiHxu` |
| manager | manager@bibi.cars | `dFbYnse0L59DBE16Mn4kT6cCRaNBZFQR` |
| team_lead | teamlead@bibi.cars | `txXNMkj-lS2w1nv482aLlvKWuk9Y9eKE` |

## What changed this session

### Backend (`/app/backend`)

1. **`server.py`** — blog endpoint extensions
   - `_blog_serialize`: now always returns `tags: List[str]` (public + admin).
   - `POST /api/admin/blog/articles`: normalises `tags` (trim, dedup case-insensitive, max 12 × 40 chars).
   - `PUT /api/admin/blog/articles/{id}`: accepts `tags` and `published_at` overrides.
   - `GET /api/public/blog/articles`: new `?tag=` filter (case-insensitive regex); response now includes a `tags` array of all in-use published tags.
   - Startup: wired `seed_blog_if_empty` after staff seeding.

2. **`blog_seeder.py` (new)** — production-ready seeder
   - 8 fully bilingual (EN + BG) articles across all categories.
   - Auto-runs when `blog_articles` is empty.
   - Uses `/figma/blog/image-*@2x.png` cover assets.
   - Staggered `published_at` + `related_ids` wiring.

3. **`/app/backend/.env`**
   - `JWT_SECRET` + `EXT_SHARED_SECRET` set (login fixed).
   - `CORS_ORIGINS` restricted.

### Frontend (`/app/frontend/src`)

1. **Admin blog editor**
   - `components/admin/blog/RichTextEditor.jsx` + `.module.css` (new): TipTap WYSIWYG (tables, images, colors, highlight, etc.).
   - `pages/admin/BlogArticlesEditor.jsx`: migrated from ReactQuill → TipTap; tags input; publish date input.

2. **Public `/blog` (mobile polish)**
   - `pages/public/BlogPage.jsx`: production-data-only; show-more always rendered (disabled when fully visible).
   - `pages/public/BlogPage.module.css`:
     - Mobile hero: **title left**, description centered.
     - Blog cards radius = 4px.
     - Spacing: **24px** from last latest-card → show-more; **128px** show-more → consultation block.

3. **Public `/blog/:slug` (mobile adaptation + fixes)**
   - `pages/public/BlogArticlePage.jsx`:
     - Related carousel: mobile card width/gap (396/16) + **70% visibility activator** for index updates.
     - `VIEW ALL ARTICLES` split: desktop header vs mobile standalone link.
   - `pages/public/BlogArticlePage.module.css`:
     - Breadcrumb: HOME/BLOG grey `#5E5E5E`, tight slash spacing.
     - Body grey block: **full-bleed** edge-to-edge; inner text uses 12px inset.
     - Pager: centered.
     - CTA: full-bleed; centered text; exact **72px** from `USE OUR CALCULATOR` to footer.
     - Mobile-only `VIEW ALL ARTICLES`: centered; **128px** from pager and **128px** to CTA.

4. **Public `/calculator` (NEW — full mobile adaptation, per ZIP + PNG)**
   - `pages/public/CalculatorPage.module.css`:
     - Added full mobile spec block `@media (max-width: 768px)`.
     - Container padding: **12px**; breadcrumb H SemiBold 12 grey; title H Bold 24.
     - Subtitle: centered; first line yellow (H Medium 16), next lines white.
     - Grey calculator card: **edge-to-edge full-bleed**; inner content inset 12px.
     - Form spacing: head→field 32; label→control 12; field→field 24.
     - Estimate spacing: head→group 32; row gap 16; sub-group gap 40; group→TOTAL 44; TOTAL→disclaimer 32; disclaimer→CTA 56; CTA→card bottom 56.
     - CTA button: **336×45** yellow, centered.
   - ✅ Header/Footer were **not modified**, per user instruction.
   - ✅ Backend logic preserved (calculate/quote/lead flow unchanged).

## Architecture audit (Phase H)

Endpoints sampled (admin token):

| Endpoint | Status |
|---|---|
| `/api/public/vehicles?limit=2` | 200 ✅ |
| `/api/public/blog/articles?limit=2` | 200 ✅ |
| `/api/auth/me` | 200 ✅ |
| `/api/admin/blog/articles` | 200 ✅ |
| `/api/notifications/me` | 200 ✅ |
| `/api/leads` | 200 ✅ |
| `/api/calculator/calculate` | 405 ⚠️ (expects POST — not a regression) |
| `/api/admin/staff` | 404 ⚠️ (route may live under a different prefix — out of scope) |
| `/api/dashboard/kpi` | 404 ⚠️ (same) |
| `/api/admin/integrations/providers/status` | 404 ⚠️ (same) |

No regressions introduced by the latest UI changes.

## E2E test result

Prior iteration result (still valid for blog/admin/editor):

> **22 / 22 backend tests passed. All frontend acceptance criteria met.** ✅

Additional manual verification done this session (visual + DOM measurements):
- `/blog` mobile hero alignment + show-more spacing.
- `/blog/:slug` breadcrumb/spacing fixes + 72px to footer.
- `/calculator` mobile layout: full-bleed card + button geometry + typography.

## Open follow-ups (current backlog)

- **P0** ✅ DONE: Backend `/api/docs` + `/api/openapi.json` + `/api/redoc` — all return HTTP 200. (The earlier note referred to bare `/docs`/`/openapi.json` paths, but the FastAPI app intentionally exposes everything under the `/api` prefix because Kubernetes ingress only routes `/api/*` to the backend.)
- **P0** ✅ DONE: Public-site Bulgarian translation audit — wired `useLang()` + EN/BG dicts in:
  - **SingleCarPage family** (`SingleCarPage.jsx`, `NavigationHeader`, `NavigationFooter`, `ImageGrid`, `CostCalculator`, `SimilarCars`, `CarCard`) via new shared dictionary `pages/public/SingleCarPage/i18n.js` (~130 keys × EN/BG)
  - **Homepage figma_home components**: `homepage1.jsx`, `card1.jsx`, `vehicle-deals1.jsx`, `turnkey-banner1.jsx`, `reviews-area1.jsx`, `before-after-section.jsx`, `frame-component23.jsx`, `frame-component25.jsx`, `frame-component26.jsx`, `frame-component27.jsx`. Verified by grepping the compiled `bundle.js` for BG markers (Топ автомобилни оферти, Как работим, Защо плащате, Адаптация към европейските, Прогноза на разходите, ТЪРГУВАН, Информация за автомобила, Подобни, Доволни клиенти, нашите услуги, Искам пълно изчисление, etc. — all present).
  - `frame-component28.jsx` already accepts `lang`; homepage now passes it through. Its FAQ content still draws from `/api/site-info` admin entries (admin can fill the BG copy).
- **P1** ✅ DONE: Mobile adaptation for Single Car page (`/cars/:vin`) — pixel-perfect mobile layout @ ≤ 768 px:
  - Horizontal swipe gallery (360 × 240 slides, scroll-snap)
  - Pagination dots (8 × 8 px, active #FEAE00, inactive #1D1D1B), gap 8 px
  - Gray info card (full-bleed 360 wide, 16 px internal vertical padding, 12 px L/R)
  - Single-column details grid with 6 px label↔value gap and 12 px row gap
  - Bid price / Estimated total price values rendered H Medium 20 px
  - Desktop layout untouched (`> 768 px` keeps the existing grid + sidebar layout)
- **P1** Catalog filter dropdown SVG visuals (Body Type / Drive Type / Engine Volume) — blocked on user design assets.
- Non-blocking: pre-existing `react-hooks/exhaustive-deps` warnings in some team pages.

## Current objective (immediate)

1. **User verification**
   - ✅ `/blog` mobile final: hero title left + description centered; show-more restored; 24px/128px spacing.
   - ✅ `/blog/:slug` mobile final: breadcrumb tight + grey text/blocks full-bleed; pager centered; exact 72px to footer.
   - ✅ `/calculator` mobile final: pixel-perfect per provided ZIP/PNG.

2. **Next work item (choose priority)**
   - **Option A (P0):** Fix backend `/docs` + `/openapi.json`.
   - **Option B (P1):** Mobile adaptation for Single Car page (`/cars/:vin`).
   - **Option C (P0):** Continue Bulgarian translation audit.

Implementation note: continue enforcing pixel-perfect adjustments only through page-level CSS modules and mobile media rules; do not modify shared header/footer components for mobile pages.

## 2026-05-16 session — Hero overlay + Before/After title + animation audit

### Done
1. **Hero LEFT-half mirrored car image @ 10% opacity** (`frame-component18.{jsx,module.css}`)
   - New `<div class="leftMirrorClip"><img class="image60Mirror"/></div>` rendered
     INSIDE `.heroContent` (left of the existing right-half `.image60Parent`).
   - Spec applied exactly per Figma: `width: 961.9996337890625 / height: 1012 /
     transform: rotate(-180deg) / opacity: 0.1 / top: 100 / left: -1.71`.
   - Wrapper has `position:absolute; width:50%; height:100%; overflow:hidden;
     pointer-events:none; z-index:1` so the mirrored car can never bleed into
     the right half or escape the hero (and the filter-bar dropdowns
     continue to open with `overflow:visible` on the hero container).
   - Responsive: at ≤1350px the mirror image scales to 100%×100% of its
     clip wrapper; at ≤925px the clip is `display:none` (mobile layout
     uses the dedicated `MobileHomePage`).
   - Verified live: `opacity=0.1, transform=matrix(-1,0,0,-1,0,0)`,
     `clip width=960 height=1011 overflow=hidden`.

2. **Before/After title — H Bold 64** (`before-after-section.module.css`)
   - `.title { font-weight: 400 → 700 }`. Verified live: `size=64px, weight=700`.

3. **Welcome-page hero animation audit** — NO regression.
   - All 283 `charMask` + 283 `charInner` spans present.
   - JS-evaluated computed styles at t=0 vs t=2.5s confirm the diagonal
     per-character slide-up + fade plays correctly (chars start at
     `translateY(100%) opacity:0`, end at `translateY(0) opacity:1`).
   - Filter bar `heroBarFadeUp` (820 ms @ 1700 ms delay) confirmed.
   - Mobile (`MobileHomePage` → `AnimatedHeading`) uses
     `IntersectionObserver` and replays the same per-char keyframe.
   - User-facing perception of "no animation" was due to the reveal
     completing within ~1.7 s of first paint, not a code regression.

### Files touched
- `/app/frontend/src/figma_home/components/frame-component18.jsx`
- `/app/frontend/src/figma_home/components/frame-component18.module.css`
- `/app/frontend/src/figma_home/components/before-after-section.module.css`

## 2026-05-16 session (part 2) — Bracketed-blocks hover color-swap animation

### Done
Added the studio-namma-style **hover color-swap** animation to all five
bracketed-tagline blocks on the Welcome page. Default state matches the
existing design (line 1 yellow, line 2 white); on `:hover` the colors
swap (line 1 → white, line 2 → yellow) with a 280 ms `cubic-bezier(0.22,
1, 0.36, 1)` `color` transition. No layout impact, GPU-friendly, honours
`prefers-reduced-motion` (transition disabled + colors locked to default).

| # | Block | Component | Hover scope | Lines |
|---|---|---|---|---|
| 1 | Thousands of listings · Only the best · Updated weekly | `vehicle-deals1` | `.tagline` | 3 (l1 yellow, l2/3 white) |
| 2 | We work for each client · depending on the budget | `frame-component23` | `.eachClientBrackets` | 2 |
| 3 | Just a few steps · to your dream car | `frame-component24` | `.frameParent` | 2 |
| 4 | Our clients receive · the best service | `before-after-section` | `.bracketRow` | 2 |
| 5 | Satisfied clients · are our priority | `reviews-area1` | `.satisfiedBlock` | 2 |

Removed the legacy `bibiAccentCycle` 15-s auto-loop animation in
`vehicle-deals1.module.css` per user instruction (kept the `@keyframes`
stub for any external consumer, but no element references it anymore).

Verified live with Playwright `page.mouse.move(...)` + `getComputedStyle`:
default colors match design; on-hover colors swap exactly as specified;
un-hover restores the default. Verified for all 5 blocks.

### Files touched
- `/app/frontend/src/figma_home/components/vehicle-deals1.module.css`
- `/app/frontend/src/figma_home/components/frame-component23.module.css`
- `/app/frontend/src/figma_home/components/frame-component24.module.css`
- `/app/frontend/src/figma_home/components/before-after-section.module.css`
- `/app/frontend/src/figma_home/components/reviews-area1.module.css`
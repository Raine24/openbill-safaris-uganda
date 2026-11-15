# Red Dot Design System — Token-Driven UI & Accessibility Specification

> **Design Intent**: Deliver a structured, tokenized, content-first design system for the Red Dot marketing surface (applied to **Openbill Safaris Uganda**) that guarantees visual consistency, WCAG 2.2 AA accessibility, and rapid implementation across high-density editorial and booking journeys.

---

## 1. Context and Goals

### 1.1 Brand & Surface Context
- **Product / Brand**: Red Dot (`https://www.reddottours.com/`), implemented for **Openbill Safaris Uganda** (`UTB/RTT/TO/2026/102199`).
- **Primary Surface**: High-touch luxury travel and safari marketing site with interactive itinerary discovery, multi-tier mega-navigation, live search overlay, and real-time specialist concierge chat.
- **Target Audience**:
  - **Prospective Travellers & Authenticated Users**: Curating, saving (`wishlist`), and customizing multi-day safari itineraries across Uganda, Rwanda, Tanzania, and Kenya.
  - **Tour Operators & Safari Specialists**: Managing curated route catalogs, responding to live concierge threads, and processing custom quotation requests.
- **Extraction Diagnostics Verification**: Because automated audience and surface inference confidence is low, implementations **must** support both unauthenticated marketing exploration and authenticated/operator-assisted trip-planning workflows (saved shortlist persistence, live consultant handoff, and structured quote capture).

### 1.2 Page Component Density Baseline
All layout, rendering, and bundle budgets **must** account for the verified homepage component density profile:

| Component Family | Verified Instance Count | Primary DOM / Architectural Scope |
| :--- | :---: | :--- |
| **Links** | `291` | Mega-menu destination matrices, trip-type listings, itinerary cards, footer sitemaps |
| **Cards** | `138` | `.card--contained` itineraries, `.homeAccommodation` slides, `.homeNews__item` insights, mega-menu previews |
| **Buttons** | `104` | `.btn` pill triggers, `.tabs__btn`, Swiper navigation controls, search suggestions, wishlist hearts |
| **Lists** | `45` | `.siteHeader__nav`, `.destinationsMega__countries`, `.destinationsMega__links`, `.siteFooter__bottom` |
| **Inputs** | `12` | `#siteSearchInput`, `#newsletterEmail`, `.rd-chat__input`, and bespoke quote modal controls |
| **Navigation Regions** | `5` | Primary desktop header, mobile cascading drawer, destinations mega-menu, inspiration mega-menu, footer nav |

### 1.3 System Goals
1. Every component **must** consume semantic design tokens rather than hardcoded literals.
2. Every interactive element **must** expose deterministic rules across all seven lifecycle states: `default`, `hover`, `focus-visible`, `active`, `disabled`, `loading`, and `error`.
3. Motion and scroll choreography (GSAP ScrollTrigger, Lenis smooth scroll, Swiper creative transitions) **must** respect `prefers-reduced-motion: reduce` without hiding content.
4. Teams **should** prefer system-level token composition over local component overrides.

---

## 2. Design Tokens and Foundations

### 2.1 Typography Tokens
Implementations **must** use the primary neo-grotesque stack for UI controls, navigation, and body copy, paired with editorial display serif and script accents for hierarchy.

| Semantic Token | Value | Usage Rule |
| :--- | :--- | :--- |
| `font.family.primary` | `PPNeueMontreal-Regular` | Primary UI, body copy, navigation, and metadata |
| `font.family.stack` | `PPNeueMontreal-Regular, Helvetica, Arial, sans-serif` | Mandatory fallback stack for all body and UI elements |
| `font.family.display` | `F37Wicklow-Light, Georgia, serif` | Section headings, hero display titles, and pull quotes |
| `font.family.accent` | `SeptemberSpirit, cursive` | Eyebrow callouts (`.font-hand`) paired above display headings |
| `font.size.base` | `17.135px` | Root document and default paragraph text size |
| `font.weight.base` | `400` | Default body font weight |
| `font.lineHeight.base` | `25.7025px` (`1.5`) | Default body line height for comfortable reading measure |
| `font.size.xs` | `12.85px` | Badges, tags, legal disclaimers, and input labels |
| `font.size.sm` | `13.61px` | Secondary metadata, filter pills, and sub-navigation links |
| `font.size.md` | `15.42px` | Standard button labels, form inputs, and card descriptions |
| `font.size.lg` | `15.76px` | Lead paragraphs and mega-menu primary links |
| `font.size.xl` | `17.14px` | Highlighted editorial copy and footer headings |
| `font.size.2xl` | `20.72px` | Card titles (`.card__heading`) and modal subheadings |
| `font.size.3xl` | `23.05px` | Sub-section titles and review quotes |
| `font.size.4xl` | `30.84px` | Primary section headings and modal titles |

### 2.2 Color Palette Tokens
Component rules **must** reference semantic color tokens exclusively.

| Semantic Token | Raw Value | Role & Contrast Mandate |
| :--- | :--- | :--- |
| `color.text.primary` | `#5c5448` | Default body copy on light editorial surfaces (`color.surface.secondary`) |
| `color.text.secondary` | `#f4f3ef` | Primary text on dark surfaces (`color.surface.base`, `color.surface.muted`, `color.surface.strong`) |
| `color.text.tertiary` | `#969391` | Muted metadata, captions, and secondary hints; **must** meet 4.5:1 on dark surfaces |
| `color.text.inverse` | `#ffffff` | High-emphasis text on dark overlays, hero headers, and filled accent badges |
| `color.surface.base` | `#000000` | Full-bleed hero and media backdrop surface |
| `color.surface.muted` | `#090807` | Deep overlay backdrop, modal scrim, and high-contrast dark containers |
| `color.surface.strong` | `#2c2623` | Signature dark earth surface (`.bg-darkbrown`) for destinations, journey, and footer sections |
| `color.border.strong` | `rgb(92, 84, 72) rgb(92, 84, 72) rgba(44, 38, 35, 0.1)` | Structural dividers, card outlines, input borders, and dashed SVG icon rings |

### 2.3 Spacing Scale Tokens
All component padding, gaps, and layout margins **must** align to the 8-step spacing scale:

| Semantic Token | Value | Primary Application |
| :--- | :--- | :--- |
| `space.1` | `5.77px` | Inline icon-to-tag gaps, compact badge padding |
| `space.2` | `9.94px` | Filter pill spacing, tight vertical stack gaps |
| `space.3` | `12.42px` | Input vertical padding, list item spacing |
| `space.4` | `15.42px` | Card internal rhythm, button horizontal padding |
| `space.5` | `16.14px` | Grid sub-column gaps, form field spacing |
| `space.6` | `17.14px` | Standard component padding and toolbar spacing |
| `space.7` | `23.13px` | Card body padding, modal header spacing |
| `space.8` | `24.84px` | Section internal rhythm and multi-column gaps |

### 2.4 Radius & Motion Tokens
| Semantic Token | Value | Usage Rule |
| :--- | :--- | :--- |
| `radius.xs` | `24.84px` | Contained cards, modal dialogs, and featured image frames |
| `radius.sm` | `28.54px` | Large interactive panels, chat widget container, and search bar |
| `radius.md` | `49.68px` | Pill buttons (`.btn`), tab switchers (`.tabs__nav-container`), and circular icon strokes |
| `motion.duration.instant` | `300ms` | Micro-interactions: focus rings, button hover fills, icon stroke rotations |
| `motion.duration.fast` | `400ms` | Mega-menu drawer reveal, modal open/close, tab pane crossfades |
| `motion.duration.normal` | `600ms` | Sticky header state transition, card hover image scale, accordion expansion |
| `motion.duration.slow` | `1500ms` | Full-bleed destination Swiper parallax transitions and split-text hero reveals |

---

## 3. Component-Level Rules

> [!IMPORTANT]
> Every component family below **must** implement all seven states (`default`, `hover`, `focus-visible`, `active`, `disabled`, `loading`, `error`), use semantic tokens exclusively, and support keyboard, pointer, and touch input modalities.

### 3.1 Navigation & Sticky Mega-Menus (`5` Navigation Regions)
- **Anatomy**:
  1. Top bar (`header.siteHeader`) containing mobile trigger (`.navMenu__btn`), primary nav list (`.siteHeader__nav`), brand logo (`.siteHeader__logo`), and utility cluster (`.siteHeader__right`: phone, favourites counter, search trigger, primary CTA).
  2. Cascading mega-menu panels (`.destinationsDropdown`, `.aboutDropdown`, `.inspirationDropdown`) with region list (`.destinationsMega__countries`), sub-link column (`.destinationsMega__links`), and visual feature card (`.destinationsMega__feature`).
  3. Mobile drawer (`#mobileNavigation.navMenu`) with nested slide-in `<ul>` levels.
- **Variants**:
  - `inverted` (`.siteHeader--inverted`): Transparent surface over hero media using `color.text.inverse`.
  - `solid / scrolled`: Triggered on scroll or dropdown open, transitioning over `motion.duration.normal` to solid surface with `color.text.primary` and `color.border.strong` bottom hairline.
- **States**:
  - `default`: Top-level items rendered in `font.family.primary` at `font.size.md` with `space.6` horizontal gap.
  - `hover`: Opens associated `.siteHeaderDropdown` over `motion.duration.fast`; active country row highlights with `color.surface.strong` text and rotates the `.btn__icon-stroke` ring over `motion.duration.instant`.
  - `focus-visible`: Applies a `2px` solid outline using `color.text.primary` (or `color.text.inverse` on dark surfaces) with `space.1` offset; `Tab` traversal moves sequentially through top-level triggers and open panel links.
  - `active`: Marks current destination or section with `aria-current="page"` and persistent underline.
  - `disabled`: Sets `aria-disabled="true"`, reduces opacity to `0.45`, and suppresses pointer events.
  - `loading`: Displays skeleton placeholders inside `.destinationsMega__feature-wrap` while deferred menu assets resolve.
  - `error`: If dynamic menu data fails, renders a fallback static destination list so navigation remains 100% functional.
- **Interaction & Responsive Behavior**:
  - **Keyboard**: `Enter` / `Space` toggles dropdown panels; `Escape` closes any open mega-menu or `#mobileNavigation` and returns focus to the invoking trigger; `ArrowDown` / `ArrowUp` navigates `.destinationsMega__countries`.
  - **Pointer**: Hovering `.siteHeaderDropdown__toggle` opens the mega-menu; moving pointer across `.destinationsMega__country` switches `.is-active` detail panes without page reload.
  - **Touch**: Below `1200px`, desktop mega-menus collapse into `#mobileNavigation`; tapping a parent item slides the child `<ul>` into view with a dedicated Back control.
  - **Long-Content / Overflow / Empty State**: Mega-menu containers **must** set `data-lenis-prevent` and `overflow-y: auto` (`max-height: calc(100vh - 90px)`) so long package lists scroll independently without scrolling the page body.

### 3.2 Links (`291` Instances)
- **Anatomy**: Text label (`font.family.primary`), optional leading/trailing `.iconTag__icon` or `.btn__icon` SVG symbol, and interactive hit target.
- **Variants**:
  - `inline-editorial`: Body links with persistent underline.
  - `trip-listing-hover` (`.tripListings--alternate .tripListings__item`): Large `font.family.display` link flanked by dual floating preview images (`.tripListings__image.left` and `.tripListings__image.right`).
  - `footer-link`: Compact link in `color.text.secondary` on `color.surface.strong`.
- **States**:
  - `default`: Uses `color.text.primary` on light surfaces or `color.text.secondary` on `color.surface.strong`.
  - `hover`: Shifts opacity or reveals `.tripListings__image` pair over `motion.duration.fast` using GSAP rotation/translation.
  - `focus-visible`: Displays a high-contrast `2px` focus ring with `space.1` offset; **must** never rely on color change alone.
  - `active`: Compresses scale to `0.99` during press.
  - `disabled`: Uses `color.text.tertiary`, removes `href`, and sets `aria-disabled="true"`.
  - `loading`: Appends an inline pulsing indicator when triggering asynchronous route or modal fetches.
  - `error`: Displays an inline retry tooltip if an asynchronous link target fails to open.
- **Interaction & Edge Cases**:
  - **Keyboard / Pointer / Touch**: Dual hover images on `.tripListings--alternate` **must** only activate on `(hover: hover) and (pointer: fine)` media queries so touch devices navigate cleanly on first tap without sticky hover artifacts.
  - **Long-Content**: Link labels exceeding container width **must** wrap cleanly at `font.lineHeight.base` without horizontal clipping.

### 3.3 Buttons (`104` Instances)
- **Anatomy**: Pill container (`radius.md`), `.btn__label` (`font.family.primary`, `font.size.md`), and optional `.btn__icon` housing a `50x50` dashed SVG circle (`.btn__icon-stroke`) plus directional symbol (`#line-arrowRight`).
- **Variants**:
  - `primary-outline` (`.btn`): Transparent fill with `color.border.strong` border and `color.text.primary` label.
  - `filled` (`.btn--fill`): Solid `color.surface.strong` surface with `color.text.secondary` text.
  - `bare` (`.btn--bare`): Borderless trigger with leading icon (`#line-stars`).
  - `icon-only` (`.playBtn`, `.card__favBtn`, `.homeVideoReviews__prev`): Circular hit target (`radius.md`) with mandatory `aria-label`.
- **States**:
  - `default`: Padding set to `space.3` vertical and `space.7` horizontal; border radius `radius.md`.
  - `hover`: Transitions background to `color.surface.strong` and text to `color.text.inverse` over `motion.duration.instant`; `.btn__icon-stroke` scales and rotates smoothly.
  - `focus-visible`: Renders a `2px` outline offset by `space.1` that remains visible against both light and dark surfaces.
  - `active`: Translates `1px` vertically over `motion.duration.instant`.
  - `disabled`: Sets `disabled` attribute, `opacity: 0.45`, `cursor: not-allowed`, and suppresses `.btn__icon` animation.
  - `loading`: Locks button width, sets `aria-busy="true"`, disables repeat submission, and replaces `.btn__icon` with a spinning dashed stroke.
  - `error`: Highlights border with high-contrast alert styling and announces failure via an associated `role="status"` region.
- **Interaction & Edge Cases**:
  - **Keyboard**: Activates on both `Enter` and `Space`.
  - **Pointer & Touch**: Minimum hit target **must** be at least `44px × 44px` on touch viewports.
  - **Overflow**: Labels **should** remain concise (2–4 words); if localized text wraps, vertical padding **must** expand proportionally using `space.2`.

### 3.4 Cards (`138` Instances)
- **Anatomy**:
  1. Media wrapper (`.card__image`) with aspect-ratio lock, lazy-loaded `<img>`, optional `.listingBadge.card__badge` (`font.size.xs`, `radius.md`), and `.card__favBtn` wishlist toggle.
  2. Content container (`.card__body`) with `.iconTag` destination pin (`space.1` gap), `.card__heading` (`font.size.2xl`), `.card__description` (`font.size.md`, duration + price), and `.btnGroup` action footer.
- **Variants**:
  - `contained-itinerary` (`.card.card--contained`): Editorial card with `radius.xs` image corners and structured metadata footer.
  - `accommodation-slide` (`.homeAccommodation .swiper-slide`): 3D centered carousel card with top title/location header, central image, and bottom description + CTA.
  - `news-insight` (`.homeNews__item`): Bento grid editorial card with `.card__tags-item` pills.
- **States**:
  - `default`: Image at `scale(1)` on neutral surface; `.card__heading` in `color.text.primary`.
  - `hover`: Scales `.card__image img` to `1.04` over `motion.duration.normal` and elevates `.btn` child state.
  - `focus-visible`: Outlines the entire `.card` container with `radius.xs` and `2px` focus ring when tabbed.
  - `active`: Slight scale compression (`0.995`) on pointer down.
  - `disabled`: Desaturates media (`filter: grayscale(1)`) and labels badge as `"Sold Out / Season Closed"`.
  - `loading`: Renders a shimmer placeholder in `color.surface.strong` at `0.08` opacity matching the exact aspect ratio to prevent Cumulative Layout Shift (`CLS = 0`).
  - `error`: If a card image fails to load, substitutes a branded fallback wildlife illustration with intact `.card__body` text and CTA.
- **Responsive & Edge-Case Handling**:
  - Grid adapts from 1 column (`<720px`) to 2 columns (`720px–1199px`) and 3 columns (`≥1200px`) with `space.8` gap.
  - **Long-Content**: `.card__heading` **should** clamp at 3 lines (`-webkit-line-clamp: 3`) with full title preserved in `aria-label` and modal detail view.
  - **Empty State**: When destination filters return zero matching cards, the container **must** display an empty state message with a `"Reset Filters"` button (`data-package-filter="all"`).

### 3.5 Lists & Filtering Groups (`45` Instances)
- **Anatomy**: Semantic `<ul>` / `<ol>` or `role="group"` container with `space.3` to `space.5` item rhythm.
- **Variants**:
  - `navigation-list` (`.siteHeader__nav`, `.destinationsMega__links`)
  - `trip-listings-matrix` (`.tripListings`, `.tripListings--alternate`)
  - `filter-pill-bar` (`.openbillFilterBar`)
  - `route-itinerary-steps` (`.obModal__routeList`)
- **States**:
  - `default`: Items separated by `color.border.strong` hairlines or `space.2` pill gaps.
  - `hover`: Highlights active row or pill border with `color.surface.strong`.
  - `focus-visible`: Distinct `2px` outline on the focused list control.
  - `active`: Selected filter pill or tab sets `aria-pressed="true"` or `aria-selected="true"`, filling background with `color.surface.strong` and text with `color.text.secondary`.
  - `disabled`: Non-applicable filter options set `disabled` and `opacity: 0.4`.
  - `loading`: Displays inline skeleton rows while list items hydrate.
  - `error`: Renders inline error banner with retry button if dynamic list filtering fails.

### 3.6 Inputs, Search & Concierge Forms (`12` Instances)
- **Anatomy**: Explicit `<label>` (`font.size.xs`, `color.text.primary`), input control (`font.family.primary`, `font.size.md`, `padding: space.3 space.4`, `border: color.border.strong`), clear/submit action buttons, and live status region (`aria-live="polite"`).
- **Variants**:
  - `overlay-search` (`#siteSearchInput` inside `#siteSearch`)
  - `newsletter-inline` (`#newsletterEmail` inside `.newsletterSignup`)
  - `concierge-composer` (`.rd-chat__input` inside `.rd-chat__composer`)
  - `quote-modal-fields` (`#obQuoteForm` text, email, tel, select, and textarea controls)
- **States**:
  - `default`: Border uses `color.border.strong`; placeholder uses `color.text.tertiary`.
  - `hover`: Border darkens to `color.surface.strong` over `motion.duration.instant`.
  - `focus-visible`: Applies `2px` solid focus outline with `space.1` offset and hides placeholder opacity shift.
  - `active`: Maintains focused border while user types; reveals `.siteSearch__clear` button as soon as input value is non-empty.
  - `disabled`: Locks input with `disabled`, muted surface background, and `color.text.tertiary` value.
  - `loading`: Sets `aria-busy="true"` on `#siteSearchResults` or form container and updates `#siteSearchStatus` (`"Searching Openbill Safaris…"`).
  - `error`: Sets `aria-invalid="true"`, highlights field border, and announces actionable validation guidance in `#siteSearchStatus` or `#obQuoteStatus` (e.g., `"Please enter a valid email address"`).
- **Interaction & Edge Cases**:
  - **Keyboard**: `Escape` clears or closes `#siteSearch`; `Enter` submits form or selects first search result.
  - **Empty State**: When a search query matches zero itineraries, `#siteSearchStatus` **must** announce `"No matching safaris found"` while keeping quick destination suggestion pills visible.

---

## 4. Accessibility Requirements and Testable Acceptance Criteria

Target compliance is **WCAG 2.2 Level AA**. Every criterion below **must** be verified before release:

| ID | Criterion (WCAG 2.2 AA) | Component Scope | Testable Pass / Fail Check |
| :--- | :--- | :--- | :--- |
| **A11Y-01** | **1.4.3 Contrast (Minimum)** | All text tokens (`color.text.primary`, `color.text.secondary`, `color.text.tertiary`, `color.text.inverse`) | **Pass**: Normal text achieves `≥ 4.5:1` contrast (`#5c5448` on `#f4f3ef` = `6.58:1`; `#f4f3ef` on `#2c2623` = `12.6:1`; `#969391` on `#090807` = `6.4:1`). **Fail**: Any body or metadata text drops below `4.5:1`. |
| **A11Y-02** | **2.4.7 / 2.4.11 Focus Visible & Appearance** | All `291` links, `104` buttons, and `12` inputs | **Pass**: Tabbing through the page displays an unobstructed `2px` solid focus indicator (`outline-offset: 3px`) on every interactive element. **Fail**: `outline: none` without a high-contrast replacement or focus obscured by sticky header. |
| **A11Y-03** | **2.1.1 / 2.1.2 Keyboard & No Keyboard Trap** | Mega-menus, `#siteSearch`, `#mobileNavigation`, `#openbillSafariModal`, `.rd-chat` | **Pass**: All overlays open via `Enter`/`Space`, trap or cycle focus appropriately while modal, close on `Escape`, and restore focus to the opener. **Fail**: Focus escapes behind a modal dialog or cannot exit a carousel. |
| **A11Y-04** | **2.5.8 Target Size (Minimum)** | Icon buttons, Swiper nav arrows, filter pills, wishlist hearts | **Pass**: Every pointer/touch control measures at least `24×24 CSS px` (`44×44 CSS px` recommended on mobile). **Fail**: Controls smaller than `24×24 CSS px` without sufficient spacing. |
| **A11Y-05** | **4.1.2 Name, Role, Value** | Icon-only buttons, tabs, filter pills, dialogs | **Pass**: Every icon-only `<button>` has a descriptive `aria-label`; tabs update `aria-selected`; wishlist & filter buttons update `aria-pressed`. **Fail**: Unlabelled `<svg>` buttons or static ARIA states. |
| **A11Y-06** | **2.3.3 Animation from Interactions** | GSAP ScrollTrigger, SplitText, Lenis, Swiper | **Pass**: Enabling `prefers-reduced-motion: reduce` adds `.reduced-motion-runtime` and renders `.handReveal`, `.headingReveal`, and `.fadeInReveal` immediately at `opacity: 1` without motion sickness triggers. **Fail**: Text remains invisible (`opacity: 0`) when motion is disabled. |

---

## 5. Content and Tone Standards with Examples

### 5.1 Writing Principles
- **Tone**: Concise, confident, warm, and implementation-focused.
- **Clarity**: Every CTA **must** pair an explicit action verb with a specific outcome.
- **Authenticity**: Ground copy in verified East African safari specifics (Bwindi mountain gorilla permits, Murchison Falls Victoria Nile cruises, Kazinga Channel wildlife, Uganda Tourism Board license `UTB/RTT/TO/2026/102199`, and OpenVision Foundation Uganda community impact).

### 5.2 Do / Don't Copy Examples

| Context | Do (Approved System Copy) | Don't (Prohibited Copy) |
| :--- | :--- | :--- |
| **Primary Hero CTA** | `Plan Your Safari` / `Explore Tailor-Made Safaris` | `Click Here` / `Submit` / `Learn More` |
| **Itinerary Card Action** | `View 10-Day Uganda Route` (with `aria-label="More information about 10 Days Best of Uganda Safari"`) | `Read More` (repeated 12 times without context) |
| **Quote Form Status** | `Webale nyo! Your custom safari request has been sent to our Entebbe specialists. Expect a bespoke route & UWA permit check within 24 hours.` | `Form submitted successfully.` |
| **Search Empty State** | `No safaris matched your search. Try "Bwindi Gorillas", "Murchison Falls", or "10-Day Rwanda & Uganda".` | `0 results.` |
| **Error State** | `Please enter a valid email address so our Entebbe team can send your safari quote.` | `Invalid input.` |

---

## 6. Anti-Patterns and Prohibited Implementations

1. **No Raw Hex Literals in Component Rules**: Engineers **must not** hardcode hex values (`#5c5448`, `#2c2623`, `#f4f3ef`) inside component stylesheets when a semantic token (`color.text.primary`, `color.surface.strong`, `color.text.secondary`) exists.
2. **No Hidden Focus Indicators**: Implementations **must not** apply `outline: 0` or `outline: none` without a `focus-visible` replacement meeting 3:1 non-text contrast.
3. **No One-Off Spacing or Typography Exceptions**: Components **must not** introduce arbitrary pixel sizes outside `font.size.xs`–`font.size.4xl` or `space.1`–`space.8`.
4. **No Unlabelled Icon Controls**: Icon-only buttons (search, close, wishlist heart, carousel prev/next, video play) **must not** ship without an explicit `aria-label`.
5. **No Cross-Origin `<svg><use>` Blocking**: SVG symbol references **must** point to inlined document symbols (`#line-arrowRight`, `#openbill-logo`) so icons render reliably across both HTTP servers and local `file://` inspection.
6. **No Hover-Only Critical Content**: Information revealed on pointer hover (such as `.tripListings--alternate` previews or `.destinationsMega__details`) **must** remain accessible via keyboard focus and touch tap.

---

## 7. QA Checklist

- [ ] **Token Audit**: All component styles reference semantic tokens (`font.*`, `color.*`, `space.*`, `radius.*`, `motion.duration.*`) with zero ad-hoc magic numbers.
- [ ] **7-State Coverage**: Navigation, links, buttons, cards, lists, and inputs visibly and programmatically handle `default`, `hover`, `focus-visible`, `active`, `disabled`, `loading`, and `error` states.
- [ ] **Component Density Stress Test**: Page renders all `291` links, `138` cards, `104` buttons, `45` lists, `12` inputs, and `5` navigation regions with zero horizontal overflow (`320px` to `2560px`).
- [ ] **Contrast Verification**: All text/surface pairs pass WCAG 2.2 AA (`≥ 4.5:1` normal text, `≥ 3:1` large text and UI boundaries).
- [ ] **Keyboard Navigation Pass**: Full page traversal via `Tab`, `Shift+Tab`, `Enter`, `Space`, and `Escape` operates header mega-menus, `#siteSearch`, `.tabs__container`, `#openbillSafariModal`, and `.rd-chat` without focus traps.
- [ ] **Reduced Motion Pass**: `prefers-reduced-motion: reduce` disables GSAP scrub/parallax while keeping all headings, images, and carousels readable and interactive.
- [ ] **Brand Content Authenticity**: All destinations, itineraries, Tripadvisor reviews, UTB license (`UTB/RTT/TO/2026/102199`), OpenVision Foundation Uganda charity links, and Entebbe contact channels (`+256 708 975329`, `+256 745 843863`, `openbillsafarisuganda@gmail.com`) reflect **Openbill Safaris Uganda**.

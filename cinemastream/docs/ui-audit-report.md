# CinemaStream — Full UI Report (for external design review)

This document describes exactly how every screen in this app currently looks and
behaves — layout, colors, typography, spacing, states, and interactions — written
so a text-only reader (no screenshots) can accurately picture the UI and reason
about improvements. It is a factual description, not a critique; a short "Known
Inconsistencies" section at the end calls out objective inconsistencies for
context, but is not a design opinion.

Stack: React 19 + Vite, plain CSS (some `.scss`, no CSS framework/Tailwind), React
Router, MUI (`@mui/material`, `@mui/x-data-grid`) used only in the admin area,
`recharts` + `react-plotly.js` for admin charts, `react-icons` for icons.

---

## 1. Design System

### 1.1 Color tokens (defined in `src/index.css`, used across catalog + admin)

```css
--color-bg: #0b0b0b;            /* page background */
--color-surface: #141414;       /* card/panel background */
--color-surface-raised: #1f1f1f;/* elevated panel (dropdowns, chart cards) */
--color-accent: #e50914;        /* brand red — buttons, active states, links */
--color-accent-hover: #f40612;  /* accent hover state */
--color-text: #f5f5f5;          /* primary text (off-white, not pure white) */
--color-text-muted: #b3b3b3;    /* secondary text */
--color-border: #2a2a2a;        /* hairline borders */
```

### 1.2 Typography

Font stack: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', ...`
— Inter loaded via Google Fonts `<link>` in `index.html` (weights 400–800). Applied
globally via `body { font-family: var(--font-family) }`.

No formal type scale exists (no `--font-size-*` tokens) — each component hardcodes
its own `rem`/`px` sizes. Rough hierarchy in practice:
- Hero title: `clamp(2rem, 5vw, 3.5rem)`, weight 800
- Section/row titles: `1.4–2rem`, weight 700
- Card titles: `0.95–1rem`, weight 600
- Body/muted text: `0.85–1rem`, weight 400–500

### 1.3 Global reset

`* { box-sizing: border-box }`, `body` margin reset, antialiasing hints. No CSS
reset library.

---

## 2. Three coexisting visual languages (important context)

The app is not visually unified — it has three different design languages that
never got reconciled:

1. **Catalog + Admin** (Homepage, Movies, Series, My List, admin dashboard) — the
   dark theme above (`#0b0b0b`/`#141414`, Inter, `--color-*` variables). This is
   the newest and most polished layer.
2. **Public Landing Page** (`/`) — its own hardcoded palette: pure black
   background (`#000`), `'Segoe UI', Tahoma, Geneva, Verdana` font stack (its own
   `body` selector overrides the global one), `#141414` navbar, same `#e50914`
   red accent by coincidence rather than shared tokens. Cards are `220×340px`
   fixed-size with a full-card dark hover overlay revealing title + overview —
   different pattern from the catalog's `MovieCard`.
3. **Auth pages** (Login, Register, Forgot/Reset Password, Verify OTP) — a
   completely separate look: full-viewport background photo (`auth-bg.jpg`)
   behind a centered, `max-width: 500px`, blurred glassy card
   (`background: rgba(100, 11, 11, 0.9)` — a dark maroon/red translucent panel,
   `backdrop-filter: blur(8px)`), `Arial, sans-serif` font (its own override),
   pill-shaped white input fields with black borders and black submit buttons.
   No relation to the `--color-*` tokens at all.

None of the three know about each other's CSS custom properties, fonts, or
component patterns.

---

## 3. Navigation — three different navbars

- **Landing page navbar** (`LandingPage.jsx`, only on `/`): fixed-height flex bar,
  `#141414` solid background, logo left ("**Cinema**Stream", "Cinema" in red),
  two plain links right ("Sign In", "Register"). No blur, no active-state
  styling.
- **`CatalogNavbar`** (Homepage/Movies/Series/My List): `position: fixed`, full
  width, `rgba(11,11,11,0.7)` background + `backdrop-filter: blur(10px)`, a
  1px bottom hairline border. Left: logo. Center-left: nav links (Home, Movies,
  Series, My List) rendered as `NavLink` — the active route gets bold text +
  no background change beyond weight (`.catalog-navbar-item.active`). Right side:
  three controls in a row —
  - **Search**: a small pill (`rgba(255,255,255,0.08)` bg) containing just a
    magnifying-glass icon button; clicking it animates the pill's background
    darker and grows an input from `width: 0` to `200px` (CSS `width` transition,
    0.25s). Enter navigates to `/movies?q=<term>`. Escape or blur-while-empty
    collapses it back.
  - **Notifications bell**: icon button, click opens a small absolute-positioned
    dropdown card (`#1f1f1f` bg, bordered, drop shadow) with static text "No new
    notifications" — no badge/counter, not wired to any real data.
  - **Profile menu**: circular avatar showing the user's initials
    (`components/InitialsAvatar.jsx`, `#4a4a4a` circle, initials centered, 36px)
    — clicking opens a dropdown with full name, email, and a red "Logout"
    button.
- **Admin sidebar + navbar** (Dashboard/Users/Stats, under `/home`, `/admin/*`):
  a fixed **220px-wide left sidebar** (`#141414`, full viewport height) with the
  logo at top, a divider `<hr>`, then a vertical nav list (Dashboard, Users,
  Stats, Logout) each row showing an MUI icon + label, hover turns text/icon red
  and adds a `#222` row background. A separate fixed **top navbar** sits to the
  right of the sidebar (`left: 220px`, `height: 60px`, same `#141414`), right-
  aligned, containing a dark-mode toggle icon (wired to a `DarkModeContext` that
  exists but nothing actually consumes `darkMode` to change any styling — it's a
  no-op toggle today) and the same `InitialsAvatar` + dropdown pattern as the
  catalog navbar, reused via a relocated shared `components/InitialsAvatar.jsx`.

---

## 4. Page-by-page

### 4.1 Public Landing Page (`/`)

Public, unauthenticated. Top: the landing navbar described above. Below it, a
centered "getting started" block: `h2` headline "Get access to the best movies
and TV shows", two lines of body copy, and a single red "GET STARTED" link to
`/register`. Below that, two horizontally-scrolling-free (CSS grid, wraps) rows:
"Popular Movies" and "Popular Series", each a `grid-template-columns:
repeat(auto-fit, minmax(180px, 0.5fr))` of fixed `220×340px` cards. Each card is
just the poster image full-bleed; on hover, a full-card dark overlay
(`rgba(0,0,0,0.85)`) fades in from `opacity:0→1` over 0.4s showing the title and
a scrollable overview paragraph. Footer: single centered line, `#111` background,
muted gray text, "© 2025 CinemaStream. All rights reserved."

### 4.2 Auth pages (Login, Register, Forgot Password, Reset Password, Verify OTP)

All five share `AuthLayout` (full-viewport centered flex container over
`auth-bg.jpg`, cropped/fixed background) wrapping a single glassy maroon card
(described in §2). Every page follows the same internal pattern: `<h1>` title,
one or more `.input-box` rows (pill input, 45px tall, black border, a
`react-icons` glyph pinned to the right edge inside the input), a full-width
black pill submit button (hover → gray `#999`, disabled → `#555`), and a footer
line linking to a related auth page.

- **Login**: email + password inputs, a "Remember me" checkbox + "Forgot
  Password?" link row between the inputs and the button, "Register" link below.
  On success, redirects by role (`admin` → `/home`, `guest` → `/Homepage`) after
  a 500ms delay (to let the auth cookie settle) and fires a `react-toastify`
  success toast with the user's first name.
- **Register**: first name, last name, email, password, confirm password (each
  with a show/hide eye-icon toggle on the two password fields). Below the
  confirm-password field, a live green/red "Passwords match" / "Passwords do not
  match" line appears once the confirm field is non-empty. Submit button is
  `disabled` until passwords match.
- **Forgot Password**: single email input, "Send OTP" button; on success shows a
  toast and redirects to Reset Password after 1.5s.
- **Reset Password**: reset-token input + new-password input; redirects back to
  Forgot Password immediately if no email is in `localStorage` (i.e. you can't
  land here directly).
- **Verify OTP**: email + OTP inputs, a live `M:SS` countdown ("Time remaining:
  3:00" counting down from 180s), submit disabled once it hits 0, and a "Resend
  OTP" button that only appears after the countdown expires.

No card/page in this group uses the `--color-*` tokens, Inter, or any component
from `components/catalog`/`components/admin`.

### 4.3 Catalog Home (`/Homepage`, guest + admin can view)

Below `CatalogNavbar`:

- **Hero** (`components/catalog/Hero.jsx`): `78vh` tall (`min-height: 480px`)
  section, background is a rotating TMDB backdrop image (auto-advances every 7s
  through the "discover movies" list), covered by a two-layer gradient scrim
  (`linear-gradient(to top, ...)` + `linear-gradient(to right, ...)`) so text in
  the bottom-left stays legible against any image. Content, bottom-left aligned,
  fades/slides up on load (`0.6s` keyframe): large bold title, a row of pill
  "badges" (star rating e.g. "★ 7.8" in gold, release year, up to 2 genre names —
  all `rgba(255,255,255,0.08)` translucent pills), a 3-line-clamped overview
  paragraph, then two buttons: solid red "▶ Watch Now" (opens the trailer modal)
  and a translucent "+ My List" / "✓ My List" toggle (fills solid white/becomes
  a checkmark once saved).
- **GenreChips**: a horizontal row of pill buttons — "All Genres" (default
  active state) plus Action/Comedy/Drama/Horror/Science Fiction. Active chip is
  solid red + bold; others are translucent with a red hover fill. This is a
  **filter control, not navigation** — clicking a chip does not change the URL.
- **Below the chips, one of two mutually-exclusive states:**
  - **No genre selected (default)**: five horizontally-scrolling rows
    (`MovieRow`) in order — *Continue Watching* (only rendered if the signed-in
    user has real watch history; hidden entirely if empty), *Trending Now*, *Top
    Rated*, *New Releases*, *Recommended For You*. Each row: title, then a track
    of `230px`-wide poster cards with two translucent circular "glass" arrow
    buttons (`rgba(11,11,11,0.55)` + blur) overlaid left/right for scrolling;
    native scrollbar is hidden.
  - **Genre selected**: rows are replaced by a heading (the genre name) + a
    **TypeTabs** bar — three underline-style tabs "All (n)", "Movies (n)", "TV
    Series (n)" with live counts — and a single responsive grid
    (`repeat(auto-fill, minmax(200px,1fr))`) of cards mixing movies and TV
    series, sorted by TMDB popularity. Shows "Loading..." or "No titles found
    for this filter." text states as appropriate.
- **Footer** (`components/catalog/Footer.jsx`): plain text row of four inert
  "links" (About/Privacy/Terms/Contact — not clickable, no pages exist) plus a
  copyright line, top-bordered, muted gray text.
- **TrailerModal**: full-screen dark overlay (`rgba(0,0,0,0.85)`), centered
  `max-width: 850px` panel (`#1c1c1c`, rounded, drop shadow), an embedded
  YouTube player (`react-youtube`) at the top, then title/overview, a bulleted
  genre list, and a two-column-ish wrapped grid of actor entries (headshot +
  "Name as Character"). Closing via the × button or clicking the overlay.
  Playing the trailer silently logs a "watch" event to the backend (no visible
  UI feedback for this).

### 4.4 Movies (`/movies`) and Series (`/series`)

Nearly identical layout, sharing one stylesheet (`MoviesPage.css`). Below
`CatalogNavbar` (padded `100px` from the top to clear the fixed nav): a
centered-ish filter bar with the page title ("Movies"/"Series"), a text search
input (pill, expands to `max-width: 500px`), and a native `<select>` genre
dropdown. Below that, a responsive grid of `MovieCard`s (same card component as
the homepage's filtered view), and a single centered red "Load More" button
(pagination is manual/button-triggered, not infinite scroll) that shows
"Loading..." while fetching. `/movies` additionally reads `?q=` / `?genre=` from
the URL on first load so links from `GenreChips`/nav search land pre-filtered.

### 4.5 My List (`/my-list`)

Same `catalog-list-page` shell as Movies/Series. Title "My List". If nothing is
saved: a single muted-gray line, "Nothing saved yet — click the + icon on any
title to add it here." Otherwise, the same card grid as Movies/Series, sourced
entirely from `localStorage` (no backend involvement) — so this list is
per-browser, not per-account.

### 4.6 Admin Dashboard (`/home`, admin role only)

Sidebar + top navbar (§3) with a `220px` left margin content area, dark
(`#121212`) background. Top row: two "widget" cards side by side (flex-wrap) —
"USERS" (static copy "See all the users that have registered" + a "See all
users" link to `/admin/users`) and "TOP GENRES" (a static comma list:
Action, Drama, Thriller, Comedy, Sci-Fi — not derived from real data). Each
widget: dark `#1f1f1f` card, an MUI icon on the right in a tinted circular
chip (red-tinted for Users, purple-tinted for Genres), hover lifts the card
`-5px` and lightens the background. Below: a "Most Watched Trailers" bar chart
(`recharts`, red vs. purple bars for Movie vs. Series, real data from watch
history) in its own dark card; then a "Monthly User Growth" line chart (red
line, real signup data over 12 months); then a "Weekly User Activity" heatmap
(`react-plotly.js`, day × time-of-day grid, yellow-to-red color scale, real
watch-event data).

### 4.7 Admin Users (`/admin/users`)

Same sidebar/navbar shell. A single MUI `DataGrid` (paginated, 5/10 rows per
page) inside a dark themed card — MUI's default styling is overridden via
`.scss` to match the app: red column-header row with black header text, dark
row background, gray hover. Columns: ID, First name, Last name, Email, Status
(a colored pill: green "Verified" / red "Not Verified"), Role. Read-only — no
edit/delete/create actions wired to any UI.

### 4.8 Admin Stats (`/admin/stats`)

Same shell. A grid of static stat cards (tan/beige `rgb(234,211,199)` cards —
the one place in the whole app that isn't part of the dark palette) each
showing a label + a hardcoded value: "Total Trailers Watched: 2456", "Most
Watched Trailer: Avengers: Secret Wars", "Top Genre: Rom-Com", "Rewatches:
989", "Active Users: 156 of 872". None of this is live data.

---

## 5. Motion / interaction inventory

- Card hover: `scale(1.05–1.06)` + drop shadow, `0.25–0.3s ease`.
- `MovieCard` hover additionally reveals a bottom gradient overlay with two
  circular action buttons (Play, My List toggle) that fade in.
- Hero content: one-shot fade-up-on-mount keyframe, no scroll-triggered
  animation anywhere in the app.
- Buttons: color/background transitions only (`0.2–0.3s`), no scale/press
  feedback except the Hero buttons (`translateY(-2px)` on hover).
- Search input: width transition (`0.25s`) for expand/collapse.
- Widget cards (admin): `translateY(-5px)` lift on hover.
- No skeleton loaders anywhere — loading states are plain text ("Loading...",
  "Loading chart data...") or nothing (rows that haven't resolved yet just
  render empty until data arrives).
- No page-transition/route-change animation — navigation is instant/jump-cut.

---

## 6. Responsiveness

Almost none. The only `@media` breakpoints in the entire app:
- `Auth.css`: `max-width: 500px` (auth card padding/font shrink, remember/forgot
  row stacks vertically).
- `TrailerModal.css`: `max-width: 600px` (actor list goes single-column, modal
  padding shrinks).

Everything else — the fixed `220px` admin sidebar, the `48px` horizontal
paddings on catalog rows/grids, the Hero's `clamp()` title — has no explicit
tablet/mobile layout. Grids use `auto-fill`/`auto-fit` so cards reflow by
count, but nav bars, the admin sidebar, and modal widths are unadjusted below
typical desktop widths.

---

## 7. Known inconsistencies (factual, for context — not recommendations)

1. Three unreconciled visual languages (Landing / Auth / Catalog+Admin) — see §2.
2. Admin Stats page renders on a warm beige card style that doesn't match the
   dark theme used everywhere else, including the rest of the admin area.
3. `DarkModeContext` exists and its toggle is rendered in the admin navbar, but
   no component actually reads `darkMode` to change styling — it's currently a
   non-functional switch.
4. Several "real-looking" numbers are static placeholders, not live data: the
   admin Stats page entirely, and the "TOP GENRES" widget on the Dashboard.
5. "My List" is `localStorage`-only — it will look empty on a different browser
   or after clearing site data, with no indication to the user of why.
6. No loading skeletons/spinners — only literal "Loading..." text or blank
   space, which can read as a broken row before data arrives.
7. `NotificationsBell` is present in the nav on every catalog page but is
   permanently empty ("No new notifications") with no way to ever have content.
8. Footer links (About/Privacy/Terms/Contact) render as text but are not
   clickable/functional — no destination pages exist.
9. No responsive/mobile layout for the primary nav bars or the admin sidebar.

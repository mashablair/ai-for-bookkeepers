# Design Brief: Maria Blair, AI Consulting

This is the design system of the live site, **mariablairai.com**. Any new website or page for Maria should look like it belongs to the same brand. Open the live site side by side while building.

## The feel in one line

**Coastal and upscale.** Think of a quiet Boca Raton boutique: lots of white space, an elegant thin serif, ocean navy, warm sand, small touches of brass. Calm and confident. It should never feel like a "tech startup."

**Avoid:**
- Gradients, glows, robots, brains, circuit lines
- Purple or blue "AI" color schemes
- Emoji
- Rounded cards with shadows everywhere
- Stock photos of handshakes
- Everything centered

## Colors

Use these exact values as CSS variables.

| Token | Light | Dark | Use |
|---|---|---|---|
| `--bg` | `#FFFFFF` | `#0C1A24` | Page background |
| `--sand` | `#F5F1EA` | `#12232F` | Alternate section bands |
| `--ink` | `#12324A` | `#EEF2F4` | Headings and body text (ocean navy) |
| `--muted` | `#4F6475` | `#A9B8C3` | Secondary text |
| `--line` | `#E3DCCF` | `#263A48` | Thin rules and borders |
| `--brass` | `#7F6236` | `#D9C29A` | Small labels and accents only |
| `--deep` | `#12324A` | `#163349` | Navy feature bands (specialty section, closing section) |
| `--on-deep` | `#F5F1EA` | `#F5F1EA` | Text on navy bands |
| `--on-deep-muted` | `#D5DEE3` | `#C9D4DB` | Secondary text on navy bands |
| `--brass-on-deep` | `#D9C29A` | `#D9C29A` | Labels on navy bands |
| `--btn` / `--btn-ink` | `#12324A` / `#FFFFFF` | `#F5F1EA` / `#12324A` | Primary button background / text |

Rules:
- Brass is an accent. Use it for small uppercase labels and numbers only, never for large areas.
- The navy bands alternate with white and sand sections to give the page rhythm.
- Dark mode follows the visitor's device by default. A small **Light / Dark** pill switch in the header lets them override it, and the choice is remembered.

## Typography

Google Fonts:
- **Cormorant Garamond** (500, 600, italic 500) for headings, display text and FAQ questions
- **Jost** (400, 500) for body text, buttons, labels and navigation

| Element | Font | Size | Notes |
|---|---|---|---|
| Hero headline | Cormorant 500 | clamp(46px, 5.8vw, 80px) | Line height 1.0, letter spacing −0.015em. One phrase in *italic*, e.g. "of *Boca Raton.*" |
| Section headings | Cormorant 500 | clamp(38px, 4.4vw, 54px) | Line height 1.05 |
| Statement quote band | Cormorant 500 | clamp(28px, 3.3vw, 42px) | Centered, max 900px wide |
| Card or row titles | Cormorant 600 | 26–30px | |
| Body | Jost 400 | 18px | Line height 1.7; lede paragraphs 19–20px in `--muted` |
| Labels / eyebrows | Jost 500 | 12–13px | UPPERCASE, letter spacing 0.24–0.26em, color `--brass` |
| Buttons and nav | Jost 500 | 13–14px | UPPERCASE, letter spacing 0.14em |

Headings use `text-wrap: balance`. Keep body text no wider than about 65 characters.

## Layout

- Max content width is **1240px**, with side padding of at least 20px.
- Sections have generous vertical padding: about 80–128px on desktop.
- **Thin 1px rules** (`--line`) separate items instead of cards. Services and FAQ are stacked rows with a rule above each, not boxes.
- Corners are square. There are no rounded cards, except the pill-shaped theme switch.
- Shadows are not used.
- Photos are large, full-bleed or half-width, with `object-fit: cover` and no borders or rounded corners.
- Every multi-column layout stacks into one column on phones (below about 900px).

## Page structure (for reference)

1. **Sticky header.** White, slightly translucent with a blur, and a 1px bottom rule. Left: "Maria Blair" (Cormorant 600, 30px) with a tiny brass label under it. Right: uppercase nav links, a navy button, and the Light/Dark switch.
2. **Split hero.** A tall portrait photo on the left half (no padding, edge to edge). On the right: a brass label, a big serif headline, a muted lede, and two buttons.
3. **Statement band.** On `--sand`: one large centered serif paragraph.
4. **Services.** Two columns: label and heading on the left; ruled rows on the right. Each row has a small brass tag above a serif title, with a muted description beside it.
5. **Navy specialty band.** Text on one half, a full-height photo on the other.
6. **Approach.** Four columns. Each has a 1px navy rule on top, an italic brass word ("One," "Two"…), a short title and one line of text.
7. **About.** On `--sand`: a 4:5 photo next to the bio, plus a small grid of facts with brass labels.
8. **FAQ.** Ruled accordion rows with serif questions and a brass "+" on the right.
9. **Closing band.** On navy, centered: label, big serif heading, short line, two buttons.
10. **Footer.** Small muted text and thin links.

## Components

- **Primary button:** navy background, white uppercase Jost text, letter spacing 0.14em, padding 18px 30px, square corners, 1px border in the same navy. On hover it turns transparent with navy text.
- **Secondary (outline) button:** transparent with a 1px navy border and navy text. On hover it fills navy.
- **Buttons on navy bands:** sand background with navy text, or a sand outline.
- **Labels/eyebrows:** small brass uppercase text above every section heading.
- **Pop-up (dialog):** white or `--bg` background, 1px `--line` border, square corners, a dark translucent backdrop, a large serif heading, and a "×" close button in the corner.
- **Links in body text:** same color as the text, with a thin underline.

## Imagery

- Real-looking photos of Maria: warm natural daylight, office or café settings with plants and windows. No posed stock photos.
- Photos carry the color. The page around them stays neutral.

## Voice of the copy

- Warm, direct, plain English with no jargon or hype. Short sentences.
- Speak to owners: "I come to your office," "your team," "your real tasks."
- Calls to action stay simple: "Free 20-minute call," "Book a session."

## Quick checklist for the builder

- [ ] Uses Cormorant Garamond + Jost, not Inter or other default fonts
- [ ] Colors only from the token table; brass only for small accents
- [ ] Thin rules instead of boxed cards; square corners; no shadows or gradients
- [ ] Large photos edge to edge; generous white space
- [ ] Light and dark modes both designed, with a Light/Dark switch
- [ ] Works on a phone (single column, no sideways scrolling)

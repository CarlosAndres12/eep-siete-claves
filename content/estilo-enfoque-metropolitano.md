# ESTILO · Enfoque metropolitano: verdes del territorio

This file describes one graphical style for the course-site pipeline v2 and follows the style contract of Appendix S of `prompt-general-v2.md`. The coding agent implements it as `js/style/`, `css/tokens.css` and `css/style.css` (base §1.6). It is adapted, as general vocabulary only, from the visual identity description supplied in `recursos-graficos/estilo-grafico-enfoque-metropolitano.md`: flat greens on warm paper, uppercase monospace titles, flat friendly people, label bars and one wandering contour line. Everything is drawn procedurally; no photograph, logo, illustration file or map file from that folder is embedded, traced or redrawn. Values marked *(adaptation)* are not in the identity: they translate it to the pipeline's rules (contrast, legend distance, skin diversity, numbers in the body face).

## S0. Identity

- **Name:** «Enfoque metropolitano: verdes del territorio».
- **Concept:** every screen should feel like a calm, evidence-led planning document about a mountain valley: greens from deep forest to pale mint on warm off-white paper, uppercase monospace titles, flat people standing on the bottom edge, and one even line wandering across the frame like a contour. Maps, plans and models live in a separate deep night-forest panel drawn with thin bright-green lines. It must never look glossy, three-dimensional, alarmist or like a dashboard: no gradients, no drop shadows, no glass, no neon, no photo collage, no logo, no real outline of a territory.
- **Support:** flat warm paper (`ground`) for the human world; a deep night-forest panel (`machine-ground`) for everything that is a map, a plan, a norm or a model.
- **Mood words:** territorial, sereno, riguroso, cercano, verde.
- **Inspiration:** the visual identity of a metropolitan land-use planning program (flat vector illustration, institutional editorial layout, monospace labeling), used only as general vocabulary.
- **Footer credit line:** «Ilustraciones originales dibujadas con código.»

## S1. Manner

- **Line.** Fills carry no outlines. Detail lines are thin (1.2–1.6 px on the 1280×720 canvas), in `ink`, with round caps and joins: clothing folds, collars, cuffs, hair partings, window mullions, leaf veins, the rim of a pot. Legend shapes, data marks and figure cards are outlined in `ink` at 2 px. Lines are even in weight along their length; there is no wobble, no taper and no texture in a line.
- **Shape.** Flat geometric bodies with soft organic edges where nature is drawn: hills are smooth Bézier silhouettes; tree crowns are circles, ellipses or scalloped canopies on straight trunks; clouds are flat scalloped shapes (three to five arcs on a straight base). Built things are near-square: buildings, panels, tables, bars and label bars (corner radius 4 px). Rounded only: pills (fully round ends), data cards (radius 9 px), the tag card, discs and the bottom corners of the hanging tab (radius 12 px).
- **Fill.** Solid flat colors from the palette roles. A shape may take one second flat tone for a side or shadow face (for example `accent-7` on the shaded flank of an `accent-6` hill); never a gradient or a blur. Optional texture, only on tree crowns and only pre-rendered: a sparse stipple of 1 px dots in `ink` at 8 % alpha.
- **Composition.** A 72 px margin from every edge holds all text *(adaptation of the identity's 108 px on a 1920 frame)*. Titles and statements start at the left margin in the lower half of the frame. One illustration group per frame stands on the bottom edge or on a label bar. Hills, the contour line, the numeral disc and silhouettes may bleed off the edges; text never does. Reading order is left to right, top to bottom.
- **Overlap rule.** Overlaps happen only in clear depth layers: far hills, near hills, buildings and trees, people, then labels. Text never sits on an illustration; it sits on a ground or on a label bar. Nothing overlaps a meaning zone.
- **Forbidden.** Gradients, drop shadows, glows on the human side, 3D, perspective tilts, isometric extrusions, photographic textures, drawn logos, outlines of real municipalities or other political borders, emoji, numbers that count up or tick, exclamation-mark decoration.

## S2. Motion manner

- **Appearance (what `p` renders).** Illustrations rise 24 px from below with an ease-out; their alpha goes from 0 to 1 over the first 40 % of `p`. Label bars slide in from the left edge (from −60 px) with a firm leading edge and no bounce. Text fades in line by line with a 6 px rise. The contour line draws itself along its length (`reveal` 0→1). Figure cards draw their `card` frame first; the number appears whole at `p` ≥ 0.6 and never counts. Inside the map panel, lines draw on in the order they are listed, and the grid fades in under them.
- **Ambient life between beats.** Clouds drift sideways at 6 px/s or less; tree crowns sway by ±1°; a short light dash slides slowly along water lines; the contour line, when dashed, crawls 2 px/s along its path. Nothing blinks, pulses or flashes, and ambient motion always stays out of meaning zones.
- **Exits.** Elements fade out over 0.4 s with an 8 px drop; scene changes use the engine's crossfade.
- **Reduced motion.** No drift, sway or crawl. Every element appears in place with a 200 ms alpha fade; the contour line and map lines appear complete; the hero is a still frame.

## S3. Palette

| Role | Name | Hex | Use |
|---|---|---|---|
| `ground` | papel | `#F0EEEA` | page and canvas background, the human world |
| `ground-2` | tarjeta | `#E6E3DB` | data cards, panels on the page, chart tracks |
| `ink` | bosque | `#1E4035` | text, titles, numbers, detail lines, legend and data outlines |
| `ink-soft` | gris de eje | `#4F574A` | secondary text, captions, axis labels, sources |
| `dark` | bosque profundo | `#1E4035` | subtitle band, cover grounds, dark page sections, badges |
| `on-dark` | menta clara | `#D6FED0` | text and labels on `dark` and on `machine-ground` |
| `accent-1` | brote | `#94EC87` | clothing; highlight bars; pale hills |
| `accent-2` | agua | `#12ACB4` | clothing; rivers, streams and water *(adaptation: the identity's #07ABBC, moved ΔE00 3.3 to keep sky blue in the legend)* |
| `accent-3` | lavanda | `#B7A2F1` | clothing; skies in title frames *(adaptation: replaces cream as the third clothing color, which was too close to the lightest skin)* |
| `accent-4` | crema | `#EFE4B5` | shirts and props that are not a character's main garment; paths; sand |
| `accent-5` | coral | `#ED6E69` | small decorative details only (flowers, a scarf stripe, a roof tile); never alerts, never data |
| `accent-6` | hoja | `#55B86D` | the signature green: hills, tree crowns, full-bleed panels |
| `accent-7` | pino | `#357859` | shaded flanks of hills, dense forest, H1 and H2 on the page |
| `accent-8` | menta | `#D6FED0` | content-frame grounds, table header rows, tag cards |
| `accent-9` | sol | `#F9D886` | sun discs, flowers *(adaptation: the identity's #FFC044, lightened to stay away from the legend's orange)* |
| `skin-1` | piel 1 | `#F3C6A5` | lightest skin tone *(adaptation: five tones replace the identity's single stylized tone)* |
| `skin-2` | piel 2 | `#D9A080` | light-medium skin tone |
| `skin-3` | piel 3 | `#C08A6A` | medium skin tone |
| `skin-4` | piel 4 | `#8D5B43` | medium-dark skin tone |
| `skin-5` | piel 5 | `#5E3A2A` | darkest skin tone |
| `machine-ground` | noche de bosque | `#163229` | the map panel: maps, plans, norms, models, satellites and the lamp |
| `machine-line` | brote | `#94EC87` | lines of maps, plans and models on `machine-ground` |
| `machine-grid` | verde píldora | `#2E594A` | the fine grid of the map panel |
| `machine-glow-1` | menta | `#D6FED0` | the lamp's light, highlighted cells, active line |
| `machine-glow-2` | cielo | `#B0E9FF` | a second signal in the panel (a satellite pass, a scan line) |
| `alert` | coral profundo | `#A8323A` | corrections and retired figures only, always with words |

Legend order: blue, vermillion, reddish purple, sky blue, orange
Legend exclusions: yellow (1.14:1 on ground), bluish green (ΔE00 11.5 from accent-6 and 13.6 from accent-7: the identity's own greens)

Palette notes:

- Measured with the CIEDE2000 and WCAG 2 formulas of `revisar.py`: `ink` on `ground` 9.85:1; `ink-soft` on `ground` 6.48:1; `ink` on `ground-2` 8.90:1; `on-dark` on `dark` 10.30:1 and on `machine-ground` 12.45:1; `machine-line` on `machine-ground` 9.60:1; `alert` on `ground` 5.69:1. Run `python revisar.py --style estilo-enfoque-metropolitano.md --suggest` after any change.
- Greens, water and paper carry almost every screen; the other accents appear in small amounts. Each accent keeps one job, as listed.
- The identity's coral marks hazard and alerts; here coral (`accent-5`) is only a small decorative detail, and corrections use `alert`, so a correction is never confused with a decoration or a hazard. Hazard is never drawn by color alone: hazard zones in schemes use the `pattern` mark and words.
- Text on `accent-6` or `accent-1` grounds is always `ink`; text on `dark` and `machine-ground` is always `on-dark`. Never put `accent-6` text on `ground` (2.14:1).
- The legend colors come from the engine (base §1.5) and appear only on legend items. In this green-dominated palette, bluish green is excluded so that no legend item can be mistaken for a hill or a forest.

## S4. Marks

| Mark | Look and motion in this style |
|---|---|
| `correct` | A fully round pill in `accent-1` with a check made of two straight `ink` strokes, followed by «¡Muy bien!» in the body face, bold, `ink`; the pill slides in from the left and the check draws its two strokes in order. |
| `retry` | A fully round pill outlined in `ink` (2 px) on `ground` with a small curved arrow, followed by «Casi. Pista: …» in the body face; it appears with a 6 px rise, never shakes. |
| `misreading` | A short wavy rule of tildes («~~~~~~») in `ink-soft` under the transcript line, and the label «Error de lectura, corregido a continuación» in `ink-soft`, body face, italic; it fades in. |
| `speaking` | A label bar in `dark` with the speaker's name in the display face, uppercase, `on-dark`, attached to the right of the speaker vignette; it slides in from the left with the vignette. |
| `chapter` | The hanging tab: a `ground` rectangle (about 300 × 96 px) hanging from the top edge near the right corner, bottom corners rounded 12 px, with the chapter title in the display face, uppercase, `ink`; it drops 20 px into place, holds 2 s and rises out. It never carries logos. |
| `divider` | Two thin rules in `accent-6` (1 px) running to the page edges with a centered gap where a short mono label may sit; in transcripts and footnotes, a short tilde rule («~~~~~~») in `ink-soft`. |
| `stamp` | A tag card tilted 3°: a `accent-8` card with cut top corners, a punched hole near the top, a thin `ink` outline (1.2 px) and the stamp text in the display face, uppercase, `ink`, with the stamp's sign at the left; it slides in from the left and settles to its tilt. |
| `card` | A flat `ground-2` panel with 9 px corners and a 1.2 px `ink` outline; checkpoint and pause cards add the punched hole of the tag card at the top left. The frame draws first (stroke reveal), then the content fades in. |
| `button` | A fully round pill in `dark` with the label in the display face, uppercase, `on-dark`, preceded by «→»; focus adds the focus ring of S10; pressing darkens nothing and moves it 1 px down. |
| `badge` | A small fully round chip: filled `dark` with `on-dark` text for evidence types; outlined `ink` on `ground` for «Con matiz», «Por validar», «Esquema», «Ejemplo ilustrativo» and «Personajes inventados»; outlined `alert` with `alert` text only for corrected or retired figures. Text in the display face, uppercase, 14 px or more on the canvas. |
| `pattern` | `ink` hatching on `ground` (or `on-dark` on `machine-ground`) at 1.5 px with the six fills of S5; used for unit identity without a framework, for print, and for any scheme whose parts must stay distinct in grayscale. |

## S5. Signs

**Free sign vocabulary** (each a flat shape in palette roles with thin `ink` details):

- `hoja`: a single leaf, two-tone green, one vein.
- `arbol`: a round crown on a straight trunk.
- `arboleda`: three crowns of different sizes on one ground line.
- `colina`: a smooth hill in `accent-6` with a `accent-7` flank.
- `nube`: a flat scalloped cloud in `ground-2` or white-paper tone.
- `gota`: a water drop in `accent-2`.
- `rio`: a wavy band in `accent-2` with one thin light dash.
- `casa`: a square house with a pitched roof and one window.
- `edificio`: a tall block with a grid of windows.
- `grua`: a simple tower crane next to a block.
- `teleferico`: a cable line with two small cabins over a hill.
- `pin`: a teardrop location pin in `accent-2`, with a round hole.
- `lupa`: a magnifier: a ring and a handle in `ink`.
- `flecha`: a rising trend arrow made of straight segments.
- `flor`: a five-petal flower in `accent-9` or `accent-5`.
- `ave`: a small bird in flight, two arcs.
- `canasta`: a basket with three round fruits.
- `carretilla`: a wheelbarrow with a load of produce.
- `hoja-mapa`: a folded map sheet with a dashed path (pictogram only, never a real map).
- `sol`: a disc in `accent-9`.

**Ambient decoration per scene type** (never inside meaning zones): `title` and `hero` may carry the contour line, one or two clouds and a far hill silhouette; `explain` a small cloud and one plant group at a lower corner; `dialogue` clouds and a hill ridge behind the characters; `case` one `pin` and a dashed path at a corner; `recap` the contour line only; `figure` and `compare` carry no free signs at all, except one small `arboleda` or `casa` group standing in the bottom-left corner, outside the card or the columns.

**Pattern fills** (distinct in grayscale and print, 1.5 px `ink` on `ground`):

- `dots`: round dots of 2.5 px on a 10 px square lattice.
- `stripes`: diagonal lines at 45°, 8 px apart.
- `crosses`: small plus-shaped crosses of 6 px on a 12 px lattice.
- `checks`: a checkerboard of 8 px squares, alternate squares filled at 35 % alpha.
- `waves`: horizontal sine lines, 10 px apart, amplitude 2 px.
- `grid`: an orthogonal grid of 10 px cells.

## S6. People

- **Manner.** Flat vector people with no outlines on fills and a few thin `ink` detail lines. Proportions: slightly long legs, large expressive hands, a rounded head about one seventh of the height. Faces: two small `ink` dot eyes, a short curved line for the mouth (never teeth), an optional small nose line; optional small round glasses (two thin rings and a bridge), which this style likes on many characters. Hair: one or two flat shapes in `ink`, `skin-5` or `ink-soft`, with one parting line. Clothing: flat pieces with fold lines; shoes and belts in `ink`. Friendly, upright, relaxed poses; nobody is drawn grotesque, frightened or sexualized.
- **From a cast description to a drawing.** Age sets the posture and details: young adults upright; people in their sixties a softer posture and, if the description says so, a cane; children are not drawn unless the spec asks. Build sets the width of the torso and limbs (slim, medium, broad). Hair length and shape are drawn as described (short, shoulder-length, curly, tied, grey streaks in `ground-2`). Each clothing item takes the accent role the description names (`accent-1`, `accent-2` or `accent-3`); trousers or skirts without a named role are `ink`; a second garment without a role may take `accent-4`. Skin takes one of `skin-1` to `skin-5`, chosen by the cast entry or, if it does not say, assigned so that consecutive characters differ by at least two steps. Props are drawn as simple signs (a notebook, a clipboard, a hat, a basket, a map sheet). Poses are the ones the cast entry lists; each pose is a set of limb angles, not a new drawing.
- **Speaker vignette.** A circle of 120 px in `accent-8` with a 2 px `ink` ring, holding the speaker's head and shoulders, placed at the lower left above the subtitle band; the `speaking` mark sits to its right. The narrator has no vignette.

## S7. The two manners

- **Pole A, the human manner: the territory as it is lived.** People, houses, hills, forests, rivers, crops and markets on `ground`, drawn in flat organic shapes with warm skins, the clothing accents, the greens and water of the palette, soft curves and thin `ink` details.
- **Pole B, the machine manner: the map, the plan, the norm and the model.** Everything that is a map, a delimitation, a satellite measurement, a classification, a norm or a model output is drawn inside a map panel: a `machine-ground` rectangle with 9 px corners and a fine `machine-grid` of 16 px cells. Inside it there are no fills except small low-alpha `machine-glow-1` cells: only thin even lines in `machine-line` (1.5 px), dashed where a line is "drawn but not yet on the ground", straight segments and arcs, tiny uppercase labels in the display face in `on-dark`. Pole B never uses skin tones, clothing accents or organic scalloped shapes.
- **Telling them apart at a glance.** Pole A is warm, light and filled; pole B is dark, linear and empty. When both appear in one scene, the map panel is a separate inset beside or above the territory and never covers a person. When the spec says that a map element "lands" on the territory, the line leaves the panel and becomes a dashed `ink` line on `ground`, still thin and unfilled.
- **The lamp («la lámpara de IA»).** A small desk lamp drawn in the machine manner inside or at the edge of the map panel: a rectangular base, two straight arm segments with a round joint, a trapezoid shade, and a soft cone of `machine-glow-1` light at 25 % alpha falling on whatever it works on. It is always small (at most one sixth of the frame height), always an object on a surface. It never has eyes, a face, a mouth, limbs, a body, a humanoid shape or a brain.
- **The lamp's family.** Built from the lamp's parts plus pole-B props: the base, the arm, the shade, the light cone, input cards (small rectangles that slide under the light) and output strips (rows of small labeled cells). A tool that "learns" is a lamp over a stack of cards; a tool that "classifies" is a lamp whose light turns cards into labeled cells; a tool that "optimizes" is a lamp with a small dial on its base; a satellite is a small box with two panel wings and a dashed scan line (`machine-glow-2`), drawn inside the map panel. Courses describe each member by function and parts (spec §3.3).

## S8. Backgrounds

- `title`: the cover frame. A full `dark` ground; the contour line in `on-dark` at 60 % alpha crosses from the top left and bleeds off the edges; a thin `on-dark` rule at the bottom right; the title in the display face, uppercase, `on-dark`, in the lower half, with an optional second line in the body face in `accent-1`.
- `explain`: the content frame. A full `accent-8` ground; a far `accent-1` hill silhouette at the bottom right; one plant group at a lower corner; titles appear on a `dark` label bar.
- `figure`: the plain frame. A bare `ground`; the card area is a meaning zone with nothing behind it; at most one small group in the bottom-left corner outside the zone.
- `compare`: a bare `ground` divided into two or three equal columns by 1 px `ink-soft` rules; each column is a meaning zone; column titles on `dark` label bars.
- `dialogue`: the place frame. `ground` with a low ridge of `accent-6` and `accent-7` hills along the bottom on which the characters stand; one or two clouds; the place's props from the course drawings stand on the ridge.
- `case`: a `ground-2` frame with a `pin` and a dashed path in a top corner; the case's elements sit on a tag card.
- `recap`: the closing frame. `ground` with a large `accent-2` hill silhouette bleeding off the left edge, the contour line crossing it, and a `accent-1` label bar at the bottom carrying one line of text in the display face.
- `hero`: the cover frame of `title` at full bleed, with the contour line drawing itself slowly and two clouds drifting; a valley ridge in `accent-6` and `accent-7` along the bottom.
- `card`: `ground` with a soft `accent-8` rectangle behind the checkpoint or pause card; no decoration inside.
- **Meaning zones** (figure cards, charts, legends, compared items) stay bare in every background: no signs, no texture, no ambient motion.
- **The machine's area.** When a scene includes pole B, the engine asks the style for a map panel (`style.mapPanel`, S11): inside its box, the background switches to `machine-ground` with `machine-grid`, text and lines switch to `on-dark` and `machine-line`, and ambient motion stops except for scan lines.

## S9. Typography

- **Body face:** DM Sans (SIL Open Font License), self-hosted from the supplied font files (regular, medium and bold, plus the variable file), with the system stack «"Helvetica Neue", Arial, sans-serif» as fallback. Tabular figures (`font-variant-numeric: tabular-nums`) everywhere a number appears. On the page: 18 px or more, line height 1.5, measure of 65–70 characters, left aligned, never justified.
- **Display face:** IBM Plex Mono (SIL Open Font License), self-hosted, bold, uppercase, tracking +0.03 em, line height 1.0, for titles, label bars, chapter tabs, badges and button labels. The signature pairing: an uppercase mono line followed by a lowercase body-face line in a second color («CAPÍTULO» / «subtítulo»).
- **Titles on the canvas:** `style.title` sets display lines left aligned from the margin, in sizes from 40 to 96 px on the 1280×720 canvas, on a ground or on a label bar; long titles break at word boundaries, never by shrinking below 40 px.
- **Subtitles:** the body face, medium, at 30–32 px, `on-dark` on a `dark` band at 90 % opacity; the speaker's name in bold.
- **Numbers are never set in display lettering.** Every figure, on cards, charts, subtitles and pages, is set in the body face with tabular figures, bold for the headline figure of a card (up to 72 px on the canvas), regular for the rest. Ordinals in a numeral disc (S11) use the body face too. *(Adaptation: the identity sets figures in the mono face and message numerals in a display serif; the pipeline reserves both for words.)*

## S10. The page

- **Page background:** `ground`. Sections may alternate with full-width `accent-8` bands; dark sections (`dark`) carry `on-dark` text.
- **Headings:** H1 in the display face, bold, uppercase, 40–56 px, `accent-7`; H2 in the body face, bold, 24–28 px, `accent-7`; H3 in the body face, bold, 20 px, `ink`. Deks (the line under a title) in the display face, italic, 16–18 px, `ink-soft`, in sentence case.
- **Dividers:** the `divider` mark.
- **Cards:** the `card` mark; figure cards on the page repeat the canvas card: figure in the body face bold, scope and source in `ink-soft`, type badge at the top right.
- **Margin notes:** a `accent-8` column, 220 px wide on wide screens, with a term in bold on a `dark` highlight and its definition in `ink`; below 900 px the note moves under its paragraph.
- **Tables:** header row in `accent-8` with bold `ink` text; 1 px `ink` rules between rows and columns only; no outer border, no zebra; centered caption «Tabla …» above, source line below in `ink-soft`.
- **Focus style:** a 3 px `ink` outline with a 2 px `on-dark` gap ring outside it on light grounds, and a 3 px `on-dark` outline on `dark` and `machine-ground`; never removed.
- **Print:** black text on white; grounds, bands, hills and clouds removed; legend items keep their sign, label and outline and take their pattern fill; badges become outlined chips; the contour line and the map panel's grid are dropped; figure cards print as boxed tables with source lines.

## S11. Drawing functions

Beyond the minimum API of base §1.6, `js/style/` provides:

- `style.contourLine(ctx, box, { seed, p, role, alpha, dash })`: one closed, even, round-jointed wandering line generated from the seed (a smoothed random polygon of 7–11 points), enlarged so that only fragments cross the box; never the outline of a real place.
- `style.labelBar(ctx, text, { x, y, role, textRole, p, align })`: a near-square bar (radius 4 px) behind 1–4 uppercase words in the display face; slides in from the left with `p`.
- `style.tagCard(ctx, box, { role, tilt, holes, p })`: the tag card used by `stamp` and checkpoint cards: cut top corners, punched holes, thin `ink` outline.
- `style.pill(ctx, box, { role, outline, p })`: a fully round pill for buttons and badges.
- `style.numeralDisc(ctx, { x, y, r, text, p })`: a `accent-7` disc bleeding off a corner, holding a short ordinal in the body face, bold, `ground`.
- `style.hills(ctx, box, { seed, layers, roles, p })`: one to three smooth hill silhouettes, far to near, with a shaded flank each.
- `style.clouds(ctx, box, { seed, count, t })`: flat scalloped clouds that drift with `t` (still in reduced motion).
- `style.mapPanel(ctx, box, { p, grid, title })`: the pole-B panel of S7 (background, grid, optional mono title) and a clipping region for its content; returns the inner box.
- `style.mapLine(ctx, path, { p, dashed, weight, glow })`: a pole-B line inside the panel; `glow` adds a `machine-glow-1` halo of 3 px at 30 % alpha.
- `style.water(ctx, path, { width, t, p })`: a water band in `accent-2` with a slow light dash.
- `style.tree(ctx, { x, y, size, seed, kind })`: `round`, `scalloped` or `dense` crowns on a trunk, with optional stipple.
- `style.building(ctx, box, { kind, seed })`: `casa`, `bloque`, `torre` or `cabecera` shapes with window grids.

## S12. Originality notes and review checklist

**Never reproduce:** the partner logos or the white logo tab with logos; the illustration pack's characters, poses or compositions one by one; the identity's photographs, photo collages or isometric terrain models; the real outlines of Medellín, of the Valle de Aburrá or of any municipality (the contour line is always seeded); any map from the source report; the signature of any illustrator; any brand's typeface or color system beyond the general traits described here.

**Review checklist** (pass/fail on the style test sheet and every snapshot):

1. The machine never has eyes, a face, a mouth, limbs or a body: the lamp and its family are small objects built from the lamp's parts.
2. Pole A and pole B are unmistakable at a glance: warm filled shapes on paper versus thin bright-green lines on the dark map panel, and the panel never covers a person.
3. Every legend item shows its color, its sign, its label and an `ink` outline of 2 px or more; no legend color appears as decoration.
4. Every number is in the body face with tabular figures; no number is in the mono face or in any display lettering, and no number counts up.
5. There are no gradients, drop shadows, glows on the human side, 3D or perspective tilts.
6. Meaning zones are bare: no signs, texture or ambient motion inside figure cards, charts, legends or compared columns.
7. The contour line is a seeded wandering line, not the outline of a real place, and no political border or real map is drawn anywhere.
8. People are friendly and diverse: different skin roles side by side, women and men in every role, no teeth, no grotesque or frightening features; clothing uses `accent-1` to `accent-3` as cast entries say.
9. Text keeps the 72 px margin, sits on a ground or a label bar, and meets the contrast pairs of S3; `accent-6` is never used for text on `ground`.
10. Nothing is copied from a specific work: no logo, no traced illustration, no photograph, no reproduced map.

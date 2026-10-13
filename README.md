# Southport Historical Society — Website

Static rebuild of [southporthistoricalsociety.org](https://southporthistoricalsociety.org),
migrated off WordPress/Avada to plain static files hosted on GitHub Pages.

## Status

Phase 0 (setup). See the migration assessment for the full plan:
`website-maintenance/files/github-migration-assessment.md` (in Pax's workspace;
a copy will live in `docs/` here once the build starts).

## Layout (planned)

- `index.html` — homepage (announcements block is data-driven; see `data/announcements.json`)
- `data/` — structured content edited for routine updates (announcements, etc.)
- `programs/`, `about-southport-historical-society/`, `get-involved/` — content pages
- `assets/` — images, CSS, JS (mirrors the WordPress media library)
- `docs/` — build notes, volunteer maintenance guide (`docs/VOLUNTEER-GUIDE.md`)

## Maintenance

Routine updates do **not** require editing HTML by hand. See
`docs/VOLUNTEER-GUIDE.md` (to be written in Phase 1): describe the change in
plain English → an AI assistant makes it → you review the preview → approve →
it goes live. Every change is versioned; any change can be rolled back.

## Ground rules

- Nothing here goes live at the real domain until the society signs off.
- Every page keeps its existing URL.
- The live WordPress site is untouched until cutover.

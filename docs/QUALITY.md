# Site Check Notes

## Browser Snapshot

Latest local check against `http://127.0.0.1:8123/index.html`:

- Checks: `7 / 7`
- Console errors: none
- Horizontal overflow: none
- Images loaded: 8 across the homepage and public case/check routes
- Quick-link items: 12
- Case links: 3
- Check tabs/panels: 4 / 4
- Visitor route default: Recruiter route with Skills map, Project cases, Contact route

## Public Check Surface

- Public checks page: `quality.html`
- Custom GitHub Pages fallback: `404.html`
- Case-study screenshots are generated through `npm run capture:screenshots`
- Longer project notes live in `projects/voltage.html`, `projects/portfolio.html`, and `projects/lab.html`

## Guardrails

- Keep claims tied to visible project work.
- Avoid decorative features that do not improve inspection, navigation, or contact.
- Test desktop and mobile after layout changes.
- Keep production credentials out of static files.

## Document QA Note

`deliverables/Vladyslav_Kikhtenko_Portfolio_Brief.docx` was generated and structurally checked:

- Paragraphs: 9
- Tables: 2
- Table rows: 1 and 3
- File size: non-empty

Visual DOCX render QA is pending in an environment with LibreOffice/`soffice`; structural checks passed locally.

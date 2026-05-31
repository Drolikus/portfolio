# Quality Notes

## Browser QA Snapshot

Latest local check against `http://127.0.0.1:8123/index.html`:

- Live audit: `7 / 7`
- Console errors: none
- Horizontal overflow: none
- Images loaded: 8 across the homepage and public case/quality routes
- Command items: 13
- Proof targets: 8
- Quality tabs/panels: 4 / 4
- Visitor route default: Recruiter route with Skills evidence, Project proof, Contact route

## Public Quality Surface

- Public quality page: `quality.html`
- Custom GitHub Pages fallback: `404.html`
- Case-study screenshots are generated through `npm run capture:screenshots`
- Deep project proof lives in `projects/voltage.html`, `projects/portfolio.html`, and `projects/lab.html`

## HyperFrames QA Snapshot

Project: `portfolio-walkthrough`

Command:

```bash
npm run check
```

Result:

- Lint: 0 errors, 0 warnings
- Validate: 0 errors
- Inspect: 0 errors, 0 warnings

Known harmless runtime warning:

- Browser AudioContext warning from the preview environment. The reel does not use audio.

## Guardrails

- Keep claims tied to visible proof blocks.
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

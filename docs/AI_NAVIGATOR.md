# AI Portfolio Navigator

## Goal

Add a small assistant that helps visitors choose the right route through the portfolio:

- Recruiter: skills, project proof, contact fit.
- Client: responsive UI, scope, delivery style.
- Mentor: quality gate, code direction, next learning steps.

## Non-Negotiable Security Rule

Do not call OpenAI directly from `index.html` or `js/main.js`. The API key must stay server-side only.

## Recommended Architecture

```text
Browser UI
  -> /api/portfolio-navigator
    -> OpenAI Responses API
    -> short structured answer
  <- route, sections, suggested message
```

## Model Contract

The assistant should return structured JSON:

```json
{
  "visitor_type": "recruiter",
  "recommended_sections": ["skills", "projects", "quality-gate", "contact"],
  "summary": "Short visitor-specific guidance.",
  "message_starter": "A short contact message draft."
}
```

## Data The Assistant Can Use

- Public page copy from `index.html`.
- Project status from `README.md`, `CHANGELOG.md`, and `ROADMAP.md`.
- Quality notes from `docs/QUALITY.md`.
- No private email, no tokens, no local machine paths.

## Implementation Path

1. Deploy the static site to Vercel, Netlify, or Cloudflare Pages.
2. Add a serverless or edge function for `/api/portfolio-navigator`.
3. Store `OPENAI_API_KEY` in the host's environment variables.
4. Call the OpenAI Responses API from the function.
5. Add a compact UI panel only after backend smoke tests pass.

## Why Not Now

The portfolio is currently static. Adding a simulated assistant would be misleading without a backend boundary, request limits, and monitored errors. The right version should ship only when the server-side path is real and testable.

## References

- OpenAI Responses API: https://platform.openai.com/docs/api-reference/responses
- OpenAI text generation guide: https://platform.openai.com/docs/guides/text
- OpenAI streaming guide: https://platform.openai.com/docs/guides/streaming-responses

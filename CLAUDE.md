# Campus Lost & Found Portal

Full spec is in `SPEC.md`. Read it before starting anything new.

## Hard constraints

- Plain HTML, CSS and vanilla JavaScript on the frontend. No React, no Vue, no
  Tailwind, no bundler, no build step. If a task seems to need a framework,
  say so and ask before adding one.
- Node.js + Express on the backend. Storage is `data/items.json` via `fs` —
  not a database, not an ORM, not SQLite.
- Exactly three API routes: `POST /api/items`, `GET /api/items`,
  `PATCH /api/items/:id`. Ask before adding a fourth.
- Keep dependencies near zero. `express` is expected. Anything beyond that
  needs a reason.

## Working style

- This is a portfolio project. The author has to explain every line in an
  interview, so favour obvious code over clever code. No abstractions that
  exist only for elegance.
- One step from the SPEC build order per turn. Run it and show it working
  before moving on.
- Commit after every step that runs.
- When you make a design decision I didn't specify, say what you chose and why
  in one line.

## Commands

- `node server.js` — start the server on port 3000
- `npm install` — install dependencies

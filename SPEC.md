# Campus Lost & Found Portal — Spec

## What it is

A web app for a college campus where students post items they've lost or found,
search what others have posted, and mark an item as claimed once it's returned.

Replaces the current system: scattered WhatsApp group messages that get buried
within a day.

## Who uses it

Students at NIT Warangal. No login, no roles, no admin. Anyone can post, anyone
can search, the person who posted marks it claimed.

## Stack — fixed, do not substitute

- Frontend: plain HTML, CSS, JavaScript. No React, no Tailwind, no build step.
- Backend: Node.js + Express.
- Storage: a JSON file on disk (`data/items.json`), read/written with `fs`.
  No database.
- No image uploads in v1. Items can carry an optional image URL.

Reason for these constraints: this is a portfolio project that has to be
explained end to end in an interview. Every line needs to be something the
author can defend. Simple and readable beats clever.

## Data model

One entity: `item`.

```
{
  id:          string   // uuid or timestamp-based
  type:        "lost" | "found"
  title:       string   // "Black Boat earbuds case"
  description: string
  category:    "electronics" | "documents" | "keys" | "clothing" | "books" | "other"
  location:    string   // "Near Lecture Hall Complex"
  date:        string   // ISO date the item was lost or found
  contactName: string
  contactInfo: string   // email or phone
  imageUrl:    string | null
  status:      "open" | "claimed"
  createdAt:   string   // ISO timestamp
}
```

## API — exactly three routes

| Method | Path              | Purpose |
|--------|-------------------|---------|
| POST   | `/api/items`      | Create a new lost or found item. Validates required fields, returns 400 with a useful message on bad input. |
| GET    | `/api/items`      | List items. Supports query params: `type`, `category`, `status`, `q` (free-text search across title, description and location). Filters combine with AND. Newest first. |
| PATCH  | `/api/items/:id`  | Update an item's status to `claimed`. 404 if the id doesn't exist. |

Do not add more routes without asking first. Three routes is the agreed scope.

## Frontend

Single page, no router.

- Header with the app name and a "Post an item" button.
- Filter bar: Lost / Found / All toggle, category dropdown, search box, and a
  checkbox to show claimed items (hidden by default).
- Results as a responsive card grid. Each card shows type badge, title,
  category, location, date, contact, and a "Mark as claimed" button.
- Post form: a modal or a section that slides open. Client-side validation
  before it hits the API.
- Empty state when no items match the filters.
- Responsive down to mobile using CSS Grid and Flexbox.
- Clean, calm visual design. Pick one accent colour and stick to it. Lost and
  found items should be visually distinguishable at a glance.

## Build order

Do not jump ahead. Each step must run before the next one starts.

1. **Skeleton** — `git init`, `.gitignore`, `package.json`, `server.js` serving
   a static "hello" page on port 3000. Confirm it runs. Commit.
2. **Data layer** — `data/items.json` with 6–8 realistic seed items, plus a
   small module that reads and writes it. Commit.
3. **API** — the three routes, tested with curl. Commit.
4. **Frontend read path** — page loads items from `GET /api/items` and renders
   the card grid. Commit.
5. **Filters and search** — wire the filter bar to query params on the API.
   Commit.
6. **Post form** — the create flow against `POST /api/items`. Commit.
7. **Claim flow** — "Mark as claimed" against `PATCH /api/items/:id`. Commit.
8. **Polish** — responsive pass, empty states, loading states, error handling
   when the API is down. Commit.
9. **README** — what it does, how to run it, the API table, one screenshot.

## Out of scope for v1

Authentication, user accounts, a real database, file/image upload, email
notifications, admin moderation, deployment. Note them in the README as
"possible next steps" instead of building them.

## Definition of done for v1

A visitor can open `http://localhost:3000`, see existing items, filter and
search them, post a new one, and mark one as claimed — with the data surviving
a server restart.

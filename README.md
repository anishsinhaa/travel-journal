# My Travel Journal

A social travel journal: share trips and photos, explore other travelers, and interact with likes, comments, and follows.

**Live site:** https://mytraveljournal-as.netlify.app

This folder is the **React frontend**. The API lives in the sibling folder `../travel-journal-api`. You need **both** running locally.

## Features

- Google sign-in, plus email/password for demo accounts
- **Explore** — photo and trip feeds with a single search bar (`?q=` for location, author, date, caption)
- **My Travels** — your profile: trips + standalone photos only (trip-linked photos stay inside trips)
- Trip detail: photo strip, carousel, map, likes, comments
- Photo detail: full photo fitted to the viewport, lightbox carousel, likes, comments
- **Comments** — authors can edit/delete their own comments; post owners can delete comments on their posts (not edit others)
- Follow users, in-app notifications (follow, likes, comments)
- Edit trips/photos, edit profile (display name + bio)
- Block users and report content
- Dark mode (persisted in `localStorage`)
- Lazy-loaded images with placeholders (`SmartImage`)

## Tech stack

| Layer | Stack |
|-------|--------|
| Frontend | React (CRA), React Router, SCSS + CSS Modules, Iconify |
| Backend | Node.js, Express (`travel-journal-api`) |
| Data | Firebase Auth, Firestore, Cloud Storage |

## How to run locally

You need **Node.js** (18+ recommended) and two terminals. Run the API first, then the frontend.

### 1. API — `travel-journal-api`

```bash
cd C:\Work\Anish\travel-journal-api
copy .env.example .env
```

Put a Firebase Admin service account JSON at `travel-journal-api/serviceAccountKey.json` (or set `FIREBASE_SERVICE_ACCOUNT` in `.env` to the JSON string).

`.env` should look like:

```
PORT=5000
CLIENT_ORIGIN=http://localhost:3000
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json
```

Then:

```bash
npm install
npm run dev
```

You should see: `Travel Journal API running on port 5000`

Health check: http://localhost:5000/api/health

### 2. Frontend — `travel-journal`

In a **second** terminal:

```bash
cd C:\Work\Anish\travel-journal
copy .env.example .env
```

`.env` should be:

```
REACT_APP_API_URL=http://localhost:5000/api
```

Then:

```bash
npm install
npm start
```

App: http://localhost:3000

Sign in with Google, or email/password for seeded demo accounts. After changing API routes, restart the API (`Ctrl+C`, then `npm run dev` again). After frontend CSS/JS changes, a hard refresh (`Ctrl+Shift+R`) is enough.

### 3. Dummy data (optional)

Firestore profiles cannot log in by themselves. The seed script creates **Firebase Auth users** (email + password + UID) and posts for them.

Full notes: [`../travel-journal-api/SEED.md`](../travel-journal-api/SEED.md)

**Firebase Console (required once):** Authentication → Sign-in method → enable **Email/Password**.

```powershell
cd C:\Work\Anish\travel-journal-api
npm run seed
```

Reset seeded content:

```powershell
npm run seed:clear
```

Then open http://localhost:3000/signin and use **Sign in with email**.

| Name | Email | Password |
|------|--------|----------|
| Maya Chen | `maya.seed@traveljournal.dev` | `TravelSeed123!` |
| Leo Vargas | `leo.seed@traveljournal.dev` | `TravelSeed123!` |
| Priya Nair | `priya.seed@traveljournal.dev` | `TravelSeed123!` |
| Jonas Berg | `jonas.seed@traveljournal.dev` | `TravelSeed123!` |
| Amira Hassan | `amira.seed@traveljournal.dev` | `TravelSeed123!` |

Creates 5 travelers, 9 trips, trip photos, 3 standalone photos, comments, likes, and follows. Images are free Unsplash URLs (not uploaded to Storage). Your Google account and its posts are left alone.

### Windows PowerShell notes

- Use `;` instead of `&&` if chaining commands: `cd travel-journal; npm start`
- `copy .env.example .env` works in PowerShell (or `Copy-Item .env.example .env`)

## Project structure

```
travel-journal/src/
  api/           API client (Bearer token from Firebase Auth)
  components/    UI (CommentItem, SmartImage, PhotoCarousel, …)
  context/       AuthContext
  pages/         Route pages
  styles/        global.scss, _tokens.scss, CSS modules
travel-journal-api/src/
  routes/        Express routes (feed, trips, photos, comments, users, moderation)
  utils/         notifications, users helpers
  middleware/    Firebase token auth
```

## Deploy

### Backend (Render)

Blueprint: `travel-journal-api/render.yaml`

- **Build:** `npm install`
- **Start:** `npm start`
- **Health:** `/api/health`
- **Env vars:**
  - `FIREBASE_SERVICE_ACCOUNT` — service account JSON as a single-line string
  - `CLIENT_ORIGIN` — `https://mytraveljournal-as.netlify.app`
  - `PORT` — `5000` (or leave Render default)

### Frontend (Netlify)

- **Build:** `npm run build`
- **Publish:** `build`
- **Env:** `REACT_APP_API_URL` = live API URL + `/api`  
  Example: `https://travel-journal-api-5lbc.onrender.com/api`

`netlify.toml` already has SPA redirects (`/*` → `index.html`).

## Screenshots

Add screenshots to `docs/screenshots/` for portfolio use (Explore, trip detail, photo detail, notifications).

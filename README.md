# Catalyst API

Backend service for Catalyst. It provides Google OAuth login, MongoDB-backed sessions, checklist progress, and finance transactions.

## Setup

1. Copy `.env.example` to `.env`.
2. Fill `MONGODB_URI`, `SESSION_SECRET`, `GOOGLE_CLIENT_ID`, and `GOOGLE_CLIENT_SECRET`.
3. In Google Cloud Console, add this OAuth redirect URI:

```text
http://localhost:4000/api/auth/google/callback
```

4. Install and run:

```bash
npm install
npm run dev
```

For local development, the frontend dev server proxies `/api` to the backend.
If you call the backend directly instead, use:

```text
VITE_API_BASE_URL=http://localhost:4000
```

## Production OAuth URLs

When the frontend is deployed to Netlify and the backend is deployed elsewhere,
route API traffic through the frontend Netlify site so the session cookie stays
first-party in Safari and other strict browsers. The backend env should use the
frontend domain for both `CLIENT_URL` and `GOOGLE_CALLBACK_URL`:

```text
GOOGLE_CALLBACK_URL=https://catalyst-temp.netlify.app/api/auth/google/callback
CLIENT_URL=https://catalyst-temp.netlify.app
```

Also add the exact `GOOGLE_CALLBACK_URL` value to Google Cloud Console under
OAuth Authorized redirect URIs:

```text
https://catalyst-temp.netlify.app/api/auth/google/callback
```

Google treats a trailing slash as a different redirect URI, so do not add
`/callback/` unless `GOOGLE_CALLBACK_URL` also ends with `/callback/`.

The frontend Google login button should start OAuth at
`https://catalyst-temp.netlify.app/api/auth/google`. It should not link directly
to `/api/auth/google/callback`; Google redirects to the callback after the user
approves the login. The frontend Netlify site proxies `/api/*` to the backend
Netlify site.

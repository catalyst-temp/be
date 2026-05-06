# Catalyst API

Backend service for Catalyst. It provides Google OAuth login, MongoDB-backed sessions, checklist progress, and finance transactions.

## Setup

1. Copy `.env.example` to `.env`.
2. Fill `MONGODB_URI`, `SESSION_SECRET`, `GOOGLE_CLIENT_ID`, and `GOOGLE_CLIENT_SECRET`.
3. In Google Cloud Console, add this OAuth redirect URI:

```text
http://localhost:3000/api/auth/google/callback
```

4. Install and run:

```bash
npm install
npm run dev
```

The frontend should use:

```text
VITE_API_BASE_URL=http://localhost:3000
```

## Production OAuth URLs

When the frontend is deployed to Netlify and the backend is deployed elsewhere,
the URLs must point at the deployed domains:

```text
GOOGLE_CALLBACK_URL=https://catalyst-api.netlify.app/api/auth/google/callback
CLIENT_URL=https://catalyst-temp.netlify.app
```

Also add the exact `GOOGLE_CALLBACK_URL` value to Google Cloud Console under
OAuth Authorized redirect URIs:

```text
https://catalyst-api.netlify.app/api/auth/google/callback
```

Google treats a trailing slash as a different redirect URI, so do not add
`/callback/` unless `GOOGLE_CALLBACK_URL` also ends with `/callback/`.

The frontend Google login button should start OAuth at
`https://catalyst-api.netlify.app/api/auth/google`. It should not link directly
to `/api/auth/google/callback`; Google redirects to the callback after the user
approves the login. If `VITE_API_BASE_URL` is missing in the frontend Netlify
site, the browser will try `/api/auth/google` on `catalyst-temp.netlify.app`
instead.

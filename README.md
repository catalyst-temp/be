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

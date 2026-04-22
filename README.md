# AVLC Group Website

Corporate website split into a deployable Next.js frontend and a standalone Node.js backend.

## Prerequisites

- Node.js `>= 20.9.0`
- npm `>= 10`

## Local Development

```bash
npm install
npm run dev:frontend
npm run dev:backend
```

Open the frontend at `http://localhost:3000`.
The backend runs separately at `http://localhost:4000` unless `PORT` is changed.

## Baseline Quality Gates

```bash
npm run lint
npm run build
```

## Vercel Frontend Deployment

Deploy the frontend as its own Vercel project:

- Root Directory: `frontend`
- Framework Preset: `Next.js`
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: `.next`

Set `NEXT_PUBLIC_API_BASE_URL` in the Vercel frontend environment variables to the deployed backend URL, for example:

```bash
NEXT_PUBLIC_API_BASE_URL=https://your-backend-domain.com
```

The backend should be deployed separately as a Node.js service and configured with `MONGODB_URI`, mail credentials, and the other backend environment variables from `backend/.env.example`.

## Starter Template Baseline

This project baseline follows the approved scaffold command:

```bash
npx create-next-app@latest avlc-group-website --typescript --tailwind --eslint --app --no-git
```

Use this story as foundation only; implement feature work in subsequent stories.

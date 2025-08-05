# MCP Demo App

A white-label demo builder for ThoughtSpot analytics powered by Next.js 14 and React 19.

## Getting Started

```bash
pnpm i && pnpm dev
```

Set an `OPENAI_API_KEY` in your environment to enable query refinement.
You can generate an API key from the [OpenAI dashboard](https://platform.openai.com/).

## ThoughtSpot Setup

Ensure your ThoughtSpot instance is configured with SSO and CORS for this domain.
The app communicates with ThoughtSpot using `AuthType.None`, which relies on an existing
user session in the browser; no credentials or tokens are stored.

## Deployment

Deploy on Vercel:

```bash
vercel --prod
```

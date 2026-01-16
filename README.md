# Letterkenny Slack command

Small TypeScript service that handles the `/letterkenny` Slack slash command and
returns a Letterkenny-style paraphrase.

## Setup

Environment variables:

- `SLACK_SIGNING_SECRET` (required)
- `SLACK_BOT_TOKEN` (optional, reserved for future features)
- `PORT` (optional, defaults to 3000)

Copy `env.example` to `.env` and fill in values.
(`.env.example` is blocked by repo ignores here.)

Install dependencies and run:

```
pnpm install
pnpm dev
```

Cloudflare Worker dev:

```
pnpm dev:worker
```

Set secrets for Workers:

```
pnpm wrangler secret put SLACK_SIGNING_SECRET
```

Deploy to Workers:

```
pnpm deploy:worker
```

Signed local smoke test:

```
pnpm dev:3001
pnpm send-test
```

Expose locally (for example):

```
pnpm dlx ngrok http 3000
```

## Slack app config

- Command: `/letterkenny`
- Request URL: `https://<host>/slack/command`
- Scopes: `commands` (and `chat:write` only if you want the bot to post messages)

No OAuth flow is required for v1; assume manual app setup.

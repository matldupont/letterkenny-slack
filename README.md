# Letterkenny Slack command

Small TypeScript service that handles the `/letterkenny` Slack slash command and
returns a Letterkenny-style paraphrase.

## Setup

Environment variables:

- `SLACK_SIGNING_SECRET` (required)
- `SLACK_BOT_TOKEN` (optional, reserved for future features)
- `PORT` (optional, defaults to 3000)
- `SLACK_CLIENT_ID` (required for OAuth distribution)
- `SLACK_CLIENT_SECRET` (required for OAuth distribution)
- `SLACK_REDIRECT_URI` (required for OAuth distribution)

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

Create the KV namespace and update `wrangler.toml`:

```
pnpm wrangler kv:namespace create SLACK_TOKENS
pnpm wrangler kv:namespace create SLACK_TOKENS --preview
```

Set secrets for Workers:

```
pnpm wrangler secret put SLACK_SIGNING_SECRET
pnpm wrangler secret put SLACK_CLIENT_ID
pnpm wrangler secret put SLACK_CLIENT_SECRET
pnpm wrangler secret put SLACK_REDIRECT_URI
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

Spice toggle:

- Default: thick slang
- Add `--extra` or `--spicy` at the start of your text for max slang

Expose locally (for example):

```
pnpm dlx ngrok http 3000
```

## Slack app config

- Command: `/letterkenny`
- Request URL: `https://<host>/slack/command`
- Scopes: `commands` (and `chat:write` only if you want the bot to post messages)
- OAuth redirect URL: `https://<host>/slack/oauth`
- Install URL: `https://<host>/slack/install`

For public distribution, enable OAuth and use `/slack/install` as your install
link. OAuth installs are stored in the `SLACK_TOKENS` KV namespace.

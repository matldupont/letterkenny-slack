import { parseDirectives, toLetterkenny } from "./letterkenny/transform.js";

type KVNamespace = {
  get(key: string): Promise<string | null>;
  put(
    key: string,
    value: string,
    options?: { expirationTtl?: number },
  ): Promise<void>;
  delete(key: string): Promise<void>;
};

type Env = {
  SLACK_SIGNING_SECRET?: string;
  SLACK_CLIENT_ID?: string;
  SLACK_CLIENT_SECRET?: string;
  SLACK_REDIRECT_URI?: string;
  SLACK_TOKENS: KVNamespace;
};

type VerifyInput = {
  signingSecret: string | undefined;
  timestamp: string | null;
  signature: string | null;
  rawBody: string;
  toleranceSeconds?: number;
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/healthz") {
      return jsonResponse({ ok: true }, 200);
    }

    if (url.pathname === "/slack/install" && request.method === "GET") {
      return handleInstall(env);
    }

    if (url.pathname === "/slack/oauth" && request.method === "GET") {
      return handleOauth(request, env);
    }

    if (url.pathname === "/slack/interactive" && request.method === "POST") {
      return handleInteractive(request, env);
    }

    if (url.pathname !== "/slack/command" || request.method !== "POST") {
      return new Response("Not Found", { status: 404 });
    }

    const rawBody = await request.text();
    const verified = await verifySlackRequest({
      signingSecret: env.SLACK_SIGNING_SECRET,
      timestamp: request.headers.get("X-Slack-Request-Timestamp"),
      signature: request.headers.get("X-Slack-Signature"),
      rawBody,
    });

    if (!verified) {
      return new Response("Unauthorized", { status: 401 });
    }

    const payload = parseSlashCommand(rawBody);
    if (!payload.command || payload.command !== "/letterkenny") {
      return new Response("Unsupported command", { status: 400 });
    }

    const { text, spice, post } = parseDirectives(payload.text ?? "");
    const translated = toLetterkenny(text, { spice });

    if (post) {
      const posted = await postToSlack({
        env,
        teamId: payload.team_id,
        channelId: payload.channel_id,
        responseUrl: payload.response_url,
        text: translated,
      });

      if (!posted.ok) {
        return jsonResponse(
          {
            response_type: "ephemeral",
            text: `Couldn't post to the channel: ${posted.error}`,
          },
          200,
        );
      }

      return jsonResponse(
        {
          response_type: "ephemeral",
          text: "Posted to the channel.",
        },
        200,
      );
    }

    return jsonResponse(
      {
        response_type: "ephemeral",
        text: translated,
      },
      200,
    );
  },
};

async function verifySlackRequest({
  signingSecret,
  timestamp,
  signature,
  rawBody,
  toleranceSeconds = 60 * 5,
}: VerifyInput): Promise<boolean> {
  if (!signingSecret || !timestamp || !signature) {
    return false;
  }

  const timestampNumber = Number(timestamp);
  if (!Number.isFinite(timestampNumber)) {
    return false;
  }

  const nowSeconds = Math.floor(Date.now() / 1000);
  if (Math.abs(nowSeconds - timestampNumber) > toleranceSeconds) {
    return false;
  }

  const baseString = `v0:${timestamp}:${rawBody}`;
  const expectedSignature = await signSlackBaseString(signingSecret, baseString);

  return timingSafeEqual(expectedSignature, signature);
}

async function signSlackBaseString(secret: string, baseString: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(baseString));
  const bytes = new Uint8Array(signature);
  let hex = "";
  for (const byte of bytes) {
    hex += byte.toString(16).padStart(2, "0");
  }
  return `v0=${hex}`;
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

type SlackSlashCommandPayload = {
  command?: string;
  text?: string;
  team_id?: string;
  channel_id?: string;
  response_url?: string;
};

function parseSlashCommand(rawBody: string): SlackSlashCommandPayload {
  const params = new URLSearchParams(rawBody);
  return {
    command: params.get("command") ?? undefined,
    text: params.get("text") ?? undefined,
    team_id: params.get("team_id") ?? undefined,
    channel_id: params.get("channel_id") ?? undefined,
    response_url: params.get("response_url") ?? undefined,
  };
}

function jsonResponse(payload: unknown, status: number): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
  });
}

function textResponse(text: string, status: number): Response {
  return new Response(text, {
    status,
    headers: {
      "content-type": "text/plain; charset=utf-8",
    },
  });
}

async function handleInstall(env: Env): Promise<Response> {
  if (!env.SLACK_CLIENT_ID || !env.SLACK_REDIRECT_URI) {
    return textResponse("Slack OAuth not configured.", 500);
  }

  const state = generateState();
  await env.SLACK_TOKENS.put(`state:${state}`, "1", { expirationTtl: 60 * 10 });

  const params = new URLSearchParams({
    client_id: env.SLACK_CLIENT_ID,
    scope: "commands,chat:write",
    redirect_uri: env.SLACK_REDIRECT_URI,
    state,
  });

  return Response.redirect(
    `https://slack.com/oauth/v2/authorize?${params.toString()}`,
    302,
  );
}

async function handleOauth(request: Request, env: Env): Promise<Response> {
  if (!env.SLACK_CLIENT_ID || !env.SLACK_CLIENT_SECRET || !env.SLACK_REDIRECT_URI) {
    return textResponse("Slack OAuth not configured.", 500);
  }

  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  if (error) {
    return textResponse(`Slack OAuth error: ${error}`, 400);
  }

  if (!code || !state) {
    return textResponse("Missing OAuth code or state.", 400);
  }

  const stateKey = `state:${state}`;
  const stateRecord = await env.SLACK_TOKENS.get(stateKey);
  if (!stateRecord) {
    return textResponse("Invalid OAuth state.", 400);
  }
  await env.SLACK_TOKENS.delete(stateKey);

  const tokenResponse = await fetch("https://slack.com/api/oauth.v2.access", {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: env.SLACK_CLIENT_ID,
      client_secret: env.SLACK_CLIENT_SECRET,
      redirect_uri: env.SLACK_REDIRECT_URI,
      code,
    }),
  });

  const data = (await tokenResponse.json()) as SlackOauthResponse;
  if (!data.ok) {
    return textResponse(`Slack OAuth failed: ${data.error ?? "unknown"}`, 400);
  }

  if (data.team?.id && data.access_token) {
    await env.SLACK_TOKENS.put(
      `team:${data.team.id}`,
      JSON.stringify({
        team: data.team,
        access_token: data.access_token,
        bot_user_id: data.bot_user_id,
        authed_user: data.authed_user,
        scope: data.scope,
        installed_at: new Date().toISOString(),
      }),
    );
  }

  return textResponse("Letterkenny app installed. You can close this tab.", 200);
}

type SlackOauthResponse = {
  ok: boolean;
  error?: string;
  access_token?: string;
  scope?: string;
  bot_user_id?: string;
  team?: {
    id: string;
    name?: string;
  };
  authed_user?: {
    id?: string;
    scope?: string;
    access_token?: string;
  };
};

function generateState(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  let value = "";
  for (const byte of bytes) {
    value += byte.toString(16).padStart(2, "0");
  }
  return value;
}

async function postToSlack(input: {
  env: Env;
  teamId?: string;
  channelId?: string;
  responseUrl?: string;
  text: string;
}): Promise<{ ok: boolean; error?: string }> {
  const token = input.teamId
    ? await input.env.SLACK_TOKENS.get(`team:${input.teamId}`)
    : null;
  const stored = token ? (JSON.parse(token) as { access_token?: string }) : null;
  const accessToken = stored?.access_token;

  if (accessToken && input.channelId) {
    const response = await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: {
        authorization: `Bearer ${accessToken}`,
        "content-type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        channel: input.channelId,
        text: input.text,
      }),
    });

    const data = (await response.json()) as { ok: boolean; error?: string };
    if (!data.ok) {
      return { ok: false, error: data.error ?? "chat.postMessage failed" };
    }

    return { ok: true };
  }

  if (input.responseUrl) {
    const response = await fetch(input.responseUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        response_type: "in_channel",
        text: input.text,
      }),
    });

    if (!response.ok) {
      return { ok: false, error: `response_url failed (${response.status})` };
    }

    return { ok: true };
  }

  return { ok: false, error: "No bot token or response_url available" };
}

type SlackInteractivePayload = {
  type?: string;
  response_url?: string;
  actions?: Array<{ value?: string }>;
};

async function handleInteractive(request: Request, env: Env): Promise<Response> {
  const rawBody = await request.text();
  const verified = await verifySlackRequest({
    signingSecret: env.SLACK_SIGNING_SECRET,
    timestamp: request.headers.get("X-Slack-Request-Timestamp"),
    signature: request.headers.get("X-Slack-Signature"),
    rawBody,
  });

  if (!verified) {
    return new Response("Unauthorized", { status: 401 });
  }

  const params = new URLSearchParams(rawBody);
  const payloadRaw = params.get("payload");
  if (!payloadRaw) {
    return new Response("Missing payload", { status: 400 });
  }

  let payload: SlackInteractivePayload;
  try {
    payload = JSON.parse(payloadRaw) as SlackInteractivePayload;
  } catch {
    return new Response("Invalid payload", { status: 400 });
  }

  if (payload.type !== "block_actions") {
    return new Response("Unsupported payload", { status: 400 });
  }

  const text = payload.actions?.[0]?.value;
  if (!text) {
    return new Response("Missing action text", { status: 400 });
  }

  const posted = await postToSlack({
    env,
    responseUrl: payload.response_url,
    text,
  });

  if (!posted.ok) {
    return jsonResponse(
      {
        response_type: "ephemeral",
        text: `Couldn't post to the channel: ${posted.error}`,
        replace_original: false,
      },
      200,
    );
  }

  return jsonResponse(
    {
      response_type: "ephemeral",
      text: "Posted to the channel.",
      replace_original: true,
    },
    200,
  );
}

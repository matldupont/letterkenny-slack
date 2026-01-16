import { toLetterkenny } from "./letterkenny/transform.js";

type Env = {
  SLACK_SIGNING_SECRET?: string;
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

    const translated = toLetterkenny(payload.text ?? "");
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
};

function parseSlashCommand(rawBody: string): SlackSlashCommandPayload {
  const params = new URLSearchParams(rawBody);
  return {
    command: params.get("command") ?? undefined,
    text: params.get("text") ?? undefined,
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

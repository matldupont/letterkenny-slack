import { verifySlackRequest } from "./verify.js";

type HandlerInput = {
  rawBody: string;
  headers: Record<string, string | string[] | undefined>;
  signingSecret: string;
};

type HandlerResult = {
  status: number;
  headers?: Record<string, string>;
  body: string;
};

type SlackInteractivePayload = {
  type?: string;
  response_url?: string;
  actions?: Array<{ value?: string }>;
};

export async function handleSlackInteractive({
  rawBody,
  headers,
  signingSecret,
}: HandlerInput): Promise<HandlerResult> {
  if (!rawBody) {
    return { status: 400, body: "Missing body" };
  }

  const timestamp = headerValue(headers, "x-slack-request-timestamp");
  const signature = headerValue(headers, "x-slack-signature");

  const verified = verifySlackRequest({
    signingSecret,
    timestamp,
    signature,
    rawBody,
  });

  if (!verified) {
    return { status: 401, body: "Unauthorized" };
  }

  const payload = parseInteractivePayload(rawBody);
  if (!payload || payload.type !== "block_actions") {
    return { status: 400, body: "Unsupported payload" };
  }

  const text = payload.actions?.[0]?.value;
  if (!text) {
    return { status: 400, body: "Missing action text" };
  }

  const posted = await postMessage({
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

function parseInteractivePayload(rawBody: string): SlackInteractivePayload | null {
  const params = new URLSearchParams(rawBody);
  const payload = params.get("payload");
  if (!payload) {
    return null;
  }

  try {
    return JSON.parse(payload) as SlackInteractivePayload;
  } catch {
    return null;
  }
}

function jsonResponse(payload: unknown, status: number): HandlerResult {
  return {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
  };
}

async function postMessage(input: {
  responseUrl?: string;
  text: string;
}): Promise<{ ok: boolean; error?: string }> {
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

  return { ok: false, error: "No response_url available" };
}

function headerValue(
  headers: Record<string, string | string[] | undefined>,
  name: string,
): string | undefined {
  const value = headers[name];
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
}

import { parseDirectives, toLetterkenny } from "../letterkenny/transform.js";
import { verifySlackRequest } from "./verify.js";

export type SlackSlashCommandPayload = {
  token?: string;
  team_id?: string;
  team_domain?: string;
  channel_id?: string;
  channel_name?: string;
  user_id?: string;
  user_name?: string;
  command?: string;
  text?: string;
  response_url?: string;
  trigger_id?: string;
};

type HandlerInput = {
  rawBody: string;
  headers: Record<string, string | string[] | undefined>;
  signingSecret: string;
  botToken?: string;
};

type HandlerResult = {
  status: number;
  headers?: Record<string, string>;
  body: string;
};

export async function handleSlackCommand({
  rawBody,
  headers,
  signingSecret,
  botToken,
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

  const payload = parseSlashCommand(rawBody);
  if (!payload.command || payload.command !== "/letterkenny") {
    return { status: 400, body: "Unsupported command" };
  }

  const { text, spice, post } = parseDirectives(payload.text ?? "");
  const translated = toLetterkenny(text, { spice });

  if (post) {
    const posted = await postMessage({
      botToken,
      responseUrl: payload.response_url,
      channelId: payload.channel_id,
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
    buildPromptResponse(translated),
    200,
  );
}

function parseSlashCommand(rawBody: string): SlackSlashCommandPayload {
  const params = new URLSearchParams(rawBody);
  const payload: SlackSlashCommandPayload = {};

  for (const [key, value] of params.entries()) {
    payload[key as keyof SlackSlashCommandPayload] = value;
  }

  return payload;
}

function jsonResponse(payload: unknown, status: number): HandlerResult {
  return {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
  };
}

function buildPromptResponse(text: string): {
  response_type: "ephemeral";
  text: string;
  blocks: Array<Record<string, unknown>>;
} {
  const buttonValue = trimToMax(text, 2000);
  const displayText = trimToMax(text, 3000);

  return {
    response_type: "ephemeral",
    text: displayText,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Letterkenny:*\n${displayText}`,
        },
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "Post to channel",
            },
            action_id: "post_translation",
            value: buttonValue,
          },
        ],
      },
    ],
  };
}

async function postMessage(input: {
  botToken?: string;
  responseUrl?: string;
  channelId?: string;
  text: string;
}): Promise<{ ok: boolean; error?: string }> {
  if (input.botToken && input.channelId) {
    const response = await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: {
        authorization: `Bearer ${input.botToken}`,
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

  return { ok: false, error: "No bot token or response_url configured" };
}

function trimToMax(text: string, max: number): string {
  if (text.length <= max) {
    return text;
  }
  return `${text.slice(0, max - 1)}…`;
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

import { parseSpiceDirective, toLetterkenny } from "../letterkenny/transform.js";
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
};

type HandlerResult = {
  status: number;
  headers?: Record<string, string>;
  body: string;
};

export function handleSlackCommand({
  rawBody,
  headers,
  signingSecret,
}: HandlerInput): HandlerResult {
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

  const { text, spice } = parseSpiceDirective(payload.text ?? "");
  const translated = toLetterkenny(text, { spice });
  const body = JSON.stringify({
    response_type: "ephemeral",
    text: translated,
  });

  return {
    status: 200,
    headers: { "content-type": "application/json; charset=utf-8" },
    body,
  };
}

function parseSlashCommand(rawBody: string): SlackSlashCommandPayload {
  const params = new URLSearchParams(rawBody);
  const payload: SlackSlashCommandPayload = {};

  for (const [key, value] of params.entries()) {
    payload[key as keyof SlackSlashCommandPayload] = value;
  }

  return payload;
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

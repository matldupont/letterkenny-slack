import crypto from "node:crypto";

const port = process.env.PORT ?? "3001";
const signingSecret = process.env.SLACK_SIGNING_SECRET ?? "devsecret";

const params = new URLSearchParams({
  token: "fake",
  team_id: "T123",
  channel_id: "C123",
  user_id: "U123",
  command: "/letterkenny",
  text: "I'm really tired today",
});

const rawBody = params.toString();
const timestamp = Math.floor(Date.now() / 1000).toString();
const base = `v0:${timestamp}:${rawBody}`;
const signature =
  "v0=" +
  crypto.createHmac("sha256", signingSecret).update(base, "utf8").digest("hex");

const response = await fetch(`http://localhost:${port}/slack/command`, {
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    "X-Slack-Request-Timestamp": timestamp,
    "X-Slack-Signature": signature,
  },
  body: rawBody,
});

const body = await response.text();
console.log(body);

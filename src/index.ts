import "dotenv/config";
import express from "express";
import { handleSlackCommand } from "./slack/handler.js";
import { handleSlackInteractive } from "./slack/interactive.js";

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

app.post(
  "/slack/command",
  express.raw({ type: "application/x-www-form-urlencoded" }),
  async (req, res) => {
    const rawBody =
      req.body instanceof Buffer ? req.body.toString("utf8") : "";

    const result = await handleSlackCommand({
      rawBody,
      headers: req.headers,
      signingSecret: process.env.SLACK_SIGNING_SECRET ?? "",
      botToken: process.env.SLACK_BOT_TOKEN ?? "",
    });

    res.status(result.status);
    if (result.headers) {
      for (const [key, value] of Object.entries(result.headers)) {
        res.setHeader(key, value);
      }
    }
    res.send(result.body);
  },
);

app.post(
  "/slack/interactive",
  express.raw({ type: "application/x-www-form-urlencoded" }),
  async (req, res) => {
    const rawBody =
      req.body instanceof Buffer ? req.body.toString("utf8") : "";

    const result = await handleSlackInteractive({
      rawBody,
      headers: req.headers,
      signingSecret: process.env.SLACK_SIGNING_SECRET ?? "",
      botToken: process.env.SLACK_BOT_TOKEN ?? "",
    });

    res.status(result.status);
    if (result.headers) {
      for (const [key, value] of Object.entries(result.headers)) {
        res.setHeader(key, value);
      }
    }
    res.send(result.body);
  },
);

app.get("/healthz", (_req, res) => {
  res.json({ ok: true });
});

app.listen(port, () => {
  console.log(`letterkenny server listening on :${port}`);
});

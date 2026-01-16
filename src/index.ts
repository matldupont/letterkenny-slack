import "dotenv/config";
import express from "express";
import { handleSlackCommand } from "./slack/handler.js";

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

app.post(
  "/slack/command",
  express.raw({ type: "application/x-www-form-urlencoded" }),
  (req, res) => {
    const rawBody =
      req.body instanceof Buffer ? req.body.toString("utf8") : "";

    const result = handleSlackCommand({
      rawBody,
      headers: req.headers,
      signingSecret: process.env.SLACK_SIGNING_SECRET ?? "",
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

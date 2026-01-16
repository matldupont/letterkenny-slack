import crypto from "node:crypto";

type VerifyInput = {
  signingSecret: string;
  timestamp: string | undefined;
  signature: string | undefined;
  rawBody: string;
  toleranceSeconds?: number;
};

export function verifySlackRequest({
  signingSecret,
  timestamp,
  signature,
  rawBody,
  toleranceSeconds = 60 * 5,
}: VerifyInput): boolean {
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
  const hash = crypto
    .createHmac("sha256", signingSecret)
    .update(baseString, "utf8")
    .digest("hex");
  const expectedSignature = `v0=${hash}`;

  try {
    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature, "utf8"),
      Buffer.from(signature, "utf8"),
    );
  } catch {
    return false;
  }
}

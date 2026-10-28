import { createGateway } from "ai";

/**
 * Toolkit v2 reverse proxy — forwards requests to the Vercel AI Gateway.
 * Server-only: the secret key must never reach client code.
 */
const toolkitUrl = process.env.EXPO_PUBLIC_TOOLKIT_URL ?? "https://toolkit.rork.com";
const secretKey = process.env.EXPO_PUBLIC_RORK_TOOLKIT_SECRET_KEY ?? "";

export const gateway = createGateway({
  baseURL: `${toolkitUrl}/v2/vercel/v3/ai`,
  apiKey: secretKey,
});

/** Fast, recent Anthropic model on the AI Gateway — good fit for chat. */
export const CHAT_MODEL = "anthropic/claude-haiku-5.5";

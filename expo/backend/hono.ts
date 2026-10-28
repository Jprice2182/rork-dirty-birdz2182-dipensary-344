import { Hono, type Context } from "hono";
import { trpcServer } from "@hono/trpc-server";
import { cors } from "hono/cors";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { appRouter } from "./trpc/app-router";
import { createContext } from "./trpc/create-context";
import { budtenderSystemPrompt } from "./ai/budtender";
import { CHAT_MODEL, gateway } from "./ai/gateway";

// app will be mounted at /api
const app = new Hono();

// Enable CORS for all routes
app.use("*", cors());

// Mount tRPC router at /trpc
app.use(
  "/trpc/*",
  trpcServer({
    endpoint: "/api/trpc",
    router: appRouter,
    createContext,
  })
);

// AI Budtender chat — streamed via the Toolkit v2 proxy (Vercel AI Gateway).
const handleChat = async (c: Context) => {
  try {
    const { messages }: { messages: UIMessage[] } = await c.req.json();
    if (!Array.isArray(messages) || messages.length === 0) {
      return c.json({ error: "messages array is required" }, 400);
    }

    const result = streamText({
      model: gateway(CHAT_MODEL),
      system: budtenderSystemPrompt(),
      messages: await convertToModelMessages(messages),
      temperature: 0.7,
      maxOutputTokens: 800,
    });

    return result.toUIMessageStreamResponse({
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Encoding": "none",
      },
    });
  } catch (error) {
    console.error("[ai-chat] request failed:", error);
    return c.json({ error: "Failed to get a response" }, 500);
  }
};

// Registered under both paths: the hono app's mount prefix (/api) varies by
// environment, so /api/chat and /chat resolve to the same handler.
app.post("/api/chat", handleChat);
app.post("/chat", handleChat);

// Simple health check endpoint
app.get("/", (c) => {
  return c.json({ status: "ok", message: "API is running" });
});

export default app;
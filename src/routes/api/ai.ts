import { createFileRoute } from "@tanstack/react-router";
import { streamText } from "ai";
import { AI_MODEL, createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

type Msg = { role: "user" | "assistant"; content: string };

export const Route = createFileRoute("/api/ai")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env["LOVABLE_API_KEY"];
        if (!key) {
          return new Response("AI is not configured (missing key).", { status: 500 });
        }

        let body: { system?: string; messages?: Msg[] };
        try {
          body = await request.json();
        } catch {
          return new Response("Invalid request body.", { status: 400 });
        }

        const messages = Array.isArray(body.messages) ? body.messages.slice(-30) : [];
        if (messages.length === 0) {
          return new Response("No messages provided.", { status: 400 });
        }

        const gateway = createLovableAiGatewayProvider(key);

        try {
          const result = streamText({
            model: gateway(AI_MODEL),
            system:
              (body.system ?? "You are a helpful workplace productivity assistant.") +
              "\n\nAlways answer in clean markdown. Be concise, practical and professional. Never invent facts, figures, names or quotes — if information is missing, state your assumptions explicitly.",
            messages,
          });

          return result.toTextStreamResponse();
        } catch (error) {
          const message = error instanceof Error ? error.message : "AI request failed.";
          return new Response(message, { status: 502 });
        }
      },
    },
  },
});

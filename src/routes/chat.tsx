import { createFileRoute } from "@tanstack/react-router";
import { Bot, Loader2, Send, Sparkles, Trash2, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { AppShell } from "@/components/app-shell";
import { ToolPage } from "@/components/tool-page";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAiStream, type AiMessage } from "@/lib/use-ai-stream";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Workplace Assistant | WorkFlow AI" },
      {
        name: "description",
        content:
          "Chat with an AI workplace assistant for drafting, planning, difficult conversations and process advice.",
      },
      { property: "og:title", content: "AI Workplace Assistant | WorkFlow AI" },
      {
        property: "og:description",
        content: "An interactive AI colleague that keeps the full conversation in context.",
      },
    ],
  }),
  component: ChatPage,
});

const SYSTEM = `You are "WorkFlow AI", a pragmatic workplace productivity assistant for professionals.

- Give specific, actionable answers; ask ONE clarifying question only when the request is genuinely ambiguous.
- Structure longer answers with short headings and bullets.
- Stay within workplace scope: communication, planning, documentation, meetings, process and career admin.
- Refuse to give legal, medical or financial advice, and recommend a qualified human instead.
- Be transparent about uncertainty and never fabricate facts, sources or numbers.`;

const STARTERS = [
  "Help me say no to extra work without damaging the relationship",
  "Draft an agenda for a 30-minute project kickoff",
  "How do I structure a weekly status update for leadership?",
  "Turn these goals into SMART objectives",
];

function ChatPage() {
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [input, setInput] = useState("");
  const { isLoading, error, run } = useAiStream();
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;
    const next: AiMessage[] = [...messages, { role: "user", content: trimmed }];
    setMessages([...next, { role: "assistant", content: "" }]);
    setInput("");

    await run(SYSTEM, next, (full) => {
      setMessages([...next, { role: "assistant", content: full }]);
    });
  };

  return (
    <AppShell>
      <ToolPage
        icon={Bot}
        title="AI Workplace Assistant"
        description="An interactive assistant that keeps the whole conversation in context — ask follow-ups and refine as you go."
      >
        <div className="surface-card flex h-[62vh] min-h-[420px] flex-col rounded-2xl border border-border">
          <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
            <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Conversation
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5"
              disabled={messages.length === 0}
              onClick={() => setMessages([])}
            >
              <Trash2 className="size-3.5" /> Clear
            </Button>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            {messages.length === 0 ? (
              <div className="space-y-4">
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Sparkles className="size-4 text-primary" /> Start with one of these, or ask
                  anything work-related.
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {STARTERS.map((s) => (
                    <button
                      key={s}
                      onClick={() => void send(s)}
                      className="rounded-xl border border-border bg-secondary/50 p-3 text-left text-sm transition-colors hover:bg-secondary"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {messages.map((m, i) => (
              <div
                key={i}
                className={m.role === "user" ? "flex justify-end gap-3" : "flex gap-3"}
              >
                {m.role === "assistant" ? (
                  <span className="gradient-hero flex size-7 shrink-0 items-center justify-center rounded-lg">
                    <Bot className="size-4 text-primary-foreground" />
                  </span>
                ) : null}
                <div
                  className={
                    m.role === "user"
                      ? "max-w-[85%] rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground"
                      : "prose-ai max-w-[85%] rounded-2xl rounded-tl-sm bg-secondary px-4 py-2.5 text-secondary-foreground"
                  }
                >
                  {m.role === "assistant" ? (
                    m.content ? (
                      <ReactMarkdown>{m.content}</ReactMarkdown>
                    ) : (
                      <Loader2 className="size-4 animate-spin" />
                    )
                  ) : (
                    m.content
                  )}
                </div>
                {m.role === "user" ? (
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-secondary">
                    <User className="size-4 text-secondary-foreground" />
                  </span>
                ) : null}
              </div>
            ))}

            {error ? (
              <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</p>
            ) : null}
            <div ref={endRef} />
          </div>

          <div className="border-t border-border p-3">
            <div className="flex items-end gap-2">
              <Textarea
                rows={2}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void send(input);
                  }
                }}
                placeholder="Ask anything about your work day… (Enter to send, Shift+Enter for a new line)"
                className="min-h-[52px] resize-none"
              />
              <Button
                onClick={() => void send(input)}
                disabled={isLoading || !input.trim()}
                className="h-[52px] gap-2 px-4"
              >
                {isLoading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
              </Button>
            </div>
          </div>
        </div>
      </ToolPage>
    </AppShell>
  );
}

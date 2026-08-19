import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Search, Telescope } from "lucide-react";
import { useState } from "react";
import { AiOutput } from "@/components/ai-output";
import { AppShell } from "@/components/app-shell";
import { ToolPage } from "@/components/tool-page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAiStream } from "@/lib/use-ai-stream";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant | WorkFlow AI" },
      {
        name: "description",
        content:
          "Summarise topics or pasted articles into a briefing with key insights, risks, and recommended next steps.",
      },
      { property: "og:title", content: "AI Research Assistant | WorkFlow AI" },
      {
        property: "og:description",
        content: "Get a structured research brief with insights, trade-offs and recommendations.",
      },
    ],
  }),
  component: ResearchPage,
});

const SYSTEM = `You are a research analyst producing a decision-ready briefing.

Return markdown with EXACTLY these sections:
## Executive Summary — 3-4 bullets a busy manager could read in 30 seconds.
## Key Insights — 4-6 bullets, each with a short "why it matters" clause.
## Trade-offs & Risks — the counter-arguments and what could go wrong.
## Recommendations — 3 concrete, actionable next steps.
## Verify Before Using — list the specific claims that must be independently checked.

You have no live web access and no citations. Never fabricate statistics, dates, studies or sources: if something depends on current data, say so plainly and put it under "Verify Before Using".`;

function ResearchPage() {
  const [topic, setTopic] = useState("");
  const [source, setSource] = useState("");
  const [audience, setAudience] = useState("Team manager");
  const { output, setOutput, isLoading, error, run } = useAiStream();

  const research = () => {
    if (!topic.trim() && !source.trim()) return;
    void run(SYSTEM, [
      {
        role: "user",
        content: `Topic / question: ${topic || "Summarise the pasted material"}
Audience: ${audience}
Source material (may be empty — then rely on general knowledge and flag it):
${source || "None provided"}`,
      },
    ]);
  };

  return (
    <AppShell>
      <ToolPage
        icon={Search}
        title="AI Research Assistant"
        description="Ask about a topic or paste an article. You get insights, trade-offs, recommendations and a list of claims to verify."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="surface-card space-y-4 rounded-2xl border border-border p-5">
            <div className="space-y-2">
              <Label htmlFor="topic">Topic or question</Label>
              <Input
                id="topic"
                placeholder="e.g. Should we adopt a four-day work week?"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Audience</Label>
              <Select value={audience} onValueChange={setAudience}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Executive board", "Team manager", "Technical team", "New joiner"].map((a) => (
                    <SelectItem key={a} value={a}>
                      {a}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="source">Paste an article or notes (optional)</Label>
              <Textarea
                id="source"
                rows={10}
                placeholder="Paste the text you want summarised and analysed."
                value={source}
                onChange={(e) => setSource(e.target.value)}
              />
            </div>

            <Button
              onClick={research}
              disabled={isLoading || (!topic.trim() && !source.trim())}
              className="w-full gap-2"
            >
              {isLoading ? <Loader2 className="size-4 animate-spin" /> : <Telescope className="size-4" />}
              {isLoading ? "Researching…" : "Build research brief"}
            </Button>
          </div>

          <AiOutput
            value={output}
            onChange={setOutput}
            isLoading={isLoading}
            error={error}
            emptyHint="Your research brief will appear here, including the claims you should verify yourself."
          />
        </div>
      </ToolPage>
    </AppShell>
  );
}

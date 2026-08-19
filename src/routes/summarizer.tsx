import { createFileRoute } from "@tanstack/react-router";
import { Loader2, NotebookPen, Wand2 } from "lucide-react";
import { useState } from "react";
import { AiOutput } from "@/components/ai-output";
import { AppShell } from "@/components/app-shell";
import { ToolPage } from "@/components/tool-page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAiStream } from "@/lib/use-ai-stream";

export const Route = createFileRoute("/summarizer")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer | WorkFlow AI" },
      {
        name: "description",
        content:
          "Turn raw meeting notes or transcripts into a summary with decisions, action items, owners and deadlines.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer | WorkFlow AI" },
      {
        property: "og:description",
        content: "Extract decisions, action items and deadlines from long meeting notes instantly.",
      },
    ],
  }),
  component: SummarizerPage,
});

const SYSTEM = `You are a meticulous executive assistant who converts raw meeting notes into structured minutes.

Return markdown with EXACTLY these sections, in this order:
## Summary — 3-5 bullets of what the meeting covered.
## Key Decisions — each decision on its own bullet, or "No decisions recorded."
## Action Items — a markdown table with columns: Action | Owner | Deadline. Use "Unassigned" / "No date" when the notes do not say.
## Risks & Open Questions — unresolved items, or "None raised."
## Suggested Follow-up — one short paragraph on what should happen next.

Never invent owners, dates or decisions that are not in the notes. Flag ambiguity instead of guessing.`;

function SummarizerPage() {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const { output, setOutput, isLoading, error, run } = useAiStream();

  const summarize = () => {
    if (!notes.trim()) return;
    void run(SYSTEM, [
      {
        role: "user",
        content: `Meeting: ${title || "Untitled meeting"}\n\nRaw notes / transcript:\n${notes}`,
      },
    ]);
  };

  return (
    <AppShell>
      <ToolPage
        icon={NotebookPen}
        title="Meeting Notes Summarizer"
        description="Paste messy notes or a transcript and get clean minutes with decisions, owners and deadlines."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="surface-card space-y-4 rounded-2xl border border-border p-5">
            <div className="space-y-2">
              <Label htmlFor="title">Meeting title (optional)</Label>
              <Input
                id="title"
                placeholder="e.g. Q3 Product Sync — 14 Aug"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes or transcript</Label>
              <Textarea
                id="notes"
                rows={14}
                placeholder="Paste your raw notes here — bullet fragments and half sentences are fine."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                {notes.trim() ? notes.trim().split(/\s+/).length : 0} words
              </p>
            </div>
            <Button onClick={summarize} disabled={isLoading || !notes.trim()} className="w-full gap-2">
              {isLoading ? <Loader2 className="size-4 animate-spin" /> : <Wand2 className="size-4" />}
              {isLoading ? "Summarising…" : "Summarise notes"}
            </Button>
          </div>

          <AiOutput
            value={output}
            onChange={setOutput}
            isLoading={isLoading}
            error={error}
            emptyHint="Structured minutes — summary, decisions, action items, risks and follow-ups — will appear here."
          />
        </div>
      </ToolPage>
    </AppShell>
  );
}

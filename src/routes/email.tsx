import { createFileRoute } from "@tanstack/react-router";
import { Mail, Send, Loader2 } from "lucide-react";
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

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator | WorkFlow AI" },
      {
        name: "description",
        content:
          "Generate professional workplace emails in formal, friendly, persuasive or apologetic tones, with editable output.",
      },
      { property: "og:title", content: "Smart Email Generator | WorkFlow AI" },
      {
        property: "og:description",
        content: "Draft clear, well-structured business emails in seconds with Lovable AI.",
      },
    ],
  }),
  component: EmailPage,
});

const SYSTEM = `You are an expert business communication specialist writing workplace emails.

Rules:
1. Output ONLY the email, in markdown: a "**Subject:**" line, then the body, then a sign-off.
2. Match the requested tone precisely and keep the requested length.
3. Use short paragraphs; use bullets only when listing 3+ items.
4. Use [square brackets] for any detail the user did not supply — never invent names, dates, numbers or commitments.
5. Keep language inclusive, plain and free of jargon and clichés.`;

function EmailPage() {
  const [recipient, setRecipient] = useState("");
  const [purpose, setPurpose] = useState("");
  const [tone, setTone] = useState("Formal");
  const [length, setLength] = useState("Standard (150-200 words)");
  const { output, setOutput, isLoading, error, run } = useAiStream();

  const generate = () => {
    if (!purpose.trim()) return;
    void run(SYSTEM, [
      {
        role: "user",
        content: `Write a workplace email.
Recipient / audience: ${recipient || "Not specified"}
Tone: ${tone}
Length: ${length}
Purpose and key points:
${purpose}`,
      },
    ]);
  };

  return (
    <AppShell>
      <ToolPage
        icon={Mail}
        title="Smart Email Generator"
        description="Describe what you need to say. The assistant structures it into a professional email you can edit before sending."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="surface-card space-y-4 rounded-2xl border border-border p-5">
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient / audience</Label>
              <Input
                id="recipient"
                placeholder="e.g. Head of Operations, external client"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Tone</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["Formal", "Friendly", "Persuasive", "Apologetic", "Direct & concise"].map(
                      (t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Length</Label>
                <Select value={length} onValueChange={setLength}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["Short (under 80 words)", "Standard (150-200 words)", "Detailed (300+ words)"].map(
                      (l) => (
                        <SelectItem key={l} value={l}>
                          {l}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="purpose">What is the email about?</Label>
              <Textarea
                id="purpose"
                rows={7}
                placeholder="e.g. Ask the client for a two-week extension on the reporting deadline because of a data migration delay, and offer a weekly progress update."
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
              />
            </div>

            <Button onClick={generate} disabled={isLoading || !purpose.trim()} className="w-full gap-2">
              {isLoading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
              {isLoading ? "Generating…" : "Generate email"}
            </Button>
          </div>

          <AiOutput
            value={output}
            onChange={setOutput}
            isLoading={isLoading}
            error={error}
            emptyHint="Your generated email will appear here. You can switch to Edit mode to refine it before copying."
          />
        </div>
      </ToolPage>
    </AppShell>
  );
}

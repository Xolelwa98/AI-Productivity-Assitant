import { createFileRoute } from "@tanstack/react-router";
import { CalendarClock, Loader2, ListChecks } from "lucide-react";
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

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner | WorkFlow AI" },
      {
        name: "description",
        content:
          "Prioritise your task list with the Eisenhower matrix and generate a realistic daily or weekly schedule.",
      },
      { property: "og:title", content: "AI Task Planner | WorkFlow AI" },
      {
        property: "og:description",
        content: "Turn a messy to-do list into a prioritised, time-blocked plan.",
      },
    ],
  }),
  component: PlannerPage,
});

const SYSTEM = `You are a productivity coach who builds realistic, time-blocked schedules.

Return markdown with EXACTLY these sections:
## Priority Matrix — a table with columns: Task | Urgency | Importance | Priority (P1-P4). Use the Eisenhower method.
## Schedule — time-blocked plan for the requested horizon, as a table: Time | Task | Focus level. Include short breaks and buffer time; never schedule beyond the stated working hours.
## Deferred or Delegate — tasks that should be pushed, dropped or handed over, with one-line reasons.
## Coach's Note — 2-3 sentences on the biggest risk to this plan and how to protect deep-focus time.

Assume tasks take longer than people expect and say so when the list does not fit the available hours.`;

function PlannerPage() {
  const [tasks, setTasks] = useState("");
  const [horizon, setHorizon] = useState("Single day");
  const [hours, setHours] = useState("08:30 - 17:00");
  const [constraints, setConstraints] = useState("");
  const { output, setOutput, isLoading, error, run } = useAiStream();

  const plan = () => {
    if (!tasks.trim()) return;
    void run(SYSTEM, [
      {
        role: "user",
        content: `Planning horizon: ${horizon}
Working hours: ${hours}
Fixed commitments / constraints: ${constraints || "None given"}
Tasks:
${tasks}`,
      },
    ]);
  };

  return (
    <AppShell>
      <ToolPage
        icon={CalendarClock}
        title="AI Task Planner"
        description="Dump your task list and get a prioritised, time-blocked schedule that respects your real working hours."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="surface-card space-y-4 rounded-2xl border border-border p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Horizon</Label>
                <Select value={horizon} onValueChange={setHorizon}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["Single day", "Working week (Mon-Fri)"].map((h) => (
                      <SelectItem key={h} value={h}>
                        {h}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="hours">Working hours</Label>
                <Input id="hours" value={hours} onChange={(e) => setHours(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tasks">Tasks (one per line)</Label>
              <Textarea
                id="tasks"
                rows={9}
                placeholder={"Finish Q3 budget draft\nReview 4 pull requests\nClient call prep\nOnboard new intern"}
                value={tasks}
                onChange={(e) => setTasks(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="constraints">Fixed commitments (optional)</Label>
              <Textarea
                id="constraints"
                rows={3}
                placeholder="e.g. Standup 09:00, client demo 14:00-15:00, leaving early Friday"
                value={constraints}
                onChange={(e) => setConstraints(e.target.value)}
              />
            </div>

            <Button onClick={plan} disabled={isLoading || !tasks.trim()} className="w-full gap-2">
              {isLoading ? <Loader2 className="size-4 animate-spin" /> : <ListChecks className="size-4" />}
              {isLoading ? "Planning…" : "Build my plan"}
            </Button>
          </div>

          <AiOutput
            value={output}
            onChange={setOutput}
            isLoading={isLoading}
            error={error}
            emptyHint="Your priority matrix and time-blocked schedule will appear here."
          />
        </div>
      </ToolPage>
    </AppShell>
  );
}

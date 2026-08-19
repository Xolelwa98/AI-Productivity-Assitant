import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Bot, CalendarClock, Mail, NotebookPen, Search, Sparkles } from "lucide-react";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "WorkFlow AI — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "One AI dashboard for professional emails, meeting summaries, task plans, research briefs and a workplace chat assistant.",
      },
      { property: "og:title", content: "WorkFlow AI — AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content:
          "Automate everyday workplace tasks with five AI tools in a single, responsible-by-design dashboard.",
      },
    ],
  }),
  component: Dashboard,
});

const tools = [
  {
    to: "/email",
    icon: Mail,
    title: "Smart Email Generator",
    body: "Draft professional emails in a formal, friendly, persuasive or apologetic tone.",
  },
  {
    to: "/summarizer",
    icon: NotebookPen,
    title: "Meeting Notes Summarizer",
    body: "Turn messy notes into a summary with decisions, action items, owners and deadlines.",
  },
  {
    to: "/planner",
    icon: CalendarClock,
    title: "AI Task Planner",
    body: "Prioritise your task list and get a realistic daily or weekly schedule.",
  },
  {
    to: "/research",
    icon: Search,
    title: "AI Research Assistant",
    body: "Summarise topics or pasted articles into insights, risks and recommendations.",
  },
  {
    to: "/chat",
    icon: Bot,
    title: "AI Workplace Assistant",
    body: "Chat through any work problem with a context-aware assistant that remembers the thread.",
  },
] as const;

function Dashboard() {
  return (
    <AppShell>
      <div className="space-y-8">
        <section className="gradient-hero rounded-3xl p-8 text-primary-foreground shadow-elevated sm:p-10">
          <p className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase opacity-80">
            <Sparkles className="size-3.5" /> AI Workplace Productivity Assistant
          </p>
          <h1 className="mt-3 max-w-2xl text-3xl font-semibold sm:text-4xl">
            Automate the admin. Keep the judgement.
          </h1>
          <p className="mt-3 max-w-xl text-sm opacity-90 sm:text-base">
            Five carefully prompt-engineered AI tools in one dashboard — drafting, summarising,
            planning and researching, with every output editable before you use it.
          </p>
          <Link
            to="/email"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-background px-5 py-2.5 text-sm font-semibold text-foreground transition-transform hover:-translate-y-0.5"
          >
            Start with an email <ArrowRight className="size-4" />
          </Link>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          {tools.map(({ to, icon: Icon, title, body }) => (
            <Link
              key={to}
              to={to}
              className="surface-card group rounded-2xl border border-border p-5 transition-all hover:-translate-y-0.5 hover:shadow-elevated"
            >
              <span className="flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <Icon className="size-5" />
              </span>
              <h2 className="mt-4 text-base font-semibold">{title}</h2>
              <p className="mt-1.5 text-sm text-muted-foreground">{body}</p>
              <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                Open tool
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </section>

        <section className="rounded-2xl border border-border bg-secondary/60 p-5">
          <h2 className="text-sm font-semibold">Responsible AI disclaimer</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            This assistant uses generative AI. Responses may be incomplete, outdated or incorrect,
            and should never be treated as legal, financial, medical or HR advice. Do not enter
            confidential, personal or client-identifying information. A human must review, edit and
            approve every output before it is sent or acted upon.
          </p>
        </section>
      </div>
    </AppShell>
  );
}

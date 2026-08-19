import { Check, Copy, Pencil, Eye, Loader2 } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  value: string;
  onChange: (value: string) => void;
  isLoading: boolean;
  error?: string | null;
  emptyHint: string;
};

export function AiOutput({ value, onChange, isLoading, error, emptyHint }: Props) {
  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="surface-card flex min-h-[280px] flex-col rounded-2xl border border-border">
      <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-2.5">
        <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          AI Output
        </span>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            disabled={!value}
            onClick={() => setEditing((v) => !v)}
            className="gap-1.5"
          >
            {editing ? <Eye className="size-3.5" /> : <Pencil className="size-3.5" />}
            {editing ? "Preview" : "Edit"}
          </Button>
          <Button variant="ghost" size="sm" disabled={!value} onClick={copy} className="gap-1.5">
            {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
      </div>

      <div className="flex-1 p-4">
        {error ? (
          <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</p>
        ) : null}

        {!value && isLoading ? (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> Generating…
          </p>
        ) : null}

        {!value && !isLoading && !error ? (
          <p className="text-sm text-muted-foreground">{emptyHint}</p>
        ) : null}

        {value ? (
          editing ? (
            <Textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="min-h-[320px] resize-y font-mono text-sm"
            />
          ) : (
            <div className="prose-ai text-foreground">
              <ReactMarkdown>{value}</ReactMarkdown>
            </div>
          )
        ) : null}
      </div>
    </div>
  );
}

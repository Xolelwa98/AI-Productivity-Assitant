import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function ToolPage({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-7">
      <header className="flex items-start gap-4">
        <span className="gradient-hero flex size-11 shrink-0 items-center justify-center rounded-xl">
          <Icon className="size-5 text-primary-foreground" />
        </span>
        <div>
          <h1 className="text-2xl font-semibold">{title}</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
        </div>
      </header>
      {children}
    </div>
  );
}

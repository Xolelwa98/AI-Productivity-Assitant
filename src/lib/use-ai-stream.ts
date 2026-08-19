import { useCallback, useRef, useState } from "react";

export type AiMessage = { role: "user" | "assistant"; content: string };

export function useAiStream() {
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const run = useCallback(
    async (system: string, messages: AiMessage[], onDelta?: (full: string) => void) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      setIsLoading(true);
      setError(null);
      setOutput("");

      try {
        const res = await fetch("/api/ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ system, messages }),
          signal: controller.signal,
        });

        if (!res.ok || !res.body) {
          const detail = await res.text().catch(() => "");
          const friendly =
            res.status === 429
              ? "Too many requests right now. Please wait a moment and try again."
              : res.status === 402
                ? "AI credits have run out for this workspace. Please top up to continue."
                : detail || "The AI request failed. Please try again.";
          throw new Error(friendly);
        }

        const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
        let full = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          full += value;
          setOutput(full);
          onDelta?.(full);
        }
        return full;
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") return "";
        const message = e instanceof Error ? e.message : "Something went wrong.";
        setError(message);
        return "";
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const stop = useCallback(() => abortRef.current?.abort(), []);

  return { output, setOutput, isLoading, error, run, stop };
}

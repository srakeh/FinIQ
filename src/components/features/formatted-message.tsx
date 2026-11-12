import React from "react";

interface FormattedMessageProps {
  content: string;
}

/**
 * Parses inline markdown:
 * - **bold** -> <strong>
 * - *italic* -> <em>
 * - `code` -> <code>
 */
function renderInline(text: string): React.ReactNode[] {
  // Regex matching **bold**, `code`, and *italic*
  const regex = /(\*\*.*?\*\*|`.*?`|\*.*?\*)/g;
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (!part) return null;

    if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
      return (
        <strong
          key={index}
          className="font-semibold text-zinc-950 dark:text-zinc-50"
        >
          {part.slice(2, -2)}
        </strong>
      );
    }

    if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
      return (
        <code
          key={index}
          className="px-1.5 py-0.5 rounded bg-zinc-200/80 dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 font-mono text-xs"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    if (part.startsWith("*") && part.endsWith("*") && part.length >= 2) {
      return (
        <em key={index} className="italic text-zinc-700 dark:text-zinc-300">
          {part.slice(1, -1)}
        </em>
      );
    }

    return <span key={index}>{part}</span>;
  });
}

type Block =
  | { type: "h1"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: { num: string; text: string }[] }
  | { type: "p"; text: string };

export function FormattedMessage({ content }: FormattedMessageProps) {
  if (!content) return null;

  const rawLines = content.split("\n");
  const blocks: Block[] = [];
  let currentList: { type: "ul" | "ol"; items: any[] } | null = null;
  let currentParagraph: string[] = [];

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      const text = currentParagraph.join(" ").trim();
      if (text) {
        blocks.push({ type: "p", text });
      }
      currentParagraph = [];
    }
  };

  const flushList = () => {
    if (currentList) {
      if (currentList.type === "ul") {
        blocks.push({ type: "ul", items: currentList.items });
      } else {
        blocks.push({ type: "ol", items: currentList.items });
      }
      currentList = null;
    }
  };

  for (let i = 0; i < rawLines.length; i++) {
    const rawLine = rawLines[i];
    const trimmed = rawLine.trim();

    if (!trimmed) {
      flushParagraph();
      flushList();
      continue;
    }

    // Headers
    if (trimmed.startsWith("### ")) {
      flushParagraph();
      flushList();
      blocks.push({ type: "h3", text: trimmed.slice(4).trim() });
      continue;
    }
    if (trimmed.startsWith("## ")) {
      flushParagraph();
      flushList();
      blocks.push({ type: "h2", text: trimmed.slice(3).trim() });
      continue;
    }
    if (trimmed.startsWith("# ")) {
      flushParagraph();
      flushList();
      blocks.push({ type: "h1", text: trimmed.slice(2).trim() });
      continue;
    }

    // Bullet lists: *, -, or •
    const bulletMatch = trimmed.match(/^[*•-]\s+(.*)$/);
    if (bulletMatch) {
      flushParagraph();
      if (!currentList || currentList.type !== "ul") {
        flushList();
        currentList = { type: "ul", items: [] };
      }
      currentList.items.push(bulletMatch[1]);
      continue;
    }

    // Numbered lists: 1. or 1)
    const numberMatch = trimmed.match(/^(\d+)[.)]\s+(.*)$/);
    if (numberMatch) {
      flushParagraph();
      if (!currentList || currentList.type !== "ol") {
        flushList();
        currentList = { type: "ol", items: [] };
      }
      currentList.items.push({ num: numberMatch[1], text: numberMatch[2] });
      continue;
    }

    // Regular text (continuation of paragraph or new paragraph)
    flushList();
    currentParagraph.push(trimmed);
  }

  flushParagraph();
  flushList();

  return (
    <div className="space-y-3 text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed">
      {blocks.map((block, idx) => {
        switch (block.type) {
          case "h1":
            return (
              <h1
                key={idx}
                className="text-lg font-bold text-zinc-950 dark:text-zinc-50 pt-3 pb-1 first:pt-0 border-b border-zinc-200 dark:border-zinc-800"
              >
                {renderInline(block.text)}
              </h1>
            );
          case "h2":
            return (
              <h2
                key={idx}
                className="text-base font-bold text-zinc-950 dark:text-zinc-50 pt-2 pb-0.5 first:pt-0"
              >
                {renderInline(block.text)}
              </h2>
            );
          case "h3":
            return (
              <h3
                key={idx}
                className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 pt-2 pb-0.5 first:pt-0 tracking-wide uppercase"
              >
                {renderInline(block.text)}
              </h3>
            );
          case "ul":
            return (
              <ul key={idx} className="space-y-2 my-2 pl-0.5">
                {block.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="flex items-start gap-2.5">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 mt-2 shrink-0" />
                    <div className="flex-1 leading-relaxed text-zinc-800 dark:text-zinc-200">
                      {renderInline(item)}
                    </div>
                  </li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={idx} className="space-y-2 my-2 pl-0.5">
                {block.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="flex items-start gap-2.5">
                    <span className="font-semibold text-xs text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0">
                      {item.num}.
                    </span>
                    <div className="flex-1 leading-relaxed text-zinc-800 dark:text-zinc-200">
                      {renderInline(item.text)}
                    </div>
                  </li>
                ))}
              </ol>
            );
          case "p":
            return (
              <p key={idx} className="leading-relaxed">
                {renderInline(block.text)}
              </p>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}

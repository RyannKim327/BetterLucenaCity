"use client";

import { useRef, useState } from "react";
import {
  Bold,
  Italic,
  Highlighter,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Code2,
  Eye,
  Pencil,
  Columns2,
} from "lucide-react";

interface MarkdownEditorProps {
  id?: string;
  name?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function renderInline(text: string): string {
  let out = escapeHtml(text);
  // inline code
  out = out.replace(/`([^`]+?)`/g, '<code class="rounded bg-surface-container px-1 py-0.5 text-[12px] font-mono">$1</code>');
  // bold ** **
  out = out.replace(/\*\*([^*]+?)\*\*/g, "<strong>$1</strong>");
  // highlight == ==
  out = out.replace(/==([^=]+?)==/g, '<mark class="rounded bg-secondary-container px-1">$1</mark>');
  // strikethrough ~~ ~~
  out = out.replace(/~~([^~]+?)~~/g, "<s>$1</s>");
  // italic * *  (avoid already bold)
  out = out.replace(/(?<!\*)\*([^*\n]+?)\*(?!\*)/g, "<em>$1</em>");
  out = out.replace(/_([^_\n]+?)_/g, "<em>$1</em>");
  // underline __ __
  out = out.replace(/__([^_]+?)__/g, "<u>$1</u>");
  // links [text](url)
  out = out.replace(
    /\[([^\]]+?)\]\((https?:\/\/[^\s)]+)\)/g,
    '<a href="$2" target="_blank" rel="noreferrer" class="font-medium text-primary hover:underline">$1</a>',
  );
  // autolink bare urls
  out = out.replace(
    /(^|\s)(https?:\/\/[^\s<]+)/g,
    '$1<a href="$2" target="_blank" rel="noreferrer" class="font-medium text-primary hover:underline">$2</a>',
  );
  return out;
}

function markdownToHtml(md: string): string {
  if (!md.trim()) return '<p class="text-on-surface-variant italic">Nothing to preview — start writing markdown on the left.</p>';
  // normalize
  const blocks = md.split(/\n{2,}/);
  const html: string[] = [];

  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed) continue;

    // fenced code
    if (trimmed.startsWith("```")) {
      const inner = trimmed.replace(/^```[a-z]*\n?/, "").replace(/\n?```$/, "");
      html.push(`<pre class="overflow-auto rounded-xl bg-surface-container p-3 text-xs font-mono">${escapeHtml(inner)}</pre>`);
      continue;
    }
    // heading
    if (/^###\s+/.test(trimmed)) {
      const t = trimmed.replace(/^###\s+/, "");
      html.push(`<h3 class="mt-3 text-base font-semibold">${renderInline(t)}</h3>`);
      continue;
    }
    if (/^##\s+/.test(trimmed)) {
      const t = trimmed.replace(/^##\s+/, "");
      html.push(`<h2 class="mt-3 text-lg font-semibold">${renderInline(t)}</h2>`);
      continue;
    }
    if (/^#\s+/.test(trimmed)) {
      const t = trimmed.replace(/^#\s+/, "");
      html.push(`<h1 class="mt-3 text-xl font-bold">${renderInline(t)}</h1>`);
      continue;
    }
    // blockquote
    if (/^>\s+/.test(trimmed)) {
      const lines = trimmed
        .split("\n")
        .map((l) => l.replace(/^>\s?/, ""))
        .join("<br/>");
      html.push(
        `<blockquote class="mt-2 border-l-4 border-primary/30 bg-primary-container/10 px-3 py-2 text-sm italic">${renderInline(lines)}</blockquote>`,
      );
      continue;
    }
    // unordered list
    if (/^[-*]\s+/.test(trimmed)) {
      const items = trimmed
        .split("\n")
        .filter((l) => /^[-*]\s+/.test(l.trim()))
        .map((l) => `<li>${renderInline(l.replace(/^[-*]\s+/, ""))}</li>`)
        .join("");
      html.push(`<ul class="mt-2 list-disc space-y-1 pl-6 text-sm">${items}</ul>`);
      continue;
    }
    // ordered list
    if (/^\d+\.\s+/.test(trimmed)) {
      const items = trimmed
        .split("\n")
        .filter((l) => /^\d+\.\s+/.test(l.trim()))
        .map((l) => `<li>${renderInline(l.replace(/^\d+\.\s+/, ""))}</li>`)
        .join("");
      html.push(`<ol class="mt-2 list-decimal space-y-1 pl-6 text-sm">${items}</ol>`);
      continue;
    }
    // paragraph - split single newlines into <br>
    const inline = renderInline(trimmed).replace(/\n/g, "<br/>");
    html.push(`<p class="mt-2 text-sm leading-relaxed">${inline}</p>`);
  }

  return html.join("\n");
}

export function MarkdownEditor({ id, name, value, onChange, placeholder, rows = 10 }: MarkdownEditorProps) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [mode, setMode] = useState<"write" | "preview" | "split">("write");

  function insertAround(before: string, after: string, placeholderText = "text") {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.slice(start, end) || placeholderText;
    const next = value.slice(0, start) + before + selected + after + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      const cursorStart = start + before.length;
      const cursorEnd = cursorStart + selected.length;
      el.setSelectionRange(cursorStart, cursorEnd);
    });
  }

  function insertPrefix(prefix: string) {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart;
    const lineStart = value.lastIndexOf("\n", start - 1) + 1;
    const next = value.slice(0, lineStart) + prefix + value.slice(lineStart);
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + prefix.length, start + prefix.length);
    });
  }

  function insertBlock(before: string, after: string, placeholderText: string) {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.slice(start, end) || placeholderText;
    const next = value.slice(0, start) + before + selected + after + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + before.length, start + before.length + selected.length);
    });
  }

  const toolbarBtn =
    "inline-flex size-8 items-center justify-center rounded-lg border border-outline-variant/40 bg-surface-container-low text-on-surface-variant hover:bg-primary/8 hover:text-primary hover:border-primary/20 transition-colors";

  return (
    <div className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-low">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-outline-variant/40 bg-surface-container px-2 py-2">
        <button type="button" onClick={() => insertAround("**", "**", "bold")} className={toolbarBtn} title="Bold (**text**)">
          <Bold className="h-4 w-4" />
        </button>
        <button type="button" onClick={() => insertAround("*", "*", "italic")} className={toolbarBtn} title="Italic (*text*)">
          <Italic className="h-4 w-4" />
        </button>
        <button type="button" onClick={() => insertAround("==", "==", "highlight")} className={toolbarBtn} title="Highlight (==text==)">
          <Highlighter className="h-4 w-4" />
        </button>
        <button type="button" onClick={() => insertAround("__", "__", "underline")} className={`${toolbarBtn} text-xs font-semibold`} title="Underline (__text__)">
          U
        </button>
        <span className="mx-1 h-6 w-px bg-outline-variant/40" />
        <button type="button" onClick={() => insertPrefix("## ")} className={toolbarBtn} title="Heading 2">
          <Heading2 className="h-4 w-4" />
        </button>
        <button type="button" onClick={() => insertPrefix("### ")} className={toolbarBtn} title="Heading 3">
          <Heading3 className="h-4 w-4" />
        </button>
        <button type="button" onClick={() => insertPrefix("- ")} className={toolbarBtn} title="Bullet list">
          <List className="h-4 w-4" />
        </button>
        <button type="button" onClick={() => insertPrefix("1. ")} className={toolbarBtn} title="Numbered list">
          <ListOrdered className="h-4 w-4" />
        </button>
        <button type="button" onClick={() => insertPrefix("> ")} className={toolbarBtn} title="Quote">
          <Quote className="h-4 w-4" />
        </button>
        <button type="button" onClick={() => insertBlock("[", "](https://)", "text")} className={toolbarBtn} title="Link [text](url)">
          <LinkIcon className="h-4 w-4" />
        </button>
        <button type="button" onClick={() => insertAround("`", "`", "code")} className={toolbarBtn} title="Inline code">
          <Code2 className="h-4 w-4" />
        </button>

        <span className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => setMode("write")}
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium ${mode === "write" ? "bg-primary text-on-primary" : "bg-surface-container-low border border-outline-variant text-on-surface-variant hover:bg-primary/8"}`}
          >
            <Pencil className="h-3.5 w-3.5" /> Write
          </button>
          <button
            type="button"
            onClick={() => setMode("preview")}
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium ${mode === "preview" ? "bg-primary text-on-primary" : "bg-surface-container-low border border-outline-variant text-on-surface-variant hover:bg-primary/8"}`}
          >
            <Eye className="h-3.5 w-3.5" /> Preview
          </button>
          <button
            type="button"
            onClick={() => setMode("split")}
            className={`hidden sm:inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium ${mode === "split" ? "bg-primary text-on-primary" : "bg-surface-container-low border border-outline-variant text-on-surface-variant hover:bg-primary/8"}`}
          >
            <Columns2 className="h-3.5 w-3.5" /> Split
          </button>
        </span>
      </div>

      {/* Editor / Preview */}
      {mode === "write" && (
        <textarea
          ref={ref}
          id={id}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="w-full bg-surface-container-low px-3.5 py-3 text-sm leading-relaxed text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none resize-y min-h-[180px]"
        />
      )}

      {mode === "preview" && (
        <>
          <div className="max-h-[360px] overflow-auto px-4 py-3">
            <div dangerouslySetInnerHTML={{ __html: markdownToHtml(value) }} />
          </div>
          <input type="hidden" name={name} value={value} />
        </>
      )}

      {mode === "split" && (
        <div className="grid sm:grid-cols-2">
          <textarea
            ref={ref}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            id={id ? `${id}-split` : undefined}
            className="w-full bg-surface-container-low px-3.5 py-3 text-sm leading-relaxed text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none resize-y min-h-[280px] border-r border-outline-variant/30"
          />
          <div className="max-h-[340px] overflow-auto bg-surface-container px-4 py-3">
            <div dangerouslySetInnerHTML={{ __html: markdownToHtml(value) }} />
          </div>
        </div>
      )}

      <div className="border-t border-outline-variant/30 bg-surface-container px-3 py-2 text-[11px] leading-relaxed text-on-surface-variant">
        Markdown supported: <code>**bold**</code> · <code>*italic*</code> · <code>==highlight==</code> · <code>__underline__</code> · <code>## heading</code> · <code>- list</code> · <code>[text](url)</code> · <code>`code`</code> · <code>&gt; quote</code>
      </div>
      {/* keep hidden input for split mode form association */}
      {mode === "split" && <input type="hidden" name={name} value={value} />}
    </div>
  );
}

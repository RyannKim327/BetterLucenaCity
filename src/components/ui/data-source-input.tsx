"use client"

import { useState } from "react"
import { Plus, X, Link2 } from "lucide-react"

const URL_REGEX = /^https?:\/\/.+/i

function isValidUrl(url: string) {
  if (!URL_REGEX.test(url)) return false
  try {
    const u = new URL(url)
    return u.protocol === "http:" || u.protocol === "https:"
  } catch {
    return false
  }
}

function parseCommaSeparated(input: string): string[] {
  return input
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
}

interface DataSourceInputProps {
  value: string[]
  onChange: (next: string[]) => void
  label?: string
  hint?: string
  placeholder?: string
  id?: string
}

export function DataSourceInput({
  value,
  onChange,
  label = "Reference links",
  hint = "Add URLs like https://google.com — separate with comma ( , ) or comma+space ( , ) or use Add link.",
  placeholder = "https://example.com/document.pdf",
  id = "data_source",
}: DataSourceInputProps) {
  const [input, setInput] = useState("")
  const [error, setError] = useState("")

  function addUrls(raw: string) {
    const candidates = parseCommaSeparated(raw)
    if (candidates.length === 0) {
      setError("Enter a URL like https://google.com")
      return
    }
    const invalid = candidates.filter((u) => !isValidUrl(u))
    if (invalid.length > 0) {
      setError(`Invalid URL(s): ${invalid.join(", ")} — must start with https://`)
      return
    }
    const deduped = [...value]
    for (const u of candidates) {
      if (!deduped.includes(u)) deduped.push(u)
    }
    onChange(deduped)
    setInput("")
    setError("")
  }

  function removeAt(idx: number) {
    const next = value.filter((_, i) => i !== idx)
    onChange(next)
  }

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-on-surface">
        {label}
      </label>
      <div className="mt-1.5 flex gap-2">
        <div className="relative flex-1">
          <Link2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant/60" />
          <input
            id={id}
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              if (error) setError("")
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                addUrls(input)
              }
            }}
            onPaste={(e) => {
              const pasted = e.clipboardData.getData("text")
              if (pasted.includes(",")) {
                // let paste finish then parse comma case via input change? handle immediately
                e.preventDefault()
                const combined = input ? `${input},${pasted}` : pasted
                addUrls(combined)
              }
            }}
            placeholder={placeholder}
            className="w-full rounded-xl border border-outline-variant bg-surface-container-low py-2.5 pl-9 pr-3.5 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <button
          type="button"
          onClick={() => addUrls(input)}
          className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-full border border-outline px-5 text-sm font-medium text-primary hover:bg-primary/8"
        >
          <Plus className="h-4 w-4" /> Add link
        </button>
      </div>
      <p className="mt-1.5 text-xs leading-relaxed text-on-surface-variant">{hint}</p>
      {error && <p className="mt-2 rounded-xl bg-secondary-container/40 px-3 py-2 text-xs text-on-secondary-container">{error}</p>}

      {value.length > 0 && (
        <ul className="mt-3 space-y-2">
          {value.map((url, idx) => (
            <li
              key={`${url}-${idx}`}
              className="flex items-center justify-between gap-3 rounded-xl border border-outline-variant/30 bg-surface-container px-3 py-2"
            >
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="truncate text-xs font-medium text-primary hover:underline"
              >
                {url}
              </a>
              <button
                type="button"
                onClick={() => removeAt(idx)}
                aria-label={`Remove ${url}`}
                className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full hover:bg-surface-container-high"
              >
                <X className="h-3.5 w-3.5 text-on-surface-variant" />
              </button>
            </li>
          ))}
        </ul>
      )}
      {/* hidden input for form serialization if needed */}
      <input type="hidden" name="data_source" value={value.join(", ")} readOnly />
      {value.length > 0 && (
        <p className="mt-2 text-xs text-on-surface-variant">
          {value.length} reference link{value.length === 1 ? "" : "s"} added — will be included with your submission for validation.
        </p>
      )}
    </div>
  )
}

export function normalizeDataSource(input: unknown): { urls: string[]; error?: string } {
  if (input == null || input === "") return { urls: [] }
  let arr: string[] = []
  if (Array.isArray(input)) {
    arr = input.map((v) => String(v).trim()).filter(Boolean)
  } else if (typeof input === "string") {
    arr = parseCommaSeparated(input)
  } else {
    return { urls: [], error: "Invalid data_source format" }
  }
  // dedupe preserve order
  const deduped: string[] = []
  for (const u of arr) {
    if (!deduped.includes(u)) deduped.push(u)
  }
  const invalid = deduped.filter((u) => !isValidUrl(u))
  if (invalid.length > 0) return { urls: [], error: `Invalid URL(s): ${invalid.join(", ")} — each must be a valid https:// URL like https://google.com` }
  return { urls: deduped }
}

export { isValidUrl }

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { DataSourceInput } from "@/components/ui/data-source-input";
import { Loader2, Upload, FileJson, Table as TableIcon, AlertCircle } from "lucide-react";

type ParsedRow = Record<string, string>;

function parseCSV(text: string): { headers: string[]; rows: ParsedRow[] } {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length === 0) return { headers: [], rows: [] };
  // naive CSV split — handles quoted commas minimally
  const split = (line: string) => {
    const out: string[] = [];
    let cur = "";
    let inQuote = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"' ) {
        inQuote = !inQuote;
      } else if (ch === "," && !inQuote) {
        out.push(cur.trim().replace(/^"|"$/g, ""));
        cur = "";
      } else {
        cur += ch;
      }
    }
    out.push(cur.trim().replace(/^"|"$/g, ""));
    return out;
  };
  const headers = split(lines[0]);
  const rows: ParsedRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const vals = split(lines[i]);
    const row: ParsedRow = {};
    headers.forEach((h, idx) => {
      row[h] = vals[idx] ?? "";
    });
    rows.push(row);
  }
  return { headers, rows };
}

function parseJSON(text: string): { headers: string[]; rows: ParsedRow[] } {
  const data = JSON.parse(text);
  const arr = Array.isArray(data) ? data : [data];
  if (arr.length === 0) return { headers: [], rows: [] };
  const headers = Array.from(new Set(arr.flatMap((o: object) => Object.keys(o as object))));
  const rows: ParsedRow[] = arr.map((o: Record<string, unknown>) => {
    const r: ParsedRow = {};
    headers.forEach((h) => {
      const v = o[h];
      r[h] = v == null ? "" : String(v);
    });
    return r;
  });
  return { headers, rows };
}

export function TransparencyPanel({ userEmail }: { userEmail: string }) {
  const router = useRouter();
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dataSource, setDataSource] = useState<string[]>([]);
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState<string>(String(new Date().getFullYear()));
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [rawCount, setRawCount] = useState<number>(0);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setErrorMsg("");
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = String(reader.result ?? "");
        let parsed: { headers: string[]; rows: ParsedRow[] };
        if (file.name.toLowerCase().endsWith(".json")) {
          parsed = parseJSON(text);
        } else if (file.name.toLowerCase().endsWith(".csv")) {
          parsed = parseCSV(text);
        } else {
          // try both: attempt JSON then CSV
          try {
            parsed = parseJSON(text);
            if (parsed.headers.length === 0) throw new Error();
          } catch {
            parsed = parseCSV(text);
          }
        }
        if (parsed.headers.length === 0) throw new Error("No headers found. Check file format.");
        setHeaders(parsed.headers);
        setRows(parsed.rows);
        setRawCount(parsed.rows.length);
      } catch (err) {
        setErrorMsg(err instanceof Error ? err.message : "Failed to parse file.");
        setHeaders([]);
        setRows([]);
      }
    };
    reader.readAsText(file);
  }

  async function handleUpload() {
    if (!title.trim() || !department.trim() || !year.trim() || headers.length === 0 || rows.length === 0) {
      setErrorMsg("Provide a title, department, year and a valid file with preview data.");
      setStatus("error");
      return;
    }
    const parsedYear = parseInt(year, 10)
    if (Number.isNaN(parsedYear) || parsedYear < 1900 || parsedYear > 2100) {
      setErrorMsg("Provide a valid year (e.g., 2026).");
      setStatus("error");
      return;
    }
    setStatus("submitting");
    setErrorMsg("");
    const payload = {
      title: title.trim(),
      content: description.trim(),
      department: department.trim(),
      year: parsedYear,
      data: rows,
      data_source: dataSource,
      // keep file meta separate from reference links — store in discussion? For table, data_source is the reference string[] only
    };

    try {
      const res = await fetch("/api/budget/local", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Upload failed.");
      }
      const result = (await res.json().catch(() => ({}))) as { discussionId?: string; id?: number | string };
      setStatus("success");
      // keep success briefly showing uploading -> redirect
      if (result.discussionId) {
        router.push(`/discussion/${result.discussionId}`);
      } else if (result.id) {
        router.push("/discussion");
      } else {
        setTimeout(() => setStatus("idle"), 2000);
      }
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Unexpected error.");
    }
  }

  function clear() {
    setHeaders([]);
    setRows([]);
    setFileName("");
    setRawCount(0);
    setErrorMsg("");
    setStatus("idle");
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <Card className="mb-6 border-primary/20 bg-primary-container/20">
        <p className="text-sm leading-relaxed">
          <span className="font-medium">Submitting as {userEmail}.</span> Upload a CSV or JSON file — we won&apos;t save the file itself, only the extracted data previewed below. That data is then sent to the database for Validator review.
        </p>
      </Card>

      <div className="grid gap-6">
        {/* Upload controls */}
        <Card>
          <div className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            <h2 className="text-base font-semibold">Upload dataset</h2>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-on-surface">
                Dataset title <span className="text-secondary">*</span>
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Q1 2026 Budget Utilization — Lucena City"
                className="mt-1.5 w-full rounded-xl border border-outline-variant bg-surface-container-low px-3.5 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface">
                Department / Office <span className="text-secondary">*</span>
              </label>
              <input
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g., City Budget Office"
                className="mt-1.5 w-full rounded-xl border border-outline-variant bg-surface-container-low px-3.5 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <p className="mt-1 text-xs text-on-surface-variant">Local budget is grouped by department (for DB filtering).</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface">
                Year <span className="text-secondary">*</span>
              </label>
              <input
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="2026"
                inputMode="numeric"
                className="mt-1.5 w-full rounded-xl border border-outline-variant bg-surface-container-low px-3.5 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-on-surface">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="What the dataset contains, coverage, and verification method..."
                className="mt-1.5 w-full rounded-xl border border-outline-variant bg-surface-container-low px-3.5 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y"
              />
            </div>
            <div className="sm:col-span-2">
              <DataSourceInput
                value={dataSource}
                onChange={setDataSource}
                label="Reference links — data_source (string[])"
                hint="Add URLs like https://google.com — separate with comma ( , ) or comma+space ( , ) or use Add link. These are the reference links for validation."
                placeholder="https://google.com, https://lucena.gov.ph/transparency/..."
                id="t-data-source"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface">
                File (CSV or JSON) <span className="text-secondary">*</span>
              </label>
              <div className="mt-1.5 flex items-center gap-2">
                <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border border-outline px-5 text-sm font-medium text-primary hover:bg-primary/8">
                  <FileJson className="h-4 w-4" />
                  Choose file
                  <input type="file" accept=".csv,.json,application/json,text/csv" onChange={handleFile} className="sr-only" />
                </label>
                <span className="text-xs text-on-surface-variant truncate">{fileName || "No file chosen"}</span>
                {fileName && (
                  <button type="button" onClick={clear} className="text-xs font-medium text-secondary hover:underline">
                    Clear
                  </button>
                )}
              </div>
              <p className="mt-1.5 text-xs text-on-surface-variant">We extract rows client-side and preview below. No file is stored — only the parsed data.</p>
            </div>
          </div>

          {errorMsg && (
            <p className="mt-4 flex items-center gap-2 rounded-xl bg-secondary-container/40 px-4 py-3 text-sm text-on-secondary-container">
              <AlertCircle className="h-4 w-4" /> {errorMsg}
            </p>
          )}
          {status === "submitting" && (
            <p className="mt-4 flex items-center gap-2 rounded-xl bg-primary-container/40 px-4 py-3 text-sm text-on-primary-container">
              <Loader2 className="h-4 w-4 animate-spin" /> Uploading… creating record and discussion thread
            </p>
          )}
          {status === "success" && (
            <p className="mt-4 flex items-center gap-2 rounded-xl bg-primary-container/40 px-4 py-3 text-sm text-on-primary-container">
              <Loader2 className="h-4 w-4 animate-spin" /> Uploading… Redirecting to discussion/[id]
            </p>
          )}
        </Card>

        {/* Preview table */}
        <Card>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <TableIcon className="h-5 w-5 text-primary" />
              <h3 className="text-sm font-semibold">Preview (extracted data)</h3>
            </div>
            {headers.length > 0 && (
              <span className="rounded-full bg-secondary-container px-3 py-1 text-xs font-medium text-on-secondary-container">
                {rawCount} rows · {headers.length} cols
              </span>
            )}
          </div>

          {headers.length === 0 ? (
            <p className="mt-4 rounded-xl border border-dashed border-outline-variant bg-surface-container px-4 py-8 text-center text-sm text-on-surface-variant">
              No preview yet. Choose a CSV or JSON file above to see the extracted table here.
            </p>
          ) : (
            <>
              <div className="mt-4 overflow-auto rounded-xl border border-outline-variant/40">
                <table className="w-full min-w-[600px] text-sm">
                  <thead className="bg-surface-container">
                    <tr>
                      {headers.map((h) => (
                        <th key={h} className="whitespace-nowrap px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20">
                    {rows.slice(0, 10).map((r, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? "bg-surface-container-low" : "bg-surface-container"}>
                        {headers.map((h) => (
                          <td key={h} className="max-w-[200px] truncate px-3 py-2 text-xs text-on-surface">
                            {r[h] ?? ""}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {rows.length > 10 && (
                <p className="mt-2 text-xs text-on-surface-variant">Showing first 10 of {rows.length} rows. Full dataset will be sent to the database on upload.</p>
              )}
              <p className="mt-3 text-xs leading-relaxed text-on-surface-variant">
                Preview only — the file is not uploaded as-is. We extract the table above and POST the JSON rows to the database for validation. Large files are truncated in preview but fully transmitted as data.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={status === "submitting" || !title.trim()}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-on-primary shadow-elevation-1 hover:bg-primary/90 disabled:opacity-60"
                >
                  {status === "submitting" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Uploading to database…
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" /> Upload extracted data to database
                    </>
                  )}
                </button>
                <span className="self-center text-xs text-on-surface-variant">
                  Submits {rows.length} rows via <code className="rounded bg-surface-container px-1 py-0.5 text-[11px]">/api/budget/local</code> → <code className="rounded bg-surface-container px-1 py-0.5 text-[11px]">local_budget</code> + discussion thread.
                </span>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}

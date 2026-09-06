import Forbidden from "@/app/forbidden"
import { createClient } from "@/lib/supabase/server"
import CheckPermission from "@/lib/roles"
import { Card } from "@/components/ui/card"
import { formatDate } from "@/lib/functions"
import Link from "next/link"
import { CommentForm } from "@/components/discussion/comment-form"
import { TableIcon } from "lucide-react"

interface PageProps { params: Promise<{ id: string }> }

interface DiscussionRow {
  id: string
  user_id: string
  title: string
  content: string
  type: string
  reference_id: number
  date_added: string | null
  is_open: boolean | null
  data_source: string[] | null
}

function renderDataSource(urls: string[] | null) {
  if (!urls || urls.length === 0) return <p className="mt-2 text-xs text-on-surface-variant">No reference links provided.</p>
  return (
    <ul className="mt-3 space-y-1">
      {urls.map((u, i) => (
        <li key={`${u}-${i}`} className="truncate">
          <a href={u} target="_blank" rel="noreferrer" className="text-xs font-medium text-primary hover:underline">
            {u}
          </a>
        </li>
      ))}
    </ul>
  )
}

export default async function DiscussionDetail({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return <Forbidden />

  const canValidate = await CheckPermission(user.id, "validate")
  const canContribute = await CheckPermission(user.id, "contribute")
  const isModerator = canValidate || (await CheckPermission(user.id, "maintainer")) || (await CheckPermission(user.id, "admin"))

  if (!canValidate && !canContribute) return <Forbidden />

  const { data: discussion, error } = await supabase
    .from("discussion")
    .select("id, user_id, title, content, type, reference_id, date_added, is_open, data_source")
    .eq("id", id).maybeSingle()

  if (error || !discussion) {
    return (
      <Card>
        <p className="text-sm text-secondary">Thread not found.</p>
        <Link href="/discussion" className="mt-3 inline-block text-sm font-medium text-primary hover:underline">Back to discussions</Link>
      </Card>
    )
  }

  const row = discussion as DiscussionRow

  // Owner check: contribute-only users may only access their own threads
  if (!canValidate && row.user_id !== user.id) {
    return <Forbidden />
  }

  // Fetch linked record for context
  let linked: unknown = null
  let linkedError: string | null = null

  try {
    if (row.type === "legals") {
      const { data, error: e } = await supabase.from("legals").select("id, title, ordinance_type, reference, summary, content, proclamation_date, source_url, source_name, data_source, approved_by").eq("id", row.reference_id).maybeSingle()
      if (e) linkedError = e.message
      else linked = data
    } else if (row.type === "announcements") {
      const { data, error: e } = await supabase.from("announcements").select("id, title, content, date_added, data_source, approved_by").eq("id", row.reference_id).maybeSingle()
      if (e) linkedError = e.message
      else linked = data
    } else if (row.type === "local_budget") {
      const { data, error: e } = await supabase.from("local_budget").select("id, department, year, data, data_source, approved_by").eq("id", row.reference_id).maybeSingle()
      if (e) linkedError = e.message
      else linked = data
    } else if (row.type === "procurement") {
      const { data, error: e } = await supabase.from("procurement").select("id, source, pricebid, date, data_source, approved_by").eq("id", row.reference_id).maybeSingle()
      if (e) linkedError = e.message
      else linked = data
    }
  } catch {
    linkedError = "Failed to load linked record"
  }

  // Fetch comments
  const { data: comments } = await supabase
    .from("discussion_comments")
    .select("id, discussion_id, user_id, comment, reply, date_added")
    .eq("discussion_id", row.id)
    .order("date_added", { ascending: true })

  let commentUserMap = new Map<string, string>()
  let authorName: string | null = null
  if (isModerator) {
    const ids = new Set<string>([row.user_id])
    comments?.forEach((c: { user_id: string }) => ids.add(c.user_id))
    const idArray = Array.from(ids)
    if (idArray.length > 0) {
      const { data: users } = await supabase.from("users").select("id, username").in("id", idArray)
      users?.forEach((u: { id: string; username: string | null }) => {
        if (u.username) commentUserMap.set(u.id, u.username)
      })
      authorName = commentUserMap.get(row.user_id) ?? null
    }
  }

  const userBadge = isModerator && authorName ? authorName : row.user_id.slice(0, 8)

  return (
    <div className="space-y-6">
      <Link href="/discussion" className="inline-flex text-sm font-medium text-primary hover:underline">← Back to threads</Link>

      <Card>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-secondary-container px-3 py-1 text-xs font-medium text-on-secondary-container">{row.type}</span>
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${row.is_open === false ? "bg-outline-variant text-on-surface-variant" : "bg-primary-container text-on-primary-container"}`}>{row.is_open === false ? "Closed" : "Open"}</span>
          <span className="text-xs text-on-surface-variant">ref #{row.reference_id}</span>
          {row.date_added && <time className="text-xs text-on-surface-variant">{formatDate(row.date_added)}</time>}
        </div>
        <h1 className="mt-3 text-xl font-semibold leading-snug">{row.title}</h1>
        <p className="mt-1 text-xs text-on-surface-variant">by {userBadge} {row.user_id === user.id ? "(you)" : ""} {canValidate ? "· validator view" : ""}</p>
        <div className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-on-surface">{row.content}</div>
        <div className="mt-4 rounded-xl border border-outline-variant/30 bg-surface-container px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-widest text-on-surface-variant">Data source or References</p>
          {renderDataSource(row.data_source as string[] | null)}
          <p className="mt-2 text-xs leading-relaxed text-on-surface-variant">
            Use the comma or “Add link” input. Each URL must be valid like https://google.com.
          </p>
        </div>
      </Card>

      <Card>
        <h2 className="text-sm font-semibold">Linked record ({row.type} #{row.reference_id})</h2>
        {linkedError ? (
          <p className="mt-2 text-xs text-secondary">Failed to load linked record: {linkedError}</p>
        ) : linked ? (
          row.type === "local_budget" ? (
            (() => {
              const budget = linked as { data: unknown; department?: string; year?: number; data_source?: string[] }
              const raw = budget.data
              let rows: Record<string, string>[] = []
              if (Array.isArray(raw)) {
                rows = (raw as Record<string, unknown>[]).map((o) => {
                  const r: Record<string, string> = {}
                  Object.entries(o as Record<string, unknown>).forEach(([k, v]) => {
                    r[k] = v == null ? "" : String(v)
                  })
                  return r
                })
              } else if (raw && typeof raw === "object" && Array.isArray((raw as { rows?: unknown }).rows)) {
                const nested = (raw as { rows: Record<string, unknown>[] }).rows
                rows = nested.map((o) => {
                  const r: Record<string, string> = {}
                  Object.entries(o).forEach(([k, v]) => {
                    r[k] = v == null ? "" : String(v)
                  })
                  return r
                })
              } else if (raw && typeof raw === "object") {
                const single = raw as Record<string, unknown>

                // treat single object as one row (e.g., {fileName: ..., headers: ...} legacy)
                if (Object.keys(single).length > 0) {

                  // if it's legacy wrapper with fileName/headers, skip and show empty; otherwise show as single row
                  const keys = Object.keys(single)
                  if (keys.length <= 5 && ("fileName" in single || "rowCount" in single)) {
                    rows = []
                  } else {
                    const r: Record<string, string> = {}
                    Object.entries(single).forEach(([k, v]) => {
                      r[k] = v == null ? "" : String(v)
                    })
                    rows = [r]
                  }
                }
              }
              const headers: string[] = rows.length > 0 ? Array.from(new Set(rows.flatMap((o) => Object.keys(o)))) : []
              const rawCount = rows.length
              return (
                <div className="mt-3 space-y-3">
                  {(budget.department || budget.year) && (
                    <p className="text-xs text-on-surface-variant">
                      {budget.department ? <span className="font-medium text-on-surface">{budget.department}</span> : null}
                      {budget.department && budget.year ? " · " : null}
                      {budget.year ? `${budget.year}` : null}
                    </p>
                  )}
                  <div className="rounded-xl border border-outline-variant/30 bg-surface-container-low p-3">
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
                        No preview data available for this record.
                      </p>
                    ) : (
                      <>
                        <div className="mt-4 overflow-auto rounded-xl border border-outline-variant/40 bg-surface">
                          <table className="w-full min-w-[500px] text-sm">
                            <thead className="bg-surface-container">
                              <tr>
                                {headers.map((h) => (
                                  <th
                                    key={h}
                                    className="whitespace-nowrap px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-on-surface-variant"
                                  >
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
                          <p className="mt-2 text-xs text-on-surface-variant">Showing first 10 of {rows.length} rows.</p>
                        )}
                        <p className="mt-3 text-xs leading-relaxed text-on-surface-variant">
                          Stored as <code className="rounded bg-surface-container px-1 py-0.5">data: jsonb</code> ({rawCount} rows). Validators should cross-check against <code className="rounded bg-surface-container px-1 py-0.5">data_source</code>.
                        </p>
                      </>
                    )}
                  </div>
                  <details className="rounded-xl bg-surface-container p-3">
                    <summary className="cursor-pointer text-xs font-medium text-on-surface-variant">Raw JSON (linked record)</summary>
                    <pre className="mt-2 overflow-auto rounded-xl bg-surface-container-low p-3 text-xs leading-relaxed">{JSON.stringify(linked, null, 2)}</pre>
                  </details>
                </div>
              )
            })()
          ) : (
            <pre className="mt-3 overflow-auto rounded-xl bg-surface-container p-4 text-xs leading-relaxed">{JSON.stringify(linked, null, 2)}</pre>
          )
        ) : (
          <p className="mt-2 text-xs text-on-surface-variant">No linked record found (may have been removed).</p>
        )}
        <p className="mt-3 text-xs leading-relaxed text-on-surface-variant">
          Validation: when approved, <code className="rounded bg-surface-container px-1 py-0.5">approved_by</code> is set on the linked table and the entry appears on its public page (legal, announcements, budget). Until then it&apos;s pending.
        </p>
      </Card>

      <Card>
        <h2 className="text-sm font-semibold">Comments</h2>
        {!comments || comments.length === 0 ? (
          <p className="mt-3 text-sm text-on-surface-variant">No comments yet. Validators and the owner can discuss sources, seals, dates, etc.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {comments.map((c: { id: number; user_id: string; comment: string | null; date_added: string | null; reply: number | null }) => {
              const displayName = isModerator ? (commentUserMap.get(c.user_id) ?? c.user_id.slice(0, 8)) : c.user_id.slice(0, 8)
              return (
                <li key={c.id} className="rounded-xl border border-outline-variant/20 bg-surface-container px-4 py-3">
                  <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                    <span className="font-medium text-on-surface">{displayName}</span>
                    {c.user_id === user.id ? <span className="rounded-full bg-primary-container px-2 py-0.5 text-[10px] font-medium text-on-primary-container">you</span> : null}
                    {isModerator && commentUserMap.get(c.user_id) ? <span className="text-[11px] text-on-surface-variant">· {c.user_id.slice(0, 8)}</span> : null}
                    {c.date_added ? <time>{formatDate(c.date_added)}</time> : null}
                    {c.reply ? <span>↳ reply to #{c.reply}</span> : null}
                  </div>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-on-surface">{c.comment ?? ""}</p>
                </li>
              )
            })}
          </ul>
        )}

        {row.is_open === false ? (
          <p className="mt-4 rounded-xl bg-outline-variant/20 px-4 py-3 text-sm text-on-surface-variant">This thread is closed — no new comments.</p>
        ) : (
          <CommentForm discussionId={row.id} />
        )}
      </Card>
    </div>
  )
}

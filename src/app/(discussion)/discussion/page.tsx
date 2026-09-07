import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import CheckPermission from "@/lib/roles"
import { Card } from "@/components/ui/card"
import { formatDate } from "@/lib/functions"
import { DiscussionTabs, TabKey } from "@/components/discussion/discussion-tabs"

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
  approved_by: string | null
  archive_by: string | null
}

function getStatus(row: DiscussionRow): "open" | "approved" | "archived" {
  if (row.approved_by) return "approved"
  if (row.archive_by) return "archived"
  return "open"
}

export default async function Discussions({ searchParams }: { searchParams?: Promise<{ tab?: string }> }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const canValidate = await CheckPermission(user.id, "validate")
  const canContribute = await CheckPermission(user.id, "contribute")

  // Only validate or contribute users reach this layout; double-check
  if (!canValidate && !canContribute) return null

  const sp = searchParams ? await searchParams : {}
  const rawTab = (sp.tab ?? "all").toLowerCase()
  const allowed: TabKey[] = ["all", "open", "approved", "archived"]
  const tab: TabKey = (allowed as string[]).includes(rawTab) ? (rawTab as TabKey) : "all"

  let query = supabase.from("discussion").select("id, user_id, title, content, type, reference_id, date_added, is_open, data_source, approved_by, archive_by").order("date_added", { ascending: false })

  // Contributors (without validate) see only their own threads
  if (!canValidate && canContribute) {
    query = query.eq("user_id", user.id)
  }

  const { data, error } = await query

  if (error) {
    return (
      <Card>
        <p className="text-sm text-secondary">Failed to load discussions: {error.message}</p>
      </Card>
    )
  }

  const rowsAll = (data ?? []) as DiscussionRow[]

  const counts = {
    all: rowsAll.length,
    open: rowsAll.filter((r) => !r.approved_by && !r.archive_by && r.is_open !== false).length,
    approved: rowsAll.filter((r) => !!r.approved_by).length,
    archived: rowsAll.filter((r) => !!r.archive_by && !r.approved_by).length,
  }

  const rows = rowsAll.filter((r) => {
    if (tab === "all") return true
    if (tab === "open") return !r.approved_by && !r.archive_by && r.is_open !== false
    if (tab === "approved") return !!r.approved_by
    if (tab === "archived") return !!r.archive_by && !r.approved_by
    return true
  })

  return (
    <div>
      <div className="mb-6">
        <p className="text-xs font-medium uppercase tracking-widest text-on-surface-variant">Discussion</p>
        <h1 className="mt-1 text-2xl font-semibold">Validation threads</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-on-surface-variant">
          {canValidate
            ? "You have validate access — you can review all threads, comment, and approve/archive submissions."
            : "You have contribute access — you can track your submissions and reply to validators in your threads."}
        </p>
      </div>

      <DiscussionTabs counts={counts} current={tab} />

      {rows.length === 0 ? (
        <Card>
          <p className="text-sm text-on-surface-variant">
            {rowsAll.length === 0
              ? canValidate ? "No discussion threads yet." : "You have no submissions yet. Contribute via /contribute/ordinances, /contribute/announcement, or /contribute/transparency — each creates a discussion thread here."
              : tab === "approved" ? "No approved threads yet."
              : tab === "archived" ? "No archived threads."
              : tab === "open" ? "No open threads — all are closed or pending moderation."
              : "No threads in this filter."}
          </p>
        </Card>
      ) : (
        <ul className="space-y-3">
          {rows.map((d) => {
            const status = getStatus(d)
            return (
            <li key={d.id}>
              <Link href={`/discussion/${d.id}`} className="block">
                <Card className="hover:bg-surface-container transition-colors">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-secondary-container px-3 py-1 text-xs font-medium text-on-secondary-container">{d.type}</span>
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${d.is_open === false ? "bg-outline-variant text-on-surface-variant" : "bg-primary-container text-on-primary-container"}`}>
                      {d.is_open === false ? "Closed" : "Open"}
                    </span>
                    {status === "approved" && <span className="rounded-full bg-tertiary-container px-3 py-1 text-xs font-medium text-on-tertiary-container">Approved</span>}
                    {status === "archived" && <span className="rounded-full bg-secondary-container px-3 py-1 text-xs font-medium text-on-secondary-container">Archived</span>}
                    <span className="text-xs text-on-surface-variant">ref #{d.reference_id}</span>
                    {d.date_added && <time className="text-xs text-on-surface-variant">{formatDate(d.date_added)}</time>}
                  </div>
                  <h2 className="mt-2 text-base font-semibold leading-snug">{d.title}</h2>
                  <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-on-surface-variant">{d.content}</p>
                  <p className="mt-2 text-xs font-medium text-primary">Open thread →</p>
                </Card>
              </Link>
            </li>
            )
          })}
        </ul>
      )}

      <Card className="mt-8 border-primary/20 bg-primary-container/20">
        <h3 className="text-sm font-semibold">How it works</h3>
        <ul className="mt-2 space-y-1 text-xs leading-relaxed text-on-surface-variant">
          <li>• Each submission from <code className="rounded bg-surface-container px-1 py-0.5">/contribute/*</code> inserts into its table (<code>legals</code>, <code>announcements</code>, <code>local_budget</code>) and creates a linked <code>discussion</code> row (type + reference_id).</li>
          <li>• Validators see all threads; contributors see only their own. Direct URL access enforces the same owner/validate check — Forbidden otherwise.</li>
          <li>• <span className="font-medium text-on-surface">Approve</span> (<code>approved_by</code>) = permanently closed &amp; linked record published. <span className="font-medium text-on-surface">Archive</span> (<code>archive_by</code>) = temporarily closed — any validator can unarchive to reopen. Both are nullable; only users with <code>validate</code> permission (data_validator, Head Maintainer) may set them.</li>
          <li>• Use tabs (All / Open / Approved / Archived) to filter. Comments are blocked when closed.</li>
        </ul>
      </Card>
    </div>
  )
}

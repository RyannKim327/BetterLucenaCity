import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import CheckPermission from "@/lib/roles"
import { Card } from "@/components/ui/card"
import { formatDate } from "@/lib/functions"

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

export default async function Discussions() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const canValidate = await CheckPermission(user.id, "validate")
  const canContribute = await CheckPermission(user.id, "contribute")

  // Only validate or contribute users reach this layout; double-check
  if (!canValidate && !canContribute) return null

  let query = supabase.from("discussion").select("id, user_id, title, content, type, reference_id, date_added, is_open, data_source").order("date_added", { ascending: false })

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

  const rows = (data ?? []) as DiscussionRow[]

  return (
    <div>
      <div className="mb-6">
        <p className="text-xs font-medium uppercase tracking-widest text-on-surface-variant">Discussion</p>
        <h1 className="mt-1 text-2xl font-semibold">Validation threads</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-on-surface-variant">
          {canValidate
            ? "You have validate access — you can review all threads, comment, and approve/reject submissions."
            : "You have contribute access — you can track your submissions and reply to validators in your threads."}
        </p>
      </div>

      {rows.length === 0 ? (
        <Card>
          <p className="text-sm text-on-surface-variant">
            {canValidate ? "No discussion threads yet." : "You have no submissions yet. Contribute via /contribute/ordinances, /contribute/announcement, or /contribute/transparency — each creates a discussion thread here."}
          </p>
        </Card>
      ) : (
        <ul className="space-y-3">
          {rows.map((d) => (
            <li key={d.id}>
              <Link href={`/discussion/${d.id}`} className="block">
                <Card className="hover:bg-surface-container transition-colors">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-secondary-container px-3 py-1 text-xs font-medium text-on-secondary-container">{d.type}</span>
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${d.is_open === false ? "bg-outline-variant text-on-surface-variant" : "bg-primary-container text-on-primary-container"}`}>
                      {d.is_open === false ? "Closed" : "Open"}
                    </span>
                    <span className="text-xs text-on-surface-variant">ref #{d.reference_id}</span>
                    {d.date_added && <time className="text-xs text-on-surface-variant">{formatDate(d.date_added)}</time>}
                  </div>
                  <h2 className="mt-2 text-base font-semibold leading-snug">{d.title}</h2>
                  <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-on-surface-variant">{d.content}</p>
                  <p className="mt-2 text-xs font-medium text-primary">Open thread →</p>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <Card className="mt-8 border-primary/20 bg-primary-container/20">
        <h3 className="text-sm font-semibold">How it works</h3>
        <ul className="mt-2 space-y-1 text-xs leading-relaxed text-on-surface-variant">
          <li>• Each submission from <code className="rounded bg-surface-container px-1 py-0.5">/contribute/*</code> inserts into its table (<code>legals</code>, <code>announcements</code>, <code>local_budget</code>) and creates a linked <code>discussion</code> row (type + reference_id).</li>
          <li>• Validators see all threads; contributors see only their own. Direct URL access enforces the same owner/validate check — Forbidden otherwise.</li>
          <li>• Discuss, validate sources, then Head Maintainer approves (<code>approved_by</code>) to publish.</li>
        </ul>
      </Card>
    </div>
  )
}

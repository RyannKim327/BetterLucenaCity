import { NextRequest, NextResponse, after } from "next/server"
import { createClient } from "@/lib/supabase/server"
import CheckPermission from "@/lib/roles"
import { dispatchNotification, VALIDATOR_ROLES } from "@/lib/notifications"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "You must be signed in" }, { status: 401 })

  const canValidate = await CheckPermission(user.id, "validate")
  const canContribute = await CheckPermission(user.id, "contribute")
  if (!canValidate && !canContribute) return NextResponse.json({ error: "Forbidden — need contribute or validate" }, { status: 403 })

  const { data, error } = await supabase.from("discussion").select("id, user_id, title, content, type, reference_id, date_added, is_open, data_source, approved_by, archive_by").eq("id", id).maybeSingle()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 })

  if (!canValidate && data.user_id !== user.id) {
    return NextResponse.json({ error: "Forbidden — you can only access your own discussions" }, { status: 403 })
  }

  // Optionally include linked record
  let linked: unknown = null
  if (data.type === "legals") {
    const { data: r } = await supabase.from("legals").select("*").eq("id", data.reference_id).maybeSingle()
    linked = r
  } else if (data.type === "announcements") {
    const { data: r } = await supabase.from("announcements").select("*").eq("id", data.reference_id).maybeSingle()
    linked = r
  } else if (data.type === "local_budget") {
    const { data: r } = await supabase.from("local_budget").select("*").eq("id", data.reference_id).maybeSingle()
    linked = r
  } else if (data.type === "procurement") {
    const { data: r } = await supabase.from("procurement").select("*").eq("id", data.reference_id).maybeSingle()
    linked = r
  }

  const { data: comments } = await supabase.from("discussion_comments").select("id, user_id, comment, reply, date_added").eq("discussion_id", id).order("date_added", { ascending: true })

  return NextResponse.json({ discussion: data, linked, comments: comments ?? [] })
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "You must be signed in" }, { status: 401 })

  const canValidate = await CheckPermission(user.id, "validate")
  if (!canValidate) return NextResponse.json({ error: "Forbidden — validator permission required" }, { status: 403 })

  let body: { action?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }
  const action = (body.action ?? "").trim().toLowerCase()
  if (!["approve", "unapprove", "archive", "unarchive"].includes(action)) {
    return NextResponse.json({ error: "Invalid action. Use approve | unapprove | archive | unarchive" }, { status: 400 })
  }

  const { data: row, error: fetchErr } = await supabase.from("discussion").select("id, type, reference_id, is_open, approved_by, archive_by").eq("id", id).maybeSingle()
  if (fetchErr) return NextResponse.json({ error: fetchErr.message }, { status: 500 })
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 })

  let update: Record<string, unknown> = {}
  let linkedTable: string | null = null
  if (row.type === "legals" || row.type === "announcements" || row.type === "local_budget" || row.type === "procurement") {
    linkedTable = row.type
  }

  if (action === "approve") {
    if (row.approved_by) return NextResponse.json({ error: "Already approved" }, { status: 409 })
    update = { approved_by: user.id, archive_by: null, is_open: false }
  } else if (action === "unapprove") {
    if (!row.approved_by) return NextResponse.json({ error: "Not approved" }, { status: 409 })
    update = { approved_by: null }
  } else if (action === "archive") {
    if (row.approved_by) return NextResponse.json({ error: "Cannot archive an approved discussion — unapprove first" }, { status: 409 })
    if (row.archive_by) return NextResponse.json({ error: "Already archived" }, { status: 409 })
    update = { archive_by: user.id, is_open: false }
  } else if (action === "unarchive") {
    if (!row.archive_by) return NextResponse.json({ error: "Not archived" }, { status: 409 })
    update = { archive_by: null, is_open: row.approved_by ? false : true }
  }

  const { data: updated, error: updErr } = await supabase.from("discussion").update(update).eq("id", id).select("id, user_id, title, content, type, reference_id, date_added, is_open, data_source, approved_by, archive_by").single()
  if (updErr) return NextResponse.json({ error: updErr.message }, { status: 500 })

  let response = updated

  // The approved-record lock trigger only allows changing approved_by in the unapprove update.
  // Reopen the thread in a separate statement once the record is no longer approved.
  if (action === "unapprove") {
    const reopen = row.archive_by ? false : true
    if (updated.is_open !== reopen) {
      const { data: reopened, error: reopenErr } = await supabase.from("discussion").update({ is_open: reopen }).eq("id", id).select("id, user_id, title, content, type, reference_id, date_added, is_open, data_source, approved_by, archive_by").single()
      if (reopenErr) return NextResponse.json({ error: reopenErr.message }, { status: 500 })
      if (reopened) response = reopened
    }
  }

  // Propagate approval to linked table (publish) — validators approve to make data public
  if (linkedTable) {
    try {
      if (action === "approve") {
        await supabase.from(linkedTable).update({ approved_by: user.id } as never).eq("id", row.reference_id).is("approved_by", null)
      } else if (action === "unapprove") {
        await supabase.from(linkedTable).update({ approved_by: null } as never).eq("id", row.reference_id)
      }
    } catch {
      // best-effort; don't fail discussion update if linked propagation fails
    }
  }

  after(async () => {
    const actionLabel =
      action === "approve"
        ? "approved"
        : action === "unapprove"
          ? "returned to draft"
          : action === "archive"
            ? "archived"
            : "unarchived"

    if (updated.user_id && updated.user_id !== user.id) {
      await dispatchNotification(supabase, {
        category: "discussion",
        title: `Your discussion was ${actionLabel}`,
        body: updated.title,
        href: `/discussion/${id}`,
        recipientIds: [updated.user_id],
        data: { discussionId: id, action },
      })
    }

    if (action === "approve") {
      if (row.type === "announcements") {
        await dispatchNotification(supabase, {
          category: "announcement",
          title: "New announcement published",
          body: updated.title,
          href: `/announcements/${row.reference_id}`,
          data: { discussionId: id, announcementId: row.reference_id },
          excludeUserIds: [user.id],
        })
      } else {
        await dispatchNotification(supabase, {
          category: "discussion",
          title: "Contribution approved",
          body: updated.title,
          href: `/discussion/${id}`,
          roles: VALIDATOR_ROLES,
          excludeUserIds: [user.id],
          data: { discussionId: id, action },
        })
      }
    }
  })

  return NextResponse.json(response)
}

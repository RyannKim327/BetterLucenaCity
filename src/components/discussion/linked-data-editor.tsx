"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MarkdownEditor } from "@/components/ui/markdown-editor"
import { DataSourceInput } from "@/components/ui/data-source-input"
import { Loader2, Lock, Pencil } from "lucide-react"

type AnnouncementLinked = {
  id: number
  title: string
  content: string
  date_added: string | null
  data_source: string[] | null
  approved_by: string | null
}

type Props = {
  discussionId: string
  type: string
  linked: unknown
  isApproved: boolean
  isArchived: boolean
  isOpen: boolean | null
  isOwner: boolean
  canValidate: boolean
}

export function LinkedDataEditor({ discussionId, type, linked, isApproved, isArchived, isOpen, isOwner, canValidate }: Props) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Only collector (owner) may edit while open and not approved. Once done (approved) it must not be editable.
  // Archived is temporarily closed — also not editable until unarchived.
  const isLocked = isApproved
  const isTempClosed = isArchived || isOpen === false
  const canEdit = !isLocked && !isTempClosed && (isOwner || canValidate) && type === "announcements"

  // For non-announcements, we still show lock info but no editor yet (generic JSON note)
  const canEditGeneric = !isLocked && !isTempClosed && (isOwner || canValidate)

  // Announcement specific state
  const ann = linked as AnnouncementLinked | null
  const [title, setTitle] = useState(ann?.title ?? "")
  const [content, setContent] = useState(ann?.content ?? "")
  const [dataSource, setDataSource] = useState<string[]>(Array.isArray(ann?.data_source) ? (ann!.data_source as string[]) : [])

  async function handleSave() {
    setError(null)
    setSuccess(null)
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required.")
      return
    }
    setSaving(true)
    try {
      const res = await fetch(`/api/discussion/${discussionId}/linked`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), content: content.trim(), data_source: dataSource }),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(body.error ?? "Failed to save")
      setSuccess("Saved — thread and linked announcement updated.")
      setEditing(false)
      router.refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unexpected error")
    } finally {
      setSaving(false)
    }
  }

  if (type !== "announcements") {
    // Generic lock notice for other types; collector edit will be added similarly via same endpoint
    return (
      <div>
        {isLocked ? (
          <div className="mt-3 flex items-start gap-2 rounded-xl border border-outline-variant/30 bg-surface-container px-4 py-3">
            <Lock className="mt-0.5 h-4 w-4 shrink-0 text-on-surface-variant" />
            <div>
              <p className="text-xs font-semibold text-on-surface">Locked — approved and published</p>
              <p className="mt-1 text-xs leading-relaxed text-on-surface-variant">
                This linked {type} record is approved and must not be edited after it is done. To correct it, open a new Data Verification / Correction discussion so validators can review the change.
                {canEditGeneric ? "" : isOwner ? " You are the data collector — editing is allowed only while the thread is open and before approval." : ""}
              </p>
            </div>
          </div>
        ) : isTempClosed ? (
          <div className="mt-3 rounded-xl border border-outline-variant/30 bg-surface-container px-4 py-3">
            <p className="text-xs font-semibold text-on-surface">Temporarily closed (archived)</p>
            <p className="mt-1 text-xs leading-relaxed text-on-surface-variant">Editing is paused while archived. Ask a validator to unarchive to allow edits again.</p>
          </div>
        ) : canEditGeneric ? (
          <div className="mt-3 rounded-xl border border-primary/20 bg-primary-container/20 px-4 py-3">
            <p className="text-xs leading-relaxed text-on-surface-variant">
              This linked {type} record can be edited by the data collector while the thread is open. Use the thread comments to coordinate, or call <code className="rounded bg-surface px-1 py-0.5 text-xs">PATCH /api/discussion/{discussionId}/linked</code> to update. Announcement editing has a full UI below; other types support edits via the same endpoint (validator may unapprove to unlock if needed).
            </p>
          </div>
        ) : null}
      </div>
    )
  }

  // Announcements editor
  return (
    <div className="mt-4">
      {isLocked ? (
        <div className="flex items-start gap-2 rounded-xl border border-tertiary-container bg-tertiary-container/40 px-4 py-3">
          <Lock className="mt-0.5 h-4 w-4 shrink-0 text-on-tertiary-container" />
          <div>
            <p className="text-xs font-semibold text-on-tertiary-container">Locked — approved and published</p>
            <p className="mt-1 text-xs leading-relaxed text-on-surface-variant">
              This announcement was approved and is now public at <code className="rounded bg-surface px-1 py-0.5 text-xs">/announcements/{ann?.id}</code>. It must not be edited directly after it is done. If a correction is needed, submit a new Data Verification / Correction thread.
            </p>
          </div>
        </div>
      ) : isTempClosed ? (
        <div className="rounded-xl border border-outline-variant/30 bg-surface-container px-4 py-3">
          <p className="text-xs font-semibold text-on-surface">Temporarily closed (archived)</p>
          <p className="mt-1 text-xs leading-relaxed text-on-surface-variant">Editing is paused while archived. A validator can unarchive to allow the data collector to edit again.</p>
        </div>
      ) : canEdit ? (
        <>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="inline-flex h-9 items-center gap-2 rounded-full border border-primary bg-primary-container px-5 text-sm font-medium text-on-primary-container hover:bg-primary-container/80"
            >
              <Pencil className="h-4 w-4" /> Edit announcement (data collector)
            </button>
          ) : (
            <div className="rounded-xl border border-outline-variant/30 bg-surface-container-low p-4">
              <h4 className="text-sm font-semibold">Edit linked announcement</h4>
              <p className="mt-1 text-xs leading-relaxed text-on-surface-variant">
                You are the data collector — you may modify the linked announcement while the thread is open. Once a validator approves it, the record becomes permanently locked (must not be editable after it is done).
              </p>

              <div className="mt-4 space-y-4">
                <div>
                  <label htmlFor="linked-title" className="block text-sm font-medium text-on-surface">
                    Title <span className="text-secondary">*</span>
                  </label>
                  <input
                    id="linked-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={160}
                    className="mt-1.5 w-full rounded-xl border border-outline-variant bg-surface px-3.5 py-2.5 text-sm text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                <div>
                  <label htmlFor="linked-content" className="block text-sm font-medium text-on-surface">
                    Content — markdown <span className="text-secondary">*</span>
                  </label>
                  <div className="mt-1.5">
                    <MarkdownEditor id="linked-content" value={content} onChange={setContent} rows={6} placeholder="Markdown content" />
                  </div>
                </div>

                <DataSourceInput value={dataSource} onChange={setDataSource} label="Reference links" hint="Add URLs like https://google.com — separate with comma or Add link." placeholder="https://google.com, https://facebook.com/official-post" id="linked-data-source" />

                {error && <p className="rounded-xl bg-secondary-container/40 px-4 py-2 text-sm text-on-secondary-container">{error}</p>}
                {success && <p className="rounded-xl bg-primary-container/40 px-4 py-2 text-sm text-on-primary-container">{success}</p>}

                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="inline-flex h-9 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-on-primary hover:bg-primary/90 disabled:opacity-60"
                  >
                    {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</> : "Save changes"}
                  </button>
                  <button
                    onClick={() => {
                      setEditing(false)
                      setError(null)
                      setSuccess(null)
                      if (ann) {
                        setTitle(ann.title)
                        setContent(ann.content)
                        setDataSource(Array.isArray(ann.data_source) ? (ann.data_source as string[]) : [])
                      }
                    }}
                    disabled={saving}
                    className="inline-flex h-9 items-center justify-center rounded-full border border-outline-variant bg-surface px-5 text-sm font-medium text-on-surface hover:bg-surface-container disabled:opacity-60"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
          {editing ? null : <p className="mt-2 text-xs leading-relaxed text-on-surface-variant">Editing is allowed only before approval. After a validator clicks “Approve &amp; close”, this announcement and the thread become permanently locked.</p>}
        </>
      ) : (
        <p className="text-xs leading-relaxed text-on-surface-variant">
          Only the data collector (thread owner) may edit this linked announcement while the thread is open, and only before it is approved.
          {isOwner ? " Your thread is currently not editable (closed/archived)." : " You are not the owner of this thread."}
        </p>
      )}
    </div>
  )
}

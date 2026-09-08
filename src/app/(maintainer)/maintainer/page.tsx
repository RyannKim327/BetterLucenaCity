import { PendingList } from "@/components/admin/pending-list";
import { Card } from "@/components/ui/card";

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-base font-semibold">Pending contributors</h2>
        <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">
          New users default to pending and must pick a role when <code className="rounded bg-surface-container px-1 py-0.5 text-[11px]">user role</code> is null. Approve them here after vetting.
        </p>
        <div className="mt-6">
          <PendingList />
        </div>
      </Card>
    </div>
  )
}

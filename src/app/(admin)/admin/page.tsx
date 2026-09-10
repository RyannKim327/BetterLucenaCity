import { PendingList } from "@/components/admin/pending-list";
import { Card } from "@/components/ui/card";

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-base font-semibold">Pending contributors</h2>
        <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">
          New users are pending by default and must select a role before they can be approved. Review requests carefully before approving.
        </p>
        <div className="mt-6">
          <PendingList />
        </div>
      </Card>
    </div>
  )
}

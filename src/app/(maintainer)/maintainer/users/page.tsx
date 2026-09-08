import { UserManagement } from "@/components/admin/user-management";
import { Card } from "@/components/ui/card";

export default function UsersList() {
  return (
    <div>
      <div className="mb-6">
        <p className="text-xs font-medium uppercase tracking-widest text-on-surface-variant">Users Lists</p>
        <h1 className="mt-1 text-2xl font-semibold">Users Information and Permissions</h1>
        <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
          Search by email or username. Maintainers can restrict users only — unrestrict requires a Head Maintainer (Admin).
        </p>
      </div>

      <Card>
        <UserManagement variant="maintainer" />
      </Card>
    </div>
  )
}

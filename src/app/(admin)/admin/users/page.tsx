import { UserManagement } from "@/components/admin/user-management";
import { Card } from "@/components/ui/card";

export default function UsersList() {
  return (
    <div>
      <div className="mb-6">
        <p className="text-xs font-medium uppercase tracking-widest text-on-surface-variant">Users Lists</p>
        <h1 className="mt-1 text-2xl font-semibold">Users Information and Permissions</h1>
        <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
          Search by email or username. Admins can restrict/unrestrict users and change roles (e.g., Tester → Maintainer). Head Maintainer is protected and cannot be assigned via this panel.
        </p>
      </div>

      <Card>
        <UserManagement variant="admin" />
      </Card>
    </div>
  )
}

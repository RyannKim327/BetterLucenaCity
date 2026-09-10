"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState, useCallback, useRef } from "react";
import { Search, ShieldAlert, ShieldCheck, Loader2, AlertTriangle } from "lucide-react";
import { Modal } from "@/components/ui/modal";

type ManagedUser = {
  id: string;
  username: string;
  email: string;
  avatar_url: string | null;
  user_type: string | null;
  approved: boolean | null;
  restricted: boolean | null;
  date_added: string;
};

type Props = {
  variant: "admin" | "maintainer";
};

const ADMIN_ALLOWED_ROLES = ["Maintainer", "Data Collaborator", "Data Validator", "Tester"] as const;

export function UserManagement({ variant }: Props) {
  const isAdmin = variant === "admin";
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [acting, setActing] = useState<string | null>(null);
  const [roleChanging, setRoleChanging] = useState<string | null>(null);
  const [roleValues, setRoleValues] = useState<Record<string, string>>({});
  const [confirmTarget, setConfirmTarget] = useState<{ id: string; username: string; email: string; nextRestricted: boolean } | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const fetchUrl = isAdmin ? "/api/admin/users" : "/api/maintainer/users";
  const restrictUrl = isAdmin ? "/api/admin/restrict" : "/api/maintainer/restrict";

  // Debounce search input 300ms
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const url = debouncedSearch ? `${fetchUrl}?q=${encodeURIComponent(debouncedSearch)}` : fetchUrl;
      const res = await fetch(url);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to load users");
      let list: ManagedUser[] = Array.isArray(json) ? json : [];
      // Defensive: hide Head Maintainers from maintainer view even if API leaks
      if (!isAdmin) {
        list = list.filter((u) => u.user_type !== "Head Maintainer");
      }
      setUsers(list);
      // init roleValues for admin
      if (isAdmin) {
        const map: Record<string, string> = {};
        for (const u of list as ManagedUser[]) {
          if (u.user_type) map[u.id] = u.user_type;
        }
        setRoleValues(map);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error loading users");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, fetchUrl, isAdmin]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleRestrict(id: string, restricted: boolean) {
    setActing(id);
    setError("");
    try {
      const res = await fetch(restrictUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, restricted }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to update restriction");

      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, restricted: json.restricted ?? restricted } : u)));
      setConfirmTarget(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to restrict");
    } finally {
      setActing(null);
    }
  }

  async function handleChangeRole(id: string) {
    const newRole = roleValues[id];
    if (!newRole) {
      setError("Please select a role.");
      return;
    }
    if (!ADMIN_ALLOWED_ROLES.includes(newRole as typeof ADMIN_ALLOWED_ROLES[number])) {
      setError("Invalid role. Head Maintainer cannot be assigned.");
      return;
    }
    setRoleChanging(id);
    setError("");
    try {
      const res = await fetch("/api/admin/change-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, user_type: newRole }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to change role");
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, user_type: json.user_type ?? newRole } : u)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to change role");
    } finally {
      setRoleChanging(null);
    }
  }

  return (
    <div className="space-y-4">
      {/* Searchbox */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
          <input
            type="search"
            placeholder="Search by email or username…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-full border border-outline-variant/40 bg-surface-container-low py-2 pl-10 pr-4 text-sm text-on-surface placeholder:text-on-surface-variant focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
          />
        </div>
        <p className="text-xs text-on-surface-variant">
          {loading ? "Loading…" : `${users.length} user${users.length !== 1 ? "s" : ""} ${debouncedSearch ? `for "${debouncedSearch}"` : "total"}`}
        </p>
      </div>

      {error && (
        <p className="rounded-xl bg-error-container px-4 py-3 text-sm text-on-error-container">{error}</p>
      )}

      {!isAdmin && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-900">
          Maintainers can <span className="font-semibold">restrict</span> users, but cannot unrestrict. Contact a Head Maintainer to unrestrict.
        </p>
      )}

      {loading ? (
        <p className="animate-pulse text-sm text-on-surface-variant">Loading users…</p>
      ) : users.length === 0 ? (
        <p className="rounded-xl border border-outline-variant/40 bg-surface-container-low px-4 py-6 text-center text-sm text-on-surface-variant">
          No users found{debouncedSearch ? ` for "${debouncedSearch}"` : ""}.
        </p>
      ) : (
        <ul className="divide-y divide-outline-variant/30 rounded-xl border border-outline-variant/40 bg-surface-container-low">
          {users.map((u) => {
            const isRestricted = !!u.restricted;
            const isHeadMaintainer = u.user_type === "Head Maintainer";
            return (
              <li key={u.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={u.avatar_url ?? `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(u.username)}`}
                  alt={u.username}
                  className="size-10 shrink-0 rounded-full border border-outline-variant/40 object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-medium text-on-surface">{u.username}</p>
                    {u.user_type && (
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${isHeadMaintainer
                            ? "bg-primary-container text-on-primary-container"
                            : "bg-secondary-container text-on-secondary-container"
                          }`}
                      >
                        {u.user_type}
                      </span>
                    )}
                    {u.approved === true ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-medium text-green-800">
                        <ShieldCheck className="h-3 w-3" /> Approved
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-800">
                        Pending
                      </span>
                    )}
                    {isRestricted && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-error-container px-2 py-0.5 text-[10px] font-medium text-on-error-container">
                        <ShieldAlert className="h-3 w-3" /> Restricted
                      </span>
                    )}
                  </div>
                  <p className="truncate text-xs text-on-surface-variant">
                    {u.email} · {new Date(u.date_added).toLocaleDateString()}
                  </p>
                  {/* Admin role changer */}
                  {isAdmin && (
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <label className="text-[11px] font-medium text-on-surface-variant" htmlFor={`role-${u.id}`}>
                        Change role:
                      </label>
                      <select
                        id={`role-${u.id}`}
                        value={roleValues[u.id] ?? u.user_type ?? ""}
                        onChange={(e) => setRoleValues((prev) => ({ ...prev, [u.id]: e.target.value }))}
                        disabled={isHeadMaintainer || !!roleChanging}
                        className="h-8 rounded-full border border-outline-variant/40 bg-surface px-3 text-xs text-on-surface focus:border-primary focus:outline-none disabled:opacity-60"
                      >
                        <option disabled value="">Select role</option>
                        {ADMIN_ALLOWED_ROLES.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        disabled={roleChanging === u.id || isHeadMaintainer}
                        onClick={() => handleChangeRole(u.id)}
                        className="inline-flex h-8 items-center justify-center rounded-full bg-secondary px-3 text-xs font-medium text-on-secondary hover:bg-secondary/90 disabled:opacity-50"
                        title={isHeadMaintainer ? "Cannot change role of Head Maintainer" : "Update user role"}
                      >
                        {roleChanging === u.id ? <Loader2 className="h-3 w-3 animate-spin" /> : "Update"}
                      </button>
                      {isHeadMaintainer && (
                        <span className="text-[11px] text-on-surface-variant">Head Maintainer role is protected</span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex shrink-0 items-center gap-2 self-start sm:self-center">
                  {isRestricted ? (
                    isAdmin ? (
                      <button
                        type="button"
                        disabled={acting === u.id}
                        onClick={() => setConfirmTarget({ id: u.id, username: u.username, email: u.email, nextRestricted: false })}
                        className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full border border-outline bg-surface px-4 text-xs font-medium text-on-surface hover:bg-surface-container disabled:opacity-60"
                      >
                        {acting === u.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ShieldCheck className="h-3.5 w-3.5" />}
                        Unrestrict
                      </button>
                    ) : (
                      <span className="inline-flex h-9 items-center rounded-full bg-surface-container px-4 text-xs font-medium text-on-surface-variant">
                        Restricted
                      </span>
                    )
                  ) : (
                    <button
                      type="button"
                      disabled={acting === u.id || isHeadMaintainer}
                      onClick={() => setConfirmTarget({ id: u.id, username: u.username, email: u.email, nextRestricted: true })}
                      className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full bg-error px-4 text-xs font-medium text-on-error hover:bg-error/90 disabled:opacity-60"
                      title={isHeadMaintainer ? "Cannot restrict Head Maintainer" : "Restrict user"}
                    >
                      {acting === u.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ShieldAlert className="h-3.5 w-3.5" />}
                      Restrict
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <p className="text-[11px] leading-relaxed text-on-surface-variant">
        Search by username or email (case-insensitive). Restricted users lose all access.{" "}
        {isAdmin
          ? "Admins can restrict, unrestrict, and change roles (excluding Head Maintainer)."
          : "Maintainers can only restrict — contact a Head Maintainer to unrestrict."}
      </p>

      {/* Confirmation modal for restrict / unrestrict */}
      <Modal
        open={!!confirmTarget}
        onClose={() => (acting ? null : setConfirmTarget(null))}
        title={confirmTarget?.nextRestricted ? "Restrict user?" : "Unrestrict user?"}
      >
        {confirmTarget && (
          <div className="space-y-4">
            <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
              <div className="text-sm leading-relaxed text-amber-900">
                {confirmTarget.nextRestricted ? (
                  <>
                    <p className="font-semibold">You are about to restrict this user. This action will revoke all permissions immediately.</p>
                    <p className="mt-1 text-xs text-amber-800">
                      Restricted users lose access to contributions, discussions, and reports.{" "}
                      {!isAdmin && "Only a Head Maintainer can unrestrict — this cannot be undone by Maintainers."}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-semibold">You are about to unrestrict this user. This will restore their permissions based on their role.</p>
                    <p className="mt-1 text-xs text-amber-800">Ensure you have verified the user should regain access.</p>
                  </>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-outline-variant/40 bg-surface p-3">
              <p className="text-xs font-medium uppercase tracking-widest text-on-surface-variant">Target user</p>
              <p className="mt-1 text-sm font-semibold text-on-surface">{confirmTarget.username}</p>
              <p className="text-xs text-on-surface-variant">{confirmTarget.email}</p>
              <p className="mt-1 text-[11px] text-on-surface-variant">ID: {confirmTarget.id}</p>
            </div>

            <p className="text-xs leading-relaxed text-on-surface-variant">
              {confirmTarget.nextRestricted
                ? "Please confirm you have reviewed this user’s activity before restricting."
                : "Please confirm you want to restore this user’s access."}
            </p>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmTarget(null)}
                disabled={!!acting}
                className="inline-flex h-9 items-center justify-center rounded-full border border-outline bg-surface px-5 text-sm font-medium text-on-surface hover:bg-surface-container disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!!acting}
                onClick={() => handleRestrict(confirmTarget.id, confirmTarget.nextRestricted)}
                className={`inline-flex h-9 items-center justify-center gap-2 rounded-full px-5 text-sm font-medium disabled:opacity-60 ${confirmTarget.nextRestricted
                    ? "bg-error text-on-error hover:bg-error/90"
                    : "bg-primary text-on-primary hover:bg-primary/90"
                  }`}
              >
                {acting === confirmTarget.id ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {confirmTarget.nextRestricted ? "Confirm Restrict" : "Confirm Unrestrict"}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

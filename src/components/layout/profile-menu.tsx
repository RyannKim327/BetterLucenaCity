"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Settings,
  LogIn,
  LogOut,
  LayoutDashboard,
  FilePenLine,
  MessageSquare,
  Flag,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

// Client-safe duplicate of lib/roles.ts (which imports next/headers via supabase/server).
// Keep in sync with src/lib/roles.ts
const allRoles = ["admin", "maintainer", "contribute", "discussion", "report"] as const;
const roles: Record<string, readonly string[]> = {
  head_maintainer: ["ALL"],
  maintainer: ["maintainer", "contribute", "discussion", "report"],
  data_collaborator: ["contribute", "discussion", "report"],
  data_validator: ["discussion", "report", "validate"],
  tester: ["contribute", "discussion", "report"],
} as const;

type ProfileState = {
  user_type: string | null;
  approved: boolean | null;
  username: string | null;
  avatar_url: string | null;
} | null;

type DropdownLink = {
  href: string;
  label: string;
  Icon: typeof User;
  perm?: string; // if undefined, always visible
};

const DEFAULT_LINKS: DropdownLink[] = [
  { href: "/user", label: "Profile", Icon: User },
  { href: "/user/settings", label: "Settings", Icon: Settings },
];

const ROLE_LINKS: DropdownLink[] = [
  { href: "/admin", label: "Admin Dashboard", Icon: LayoutDashboard, perm: "admin" },
  { href: "/contribute", label: "Contribute", Icon: FilePenLine, perm: "contribute" },
  { href: "/discussion", label: "Discussions", Icon: MessageSquare, perm: "discussion" },
  { href: "/report", label: "Report", Icon: Flag, perm: "report" },
];

function hasPermission(profile: ProfileState, perm: string): boolean {
  if (!profile || profile.approved !== true || !profile.user_type) return false;
  const trimmed = profile.user_type.trim();
  if (!trimmed) return false;
  const key = trimmed.replace(/\s/g, "_").toLowerCase();
  let perms: readonly string[] = roles[key] ?? [];
  if (perms.length === 1 && perms[0] === "ALL") perms = allRoles;
  const lower = [...perms].map((p) => p.toLowerCase());
  // "discussion" also covers "validate" permission holders
  if (perm === "discussion") {
    return lower.includes("discussion") || lower.includes("validate");
  }
  return lower.includes(perm.toLowerCase());
}

export function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<{ email?: string | null; id: string } | null>(null);
  const [profile, setProfile] = useState<ProfileState>(null);
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    const supabase = createClient();

    async function fetchState() {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      if (!mounted) return;
      if (!authUser) {
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }
      setUser({ id: authUser.id, email: authUser.email });
      const { data } = await supabase
        .from("users")
        .select("user_type, approved, username, avatar_url")
        .eq("id", authUser.id)
        .maybeSingle();
      if (!mounted) return;
      setProfile(
        data
          ? {
            user_type: data.user_type,
            approved: data.approved,
            username: data.username ?? null,
            avatar_url: data.avatar_url ?? null,
          }
          : null
      );
      setLoading(false);
    }

    fetchState();

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      // Re-fetch on auth change (sign in/out)
      setLoading(true);
      fetchState();
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const accessibleRoleLinks = ROLE_LINKS.filter((link) => {
    if (!link.perm) return true;
    return hasPermission(profile, link.perm);
  });

  // Build ordered list: role-based links first, then default links
  const orderedLinks: DropdownLink[] = [...accessibleRoleLinks, ...DEFAULT_LINKS];

  const displayName =
    profile?.username ?? user?.email?.split("@")[0] ?? null;

  const handleSignOut = async () => {
    setSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    setOpen(false);
    setSigningOut(false);
    router.refresh();
    router.push("/");
  };

  const isAuthenticated = !!user;

  if (!isAuthenticated) return <></>

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Profile menu"
        className="inline-flex size-11 items-center justify-center rounded-full bg-surface-container-low text-on-surface hover:bg-primary/8 transition-colors overflow-hidden border border-outline-variant/30"
      >
        {loading ? (
          <Loader2 size={20} className="animate-spin text-on-surface-variant" aria-hidden />
        ) : profile?.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.avatar_url}
            alt={displayName ?? "Profile"}
            className="size-11 object-cover"
          />
        ) : (
          <User size={22} strokeWidth={1.8} aria-hidden />
        )}
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Profile"
          className="absolute right-0 top-full z-20 mt-2 min-w-[16rem] overflow-hidden rounded-xl border border-outline-variant/40 bg-surface-container-high shadow-elevation-2"
        >
          {/* Header */}
          <div className="border-b border-outline-variant/30 bg-surface-container-low px-4 py-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-container text-on-primary-container">
                  {profile?.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={profile.avatar_url}
                      alt=""
                      className="size-9 object-cover"
                    />
                  ) : (
                    <User size={18} strokeWidth={1.8} aria-hidden />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-on-surface">
                    {displayName ?? "User"}
                  </p>
                  <p className="truncate text-xs text-on-surface-variant">
                    {profile?.user_type ? profile.user_type : "No role"} ·{" "}
                    {profile?.approved ? "Approved" : "Pending"}
                  </p>
                  {user?.email && (
                    <p className="truncate text-xs text-on-surface-variant">{user.email}</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-full bg-primary-container text-on-primary-container">
                  <ShieldCheck size={18} strokeWidth={1.8} aria-hidden />
                </div>
                <div>
                  <p className="text-sm font-semibold text-on-surface">Guest</p>
                  <p className="text-xs text-on-surface-variant">Not signed in</p>
                </div>
              </div>
            )}
          </div>

          {/* Links */}
          <div className="p-1">
            {orderedLinks.map(({ href, label, Icon }) => (
              <Link
                key={href}
                href={href}
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-on-surface-variant hover:bg-primary/8 hover:text-on-surface transition-colors"
              >
                <Icon size={18} strokeWidth={1.8} aria-hidden />
                {label}
              </Link>
            ))}

            {!isAuthenticated && accessibleRoleLinks.length === 0 && (
              <p className="px-3 py-2 text-xs leading-relaxed text-on-surface-variant">
                Sign in to access Contribute, Discussions, and more based on your role.
              </p>
            )}
          </div>

          <div className="border-t border-outline-variant/30 p-1">
            {isAuthenticated ? (
              <button
                type="button"
                role="menuitem"
                onClick={handleSignOut}
                disabled={signingOut}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-on-surface-variant hover:bg-primary/8 hover:text-on-surface transition-colors disabled:opacity-60"
              >
                {signingOut ? (
                  <Loader2 size={18} className="animate-spin" aria-hidden />
                ) : (
                  <LogOut size={18} strokeWidth={1.8} aria-hidden />
                )}
                Sign out
              </button>
            ) : (
              <Link
                href="/contribute"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-primary hover:bg-primary/8 transition-colors"
              >
                <LogIn size={18} strokeWidth={1.8} aria-hidden />
                Sign in
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

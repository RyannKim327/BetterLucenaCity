import type { SupabaseClient } from "@supabase/supabase-js";
import sendEmail from "./email-send";
import { sendPushToUsers } from "./web-push";
import { createServiceClient } from "./supabase/service";

export type NotificationCategory =
  | "announcement"
  | "discussion"
  | "report"
  | "account";

const CATEGORY_PREF: Record<
  NotificationCategory,
  | "notify_announcements"
  | "notify_discussions"
  | "notify_reports"
  | null
> = {
  announcement: "notify_announcements",
  discussion: "notify_discussions",
  report: "notify_reports",
  account: null,
};

const CATEGORY_LABEL: Record<NotificationCategory, string> = {
  announcement: "announcement",
  discussion: "discussion",
  report: "report",
  account: "account",
};

const PREF_COLUMNS = [
  "id",
  "email",
  "notify_announcements",
  "notify_discussions",
  "notify_reports",
  "notify_email",
  "notify_push",
].join(", ");

interface Recipient {
  id: string;
  email: string | null;
  notify_announcements: boolean | null;
  notify_discussions: boolean | null;
  notify_reports: boolean | null;
  notify_email: boolean | null;
  notify_push: boolean | null;
}

export const VALIDATOR_ROLES = [
  "Data Validator",
  "Tester",
  "Maintainer",
  "Head Maintainer",
];

export const MAINTAINER_ROLES = ["Maintainer", "Head Maintainer"];

export interface DispatchOptions {
  category: NotificationCategory;
  title: string;
  body?: string;
  href?: string;
  data?: Record<string, unknown>;
  /** Explicit recipients. Combined with `roles` using OR semantics. */
  recipientIds?: string[];
  /** Role-targeted recipients (users.user_type values). */
  roles?: string[];
  /** Update categories default to true; account notices default to false. */
  requireOptIn?: boolean;
  excludeUserIds?: string[];
  sendEmail?: boolean;
  email?: { subject: string; content: string };
}

function siteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");
  if (raw) return raw.replace(/\/$/, "");
  return process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://better-lucena-city.vercel.app";
}

function buildEmailContent(options: DispatchOptions): string {
  const url = `${siteUrl()}${options.href ?? ""}`;
  return [
    options.body ?? options.title,
    "",
    `View on Better Lucena City: ${url}`,
    "",
    `You are receiving this email because you opted in to ${CATEGORY_LABEL[options.category]} notifications.`,
    `Manage your preferences: ${siteUrl()}/user/settings`,
  ].join("\n");
}

async function resolveRecipients(
  supabase: SupabaseClient,
  options: DispatchOptions,
): Promise<Recipient[]> {
  const isAccount = options.category === "account";
  const pref = CATEGORY_PREF[options.category];
  const requireOptIn = options.requireOptIn ?? !isAccount;
  const recipientIds = options.recipientIds ?? [];
  const roles = options.roles ?? [];
  const map = new Map<string, Recipient>();

  async function load(
    filter:
      | { kind: "ids"; ids: string[] }
      | { kind: "roles"; roles: string[] }
      | { kind: "all" },
  ) {
    let query = supabase.from("users").select(PREF_COLUMNS);

    if (!isAccount) {
      query = query.eq("approved", true).eq("restricted", false);
    }
    if (requireOptIn && pref) {
      query = query.eq(pref, true);
    }

    if (filter.kind === "ids") {
      query = query.in("id", filter.ids);
    } else if (filter.kind === "roles") {
      query = query.in("user_type", filter.roles);
    }

    const { data } = await query;
    for (const row of (data ?? []) as unknown as Recipient[]) map.set(row.id, row);
  }

  if (recipientIds.length > 0) await load({ kind: "ids", ids: recipientIds });
  if (roles.length > 0) await load({ kind: "roles", roles });
  if (recipientIds.length === 0 && roles.length === 0) {
    await load({ kind: "all" });
  }

  const excluded = new Set(options.excludeUserIds ?? []);
  return [...map.values()].filter((row) => !excluded.has(row.id));
}

export async function dispatchNotification(
  supabase: SupabaseClient,
  options: DispatchOptions,
): Promise<void> {
  try {
    const db = createServiceClient() ?? supabase;
    const recipients = await resolveRecipients(db, options);
    if (recipients.length === 0) return;

    const rows = recipients.map((recipient) => ({
      user_id: recipient.id,
      type: options.category,
      title: options.title,
      body: options.body ?? null,
      href: options.href ?? null,
      data: options.data ?? {},
    }));

    const { error } = await db.from("notifications").insert(rows as never);
    if (error) {
      console.error("Failed to create notifications:", error.message);
      return;
    }

    const shouldEmail =
      options.sendEmail ?? options.category !== "account";
    if (shouldEmail) {
      const emailRecipients = recipients.filter(
        (recipient) => recipient.notify_email !== false && recipient.email,
      );
      await Promise.allSettled(
        emailRecipients.map((recipient) =>
          sendEmail({
            subject: options.email?.subject ?? options.title,
            email: recipient.email as string,
            content: options.email?.content ?? buildEmailContent(options),
          }),
        ),
      );
    }

    const pushRecipients = recipients
      .filter((recipient) => recipient.notify_push === true)
      .map((recipient) => recipient.id);
    if (pushRecipients.length > 0) {
      await sendPushToUsers(db, pushRecipients, {
        title: options.title,
        body: options.body ?? "",
        url: options.href ?? "/",
        tag: options.category,
      });
    }
  } catch (error) {
    console.error("Notification dispatch failed:", error);
  }
}

/** Transactional in-app + push notice for a single user (no duplicate e-mail). */
export async function notifyAccount(
  supabase: SupabaseClient,
  userId: string,
  notice: { title: string; body?: string; href?: string },
): Promise<void> {
  await dispatchNotification(supabase, {
    category: "account",
    recipientIds: [userId],
    requireOptIn: false,
    sendEmail: false,
    ...notice,
  });
}

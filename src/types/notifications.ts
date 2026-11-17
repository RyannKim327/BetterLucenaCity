export type NotificationType =
  | "announcement"
  | "discussion"
  | "report"
  | "account";

export interface AppNotification {
  id: string;
  user_id: string;
  type: NotificationType | string;
  title: string;
  body: string | null;
  href: string | null;
  data: Record<string, unknown> | null;
  read: boolean;
  date_added: string;
}

export interface NotificationPreferences {
  notify_announcements: boolean;
  notify_discussions: boolean;
  notify_reports: boolean;
  notify_email: boolean;
  notify_push: boolean;
}

export interface PushSubscriptionPayload {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

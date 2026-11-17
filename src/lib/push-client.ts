export type PushPermission = NotificationPermission | "unsupported";

export type PushResult = { ok: true } | { ok: false; error: string };

export function isPushSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

export function getPushPermission(): PushPermission {
  if (!isPushSupported()) return "unsupported";
  return Notification.permission;
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const output = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i += 1) {
    output[i] = rawData.charCodeAt(i);
  }
  return output;
}

async function getRegistration(): Promise<ServiceWorkerRegistration | null> {
  if (!isPushSupported()) return null;
  if (process.env.NODE_ENV === "development") return null;

  const ready = navigator.serviceWorker.ready;
  const timeout = new Promise<null>((resolve) =>
    setTimeout(() => resolve(null), 10000),
  );
  return Promise.race([ready, timeout]);
}

async function getPublicKey(): Promise<string | null> {
  const res = await fetch("/api/notifications/push/public-key");
  if (!res.ok) return null;
  const data = (await res.json().catch(() => null)) as { publicKey?: string } | null;
  return data?.publicKey ?? null;
}

export async function getExistingSubscription(): Promise<PushSubscription | null> {
  const registration = await getRegistration();
  if (!registration) return null;
  return registration.pushManager.getSubscription();
}

export async function enablePush(): Promise<PushResult> {
  if (!isPushSupported()) {
    return { ok: false, error: "This browser does not support push notifications." };
  }
  if (process.env.NODE_ENV === "development") {
    return { ok: false, error: "Push notifications require a production build." };
  }

  const publicKey = await getPublicKey();
  if (!publicKey) {
    return { ok: false, error: "Push notifications are not configured on this server." };
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    return { ok: false, error: "Notification permission was not granted." };
  }

  const registration = await getRegistration();
  if (!registration) {
    return { ok: false, error: "Service worker is not ready. Try reloading the page." };
  }

  const existing = await registration.pushManager.getSubscription();
  const subscription =
    existing ??
    (await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey) as BufferSource,
    }));

  const payload = subscription.toJSON() as {
    endpoint?: string;
    keys?: { p256dh?: string; auth?: string };
  };

  const res = await fetch("/api/notifications/push", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      endpoint: payload.endpoint,
      keys: payload.keys,
    }),
  });

  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    return { ok: false, error: data.error ?? "Failed to save push subscription." };
  }

  return { ok: true };
}

export async function disablePush(): Promise<PushResult> {
  const subscription = await getExistingSubscription();
  if (!subscription) return { ok: true };

  const endpoint = subscription.endpoint;

  try {
    await subscription.unsubscribe();
  } catch {
    // Best effort — still remove the server-side row below.
  }

  const res = await fetch("/api/notifications/push", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ endpoint }),
  });

  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    return { ok: false, error: data.error ?? "Failed to remove push subscription." };
  }

  return { ok: true };
}

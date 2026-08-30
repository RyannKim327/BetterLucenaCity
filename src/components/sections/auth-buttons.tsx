"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";
import type { AuthButtonsProps } from "@/types/ui";

type Provider = "google" | "github";

const PROVIDERS: { id: Provider; label: string }[] = [
  { id: "google", label: "Continue with Google" },
  { id: "github", label: "Continue with GitHub" },
];

const ICONS: Record<Provider, string> = {
  google:
    "M21.35 11.1h-9.18v2.97h5.27c-.23 1.4-1.62 4.1-5.27 4.1a5.92 5.92 0 0 1 0-11.84c1.66 0 2.78.71 3.42 1.32l2.33-2.25C17.4 3.4 15.6 2.5 13.17 2.5a8.42 8.42 0 1 0 8.18 10.6z",
  github:
    "M12 1.5A10.5 10.5 0 0 0 8.68 22c.53.1.72-.23.72-.5v-1.8c-2.92.63-3.54-1.4-3.54-1.4-.48-1.22-1.17-1.55-1.17-1.55-.95-.65.08-.64.08-.64 1.06.08 1.61 1.09 1.61 1.09.94 1.6 2.46 1.14 3.06.87.1-.68.37-1.14.67-1.4-2.33-.27-4.78-1.17-4.78-5.18 0-1.15.41-2.08 1.08-2.82-.11-.27-.47-1.34.1-2.79 0 0 .88-.28 2.88 1.07a9.9 9.9 0 0 1 5.24 0c2-1.35 2.88-1.07 2.88-1.07.57 1.45.21 2.52.1 2.79.68.74 1.08 1.67 1.08 2.82 0 4.02-2.45 4.9-4.79 5.16.38.33.71.97.71 1.96v2.9c0 .28.19.61.73.5A10.5 10.5 0 0 0 12 1.5z",
};

export function AuthButtons({ redirectTo, message }: AuthButtonsProps) {
  const [loading, setLoading] = useState<Provider | null>(null);
  const [error, setError] = useState<string>("");

  async function signIn(provider: Provider) {
    setLoading(provider);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(null);
    }
  }

  return (
    <div className="space-y-3">
      {message && (
        <p className="text-sm leading-relaxed text-on-surface-variant">{message}</p>
      )}
      {PROVIDERS.map((provider) => (
        <button
          key={provider.id}
          type="button"
          onClick={() => signIn(provider.id)}
          disabled={loading !== null}
          className="inline-flex h-12 w-full items-center justify-center gap-3 rounded-full border border-outline bg-surface-container-low px-6 text-sm font-medium text-on-surface transition-colors hover:bg-surface-container disabled:opacity-70"
        >
          {loading === provider.id ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <path fill="currentColor" d={ICONS[provider.id]} />
            </svg>
          )}
          {provider.label}
        </button>
      ))}
      {error && (
        <p className="rounded-xl bg-secondary-container/40 px-4 py-3 text-sm text-on-secondary-container">
          {error}
        </p>
      )}
    </div>
  );
}

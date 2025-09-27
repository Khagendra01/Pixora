"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AUTH_STORAGE_KEY, type StoredAuthPayload } from "@/lib/authStorage";
import { SubmitButton } from "../shared/SubmitButton";
import { type LoginState, loginAction } from "./actions";

const initialState: LoginState = {
  status: "idle",
};

export function LoginForm() {
  const router = useRouter();
  const [state, formAction] = useActionState(loginAction, initialState);

  useEffect(() => {
    if (state.status !== "success" || !state.user) {
      return;
    }

    const payload: StoredAuthPayload = {
      loggedIn: true,
      user: state.user,
    };

    try {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload));
      router.push("/");
    } catch (error) {
      console.error("Failed to persist session", error);
    }
  }, [router, state]);

  return (
    <form action={formAction} className="space-y-6">
      <div className="space-y-4">
        <label className="block text-left text-sm text-white/70">
          Email
          <input
            name="email"
            type="email"
            placeholder="you@pixora.com"
            className="mt-2 w-full rounded-2xl border border-white/15 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-white/40 focus:bg-black/30"
            required
          />
        </label>
        <label className="block text-left text-sm text-white/70">
          Password
          <input
            name="password"
            type="password"
            placeholder="********"
            className="mt-2 w-full rounded-2xl border border-white/15 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-white/40 focus:bg-black/30"
            required
          />
        </label>
      </div>
      {state.status === "error" ? (
        <p className="rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {state.message}
        </p>
      ) : null}
      {state.status === "success" ? (
        <p className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          {state.message}
        </p>
      ) : null}
      <SubmitButton>Sign in</SubmitButton>
    </form>
  );
}

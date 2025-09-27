"use client";

import { useActionState } from "react";
import { SubmitButton } from "../shared/SubmitButton";
import { type RegisterState, registerAction } from "./actions";

const initialState: RegisterState = {
  status: "idle",
};

export function RegisterForm() {
  const [state, formAction] = useActionState(registerAction, initialState);

  return (
    <form action={formAction} className="space-y-6">
      <div className="space-y-4">
        <label className="block text-left text-sm text-white/70">
          Full name
          <input
            name="fullName"
            type="text"
            placeholder="Jamie Appleseed"
            className="mt-2 w-full rounded-2xl border border-white/15 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-white/40 focus:bg-black/30"
            required
          />
        </label>
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
            placeholder="Create a password"
            minLength={8}
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
      <SubmitButton>Create account</SubmitButton>
    </form>
  );
}

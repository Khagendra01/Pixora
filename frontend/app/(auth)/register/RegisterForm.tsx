"use client";

import { useActionState } from "react";
import type {
  RegisterFormContent,
  SubmitButtonContent,
} from "@/lib/appContent";

import { SubmitButton } from "../shared/SubmitButton";
import { type RegisterState, registerAction } from "./actions";

const initialState: RegisterState = {
  status: "idle",
};

export function RegisterForm({
  content,
  submitButton,
}: {
  content: RegisterFormContent;
  submitButton: SubmitButtonContent;
}) {
  const [state, formAction] = useActionState(registerAction, initialState);

  return (
    <form action={formAction} className="space-y-6">
      <div className="space-y-4">
        <label className="block text-left text-sm text-white/70">
          {content.fullNameLabel}
          <input
            name="fullName"
            type="text"
            placeholder={content.fullNamePlaceholder}
            className="mt-2 w-full rounded-2xl border border-white/15 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-white/40 focus:bg-black/30"
            required
          />
        </label>
        <label className="block text-left text-sm text-white/70">
          {content.emailLabel}
          <input
            name="email"
            type="email"
            placeholder={content.emailPlaceholder}
            className="mt-2 w-full rounded-2xl border border-white/15 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-white/40 focus:bg-black/30"
            required
          />
        </label>
        <label className="block text-left text-sm text-white/70">
          {content.passwordLabel}
          <input
            name="password"
            type="password"
            placeholder={content.passwordPlaceholder}
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
      <SubmitButton
        pendingLabel={submitButton.pendingLabel}
        pendingIndicator={submitButton.pendingIndicator}
        idleIndicator={submitButton.idleIndicator}
      >
        {content.submitLabel}
      </SubmitButton>
    </form>
  );
}

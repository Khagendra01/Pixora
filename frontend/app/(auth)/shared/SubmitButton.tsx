"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";

export function SubmitButton({ children }: { children: ReactNode }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-semibold tracking-tight text-black transition hover:scale-[1.01] hover:bg-white/90 focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
    >
      <span>{pending ? "Please wait..." : children}</span>
      <span aria-hidden className="text-lg leading-none">
        {pending ? ".." : ">"}
      </span>
    </button>
  );
}

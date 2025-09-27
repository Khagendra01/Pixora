import Link from "next/link";
import type { ReactNode } from "react";

export function AuthCard({
  children,
  title,
  subtitle,
  accent,
}: {
  children: ReactNode;
  title: string;
  subtitle?: string;
  accent?: {
    prompt: string;
    href: string;
    linkLabel: string;
  };
}) {
  return (
    <section className="w-full max-w-[420px] rounded-[30px] border border-white/10 bg-white/5 px-10 pb-10 pt-12 shadow-[0_30px_60px_-40px_rgba(0,0,0,0.6)] backdrop-blur-[40px]">
      <div className="space-y-3 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-[34px]">
          {title}
        </h1>
        {subtitle ? <p className="text-sm text-white/60">{subtitle}</p> : null}
      </div>
      <div className="mt-10 space-y-6">{children}</div>
      {accent ? (
        <p className="mt-10 text-center text-xs text-white/60">
          {accent.prompt}{" "}
          <Link
            href={accent.href}
            className="font-medium text-white transition hover:text-white/80"
          >
            {accent.linkLabel}
          </Link>
        </p>
      ) : null}
    </section>
  );
}

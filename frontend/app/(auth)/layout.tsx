import Link from "next/link";
import type { ReactNode } from "react";

import { readAppContent } from "@/lib/appContentStore";

export default async function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  const {
    auth: { layout },
  } = await readAppContent();

  return (
    <div className="relative min-h-screen bg-[#0d0d0f] text-white">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.08),_transparent_60%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/10 via-white/5 to-transparent" />
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 pt-12 text-sm text-white/70">
        <Link href="/" className="font-semibold tracking-tight text-white">
          {layout.brand}
        </Link>
        <nav className="flex items-center gap-6">
          {layout.navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto flex min-h-[70vh] w-full max-w-5xl flex-col items-center px-6 pb-20 pt-12">
        {children}
      </main>
      <footer className="mx-auto w-full max-w-5xl px-6 pb-12 text-xs text-white/40">
        {layout.footer}
      </footer>
    </div>
  );
}

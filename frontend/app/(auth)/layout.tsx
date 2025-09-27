import Link from "next/link";
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-[#0d0d0f] text-white">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.08),_transparent_60%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/10 via-white/5 to-transparent" />
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 pt-12 text-sm text-white/70">
        <Link href="/" className="font-semibold tracking-tight text-white">
          Pixora
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/login" className="transition hover:text-white">
            Login
          </Link>
          <Link href="/register" className="transition hover:text-white">
            Register
          </Link>
        </nav>
      </header>
      <main className="mx-auto flex min-h-[70vh] w-full max-w-5xl flex-col items-center px-6 pb-20 pt-12">
        {children}
      </main>
      <footer className="mx-auto w-full max-w-5xl px-6 pb-12 text-xs text-white/40">
        Inspired by the elegance of Apple - crafted for Pixora.
      </footer>
    </div>
  );
}

import Link from "next/link";
import { AuthCard } from "../components/AuthCard";
import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <AuthCard
      title="Sign in with Pixora"
      subtitle="Your creative hub, reimagined with Apple-inspired clarity."
      accent={{
        prompt: "New to Pixora?",
        href: "/register",
        linkLabel: "Create an account",
      }}
    >
      <LoginForm />
      <div className="text-center text-xs text-white/40">
        <Link href="/" className="transition hover:text-white/70">
          Learn more about Pixora &gt;
        </Link>
      </div>
    </AuthCard>
  );
}

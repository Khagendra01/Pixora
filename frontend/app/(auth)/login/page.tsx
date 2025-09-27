import Link from "next/link";

import { readAppContent } from "@/lib/appContentStore";

import { AuthCard } from "../components/AuthCard";
import { LoginForm } from "./LoginForm";

export default async function LoginPage() {
  const {
    auth: { login, forms },
  } = await readAppContent();

  return (
    <AuthCard
      title={login.title}
      subtitle={login.subtitle}
      accent={login.accent}
    >
      <LoginForm content={forms.login} submitButton={forms.submitButton} />
      {login.learnMore ? (
        <div className="text-center text-xs text-white/40">
          <Link
            href={login.learnMore.href}
            className="transition hover:text-white/70"
          >
            {login.learnMore.label}
          </Link>
        </div>
      ) : null}
    </AuthCard>
  );
}

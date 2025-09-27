import { AuthCard } from "../components/AuthCard";
import { RegisterForm } from "./RegisterForm";

export default function RegisterPage() {
  return (
    <AuthCard
      title="Create your Pixora ID"
      subtitle="A seamless sign-up wrapped in Apple-inspired polish."
      accent={{
        prompt: "Already joined?",
        href: "/login",
        linkLabel: "Sign in",
      }}
    >
      <RegisterForm />
    </AuthCard>
  );
}

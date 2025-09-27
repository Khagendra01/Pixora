import { readAppContent } from "@/lib/appContentStore";

import { AuthCard } from "../components/AuthCard";
import { RegisterForm } from "./RegisterForm";

export default async function RegisterPage() {
  const {
    auth: { register, forms },
  } = await readAppContent();

  return (
    <AuthCard
      title={register.title}
      subtitle={register.subtitle}
      accent={register.accent}
    >
      <RegisterForm
        content={forms.register}
        submitButton={forms.submitButton}
      />
    </AuthCard>
  );
}

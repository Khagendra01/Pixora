"use server";

import { createUser, findUserByEmail } from "@/lib/userStore";

export type RegisterState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function registerAction(
  _prevState: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const fullName = formData.get("fullName");
  const email = formData.get("email");
  const password = formData.get("password");

  if (
    typeof fullName !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    return {
      status: "error",
      message: "All fields are required.",
    };
  }

  const sanitizedFullName = fullName.trim();
  const sanitizedEmail = email.trim().toLowerCase();
  const sanitizedPassword = password.trim();

  if (!sanitizedFullName || !sanitizedEmail || !sanitizedPassword) {
    return {
      status: "error",
      message: "Fill in every field to get started.",
    };
  }

  if (!sanitizedEmail.includes("@")) {
    return {
      status: "error",
      message: "Enter a valid email address.",
    };
  }

  const userExists = await findUserByEmail(sanitizedEmail);

  if (userExists) {
    return {
      status: "error",
      message: "An account already exists with this email.",
    };
  }

  await createUser({
    fullName: sanitizedFullName,
    email: sanitizedEmail,
    password: sanitizedPassword,
  });

  return {
    status: "success",
    message: "Account created. You can sign in now.",
  };
}

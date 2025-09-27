"use server";

import { findUserByEmail } from "@/lib/userStore";

export type LoginState = {
  status: "idle" | "success" | "error";
  message?: string;
  user?: {
    id: string;
    fullName: string;
    email: string;
  };
};

export async function loginAction(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string") {
    return {
      status: "error",
      message: "Email and password are required.",
    };
  }

  const sanitizedEmail = email.trim().toLowerCase();
  const sanitizedPassword = password.trim();

  if (!sanitizedEmail || !sanitizedPassword) {
    return {
      status: "error",
      message: "Enter both email and password to continue.",
    };
  }

  const existingUser = await findUserByEmail(sanitizedEmail);

  if (!existingUser || existingUser.password !== sanitizedPassword) {
    return {
      status: "error",
      message: "We couldn't find a match for those credentials.",
    };
  }

  return {
    status: "success",
    message: `Welcome back, ${existingUser.fullName.split(" ")[0]}!`,
    user: {
      id: existingUser.id,
      fullName: existingUser.fullName,
      email: existingUser.email,
    },
  };
}

"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE, ADMIN_SESSION_VALUE } from "@/lib/admin-session";

export type LoginState = {
  error: string;
};

export async function loginAction(_: LoginState, formData: FormData): Promise<LoginState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) {
    return {
      error: "بيانات دخول الأدمن غير مضافة داخل ملف البيئة.",
    };
  }

  if (username !== process.env.ADMIN_USERNAME || password !== process.env.ADMIN_PASSWORD) {
    return {
      error: "اسم المستخدم أو كلمة المرور غلط",
    };
  }

  const cookieStore = await cookies();

  cookieStore.set(ADMIN_SESSION_COOKIE, ADMIN_SESSION_VALUE, {
    httpOnly: true,
    maxAge: 60 * 60 * 12,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  redirect("/admin");
}

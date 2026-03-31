"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { loginAction, type LoginState } from "@/app/admin/login/actions";

const initialState: LoginState = {
  error: "",
};

function LoginSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-medium tracking-wide text-background transition-all duration-300 hover:bg-primary-light hover:shadow-lg hover:shadow-primary/20 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending && (
        <svg viewBox="0 0 24 24" className="h-4 w-4 animate-spin" aria-hidden="true">
          <circle
            cx="12"
            cy="12"
            r="9"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className="opacity-30"
          />
          <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )}
      <span>{pending ? "جاري التحقق..." : "دخول"}</span>
    </button>
  );
}

export default function AdminLoginForm() {
  const [state, formAction] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div className="text-right">
        <label htmlFor="username" className="mb-2 block text-sm font-medium text-foreground">
          اسم المستخدم
        </label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          className="w-full rounded-2xl border border-border bg-surface-light px-5 py-3.5 text-sm text-foreground placeholder:text-muted/50 outline-none transition-all duration-300 focus:border-primary/40 focus:ring-1 focus:ring-primary/20"
          placeholder="اكتب اسم المستخدم"
          required
        />
      </div>

      <div className="text-right">
        <label htmlFor="password" className="mb-2 block text-sm font-medium text-foreground">
          كلمة المرور
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          className="w-full rounded-2xl border border-border bg-surface-light px-5 py-3.5 text-sm text-foreground placeholder:text-muted/50 outline-none transition-all duration-300 focus:border-primary/40 focus:ring-1 focus:ring-primary/20"
          placeholder="اكتب كلمة المرور"
          required
        />
      </div>

      {state.error && (
        <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-right text-sm text-red-200">
          {state.error}
        </p>
      )}

      <LoginSubmitButton />
    </form>
  );
}

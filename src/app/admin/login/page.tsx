import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminLoginForm from "@/app/admin/login/AdminLoginForm";
import { ADMIN_SESSION_COOKIE, hasValidAdminSession } from "@/lib/admin-session";

export default async function AdminLoginPage() {
  const cookieStore = await cookies();
  const hasSession = hasValidAdminSession(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);

  if (hasSession) {
    redirect("/admin");
  }

  return (
    <main dir="rtl" className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.1),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0))]" />

      <section className="relative z-10 w-full max-w-md overflow-hidden rounded-[2rem] border border-white/8 bg-surface/90 p-7 shadow-[0_30px_90px_rgba(0,0,0,0.42)] sm:p-9">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-2xl font-black text-background">
            A
          </div>
          <h1
            className="text-3xl font-black text-foreground"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Autocar Admin
          </h1>
          <p className="mt-3 text-sm leading-7 text-foreground/55">
            سجل الدخول للوصول إلى لوحة إدارة السيارات وربط المخزون مع Supabase.
          </p>
        </div>

        <AdminLoginForm />
      </section>
    </main>
  );
}

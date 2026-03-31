/*
  لوحة إدارة السيارات تعتمد على جدول `cars` وباكت `car-images` كما هو موضح في
  `src/lib/supabase.ts`.
*/

import AdminDashboard from "@/app/admin/AdminDashboard";
import { fetchAdminDashboardSnapshot } from "@/lib/cars-service";
import { hasSupabaseEnv } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function AdminCarsPage() {
  const snapshot = await fetchAdminDashboardSnapshot();

  return (
    <main dir="rtl" className="min-h-screen bg-background px-6 pb-16 pt-28">
      <div className="mx-auto max-w-7xl">
        <AdminDashboard
          initialCars={snapshot.cars}
          initialStats={snapshot.stats}
          initialError={snapshot.errorMessage}
          supabaseConfigured={hasSupabaseEnv()}
        />
      </div>
    </main>
  );
}

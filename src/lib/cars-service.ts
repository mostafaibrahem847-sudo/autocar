import {
  CAR_IMAGES_BUCKET,
  createSupabaseServerClient,
  hasSupabaseEnv,
  type CarRecord,
} from "@/lib/supabase";
import { getAllCars } from "@/data/cars";

export type DashboardStats = {
  totalCars: number;
  totalImages: number;
  pendingCars: number;
};

export type DashboardSnapshot = {
  cars: CarRecord[];
  stats: DashboardStats;
  errorMessage: string | null;
};

const EMPTY_STATS: DashboardStats = {
  totalCars: 0,
  totalImages: 0,
  pendingCars: 0,
};

const LOCAL_CARS_LIMIT = 20;

function getLocalCars(): CarRecord[] {
  return getAllCars()
    .slice(0, LOCAL_CARS_LIMIT)
    .map((car, index) => ({
      id: car.slug,
      name: car.model,
      brand: car.brand,
      year: car.year,
      price: car.priceLabel,
      description: car.description,
      images: car.images,
      status: index < 3 ? "pending" : "active",
      created_at: new Date(Date.now() - index * 60_000).toISOString(),
    }));
}

function getLocalStats(cars: CarRecord[]): DashboardStats {
  return {
    totalCars: cars.length,
    totalImages: cars.reduce((sum, car) => sum + car.images.length, 0),
    pendingCars: cars.filter((car) => car.status === "pending").length,
  };
}

function buildCarsOrderQuery() {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  return supabase.from("cars").select("*").order("created_at", { ascending: false });
}

async function fetchCarsInternal(status?: string) {
  const query = buildCarsOrderQuery();

  if (!query) {
    return { cars: [] as CarRecord[], errorMessage: "إعدادات Supabase غير مكتملة." };
  }

  const scopedQuery = status ? query.eq("status", status) : query;
  const { data, error } = await scopedQuery;

  if (error) {
    return { cars: [] as CarRecord[], errorMessage: "تعذر تحميل السيارات من قاعدة البيانات." };
  }

  return { cars: data ?? [], errorMessage: null };
}

async function fetchImageCountInternal() {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return { totalImages: 0, errorMessage: "إعدادات Supabase غير مكتملة." };
  }

  const { data, error } = await supabase.storage
    .from(CAR_IMAGES_BUCKET)
    .list("", { limit: 1000, offset: 0, sortBy: { column: "created_at", order: "desc" } });

  if (error) {
    return { totalImages: 0, errorMessage: "تعذر تحميل عدد الصور من Supabase Storage." };
  }

  return {
    totalImages: (data ?? []).filter((item) => item.name && !item.name.endsWith("/")).length,
    errorMessage: null,
  };
}

export async function fetchAdminDashboardSnapshot(): Promise<DashboardSnapshot> {
  if (!hasSupabaseEnv()) {
    const localCars = getLocalCars();

    return {
      cars: localCars,
      stats: getLocalStats(localCars),
      errorMessage: null,
    };
  }

  const [{ cars, errorMessage: carsError }, { totalImages, errorMessage: imagesError }] =
    await Promise.all([fetchCarsInternal(), fetchImageCountInternal()]);

  return {
    cars,
    stats: {
      totalCars: cars.length,
      totalImages,
      pendingCars: cars.filter((car) => car.status === "pending").length,
    },
    errorMessage: carsError ?? imagesError,
  };
}

export async function fetchPublicCars() {
  if (!hasSupabaseEnv()) {
    return getLocalCars();
  }

  const { cars } = await fetchCarsInternal("active");
  return cars;
}

export function getBrandOptions(cars: CarRecord[]) {
  return [...new Set(cars.map((car) => car.brand).filter(Boolean))].sort((left, right) =>
    left.localeCompare(right)
  );
}



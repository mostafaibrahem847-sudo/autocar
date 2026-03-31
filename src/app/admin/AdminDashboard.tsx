"use client";

/*
  This dashboard expects the `cars` table and the public `car-images` bucket
  configured exactly as documented in `src/lib/supabase.ts`.
*/

import { useEffect, useEffectEvent, useMemo, useRef, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { Plus } from "lucide-react";
import { logoutAction } from "@/app/admin/actions";
import AddCarModal from "@/components/admin/AddCarModal";
import { getStoragePathFromPublicUrl, sanitizeFileName } from "@/lib/car-storage";
import {
  CAR_IMAGES_BUCKET,
  getSupabaseBrowserClient,
  type CarRecord,
  type Database,
} from "@/lib/supabase";

type BrowserClient = SupabaseClient<Database>;

type DashboardStats = {
  totalCars: number;
  totalImages: number;
  pendingCars: number;
};

type DashboardMessage = {
  type: "success" | "error";
  text: string;
} | null;

type UploadPreview = {
  id: string;
  file: File;
  previewUrl: string;
};

type FormValues = {
  name: string;
  brand: string;
  year: string;
  price: string;
  description: string;
};

type EditValues = FormValues & {
  status: string;
};

type AdminDashboardProps = {
  initialCars: CarRecord[];
  initialStats: DashboardStats;
  initialError: string | null;
  supabaseConfigured: boolean;
};

const initialFormValues: FormValues = {
  name: "",
  brand: "",
  year: "",
  price: "",
  description: "",
};

function SpinnerIcon() {
  return (
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
  );
}

function LogoutButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-5 py-2.5 text-sm font-medium text-primary transition-all duration-300 hover:bg-primary hover:text-background disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending && <SpinnerIcon />}
      <span>{pending ? "جاري الخروج..." : "تسجيل الخروج"}</span>
    </button>
  );
}

function StatusBanner({ message }: { message: DashboardMessage }) {
  if (!message) {
    return null;
  }

  return (
    <div
      className={`rounded-2xl border px-4 py-3 text-sm ${
        message.type === "success"
          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-200"
          : "border-red-500/20 bg-red-500/10 text-red-200"
      }`}
    >
      {message.text}
    </div>
  );
}

function SuccessToast({ text }: { text: string | null }) {
  if (!text) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed left-1/2 top-6 z-[100] w-full max-w-sm -translate-x-1/2 px-4">
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-center text-sm text-emerald-200 shadow-[0_18px_45px_rgba(0,0,0,0.22)] backdrop-blur-md">
        {text}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-[1.4rem] border border-white/8 bg-white/[0.02] px-4 py-4 text-right shadow-[0_18px_45px_rgba(0,0,0,0.18)]">
      <p className="text-2xl font-black text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
        {value}
      </p>
      <p className="mt-2 text-[0.72rem] tracking-[0.2em] text-foreground/45">{label}</p>
    </div>
  );
}

async function fetchCars(client: BrowserClient) {
  const { data, error } = await client.from("cars").select("*").order("created_at", { ascending: false });

  if (error) {
    throw new Error("تعذر تحميل السيارات من قاعدة البيانات.");
  }

  return data ?? [];
}

async function fetchImageCount(client: BrowserClient) {
  const { data, error } = await client.storage
    .from(CAR_IMAGES_BUCKET)
    .list("", { limit: 1000, offset: 0, sortBy: { column: "created_at", order: "desc" } });

  if (error) {
    throw new Error("تعذر تحميل عدد الصور من Supabase Storage.");
  }

  return (data ?? []).filter((item) => item.name && !item.name.endsWith("/")).length;
}

function mapCarToEditValues(car: CarRecord): EditValues {
  return {
    name: car.name,
    brand: car.brand,
    year: car.year.toString(),
    price: car.price,
    description: car.description,
    status: car.status,
  };
}

function getImageSource(car: CarRecord) {
  return car.images[0] ?? "";
}

function isBlobUrl(value: string) {
  return value.startsWith("blob:");
}

export default function AdminDashboard({
  initialCars,
  initialStats,
  initialError,
  supabaseConfigured,
}: AdminDashboardProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewRefs = useRef<UploadPreview[]>([]);
  const [cars, setCars] = useState(initialCars);
  const [totalImages, setTotalImages] = useState(initialStats.totalImages);
  const [message, setMessage] = useState<DashboardMessage>(
    initialError ? { type: "error", text: initialError } : null
  );
  const [formValues, setFormValues] = useState<FormValues>(initialFormValues);
  const [selectedImages, setSelectedImages] = useState<UploadPreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<EditValues | null>(null);

  useEffect(() => {
    previewRefs.current = selectedImages;
  }, [selectedImages]);

  useEffect(() => {
    return () => {
      previewRefs.current.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    };
  }, []);

  useEffect(() => {
    if (!successToast) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setSuccessToast(null);
    }, 3200);

    return () => window.clearTimeout(timeoutId);
  }, [successToast]);

  const stats = useMemo(
    () => ({
      totalCars: cars.length,
      totalImages,
      pendingCars: cars.filter((car) => car.status === "pending").length,
    }),
    [cars, totalImages]
  );

  const updateFormValue = (field: keyof FormValues, value: string) => {
    setFormValues((current) => ({ ...current, [field]: value }));
  };

  const updateEditValue = (field: keyof EditValues, value: string) => {
    setEditValues((current) => (current ? { ...current, [field]: value } : current));
  };

  const openCreateModal = () => {
    setMessage(null);
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    if (isSubmitting) {
      return;
    }

    setIsDragging(false);
    setIsCreateModalOpen(false);
  };

  const resetSelectedImages = useEffectEvent(() => {
    previewRefs.current.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    previewRefs.current = [];
    setSelectedImages([]);
  });

  const refreshDashboard = useEffectEvent(async (showLoader = true) => {
    const client = getSupabaseBrowserClient();

    if (!client) {
      return;
    }

    if (showLoader) {
      setIsRefreshing(true);
    }

    try {
      const [nextCars, nextImageCount] = await Promise.all([fetchCars(client), fetchImageCount(client)]);
      setCars(nextCars);
      setTotalImages(nextImageCount);
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "حدث خطأ غير متوقع أثناء تحديث البيانات.",
      });
    } finally {
      if (showLoader) {
        setIsRefreshing(false);
      }
    }
  });

  useEffect(() => {
    if (!supabaseConfigured) {
      return;
    }

    const client = getSupabaseBrowserClient();

    if (!client) {
      return;
    }

    void refreshDashboard(false);

    const channel = client
      .channel("autocar-admin-cars")
      .on("postgres_changes", { event: "*", schema: "public", table: "cars" }, () => {
        void refreshDashboard(false);
      })
      .subscribe();

    return () => {
      void client.removeChannel(channel);
    };
  }, [refreshDashboard, supabaseConfigured]);

  const attachFiles = (fileList: FileList | null) => {
    if (!fileList?.length) {
      return;
    }

    const imageFiles = Array.from(fileList).filter((file) => file.type.startsWith("image/"));

    if (!imageFiles.length) {
      setMessage({ type: "error", text: "اختر صورًا صالحة فقط لرفعها إلى السيارة." });
      return;
    }

    setMessage(null);

    setSelectedImages((current) => [
      ...current,
      ...imageFiles.map((file) => ({
        id: crypto.randomUUID(),
        file,
        previewUrl: URL.createObjectURL(file),
      })),
    ]);
  };

  const removePreview = (id: string) => {
    setSelectedImages((current) => {
      const preview = current.find((item) => item.id === id);

      if (preview) {
        URL.revokeObjectURL(preview.previewUrl);
      }

      return current.filter((item) => item.id !== id);
    });
  };

  const commitLocalCars = (nextCars: CarRecord[]) => {
    setCars(nextCars);
    setTotalImages(nextCars.reduce((sum, car) => sum + car.images.length, 0));
  };

  const handleCreateCar = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formValues.name || !formValues.brand || !formValues.year || !formValues.price || !formValues.description) {
      setMessage({ type: "error", text: "يرجى تعبئة جميع الحقول قبل حفظ السيارة." });
      return;
    }

    if (!selectedImages.length) {
      setMessage({ type: "error", text: "يرجى رفع صورة واحدة على الأقل للسيارة." });
      return;
    }

    const parsedYear = Number(formValues.year);

    if (!Number.isInteger(parsedYear)) {
      setMessage({ type: "error", text: "سنة الصنع يجب أن تكون رقمًا صحيحًا." });
      return;
    }

    if (!supabaseConfigured) {
      setIsSubmitting(true);
      setMessage(null);

      const localCar: CarRecord = {
        id: `local-created-${crypto.randomUUID()}`,
        name: formValues.name.trim(),
        brand: formValues.brand.trim(),
        year: parsedYear,
        price: formValues.price.trim(),
        description: formValues.description.trim(),
        images: selectedImages.map((image) => image.previewUrl),
        status: "active",
        created_at: new Date().toISOString(),
      };

      commitLocalCars([localCar, ...cars]);
      setFormValues(initialFormValues);
      resetSelectedImages();
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setMessage({ type: "success", text: "تم إضافة السيارة بنجاح ✓" });
      setSuccessToast("تم إضافة السيارة بنجاح ✓");
      setIsCreateModalOpen(false);
      setIsDragging(false);
      setIsSubmitting(false);
      return;
    }

    const client = getSupabaseBrowserClient();

    if (!client) {
      setMessage({ type: "error", text: "تعذر إنشاء اتصال Supabase من المتصفح." });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    const uploadedPaths: string[] = [];

    try {
      const publicUrls: string[] = [];

      for (const image of selectedImages) {
        const filePath = `${Date.now()}-${crypto.randomUUID()}-${sanitizeFileName(image.file.name)}`;
        const { error: uploadError } = await client.storage.from(CAR_IMAGES_BUCKET).upload(filePath, image.file, {
          cacheControl: "3600",
          contentType: image.file.type,
          upsert: false,
        });

        if (uploadError) {
          throw new Error("تعذر رفع إحدى الصور إلى التخزين.");
        }

        uploadedPaths.push(filePath);
        const { data } = client.storage.from(CAR_IMAGES_BUCKET).getPublicUrl(filePath);
        publicUrls.push(data.publicUrl);
      }

      const { error: insertError } = await client.from("cars").insert({
        name: formValues.name.trim(),
        brand: formValues.brand.trim(),
        year: parsedYear,
        price: formValues.price.trim(),
        description: formValues.description.trim(),
        images: publicUrls,
        status: "active",
      });

      if (insertError) {
        if (uploadedPaths.length) {
          await client.storage.from(CAR_IMAGES_BUCKET).remove(uploadedPaths);
        }

        throw new Error("تعذر حفظ السيارة داخل قاعدة البيانات.");
      }

      setFormValues(initialFormValues);
      resetSelectedImages();
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setMessage({ type: "success", text: "تم إضافة السيارة بنجاح ✓" });
      await refreshDashboard(false);
      setSuccessToast("تم إضافة السيارة بنجاح ✓");
      setIsCreateModalOpen(false);
      setIsDragging(false);
      router.refresh();
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "حدث خطأ أثناء إضافة السيارة.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCar = async (car: CarRecord) => {
    if (!supabaseConfigured) {
      setDeletingId(car.id);
      setMessage(null);

      const nextCars = cars.filter((item) => item.id !== car.id);
      commitLocalCars(nextCars);

      if (editingId === car.id) {
        setEditingId(null);
        setEditValues(null);
      }

      setMessage({ type: "success", text: "تم حذف السيارة بنجاح." });
      setDeletingId(null);
      return;
    }

    const client = getSupabaseBrowserClient();

    if (!client) {
      setMessage({ type: "error", text: "تعذر إنشاء اتصال Supabase من المتصفح." });
      return;
    }

    setDeletingId(car.id);
    setMessage(null);

    try {
      const storagePaths = car.images
        .map((url) => getStoragePathFromPublicUrl(url))
        .filter((value): value is string => Boolean(value));

      if (storagePaths.length) {
        const { error: storageError } = await client.storage.from(CAR_IMAGES_BUCKET).remove(storagePaths);

        if (storageError) {
          throw new Error("تعذر حذف صور السيارة من التخزين.");
        }
      }

      const { error: deleteError } = await client.from("cars").delete().eq("id", car.id);

      if (deleteError) {
        throw new Error("تعذر حذف السيارة من قاعدة البيانات.");
      }

      if (editingId === car.id) {
        setEditingId(null);
        setEditValues(null);
      }

      setMessage({ type: "success", text: "تم حذف السيارة بنجاح." });
      await refreshDashboard(false);
      router.refresh();
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "حدث خطأ أثناء حذف السيارة.",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const startEditing = (car: CarRecord) => {
    setEditingId(car.id);
    setEditValues(mapCarToEditValues(car));
    setMessage(null);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditValues(null);
  };

  const handleSaveEdit = async (carId: string) => {
    if (!editValues) {
      return;
    }

    const parsedYear = Number(editValues.year);

    if (!editValues.name || !editValues.brand || !editValues.price || !editValues.description || !Number.isInteger(parsedYear)) {
      setMessage({ type: "error", text: "يرجى تعبئة بيانات التعديل بشكل صحيح قبل الحفظ." });
      return;
    }

    setSavingId(carId);
    setMessage(null);

    if (!supabaseConfigured) {
      const nextCars = cars.map((car) =>
        car.id === carId
          ? {
              ...car,
              name: editValues.name.trim(),
              brand: editValues.brand.trim(),
              year: parsedYear,
              price: editValues.price.trim(),
              description: editValues.description.trim(),
              status: editValues.status,
            }
          : car
      );

      commitLocalCars(nextCars);
      cancelEditing();
      setMessage({ type: "success", text: "تم تحديث السيارة بنجاح." });
      setSavingId(null);
      return;
    }

    const client = getSupabaseBrowserClient();

    if (!client) {
      setMessage({ type: "error", text: "تعذر إنشاء اتصال Supabase من المتصفح." });
      setSavingId(null);
      return;
    }

    try {
      const { error } = await client
        .from("cars")
        .update({
          name: editValues.name.trim(),
          brand: editValues.brand.trim(),
          year: parsedYear,
          price: editValues.price.trim(),
          description: editValues.description.trim(),
          status: editValues.status,
        })
        .eq("id", carId);

      if (error) {
        throw new Error("تعذر تحديث بيانات السيارة.");
      }

      cancelEditing();
      setMessage({ type: "success", text: "تم تحديث السيارة بنجاح." });
      await refreshDashboard(false);
      router.refresh();
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "حدث خطأ أثناء تعديل السيارة.",
      });
    } finally {
      setSavingId(null);
    }
  };

  return (
    <section dir="rtl" className="relative overflow-hidden rounded-[2rem] border border-white/8 bg-surface/80">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.09),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01))]" />
      <SuccessToast text={successToast} />
      <AddCarModal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        onSubmit={handleCreateCar}
        formValues={formValues}
        onFieldChange={updateFormValue}
        selectedImages={selectedImages}
        onRemovePreview={removePreview}
        onAttachFiles={attachFiles}
        fileInputRef={fileInputRef}
        isDragging={isDragging}
        setIsDragging={setIsDragging}
        isSubmitting={isSubmitting}
        message={message}
      />

      <div className="relative z-10 px-5 py-8 sm:px-7 lg:px-10 lg:py-10">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <form action={logoutAction} className="self-start">
            <LogoutButton />
          </form>

          <div className="max-w-3xl text-right">
            <p className="mb-3 text-xs font-medium tracking-[0.28em] text-primary">لوحة الأدمن</p>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1
                  className="text-3xl font-black text-foreground md:text-4xl"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
              إدارة سيارات Autocar
                </h1>
                <p className="mt-2 text-sm text-foreground/48">Autocar Admin</p>
              </div>

              <button
                type="button"
                onClick={openCreateModal}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-5 py-3 text-sm font-medium text-primary transition-all duration-300 hover:bg-primary hover:text-background"
              >
                <Plus className="h-4 w-4" />
                <span>إنشاء سيارة</span>
              </button>
            </div>
            <p className="mt-3 text-sm leading-7 text-foreground/58 md:text-base">
              إضافة وتعديل وحذف السيارات من لوحة الإدارة مع عرض مباشر لنفس العناصر داخل صفحة السيارات.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <StatCard label="إجمالي السيارات" value={stats.totalCars} />
          <StatCard label="إجمالي الصور المرفوعة" value={stats.totalImages} />
          <StatCard label="سيارات قيد المراجعة" value={stats.pendingCars} />
        </div>

        <div className="mt-6 space-y-4">
          <StatusBanner message={message} />
          {isRefreshing && (
            <div className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.03] px-4 py-2 text-sm text-foreground/70">
              <SpinnerIcon />
              <span>جاري تحديث البيانات...</span>
            </div>
          )}
        </div>

        <div className="mt-8">
          {false ? (
            <div className="rounded-[1.75rem] border border-white/8 bg-surface-light/80 p-5 shadow-[0_24px_60px_rgba(0,0,0,0.28)] sm:p-6">
            <div className="mb-6 text-right">
              <p className="text-xs font-medium tracking-[0.24em] text-primary">إضافة سيارة جديدة</p>
              <h2
                className="mt-3 text-2xl font-bold text-foreground"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                نموذج الإضافة
              </h2>
            </div>

            <form className="space-y-5" onSubmit={handleCreateCar}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="text-right">
                  <label htmlFor="car-name" className="mb-2 block text-sm font-medium text-foreground">
                    اسم السيارة
                  </label>
                  <input
                    id="car-name"
                    type="text"
                    value={formValues.name}
                    onChange={(event) => updateFormValue("name", event.target.value)}
                    className="w-full rounded-2xl border border-border bg-surface-light px-5 py-3.5 text-sm text-foreground placeholder:text-muted/50 outline-none transition-all duration-300 focus:border-primary/40 focus:ring-1 focus:ring-primary/20"
                    placeholder="مثال: مرسيدس AMG GT"
                  />
                </div>

                <div className="text-right">
                  <label htmlFor="car-brand" className="mb-2 block text-sm font-medium text-foreground">
                    العلامة التجارية
                  </label>
                  <input
                    id="car-brand"
                    type="text"
                    value={formValues.brand}
                    onChange={(event) => updateFormValue("brand", event.target.value)}
                    className="w-full rounded-2xl border border-border bg-surface-light px-5 py-3.5 text-sm text-foreground placeholder:text-muted/50 outline-none transition-all duration-300 focus:border-primary/40 focus:ring-1 focus:ring-primary/20"
                    placeholder="مثال: بورش"
                  />
                </div>

                <div className="text-right">
                  <label htmlFor="car-year" className="mb-2 block text-sm font-medium text-foreground">
                    سنة الصنع
                  </label>
                  <input
                    id="car-year"
                    type="number"
                    value={formValues.year}
                    onChange={(event) => updateFormValue("year", event.target.value)}
                    className="w-full rounded-2xl border border-border bg-surface-light px-5 py-3.5 text-sm text-foreground placeholder:text-muted/50 outline-none transition-all duration-300 focus:border-primary/40 focus:ring-1 focus:ring-primary/20"
                    placeholder="2025"
                  />
                </div>

                <div className="text-right">
                  <label htmlFor="car-price" className="mb-2 block text-sm font-medium text-foreground">
                    السعر
                  </label>
                  <input
                    id="car-price"
                    type="text"
                    value={formValues.price}
                    onChange={(event) => updateFormValue("price", event.target.value)}
                    className="w-full rounded-2xl border border-border bg-surface-light px-5 py-3.5 text-sm text-foreground placeholder:text-muted/50 outline-none transition-all duration-300 focus:border-primary/40 focus:ring-1 focus:ring-primary/20"
                    placeholder="$145,000"
                  />
                </div>
              </div>

              <div className="text-right">
                <label htmlFor="car-description" className="mb-2 block text-sm font-medium text-foreground">
                  الوصف
                </label>
                <textarea
                  id="car-description"
                  rows={5}
                  value={formValues.description}
                  onChange={(event) => updateFormValue("description", event.target.value)}
                  className="w-full resize-none rounded-2xl border border-border bg-surface-light px-5 py-3.5 text-sm text-foreground placeholder:text-muted/50 outline-none transition-all duration-300 focus:border-primary/40 focus:ring-1 focus:ring-primary/20"
                  placeholder="اكتب وصفاً مختصراً يوضح المواصفات والحالة وأهم المزايا."
                />
              </div>

              <div className="text-right">
                <p className="mb-3 text-sm font-medium text-foreground">صور السيارة</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(event) => attachFiles(event.target.files)}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(event) => {
                    event.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(event) => {
                    event.preventDefault();
                    setIsDragging(false);
                    attachFiles(event.dataTransfer.files);
                  }}
                  className={`group relative flex w-full flex-col items-center justify-center overflow-hidden rounded-[1.5rem] border border-dashed px-6 py-10 text-center transition-all duration-300 ${
                    isDragging
                      ? "border-primary/35 bg-primary/8 shadow-[0_0_32px_rgba(212,175,55,0.12)]"
                      : "border-white/15 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01))] hover:border-primary/30 hover:shadow-[0_0_32px_rgba(212,175,55,0.08)]"
                  }`}
                >
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08),transparent_58%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="relative z-10 flex flex-col items-center justify-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-primary">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        className="h-7 w-7"
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V7" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.5 10.5 3.5-3.5 3.5 3.5" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16.5v1A2.5 2.5 0 0 0 6.5 20h11a2.5 2.5 0 0 0 2.5-2.5v-1" />
                      </svg>
                    </div>
                    <p className="text-lg font-semibold text-foreground">ارفع صور السيارة</p>
                    <p className="mt-2 max-w-sm text-sm leading-6 text-foreground/48">
                      اسحب الصور هنا أو اضغط لاختيار الملفات. سيتم رفع الصور إلى Supabase Storage عند الحفظ.
                    </p>
                  </div>
                </button>

                {!!selectedImages.length && (
                  <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
                    {selectedImages.map((image) => (
                      <div key={image.id} className="relative overflow-hidden rounded-2xl border border-white/8 bg-black/20">
                        <div className="relative aspect-[1.1/1]">
                          {/* PERFORMANCE FIX: Keep admin upload previews on the
                              thumbnail image ladder instead of larger defaults. */}
                          <Image
                            src={image.previewUrl}
                            alt={image.file.name}
                            fill
                            unoptimized
                            className="object-cover"
                            sizes="(max-width: 768px) 50vw, 200px"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removePreview(image.id)}
                          className="absolute left-2 top-2 flex h-8 w-8 items-center justify-center rounded-full border border-white/12 bg-black/65 text-sm text-foreground transition-all duration-300 hover:border-primary/30 hover:text-primary"
                          aria-label={`حذف ${image.file.name}`}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-medium tracking-wide text-background transition-all duration-300 hover:bg-primary-light hover:shadow-lg hover:shadow-primary/20 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting && <SpinnerIcon />}
                <span>{isSubmitting ? "جاري حفظ السيارة..." : "حفظ السيارة"}</span>
              </button>
            </form>
            </div>
          ) : null}
          <div className="rounded-[1.75rem] border border-white/8 bg-surface-light/80 p-5 shadow-[0_24px_60px_rgba(0,0,0,0.28)] sm:p-6">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-right">
                <p className="text-xs font-medium tracking-[0.24em] text-primary">السيارات الحالية</p>
                <h2
                  className="mt-3 text-2xl font-bold text-foreground"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  جدول الإدارة
                </h2>
              </div>
            </div>

            <div className="hidden overflow-hidden rounded-[1.4rem] border border-white/8 lg:block">
              <div className="grid grid-cols-[1.45fr_0.85fr_0.65fr_0.9fr_1fr] gap-4 border-b border-white/8 bg-white/[0.02] px-5 py-4 text-right text-[0.72rem] font-medium tracking-[0.2em] text-foreground/45">
                <p>السيارة</p>
                <p>العلامة</p>
                <p>السنة</p>
                <p>السعر</p>
                <p>الإجراءات</p>
              </div>

              <div className="divide-y divide-white/8">
                {cars.map((car) => {
                  const isEditing = editingId === car.id && editValues;
                  const imageSrc = getImageSource(car);

                  return (
                    <div key={car.id} className="bg-transparent">
                      <div className="grid grid-cols-[1.45fr_0.85fr_0.65fr_0.9fr_1fr] gap-4 px-5 py-4 transition-all duration-300 hover:bg-white/[0.025]">
                        <div className="flex items-center gap-4">
                          <div className="relative h-16 w-[5.5rem] overflow-hidden rounded-2xl border border-white/8 bg-black/20">
                            {imageSrc ? (
                              <>
                                {/* PERFORMANCE FIX: Treat table thumbnails as small images
                                    so list views do not request oversized variants. */}
                                <Image
                                  src={imageSrc}
                                  alt={car.name}
                                  fill
                                  unoptimized={isBlobUrl(imageSrc)}
                                  className="object-cover"
                                  sizes="(max-width: 768px) 50vw, 200px"
                                />
                              </>
                            ) : (
                              <div className="flex h-full items-center justify-center text-xs text-foreground/45">لا توجد صورة</div>
                            )}
                          </div>
                          <div className="min-w-0 text-right">
                            {isEditing ? (
                              <input
                                type="text"
                                value={editValues.name}
                                onChange={(event) => updateEditValue("name", event.target.value)}
                                className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none transition-all duration-300 focus:border-primary/40"
                              />
                            ) : (
                              <p className="truncate font-semibold text-foreground">{car.name}</p>
                            )}
                            <p className="mt-1 text-xs text-foreground/42">{car.status === "pending" ? "قيد المراجعة" : "نشطة"}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-end">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editValues.brand}
                              onChange={(event) => updateEditValue("brand", event.target.value)}
                              className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none transition-all duration-300 focus:border-primary/40"
                            />
                          ) : (
                            <span className="text-sm text-foreground/68">{car.brand}</span>
                          )}
                        </div>

                        <div className="flex items-center justify-end">
                          {isEditing ? (
                            <input
                              type="number"
                              value={editValues.year}
                              onChange={(event) => updateEditValue("year", event.target.value)}
                              className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none transition-all duration-300 focus:border-primary/40"
                            />
                          ) : (
                            <span className="text-sm text-foreground/68">{car.year}</span>
                          )}
                        </div>

                        <div className="flex items-center justify-end">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editValues.price}
                              onChange={(event) => updateEditValue("price", event.target.value)}
                              className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none transition-all duration-300 focus:border-primary/40"
                            />
                          ) : (
                            <span className="text-sm font-semibold text-foreground">{car.price}</span>
                          )}
                        </div>

                        <div className="flex items-center justify-end gap-2">
                          {isEditing ? (
                            <>
                              <button
                                type="button"
                                onClick={() => handleSaveEdit(car.id)}
                                disabled={savingId === car.id}
                                className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-medium text-primary transition-all duration-300 hover:bg-primary hover:text-background disabled:cursor-not-allowed disabled:opacity-70"
                              >
                                {savingId === car.id && <SpinnerIcon />}
                                <span>{savingId === car.id ? "جارٍ الحفظ" : "حفظ"}</span>
                              </button>
                              <button
                                type="button"
                                onClick={cancelEditing}
                                className="rounded-full border border-white/10 px-4 py-2 text-xs font-medium text-foreground/70 transition-all duration-300 hover:border-primary/20 hover:text-primary"
                              >
                                إلغاء
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => startEditing(car)}
                                className="rounded-full border border-primary/30 px-4 py-2 text-xs font-medium text-primary transition-all duration-300 hover:bg-primary hover:text-background"
                              >
                                تعديل
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteCar(car)}
                                disabled={deletingId === car.id}
                                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-medium text-foreground/70 transition-all duration-300 hover:border-primary/20 hover:text-primary disabled:cursor-not-allowed disabled:opacity-70"
                              >
                                {deletingId === car.id && <SpinnerIcon />}
                                <span>{deletingId === car.id ? "جارٍ الحذف" : "حذف"}</span>
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {isEditing && (
                        <div className="grid gap-4 border-t border-white/8 bg-black/15 px-5 py-4 lg:grid-cols-[1fr_220px]">
                          <div className="text-right">
                            <label className="mb-2 block text-sm font-medium text-foreground">الوصف</label>
                            <textarea
                              rows={4}
                              value={editValues.description}
                              onChange={(event) => updateEditValue("description", event.target.value)}
                              className="w-full resize-none rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-foreground outline-none transition-all duration-300 focus:border-primary/40"
                            />
                          </div>

                          <div className="text-right">
                            <label className="mb-2 block text-sm font-medium text-foreground">الحالة</label>
                            <select
                              value={editValues.status}
                              onChange={(event) => updateEditValue("status", event.target.value)}
                              className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-foreground outline-none transition-all duration-300 focus:border-primary/40"
                            >
                              <option value="active">نشطة</option>
                              <option value="pending">قيد المراجعة</option>
                            </select>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-4 lg:hidden">
              {cars.map((car) => {
                const isEditing = editingId === car.id && editValues;
                const imageSrc = getImageSource(car);

                return (
                  <article
                    key={car.id}
                    className="overflow-hidden rounded-[1.5rem] border border-white/8 bg-white/[0.02] transition-all duration-300 hover:border-primary/20 hover:bg-white/[0.03]"
                  >
                    <div className="flex gap-4 p-4">
                      <div className="relative h-24 w-28 shrink-0 overflow-hidden rounded-2xl border border-white/8 bg-black/20">
                        {imageSrc ? (
                          <>
                            {/* PERFORMANCE FIX: Treat stacked mobile admin cards as
                                thumbnail-sized media for responsive image selection. */}
                            <Image
                              src={imageSrc}
                              alt={car.name}
                              fill
                              unoptimized={isBlobUrl(imageSrc)}
                              className="object-cover"
                              sizes="(max-width: 768px) 50vw, 200px"
                            />
                          </>
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-foreground/45">لا توجد صورة</div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1 text-right">
                        {isEditing ? (
                          <div className="space-y-3">
                            <input
                              type="text"
                              value={editValues.name}
                              onChange={(event) => updateEditValue("name", event.target.value)}
                              className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none transition-all duration-300 focus:border-primary/40"
                            />
                            <input
                              type="text"
                              value={editValues.brand}
                              onChange={(event) => updateEditValue("brand", event.target.value)}
                              className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none transition-all duration-300 focus:border-primary/40"
                            />
                            <div className="grid grid-cols-2 gap-3">
                              <input
                                type="number"
                                value={editValues.year}
                                onChange={(event) => updateEditValue("year", event.target.value)}
                                className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none transition-all duration-300 focus:border-primary/40"
                              />
                              <input
                                type="text"
                                value={editValues.price}
                                onChange={(event) => updateEditValue("price", event.target.value)}
                                className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none transition-all duration-300 focus:border-primary/40"
                              />
                            </div>
                            <textarea
                              rows={4}
                              value={editValues.description}
                              onChange={(event) => updateEditValue("description", event.target.value)}
                              className="w-full resize-none rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-foreground outline-none transition-all duration-300 focus:border-primary/40"
                            />
                            <select
                              value={editValues.status}
                              onChange={(event) => updateEditValue("status", event.target.value)}
                              className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-foreground outline-none transition-all duration-300 focus:border-primary/40"
                            >
                              <option value="active">نشطة</option>
                              <option value="pending">قيد المراجعة</option>
                            </select>
                          </div>
                        ) : (
                          <>
                            <p className="text-lg font-semibold text-foreground">{car.name}</p>
                            <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-foreground/62">
                              <div>
                                <p className="text-[0.7rem] tracking-[0.2em] text-foreground/40">العلامة</p>
                                <p className="mt-1 text-foreground/76">{car.brand}</p>
                              </div>
                              <div>
                                <p className="text-[0.7rem] tracking-[0.2em] text-foreground/40">السنة</p>
                                <p className="mt-1 text-foreground/76">{car.year}</p>
                              </div>
                              <div>
                                <p className="text-[0.7rem] tracking-[0.2em] text-foreground/40">السعر</p>
                                <p className="mt-1 font-semibold text-foreground">{car.price}</p>
                              </div>
                              <div>
                                <p className="text-[0.7rem] tracking-[0.2em] text-foreground/40">الحالة</p>
                                <p className="mt-1 text-foreground/76">{car.status === "pending" ? "قيد المراجعة" : "نشطة"}</p>
                              </div>
                            </div>
                          </>
                        )}

                        <div className="mt-4 flex flex-wrap justify-end gap-2">
                          {isEditing ? (
                            <>
                              <button
                                type="button"
                                onClick={() => handleSaveEdit(car.id)}
                                disabled={savingId === car.id}
                                className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-medium text-primary transition-all duration-300 hover:bg-primary hover:text-background disabled:cursor-not-allowed disabled:opacity-70"
                              >
                                {savingId === car.id && <SpinnerIcon />}
                                <span>{savingId === car.id ? "جارٍ الحفظ" : "حفظ"}</span>
                              </button>
                              <button
                                type="button"
                                onClick={cancelEditing}
                                className="rounded-full border border-white/10 px-4 py-2 text-xs font-medium text-foreground/70 transition-all duration-300 hover:border-primary/20 hover:text-primary"
                              >
                                إلغاء
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => startEditing(car)}
                                className="rounded-full border border-primary/30 px-4 py-2 text-xs font-medium text-primary transition-all duration-300 hover:bg-primary hover:text-background"
                              >
                                تعديل
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteCar(car)}
                                disabled={deletingId === car.id}
                                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-medium text-foreground/70 transition-all duration-300 hover:border-primary/20 hover:text-primary disabled:cursor-not-allowed disabled:opacity-70"
                              >
                                {deletingId === car.id && <SpinnerIcon />}
                                <span>{deletingId === car.id ? "جارٍ الحذف" : "حذف"}</span>
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {cars.length === 0 && (
              <div className="mt-6 rounded-[1.5rem] border border-dashed border-white/10 bg-black/10 px-6 py-10 text-center text-sm text-foreground/55">
                لا توجد سيارات محفوظة بعد. أضف أول سيارة من النموذج المجاور.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

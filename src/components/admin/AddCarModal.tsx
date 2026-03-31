"use client";

import { useEffect, type FormEvent, type RefObject } from "react";
import Image from "next/image";
import { X } from "lucide-react";

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

type ModalMessage = {
  type: "success" | "error";
  text: string;
} | null;

type AddCarModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void> | void;
  formValues: FormValues;
  onFieldChange: (field: keyof FormValues, value: string) => void;
  selectedImages: UploadPreview[];
  onRemovePreview: (id: string) => void;
  onAttachFiles: (fileList: FileList | null) => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
  isDragging: boolean;
  setIsDragging: (value: boolean) => void;
  isSubmitting: boolean;
  message: ModalMessage;
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

function ModalStatusBanner({ message }: { message: ModalMessage }) {
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

export default function AddCarModal({
  isOpen,
  onClose,
  onSubmit,
  formValues,
  onFieldChange,
  selectedImages,
  onRemovePreview,
  onAttachFiles,
  fileInputRef,
  isDragging,
  setIsDragging,
  isSubmitting,
  message,
}: AddCarModalProps) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-md"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-3xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#1a1a1a]/95 shadow-[0_30px_90px_rgba(0,0,0,0.45)]">
        <button
          type="button"
          onClick={onClose}
          className="absolute left-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/30 text-foreground/75 transition-all duration-300 hover:border-primary/30 hover:text-primary"
          aria-label="إغلاق نافذة إضافة السيارة"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="max-h-[90vh] overflow-y-auto px-5 py-6 sm:px-6 sm:py-7">
          <div className="mb-6 pr-12 text-right">
            <p className="text-xs font-medium tracking-[0.24em] text-primary">إضافة سيارة جديدة</p>
            <h2
              className="mt-3 text-2xl font-bold text-foreground"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              نموذج الإضافة
            </h2>
            <p className="mt-3 text-sm leading-7 text-foreground/58">
              أضف سيارة جديدة إلى لوحة الإدارة دون مغادرة الصفحة الحالية.
            </p>
          </div>

          <div className="mb-5">
            <ModalStatusBanner message={message} />
          </div>

          <form className="space-y-5" onSubmit={onSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="text-right">
                <label htmlFor="car-name" className="mb-2 block text-sm font-medium text-foreground">
                  اسم السيارة
                </label>
                <input
                  id="car-name"
                  type="text"
                  value={formValues.name}
                  onChange={(event) => onFieldChange("name", event.target.value)}
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
                  onChange={(event) => onFieldChange("brand", event.target.value)}
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
                  onChange={(event) => onFieldChange("year", event.target.value)}
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
                  onChange={(event) => onFieldChange("price", event.target.value)}
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
                onChange={(event) => onFieldChange("description", event.target.value)}
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
                onChange={(event) => onAttachFiles(event.target.files)}
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
                  onAttachFiles(event.dataTransfer.files);
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
                        onClick={() => onRemovePreview(image.id)}
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
      </div>
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

export type MessageRecord = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
};

type MessageDetailModalProps = {
  message: MessageRecord | null;
  onClose: () => void;
};

function formatMessageDate(value: string) {
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function MessageDetailModal({ message, onClose }: MessageDetailModalProps) {
  useEffect(() => {
    if (!message) {
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
  }, [message, onClose]);

  if (!message) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-2xl rounded-xl border border-primary/35 bg-[#151515] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.4)]">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/30 text-foreground/75 transition-all duration-300 hover:border-primary/30 hover:text-primary"
          aria-label="Close message details"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="space-y-6 pr-12">
          <div className="border-b border-white/8 pb-4">
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-primary">Message Details</p>
            <h2
              className="mt-3 text-2xl font-bold text-foreground"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {message.name}
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4">
              <p className="text-[0.72rem] uppercase tracking-[0.24em] text-foreground/45">Email</p>
              <p className="mt-2 text-sm text-foreground">{message.email}</p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4">
              <p className="text-[0.72rem] uppercase tracking-[0.24em] text-foreground/45">Phone</p>
              <p className="mt-2 text-sm text-foreground">{message.phone || "Not provided"}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4">
            <p className="text-[0.72rem] uppercase tracking-[0.24em] text-foreground/45">Date Received</p>
            <p className="mt-2 text-sm text-foreground">{formatMessageDate(message.created_at)}</p>
          </div>

          <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4">
            <p className="text-[0.72rem] uppercase tracking-[0.24em] text-foreground/45">Message</p>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-foreground/80">{message.message}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

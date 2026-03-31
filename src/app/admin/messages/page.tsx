"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { Eye, Mail, Trash2 } from "lucide-react";
import MessageDetailModal, { type MessageRecord } from "@/components/admin/MessageDetailModal";
import { getSupabaseBrowserClient, type Database } from "@/lib/supabase";

const PAGE_SIZE = 20;

type BrowserClient = SupabaseClient<Database>;

type MessageStats = {
  total: number;
  unread: number;
  today: number;
};

function formatTableDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getMessagePreview(message: string) {
  if (message.length <= 60) {
    return message;
  }

  return `${message.slice(0, 60)}...`;
}

function getTodayIsoStart() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now.toISOString();
}

async function fetchMessagePage(client: BrowserClient, page: number) {
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data, error, count } = await (client as any)
    .from("messages")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error("Unable to load messages.");
  }

  return {
    messages: (data ?? []) as MessageRecord[],
    total: count ?? 0,
  };
}

async function fetchMessageStats(client: BrowserClient): Promise<MessageStats> {
  const [{ count: total }, { count: unread }, { count: today }] = await Promise.all([
    (client as any).from("messages").select("id", { count: "exact", head: true }),
    (client as any)
      .from("messages")
      .select("id", { count: "exact", head: true })
      .eq("is_read", false),
    (client as any)
      .from("messages")
      .select("id", { count: "exact", head: true })
      .gte("created_at", getTodayIsoStart()),
  ]);

  return {
    total: total ?? 0,
    unread: unread ?? 0,
    today: today ?? 0,
  };
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<MessageRecord[]>([]);
  const [stats, setStats] = useState<MessageStats>({ total: 0, unread: 0, today: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMessage, setSelectedMessage] = useState<MessageRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [openingId, setOpeningId] = useState<string | null>(null);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(stats.total / PAGE_SIZE)), [stats.total]);

  const loadMessages = useCallback(async (page: number) => {
    const client = getSupabaseBrowserClient();

    if (!client) {
      setError("Supabase is not configured for messages yet.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [{ messages: nextMessages }, nextStats] = await Promise.all([
        fetchMessagePage(client, page),
        fetchMessageStats(client),
      ]);

      setMessages(nextMessages);
      setStats(nextStats);
    } catch {
      setError("Unable to load messages right now.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadMessages(currentPage);
  }, [currentPage, loadMessages]);

  const markMessageAsRead = useCallback(
    async (messageId: string) => {
      const client = getSupabaseBrowserClient();

      if (!client) {
        return false;
      }

      const { error: updateError } = await (client as any)
        .from("messages")
        .update({ is_read: true })
        .eq("id", messageId);

      if (updateError) {
        return false;
      }

      setMessages((current) =>
        current.map((item) => (item.id === messageId ? { ...item, is_read: true } : item))
      );
      setSelectedMessage((current) =>
        current && current.id === messageId ? { ...current, is_read: true } : current
      );
      setStats((current) => ({
        ...current,
        unread: Math.max(0, current.unread - 1),
      }));

      return true;
    },
    []
  );

  const handleOpenMessage = useCallback(
    async (message: MessageRecord) => {
      setOpeningId(message.id);

      if (!message.is_read) {
        await markMessageAsRead(message.id);
      }

      setSelectedMessage({ ...message, is_read: true });
      setOpeningId(null);
    },
    [markMessageAsRead]
  );

  const handleDeleteMessage = useCallback(
    async (message: MessageRecord) => {
      const shouldDelete = window.confirm("Are you sure you want to delete this message?");

      if (!shouldDelete) {
        return;
      }

      const client = getSupabaseBrowserClient();

      if (!client) {
        setError("Supabase is not configured for messages yet.");
        return;
      }

      setDeletingId(message.id);
      setError(null);

      const { error: deleteError } = await (client as any).from("messages").delete().eq("id", message.id);

      if (deleteError) {
        setDeletingId(null);
        setError("Unable to delete this message right now.");
        return;
      }

      setMessages((current) => current.filter((item) => item.id !== message.id));
      setSelectedMessage((current) => (current?.id === message.id ? null : current));
      setStats((current) => ({
        total: Math.max(0, current.total - 1),
        unread: current.unread - (message.is_read ? 0 : 1),
        today:
          new Date(message.created_at) >= new Date(getTodayIsoStart())
            ? Math.max(0, current.today - 1)
            : current.today,
      }));

      const nextTotal = stats.total - 1;
      const nextTotalPages = Math.max(1, Math.ceil(nextTotal / PAGE_SIZE));

      setDeletingId(null);

      if (currentPage > nextTotalPages) {
        setCurrentPage(nextTotalPages);
        return;
      }

      if (messages.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
        return;
      }

      void loadMessages(currentPage);
    },
    [currentPage, loadMessages, messages.length, stats.total]
  );

  return (
    <main dir="rtl" className="min-h-screen bg-background px-6 pb-16 pt-28">
      <div className="mx-auto max-w-7xl">
        <MessageDetailModal message={selectedMessage} onClose={() => setSelectedMessage(null)} />

        <section className="relative overflow-hidden rounded-[2rem] border border-white/8 bg-surface/80">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.09),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01))]" />

          <div className="relative z-10 px-5 py-8 sm:px-7 lg:px-10 lg:py-10">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-2xl text-right">
                <p className="mb-3 text-xs font-medium tracking-[0.28em] text-primary">Admin Inbox</p>
                <h1
                  className="text-3xl font-black text-foreground md:text-4xl"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Messages
                </h1>
                <p className="mt-3 text-sm leading-7 text-foreground/58 md:text-base">
                  Review visitor inquiries, mark them as read, and remove them when no longer needed.
                </p>
              </div>

              <div className="flex flex-wrap justify-end gap-3">
                <div className="rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm text-primary">
                  Total: {stats.total}
                </div>
                <div className="rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm text-primary">
                  Unread: {stats.unread}
                </div>
                <div className="rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm text-primary">
                  Today: {stats.today}
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-[1.75rem] border border-white/8 bg-surface-light/80 p-5 shadow-[0_24px_60px_rgba(0,0,0,0.28)] sm:p-6">
              <div className="mb-6 flex items-center justify-between">
                <div className="text-right">
                  <p className="text-xs font-medium tracking-[0.24em] text-primary">Customer Messages</p>
                  <h2
                    className="mt-3 text-2xl font-bold text-foreground"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Messages Inbox
                  </h2>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.02] px-4 py-2 text-sm text-foreground/60">
                  <Mail className="h-4 w-4 text-primary" />
                  <span>{stats.unread} unread</span>
                </div>
              </div>

              {error ? (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {error}
                </div>
              ) : null}

              {loading ? (
                <div className="rounded-[1.5rem] border border-dashed border-white/10 bg-black/10 px-6 py-10 text-center text-sm text-foreground/55">
                  Loading messages...
                </div>
              ) : messages.length === 0 ? (
                <div className="rounded-[1.5rem] border border-dashed border-white/10 bg-black/10 px-6 py-10 text-center text-sm text-foreground/55">
                  No messages yet.
                </div>
              ) : (
                <>
                  <div className="hidden overflow-hidden rounded-[1.4rem] border border-white/8 lg:block">
                    <div className="grid grid-cols-[1fr_1.1fr_0.9fr_1.6fr_0.9fr_0.75fr_0.8fr] gap-4 border-b border-white/8 bg-white/[0.02] px-5 py-4 text-left text-[0.72rem] font-medium tracking-[0.2em] text-foreground/45">
                      <p>Name</p>
                      <p>Email</p>
                      <p>Phone</p>
                      <p>Message Preview</p>
                      <p>Date</p>
                      <p>Status</p>
                      <p>Actions</p>
                    </div>

                    <div className="divide-y divide-white/8">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`grid grid-cols-[1fr_1.1fr_0.9fr_1.6fr_0.9fr_0.75fr_0.8fr] gap-4 px-5 py-4 transition-all duration-300 hover:bg-white/[0.025] ${
                            !message.is_read ? "border-l-4 border-yellow-400" : ""
                          }`}
                        >
                          <div className="truncate text-sm font-semibold text-foreground">{message.name}</div>
                          <div className="truncate text-sm text-foreground/68">{message.email}</div>
                          <div className="truncate text-sm text-foreground/68">{message.phone || "Not provided"}</div>
                          <div className="truncate text-sm text-foreground/62">{getMessagePreview(message.message)}</div>
                          <div className="text-sm text-foreground/62">{formatTableDate(message.created_at)}</div>
                          <div>
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                                message.is_read
                                  ? "border border-white/10 bg-white/[0.04] text-foreground/55"
                                  : "border border-primary/30 bg-primary/10 text-primary"
                              }`}
                            >
                              {message.is_read ? "Read" : "New"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => void handleOpenMessage(message)}
                              disabled={openingId === message.id}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary transition-all duration-300 hover:bg-primary hover:text-background disabled:cursor-not-allowed disabled:opacity-70"
                              aria-label={`Open message from ${message.name}`}
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => void handleDeleteMessage(message)}
                              disabled={deletingId === message.id}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-foreground/70 transition-all duration-300 hover:border-red-400/30 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-70"
                              aria-label={`Delete message from ${message.name}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-4 lg:hidden">
                    {messages.map((message) => (
                      <article
                        key={message.id}
                        className={`overflow-hidden rounded-[1.5rem] border bg-white/[0.02] p-4 transition-all duration-300 hover:bg-white/[0.03] ${
                          !message.is_read ? "border-yellow-400/50" : "border-white/8"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-3 text-right">
                            <div>
                              <p className="text-lg font-semibold text-foreground">{message.name}</p>
                              <p className="mt-1 text-sm text-foreground/60">{message.email}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-sm text-foreground/62">
                              <div>
                                <p className="text-[0.7rem] tracking-[0.2em] text-foreground/40">Phone</p>
                                <p className="mt-1 text-foreground/76">{message.phone || "Not provided"}</p>
                              </div>
                              <div>
                                <p className="text-[0.7rem] tracking-[0.2em] text-foreground/40">Date</p>
                                <p className="mt-1 text-foreground/76">{formatTableDate(message.created_at)}</p>
                              </div>
                            </div>
                            <p className="text-sm leading-7 text-foreground/62">{getMessagePreview(message.message)}</p>
                          </div>
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                              message.is_read
                                ? "border border-white/10 bg-white/[0.04] text-foreground/55"
                                : "border border-primary/30 bg-primary/10 text-primary"
                            }`}
                          >
                            {message.is_read ? "Read" : "New"}
                          </span>
                        </div>

                        <div className="mt-4 flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => void handleOpenMessage(message)}
                            disabled={openingId === message.id}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary transition-all duration-300 hover:bg-primary hover:text-background disabled:cursor-not-allowed disabled:opacity-70"
                            aria-label={`Open message from ${message.name}`}
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleDeleteMessage(message)}
                            disabled={deletingId === message.id}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-foreground/70 transition-all duration-300 hover:border-red-400/30 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-70"
                            aria-label={`Delete message from ${message.name}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>

                  <div className="mt-6 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setCurrentPage((current) => Math.max(1, current - 1))}
                      disabled={currentPage === 1}
                      className="rounded-full border border-white/10 px-4 py-2 text-sm text-foreground/70 transition-all duration-300 hover:border-primary/20 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <p className="text-sm text-foreground/55">
                      Page {currentPage} of {totalPages}
                    </p>
                    <button
                      type="button"
                      onClick={() => setCurrentPage((current) => Math.min(totalPages, current + 1))}
                      disabled={currentPage >= totalPages}
                      className="rounded-full border border-white/10 px-4 py-2 text-sm text-foreground/70 transition-all duration-300 hover:border-primary/20 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

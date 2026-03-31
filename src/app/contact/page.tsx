"use client";

import { useState } from "react";
import ScrollReveal from "@/components/animations/ScrollReveal";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setSending(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      setFormData({ name: "", email: "", phone: "", message: "" });
      setFeedback({
        type: "success",
        text: "Your message has been sent successfully. We'll contact you soon.",
      });
    } catch {
      setFeedback({
        type: "error",
        text: "Something went wrong. Please try again.",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-6 pt-32 pb-20">
        <ScrollReveal className="text-center mb-16">
          <p className="text-primary text-sm font-medium tracking-widest uppercase mb-3">
            Get in Touch
          </p>
          <h1 className="text-4xl md:text-6xl font-black mb-4" style={{ fontFamily: "var(--font-heading)" }}>
            Contact Us
          </h1>
          <p className="text-foreground/50 text-lg max-w-xl mx-auto">
            Have questions about a vehicle or want to schedule a visit? We&apos;d love to hear from you.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <ScrollReveal>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">Name</label>
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-5 py-3.5 rounded-xl bg-surface-light border border-border text-foreground placeholder:text-muted/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">Email</label>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-5 py-3.5 rounded-xl bg-surface-light border border-border text-foreground placeholder:text-muted/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">Phone</label>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-5 py-3.5 rounded-xl bg-surface-light border border-border text-foreground placeholder:text-muted/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">Message</label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-5 py-3.5 rounded-xl bg-surface-light border border-border text-foreground placeholder:text-muted/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all resize-none"
                  placeholder="Tell us about the vehicle you're interested in..."
                />
              </div>
              <button
                type="submit"
                disabled={sending}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-medium tracking-wide text-background transition-all duration-300 hover:bg-primary-light hover:shadow-lg hover:shadow-primary/20 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {sending && (
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
                <span>{sending ? "Sending..." : "Send Message"}</span>
              </button>
              {feedback && (
                <p
                  className={`text-sm ${
                    feedback.type === "success" ? "text-primary" : "text-red-400"
                  }`}
                  style={{ animation: "contact-status-fade 220ms ease-out" }}
                >
                  {feedback.text}
                </p>
              )}
            </form>
          </ScrollReveal>

          <ScrollReveal direction="right">
            <div className="space-y-8">
              <div className="rounded-2xl bg-surface-light border border-border p-8">
                <h3 className="text-lg font-bold mb-6" style={{ fontFamily: "var(--font-heading)" }}>
                  Visit Us
                </h3>
                <div className="space-y-5">
                  {[
                    { label: "Address", value: "123 Autocar Boulevard\nLos Angeles, CA 90001" },
                    { label: "Phone", value: "+1 (555) 234-5678" },
                    { label: "Email", value: "info@autocar.com" },
                    { label: "Hours", value: "Mon - Sat: 9:00 AM - 7:00 PM\nSun: 10:00 AM - 5:00 PM" },
                  ].map((item) => (
                    <div key={item.label}>
                      <p className="text-xs text-primary tracking-widest uppercase mb-1">{item.label}</p>
                      <p className="text-sm text-foreground/70 whitespace-pre-line">{item.value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-8 border-t border-border pt-8">
                  <a
                    href="https://wa.me/15552345678"
                    target="_blank"
                    rel="noreferrer"
                    className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#25D366]/30 bg-[#25D366]/10 px-5 py-3 text-[#25D366] transition-all hover:bg-[#25D366]/20"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden="true">
                      <path d="M19.05 4.94A9.9 9.9 0 0012.02 2C6.56 2 2.1 6.4 2.1 11.86c0 1.75.46 3.45 1.33 4.95L2 22l5.34-1.4a9.9 9.9 0 004.68 1.19h.01c5.46 0 9.9-4.4 9.9-9.86 0-2.64-1.03-5.12-2.88-6.99zm-7.03 15.18h-.01a8.2 8.2 0 01-4.18-1.14l-.3-.18-3.17.83.85-3.08-.2-.32a8.13 8.13 0 01-1.25-4.36c0-4.49 3.69-8.14 8.25-8.14 2.2 0 4.27.85 5.83 2.39a8.05 8.05 0 012.42 5.75c0 4.49-3.7 8.15-8.24 8.15zm4.47-6.11c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.23-.62.77-.76.93-.14.15-.28.17-.52.06-.24-.12-1.03-.38-1.96-1.22-.72-.63-1.2-1.42-1.34-1.65-.14-.23-.01-.35.1-.47.11-.11.24-.29.36-.43.12-.14.16-.24.24-.4.08-.16.04-.31-.02-.43-.06-.12-.54-1.29-.74-1.77-.2-.47-.4-.41-.54-.41h-.46c-.16 0-.43.06-.65.31-.22.23-.86.84-.86 2.06 0 1.21.89 2.39 1.01 2.55.12.15 1.75 2.66 4.23 3.72.59.26 1.06.42 1.42.54.6.19 1.14.16 1.57.1.48-.07 1.42-.58 1.62-1.14.2-.56.2-1.03.14-1.13-.06-.09-.22-.15-.46-.27z" />
                    </svg>
                    <span>Chat on WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal className="mt-16">
          <section>
            <h2 className="mb-6 text-2xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>
              Find Us
            </h2>
            <div className="relative h-80 w-full overflow-hidden rounded-2xl border border-border bg-surface-light">
              <iframe
                src="https://maps.google.com/maps?q=Los+Angeles&output=embed"
                className="absolute inset-0 h-full w-full opacity-35"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Autocar location map"
              />
              <div className="absolute inset-0 opacity-60" style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 32px), repeating-linear-gradient(90deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 32px)" }} />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(10,10,10,0.18),rgba(10,10,10,0.82))]" />
              <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="mb-4 h-14 w-14 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s6-5.33 6-11a6 6 0 10-12 0c0 5.67 6 11 6 11z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
                <h3 className="mb-5 text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                  123 Autocar Boulevard
                </h3>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=123+Autocar+Boulevard+Los+Angeles+CA+90001"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-primary/30 px-6 py-3 text-sm font-medium tracking-wide text-primary transition-all duration-300 hover:bg-primary hover:text-background"
                >
                  Get Directions
                </a>
              </div>
            </div>
          </section>
        </ScrollReveal>
      </div>
      <style jsx>{`
        @keyframes contact-status-fade {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

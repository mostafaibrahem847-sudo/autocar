"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import TransitionLink from "@/components/ui/TransitionLink";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/cars", label: "Cars" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 py-5">
      <div className="relative mx-auto max-w-7xl px-6 flex items-center justify-between">
        <TransitionLink href="/" className="flex items-center gap-2.5 group shrink-0">
          <div
            className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-background font-bold text-lg transition-transform duration-300 group-hover:scale-110"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            A
          </div>
          <span
            className="text-xl font-bold tracking-tight text-foreground"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Auto<span className="text-primary">car</span>
          </span>
        </TransitionLink>

        <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) => (
            <TransitionLink
              key={link.href}
              href={link.href}
              className={`relative text-sm font-medium tracking-wider uppercase transition-colors duration-300 hover:text-primary ${
                pathname === link.href ? "text-primary" : "text-foreground/70"
              }`}
            >
              {link.label}
              {pathname === link.href && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full" />
              )}
            </TransitionLink>
          ))}
        </nav>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden relative w-8 h-8 flex flex-col items-center justify-center gap-1.5 cursor-pointer"
          aria-label="Toggle menu"
        >
          <span
            className={`block w-6 h-0.5 bg-foreground transition-all duration-300 origin-center ${
              menuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-foreground transition-all duration-300 ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-foreground transition-all duration-300 origin-center ${
              menuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden mt-2 bg-background/95 backdrop-blur-md border-t border-white/5">
          <div className="flex flex-col items-center gap-6 py-8 px-6">
            {navLinks.map((link) => (
              <TransitionLink
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`text-base font-medium tracking-wider uppercase transition-colors duration-300 hover:text-primary ${
                  pathname === link.href ? "text-primary" : "text-foreground/70"
                }`}
              >
                {link.label}
              </TransitionLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

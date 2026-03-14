import TransitionLink from "@/components/ui/TransitionLink";

export default function Footer() {
  return (
    <footer className="w-full bg-surface border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <TransitionLink href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-background font-bold text-lg"
                   style={{ fontFamily: "var(--font-heading)" }}>
                A
              </div>
              <span className="text-xl font-bold tracking-tight"
                    style={{ fontFamily: "var(--font-heading)" }}>
                Auto<span className="text-primary">car</span>
              </span>
            </TransitionLink>
            <p className="text-muted text-sm leading-relaxed max-w-md">
              Premium automotive dealership offering certified vehicles, competitive pricing,
              and an unmatched customer experience. Your journey to the perfect car starts here.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4"
                style={{ fontFamily: "var(--font-heading)" }}>
              Navigation
            </h4>
            <ul className="space-y-3">
              {[
                { href: "/", label: "Home" },
                { href: "/cars", label: "Cars" },
                { href: "/about", label: "About" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.href}>
                  <TransitionLink
                    href={link.href}
                    className="text-muted text-sm hover:text-primary transition-colors duration-300"
                  >
                    {link.label}
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4"
                style={{ fontFamily: "var(--font-heading)" }}>
              Contact
            </h4>
            <ul className="space-y-3 text-sm text-muted">
              <li>123 Autocar Boulevard</li>
              <li>Los Angeles, CA 90001</li>
              <li className="hover:text-primary transition-colors cursor-pointer">info@autocar.com</li>
              <li className="hover:text-primary transition-colors cursor-pointer">+1 (555) 234-5678</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted text-xs">
            © 2026 Autocar. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {["Facebook", "Instagram", "Twitter"].map((social) => (
              <span
                key={social}
                className="text-muted text-xs hover:text-primary transition-colors duration-300 cursor-pointer"
              >
                {social}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

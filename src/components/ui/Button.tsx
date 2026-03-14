import TransitionLink from "@/components/ui/TransitionLink";

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
}

export default function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  type = "button",
}: ButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center font-medium tracking-wide transition-all duration-300 rounded-full cursor-pointer";

  const variants = {
    primary:
      "bg-primary text-background hover:bg-primary-light hover:shadow-lg hover:shadow-primary/20",
    outline:
      "border border-primary/50 text-primary hover:bg-primary hover:text-background",
    ghost:
      "text-foreground/70 hover:text-primary hover:bg-foreground/5",
  };

  const sizes = {
    sm: "text-xs px-5 py-2.5",
    md: "text-sm px-7 py-3",
    lg: "text-base px-9 py-4",
  };

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <TransitionLink href={href} className={classes}>
        {children}
      </TransitionLink>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}

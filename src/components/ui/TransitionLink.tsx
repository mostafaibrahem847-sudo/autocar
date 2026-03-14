"use client";

import Link, { LinkProps } from "next/link";
import { MouseEvent, PropsWithChildren, useCallback } from "react";
import { useRouter } from "next/navigation";
import { usePageTransition } from "@/components/layout/PageTransitionProvider";

type TransitionLinkProps = PropsWithChildren<
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> &
    LinkProps & {
      className?: string;
    }
>;

function isModifiedEvent(event: MouseEvent<HTMLAnchorElement>) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
}

function isExternalHref(href: string) {
  return /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(href);
}

export default function TransitionLink({
  href,
  onClick,
  onMouseEnter,
  target,
  children,
  ...props
}: TransitionLinkProps) {
  const router = useRouter();
  const { navigateWithTransition } = usePageTransition();

  const hrefValue = typeof href === "string" ? href : href.toString();

  const handleClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      onClick?.(event);

      if (
        event.defaultPrevented ||
        isModifiedEvent(event) ||
        event.button !== 0 ||
        target === "_blank" ||
        isExternalHref(hrefValue)
      ) {
        return;
      }

      event.preventDefault();
      navigateWithTransition(hrefValue);
    },
    [hrefValue, navigateWithTransition, onClick, target]
  );

  const handleMouseEnter = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      onMouseEnter?.(event);

      if (!isExternalHref(hrefValue)) {
        router.prefetch(hrefValue);
      }
    },
    [hrefValue, onMouseEnter, router]
  );

  return (
    <Link
      href={href}
      target={target}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      {...props}
    >
      {children}
    </Link>
  );
}

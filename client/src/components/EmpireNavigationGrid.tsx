import { Link, useLocation } from "wouter";
import { SITE_LINKS } from "@/lib/siteNavigation";
import { cn } from "@/lib/utils";

type EmpireNavigationGridProps = {
  onNavigate?: () => void;
  variant?: "compact" | "default";
  className?: string;
};

export default function EmpireNavigationGrid({
  onNavigate,
  variant = "default",
  className,
}: EmpireNavigationGridProps) {
  const [location] = useLocation();
  const isCompact = variant === "compact";

  return (
    <nav
      className={cn("w-full", className)}
      aria-label="Empire site directory"
      data-testid="empire-navigation-grid"
    >
      <ol
        className={cn(
          "grid list-none gap-2 p-0 m-0",
          isCompact
            ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
            : "grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-7",
        )}
      >
        {SITE_LINKS.map((link, index) => {
          const isActive = location === link.href;
          const number = index + 1;

          return (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={onNavigate}
                aria-label={`${number}. ${link.label}`}
                aria-current={isActive ? "page" : undefined}
                title={link.label}
                data-testid={`link-empire-nav-${link.href === "/" ? "home" : link.href.slice(1)}`}
                className={cn(
                  "group flex h-full w-full flex-col items-stretch rounded-xl border text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  isCompact ? "min-h-[4.5rem] p-2.5" : "min-h-[5.25rem] p-3",
                  isActive
                    ? "border-primary bg-primary text-primary-foreground shadow-[0_0_18px_hsl(var(--primary)/0.28)]"
                    : "border-primary/25 bg-background/70 hover:-translate-y-0.5 hover:border-primary/60 hover:bg-primary/5",
                )}
              >
                <span
                  className={cn(
                    "mb-1.5 inline-flex w-fit items-center justify-center rounded-md border font-display font-bold leading-none",
                    isCompact ? "h-6 min-w-6 px-1.5 text-[11px]" : "h-7 min-w-7 px-2 text-xs",
                    isActive
                      ? "border-primary-foreground/30 bg-primary-foreground/15 text-primary-foreground"
                      : "border-primary/35 bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground",
                  )}
                >
                  {number}
                </span>
                <span
                  className={cn(
                    "font-display font-semibold uppercase leading-snug tracking-wide",
                    isCompact ? "text-[10px] sm:text-[11px]" : "text-[11px] sm:text-xs",
                    isActive ? "text-primary-foreground" : "text-foreground",
                  )}
                >
                  <span className="sm:hidden">{link.compactLabel}</span>
                  <span className="hidden sm:inline">{link.label}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

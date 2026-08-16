import { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HeartPulse, LayoutGrid, Shirt, ShoppingBag, Watch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE_LINKS } from "@/lib/siteNavigation";

const QUICK_LINKS = [
  {
    href: "/apparel",
    label: "Shop Apparel",
    number: SITE_LINKS.findIndex((link) => link.href === "/apparel") + 1,
    Icon: Shirt,
  },
  {
    href: "/accessories",
    label: "Accessories",
    number: SITE_LINKS.findIndex((link) => link.href === "/accessories") + 1,
    Icon: Watch,
  },
  {
    href: "/elements",
    label: "Health & Skincare",
    number: SITE_LINKS.findIndex((link) => link.href === "/elements") + 1,
    Icon: HeartPulse,
  },
  {
    href: "/hub",
    label: "Full Site Map",
    number: SITE_LINKS.findIndex((link) => link.href === "/hub") + 1,
    Icon: LayoutGrid,
  },
] as const;

export default function TopSlideNav() {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div
      className="sticky top-20 z-40 w-full border-b border-primary/30 bg-secondary/95 shadow-[0_0.5rem_1.5rem_hsl(219_96%_54%/0.12)] backdrop-blur supports-[backdrop-filter]:bg-secondary/90"
      data-testid="top-slide-nav"
    >
      <button
        type="button"
        onClick={() => setIsExpanded((current) => !current)}
        className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left transition-colors hover:bg-primary/5"
        aria-expanded={isExpanded}
        aria-controls="top-slide-nav-panel"
        data-testid="button-top-slide-nav-toggle"
      >
        <span className="font-display text-xs uppercase tracking-[0.22em] text-primary sm:text-sm">
          Site Directory · Shop
        </span>
        <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          <span className="hidden sm:inline">
            {isExpanded ? "Hide" : "Open"}
          </span>
          <ChevronDown
            className={`h-4 w-4 text-primary transition-transform duration-300 ${
              isExpanded ? "rotate-180" : ""
            }`}
            aria-hidden="true"
          />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            id="top-slide-nav-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="overflow-hidden border-t border-primary/20"
            data-testid="panel-top-slide-nav"
          >
            <div className="container mx-auto px-4 py-4">
              <p className="mb-3 text-center text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Jump directly — numbered to match the Empire Apps menu
              </p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {QUICK_LINKS.map(({ href, label, number, Icon }) => (
                  <Link key={href} href={href} onClick={() => setIsExpanded(false)}>
                    <Button
                      size="lg"
                      variant={href === "/hub" ? "outline" : "default"}
                      className={`h-auto w-full px-3 py-3 font-display text-[11px] uppercase tracking-wider sm:text-xs ${
                        href === "/hub"
                          ? "border-primary/50 bg-background/40 hover:bg-primary hover:text-primary-foreground"
                          : "bg-primary text-primary-foreground hover:bg-foreground hover:text-background"
                      }`}
                      data-testid={`link-top-slide-${href.replace(/\//g, "") || "home"}`}
                    >
                      <span className="mr-2 inline-flex h-5 min-w-5 items-center justify-center rounded border border-current/30 px-1 text-[10px] font-bold">
                        {number}
                      </span>
                      <Icon className="mr-1.5 h-4 w-4 shrink-0" />
                      {label}
                    </Button>
                  </Link>
                ))}
              </div>

              <div className="mt-3 flex justify-center">
                <Link href="/apparel" onClick={() => setIsExpanded(false)}>
                  <Button
                    variant="link"
                    className="h-auto px-2 py-1 text-[11px] uppercase tracking-[0.18em] text-primary"
                    data-testid="link-top-slide-shop-khemistri"
                  >
                    <ShoppingBag className="mr-1.5 h-3.5 w-3.5" />
                    Shop Khomplete Khemistri Apparel
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

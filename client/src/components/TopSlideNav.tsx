import { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, LayoutGrid, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

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
          Shop · Hub
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
            <div className="container mx-auto flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-center">
              <Link href="/apparel" onClick={() => setIsExpanded(false)}>
                <Button
                  size="lg"
                  className="h-auto w-full bg-primary px-6 py-4 font-display text-sm uppercase tracking-wider text-primary-foreground hover:bg-foreground hover:text-background sm:w-auto sm:min-w-[200px]"
                  data-testid="link-top-slide-shop-khemistri"
                >
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Shop Khemistri
                </Button>
              </Link>

              <Link href="/hub" onClick={() => setIsExpanded(false)}>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-auto w-full border-primary/50 bg-background/40 px-6 py-4 font-display text-sm uppercase tracking-wider hover:bg-primary hover:text-primary-foreground sm:w-auto sm:min-w-[200px]"
                  data-testid="link-top-slide-centralized-hub"
                >
                  <LayoutGrid className="mr-2 h-4 w-4" />
                  Centralized Hub
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

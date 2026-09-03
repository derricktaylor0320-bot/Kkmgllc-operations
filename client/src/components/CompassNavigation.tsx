import { Link } from "wouter";
import { Compass, LogIn, LogOut, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import EmpireNavigationGrid from "@/components/EmpireNavigationGrid";
import { getSiteLinkNumber, SITE_LINKS } from "@/lib/siteNavigation";

type CompassNavigationProps = {
  accountName: string;
  isAuthenticated: boolean;
  isOpen: boolean;
  onLogout: () => void;
  onOpenChange: (open: boolean) => void;
  /** Centered navbar placement shows a clearer click-here call-to-action. */
  variant?: "default" | "centered";
};

export default function CompassNavigation({
  accountName,
  isAuthenticated,
  isOpen,
  onLogout,
  onOpenChange,
  variant = "default",
}: CompassNavigationProps) {
  const apparelNumber = getSiteLinkNumber("/apparel");
  const elementsNumber = getSiteLinkNumber("/elements");
  const accessoriesNumber = getSiteLinkNumber("/accessories");

  const isCentered = variant === "centered";

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className={
            isCentered
              ? "group h-auto min-h-10 max-w-[min(100%,20rem)] flex-col gap-0.5 border-primary/70 bg-primary/15 px-3 py-1.5 text-primary shadow-[0_0_22px_hsl(var(--primary)/0.22)] hover:bg-primary hover:text-primary-foreground sm:px-4 sm:py-2"
              : "h-10 border-primary/60 bg-primary/10 px-3 text-primary shadow-[0_0_18px_hsl(var(--primary)/0.16)] hover:bg-primary hover:text-primary-foreground"
          }
          aria-label={`Open the Empire site directory — all ${SITE_LINKS.length} numbered destinations`}
          data-testid="button-compass-navigation"
        >
          <span className="flex items-center gap-2">
            <Compass className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
            {isCentered ? (
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] sm:text-xs sm:tracking-[0.16em]">
                Click Here — Site Directory
              </span>
            ) : (
              <span className="ml-2 hidden uppercase tracking-[0.16em] xl:inline">
                Site Directory
              </span>
            )}
          </span>
          {isCentered && (
            <span className="text-[9px] uppercase tracking-[0.12em] text-primary/80 group-hover:text-primary-foreground/90 sm:text-[10px] sm:tracking-[0.14em]">
              All {SITE_LINKS.length} destinations · tap to browse
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="h-dvh w-screen max-w-none overflow-hidden border-l-0 bg-background/98 p-0 sm:max-w-none"
        data-testid="dialog-compass-navigation"
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-1/2 h-[78vmin] w-[58vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/25 blur-3xl" />
          <div className="absolute inset-0 topaz-glow opacity-55" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,hsl(var(--background))_72%)]" />
        </div>

        <div className="relative z-10 flex h-full min-h-0 flex-col">
          <SheetHeader className="shrink-0 border-b border-primary/40 px-5 py-3 text-center sm:px-8 sm:py-4">
            <SheetTitle className="font-display text-xl uppercase tracking-[0.2em] sm:text-2xl">
              <span className="silver-shine">Empire Site Directory</span>
            </SheetTitle>
            <SheetDescription className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:text-xs">
              {SITE_LINKS.length} numbered destinations — tap the button you
              need, no waiting
            </SheetDescription>
          </SheetHeader>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
            <p className="mb-4 text-center text-xs leading-relaxed text-muted-foreground sm:text-sm">
              Looking for lotion, skin care, and wellness? Go to{" "}
              <span className="font-semibold text-primary">
                {elementsNumber}. Elements Health &amp; Skincare
              </span>
              . Apparel is{" "}
              <span className="font-semibold text-primary">
                {apparelNumber}. Apparel
              </span>
              , accessories are{" "}
              <span className="font-semibold text-primary">
                {accessoriesNumber}. Accessories
              </span>
              .
            </p>
            <EmpireNavigationGrid
              variant="rows"
              showCategories
              onNavigate={() => onOpenChange(false)}
            />
          </div>

          <div className="relative z-20 flex min-h-12 shrink-0 items-center justify-center border-t border-primary/25 bg-background/75 px-5 py-2 backdrop-blur-sm">
            {isAuthenticated ? (
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
                  <UserIcon className="h-4 w-4 shrink-0 text-primary" />
                  <span className="max-w-44 truncate">{accountName}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onOpenChange(false);
                    onLogout();
                  }}
                  className="h-8 border-primary/50 uppercase tracking-wider"
                  data-testid="button-logout-compass"
                >
                  <LogOut className="mr-1.5 h-3.5 w-3.5" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link href="/auth" onClick={() => onOpenChange(false)}>
                <Button
                  size="sm"
                  className="h-8 bg-primary text-primary-foreground hover:bg-primary/90"
                  data-testid="button-signin-compass"
                >
                  <LogIn className="mr-1.5 h-3.5 w-3.5" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

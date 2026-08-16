import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  ChevronDown,
  Compass,
  LayoutGrid,
  LogIn,
  LogOut,
  User as UserIcon,
} from "lucide-react";
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
import { SITE_LINKS } from "@/lib/siteNavigation";
import {
  DIGIT_THREE_GUIDE_PATH,
  digitThreeSphere,
  projectSpherePoint,
} from "@/lib/digitThreeSphere";
import compassLogo from "@assets/brand/consolidatus_empire_crest_blue_silver.jpg";

type CompassNavigationProps = {
  accountName: string;
  isAuthenticated: boolean;
  isOpen: boolean;
  onLogout: () => void;
  onOpenChange: (open: boolean) => void;
};

type NavigationView = "directory" | "three";

const ROTATION_RADIANS_PER_SECOND = 0.35;
const COMPASS_RADIUS = 168;
const COMPASS_PERSPECTIVE = 700;
const COMPASS_TILT = -0.35;

export default function CompassNavigation({
  accountName,
  isAuthenticated,
  isOpen,
  onLogout,
  onOpenChange,
}: CompassNavigationProps) {
  const [location] = useLocation();
  const [view, setView] = useState<NavigationView>("directory");
  const pausedRef = useRef(false);
  const pointsRef = useRef(digitThreeSphere(SITE_LINKS.length));
  const [angle, setAngle] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setView("directory");
    }
  }, [isOpen]);

  useEffect(() => {
    pausedRef.current = false;

    if (!isOpen || view !== "three") {
      return;
    }

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) {
      setAngle(0);
      return;
    }

    let animationFrame = 0;
    let previousTime: number | null = null;

    const rotateThree = (time: number) => {
      if (previousTime === null) {
        previousTime = time;
      }

      const elapsed = Math.min(time - previousTime, 64) / 1000;
      previousTime = time;

      if (!pausedRef.current) {
        setAngle(
          (currentAngle) =>
            currentAngle + elapsed * ROTATION_RADIANS_PER_SECOND,
        );
      }

      animationFrame = window.requestAnimationFrame(rotateThree);
    };

    animationFrame = window.requestAnimationFrame(rotateThree);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      pausedRef.current = false;
    };
  }, [isOpen, view]);

  const nodes = pointsRef.current
    .map((point, index) => {
      const projected = projectSpherePoint(point, angle, {
        radius: COMPASS_RADIUS,
        perspective: COMPASS_PERSPECTIVE,
        tilt: COMPASS_TILT,
      });
      return { ...SITE_LINKS[index], ...projected, index };
    })
    .sort((a, b) => a.z - b.z);

  const pointedIndex = nodes[nodes.length - 1]?.index ?? 0;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="h-10 border-primary/60 bg-primary/10 px-3 text-primary shadow-[0_0_18px_hsl(var(--primary)/0.16)] hover:bg-primary hover:text-primary-foreground"
          aria-label="Open the Empire site directory"
          data-testid="button-compass-navigation"
        >
          <Compass className="h-5 w-5" />
          <span className="ml-2 hidden uppercase tracking-[0.16em] xl:inline">
            Empire Apps
          </span>
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
              <span className="silver-shine">Explore the Empire</span>
            </SheetTitle>
            <SheetDescription className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:text-xs">
              {SITE_LINKS.length} destinations — pick a numbered button to go
              directly where you need
            </SheetDescription>
          </SheetHeader>

          <div className="flex shrink-0 justify-center gap-2 border-b border-primary/20 px-4 py-3">
            <Button
              type="button"
              size="sm"
              variant={view === "directory" ? "default" : "outline"}
              className="h-8 uppercase tracking-wider"
              onClick={() => setView("directory")}
              data-testid="button-nav-view-directory"
            >
              <LayoutGrid className="mr-1.5 h-3.5 w-3.5" />
              Site Directory
            </Button>
            <Button
              type="button"
              size="sm"
              variant={view === "three" ? "default" : "outline"}
              className="h-8 uppercase tracking-wider"
              onClick={() => setView("three")}
              data-testid="button-nav-view-three"
            >
              <Compass className="mr-1.5 h-3.5 w-3.5" />
              Founders Three
            </Button>
          </div>

          {view === "directory" ? (
            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
              <p className="mb-4 text-center text-xs leading-relaxed text-muted-foreground sm:text-sm">
                Looking for lotion, skin care, and wellness? Go to{" "}
                <span className="font-semibold text-primary">
                  {SITE_LINKS.findIndex((link) => link.href === "/elements") + 1}
                  . Elements Health &amp; Skincare
                </span>
                . Apparel is{" "}
                <span className="font-semibold text-primary">
                  {SITE_LINKS.findIndex((link) => link.href === "/apparel") + 1}
                  . Apparel
                </span>
                .
              </p>
              <EmpireNavigationGrid onNavigate={() => onOpenChange(false)} />
            </div>
          ) : (
            <nav
              className="flex min-h-0 flex-1 items-center justify-center"
              aria-label="Empire founders three navigation"
            >
              <div className="compass-three" data-testid="compass-rose">
                <div
                  className="compass-pointer"
                  aria-hidden="true"
                  data-testid="compass-pointer"
                >
                  <ChevronDown />
                </div>
                <div className="compass-pointer-axis" aria-hidden="true" />

                <svg
                  viewBox="-1 -1 2 2"
                  className="pointer-events-none absolute inset-[10%] text-primary/25"
                  aria-hidden="true"
                >
                  <defs>
                    <radialGradient id="compassThreeGlow">
                      <stop
                        offset="0%"
                        stopColor="hsl(210 40% 96%)"
                        stopOpacity="0.42"
                      />
                      <stop
                        offset="45%"
                        stopColor="hsl(220 95% 55%)"
                        stopOpacity="0.2"
                      />
                      <stop
                        offset="100%"
                        stopColor="hsl(224 82% 20%)"
                        stopOpacity="0"
                      />
                    </radialGradient>
                  </defs>
                  <path
                    d={DIGIT_THREE_GUIDE_PATH}
                    fill="none"
                    stroke="url(#compassThreeGlow)"
                    strokeWidth="0.12"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d={DIGIT_THREE_GUIDE_PATH}
                    fill="none"
                    stroke="hsl(210 40% 96%)"
                    strokeOpacity="0.35"
                    strokeWidth="0.045"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <div className="compass-center" aria-hidden="true">
                  <div className="absolute inset-[-18%] rounded-full border border-primary/25" />
                  <div className="absolute inset-[-34%] animate-[spin_36s_linear_infinite] rounded-full border border-dashed border-primary/20 motion-reduce:animate-none" />
                  <img
                    src={compassLogo}
                    alt=""
                    className="brand-crest-glow h-[72%] w-[72%] object-contain"
                  />
                </div>

                {nodes.map((node) => {
                  const depth = (node.z + 1) / 2;
                  const opacity = 0.28 + depth * 0.72;
                  const isActive = location === node.href;
                  const isPointed = pointedIndex === node.index;

                  return (
                    <Link
                      key={node.href}
                      href={node.href}
                      className={`compass-three-link ${
                        isPointed ? "compass-three-link-pointed" : ""
                      } ${isActive ? "compass-three-link-current" : ""}`}
                      style={{
                        transform: `translate(-50%, -50%) translate(${node.left}px, ${node.top}px) scale(${node.scale})`,
                        zIndex: Math.round((node.z + 1) * 100),
                        opacity,
                      }}
                      onMouseEnter={() => {
                        pausedRef.current = true;
                      }}
                      onMouseLeave={() => {
                        pausedRef.current = false;
                      }}
                      onFocus={() => {
                        pausedRef.current = true;
                      }}
                      onBlur={() => {
                        pausedRef.current = false;
                      }}
                      onClick={() => onOpenChange(false)}
                      aria-label={`${node.index + 1}. ${node.label}`}
                      aria-current={isActive ? "page" : undefined}
                      title={node.label}
                      data-pointer-active={isPointed ? "true" : "false"}
                      data-testid={`link-compass-${node.href === "/" ? "home" : node.href.slice(1)}`}
                    >
                      <span className="compass-link-number">
                        {String(node.index + 1).padStart(2, "0")}
                      </span>
                      <span className="sm:hidden">{node.compactLabel}</span>
                      <span className="hidden sm:inline">{node.label}</span>
                    </Link>
                  );
                })}
              </div>
            </nav>
          )}

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

import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, Shirt, Sparkles } from "lucide-react";
import { Link } from "wouter";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { allLogos } from "@/lib/logoCatalog";
import {
  FOOTBALL_SPORTS_EDITION_SECTION,
  FOOTBALL_TEAM_DESIGNS,
} from "@shared/footballTeams";

export default function FootballTeams() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <section className="relative overflow-hidden border-b border-primary/25 bg-[radial-gradient(circle_at_top,hsl(var(--primary)/0.24),transparent_42%),linear-gradient(180deg,hsl(var(--secondary)),hsl(var(--background)))]">
          <div
            className="absolute inset-0 opacity-20"
            aria-hidden="true"
            style={{
              backgroundImage:
                "linear-gradient(30deg, transparent 45%, hsl(var(--primary) / 0.18) 45%, hsl(var(--primary) / 0.18) 55%, transparent 55%)",
              backgroundSize: "48px 48px",
            }}
          />
          <div className="container relative mx-auto px-4 py-16 text-center md:py-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="mx-auto max-w-5xl"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/50 bg-black/25 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-primary">
                <CalendarDays className="h-4 w-4" />
                Seasonal · August through February
              </span>
              <p className="mt-7 text-sm font-semibold uppercase tracking-[0.34em] text-primary/80">
                Khomplete Khemistri Apparel &amp; Accessories
              </p>
              <h1
                className="mt-3 font-display text-4xl font-black uppercase tracking-tight text-foreground sm:text-6xl lg:text-7xl"
                data-testid="text-football-title"
              >
                Football Teams
                <span className="mt-2 block text-primary">Sports Edition</span>
              </h1>
              <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                Pick your football crest, choose the item you want, and decide
                exactly where the design goes. These limited-season designs can
                be placed on shirts, sweatshirts, jackets, jeans, shorts, and
                more.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm">
                <span className="rounded-full border border-primary/35 bg-primary/10 px-4 py-2 text-foreground">
                  {FOOTBALL_TEAM_DESIGNS.length} uploaded designs
                </span>
                <span className="rounded-full border border-primary/35 bg-primary/10 px-4 py-2 text-foreground">
                  T-shirts start at $30
                </span>
                <span className="rounded-full border border-primary/35 bg-primary/10 px-4 py-2 text-foreground">
                  Multiple placements add $3
                </span>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-14 md:py-20">
          <div className="mb-10 text-center">
            <div className="mb-3 flex items-center justify-center gap-2 text-primary">
              <Sparkles className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-[0.3em]">
                Choose your team
              </span>
            </div>
            <h2 className="font-display text-3xl font-bold uppercase tracking-wide text-foreground md:text-4xl">
              {FOOTBALL_SPORTS_EDITION_SECTION}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              Select any crest below to open the customizer and choose your
              garment and print location.
            </p>
          </div>

          <div
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            data-testid="grid-football-teams"
          >
            {FOOTBALL_TEAM_DESIGNS.map((team, index) => {
              const logo = allLogos[team.id];
              if (!logo) return null;

              return (
                <motion.div
                  key={team.id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{
                    duration: 0.4,
                    delay: Math.min(index % 4, 3) * 0.05,
                  }}
                >
                  <Link
                    href={`/customize/${team.id}`}
                    className="group block h-full overflow-hidden rounded-2xl border border-primary/25 bg-card shadow-[0_18px_45px_rgba(0,0,0,0.24)] transition duration-300 hover:-translate-y-1 hover:border-primary/70 hover:shadow-[0_22px_55px_rgba(0,0,0,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    data-testid={`link-football-team-${team.id}`}
                  >
                    <div className="relative aspect-square overflow-hidden bg-black/35 p-3">
                      <img
                        src={logo.src}
                        alt={logo.alt}
                        className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.035]"
                        loading={index < 4 ? "eager" : "lazy"}
                        data-testid={`img-football-team-${team.id}`}
                      />
                      <span className="absolute left-3 top-3 rounded-full border border-primary/40 bg-black/75 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                        Seasonal
                      </span>
                    </div>
                    <div className="flex min-h-28 items-center justify-between gap-3 border-t border-primary/20 p-4">
                      <div>
                        <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                          Sports Edition · #{team.id}
                        </span>
                        <h3 className="mt-1 font-display text-lg font-bold uppercase tracking-wide text-foreground">
                          {team.name}
                        </h3>
                      </div>
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/35 bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                        <ArrowRight className="h-5 w-5" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section className="border-y border-primary/20 bg-secondary/55">
          <div className="container mx-auto px-4 py-12 md:py-16">
            <div className="mx-auto grid max-w-5xl gap-8 rounded-2xl border border-primary/35 bg-background/70 p-6 shadow-2xl md:grid-cols-[auto_1fr] md:p-10">
              <span className="flex h-14 w-14 items-center justify-center rounded-xl border border-primary/40 bg-primary/10 text-primary">
                <Shirt className="h-7 w-7" />
              </span>
              <div>
                <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-primary md:text-3xl">
                  Put Your Crest Where You Want It
                </h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  A short-sleeve T-shirt remains $30. One print location is
                  included. If you select multiple locations on the same item,
                  one flat $3 multiple-placement fee is added. Other garments
                  use their regular website prices.
                </p>
                <p className="mt-4 text-sm font-semibold uppercase tracking-wider text-foreground">
                  Select a team above to start customizing.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-10 text-center">
          <p className="mx-auto max-w-4xl text-xs leading-relaxed text-muted-foreground">
            Limited seasonal collection. Team names and marks belong to their
            respective owners. Khomplete Khemistri Apparel &amp; Accessories is
            not affiliated with or endorsed by any professional football team
            or league.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}

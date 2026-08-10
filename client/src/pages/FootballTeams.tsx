import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  Car,
  ShoppingCart,
  Shirt,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react";
import { Link } from "wouter";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { allLogos } from "@/lib/logoCatalog";
import {
  CUTTING_BOARD_FEATURES,
  CUTTING_BOARD_SAMPLE_PHOTOS,
  cuttingBoardCustomizeHref,
} from "@shared/footballCuttingBoard";
import {
  GAME_DAY_BUNDLE_FEATURES,
  gameDayBundleCustomizeHref,
  gameDayBundlePriceDollars,
  gameDayBundleSavingsDollars,
} from "@shared/footballGameDayBundle";
import {
  FOOTBALL_SPORTS_EDITION_SECTION,
  FOOTBALL_TEAM_DESIGNS,
} from "@shared/footballTeams";

function CuttingBoardSamplePhoto({
  src,
  alt,
  teamName,
  teamLogoId,
  index,
}: {
  src: string;
  alt: string;
  teamName: string;
  teamLogoId: string;
  index: number;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <motion.figure
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="overflow-hidden rounded-2xl border border-primary/30 bg-black/20 shadow-xl"
      data-testid={`cutting-board-sample-${teamLogoId}`}
    >
      <div className="relative aspect-[4/3] bg-secondary/40">
        {failed ? (
          <div
            className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center text-sm text-muted-foreground"
            data-testid={`cutting-board-sample-placeholder-${teamLogoId}`}
          >
            <UtensilsCrossed className="h-8 w-8 text-primary/60" />
            <p className="font-medium text-foreground">{teamName}</p>
            <p className="text-xs">Sample photo loading…</p>
          </div>
        ) : (
          <img
            src={src}
            alt={alt}
            className="h-full w-full object-cover"
            loading={index === 0 ? "eager" : "lazy"}
            onError={() => setFailed(true)}
            data-testid={`img-cutting-board-sample-${teamLogoId}`}
          />
        )}
      </div>
      <figcaption className="border-t border-primary/20 px-4 py-3">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">
          Sample · {teamName}
        </p>
        <Link
          href={cuttingBoardCustomizeHref(teamLogoId)}
          className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-foreground hover:text-primary"
          data-testid={`link-order-board-sample-${teamLogoId}`}
        >
          Buy Now — This Team&apos;s Board
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </figcaption>
    </motion.figure>
  );
}

export default function FootballTeams() {
  const defaultQuickOrderTeam =
    CUTTING_BOARD_SAMPLE_PHOTOS[0]?.teamLogoId ??
    FOOTBALL_TEAM_DESIGNS[0]?.id ??
    "";
  const [quickOrderTeamId, setQuickOrderTeamId] = useState(defaultQuickOrderTeam);

  const scrollToTeams = () => {
    document
      .getElementById("choose-your-team")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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
                Pick your football crest, then choose apparel, accessories, a
                handmade NFL cutting board ($50 · 2 for $90), or the Game Day
                Bundle with team-logo car floor mats + cutting board ($
                {gameDayBundlePriceDollars()}). Limited-season designs can be
                placed on shirts, sweatshirts, jackets, jeans, shorts, and more.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm">
                <span className="rounded-full border border-primary/35 bg-primary/10 px-4 py-2 text-foreground">
                  {FOOTBALL_TEAM_DESIGNS.length} uploaded designs
                </span>
                <span className="rounded-full border border-primary/35 bg-primary/10 px-4 py-2 text-foreground">
                  T-shirts start at $30
                </span>
                <span className="rounded-full border border-primary/35 bg-primary/10 px-4 py-2 text-foreground">
                  NFL cutting boards $50 · 2 for $90
                </span>
                <span className="rounded-full border border-primary/35 bg-primary/10 px-4 py-2 text-foreground">
                  Game Day Bundle ${gameDayBundlePriceDollars()}
                </span>
              </div>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <Button
                  size="lg"
                  className="font-display uppercase tracking-wider"
                  onClick={scrollToTeams}
                  data-testid="button-shop-team-gear"
                >
                  Shop Team Gear
                </Button>
                <Link href="#cutting-boards">
                  <Button
                    size="lg"
                    variant="outline"
                    className="font-display uppercase tracking-wider border-primary/50"
                    data-testid="button-shop-cutting-boards"
                  >
                    <UtensilsCrossed className="mr-2 h-4 w-4" />
                    Shop Cutting Boards
                  </Button>
                </Link>
                <Link href="#game-day-bundle">
                  <Button
                    size="lg"
                    variant="outline"
                    className="font-display uppercase tracking-wider border-primary/50"
                    data-testid="button-shop-game-day-bundle"
                  >
                    <Car className="mr-2 h-4 w-4" />
                    Game Day Bundle
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        <section
          id="cutting-boards"
          className="border-y border-primary/20 bg-secondary/40 scroll-mt-20"
        >
          <div className="container mx-auto px-4 py-12 md:py-16">
            <div className="mx-auto max-w-5xl space-y-10">
              <div className="grid gap-8 rounded-2xl border border-primary/35 bg-background/70 p-6 shadow-2xl md:grid-cols-[auto_1fr] md:p-10">
                <span className="flex h-14 w-14 items-center justify-center rounded-xl border border-primary/40 bg-primary/10 text-primary">
                  <UtensilsCrossed className="h-7 w-7" />
                </span>
                <div>
                  <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-primary md:text-3xl">
                    NFL Handmade Cutting Boards
                  </h2>
                  <p className="mt-3 leading-relaxed text-muted-foreground">
                    Bring game day into your kitchen with handcrafted hardwood
                    cutting boards featuring your team crest. Each board is made by
                    hand with premium wood, detailed NFL team artwork, and a
                    food-safe epoxy finish — functional for everyday use or bold
                    enough to display.
                  </p>
                  <p className="mt-4 text-sm font-semibold uppercase tracking-wider text-foreground">
                    $50 per board · 2 for $90
                  </p>
                  <ul className="mt-4 space-y-1 text-sm text-muted-foreground list-disc pl-5">
                    {CUTTING_BOARD_FEATURES.slice(0, 3).map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <h3
                  className="font-display text-xl font-bold uppercase tracking-wide text-foreground"
                  data-testid="heading-cutting-board-samples"
                >
                  See What They Look Like
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Real handmade boards — river-style hardwood with your team logo
                  set in colored resin. Every board is one of a kind.
                </p>
                <div
                  className="mt-6 grid gap-6 sm:grid-cols-2"
                  data-testid="grid-cutting-board-samples"
                >
                  {CUTTING_BOARD_SAMPLE_PHOTOS.map((sample, index) => (
                    <CuttingBoardSamplePhoto
                      key={sample.teamLogoId}
                      src={sample.src}
                      alt={sample.alt}
                      teamName={sample.teamName}
                      teamLogoId={sample.teamLogoId}
                      index={index}
                    />
                  ))}
                </div>
              </div>

              <div
                className="rounded-2xl border border-primary/35 bg-primary/5 p-6 md:p-8"
                data-testid="cutting-board-quick-order"
              >
                <h3 className="font-display text-xl font-bold uppercase tracking-wide text-primary">
                  Buy a Cutting Board
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Pick your team and go straight to checkout — no extra steps.
                </p>
                <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end">
                  <div className="flex-1">
                    <label
                      htmlFor="quick-order-team"
                      className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground"
                    >
                      Select Team
                    </label>
                    <select
                      id="quick-order-team"
                      value={quickOrderTeamId}
                      onChange={(e) => setQuickOrderTeamId(e.target.value)}
                      className="w-full rounded-lg border border-primary/30 bg-background px-4 py-3 text-sm font-medium"
                      data-testid="select-quick-order-team"
                    >
                      {FOOTBALL_TEAM_DESIGNS.map((team) => (
                        <option key={team.id} value={team.id}>
                          {team.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Link href={cuttingBoardCustomizeHref(quickOrderTeamId)}>
                    <Button
                      size="lg"
                      className="w-full font-display uppercase tracking-wider sm:w-auto"
                      data-testid="button-buy-cutting-board"
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Buy Now — $50
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="game-day-bundle"
          className="border-b border-primary/20 bg-background scroll-mt-20"
        >
          <div className="container mx-auto px-4 py-12 md:py-16">
            <div className="mx-auto max-w-5xl rounded-2xl border border-primary/35 bg-secondary/40 p-6 shadow-2xl md:p-10">
              <div className="grid gap-8 md:grid-cols-[auto_1fr]">
                <span className="flex h-14 w-14 items-center justify-center rounded-xl border border-primary/40 bg-primary/10 text-primary">
                  <Car className="h-7 w-7" />
                </span>
                <div>
                  <h2
                    className="font-display text-2xl font-bold uppercase tracking-wide text-primary md:text-3xl"
                    data-testid="heading-game-day-bundle"
                  >
                    Game Day Bundle
                  </h2>
                  <p className="mt-3 leading-relaxed text-muted-foreground">
                    Pair custom team-logo car floor mats with a handmade NFL
                    cutting board — one checkout, one team crest across both.
                  </p>
                  <p className="mt-4 text-sm font-semibold uppercase tracking-wider text-foreground">
                    ${gameDayBundlePriceDollars()} flat · Save $
                    {gameDayBundleSavingsDollars()} vs buying separately
                  </p>
                  <ul className="mt-4 space-y-1 text-sm text-muted-foreground list-disc pl-5">
                    {GAME_DAY_BUNDLE_FEATURES.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                  <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end">
                    <div className="flex-1">
                      <label
                        htmlFor="bundle-order-team"
                        className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground"
                      >
                        Select Team
                      </label>
                      <select
                        id="bundle-order-team"
                        value={quickOrderTeamId}
                        onChange={(e) => setQuickOrderTeamId(e.target.value)}
                        className="w-full rounded-lg border border-primary/30 bg-background px-4 py-3 text-sm font-medium"
                        data-testid="select-bundle-order-team"
                      >
                        {FOOTBALL_TEAM_DESIGNS.map((team) => (
                          <option key={team.id} value={team.id}>
                            {team.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <Link href={gameDayBundleCustomizeHref(quickOrderTeamId)}>
                      <Button
                        size="lg"
                        className="w-full font-display uppercase tracking-wider sm:w-auto"
                        data-testid="button-buy-game-day-bundle"
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Buy Now — ${gameDayBundlePriceDollars()}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="choose-your-team"
          className="container mx-auto px-4 py-14 md:py-20 scroll-mt-20"
        >
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
              Select any crest below — apparel, tumblers, cutting boards, or the
              Game Day Bundle with team-logo car mats.
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
                  className="group h-full overflow-hidden rounded-2xl border border-primary/25 bg-card shadow-[0_18px_45px_rgba(0,0,0,0.24)] transition duration-300 hover:-translate-y-1 hover:border-primary/70 hover:shadow-[0_22px_55px_rgba(0,0,0,0.4)]"
                  data-testid={`card-football-team-${team.id}`}
                >
                  <Link
                    href={`/customize/${team.id}`}
                    className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
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
                  </Link>
                  <div className="border-t border-primary/20 p-4">
                    <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                      Sports Edition · #{team.id}
                    </span>
                    <h3 className="mt-1 font-display text-lg font-bold uppercase tracking-wide text-foreground">
                      {team.name}
                    </h3>
                    <div className="mt-4 flex flex-col gap-2">
                      <Link
                        href={`/customize/${team.id}`}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-primary/35 bg-primary/10 px-3 py-2 text-xs font-bold uppercase tracking-wider text-primary transition hover:bg-primary hover:text-primary-foreground"
                        data-testid={`link-team-gear-${team.id}`}
                      >
                        Team Gear
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                      <Link
                        href={cuttingBoardCustomizeHref(team.id)}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-primary/35 px-3 py-2 text-xs font-bold uppercase tracking-wider text-foreground transition hover:bg-secondary"
                        data-testid={`link-order-board-${team.id}`}
                      >
                        <ShoppingCart className="h-3.5 w-3.5" />
                        Buy Board — $50
                      </Link>
                      <Link
                        href={gameDayBundleCustomizeHref(team.id)}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-primary/35 px-3 py-2 text-xs font-bold uppercase tracking-wider text-foreground transition hover:bg-secondary"
                        data-testid={`link-order-bundle-${team.id}`}
                      >
                        <Car className="h-3.5 w-3.5" />
                        Bundle — ${gameDayBundlePriceDollars()}
                      </Link>
                    </div>
                  </div>
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

import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Droplets, Sparkles, WashingMachine } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ECO_LAUNDRY_SHEETS_PACKS,
  ECO_LAUNDRY_SHEETS_PRICE_CENTS,
  LAUNDRY_SAUCE_REFERRAL_URL,
  LAUNDRY_SAUCE_STARTING_PRICE_DOLLARS,
  MACHINE_CLEANER_TABLETS_PRICE_CENTS,
  MACHINE_CLEANER_TABLETS_PRICE_ID,
} from "@shared/homeCareLaundry";

function formatDollars(cents: number) {
  return (cents / 100).toFixed(2);
}

export default function HomeCareLaundryCollection() {
  const [selectedPackIdx, setSelectedPackIdx] = useState(0);
  const selectedPack =
    ECO_LAUNDRY_SHEETS_PACKS[
      Math.min(selectedPackIdx, ECO_LAUNDRY_SHEETS_PACKS.length - 1)
    ];
  const startingPrice = formatDollars(ECO_LAUNDRY_SHEETS_PRICE_CENTS);
  const selectedPrice = formatDollars(selectedPack.priceCents);
  const tabletsPrice = formatDollars(MACHINE_CLEANER_TABLETS_PRICE_CENTS);

  return (
    <section
      className="mb-12 max-w-6xl mx-auto"
      aria-labelledby="home-care-laundry-title"
      data-testid="section-home-care-laundry"
    >
      <div className="mb-8 text-center">
        <h2
          id="home-care-laundry-title"
          className="font-display text-2xl md:text-3xl font-bold uppercase tracking-tight text-foreground mb-2"
        >
          TCE Home Care &amp; Laundry Collection
        </h2>
        <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
          From eco-friendly everyday washing to fine-fragrance luxury pods and deep
          machine maintenance, choose the perfect solution for your laundry routine.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Everyday Value — Eco Laundry Sheets */}
        <motion.article
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="flex flex-col justify-between rounded-xl border border-primary/20 bg-card p-6 shadow-sm"
          data-testid="card-eco-laundry-sheets"
        >
          <div>
            <span className="inline-block rounded-full bg-emerald-500/15 px-2.5 py-1 text-[0.7rem] font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
              Everyday Value
            </span>
            <div className="mt-4 flex items-center gap-2 text-primary">
              <Droplets className="h-5 w-5" aria-hidden="true" />
              <h3 className="font-display text-lg font-bold uppercase text-foreground">
                Eco Laundry Sheets
              </h3>
            </div>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Dissolvable, eco-conscious detergent sheets designed for standard and HE
              washers. Eliminates plastic heavy bottles, fights tough stains, and
              delivers zero waste. Available in 32, 64, and 96-count packs.
            </p>
          </div>
          <div className="mt-6">
            <div className="mb-4 space-y-3">
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-sm text-muted-foreground">From</span>
                <span className="text-2xl font-extrabold text-foreground">
                  ${startingPrice}
                </span>
                <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  Free Shipping
                </span>
              </div>
              <div
                className="flex flex-wrap gap-2"
                data-testid="picker-eco-laundry-sheets-pack"
              >
                {ECO_LAUNDRY_SHEETS_PACKS.map((pack, i) => {
                  const isSelected = i === selectedPackIdx;
                  return (
                    <button
                      key={pack.priceId}
                      type="button"
                      onClick={() => setSelectedPackIdx(i)}
                      className={`rounded-md border px-3 py-1.5 text-xs font-medium uppercase tracking-wide transition-colors ${
                        isSelected
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/40"
                      }`}
                      data-testid={`button-eco-laundry-pack-${pack.count}`}
                    >
                      {pack.count} Count — ${formatDollars(pack.priceCents)}
                    </button>
                  );
                })}
              </div>
              <p className="text-sm font-medium text-foreground">
                Selected: {selectedPack.count}-count pack — ${selectedPrice}
              </p>
            </div>
            <Link href={`/product/${selectedPack.priceId}`}>
              <Button
                className="w-full font-display uppercase tracking-wider"
                data-testid="link-buy-eco-laundry-sheets"
              >
                Buy Now
              </Button>
            </Link>
          </div>
        </motion.article>

        {/* Premium — Laundry Sauce partner */}
        <motion.article
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ delay: 0.05 }}
          className="relative flex flex-col justify-between rounded-xl border-2 border-foreground bg-card p-6 shadow-lg"
          data-testid="card-laundry-sauce"
        >
          <span
            className="absolute -top-3 right-5 rounded-full bg-foreground px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide text-background"
          >
            Premium Choice
          </span>
          <div>
            <span className="inline-block rounded-full bg-purple-500/15 px-2.5 py-1 text-[0.7rem] font-bold uppercase tracking-wide text-purple-800 dark:text-purple-300">
              Luxury Scented
            </span>
            <div className="mt-4 flex items-center gap-2 text-primary">
              <Sparkles className="h-5 w-5" aria-hidden="true" />
              <h3 className="font-display text-lg font-bold uppercase text-foreground">
                Laundry Sauce Fine Fragrance Pods
              </h3>
            </div>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Ultra-concentrated bio-enzyme pods crafted with top perfumer scents like
              Sandalwood, Saffron, and Egyptian Rose. Available in 30-count or
              high-value 69-count boxes (~$1.00/load).
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              *Save up to 15% when you select the subscription option on checkout.
            </p>
          </div>
          <div className="mt-6">
            <div className="mb-4">
              <span className="text-sm text-muted-foreground">Starting from</span>
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-2xl font-extrabold text-foreground">
                  ${LAUNDRY_SAUCE_STARTING_PRICE_DOLLARS.toFixed(2)}
                </span>
                <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  Direct Partner Offer
                </span>
              </div>
            </div>
            <Button
              asChild
              className="w-full font-display uppercase tracking-wider bg-foreground text-background hover:bg-foreground/90"
              data-testid="link-shop-laundry-sauce"
            >
              <a
                href={LAUNDRY_SAUCE_REFERRAL_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Shop Laundry Sauce
              </a>
            </Button>
          </div>
        </motion.article>

        {/* Machine Care — Washing Machine Tablets */}
        <motion.article
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col justify-between rounded-xl border border-primary/20 bg-card p-6 shadow-sm md:col-span-2 lg:col-span-1"
          data-testid="card-machine-cleaner-tablets"
        >
          <div>
            <span className="inline-block rounded-full bg-sky-500/15 px-2.5 py-1 text-[0.7rem] font-bold uppercase tracking-wide text-sky-800 dark:text-sky-300">
              Machine Maintenance
            </span>
            <div className="mt-4 flex items-center gap-2 text-primary">
              <WashingMachine className="h-5 w-5" aria-hidden="true" />
              <h3 className="font-display text-lg font-bold uppercase text-foreground">
                Deep Clean Washing Machine Tablets
              </h3>
            </div>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Powerful eco-conscious cleaner tablets (24 per cylinder). Safely dissolves
              residue, odor, and detergent buildup from inside the drum, tub seals, and
              lines for top/front loading HE washers.
            </p>
          </div>
          <div className="mt-6">
            <div className="mb-4 flex flex-wrap items-baseline gap-2">
              <span className="text-2xl font-extrabold text-foreground">
                ${tabletsPrice}
              </span>
              <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                Free Shipping
              </span>
            </div>
            <Link href={`/product/${MACHINE_CLEANER_TABLETS_PRICE_ID}`}>
              <Button
                className="w-full font-display uppercase tracking-wider"
                data-testid="link-buy-machine-cleaner"
              >
                Buy Cleaner Tablets
              </Button>
            </Link>
          </div>
        </motion.article>
      </div>
    </section>
  );
}

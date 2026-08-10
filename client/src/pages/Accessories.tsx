import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import BrandSectionBanner from "@/components/BrandSectionBanner";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Car, Trophy, UtensilsCrossed } from "lucide-react";
import { groupProductVariants } from "@/lib/productVariants";
import {
  FLOOR_MAT_UNIT_PRICE_CENTS,
  gameDayBundlePriceDollars,
} from "@shared/footballGameDayBundle";
import { CUTTING_BOARD_SAMPLE_PHOTOS } from "@shared/footballCuttingBoard";
import accessoriesSectionArt from "@assets/generated_images/kk_accessories_apparel_banner.jpeg";

const FLOOR_MATS_IMAGE = "/assets/kk_custom_car_floor_mats.png";
const FLOOR_MATS_TITLE = "Custom Car Floor Mats";

function isFloorMatsProduct(product: { title?: string; imageUrl?: string }) {
  return (
    product.title === FLOOR_MATS_TITLE ||
    Boolean(product.imageUrl?.includes("kk_custom_car_floor_mats"))
  );
}

export default function Accessories() {
  const { data: products, isLoading } = useQuery({
    queryKey: ["/api/products/type/accessory"],
  });

  const allProducts = (products as any[]) || [];
  const visibleProducts = groupProductVariants(
    allProducts.filter(
      (p) =>
        p.category !== "Bedding" &&
        p.category !== "Sleepwear" &&
        p.category !== "Intimates" &&
        p.category !== "Body Care",
    ),
  );

  // Keep Custom Car Floor Mats at the front of the Accessories grid so the
  // standalone SKU is impossible to miss.
  const sortedProducts = [...visibleProducts].sort((a: any, b: any) => {
    const aMats = isFloorMatsProduct(a) ? 0 : 1;
    const bMats = isFloorMatsProduct(b) ? 0 : 1;
    if (aMats !== bMats) return aMats - bMats;
    const aSort = typeof a.sortOrder === "number" ? a.sortOrder : 99;
    const bSort = typeof b.sortOrder === "number" ? b.sortOrder : 99;
    if (aSort !== bSort) return aSort - bSort;
    return String(a.title || "").localeCompare(String(b.title || ""));
  });

  const floorMatsProduct = sortedProducts.find(isFloorMatsProduct) as
    | { priceId?: string; price?: string }
    | undefined;
  const floorMatsPrice =
    floorMatsProduct?.price != null
      ? parseFloat(floorMatsProduct.price)
      : FLOOR_MAT_UNIT_PRICE_CENTS / 100;
  const floorMatsHref = floorMatsProduct?.priceId
    ? `/product/${floorMatsProduct.priceId}`
    : "#custom-car-floor-mats";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <BrandSectionBanner
          imageSrc={accessoriesSectionArt}
          imageAlt="Khomplete Khemistri Accessories — Apparel & Accessories"
          caption="Branded essentials for your lifestyle. Watches, duffle bags, tumblers, car floor mats, umbrellas, candles, and more."
        />

        <div className="mb-12 grid gap-6 lg:grid-cols-3">
          <div
            className="rounded-2xl border border-primary/30 bg-secondary/40 p-6"
            data-testid="card-accessories-floor-mats"
          >
            <div className="mb-3 flex items-center gap-2 text-primary">
              <Car className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Standalone Accessory
              </span>
            </div>
            <h2 className="font-display text-xl font-bold uppercase text-foreground">
              Custom Car Floor Mats
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Rug-style all-weather mats with your choice of any Khomplete
              Khemistri logo. One flat ${floorMatsPrice} — logo and shipping
              included.
            </p>
            <figure className="mt-4 overflow-hidden rounded-xl border border-primary/25 bg-black/20">
              <img
                src={FLOOR_MATS_IMAGE}
                alt="Custom Khomplete Khemistri car floor mats with branded crest"
                className="aspect-[4/3] w-full object-contain p-3"
                loading="lazy"
                data-testid="img-accessories-floor-mats"
              />
            </figure>
            <Link href={floorMatsHref}>
              <Button
                className="mt-4 font-display uppercase tracking-wider"
                data-testid="link-accessories-floor-mats"
              >
                Shop Floor Mats — ${floorMatsPrice}
              </Button>
            </Link>
          </div>

          <div className="rounded-2xl border border-primary/30 bg-secondary/40 p-6">
            <div className="mb-3 flex items-center gap-2 text-primary">
              <UtensilsCrossed className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Football Sports Edition
              </span>
            </div>
            <h2 className="font-display text-xl font-bold uppercase text-foreground">
              Team Cooking Boards
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Handmade NFL cutting boards with your team crest in colored resin.
              $50 each · 2 for $90 — buy now with one click.
            </p>
            <div
              className="mt-4 grid grid-cols-2 gap-3"
              data-testid="accessories-cutting-board-samples"
            >
              {CUTTING_BOARD_SAMPLE_PHOTOS.map((sample) => (
                <figure
                  key={sample.teamLogoId}
                  className="overflow-hidden rounded-xl border border-primary/25 bg-black/20"
                >
                  <img
                    src={sample.src}
                    alt={sample.alt}
                    className="aspect-[4/3] w-full object-cover"
                    loading="lazy"
                    data-testid={`img-accessories-board-${sample.teamLogoId}`}
                  />
                  <figcaption className="px-2 py-1.5 text-center text-[10px] font-bold uppercase tracking-wider text-primary">
                    {sample.teamName}
                  </figcaption>
                </figure>
              ))}
            </div>
            <Link href="/football-teams#cutting-boards">
              <Button className="mt-4 font-display uppercase tracking-wider" data-testid="link-football-cutting-boards">
                Shop Cutting Boards
              </Button>
            </Link>
          </div>

          <div className="rounded-2xl border border-primary/30 bg-secondary/40 p-6">
            <div className="mb-3 flex items-center gap-2 text-primary">
              <Trophy className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Sports Bundle
              </span>
            </div>
            <h2 className="font-display text-xl font-bold uppercase text-foreground">
              Game Day Bundle
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Team-logo car floor mats paired with a handmade cutting board.
              One flat ${gameDayBundlePriceDollars()} price with your team crest
              on both.
            </p>
            <figure className="mt-4 overflow-hidden rounded-xl border border-primary/25 bg-black/20">
              <img
                src={FLOOR_MATS_IMAGE}
                alt="Game Day Bundle — custom team-logo car floor mats"
                className="aspect-[4/3] w-full object-contain p-3"
                loading="lazy"
                data-testid="img-accessories-game-day-mats"
              />
            </figure>
            <Link href="/football-teams#game-day-bundle">
              <Button className="mt-4 font-display uppercase tracking-wider" data-testid="link-football-game-day-bundle">
                <Trophy className="mr-2 h-4 w-4" />
                Shop Game Day Bundle
              </Button>
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">Loading products...</div>
        ) : sortedProducts.length === 0 ? (
          <div
            className="text-center py-12 text-muted-foreground"
            data-testid="text-accessories-empty"
          >
            Products are temporarily unavailable. Please refresh this page.
          </div>
        ) : (
          <div
            id="custom-car-floor-mats"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 scroll-mt-24"
          >
            {sortedProducts.map((product: any) => (
              <ProductCard
                key={product.id}
                title={product.title}
                price={parseFloat(product.price)}
                category={product.category}
                image={product.imageUrl}
                priceId={product.priceId}
                soldOut={product.soldOut}
                description={product.description}
                logoOptions={product.logoOptions}
                handleColors={product.handleColors}
                caseType={product.caseType}
                sizes={product.sizes}
                apparelSizes={product.apparelSizes}
                colors={product.colors}
                soldOutColors={product.soldOutColors}
                scents={product.scents}
                variants={product.variants}
                imageFit={
                  product.imageUrl?.includes("kk_branded_logo_lighter") ||
                  product.imageUrl?.includes("kk_his_hers_watch") ||
                  product.imageUrl?.includes("kk_custom_car_floor_mats") ||
                  product.imageUrl?.includes("scented_candles_branded")
                    ? "contain"
                    : "cover"
                }
              />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

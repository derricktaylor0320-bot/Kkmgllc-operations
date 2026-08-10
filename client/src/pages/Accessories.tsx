import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import BrandSectionBanner from "@/components/BrandSectionBanner";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Car, Trophy, UtensilsCrossed } from "lucide-react";
import { groupProductVariants } from "@/lib/productVariants";
import { gameDayBundlePriceDollars } from "@shared/footballGameDayBundle";
import accessoriesSectionArt from "@assets/generated_images/kk_accessories_standalone_logo.png";

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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <BrandSectionBanner
          imageSrc={accessoriesSectionArt}
          imageAlt="Khomplete Khemistri Accessories — Apparel & Accessories"
          caption="Branded essentials for your lifestyle. Watches, duffle bags, tumblers, car floor mats, umbrellas, candles, and more."
        />

        <div className="mb-12 grid gap-6 md:grid-cols-2">
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
            <Link href="/football-teams#cutting-boards">
              <Button className="mt-4 font-display uppercase tracking-wider" data-testid="link-football-cutting-boards">
                Shop Cutting Boards
              </Button>
            </Link>
          </div>
          <div className="rounded-2xl border border-primary/30 bg-secondary/40 p-6">
            <div className="mb-3 flex items-center gap-2 text-primary">
              <Car className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Game Day Bundle
              </span>
            </div>
            <h2 className="font-display text-xl font-bold uppercase text-foreground">
              Floor Mats + Cooking Board
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Team-logo car floor mats paired with a handmade cutting board.
              One flat ${gameDayBundlePriceDollars()} price with your team crest
              on both.
            </p>
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
        ) : visibleProducts.length === 0 ? (
          <div
            className="text-center py-12 text-muted-foreground"
            data-testid="text-accessories-empty"
          >
            Products are temporarily unavailable. Please refresh this page.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {visibleProducts.map((product: any) => (
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
                  product.imageUrl?.includes("kk_custom_car_floor_mats")
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

import { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "wouter";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Minus, Plus, ShoppingCart, Check, AlertCircle } from "lucide-react";
import { allLogos } from "@/lib/logoCatalog";
import ShipStateTaxSummary, { useShipToState } from "@/components/ShipStateTaxSummary";
import { trackBeginCheckout } from "@/lib/analytics";
import { placementSurchargeDollars } from "@shared/customization";
import {
  GAME_DAY_BUNDLE_FEATURES,
  gameDayBundlePriceDollars,
  gameDayBundleSavingsDollars,
  NFL_GAME_DAY_BUNDLE_GARMENT_ID,
} from "@shared/footballGameDayBundle";
import {
  CUTTING_BOARD_FEATURES,
  CUTTING_BOARD_GARMENT_QUERY_PARAM,
  cuttingBoardTotalDollars,
  NFL_CUTTING_BOARD_GARMENT_ID,
} from "@shared/footballCuttingBoard";
import { FOOTBALL_SPORTS_EDITION_SECTION } from "@shared/footballTeams";

const MAX_CUTTING_BOARD_QTY = 10;

const garmentTypes = [
  { id: "short-sleeve", name: "Short Sleeve T-Shirt", basePrice: 30, category: "tops" },
  { id: "long-sleeve", name: "Long Sleeve T-Shirt", basePrice: 35, category: "tops" },
  { id: "pullover-hoodie", name: "Pullover Hoodie", basePrice: 50, category: "tops" },
  { id: "full-zip-hoodie", name: "Full-Zip Hoodie", basePrice: 50, category: "tops" },
  { id: "mens-jacket", name: "Men's Softshell Jacket", basePrice: 60, category: "tops" },
  { id: "jacket", name: "Women's Softshell Jacket", basePrice: 60, category: "tops" },
  { id: "jeans", name: "Personalized Custom Logo Jeans", basePrice: 57.48, category: "bottoms" },
  { id: "shorts", name: "Personalized Custom Logo Shorts", basePrice: 25, category: "bottoms" },
  { id: "bikini", name: "Personalized Custom Logo Bikini", basePrice: 25, category: "swimwear" },
  { id: "tumbler-20oz", name: "20oz Insulated Travel Tumbler", basePrice: 34.99, category: "accessories" },
  { id: "tumbler-30oz", name: "30oz Insulated Travel Tumbler", basePrice: 39.99, category: "accessories" },
  { id: "tumbler-40oz", name: "40oz Insulated Travel Tumbler", basePrice: 45, category: "accessories" },
  {
    id: NFL_CUTTING_BOARD_GARMENT_ID,
    name: "NFL Handmade Cutting Board",
    basePrice: 50,
    category: "cutting-board",
    footballOnly: true,
  },
  {
    id: NFL_GAME_DAY_BUNDLE_GARMENT_ID,
    name: "Game Day Bundle (Floor Mats + Cutting Board)",
    basePrice: gameDayBundlePriceDollars(),
    category: "game-day-bundle",
    footballOnly: true,
  },
];

const topPlacementOptions = [
  { id: "front-left-chest", name: "Left Chest", price: 0, dimensions: '3.5" – 4" wide' },
  { id: "front-right-chest", name: "Right Chest", price: 0, dimensions: '3.5" – 4" wide' },
  { id: "front-center-chest", name: "Center Chest", price: 0, dimensions: '10" – 12" wide' },
  { id: "left-sleeve", name: "Left Sleeve", price: 0, dimensions: '2.5" – 3.5" wide (icon size)' },
  { id: "right-sleeve", name: "Right Sleeve", price: 0, dimensions: '2.5" – 3.5" wide (icon size)' },
  { id: "back-large", name: "Large Back Print", price: 0, dimensions: '11" – 14" wide' },
];

const bottomPlacementOptions = [
  { id: "front-right-leg", name: "Right Leg (Front)", price: 0, dimensions: '4" – 5" wide' },
  { id: "front-left-leg", name: "Left Leg (Front)", price: 0, dimensions: '4" – 5" wide' },
  { id: "left-back-pocket", name: "Left Back Pocket", price: 0, dimensions: '3" – 3.5" wide' },
  { id: "right-back-pocket", name: "Right Back Pocket", price: 0, dimensions: '3" – 3.5" wide' },
];

const accessoryPlacementOptions = [
  { id: "tumbler-wrap", name: "Laser-Etched Logo", price: 0, dimensions: 'up to 3" wide' },
];

const swimwearPlacementOptions = [
  { id: "front-print", name: "Front Print", price: 0, dimensions: "full front panel" },
  { id: "all-over", name: "All-Over Print", price: 0, dimensions: "full set print" },
];

const TUMBLER_FEATURES = [
  "Double-wall vacuum insulation — keeps drinks cold 24+ hrs or hot 12 hrs",
  "Premium stainless steel with a scuff-resistant powder-coated finish",
  "Matching straw included",
  "Permanent, high-end laser-etched custom logo",
  "FREE shipping included",
];

const TUMBLER_40_FEATURES = [
  "Double-wall vacuum insulation — keeps drinks cold 24+ hrs or hot 12 hrs",
  "Premium stainless steel with a scuff-resistant powder-coated finish",
  "Ergonomic handle and matching straw",
  "Permanent, high-end laser-etched custom logo",
  "FREE shipping included",
];

const accessoryFeatures: Record<string, string[]> = {
  "tumbler-20oz": TUMBLER_FEATURES,
  "tumbler-30oz": TUMBLER_FEATURES,
  "tumbler-40oz": TUMBLER_40_FEATURES,
};

export default function LogoCustomizer() {
  const { logoId } = useParams<{ logoId: string }>();
  const [, setLocation] = useLocation();
  const [selectedGarment, setSelectedGarment] = useState<string>("");
  const [cuttingBoardQty, setCuttingBoardQty] = useState(1);
  const [selectedPlacements, setSelectedPlacements] = useState<string[]>(["front-left-chest"]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shipToState, setShipToState] = useShipToState();
  const { toast } = useToast();

  const logo = logoId ? allLogos[logoId] : null;
  const isFootballLogo = logo?.section === FOOTBALL_SPORTS_EDITION_SECTION;
  const availableGarments = garmentTypes.filter(
    (g) => !g.footballOnly || isFootballLogo,
  );
  const backHref =
    logo?.section === FOOTBALL_SPORTS_EDITION_SECTION
      ? "/football-teams"
      : "/canvas";
  const backLabel =
    logo?.section === FOOTBALL_SPORTS_EDITION_SECTION
      ? "Back to Football Sports Edition"
      : "Back to Logo Collection";
  
  const selectedGarmentData = availableGarments.find(g => g.id === selectedGarment);
  const isCuttingBoard = selectedGarmentData?.category === "cutting-board";
  const isGameDayBundle = selectedGarmentData?.category === "game-day-bundle";
  const isSpecialFootballOrder = isCuttingBoard || isGameDayBundle;
  const orderSummaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const garmentParam = params.get(CUTTING_BOARD_GARMENT_QUERY_PARAM);
    if (logo?.section !== FOOTBALL_SPORTS_EDITION_SECTION) return;

    if (
      garmentParam === NFL_CUTTING_BOARD_GARMENT_ID ||
      garmentParam === NFL_GAME_DAY_BUNDLE_GARMENT_ID
    ) {
      setSelectedGarment(garmentParam);
      if (garmentParam === NFL_CUTTING_BOARD_GARMENT_ID) {
        setCuttingBoardQty(1);
      }
      window.requestAnimationFrame(() => {
        orderSummaryRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    }
  }, [logoId, logo?.section]);
  const placementOptions =
    selectedGarmentData?.category === "bottoms"
      ? bottomPlacementOptions
      : selectedGarmentData?.category === "accessories"
        ? accessoryPlacementOptions
        : selectedGarmentData?.category === "swimwear"
          ? swimwearPlacementOptions
          : topPlacementOptions;

  if (!logo) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-display font-bold mb-4">Logo Not Found</h1>
            <Button onClick={() => setLocation("/canvas")} data-testid="button-back-to-canvas">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Logo Collection
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handlePlacementChange = (placementId: string, checked: boolean) => {
    if (checked) {
      setSelectedPlacements([...selectedPlacements, placementId]);
    } else {
      if (selectedPlacements.length > 1) {
        setSelectedPlacements(selectedPlacements.filter(p => p !== placementId));
      }
    }
  };

  const calculatePrice = () => {
    const garment = availableGarments.find(g => g.id === selectedGarment);
    if (!garment) return 0;

    if (garment.category === "cutting-board") {
      return cuttingBoardTotalDollars(cuttingBoardQty);
    }

    if (garment.category === "game-day-bundle") {
      return gameDayBundlePriceDollars();
    }

    let price = garment.basePrice;
    price += placementSurchargeDollars(selectedPlacements.length);
    return price;
  };

  const defaultPlacementFor = (category?: string) => {
    if (category === "bottoms") return "front-right-leg";
    if (category === "accessories") return "tumbler-wrap";
    if (category === "swimwear") return "front-print";
    return "front-left-chest";
  };

  const handleGarmentChange = (value: string) => {
    const newGarment = availableGarments.find((g) => g.id === value);
    const prevCategory = selectedGarmentData?.category;
    const nextCategory = newGarment?.category;
    setSelectedGarment(value);
    if (nextCategory === "cutting-board") {
      setCuttingBoardQty(1);
    }
    if (prevCategory !== nextCategory && !isSpecialFootballCategory(nextCategory)) {
      setSelectedPlacements([defaultPlacementFor(nextCategory)]);
    }
  };

  const isSpecialFootballCategory = (category?: string) =>
    category === "cutting-board" || category === "game-day-bundle";

  const handleCheckout = async () => {
    setError(null);
    
    if (!selectedGarment) {
      setError("Please select a garment type");
      toast({
        title: "Selection Required",
        description: "Please choose a garment type before proceeding to checkout.",
        variant: "destructive",
      });
      return;
    }

    if (!shipToState) {
      setError("Please select the state your order ships to so we can calculate sales tax.");
      toast({
        title: "Shipping State Required",
        description: "Choose the state your order ships to so we can calculate sales tax.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const garment = availableGarments.find(g => g.id === selectedGarment);
      const placements = isSpecialFootballOrder
        ? isGameDayBundle
          ? "Team crest on floor mats and cutting board"
          : "Team crest embedded in board design"
        : selectedPlacements.map(p => {
            const opt = placementOptions.find(opt => opt.id === p);
            return opt ? `${opt.name} (${opt.dimensions})` : "";
          }).filter(Boolean).join(" + ");
      
      const response = await fetch("/api/create-custom-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          logoId,
          logoName: logo.color,
          garmentType: garment?.name,
          garmentId: selectedGarment,
          placements: isSpecialFootballOrder ? ["team-design"] : selectedPlacements,
          placementDescription: placements,
          quantity: isCuttingBoard ? cuttingBoardQty : 1,
          totalPrice: calculatePrice() * 100,
          shipToState,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(errorData.error || "Failed to create checkout session");
      }
      
      const data = await response.json();
      if (data.url) {
        const checkoutValue = calculatePrice();
        trackBeginCheckout(
          [
            {
              item_id: selectedGarment || logoId || "custom-garment",
              item_name: `${logo.color} — ${garment?.name || "Custom garment"}`,
              price: checkoutValue,
              quantity: isCuttingBoard ? cuttingBoardQty : 1,
              item_category: garment?.category || "custom",
            },
          ],
          checkoutValue,
        );
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(errorMessage);
      toast({
        title: "Checkout Error",
        description: errorMessage,
        variant: "destructive",
      });
      console.error("Checkout error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <Button 
            variant="ghost" 
            onClick={() => setLocation(backHref)}
            className="mb-8"
            data-testid="button-back-to-collection"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> {backLabel}
          </Button>

          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <Card className="overflow-hidden bg-secondary">
                <CardContent className="p-8">
                  <div className="aspect-square relative bg-black/20 rounded-lg overflow-hidden">
                    <img 
                      src={logo.src} 
                      alt={logo.alt}
                      className="w-full h-full object-contain p-4"
                      data-testid={`img-selected-logo-${logoId}`}
                    />
                  </div>
                </CardContent>
              </Card>
              <div className="text-center">
                <span className="text-primary font-mono text-sm">#{logoId}</span>
                <h2 className="text-2xl font-display font-bold uppercase mt-1">{logo.color}</h2>
                <p className="text-muted-foreground">{logo.section}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div>
                <h1 className="text-4xl font-display font-bold uppercase mb-2">
                  Customize Your{" "}
                  <span className="text-primary">
                    {isFootballLogo ? "Team Gear" : "Apparel"}
                  </span>
                </h1>
                <p className="text-muted-foreground">
                  {isFootballLogo
                    ? "Select apparel, accessories, or a handmade NFL cutting board below."
                    : "Select your garment type and placement options below."}
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-display font-bold uppercase">
                  1. Choose Your Garment
                </h3>
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-3 font-semibold uppercase tracking-wide">Tops</p>
                  <RadioGroup 
                    value={selectedGarment} 
                    onValueChange={handleGarmentChange}
                    className="grid gap-3"
                  >
                    {availableGarments.filter(g => g.category === "tops").map((garment) => (
                      <div key={garment.id} className="flex items-center">
                        <RadioGroupItem 
                          value={garment.id} 
                          id={garment.id}
                          className="peer sr-only"
                          data-testid={`radio-garment-${garment.id}`}
                        />
                        <Label
                          htmlFor={garment.id}
                          className="flex items-center justify-between w-full p-4 bg-secondary rounded-lg border-2 border-transparent peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 cursor-pointer transition-all hover:bg-secondary/80"
                        >
                          <span className="font-medium">{garment.name}</span>
                          <span className="text-primary font-bold">${garment.basePrice}</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-3 font-semibold uppercase tracking-wide">Jeans</p>
                  <RadioGroup 
                    value={selectedGarment} 
                    onValueChange={handleGarmentChange}
                    className="grid gap-3"
                  >
                    {availableGarments.filter(g => g.category === "bottoms").map((garment) => (
                      <div key={garment.id} className="flex items-center">
                        <RadioGroupItem 
                          value={garment.id} 
                          id={garment.id}
                          className="peer sr-only"
                          data-testid={`radio-garment-${garment.id}`}
                        />
                        <Label
                          htmlFor={garment.id}
                          className="flex items-center justify-between w-full p-4 bg-secondary rounded-lg border-2 border-transparent peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 cursor-pointer transition-all hover:bg-secondary/80"
                        >
                          <span className="font-medium">{garment.name}</span>
                          <span className="text-primary font-bold">${garment.basePrice}</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-3 font-semibold uppercase tracking-wide">Swimwear</p>
                  <RadioGroup
                    value={selectedGarment}
                    onValueChange={handleGarmentChange}
                    className="grid gap-3"
                  >
                    {availableGarments.filter(g => g.category === "swimwear").map((garment) => (
                      <div key={garment.id} className="flex items-center">
                        <RadioGroupItem
                          value={garment.id}
                          id={garment.id}
                          className="peer sr-only"
                          data-testid={`radio-garment-${garment.id}`}
                        />
                        <Label
                          htmlFor={garment.id}
                          className="flex items-center justify-between w-full p-4 bg-secondary rounded-lg border-2 border-transparent peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 cursor-pointer transition-all hover:bg-secondary/80"
                        >
                          <span className="font-medium">{garment.name}</span>
                          <span className="text-primary font-bold">${garment.basePrice}</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-3 font-semibold uppercase tracking-wide">Accessories</p>
                  <RadioGroup
                    value={selectedGarment}
                    onValueChange={handleGarmentChange}
                    className="grid gap-3"
                  >
                    {availableGarments.filter(g => g.category === "accessories").map((garment) => (
                      <div key={garment.id} className="flex items-center">
                        <RadioGroupItem
                          value={garment.id}
                          id={garment.id}
                          className="peer sr-only"
                          data-testid={`radio-garment-${garment.id}`}
                        />
                        <Label
                          htmlFor={garment.id}
                          className="flex items-center justify-between w-full p-4 bg-secondary rounded-lg border-2 border-transparent peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 cursor-pointer transition-all hover:bg-secondary/80"
                        >
                          <span className="font-medium">{garment.name}</span>
                          <span className="text-primary font-bold">${garment.basePrice}</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                {isFootballLogo && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-3 font-semibold uppercase tracking-wide">
                      Game Day Kitchen
                    </p>
                    <RadioGroup
                      value={selectedGarment}
                      onValueChange={handleGarmentChange}
                      className="grid gap-3"
                    >
                      {availableGarments
                        .filter((g) => g.category === "cutting-board")
                        .map((garment) => (
                          <div key={garment.id} className="flex items-center">
                            <RadioGroupItem
                              value={garment.id}
                              id={garment.id}
                              className="peer sr-only"
                              data-testid={`radio-garment-${garment.id}`}
                            />
                            <Label
                              htmlFor={garment.id}
                              className="flex items-center justify-between w-full p-4 bg-secondary rounded-lg border-2 border-transparent peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 cursor-pointer transition-all hover:bg-secondary/80"
                            >
                              <span className="font-medium">{garment.name}</span>
                              <span className="text-right">
                                <span className="block text-primary font-bold">$50</span>
                                <span className="block text-[10px] uppercase tracking-wider text-muted-foreground">
                                  2 for $90
                                </span>
                              </span>
                            </Label>
                          </div>
                        ))}
                    </RadioGroup>
                  </div>
                )}
                {isFootballLogo && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-3 font-semibold uppercase tracking-wide">
                      Game Day Bundle
                    </p>
                    <RadioGroup
                      value={selectedGarment}
                      onValueChange={handleGarmentChange}
                      className="grid gap-3"
                    >
                      {availableGarments
                        .filter((g) => g.category === "game-day-bundle")
                        .map((garment) => (
                          <div key={garment.id} className="flex items-center">
                            <RadioGroupItem
                              value={garment.id}
                              id={garment.id}
                              className="peer sr-only"
                              data-testid={`radio-garment-${garment.id}`}
                            />
                            <Label
                              htmlFor={garment.id}
                              className="flex items-center justify-between w-full p-4 bg-secondary rounded-lg border-2 border-transparent peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 cursor-pointer transition-all hover:bg-secondary/80"
                            >
                              <span className="font-medium">{garment.name}</span>
                              <span className="text-right">
                                <span className="block text-primary font-bold">
                                  ${garment.basePrice}
                                </span>
                                <span className="block text-[10px] uppercase tracking-wider text-muted-foreground">
                                  Save ${gameDayBundleSavingsDollars()}
                                </span>
                              </span>
                            </Label>
                          </div>
                        ))}
                    </RadioGroup>
                  </div>
                )}
              </div>

              {isGameDayBundle && (
                <div className="space-y-4" data-testid="game-day-bundle-options">
                  <h3 className="text-xl font-display font-bold uppercase">
                    2. Bundle Includes
                  </h3>
                  <div className="space-y-2 rounded-lg bg-secondary p-4">
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                      {GAME_DAY_BUNDLE_FEATURES.map((feature, i) => (
                        <li key={i}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {isCuttingBoard && (
                <div className="space-y-4" data-testid="cutting-board-options">
                  <h3 className="text-xl font-display font-bold uppercase">
                    2. Choose Quantity
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    $50 per board — grab two for $90. Each board features your
                    team crest in a handcrafted hardwood design.
                  </p>
                  <div className="flex items-center gap-4 rounded-lg bg-secondary p-4">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      disabled={cuttingBoardQty <= 1}
                      onClick={() => setCuttingBoardQty((q) => Math.max(1, q - 1))}
                      aria-label="Decrease quantity"
                      data-testid="button-cutting-board-qty-decrease"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span
                      className="min-w-[3ch] text-center text-2xl font-display font-bold"
                      data-testid="text-cutting-board-qty"
                    >
                      {cuttingBoardQty}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      disabled={cuttingBoardQty >= MAX_CUTTING_BOARD_QTY}
                      onClick={() =>
                        setCuttingBoardQty((q) =>
                          Math.min(MAX_CUTTING_BOARD_QTY, q + 1),
                        )
                      }
                      aria-label="Increase quantity"
                      data-testid="button-cutting-board-qty-increase"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      {cuttingBoardQty === 2
                        ? "Pair price applied — $90"
                        : cuttingBoardQty > 2
                          ? "Bundle pricing applied"
                          : "$50 each"}
                    </span>
                  </div>
                  <div className="space-y-2 rounded-lg bg-secondary p-4">
                    <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                      Handmade Details
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                      {CUTTING_BOARD_FEATURES.map((feature, i) => (
                        <li key={i}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {selectedGarment && accessoryFeatures[selectedGarment] && (
                <div className="space-y-2 rounded-lg bg-secondary p-4" data-testid="accessory-features">
                  <p className="text-sm font-semibold uppercase tracking-wide text-primary">Premium Features</p>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                    {accessoryFeatures[selectedGarment].map((feature, i) => (
                      <li key={i} data-testid={`feature-${i}`}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}

              {!isSpecialFootballOrder && (
              <div className="space-y-4">
                <h3 className="text-xl font-display font-bold uppercase">
                  2. Select Logo Placement
                </h3>
                <p className="text-sm text-muted-foreground">
                  {selectedGarmentData?.category === "accessories"
                    ? "Your logo will be laser-etched in the position shown below."
                    : selectedGarmentData?.category === "swimwear"
                      ? "One print style is included. Selecting multiple print styles adds $3."
                      : "One placement is included. Selecting multiple placements adds $3."}
                </p>
                <div className="space-y-3">
                  {placementOptions.map((placement) => (
                    <div 
                      key={placement.id}
                      className={`flex items-center space-x-3 p-4 bg-secondary rounded-lg border-2 transition-all ${
                        selectedPlacements.includes(placement.id) 
                          ? 'border-primary bg-primary/10' 
                          : 'border-transparent'
                      }`}
                    >
                      <Checkbox
                        id={placement.id}
                        checked={selectedPlacements.includes(placement.id)}
                        onCheckedChange={(checked) => handlePlacementChange(placement.id, checked as boolean)}
                        data-testid={`checkbox-placement-${placement.id}`}
                      />
                      <Label htmlFor={placement.id} className="flex-grow cursor-pointer">
                        <span className="block font-medium">{placement.name}</span>
                        <span className="block text-xs text-muted-foreground" data-testid={`text-dimensions-${placement.id}`}>
                          Print size: {placement.dimensions}
                        </span>
                      </Label>
                      {selectedPlacements.includes(placement.id) && (
                        <Check className="h-5 w-5 text-primary" />
                      )}
                    </div>
                  ))}
                </div>
                {selectedPlacements.length > 1 && (
                  <p className="text-sm text-primary font-medium">
                    +$3 multiple-placement fee
                  </p>
                )}
              </div>
              )}

              <Card
                ref={orderSummaryRef}
                id="custom-order-summary"
                className="bg-primary/10 border-primary/30 scroll-mt-24"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-medium">Your Custom Order</span>
                    <span className="text-3xl font-display font-bold text-primary">
                      ${calculatePrice()}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1 mb-6">
                    <p>Logo: #{logoId} - {logo.color}</p>
                    {selectedGarment && (
                      <p>
                        Item: {availableGarments.find(g => g.id === selectedGarment)?.name}
                        {isCuttingBoard ? ` × ${cuttingBoardQty}` : ""}
                      </p>
                    )}
                    {!isSpecialFootballOrder && (
                    <p>Placement: {selectedPlacements.map(p => 
                      placementOptions.find(opt => opt.id === p)?.name
                    ).join(" + ")}</p>
                    )}
                    {isCuttingBoard && (
                      <p>Design: Team crest embedded in board</p>
                    )}
                    {isGameDayBundle && (
                      <p>Design: Team crest on floor mats and cutting board</p>
                    )}
                    {!isSpecialFootballOrder && selectedPlacements.map(p => {
                      const opt = placementOptions.find(opt => opt.id === p);
                      return opt ? (
                        <p key={p} className="text-xs pl-2" data-testid={`summary-dimensions-${opt.id}`}>
                          • {opt.name}: {opt.dimensions}
                        </p>
                      ) : null;
                    })}
                  </div>
                  <div className="mb-6">
                    <ShipStateTaxSummary
                      subtotal={calculatePrice()}
                      state={shipToState}
                      onStateChange={(code) => {
                        setShipToState(code);
                        setError(null);
                      }}
                    />
                  </div>
                  {!selectedGarment && (
                    <div className="flex items-center gap-2 text-sky-400 text-sm mb-4" data-testid="warning-select-garment">
                      <AlertCircle className="h-4 w-4" />
                      <span>Please select a garment type above</span>
                    </div>
                  )}
                  {error && (
                    <div className="flex items-center gap-2 text-destructive text-sm mb-4" data-testid="error-message">
                      <AlertCircle className="h-4 w-4" />
                      <span>{error}</span>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mb-4 leading-relaxed" data-testid="text-customization-disclaimer">
                    Please note that the final product's appearance, especially for custom
                    embroidery or logos, may vary slightly from the digital representation
                    due to the customization process.
                  </p>
                  <Button 
                    className="w-full" 
                    size="lg"
                    disabled={!selectedGarment || isSubmitting}
                    onClick={handleCheckout}
                    data-testid="button-proceed-to-checkout"
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    {isSubmitting
                      ? "Processing..."
                      : isCuttingBoard
                        ? "Buy Now — Cutting Board"
                        : isGameDayBundle
                          ? "Buy Now — Game Day Bundle"
                          : "Proceed to Checkout"}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

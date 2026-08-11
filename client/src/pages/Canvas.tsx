import { motion } from "framer-motion";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import royaltyBadgeSectionArt from "@assets/brand/versatile_royalty_badge_of_honor_section.png";
import canvasCollectionSectionArt from "@assets/brand/versatile_canvas_collection_section.png";
import armoredShieldSectionArt from "@assets/brand/versatile_armored_shield_section.png";

// Canvas Collection — color logos 100-117
import logoGold3D from "@assets/Screenshot_20251126_202749_Photos_1764207404143.jpg";
import logoBlueWhite from "@assets/Screenshot_20251126_202727_Photos_1764207404154.jpg";
import logoBlackWhite from "@assets/Screenshot_20251126_202703_Photos_1764207404162.jpg";
import logoRedBlack from "@assets/image000004_1764207404172.jpg";
import logoBWInverted from "@assets/image000005_1764207404180.jpg";
import logoPinkBlack from "@assets/image000006_1764207404188.jpg";
import logoGoldWhite from "@assets/Screenshot_20250423_101841_Drive_1764207404197.jpg";
import logoLightBlue from "@assets/image000008_1764207404205.jpg";
import logoGreyWhite from "@assets/image000007_1764207404213.jpg";
import logoForestGreen from "@assets/logo_forest_green.jpg";
import logoDeepPurple from "@assets/logo_deep_purple.jpg";
import logoBlackGoldCircle from "@assets/logo_black_gold.jpg";
import logoOrange from "@assets/logo_orange.jpg";
import logoBrownGold from "@assets/logo_brown_gold.jpg";
import logoTeal from "@assets/logo_teal.jpg";
import logoLimeGreen from "@assets/logo_lime_green.jpg";
import logoMasterpieceTrident from "@assets/logo_masterpiece_trident_three.png";
import medallionCorePrinciples from "@assets/copilot_image_1781210586301_1781211927468.jpeg";

// Badge of Honor Collection — crests 200-228 + Female Logos 229-235, 240 + Founders Crest II 239
import shieldBlackWhite from "@assets/Screenshot_20251126_205145_Photos_1764208360832.jpg";
import shieldBlueGold from "@assets/Screenshot_20251126_205125_Photos_1764208373884.jpg";
import crestBlueValuesSwords from "@assets/image000009_1781214860404.jpg";
import shieldGoldBrown from "@assets/Screenshot_20251126_205108_Photos_1764208382966.jpg";
import shieldCyanGold from "@assets/Screenshot_20251126_204843_Photos_1764208390801.jpg";
import badgeBlueValues from "@assets/copilot_image_1781211230575_1781211851159.jpeg";
import crestGoldApparel from "@assets/1781208988886_1781211764006.png";
import shieldSilver from "@assets/Screenshot_20251126_205037_Photos_1764217995547.jpg";
import badgeBrownGoldOrnate from "@assets/badge_brown_gold_ornate.jpg";
import badgePurpleOrnate from "@assets/badge_purple_ornate.jpg";
import badgeNavySilver from "@assets/badge_navy_silver.jpg";
import badgeNavyGold from "@assets/1784461717502.png";
import badgePurpleSwords from "@assets/badge_purple_swords.jpg";
import badgeGreenSwords from "@assets/badge_green_swords.jpg";
import badgeRedGoldSwords from "@assets/badge_red_gold_swords.jpg";
import badgeEaglesBlackWhite from "@assets/1785107268075.png";
import badgeEaglesNavyGold from "@assets/1785106550052.png";
import badgeEaglesPurpleGold from "@assets/1785106948168.png";
import badgeEaglesBrownGold from "@assets/1785106800127.png";
import badgeEaglesRedGold from "@assets/1785106870967.png";
import badgeEaglesBurgundyGold from "@assets/1785107423638.png";
import badgeEaglesSilverGold from "@assets/1785107065086.png";
import badgeEaglesAllGold from "@assets/1785107130184.png";

// Shield of Honor Collection — eagle shields 300-308
import honorBrownGold from "@assets/1764209713521_1764218036651.jpg";
import honorSilverGold from "@assets/1764210798224_1764211139124.jpg";
import honorNavyGold from "@assets/1764210111747_1764211158691.jpg";
import honorBlackGold from "@assets/1764209965710_1764211158709.jpg";
import honorMaroonGold from "@assets/1764209907665_1764211158717.jpg";
import honorNavySilver from "@assets/1764209634941_1764211158726.jpg";
import honorAllGold from "@assets/1764210327974_1764211486802.jpg";
import honorPurpleGold from "@assets/shield_purple_gold.jpg";
import honorWhiteGold from "@assets/shield_white_gold.jpg";

// Import Legacy Collage
import legacyCollage from "@assets/Screenshot_20251126_202634_Photos_1764214454254.jpg";

// Import KKMG LLC Eagle Shield (#218) — silver/blue chrome values crest
import kkmgEagleShield from "@assets/masculine/logo_kkmg_eagle_shield.png";

// Import Apparel Eagle Crest (#219) + eagle crests (#220-227)
// + Consolidatus Empire standalone eagle crest (#228)
import eagleCrestMaroonGold from "@assets/IMG_20260628_234856_1782729067418.png";
import badgeConsolidatusEmpireStandalone from "@assets/badge_consolidatus_empire_standalone_218.png";
import logoKkElementsBadge from "@assets/logo_kk_elements_badge.png";
import logoKkApparelLeatherCrest from "@assets/logo_kk_apparel_leather_swords_crest.png";
import badgeConsolidatusNavySilver from "@assets/brand/consolidatus_empire_crest_navy_silver.png";
import badgeConsolidatusCharcoalPurple from "@assets/brand/consolidatus_empire_crest_charcoal_purple.png";
import badgeConsolidatusGoldBrown from "@assets/brand/consolidatus_empire_crest_gold_brown.png";


// Accessory logos — Canvas Collection (118) + Badge of Honor crossed swords (215-216)
// + Shield of Honor (309-310)
import logoAccessoriesEagle from "@assets/generated_images/logo_accessories_eagle_burgundy_gold.png";
import logoCrossedSwords from "@assets/generated_images/crossed_swords_kk_logo.png";
import logoKKShieldSwords from "@assets/generated_images/kk_shield_with_swords.png";
import logoKKACrossedSwords from "@assets/generated_images/kka_crossed_swords_logo.png";
import logoPrideRainbow from "@assets/1781582068026_1781668463902.png";
import logoKKAShield from "@assets/kka_shield_apparel_logo.jpg";
import logoFoundersTrident from "@assets/logo_founders_trident_three.jpg";

// Compass Collection — 400-403
import compassKKApparel from "@assets/copilot_image_1781366430242_1781369724345.jpeg";
import compassKMG1 from "@assets/image_1781365445486_1781369761822.jpeg";
import compassKMG2 from "@assets/image_1781365494182_1781369761833.jpeg";
import compassSunburst from "@assets/1781351981898_1781369761839.png";
import logoGoldenEagle from "@assets/generated_images/logo_golden_eagle_circular.png";
import logoSilverPinkFeminine from "@assets/logo_silver_pink_feminine_medallion.png";
import logoKkElementsEmbroidered from "@assets/feminine/logo_kk_elements_embroidered_crest.png";
import logoPearlGriffinBlueDenim from "@assets/feminine/logo_pearl_griffin_blue_denim.png";
import logoPearlGriffinGrey from "@assets/feminine/logo_pearl_griffin_grey.png";
import logoPearlGriffinTieDye from "@assets/feminine/logo_pearl_griffin_tie_dye.png";
import logoPearlGriffinCottonCandy from "@assets/feminine/logo_pearl_griffin_cotton_candy.png";
import logoPearlGriffinPurple from "@assets/feminine/logo_pearl_griffin_purple.png";
import logoPearlGriffinNavy from "@assets/feminine/logo_pearl_griffin_navy.png";
import logoPearlGriffinRedGold from "@assets/feminine/logo_pearl_griffin_red_gold.png";
import logoFoundersCrestII from "@assets/masculine/logo_founders_crest_ii_blue_gold.png";
import logoFeminineEdHardyCrest from "@assets/feminine/logo_feminine_ed_hardy_crest.png";

export default function Canvas() {
  const logos = [
    { id: "100", src: logoGold3D, alt: "Gold 3D Emblem", color: "Gold 3D" },
    { id: "101", src: logoGoldWhite, alt: "Gold & White Emblem", color: "Gold & White" },
    { id: "102", src: logoBlackWhite, alt: "Classic Black & White", color: "Black & White" },
    { id: "103", src: logoBWInverted, alt: "Inverted Black & White", color: "Inverted B&W" },
    { id: "104", src: logoRedBlack, alt: "Red & Black Strike", color: "Red & Black" },
    { id: "105", src: logoBlueWhite, alt: "Royal Blue Emblem", color: "Royal Blue" },
    { id: "106", src: logoLightBlue, alt: "Sky Blue Emblem", color: "Sky Blue" },
    { id: "107", src: logoPinkBlack, alt: "Neon Pink Emblem", color: "Neon Pink" },
    { id: "108", src: logoGreyWhite, alt: "Slate Grey Emblem", color: "Slate Grey" },
    { id: "109", src: logoForestGreen, alt: "Forest Green Emblem", color: "Forest Green" },
    { id: "110", src: logoDeepPurple, alt: "Deep Purple Emblem", color: "Deep Purple" },
    { id: "111", src: logoBlackGoldCircle, alt: "Black & Gold Emblem", color: "Black & Gold" },
    { id: "112", src: logoOrange, alt: "Orange Emblem", color: "Orange" },
    { id: "113", src: logoBrownGold, alt: "Brown & Gold Emblem", color: "Brown & Gold" },
    { id: "114", src: logoTeal, alt: "Teal Emblem", color: "Teal" },
    { id: "115", src: logoLimeGreen, alt: "Lime Green Emblem", color: "Lime Green" },
    { id: "116", src: logoMasterpieceTrident, alt: "Masterpiece Trident Three Crest - D. Taylor, C. Oliver, J. Young Jr.", color: "Masterpiece Trident" },
    { id: "117", src: medallionCorePrinciples, alt: "10 Core Principles Medallion", color: "Core Principles Medallion" },
    { id: "118", src: logoAccessoriesEagle, alt: "Khomplete Khemistri Apparel & Accessories Eagle", color: "Maroon & Gold Eagle" },
    { id: "121", src: logoPrideRainbow, alt: "Khomplete Khemistri Apparel Pride Rainbow Crest", color: "Pride Rainbow" },
    { id: "122", src: logoFoundersTrident, alt: "Founders' Trident Three Crest - D. Taylor, C. Oliver, J. Young Jr.", color: "Founders' Trident" },
    { id: "123", src: logoGoldenEagle, alt: "Golden Eagle Circular Emblem", color: "Golden Eagle Circular" },
    { id: "124", src: logoKkElementsBadge, alt: "Khomplete Khemistri Elements Golden Shield", color: "Elements Golden Shield" },
    { id: "125", src: logoSilverPinkFeminine, alt: "Khomplete Khemistri Apparel Silver & Pink Feminine Medallion", color: "Silver & Pink" },
    { id: "126", src: logoKkElementsEmbroidered, alt: "Khomplete Khemistri Elements Embroidered Crest", color: "Elements Embroidered Crest" },
  ];

  // Female Logos — pearl-crown griffin crests belong to Royalty Badge of Honor
  // (not the circular Canvas Collection).
  const femaleBadges = [
    { id: "229", src: logoPearlGriffinBlueDenim, alt: "Khomplete Khemistri Apparel & Accessories Pearl Griffin Crest - Blue Denim", color: "Pearl Griffin Blue Denim" },
    { id: "230", src: logoPearlGriffinGrey, alt: "Khomplete Khemistri Apparel & Accessories Pearl Griffin Crest - Grey", color: "Pearl Griffin Grey" },
    { id: "231", src: logoPearlGriffinTieDye, alt: "Khomplete Khemistri Apparel & Accessories Pearl Griffin Crest - Tie-Dye", color: "Pearl Griffin Tie-Dye" },
    { id: "232", src: logoPearlGriffinCottonCandy, alt: "Khomplete Khemistri Apparel & Accessories Pearl Griffin Crest - Cotton Candy", color: "Pearl Griffin Cotton Candy" },
    { id: "233", src: logoPearlGriffinPurple, alt: "Khomplete Khemistri Apparel & Accessories Pearl Griffin Crest - Purple", color: "Pearl Griffin Purple" },
    { id: "234", src: logoPearlGriffinNavy, alt: "Khomplete Khemistri Apparel & Accessories Pearl Griffin Crest - Navy", color: "Pearl Griffin Navy" },
    { id: "235", src: logoPearlGriffinRedGold, alt: "Khomplete Khemistri Apparel & Accessories Pearl Griffin Crest - Red & Gold", color: "Pearl Griffin Red & Gold" },
    { id: "240", src: logoFeminineEdHardyCrest, alt: "Khomplete Khemistri Apparel Feminine Ornate Eagle Crest - Ed Hardy Style Est. 2020", color: "Feminine Ed Hardy Crest" },
  ];

  const badges = [
    { id: "200", src: badgeBlueValues, alt: "Blue & Gold Values Crest - Friendship, Trust, Harmony", color: "Blue Values Crest", featured: true },
    { id: "201", src: logoKkApparelLeatherCrest, alt: "Khomplete Khemistri Apparel Leather Swords Crest", color: "Apparel Leather Swords Crest", featured: true },
    { id: "202", src: shieldBlueGold, alt: "Royal Blue & Gold Crest", color: "Royal Blue & Gold" },
    { id: "203", src: crestBlueValuesSwords, alt: "Khomplete Khemistri Apparel Crest - Unity, Strength, Brotherhood, Entrepreneurship, Harmony", color: "Blue Apparel Crest", featured: true },
    { id: "204", src: shieldGoldBrown, alt: "Classic Gold Crest", color: "Classic Gold" },
    { id: "205", src: shieldSilver, alt: "Silver Elite Crest", color: "Silver Elite" },
    { id: "206", src: shieldCyanGold, alt: "Cyan & Gold Crest", color: "Cyan & Gold" },
    { id: "207", src: shieldBlackWhite, alt: "Monochrome Crest", color: "Monochrome" },
    { id: "208", src: badgeBrownGoldOrnate, alt: "Brown & Gold Ornate Crest", color: "Brown & Gold Ornate" },
    { id: "209", src: badgePurpleOrnate, alt: "Purple Ornate Crest", color: "Purple Ornate" },
    { id: "210", src: badgeNavySilver, alt: "Navy & Silver Crest", color: "Navy & Silver" },
    { id: "211", src: badgeNavyGold, alt: "Navy & Gold Crest", color: "Navy & Gold", featured: true },
    { id: "212", src: badgePurpleSwords, alt: "Purple with Swords", color: "Purple Swords" },
    { id: "213", src: badgeGreenSwords, alt: "Green with Swords", color: "Emerald Swords" },
    { id: "214", src: badgeRedGoldSwords, alt: "Red & Gold with Swords", color: "Red & Gold Swords" },
    { id: "215", src: logoCrossedSwords, alt: "Crossed Swords with Khomplete Khemistri", color: "Crossed Swords", featured: true },
    { id: "216", src: logoKKACrossedSwords, alt: "KKA Crossed Swords Logo", color: "KKA Swords", featured: true },
    { id: "217", src: crestGoldApparel, alt: "Khomplete Khemistri Apparel Gold Crest", color: "Gold Apparel Crest", featured: true },
    { id: "218", src: kkmgEagleShield, alt: "Khomplete Khemistri Apparel Silver & Blue Values Eagle Shield", color: "Silver & Blue Values Eagle", featured: true },
    { id: "219", src: eagleCrestMaroonGold, alt: "Apparel Eagle Crest - Maroon & Gold", color: "Maroon & Gold Eagle Crest", featured: true },
    { id: "220", src: badgeEaglesBlackWhite, alt: "Khomplete Khemistri Apparel & Accessories Eagle Crest - Black & White Est. 2020", color: "Black & White Eagles", featured: true },
    { id: "221", src: badgeEaglesNavyGold, alt: "Khomplete Khemistri Apparel & Accessories Eagle Crest - Navy & Gold Est. 2020", color: "Navy & Gold Eagles", featured: true },
    { id: "222", src: badgeEaglesPurpleGold, alt: "Khomplete Khemistri Apparel & Accessories Eagle Crest - Purple & Gold", color: "Purple & Gold Eagles", featured: true },
    { id: "223", src: badgeEaglesBrownGold, alt: "Khomplete Khemistri Apparel & Accessories Eagle Crest - Brown & Gold", color: "Brown & Gold Eagles", featured: true },
    { id: "224", src: badgeEaglesRedGold, alt: "Khomplete Khemistri Apparel & Accessories Eagle Crest - Red & Gold", color: "Red & Gold Eagles", featured: true },
    { id: "225", src: badgeEaglesBurgundyGold, alt: "Khomplete Khemistri Apparel & Accessories Eagle Crest - Burgundy & Gold", color: "Burgundy & Gold Eagles", featured: true },
    { id: "226", src: badgeEaglesSilverGold, alt: "Khomplete Khemistri Apparel & Accessories Eagle Crest - Silver & Gold", color: "Silver & Gold Eagles", featured: true },
    { id: "227", src: badgeEaglesAllGold, alt: "Khomplete Khemistri Apparel & Accessories Eagle Crest - All Gold", color: "All Gold Eagles", featured: true },
    { id: "228", src: badgeConsolidatusEmpireStandalone, alt: "The Consolidatus Empire LLC Standalone Crest - Est. 2020", color: "Consolidatus Empire LLC", featured: true },
    { id: "236", src: badgeConsolidatusNavySilver, alt: "The Consolidatus Empire LLC Crest - Navy & Silver Est. 2020", color: "Consolidatus Navy & Silver", featured: true },
    { id: "237", src: badgeConsolidatusCharcoalPurple, alt: "The Consolidatus Empire LLC Crest - Charcoal & Purple Est. 2020", color: "Consolidatus Charcoal & Purple", featured: true },
    { id: "238", src: badgeConsolidatusGoldBrown, alt: "The Consolidatus Empire LLC Crest - Gold & Brown Est. 2020", color: "Consolidatus Gold & Brown", featured: true },
    { id: "239", src: logoFoundersCrestII, alt: "The Founders Crest II - Royal Blue & Gold Est. 2020", color: "Founders Crest II Blue & Gold", featured: true },
  ];

  const honorShields = [
    { id: "300", src: honorAllGold, alt: "The Golden Eagle Shield", color: "All Gold", featured: true },
    { id: "301", src: honorNavyGold, alt: "Navy & Gold Eagle Shield", color: "Navy & Gold" },
    { id: "302", src: honorSilverGold, alt: "Silver & Gold Eagle Shield", color: "Silver & Gold" },
    { id: "303", src: honorBlackGold, alt: "Black & Gold Eagle Shield", color: "Black & Gold" },
    { id: "304", src: honorMaroonGold, alt: "Maroon & Gold Eagle Shield", color: "Maroon & Gold" },
    { id: "305", src: honorNavySilver, alt: "Navy & Silver Eagle Shield", color: "Navy & Silver" },
    { id: "306", src: honorBrownGold, alt: "Brown & Gold Eagle Shield", color: "Brown & Gold" },
    { id: "307", src: honorPurpleGold, alt: "Purple & Gold Eagle Shield", color: "Purple & Gold" },
    { id: "308", src: honorWhiteGold, alt: "White & Gold Eagle Shield", color: "White & Gold" },
    { id: "309", src: logoKKShieldSwords, alt: "KK Shield with Swords", color: "KK Shield & Swords", featured: true },
    { id: "310", src: logoKKAShield, alt: "KKA Shield with Eagle - Khomplete Khemistri Apparel", color: "KKA Shield", featured: true },
  ];

  const compassCollection = [
    { id: "400", src: compassKKApparel, alt: "Khomplete Khemistri Apparel Compass", color: "KK Apparel Compass", featured: true },
    { id: "401", src: compassKMG1, alt: "KKMG LLC Compass", color: "KKMG LLC Compass", featured: true },
    { id: "402", src: compassKMG2, alt: "KKMG LLC Compass II", color: "KKMG LLC Compass II" },
    { id: "403", src: compassSunburst, alt: "Khomplete Khemistri Apparel Sunburst Emblem", color: "Apparel Sunburst", featured: true },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow">
        
        {/* Collection intro */}
        <section className="pt-16 pb-8 bg-secondary text-secondary-foreground">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-5xl mx-auto text-center mb-12"
            >
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-primary">
                Logo Collections
              </p>
              <h1
                className="mt-3 font-display text-3xl font-bold uppercase tracking-wide text-secondary-foreground md:text-5xl"
                data-testid="heading-branded-logo-collection"
              >
                Our Branded Logo Collection
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-secondary-foreground/70">
                Silver-blue empire crests across Royalty Badge, Canvas, Shield of Honor, and Compass.
              </p>
            </motion.div>
            <div className="mx-auto max-w-4xl rounded-2xl border border-primary/45 bg-primary/10 p-6 text-center shadow-xl md:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-primary">
                New Seasonal Collection · August–February
              </p>
              <h2 className="mt-3 font-display text-2xl font-bold uppercase tracking-wide text-secondary-foreground md:text-3xl">
                Football Teams Sports Edition
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-secondary-foreground/70">
                Explore 28 football crests, then choose your garment and print
                placement.
              </p>
              <Link
                href="/football-teams"
                className="mt-5 inline-flex rounded-full bg-primary px-6 py-3 font-display text-sm font-bold uppercase tracking-wider text-primary-foreground transition hover:bg-primary/90"
                data-testid="link-football-collection"
              >
                Shop Football Sports Edition
              </Link>
            </div>
          </div>
        </section>

        {/* Section 1: Versatile Royalty Badge of Honor — biggest collection */}
        <section className="py-24 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <img
                src={royaltyBadgeSectionArt}
                alt="Introducing our Versatile Royalty Badge of Honor Collection"
                className="mx-auto mb-8 h-auto w-full max-w-6xl object-contain drop-shadow-2xl"
                data-testid="img-royalty-badge-section"
              />
              <h2
                className="sr-only"
                data-testid="heading-royalty-badge-honor"
              >
                Versatile Royalty Badge of Honor Collection
              </h2>
              <p className="text-primary font-display text-sm uppercase tracking-[0.28em] mt-3">
                Our Biggest Collection · 40 Logos
              </p>
              <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
                Male and female crests to match your mood and your vibe — which one do you want to ride with? Brotherhood, Unity, and Strength.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {badges.map((badge, index) => (
                <Link key={badge.id} href={`/customize/${badge.id}`} data-testid={`link-badge-${badge.id}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05, duration: 0.5 }}
                    className={`group relative flex flex-col items-center justify-center bg-background rounded-xl p-4 border border-border hover:border-primary/40 overflow-hidden shadow-lg cursor-pointer ${badge.featured ? 'bg-gradient-to-b from-background to-primary/5' : ''}`}
                  >
                    <div className="relative w-full aspect-square flex items-center justify-center">
                      <img 
                        src={badge.src} 
                        alt={badge.alt}
                        className="w-full h-full object-contain drop-shadow-2xl transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="mt-4 text-center">
                      <span className="text-primary/60 text-sm font-mono">#{badge.id}</span>
                      <p className="text-foreground font-display text-sm uppercase tracking-wide mt-1">{badge.color}</p>
                      <span className="text-xs text-primary/80 uppercase tracking-widest mt-2 block">Badge of Honor</span>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded-xl">
                      <span className="text-white font-display text-lg uppercase tracking-wide">Customize</span>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>

            {/* Female Logos — pearl-crown griffin crests within Royalty Badge of Honor */}
            <div className="mt-20 text-center mb-10">
              <h3
                className="text-2xl md:text-3xl font-display uppercase tracking-wide text-primary"
                data-testid="heading-female-logos"
              >
                Female Logos
              </h3>
              <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
                Pearl-crown griffin crests from the Feminine Collection — part of Our Royalty Badge of Honor.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {femaleBadges.map((badge, index) => (
                <Link key={badge.id} href={`/customize/${badge.id}`} data-testid={`link-badge-${badge.id}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05, duration: 0.5 }}
                    className="group relative flex flex-col items-center justify-center bg-background rounded-xl p-4 border border-border hover:border-primary/40 overflow-hidden shadow-lg cursor-pointer bg-gradient-to-b from-background to-primary/5"
                  >
                    <div className="relative w-full aspect-square flex items-center justify-center">
                      <img
                        src={badge.src}
                        alt={badge.alt}
                        className="w-full h-full object-contain drop-shadow-2xl transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="mt-4 text-center">
                      <span className="text-primary/60 text-sm font-mono">#{badge.id}</span>
                      <p className="text-foreground font-display text-sm uppercase tracking-wide mt-1">{badge.color}</p>
                      <span className="text-xs text-primary/80 uppercase tracking-widest mt-2 block">Badge of Honor · Female</span>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded-xl">
                      <span className="text-white font-display text-lg uppercase tracking-wide">Customize</span>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </section>


        {/* Section 2: Versatile Canvas Collection — circular logos to match your mood & vibe */}
        <section className="py-24 bg-secondary text-secondary-foreground relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
            <div className="absolute right-0 top-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute left-0 bottom-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          </div>
          
          <div className="container mx-auto px-4">

            <div className="text-center mb-16">
              <img
                src={canvasCollectionSectionArt}
                alt="Introducing our Versatile Canvas Collection"
                className="mx-auto mb-8 h-auto w-full max-w-6xl object-contain drop-shadow-2xl"
                data-testid="img-canvas-collection-section"
              />
              <h2
                className="sr-only"
                data-testid="heading-canvas-collection"
              >
                Versatile Canvas Collection
              </h2>
              <p className="text-primary font-display text-sm uppercase tracking-[0.28em] mt-3">
                25 Logos · Match Your Mood & Vibe
              </p>
              <p className="text-secondary-foreground/60 mt-4 max-w-2xl mx-auto">
                25 vibrant circular logos to match your mood and your vibe — which one do you want to ride with? One vision. Representing the multifaceted nature of our empire and celebrating our diverse community.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12">
              {logos.map((logo, index) => (
                <Link key={logo.id} href={`/customize/${logo.id}`} data-testid={`link-logo-${logo.id}`}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05, duration: 0.5 }}
                    className="group relative flex flex-col items-center justify-center bg-primary/5 rounded-xl p-6 hover:bg-primary/10 transition-colors duration-300 border border-white/5 hover:border-primary/20 cursor-pointer"
                  >
                    <div className="relative w-full aspect-square">
                      <img 
                        src={logo.src} 
                        alt={logo.alt}
                        className="w-full h-full object-contain drop-shadow-xl transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="mt-4 text-center">
                      <span className="text-primary/60 text-sm font-mono">#{logo.id}</span>
                      <p className="text-secondary-foreground font-display text-sm uppercase tracking-wide mt-1">{logo.color}</p>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded-xl">
                      <span className="text-white font-display text-lg uppercase tracking-wide">Customize</span>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>

            {/* Canvas Collection — origin-story collage of the original logos */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="w-full mt-24"
            >
              <div className="text-center mb-8">
                <h3
                  className="text-2xl md:text-3xl font-display uppercase tracking-wide text-primary"
                  data-testid="heading-1st-generation-logos"
                >
                  Our 1st Generation Logos
                </h3>
                <p className="text-secondary-foreground/60 mt-4 max-w-2xl mx-auto">
                  The original designs that started it all. A testament to our brand's evolution.
                </p>
              </div>
              <div className="relative rounded-xl overflow-hidden border border-primary/20 shadow-2xl">
                <img 
                  src={legacyCollage} 
                  alt="Our 1st Generation Logos by Khomplete Khemistri"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
              </div>
              <p className="text-center text-primary/80 text-sm uppercase tracking-widest mt-4">
                The Consolidatus Empire LLC • Est. 2020
              </p>
            </motion.div>

          </div>
        </section>

        {/* Section 3: Versatile Armored Shield of Honor Collection */}
        <section className="py-24 bg-gradient-to-b from-background to-secondary/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <img
                src={armoredShieldSectionArt}
                alt="Introducing our Versatile Armored Shield Collection"
                className="mx-auto mb-8 h-auto w-full max-w-6xl object-contain drop-shadow-2xl"
                data-testid="img-armored-shield-section"
              />
              <h2
                className="sr-only"
                data-testid="heading-armored-shield"
              >
                Versatile Armored Shield Collection
              </h2>
              <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
                The eagle shields that guard the empire — protecting the wealth, the vision, and the future.
                <span className="block text-primary font-bold mt-2">EST. 2020</span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {honorShields.map((shield, index) => (
                <Link key={shield.id} href={`/customize/${shield.id}`} data-testid={`link-shield-${shield.id}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className={`group relative flex flex-col items-center justify-center bg-black rounded-xl p-4 border border-white/10 hover:border-primary/40 overflow-hidden cursor-pointer ${shield.featured ? 'md:col-span-2 lg:col-span-1 bg-gradient-to-b from-black to-primary/10' : ''}`}
                  >
                    <div className="relative w-full aspect-square flex items-center justify-center">
                      <img 
                        src={shield.src} 
                        alt={shield.alt}
                        className="w-full h-full object-contain drop-shadow-2xl transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="mt-4 text-center">
                      <span className="text-primary/60 text-sm font-mono">#{shield.id}</span>
                      <p className="text-white font-display text-lg uppercase tracking-wide mt-1">{shield.color}</p>
                      <span className="text-xs text-primary/80 uppercase tracking-widest mt-2 block">Shield of Honor</span>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded-xl">
                      <span className="text-white font-display text-lg uppercase tracking-wide">Customize</span>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>

          </div>
        </section>

        {/* Section 4: Compass Collection */}
        <section className="py-24 bg-gradient-to-b from-secondary/30 to-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-primary">
                Compass Collection
              </p>
              <h2
                className="text-3xl md:text-4xl font-display uppercase tracking-wide text-primary mt-3 mb-4"
                data-testid="heading-compass-collection"
              >
                The Compass Collection
              </h2>
              <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
                The Compass Collection. Charting the course of the empire, guided by direction, discipline, and vision.
                <span className="block text-primary font-bold mt-2">EST. 2020</span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {compassCollection.map((logo, index) => (
                <Link key={logo.id} href={`/customize/${logo.id}`} data-testid={`link-compass-${logo.id}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className={`group relative flex flex-col items-center justify-center bg-gradient-to-b from-black to-primary/5 rounded-xl p-6 border border-primary/20 hover:border-primary/50 overflow-hidden cursor-pointer shadow-xl`}
                  >
                    <div className="relative w-full aspect-square flex items-center justify-center">
                      <img 
                        src={logo.src} 
                        alt={logo.alt}
                        className="w-full h-full object-contain drop-shadow-2xl transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="mt-4 text-center">
                      <span className="text-primary/60 text-sm font-mono">#{logo.id}</span>
                      <p className="text-foreground font-display text-lg uppercase tracking-wide mt-1">{logo.color}</p>
                      <span className="text-xs text-primary/80 uppercase tracking-widest mt-2 block">Compass Collection</span>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded-xl">
                      <span className="text-white font-display text-lg uppercase tracking-wide">Customize</span>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}

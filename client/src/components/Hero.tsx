import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import heroBackground from "@assets/brand/empire_headquarters_blue_silver.jpg";

export default function Hero() {
  return (
    <section className="relative flex h-[85vh] min-h-[560px] w-full flex-col overflow-hidden text-white">
      <div className="absolute inset-0 bg-[hsl(222_86%_18%)]">
        <img
          src={heroBackground}
          alt="The Consolidatus Empire Headquarters"
          className="h-full w-full object-cover object-[center_48%] sm:object-[center_46%]"
          data-testid="img-home-headquarters"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/88 via-background/10 to-black/35" />
      </div>

      <div className="relative z-10 container mx-auto flex flex-1 flex-col px-4 pt-8 text-center sm:pt-10 md:pt-12">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mx-auto mb-6 max-w-3xl font-brand text-base font-medium leading-relaxed tracking-[0.04em] text-white/95 md:mb-8 md:text-xl"
        >
          The Consolidatus Empire LLC is designed to write your own ticket and{" "}
          <span className="text-primary">Be Your Own Boss</span>, empowering
          vision, building legacies where unity meets opportunity.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col justify-center gap-4 sm:flex-row"
        >
          <Link href="/apparel">
            <Button
              size="lg"
              className="h-auto bg-primary px-8 py-6 font-display text-lg uppercase tracking-wider text-primary-foreground hover:bg-foreground hover:text-background"
            >
              Shop Khemistri
            </Button>
          </Link>
          <Link href="/hub">
            <Button
              size="lg"
              variant="outline"
              className="h-auto border-white bg-transparent px-8 py-6 font-display text-lg uppercase tracking-wider text-white hover:bg-white hover:text-black"
            >
              Centralized Hub
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

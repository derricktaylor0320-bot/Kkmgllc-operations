import { motion } from "framer-motion";
import { useCompassNavigation } from "@/hooks/useCompassNavigation";

export default function LevitatingFoundersThree() {
  const { openCompass } = useCompassNavigation();

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-6 z-20 flex justify-end px-4 sm:bottom-10 sm:px-8 md:bottom-14">
      <motion.button
        type="button"
        onClick={openCompass}
        className="founders-three-launcher pointer-events-auto group relative flex flex-col items-center gap-2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
        aria-label="Open Empire apps — the founders three"
        data-testid="button-founders-three-launcher"
      >
        <div
          className="absolute inset-0 scale-[1.6] rounded-full bg-accent/20 opacity-60 blur-2xl transition-opacity group-hover:opacity-90"
          aria-hidden="true"
        />
        <div
          className="absolute h-24 w-24 rounded-full border border-primary/15 sm:h-28 sm:w-28"
          aria-hidden="true"
        />
        <div
          className="absolute h-[5.5rem] w-[5.5rem] rounded-full border border-accent/25 sm:h-[6.5rem] sm:w-[6.5rem]"
          aria-hidden="true"
        />

        <div className="relative flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full border border-primary/45 bg-gradient-to-br from-[hsl(219_96%_54%/0.4)] via-[hsl(222_88%_17%/0.55)] to-[hsl(210_34%_93%/0.2)] shadow-[0_0_28px_hsl(219_96%_54%/0.38)] backdrop-blur-md transition-shadow group-hover:shadow-[0_0_42px_hsl(219_96%_54%/0.55)] sm:h-20 sm:w-20">
          <span className="founders-three-numeral font-display text-4xl font-bold leading-none select-none sm:text-5xl">
            3
          </span>
        </div>

        <span className="rounded-full border border-white/10 bg-black/35 px-2.5 py-1 text-[9px] uppercase tracking-[0.22em] text-white/75 backdrop-blur-sm transition-colors group-hover:border-primary/30 group-hover:text-white/95 sm:text-[10px]">
          Empire Apps
        </span>
      </motion.button>
    </div>
  );
}

import { useState } from "react";
import { Check } from "lucide-react";
import { allLogos } from "@/lib/logoCatalog";
import LogoPreviewDialog from "@/components/LogoPreviewDialog";

interface LogoPickerTileProps {
  logoId: string;
  isSelected: boolean;
  disabled?: boolean;
  onSelect: () => void;
  variant?: "compact" | "default";
  testId?: string;
  selectLabel?: string;
}

export default function LogoPickerTile({
  logoId,
  isSelected,
  disabled = false,
  onSelect,
  variant = "default",
  testId,
  selectLabel,
}: LogoPickerTileProps) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const logo = allLogos[logoId];
  if (!logo) return null;

  const rounded = variant === "compact" ? "rounded-md" : "rounded-lg";
  const checkSize = variant === "compact" ? "h-5 w-5" : "h-6 w-6";
  const imgPad = variant === "compact" ? "p-0.5" : "p-1";
  const numberClass =
    variant === "compact"
      ? "text-[9px] py-px"
      : "text-[10px] sm:text-xs py-0.5";

  return (
    <>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setPreviewOpen(true)}
        className={`relative ${rounded} border-2 overflow-hidden bg-background/80 transition-colors disabled:opacity-50 ${
          isSelected ? "border-primary" : "border-transparent hover:border-border"
        }`}
        data-testid={testId ?? `button-logo-${logoId}`}
        title={`#${logoId} — ${logo.alt}`}
        aria-label={`Preview logo #${logoId}, ${logo.alt}`}
      >
        <img
          src={logo.src}
          alt={logo.alt}
          className={`aspect-square object-contain w-full h-full ${imgPad}`}
          loading="lazy"
        />
        <span
          className={`absolute bottom-0 inset-x-0 bg-black/70 text-center font-mono text-primary leading-none ${numberClass}`}
          data-testid={`text-logo-number-${logoId}`}
        >
          #{logoId}
        </span>
        {isSelected && (
          <span className="absolute inset-0 flex items-center justify-center bg-black/40">
            <Check className={`${checkSize} text-primary`} />
          </span>
        )}
      </button>

      <LogoPreviewDialog
        logoId={logoId}
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        onSelect={onSelect}
        isSelected={isSelected}
        selectLabel={selectLabel}
      />
    </>
  );
}

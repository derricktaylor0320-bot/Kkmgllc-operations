import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { allLogos } from "@/lib/logoCatalog";

interface LogoPreviewDialogProps {
  logoId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: () => void;
  isSelected?: boolean;
  selectLabel?: string;
}

export default function LogoPreviewDialog({
  logoId,
  open,
  onOpenChange,
  onSelect,
  isSelected = false,
  selectLabel = "Select this logo",
}: LogoPreviewDialogProps) {
  if (!logoId) return null;
  const logo = allLogos[logoId];
  if (!logo) return null;

  const handleSelect = () => {
    onSelect();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-2xl w-[min(92vw,42rem)] p-4 sm:p-6"
        data-testid={`dialog-logo-preview-${logoId}`}
      >
        <DialogHeader className="space-y-1">
          <DialogTitle className="font-display uppercase tracking-wide text-center sm:text-left">
            Logo #{logoId}
          </DialogTitle>
          <DialogDescription className="text-center sm:text-left">
            {logo.alt} · {logo.color}
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border border-primary/20 bg-muted/30 overflow-hidden">
          <div className="aspect-square max-h-[min(70vh,28rem)] w-full flex items-center justify-center p-4 sm:p-8">
            <img
              src={logo.src}
              alt={logo.alt}
              className="max-h-full max-w-full object-contain"
              data-testid={`img-logo-preview-${logoId}`}
            />
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          <span className="font-mono text-primary">#{logoId}</span>
          {" · "}
          {logo.section}
        </p>

        <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
            data-testid={`button-logo-preview-close-${logoId}`}
          >
            Close
          </Button>
          <Button
            type="button"
            onClick={handleSelect}
            className="w-full sm:w-auto uppercase tracking-wider font-display"
            data-testid={`button-logo-preview-select-${logoId}`}
          >
            {isSelected ? "Selected — confirm" : selectLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import { useEffect, useState } from "react";
import { CheckCircle2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in navigator &&
      (navigator as Navigator & { standalone?: boolean }).standalone === true)
  );
}

export default function InstallAppButton() {
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    setInstalled(isStandalone());

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setInstallPrompt(null);
      setInstalled(true);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const install = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") setInstallPrompt(null);
  };

  if (installed) {
    return (
      <div
        className="inline-flex items-center gap-2 rounded-lg border border-primary/35 bg-primary/10 px-4 py-2 text-sm font-medium text-primary"
        data-testid="status-app-installed"
      >
        <CheckCircle2 className="h-4 w-4" />
        Installed on this device
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      {installPrompt && (
        <Button
          type="button"
          onClick={install}
          className="bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-wider font-display gap-2"
          data-testid="button-install-app"
        >
          <Download className="h-4 w-4" />
          Install App
        </Button>
      )}
      <p
        className="max-w-xl text-center text-xs leading-relaxed text-muted-foreground"
        data-testid="text-install-help"
      >
        {installPrompt
          ? "Install the Empire app for quick access from your home screen."
          : "To add this app to your home screen, open your browser menu and choose “Install app” or “Add to Home Screen.”"}
      </p>
    </div>
  );
}

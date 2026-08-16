import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  enableAnalyticsAfterConsent,
  getAnalyticsConsent,
  setAnalyticsConsent,
  trackPageView,
} from "@/lib/analytics";

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(getAnalyticsConsent() === null);
  }, []);

  const accept = () => {
    setAnalyticsConsent(true);
    enableAnalyticsAfterConsent();
    trackPageView(
      window.location.pathname + window.location.search + window.location.hash,
    );
    setVisible(false);
  };

  const decline = () => {
    setAnalyticsConsent(false);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 inset-x-0 z-[100] border-t border-primary/30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90 p-4 shadow-[0_-8px_30px_rgba(0,0,0,0.25)]"
      role="dialog"
      aria-label="Cookie consent"
      data-testid="banner-cookie-consent"
    >
      <div className="container mx-auto flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground max-w-3xl">
          We use cookies and Google Analytics to understand how visitors use our
          store and to measure checkout performance. Accept to help us improve
          your experience. See our{" "}
          <Link
            href="/policies"
            className="text-primary underline-offset-4 hover:underline"
          >
            policies
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-3">
          <Button
            type="button"
            variant="outline"
            className="uppercase tracking-wider font-display text-xs"
            onClick={decline}
            data-testid="button-cookie-decline"
          >
            Decline
          </Button>
          <Button
            type="button"
            className="uppercase tracking-wider font-display text-xs bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={accept}
            data-testid="button-cookie-accept"
          >
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}

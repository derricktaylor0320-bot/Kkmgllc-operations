import { useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  enableAnalyticsAfterConsent,
  getAnalyticsConsent,
  initGa4,
  setGaMeasurementId,
  trackPageView,
} from "@/lib/analytics";

interface SiteConfig {
  gaMeasurementId?: string | null;
}

export default function GoogleAnalytics() {
  const [location] = useLocation();

  const { data: siteConfig } = useQuery<SiteConfig>({
    queryKey: ["/api/site-config"],
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (!siteConfig?.gaMeasurementId) return;
    setGaMeasurementId(siteConfig.gaMeasurementId);
    if (getAnalyticsConsent() === "granted") {
      initGa4();
    }
  }, [siteConfig?.gaMeasurementId]);

  useEffect(() => {
    if (!siteConfig?.gaMeasurementId || getAnalyticsConsent() !== "granted") {
      return;
    }
    enableAnalyticsAfterConsent();
    trackPageView(location);
  }, [location, siteConfig?.gaMeasurementId]);

  return null;
}

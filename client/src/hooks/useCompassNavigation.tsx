import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type CompassNavigationContextValue = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  openCompass: () => void;
};

const CompassNavigationContext =
  createContext<CompassNavigationContextValue | null>(null);

export function CompassNavigationProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openCompass = useCallback(() => {
    setIsOpen(true);
  }, []);

  const value = useMemo(
    () => ({
      isOpen,
      setIsOpen,
      openCompass,
    }),
    [isOpen, openCompass],
  );

  return (
    <CompassNavigationContext.Provider value={value}>
      {children}
    </CompassNavigationContext.Provider>
  );
}

export function useCompassNavigation() {
  const context = useContext(CompassNavigationContext);
  if (!context) {
    throw new Error(
      "useCompassNavigation must be used within CompassNavigationProvider",
    );
  }
  return context;
}

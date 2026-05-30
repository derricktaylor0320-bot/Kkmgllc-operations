import { Link, useLocation } from "wouter";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import logo from "@assets/generated_images/consolidatus_empire_logo_2020.png";

export default function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/canvas", label: "Branded Logo Collection" },
    { href: "/apparel", label: "Apparel" },
    { href: "/accessories", label: "Accessories" },
    { href: "/vintage", label: "Vintage Baltimore" },
    { href: "/poetry", label: "Poetry on a Plaque" },
    { href: "/studio", label: "Studio" },
    { href: "/fr2p", label: "The FR2P Club" },
    { href: "/guardconnect", label: "GuardConnect" },
    { href: "/pocket-booster", label: "Pocket Booster" },
    { href: "/prospect-identity", label: "Prospect Identity" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 font-display font-bold text-2xl tracking-tighter uppercase hover:text-primary transition-colors">
          <img src={logo} alt="Khomplete Khemistri Logo" className="h-12 w-12 object-contain drop-shadow-md" />
          <span>The Consolidatus <span className="text-primary">Empire</span></span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6 mx-6 flex-1 min-w-0 overflow-x-auto">
          {links.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary uppercase tracking-widest whitespace-nowrap shrink-0 ${
                location === link.href ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary" />
          </Button>

          {/* Mobile Nav */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-4 mt-8">
                  {links.map((link) => (
                    <Link 
                      key={link.href} 
                      href={link.href}
                      className={`text-lg font-medium transition-colors hover:text-primary uppercase tracking-widest ${
                        location === link.href ? "text-primary" : "text-muted-foreground"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}

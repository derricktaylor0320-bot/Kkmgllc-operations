import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BrandSectionBanner from "@/components/BrandSectionBanner";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Wine as WineIcon } from "lucide-react";
import foundersSignatureCollection from "@assets/wine/founders_signature_collection.jpg";

const launchVarieties = [
  {
    name: "Sauvignon Blanc",
    style: "White Wine",
    description: "Crisp, bright, and refined — the opening note of the collection.",
  },
  {
    name: "Pinot Noir",
    style: "Red Wine",
    description: "Silky depth with a signature finish — crafted for the Empire table.",
  },
];

export default function Wine() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow">
        <section className="py-20 bg-secondary text-secondary-foreground relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute right-0 top-0 w-96 h-96 bg-primary/30 rounded-full blur-3xl" />
            <div className="absolute left-0 bottom-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-4 text-center relative z-10">
            <BrandSectionBanner compact />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span
                className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-xs md:text-sm font-display uppercase tracking-[0.3em] text-primary mb-6"
                data-testid="badge-coming-soon"
              >
                <Sparkles className="w-4 h-4" />
                Coming Soon
              </span>
              <h1 className="font-display text-4xl md:text-6xl font-bold mb-4 tracking-tight uppercase">
                Founder's Signature <span className="silver-shine">Wine</span>
              </h1>
              <p className="text-xl text-secondary-foreground/70 max-w-3xl mx-auto">
                The Consolidatus Empire's first wine collection — established in
                Baltimore, MD. A premium pour honoring the founders' vision.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="max-w-5xl mx-auto"
            >
              <img
                src={foundersSignatureCollection}
                alt="Founder's Signature Sauvignon Blanc and Pinot Noir — The Consolidatus Empire LLC"
                className="w-full rounded-2xl border border-primary/30 shadow-[0_20px_70px_rgba(0,0,0,0.35)] object-cover"
                data-testid="img-wine-collection"
              />
            </motion.div>
          </div>
        </section>

        <section className="pb-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
              {launchVarieties.map((variety, index) => (
                <motion.div
                  key={variety.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card
                    className="h-full border-primary/30"
                    data-testid={`card-wine-${variety.name.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="flex items-center justify-center w-11 h-11 rounded-full bg-primary/15 text-primary border border-primary/40 shrink-0">
                          <WineIcon className="w-5 h-5" />
                        </span>
                        <div className="text-left">
                          <p className="text-xs font-display uppercase tracking-[0.2em] text-primary">
                            {variety.style}
                          </p>
                          <h3 className="font-display text-xl font-bold uppercase">
                            {variety.name}
                          </h3>
                        </div>
                      </div>
                      <p className="text-muted-foreground">{variety.description}</p>
                      <p className="mt-4 text-sm font-medium text-primary uppercase tracking-wider">
                        Price TBA
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="mt-12 max-w-3xl mx-auto"
            >
              <Card className="border-primary/40" data-testid="card-more-flavors">
                <CardContent className="p-8 text-center">
                  <h3 className="font-display text-2xl font-bold uppercase mb-3">
                    More Flavors <span className="text-primary">TBA</span>
                  </h3>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Additional varietals and pricing are on the way. The Founder's
                    Signature collection is being prepared for release — stay tuned
                    for launch details.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <div className="mt-16 bg-secondary rounded-2xl p-8 text-center max-w-3xl mx-auto">
              <h3 className="font-display text-2xl font-bold mb-3 uppercase">
                Coming <span className="text-primary">Soon</span>
              </h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Founder's Signature Wine is not yet available for purchase. More
                flavors and prices will be announced when the collection launches.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

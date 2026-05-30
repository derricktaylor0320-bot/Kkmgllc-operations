import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { XCircle, ShoppingBag, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function CheckoutCancel() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-24 flex items-center justify-center">
        <motion.div 
          className="max-w-lg text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8 flex justify-center">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
              <XCircle className="w-10 h-10 text-muted-foreground" />
            </div>
          </div>
          
          <h1 
            className="text-4xl md:text-5xl font-display font-bold uppercase tracking-tight mb-4"
            data-testid="text-cancel-title"
          >
            Checkout Cancelled
          </h1>
          
          <p 
            className="text-lg text-muted-foreground mb-8"
            data-testid="text-cancel-message"
          >
            Your order was not completed. No charges were made to your account.
          </p>
          
          <div className="bg-muted/30 rounded-xl p-6 mb-8 border border-primary/10">
            <p className="text-sm text-muted-foreground">
              Changed your mind? Your items are still available. Return to the shop to complete your purchase.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/apparel">
              <Button 
                className="w-full sm:w-auto bg-primary text-black hover:bg-primary/90 uppercase tracking-wider font-display"
                data-testid="button-return-to-shop"
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                Return to Shop
              </Button>
            </Link>
            <Link href="/">
              <Button 
                variant="outline" 
                className="w-full sm:w-auto uppercase tracking-wider font-display border-primary/20"
                data-testid="button-go-home"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Home
              </Button>
            </Link>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}

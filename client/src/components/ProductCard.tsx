import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";

interface ProductCardProps {
  image: string;
  title: string;
  price: number;
  category: string;
  priceId?: string;
  soldOut?: boolean;
  description?: string;
}

export default function ProductCard({ image, title, price, category, priceId, soldOut, description }: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleBuyNow = async () => {
    if (!priceId) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          priceId,
          productName: title,
          productImage: image,
          productDescription: description || category
        }),
      });

      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <Card className="overflow-hidden border-none shadow-none group">
        <CardContent className="p-0 relative aspect-square overflow-hidden bg-muted">
          <img 
            src={image} 
            alt={title}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
            data-testid={`img-product-${title.toLowerCase().replace(/\s+/g, '-')}`}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          {soldOut && (
            <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider rounded shadow-lg">
              Sold Out
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col items-start p-4 gap-2">
          <span 
            className="text-xs font-medium text-muted-foreground uppercase tracking-widest"
            data-testid={`text-category-${title.toLowerCase().replace(/\s+/g, '-')}`}
          >
            {category}
          </span>
          <div className="flex justify-between items-center w-full">
            <h3 
              className="font-display font-semibold text-lg uppercase truncate pr-4"
              data-testid={`text-title-${title.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {title}
            </h3>
            <span 
              className="font-medium text-primary"
              data-testid={`text-price-${title.toLowerCase().replace(/\s+/g, '-')}`}
            >
              ${price.toFixed(2)}
            </span>
          </div>
          <Button 
            onClick={handleBuyNow}
            disabled={isLoading || !priceId || soldOut}
            className={`w-full mt-2 transition-colors uppercase tracking-wider font-display text-sm h-10 disabled:opacity-50 ${
              soldOut 
                ? 'bg-gray-400 text-white cursor-not-allowed' 
                : 'bg-black text-white hover:bg-primary hover:text-black'
            }`}
            data-testid={`button-buy-${title.toLowerCase().replace(/\s+/g, '-')}`}
          >
            {soldOut ? 'Sold Out' : isLoading ? 'Processing...' : 'Buy Now'}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

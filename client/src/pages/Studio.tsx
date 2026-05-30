import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import studioImg from "@assets/generated_images/recording_studio_background.png";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Studio() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubscribe = async () => {
    if (!email) {
      setMessage("Please enter your email address");
      setIsSuccess(false);
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, source: 'studio' }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setIsSuccess(true);
        setEmail("");
      } else {
        setMessage(data.error || "Something went wrong. Please try again.");
        setIsSuccess(false);
      }
    } catch (error) {
      setMessage("Failed to subscribe. Please try again.");
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow relative flex items-center justify-center min-h-[80vh]">
        <div className="absolute inset-0">
          <img 
            src={studioImg} 
            alt="Recording Studio" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-8xl font-display font-bold uppercase tracking-tighter mb-6">
              The Lab
            </h1>
            <div className="w-24 h-1 bg-primary mx-auto mb-8" />
            <h2 className="text-3xl md:text-4xl font-light uppercase tracking-widest mb-8 text-primary">
              Coming Soon
            </h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto mb-10">
              A state-of-the-art recording facility for artists who want to control their sound. 
              Ownership starts here.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email for updates" 
                className="px-4 py-3 rounded bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-primary flex-grow"
                data-testid="input-email-studio"
                disabled={isLoading}
              />
              <Button 
                onClick={handleSubscribe}
                disabled={isLoading}
                className="bg-primary text-black hover:bg-white hover:text-black font-display uppercase tracking-wider"
                data-testid="button-notify-studio"
              >
                {isLoading ? "Subscribing..." : "Notify Me"}
              </Button>
            </div>
            
            {message && (
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-4 text-sm ${isSuccess ? 'text-green-400' : 'text-red-400'}`}
                data-testid="text-subscribe-message"
              >
                {message}
              </motion.p>
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

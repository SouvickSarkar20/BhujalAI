import { useState } from "react";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { DemoChat } from "@/components/DemoChat";
import { Analytics } from "@/components/Analytics";
import { Footer } from "@/components/Footer";
const Index = () => {
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const handleDemoClick = () => {
    setIsDemoOpen(true);
  };
  const handleDemoClose = () => {
    setIsDemoOpen(false);
  };
  return <main className="min-h-screen bg-background">
      {/* SEO Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "INGRES AI",
        "description": "Revolutionary AI-powered platform for groundwater intelligence in India",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "INR"
        },
        "creator": {
          "@type": "Organization",
          "name": "INGRES AI",
          "url": "https://ingres-ai.com"
        }
      })}
      </script>
      <Hero onDemoClick={handleDemoClick} />
      <Features />
      
      {/* Scroll Indicator */}
      
      
      <Analytics />
      <Footer />
      
      <DemoChat isOpen={isDemoOpen} onClose={handleDemoClose} />
    </main>;
};
export default Index;
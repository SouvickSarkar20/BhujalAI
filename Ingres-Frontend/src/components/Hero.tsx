import { Button } from "@/components/ui/button";
import { Play, ArrowRight, Droplets } from "lucide-react";
import { TrustBar } from "./TrustBar";
import { useNavigate } from "react-router-dom";
interface HeroProps {
  onDemoClick: () => void;
}
export const Hero = ({
  onDemoClick
}: HeroProps) => {
  const navigate = useNavigate();
  return <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
    {/* Animated Background */}
    <div className="absolute inset-0 hero-gradient">
      <div className="ripple-container absolute inset-0" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/20">
        {/* Background Water Droplets */}
        <div className="absolute top-[15%] left-[10%] float-animation opacity-10" style={{
          animationDelay: '0.5s'
        }}>
          <Droplets className="w-4 h-4 text-teal-light" />
        </div>
        <div className="absolute top-[25%] right-[15%] float-animation opacity-8" style={{
          animationDelay: '1.5s'
        }}>
          <Droplets className="w-3 h-3 text-ocean-light" />
        </div>
        <div className="absolute top-[35%] left-[80%] float-animation opacity-12" style={{
          animationDelay: '3s'
        }}>
          <Droplets className="w-5 h-5 text-sand-warm" />
        </div>
        <div className="absolute top-[45%] left-[5%] float-animation opacity-6" style={{
          animationDelay: '4.5s'
        }}>
          <Droplets className="w-4 h-4 text-teal-accent" />
        </div>
        <div className="absolute top-[55%] right-[25%] float-animation opacity-9" style={{
          animationDelay: '2.8s'
        }}>
          <Droplets className="w-3 h-3 text-ocean-light" />
        </div>
        <div className="absolute top-[65%] left-[70%] float-animation opacity-7" style={{
          animationDelay: '1.2s'
        }}>
          <Droplets className="w-6 h-6 text-teal-light" />
        </div>
        <div className="absolute top-[75%] left-[20%] float-animation opacity-5" style={{
          animationDelay: '3.7s'
        }}>
          <Droplets className="w-4 h-4 text-sand-warm" />
        </div>
        <div className="absolute top-[85%] right-[40%] float-animation opacity-8" style={{
          animationDelay: '0.8s'
        }}>
          <Droplets className="w-5 h-5 text-ocean-light" />
        </div>
        <div className="absolute top-[20%] left-[60%] float-animation opacity-6" style={{
          animationDelay: '5.2s'
        }}>
          <Droplets className="w-3 h-3 text-teal-accent" />
        </div>
        <div className="absolute top-[40%] right-[60%] float-animation opacity-11" style={{
          animationDelay: '2.3s'
        }}>
          <Droplets className="w-4 h-4 text-teal-light" />
        </div>
      </div>
    </div>

    {/* Floating Elements */}
    <div className="absolute top-1/4 left-1/4 float-animation opacity-20">
      <Droplets className="w-8 h-8 text-teal-accent" />
    </div>
    <div className="absolute top-1/3 right-1/3 float-animation opacity-15" style={{
      animationDelay: '2s'
    }}>
      <Droplets className="w-6 h-6 text-ocean-light" />
    </div>
    <div className="absolute bottom-1/3 left-1/6 float-animation opacity-10" style={{
      animationDelay: '4s'
    }}>
      <Droplets className="w-10 h-10 text-sand-warm" />
    </div>

    {/* Content */}
    <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
      <div className="space-y-8">
        {/* Main Headline */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold font-inter leading-tight">
          <span className="text-white">Talk to</span>
          <br />
          <span className="bg-gradient-to-r from-sand-warm via-teal-light to-sand-warm bg-clip-text text-transparent">
            India's Groundwater
          </span>
          <br />
          <span className="text-white">Data</span>
        </h1>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl text-sand-light/90 max-w-3xl mx-auto leading-relaxed">
          Revolutionary AI-powered platform that transforms complex groundwater data
          into natural conversations. Ask questions in Hindi or English, get instant insights.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
          

          <Button
            onClick={() => navigate("/dashboard")}
            size="lg"
            className="group border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 font-semibold px-8 py-6 text-lg rounded-xl transition-smooth hover-lift"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {/* Trust Bar */}
        <div className="pt-16">
          <TrustBar />
        </div>
      </div>
    </div>

  </section>;
};
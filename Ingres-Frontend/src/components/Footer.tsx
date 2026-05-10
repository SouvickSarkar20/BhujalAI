import { Button } from "@/components/ui/button";
import { 
  Droplets, 
  Mail, 
  Phone, 
  MapPin, 
  Twitter, 
  Linkedin, 
  Github,
  Languages,
  ExternalLink
} from "lucide-react";

export const Footer = () => {
  const quickLinks = [
    { label: "Dashboard", href: "#dashboard" },
    { label: "API Documentation", href: "#api" },
    { label: "Research Papers", href: "#research" },
    { label: "Data Sources", href: "#sources" }
  ];

  const resources = [
    { label: "CGWB Portal", href: "#cgwb", external: true },
    { label: "Water Quality Data", href: "#quality" },
    { label: "State Reports", href: "#reports" },
    { label: "Best Practices", href: "#practices" }
  ];

  const support = [
    { label: "Help Center", href: "#help" },
    { label: "Contact Support", href: "#support" },
    { label: "Training", href: "#training" },
    { label: "Community Forum", href: "#forum" }
  ];

  const languages = [
    { code: "en", label: "English", active: true },
    { code: "hi", label: "हिंदी", active: false },
    { code: "te", label: "తెలుగు", active: false },
    { code: "ta", label: "தமிழ்", active: false }
  ];

  return (
    <footer className="bg-navy-dark text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-deep-sea/20 via-transparent to-teal-accent/20" />
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-teal-accent rounded-full filter blur-2xl opacity-30" />
      </div>

      <div className="relative">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-accent to-deep-sea p-3">
                  <Droplets className="w-full h-full text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold font-inter">INGRES AI</h3>
                  <p className="text-sand-light/80 text-sm">Groundwater Intelligence</p>
                </div>
              </div>
              
              <p className="text-sand-light/90 leading-relaxed mb-6 max-w-md">
                Transforming India's groundwater data into actionable intelligence through 
                conversational AI. Making complex hydrological insights accessible to everyone.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sand-light/80">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">contact@ingres-ai.com</span>
                </div>
                <div className="flex items-center space-x-3 text-sand-light/80">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">+91 11 2345 6789</span>
                </div>
                <div className="flex items-center space-x-3 text-sand-light/80">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">New Delhi, India</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex items-center space-x-4 mt-8">
                <Button variant="ghost" size="sm" className="text-sand-light/80 hover:text-white hover:bg-white/10">
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-sand-light/80 hover:text-white hover:bg-white/10">
                  <Linkedin className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-sand-light/80 hover:text-white hover:bg-white/10">
                  <Github className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-bold font-inter mb-6 text-white">Quick Links</h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sand-light/80 hover:text-white transition-colors text-sm flex items-center"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-lg font-bold font-inter mb-6 text-white">Resources</h4>
              <ul className="space-y-3">
                {resources.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sand-light/80 hover:text-white transition-colors text-sm flex items-center"
                    >
                      {link.label}
                      {link.external && <ExternalLink className="w-3 h-3 ml-1" />}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-lg font-bold font-inter mb-6 text-white">Support</h4>
              <ul className="space-y-3">
                {support.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sand-light/80 hover:text-white transition-colors text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>

              {/* Language Switcher */}
              <div className="mt-8">
                <h5 className="text-sm font-semibold text-white mb-3 flex items-center">
                  <Languages className="w-4 h-4 mr-2" />
                  Language
                </h5>
                <div className="grid grid-cols-2 gap-2">
                  {languages.map((lang) => (
                    <Button
                      key={lang.code}
                      variant={lang.active ? "secondary" : "ghost"}
                      size="sm"
                      className={`text-xs justify-start ${
                        lang.active
                          ? "bg-white/20 text-white"
                          : "text-sand-light/80 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      {lang.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-sand-light/70">
                <p>&copy; 2024 INGRES AI. All rights reserved.</p>
                <div className="flex items-center space-x-4">
                  <a href="#privacy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                  <a href="#terms" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                  <a href="#cookies" className="hover:text-white transition-colors">
                    Cookie Policy
                  </a>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-sand-light/70">
                <span>Powered by</span>
                <span className="text-teal-accent font-semibold">CGWB</span>
                <span>&</span>
                <span className="text-teal-accent font-semibold">IIT Partnership</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
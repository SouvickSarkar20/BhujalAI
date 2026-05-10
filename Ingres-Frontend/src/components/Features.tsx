import { MessageSquare, Database, TrendingUp, Zap, Globe, BarChart3 } from "lucide-react";

export const Features = () => {
  const features = [
    {
      icon: MessageSquare,
      title: "Chat + Natural Language Queries",
      description: "Ask complex groundwater questions in plain Hindi or English. Our AI understands context and delivers precise insights.",
      gradient: "from-teal-accent to-ocean-light"
    },
    {
      icon: Database,
      title: "Historical & Real-time Access",
      description: "Access decades of CGWB data plus live monitoring stations. Compare historical trends with current conditions instantly.",
      gradient: "from-deep-sea to-teal-accent"
    },
    {
      icon: TrendingUp,
      title: "Analytics & Forecasting",
      description: "AI-powered predictive models for water table trends, seasonal variations, and long-term sustainability planning.",
      gradient: "from-navy-dark to-deep-sea"
    }
  ];

  const additionalFeatures = [
    { icon: Zap, text: "Lightning-fast responses" },
    { icon: Globe, text: "Pan-India coverage" },
    { icon: BarChart3, text: "Visual data insights" }
  ];

  return (
    <section className="py-24 bg-background relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-inter text-foreground mb-6">
            Groundwater Intelligence
            <span className="block text-deep-sea">Reimagined</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Transform complex hydrological data into actionable insights through conversational AI
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group hover-lift bg-card rounded-2xl p-8 shadow-soft border border-border/50 relative overflow-hidden"
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />
              
              {/* Icon */}
              <div className="relative mb-6">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.gradient} p-4 shadow-ocean`}>
                  <feature.icon className="w-full h-full text-white" />
                </div>
              </div>

              {/* Content */}
              <div className="relative">
                <h3 className="text-2xl font-bold font-inter text-card-foreground mb-4 group-hover:text-deep-sea transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Hover Effect */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-deep-sea/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            </div>
          ))}
        </div>

        {/* Additional Features */}
        <div className="flex flex-wrap justify-center gap-6">
          {additionalFeatures.map((item, index) => (
            <div
              key={item.text}
              className="flex items-center space-x-3 bg-accent/30 rounded-full px-6 py-3 border border-accent/50"
            >
              <item.icon className="w-5 h-5 text-deep-sea" />
              <span className="text-accent-foreground font-medium">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
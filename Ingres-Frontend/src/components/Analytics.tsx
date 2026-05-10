import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  Calendar,
  MapPin,
  AlertTriangle
} from "lucide-react";

export const Analytics = () => {
  const navigate=useNavigate();
  const [timeRange, setTimeRange] = useState([2020]);
  
  // Mock data for demonstration
  const trendData = [
    { year: 2019, value: 85, safe: 45, critical: 25, overexploited: 30 },
    { year: 2020, value: 82, safe: 42, critical: 28, overexploited: 30 },
    { year: 2021, value: 78, safe: 38, critical: 32, overexploited: 30 },
    { year: 2022, value: 75, safe: 35, critical: 35, overexploited: 30 },
    { year: 2023, value: 73, safe: 33, critical: 37, overexploited: 30 }
  ];

  const currentYear = trendData.find(d => d.year === timeRange[0]) || trendData[1];

  return (
    <section className="py-24 bg-muted/30 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-deep-sea rounded-full filter blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-teal-accent rounded-full filter blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-inter text-foreground mb-6">
            Visual Data
            <span className="block text-deep-sea">Insights</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Interactive analytics dashboard showcasing real-time groundwater trends and forecasting capabilities
          </p>
        </div>

        {/* Interactive Time Slider */}
        <div className="mb-12">
          <Card className="p-8 shadow-soft border border-border/20">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Calendar className="w-6 h-6 text-deep-sea" />
                <h3 className="text-2xl font-bold font-inter text-card-foreground">
                  Time Series Analysis
                </h3>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>All India Data</span>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-medium text-card-foreground">
                    Select Year: {timeRange[0]}
                  </label>
                  <div className="text-sm text-muted-foreground">
                    2019 - 2023
                  </div>
                </div>
                
                <Slider
                  value={timeRange}
                  onValueChange={setTimeRange}
                  max={2023}
                  min={2019}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Analytics Cards Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Trend Sparkline */}
          <Card className="p-8 hover-lift shadow-soft border border-border/20 relative overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-deep-sea to-teal-accent p-3">
                  <TrendingDown className="w-full h-full text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-inter text-card-foreground">
                    Water Table Trend
                  </h3>
                  <p className="text-sm text-muted-foreground">National Average</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-destructive">-2.4%</div>
                <div className="text-xs text-muted-foreground">Annual decline</div>
              </div>
            </div>

            {/* Mini Sparkline */}
            <div className="relative h-20 mb-4">
              <svg className="w-full h-full" viewBox="0 0 300 80" preserveAspectRatio="none">
                <path
                  d="M0,60 L75,50 L150,45 L225,35 L300,30"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  className="text-destructive sparkline-path"
                />
                <path
                  d="M0,60 L75,50 L150,45 L225,35 L300,30 L300,80 L0,80 Z"
                  fill="url(#trendGradient)"
                  opacity="0.2"
                />
                <defs>
                  <linearGradient id="trendGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="hsl(var(--destructive))" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <AlertTriangle className="w-4 h-4" />
              <span>Critical decline in 12 states</span>
            </div>
          </Card>

          {/* Donut Chart */}
          <Card className="p-8 hover-lift shadow-soft border border-border/20">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-accent to-deep-sea p-3">
                <PieChart className="w-full h-full text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-inter text-card-foreground">
                  Assessment Categories
                </h3>
                <p className="text-sm text-muted-foreground">{currentYear.year} Data</p>
              </div>
            </div>

            {/* Donut Chart Visual */}
            <div className="relative w-32 h-32 mx-auto mb-6">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="hsl(var(--muted))"
                  strokeWidth="8"
                  fill="transparent"
                />
                
                {/* Safe areas */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="hsl(var(--teal-accent))"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${(currentYear.safe / 100) * 251} 251`}
                  strokeDashoffset="0"
                  className="transition-all duration-1000"
                />
                
                {/* Critical areas */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="hsl(var(--deep-sea))"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${(currentYear.critical / 100) * 251} 251`}
                  strokeDashoffset={`-${(currentYear.safe / 100) * 251}`}
                  className="transition-all duration-1000"
                />
                
                {/* Over-exploited areas */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="hsl(var(--destructive))"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${(currentYear.overexploited / 100) * 251} 251`}
                  strokeDashoffset={`-${((currentYear.safe + currentYear.critical) / 100) * 251}`}
                  className="transition-all duration-1000"
                />
              </svg>
            </div>

            {/* Legend */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-teal-accent" />
                  <span className="text-sm text-card-foreground">Safe</span>
                </div>
                <span className="text-sm font-medium text-card-foreground">{currentYear.safe}%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-deep-sea" />
                  <span className="text-sm text-card-foreground">Critical</span>
                </div>
                <span className="text-sm font-medium text-card-foreground">{currentYear.critical}%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-destructive" />
                  <span className="text-sm text-card-foreground">Over-exploited</span>
                </div>
                <span className="text-sm font-medium text-card-foreground">{currentYear.overexploited}%</span>
              </div>
            </div>
          </Card>

          {/* Interactive Controls */}
          <Card className="p-8 hover-lift shadow-soft border border-border/20">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-navy-dark to-deep-sea p-3">
                <BarChart3 className="w-full h-full text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-inter text-card-foreground">
                  Forecasting Model (Future Scope)
                </h3>
                <p className="text-sm text-muted-foreground">AI Predictions</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Prediction Cards */}
              <div className="space-y-3">
                <div className="p-4 bg-accent/20 rounded-lg border border-accent/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-card-foreground">2024 Forecast</span>
                    <TrendingDown className="w-4 h-4 text-destructive" />
                  </div>
                  <div className="text-lg font-bold text-destructive">-3.1%</div>
                  <div className="text-xs text-muted-foreground">Expected decline</div>
                </div>
                
                <div className="p-4 bg-teal-accent/10 rounded-lg border border-teal-accent/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-card-foreground">Monsoon Impact</span>
                    <TrendingUp className="w-4 h-4 text-teal-accent" />
                  </div>
                  <div className="text-lg font-bold text-teal-accent">+15%</div>
                  <div className="text-xs text-muted-foreground">Seasonal recharge</div>
                </div>
              </div>

              <Button onClick={() => navigate("/login")}className="w-full bg-deep-sea hover:bg-deep-sea/90 text-white" >
                View Detailed Analytics
              </Button>
            </div>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-6">
            Ready to explore comprehensive groundwater analytics?
          </p>
          <Button
            onClick={() => navigate("/login")}
            size="lg"
            className="bg-gradient-to-r from-deep-sea to-teal-accent hover:from-deep-sea/90 hover:to-teal-accent/90 text-white font-semibold px-8 py-6 text-lg rounded-xl shadow-ocean"
          >
            Access Full Dashboard
          </Button>
        </div>
      </div>
    </section>
  );
};
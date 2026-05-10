import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { BASE_URL } from '@/config';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  BarChart3,
  RefreshCw,
  Filter,
  Calendar,
  MapPin,
  AlertTriangle,
  Droplets,
  Zap,
  Layers
} from 'lucide-react';

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#6366f1', '#8b5cf6'];

export default function AnalysisPage() {
  const [selectedRegion, setSelectedRegion] = useState('INDIA');
  const [regions, setRegions] = useState<any[]>([]);
  const [yearRange, setYearRange] = useState([2023, 2024]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegionsLoading, setIsRegionsLoading] = useState(true);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const { toast } = useToast();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const res = await fetch(`${BASE_URL}/analytics/locations`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (res.ok) {
          setRegions(data.locations || []);
        } else {
          toast({ title: "Error", description: "Failed to fetch dynamic regions" });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsRegionsLoading(false);
      }
    };
    fetchRegions();
  }, []);

  const handleAnalyze = async () => {
    if (!token) {
      toast({ title: "Error", description: "Please login to perform analysis" });
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/analytics/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          location: selectedRegion,
          year: `${yearRange[0]}-${yearRange[1]}`
        })
      });

      const data = await res.json();
      if (res.ok) {
        setAnalysisData(data.analytics);
        toast({ title: "Analysis Complete", description: `Data fetched for ${selectedRegion}` });
      } else {
        toast({ title: "Error", description: data.error || "Failed to fetch analysis" });
      }
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Network error fetching analysis" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Data Analysis</h1>
          <p className="text-muted-foreground mt-1">
            Deep analytical insights powered by AI and INGRES groundwater models.
          </p>
        </div>
        
        <Button onClick={handleAnalyze} disabled={isLoading} size="lg" className="shadow-lg hover:shadow-primary/20 transition-all">
          {isLoading ? (
            <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
          ) : (
            <BarChart3 className="h-5 w-5 mr-2" />
          )}
          {isLoading ? "Analyzing..." : "Generate Analysis"}
        </Button>
      </motion.div>

      {/* Controls */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                Region
              </label>
              <Select value={selectedRegion} onValueChange={setSelectedRegion} disabled={isRegionsLoading}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder={isRegionsLoading ? "Loading regions..." : "Select Region"} />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((region: any) => (
                    <SelectItem key={region.value} value={region.value}>
                      {region.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  Time Period
                </label>
                <Badge variant="secondary" className="font-mono">
                  {yearRange[0]} - {yearRange[1]}
                </Badge>
              </div>
              <Slider
                value={yearRange}
                onValueChange={setYearRange}
                max={2025}
                min={2010}
                step={1}
                className="py-4"
              />
            </div>

            <div className="flex items-end">
               <div className="text-xs text-muted-foreground p-3 bg-muted/30 rounded-lg flex items-center gap-2">
                 <Filter className="h-3 w-3" />
                 Currently using GEC Assessment Models
               </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results and Insights */}
      <AnimatePresence mode="wait">
        {analysisData ? (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Top Insights Card - Standardized with Chat Look */}
            <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardHeader className="border-b border-primary/10">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  AI Intelligence Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { icon: AlertTriangle, text: analysisData.stress.insight, title: "Risk Level", color: "text-red-500" },
                    { icon: Droplets, text: analysisData.consumption.insight, title: "Consumption Pattern", color: "text-blue-500" },
                    { icon: RefreshCw, text: analysisData.recharge.insight, title: "Recharge Dynamics", color: "text-emerald-500" },
                    { icon: Layers, text: analysisData.disparity.insight, title: "Infrastructure Disparity", color: "text-indigo-500" }
                  ].map((item, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="p-4 bg-background/80 backdrop-blur shadow-sm rounded-xl border border-border flex gap-4 hover:border-primary/30 transition-colors"
                    >
                      <div className={`p-2 bg-muted rounded-lg h-fit ${item.color}`}>
                        <item.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm mb-1">{item.title}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">{item.text}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Stress Analysis (Donut Chart) */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    Groundwater Stress Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={Object.entries(analysisData.stress.raw_counts).map(([name, value]) => ({ 
                          name: name.replace('_', ' ').toUpperCase(), 
                          value: Number(value) 
                        }))}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={100}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {Object.entries(analysisData.stress.raw_counts).map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      />
                      <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Sectoral Consumption (Horizontal Bar) */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Layers className="h-4 w-4 text-primary" />
                    Sectoral Usage Percentages
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={Object.entries(analysisData.consumption.percentages).map(([name, value]) => ({ 
                        name: name.toUpperCase(), 
                        percentage: Number(value) 
                      }))}
                      margin={{ left: 50, right: 30 }}
                    >
                      <XAxis type="number" unit="%" hide />
                      <YAxis dataKey="name" type="category" width={100} axisLine={false} tickLine={false} />
                      <Tooltip cursor={{ fill: 'transparent' }} />
                      <Bar 
                        dataKey="percentage" 
                        fill="#6366f1" 
                        radius={[0, 10, 10, 0]} 
                        barSize={32}
                        label={{ position: 'right', formatter: (v: any) => `${v}%`, fontSize: 12 }} 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Recharge Efficiency (Stacked Bar) */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-primary" />
                    Recharge Composition Mix
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[{
                        name: 'Recharge Sources',
                        Natural: analysisData.recharge.recharge_mix.natural,
                        Artificial: analysisData.recharge.recharge_mix.artificial
                      }]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Natural" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="Artificial" stackId="a" fill="#3b82f6" radius={[10, 10, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Command Disparity (Comparison Bar) */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-primary" />
                    Command vs Non-Command SOE
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: 'Command Area', value: Number(analysisData.disparity.extraction_levels.command).toFixed(1) },
                        { name: 'Non-Command', value: Number(analysisData.disparity.extraction_levels.non_command).toFixed(1) }
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <XAxis dataKey="name" />
                      <YAxis unit="%" />
                      <Tooltip />
                      <Bar 
                         dataKey="value" 
                         fill="#ef4444" 
                         radius={[10, 10, 0, 0]} 
                         barSize={60}
                         label={{ position: 'top', formatter: (v: any) => `${v}%` }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-border rounded-3xl"
          >
            <div className="bg-primary/10 rounded-full p-8 mb-6">
              <BarChart3 className="h-16 w-16 text-primary animate-pulse" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Insights Are Waiting</h3>
            <p className="text-muted-foreground max-w-md mb-8 leading-relaxed">
              Select a region and assessment period. INGRES AI will generate a comprehensive 4-point analysis of groundwater health.
            </p>
            <Button onClick={handleAnalyze} size="lg" className="px-10 h-14 rounded-full text-lg font-medium shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
              Begin Analysis
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
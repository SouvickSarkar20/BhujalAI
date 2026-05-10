import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import {
  TrendingUp,
  Brain,
  AlertTriangle,
  Play,
  Download,
  Settings,
  MapPin,
  Calendar,
  Target
} from 'lucide-react';

const regions = [
  { value: 'raj', label: 'Rajasthan' },
  { value: 'mah', label: 'Maharashtra' },
  { value: 'pun', label: 'Punjab' },
  { value: 'kar', label: 'Karnataka' },
  { value: 'guj', label: 'Gujarat' },
];

const models = [
  { value: 'prophet', label: 'Prophet', description: 'Facebook\'s time series forecasting' },
  { value: 'lstm', label: 'LSTM', description: 'Long Short-Term Memory neural network' },
  { value: 'arima', label: 'ARIMA', description: 'AutoRegressive Integrated Moving Average' },
];

const scenarios = [
  { value: 'baseline', label: 'Baseline', description: 'Current extraction rates continue' },
  { value: 'conservative', label: 'Conservative (-10%)', description: '10% reduction in extraction' },
  { value: 'aggressive', label: 'Aggressive (-20%)', description: '20% reduction in extraction' },
  { value: 'increase', label: 'Increased (+10%)', description: '10% increase in extraction' },
];

const riskBlocks = [
  { name: 'Jaipur District - Block A', risk: 'High', probability: 85, timeline: '2-3 years' },
  { name: 'Jodhpur District - Block C', risk: 'Critical', probability: 92, timeline: '1-2 years' },
  { name: 'Bikaner District - Block B', risk: 'High', probability: 78, timeline: '3-4 years' },
  { name: 'Udaipur District - Block D', risk: 'Medium', probability: 65, timeline: '4-5 years' },
];

export default function ForecastingPage() {
  const [selectedRegion, setSelectedRegion] = useState('raj');
  const [selectedModel, setSelectedModel] = useState('prophet');
  const [selectedScenario, setSelectedScenario] = useState('baseline');
  const [historyYears, setHistoryYears] = useState('10');
  const [forecastYears, setForecastYears] = useState('5');
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<any>(null);
  
  const { toast } = useToast();

  const handleRunForecast = async () => {
    setIsRunning(true);
    setProgress(0);
    setResults(null);

    // Simulate model training and prediction
    const steps = [
      { step: 'Loading historical data...', duration: 1000 },
      { step: 'Preprocessing data...', duration: 800 },
      { step: 'Training model...', duration: 2000 },
      { step: 'Generating predictions...', duration: 1200 },
      { step: 'Calculating confidence intervals...', duration: 800 },
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, steps[i].duration));
      setProgress((i + 1) / steps.length * 100);
    }

    // Mock results
    setResults({
      forecast: [
        { year: 2025, value: 12.3, lower: 10.8, upper: 13.8 },
        { year: 2026, value: 11.9, lower: 10.2, upper: 13.6 },
        { year: 2027, value: 11.5, lower: 9.6, upper: 13.4 },
        { year: 2028, value: 11.1, lower: 9.0, upper: 13.2 },
        { year: 2029, value: 10.7, lower: 8.4, upper: 13.0 },
      ],
      confidence: 90,
      modelAccuracy: 0.847,
      note: 'Forecast shows continued depletion trend with seasonal variations'
    });

    setIsRunning(false);
    toast({
      title: "Forecast Complete",
      description: "Groundwater level predictions have been generated successfully.",
    });
  };

  const handleExportResults = () => {
    toast({
      title: "Exporting Results",
      description: "Forecast data and charts are being prepared for download.",
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold">Groundwater Forecasting</h1>
          <p className="text-muted-foreground">
            Predict future groundwater levels using advanced machine learning models
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleExportResults} disabled={!results}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleRunForecast} disabled={isRunning}>
            {isRunning ? (
              <Settings className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Play className="h-4 w-4 mr-2" />
            )}
            {isRunning ? 'Running...' : 'Run Forecast'}
          </Button>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-1"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Forecast Configuration</span>
              </CardTitle>
              <CardDescription>
                Set up your forecasting parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Region Selection */}
              <div className="space-y-2">
                <Label className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>Target Region</span>
                </Label>
                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((region) => (
                      <SelectItem key={region.value} value={region.value}>
                        {region.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Model Selection */}
              <div className="space-y-2">
                <Label className="flex items-center space-x-2">
                  <Brain className="h-4 w-4" />
                  <span>Prediction Model</span>
                </Label>
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {models.map((model) => (
                      <SelectItem key={model.value} value={model.value}>
                        <div>
                          <div className="font-medium">{model.label}</div>
                          <div className="text-xs text-muted-foreground">{model.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Scenario Selection */}
              <div className="space-y-2">
                <Label className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>Scenario</span>
                </Label>
                <Select value={selectedScenario} onValueChange={setSelectedScenario}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {scenarios.map((scenario) => (
                      <SelectItem key={scenario.value} value={scenario.value}>
                        <div>
                          <div className="font-medium">{scenario.label}</div>
                          <div className="text-xs text-muted-foreground">{scenario.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Time Parameters */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>History</span>
                  </Label>
                  <Select value={historyYears} onValueChange={setHistoryYears}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 years</SelectItem>
                      <SelectItem value="10">10 years</SelectItem>
                      <SelectItem value="15">15 years</SelectItem>
                      <SelectItem value="20">20 years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center space-x-2">
                    <Target className="h-4 w-4" />
                    <span>Forecast</span>
                  </Label>
                  <Select value={forecastYears} onValueChange={setForecastYears}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 years</SelectItem>
                      <SelectItem value="5">5 years</SelectItem>
                      <SelectItem value="10">10 years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Progress Bar */}
              {isRunning && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Processing...</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Results Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Forecast Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Forecast Results</CardTitle>
              <CardDescription>
                Predicted groundwater levels with confidence intervals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
                {isRunning ? (
                  <div className="text-center">
                    <Settings className="h-12 w-12 mx-auto mb-4 animate-spin text-primary" />
                    <p className="font-medium">Running {selectedModel.toUpperCase()} model...</p>
                    <p className="text-sm text-muted-foreground">This may take a few moments</p>
                  </div>
                ) : results ? (
                  <div className="w-full text-center">
                    <TrendingUp className="h-12 w-12 mx-auto mb-4 text-primary" />
                    <p className="font-medium mb-2">Forecast Complete</p>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Model Accuracy</p>
                        <p className="font-bold">{(results.modelAccuracy * 100).toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Confidence</p>
                        <p className="font-bold">{results.confidence}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Trend</p>
                        <p className="font-bold text-red-500">Declining</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground">
                    <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Configure parameters and run forecast</p>
                    <p className="text-sm">Results will appear here</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Risk Assessment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                <span>Risk Assessment</span>
              </CardTitle>
              <CardDescription>
                High-risk blocks requiring immediate attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {riskBlocks.map((block, index) => (
                  <motion.div
                    key={block.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-muted/20 rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{block.name}</h4>
                      <p className="text-xs text-muted-foreground">Depletion risk in {block.timeline}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right text-xs">
                        <p className="font-medium">{block.probability}%</p>
                        <p className="text-muted-foreground">probability</p>
                      </div>
                      <Badge 
                        variant={
                          block.risk === 'Critical' ? 'destructive' :
                          block.risk === 'High' ? 'default' : 'secondary'
                        }
                        className="text-xs"
                      >
                        {block.risk}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Model Info */}
          {results && (
            <Card>
              <CardHeader>
                <CardTitle>Model Information</CardTitle>
                <CardDescription>
                  Details about the forecasting model and assumptions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium mb-2">Model Details</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Algorithm: {models.find(m => m.value === selectedModel)?.label}</li>
                      <li>• Training period: {historyYears} years</li>
                      <li>• Forecast horizon: {forecastYears} years</li>
                      <li>• Scenario: {scenarios.find(s => s.value === selectedScenario)?.label}</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Key Assumptions</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Climate patterns remain consistent</li>
                      <li>• Population growth follows current trends</li>
                      <li>• No major policy interventions</li>
                      <li>• Historical data quality maintained</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    <strong>Note:</strong> {results.note}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}
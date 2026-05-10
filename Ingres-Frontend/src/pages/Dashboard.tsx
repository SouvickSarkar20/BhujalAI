import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import {
  MessageSquare,
  Folder,
  BarChart3,
  TrendingUp,
  Droplet,
  Activity,
  Users,
  Globe
} from 'lucide-react';

const quickActions = [
  {
    icon: MessageSquare,
    title: 'Start New Chat',
    description: 'Ask questions about groundwater data',
    path: '/dashboard/chat',
    color: 'from-blue-500 to-blue-600'
  },
  {
    icon: BarChart3,
    title: 'View Analysis',
    description: 'Explore data trends and insights',
    path: '/dashboard/analysis',
    color: 'from-green-500 to-green-600'
  },
  {
    icon: TrendingUp,
    title: 'Generate Forecast',
    description: 'Predict future groundwater levels',
    path: '/dashboard/forecasting',
    color: 'from-purple-500 to-purple-600'
  },
  {
    icon: Folder,
    title: 'My Spaces',
    description: 'Organize and save your work',
    path: '/dashboard/spaces',
    color: 'from-orange-500 to-orange-600'
  }
];

const stats = [
  {
    icon: Droplet,
    label: 'Data Points',
    value: '2.4M+',
    description: 'Groundwater measurements'
  },
  {
    icon: Activity,
    label: 'Active Monitoring',
    value: '15,000+',
    description: 'Well stations across India'
  },
  {
    icon: Users,
    label: 'Communities',
    value: '500+',
    description: 'Benefiting from insights'
  },
  {
    icon: Globe,
    label: 'Coverage',
    value: '28 States',
    description: 'Pan-India monitoring'
  }
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="p-6 space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">
            Welcome back, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-muted-foreground">
            Ready to explore India's groundwater intelligence? Here's what you can do today.
          </p>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {stats.map((stat, index) => (
          <Card key={stat.label} className="text-center">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-2">
                <div className="p-2 bg-primary/10 rounded-full">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm font-medium">{stat.label}</p>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="space-y-4"
      >
        <h2 className="text-xl font-semibold">Quick Actions</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className="cursor-pointer h-full transition-colors hover:bg-accent/50"
                onClick={() => navigate(action.path)}
              >
                <CardHeader className="pb-2">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${action.color} flex items-center justify-center mb-4`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{action.title}</CardTitle>
                  <CardDescription>{action.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="w-full justify-start p-0 h-auto">
                    Get started →
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="space-y-4"
      >
        <h2 className="text-xl font-semibold">Recent Activity</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No recent activity yet.</p>
              <p className="text-sm">Start a chat or create an analysis to see your activity here.</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
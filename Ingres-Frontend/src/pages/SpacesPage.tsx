import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Plus,
  Search,
  Download,
  Share2,
  Settings,
  Folder,
  MessageSquare,
  BarChart3,
  Calendar,
  MoreVertical
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Space {
  id: string;
  name: string;
  description: string;
  chatCount: number;
  chartCount: number;
  lastModified: Date;
  thumbnail?: string;
  tags: string[];
}

const mockSpaces: Space[] = [
  {
    id: '1',
    name: 'Rajasthan Water Crisis 2023',
    description: 'Comprehensive analysis of groundwater depletion in western Rajasthan districts',
    chatCount: 15,
    chartCount: 8,
    lastModified: new Date('2025-09-15'),
    tags: ['Rajasthan', 'Crisis', '2023']
  },
  {
    id: '2',
    name: 'Maharashtra Drought Study',
    description: 'Multi-year drought impact assessment and prediction models',
    chatCount: 12,
    chartCount: 6,
    lastModified: new Date('2025-09-10'),
    tags: ['Maharashtra', 'Drought', 'Prediction']
  },
  {
    id: '3',
    name: 'Punjab Agricultural Impact',
    description: 'Groundwater usage patterns in agricultural regions of Punjab',
    chatCount: 9,
    chartCount: 4,
    lastModified: new Date('2025-09-05'),
    tags: ['Punjab', 'Agriculture', 'Usage']
  },
  {
    id: '4',
    name: 'Karnataka Urban Planning',
    description: 'Urban groundwater management strategies for Bangalore region',
    chatCount: 7,
    chartCount: 5,
    lastModified: new Date('2025-09-01'),
    tags: ['Karnataka', 'Urban', 'Planning']
  }
];

export default function SpacesPage() {
  const [spaces, setSpaces] = useState<Space[]>(mockSpaces);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { toast } = useToast();

  const filteredSpaces = spaces.filter(space =>
    space.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    space.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    space.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCreateSpace = () => {
    toast({
      title: "Create New Space",
      description: "Feature coming soon - create and organize your workspace.",
    });
  };

  const handleExportSpace = (spaceId: string) => {
    toast({
      title: "Exporting Space",
      description: "Preparing PDF export with all charts and conversations...",
    });
  };

  const handleShareSpace = (spaceId: string) => {
    toast({
      title: "Share Space",
      description: "Share link copied to clipboard.",
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
          <h1 className="text-3xl font-bold">My Spaces</h1>
          <p className="text-muted-foreground">
            Organize your chats, analyses, and insights into collaborative workspaces
          </p>
        </div>
        
        <Button onClick={handleCreateSpace} className="space-x-2">
          <Plus className="h-4 w-4" />
          <span>New Space</span>
        </Button>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex items-center justify-between space-x-4"
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search spaces..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            Grid
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            List
          </Button>
        </div>
      </motion.div>

      {/* Spaces Grid/List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {filteredSpaces.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Folder className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No spaces found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery ? 'Try adjusting your search terms' : 'Create your first space to get started'}
                </p>
                <Button onClick={handleCreateSpace}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Space
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'space-y-4'
          }>
            {filteredSpaces.map((space, index) => (
              <motion.div
                key={space.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card className="h-full cursor-pointer hover:bg-accent/50 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{space.name}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {space.description}
                        </CardDescription>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleShareSpace(space.id)}>
                            <Share2 className="mr-2 h-4 w-4" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleExportSpace(space.id)}>
                            <Download className="mr-2 h-4 w-4" />
                            Export PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1 text-muted-foreground">
                          <MessageSquare className="h-4 w-4" />
                          <span>{space.chatCount} chats</span>
                        </div>
                        <div className="flex items-center space-x-1 text-muted-foreground">
                          <BarChart3 className="h-4 w-4" />
                          <span>{space.chartCount} charts</span>
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {space.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Last Modified */}
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground pt-2 border-t border-border">
                      <Calendar className="h-3 w-3" />
                      <span>Modified {space.lastModified.toLocaleDateString()}</span>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex items-center space-x-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        Open
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExportSpace(space.id);
                        }}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShareSpace(space.id);
                        }}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
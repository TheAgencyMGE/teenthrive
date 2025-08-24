import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/enhanced-button';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  Gamepad2, 
  Users, 
  TrendingUp, 
  Sparkles,
  Home
} from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  sessionProgress: {
    skillsAttempted: Array<any>;
    achievementsUnlocked: string[];
    confidenceScore: number;
  };
}

const navItems = [
  { 
    id: 'dashboard', 
    label: 'Home', 
    icon: Home,
    description: 'Your independence journey starts here'
  },
  { 
    id: 'coach', 
    label: 'AI Coach', 
    icon: MessageCircle,
    description: 'Get personalized guidance'
  },
  { 
    id: 'challenges', 
    label: 'Challenges', 
    icon: Gamepad2,
    description: 'Practice with fun scenarios'
  },
  { 
    id: 'peers', 
    label: 'Peer Support', 
    icon: Users,
    description: 'Connect with other teens'
  },
  { 
    id: 'resources', 
    label: 'Resources', 
    icon: TrendingUp,
    description: 'Helpful guides and safety info'
  }
];

export const Navigation: React.FC<NavigationProps> = ({ 
  activeTab, 
  onTabChange, 
  sessionProgress 
}) => {
  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-8 h-8 rounded-full gradient-hero flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              TeenThrive
            </span>
          </motion.div>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <motion.div
                  key={item.id}
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                >
                  <Button
                    variant={isActive ? "teen" : "ghost"}
                    size="sm"
                    onClick={() => onTabChange(item.id)}
                    className="relative group"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                    
                    {/* Progress indicators */}
                    {item.id === 'coach' && sessionProgress.skillsAttempted.length > 0 && (
                      <Badge variant="secondary" className="ml-2 h-5 text-xs">
                        {sessionProgress.skillsAttempted.length}
                      </Badge>
                    )}
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-popover border border-border rounded-md text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                      {item.description}
                    </div>
                  </Button>
                </motion.div>
              );
            })}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm">
              <Sparkles className="h-4 w-4" />
            </Button>
          </div>

          {/* Session indicator */}
          <div className="hidden lg:flex items-center gap-3 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-muted-foreground">Session Active</span>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className="md:hidden border-t border-border/50">
          <div className="flex items-center justify-around py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "teen" : "ghost"}
                  size="sm"
                  onClick={() => onTabChange(item.id)}
                  className="flex-col h-auto py-2 px-3"
                >
                  <Icon className="h-4 w-4 mb-1" />
                  <span className="text-xs">{item.label}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};
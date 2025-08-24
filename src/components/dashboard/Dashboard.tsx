import React from 'react';
import { motion } from 'framer-motion';
import heroImage from '@/assets/hero-image.jpg';
import { Button } from '@/components/ui/enhanced-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/enhanced-card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Sparkles, 
  MessageCircle, 
  Gamepad2, 
  Users, 
  TrendingUp,
  Star,
  Target,
  Zap,
  Heart,
  BookOpen
} from 'lucide-react';

interface DashboardProps {
  onNavigate: (tab: string) => void;
  sessionProgress: {
    skillsAttempted: Array<any>;
    achievementsUnlocked: string[];
    confidenceScore: number;
    engagementLevel: number;
    timeSpent: number;
  };
}

const quickActions = [
  {
    id: 'coach',
    title: 'Talk to AI Coach',
    description: 'Get instant guidance for any independence challenge',
    icon: MessageCircle,
    color: 'text-primary',
    bgColor: 'bg-primary/10'
  },
  {
    id: 'challenges',
    title: 'Try a Challenge',
    description: 'Practice real-world skills in a safe environment',
    icon: Gamepad2,
    color: 'text-secondary',
    bgColor: 'bg-secondary/10'
  },
  {
    id: 'peers',
    title: 'Connect with Peers',
    description: 'Join supportive communities of teens like you',
    icon: Users,
    color: 'text-accent',
    bgColor: 'bg-accent/10'
  }
];

const skillAreas = [
  { name: 'Financial Literacy', emoji: '💰', progress: 0 },
  { name: 'Life Skills', emoji: '🏠', progress: 0 },
  { name: 'Decision Making', emoji: '🤔', progress: 0 },
  { name: 'Social Skills', emoji: '👥', progress: 0 },
  { name: 'Emotional Health', emoji: '💙', progress: 0 },
  { name: 'Career Prep', emoji: '🚀', progress: 0 }
];

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate, sessionProgress }) => {
  const hasActivity = sessionProgress.skillsAttempted.length > 0;

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card variant="gradient" size="xl" className="text-center">
          <CardContent className="py-12">
            <motion.div
              className="inline-block mb-6"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <div className="w-20 h-20 mx-auto gradient-hero rounded-2xl flex items-center justify-center shadow-glow">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Welcome to{' '}
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                TeenThrive
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Your AI-powered independence coach! Build real-world skills, connect with peers, 
              and gain confidence in a safe, supportive environment designed just for teens.
            </p>

            {!hasActivity ? (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="hero" 
                  size="xl"
                  onClick={() => onNavigate('coach')}
                  className="shadow-glow"
                >
                  <Sparkles className="h-5 w-5" />
                  Start Your Independence Journey
                </Button>
              </motion.div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="teen" 
                  size="lg"
                  onClick={() => onNavigate('progress')}
                >
                  <TrendingUp className="h-5 w-5" />
                  View Your Progress
                </Button>
                <Button 
                  variant="accent" 
                  size="lg"
                  onClick={() => onNavigate('challenges')}
                >
                  <Zap className="h-5 w-5" />
                  Continue Learning
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Session Overview (if active) */}
      {hasActivity && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card variant="teen" size="lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-6 w-6 text-primary" />
                Your Session So Far
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {sessionProgress.skillsAttempted.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Skills Practiced</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent mb-1">
                    {Math.round(sessionProgress.timeSpent)}m
                  </div>
                  <div className="text-sm text-muted-foreground">Time Invested</div>
                </div>
              </div>
              
              {sessionProgress.achievementsUnlocked.length > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    Recent Achievements
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {sessionProgress.achievementsUnlocked.map((achievement, index) => (
                      <Badge key={index} variant="secondary">
                        {achievement}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">What Would You Like to Do?</h2>
          <p className="text-muted-foreground">Choose your path to independence</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card 
                  variant="float" 
                  className="cursor-pointer h-full hover:border-primary/50 transition-smooth"
                  onClick={() => onNavigate(action.id)}
                >
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl ${action.bgColor} flex items-center justify-center`}>
                      <Icon className={`h-8 w-8 ${action.color}`} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{action.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{action.description}</p>
                    <Button variant="outline" size="sm">
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Skill Areas Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <Card variant="default" size="lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              Independence Skill Areas
            </CardTitle>
            <p className="text-muted-foreground">
              Explore different areas where you can build independence
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {skillAreas.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.7 + index * 0.05 }}
                  className="p-4 rounded-lg border border-border/50 hover:border-primary/30 transition-smooth"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{skill.emoji}</span>
                    <h4 className="font-medium">{skill.name}</h4>
                  </div>
                  <Progress value={skill.progress} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2">
                    Ready to explore
                  </p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Encouragement Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <Card variant="glow" className="text-center">
          <CardContent className="py-8">
            <Heart className="h-12 w-12 text-accent mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">You've Got This! 💪</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Every expert was once a beginner. Your independence journey starts with a single step, 
              and we're here to support you every step of the way.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
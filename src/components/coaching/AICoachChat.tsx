import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/enhanced-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/enhanced-card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAICoach } from '@/hooks/useAICoach';
import { SkillCategory } from '@/types/coaching';
import { 
  MessageCircle, 
  Send, 
  Sparkles, 
  Target, 
  CheckCircle,
  AlertCircle,
  Star,
  TrendingUp
} from 'lucide-react';

const skillCategories: { id: SkillCategory; name: string; emoji: string }[] = [
  { id: 'financial', name: 'Money Management', emoji: '💰' },
  { id: 'life-skills', name: 'Daily Life Skills', emoji: '🏠' },
  { id: 'decision-making', name: 'Decision Making', emoji: '🤔' },
  { id: 'emotional', name: 'Emotional Health', emoji: '💙' },
  { id: 'social', name: 'Social Skills', emoji: '👥' },
  { id: 'academic', name: 'Study & Learning', emoji: '📚' },
  { id: 'career', name: 'Career Prep', emoji: '🚀' }
];

export const AICoachChat: React.FC = () => {
  const [challenge, setChallenge] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory>('life-skills');
  const { isLoading, currentCoaching, sessionProgress, getCoaching } = useAICoach();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!challenge.trim()) return;
    
    await getCoaching(challenge, selectedCategory);
    setChallenge('');
  };

  return (
    <div className="space-y-6">
      {/* Category Selection */}
      <Card variant="teen" size="sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Target className="h-5 w-5 text-primary" />
            What area do you want to work on?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {skillCategories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "teen" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="justify-start"
              >
                <span className="mr-2">{category.emoji}</span>
                {category.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chat Input */}
      <Card variant="glow">
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              <span className="font-medium">Tell your AI coach what you're working on:</span>
            </div>
            <div className="flex gap-2">
              <Input
                value={challenge}
                onChange={(e) => setChallenge(e.target.value)}
                placeholder="e.g., I want to learn how to budget my allowance..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button 
                type="submit" 
                variant="teen" 
                disabled={isLoading || !challenge.trim()}
              >
                {isLoading ? <Sparkles className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {isLoading ? 'Thinking...' : 'Send'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* AI Response */}
      <AnimatePresence>
        {currentCoaching && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <Card variant="gradient" size="lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-primary animate-pulse" />
                  Your AI Independence Coach
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Confidence Booster */}
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-5 w-5 text-primary" />
                    <span className="font-semibold text-primary">Confidence Boost</span>
                  </div>
                  <p className="text-sm">{currentCoaching.confidenceBooster}</p>
                </div>

                {/* Step by Step Actions */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="h-5 w-5 text-secondary" />
                    <span className="font-semibold">Your Action Plan</span>
                  </div>
                  <div className="space-y-2">
                    {currentCoaching.stepByStepAction.map((step, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3 p-3 rounded-lg bg-secondary/10"
                      >
                        <Badge variant="secondary" className="mt-0.5">
                          {index + 1}
                        </Badge>
                        <span className="text-sm flex-1">{step}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Real World Application */}
                <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-accent" />
                    <span className="font-semibold text-accent">Why This Matters</span>
                  </div>
                  <p className="text-sm">{currentCoaching.realWorldApplication}</p>
                </div>

                {/* Common Challenges */}
                {currentCoaching.commonChallenges.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <AlertCircle className="h-5 w-5 text-muted-foreground" />
                      <span className="font-semibold">You're Not Alone</span>
                    </div>
                    <div className="space-y-2">
                      {currentCoaching.commonChallenges.map((challenge, index) => (
                        <div key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary">•</span>
                          {challenge}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Next Steps */}
                {currentCoaching.nextSteps.length > 0 && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-3 text-primary">What's Next?</h4>
                    <div className="grid gap-2">
                      {currentCoaching.nextSteps.map((step, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="justify-start text-left h-auto p-3"
                        >
                          {step}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Session Progress */}
      {sessionProgress && (
        <Card variant="float" size="sm">
          <CardContent>
            <div className="flex items-center justify-between text-sm">
              <span>Session Progress:</span>
              <div className="flex items-center gap-4">
                <span>Skills Tried: {sessionProgress.skillsAttempted?.length || 0}</span>
                <span>Time: {Math.round((sessionProgress.timeSpent || 0))} min</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
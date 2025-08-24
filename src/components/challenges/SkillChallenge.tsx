import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/enhanced-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/enhanced-card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useSkillChallenge } from '@/hooks/useSkillChallenge';
import { SkillCategory } from '@/types/coaching';
import { 
  Gamepad2, 
  Zap, 
  Trophy, 
  ChevronRight,
  Star,
  Target,
  RefreshCw,
  Sparkles
} from 'lucide-react';

const challengeTypes = [
  { 
    id: 'financial' as SkillCategory, 
    name: 'Money Master', 
    emoji: '💰',
    color: 'bg-green-500',
    description: 'Budget like a pro and save smart'
  },
  { 
    id: 'life-skills' as SkillCategory, 
    name: 'Life Ninja', 
    emoji: '🥷',
    color: 'bg-blue-500',
    description: 'Master cooking, cleaning, and daily life'
  },
  { 
    id: 'social' as SkillCategory, 
    name: 'Social Superstar', 
    emoji: '⭐',
    color: 'bg-purple-500',
    description: 'Build confidence in social situations'
  },
  { 
    id: 'decision-making' as SkillCategory, 
    name: 'Choice Champion', 
    emoji: '🎯',
    color: 'bg-orange-500',
    description: 'Make smart decisions with confidence'
  }
];

export const SkillChallenge: React.FC = () => {
  const [selectedDifficulty, setSelectedDifficulty] = useState(1);
  const [showResult, setShowResult] = useState(false);
  const { 
    currentScenario, 
    isGenerating, 
    lastAnalysis, 
    completedChallenges,
    generateScenario, 
    completeScenario,
    resetChallenge 
  } = useSkillChallenge();

  const handleStartChallenge = async (skillArea: SkillCategory) => {
    await generateScenario(skillArea, selectedDifficulty);
    setShowResult(false);
  };

  const handleChoiceSelect = (choiceId: string) => {
    if (currentScenario) {
      completeScenario(currentScenario.id, choiceId);
      setShowResult(true);
    }
  };

  const handleNewChallenge = () => {
    resetChallenge();
    setShowResult(false);
  };

  return (
    <div className="space-y-6">
      {/* Challenge Selection */}
      {!currentScenario && !isGenerating && (
        <>
          <Card variant="teen" size="lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Gamepad2 className="h-6 w-6 text-primary" />
                Independence Challenge Arena
              </CardTitle>
              <p className="text-muted-foreground">
                Practice real-world skills in a safe, gamified environment
              </p>
            </CardHeader>
            <CardContent>
              {/* Difficulty Selection */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Choose Your Difficulty Level
                </h3>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <Button
                      key={level}
                      variant={selectedDifficulty === level ? "teen" : "outline"}
                      size="sm"
                      onClick={() => setSelectedDifficulty(level)}
                    >
                      <Star className="h-4 w-4" />
                      Level {level}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Challenge Types */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {challengeTypes.map((challenge) => (
                  <motion.div
                    key={challenge.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card 
                      variant="float"
                      className="cursor-pointer hover:border-primary/50 transition-smooth"
                      onClick={() => handleStartChallenge(challenge.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-10 h-10 rounded-lg ${challenge.color} flex items-center justify-center text-2xl`}>
                            {challenge.emoji}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">{challenge.name}</h3>
                            <p className="text-sm text-muted-foreground">{challenge.description}</p>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Difficulty: Level {selectedDifficulty}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Loading State */}
      {isGenerating && (
        <Card variant="glow" size="lg">
          <CardContent className="text-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="inline-block mb-4"
            >
              <Sparkles className="h-12 w-12 text-primary" />
            </motion.div>
            <h3 className="text-xl font-semibold mb-2">Creating Your Challenge...</h3>
            <p className="text-muted-foreground">The AI is designing a personalized scenario just for you!</p>
          </CardContent>
        </Card>
      )}

      {/* Active Scenario */}
      <AnimatePresence>
        {currentScenario && !showResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card variant="gradient" size="lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-6 w-6 text-primary" />
                    {currentScenario.title}
                  </CardTitle>
                  <Badge variant="secondary">
                    Difficulty: {currentScenario.difficulty}/5
                  </Badge>
                </div>
                <p className="text-muted-foreground">{currentScenario.description}</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 rounded-lg bg-muted/50 border">
                  <h4 className="font-semibold mb-2">The Situation:</h4>
                  <p>{currentScenario.scenario}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">What would you do?</h4>
                  <div className="space-y-3">
                    {currentScenario.choices.map((choice, index) => (
                      <motion.div
                        key={choice.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Button
                          variant="outline"
                          className="w-full h-auto p-4 text-left justify-start"
                          onClick={() => handleChoiceSelect(choice.id)}
                        >
                          <div className="flex items-start gap-3">
                            <Badge variant="secondary" className="mt-1">
                              {String.fromCharCode(65 + index)}
                            </Badge>
                            <div className="flex-1">
                              <span className="block">{choice.text}</span>
                              <div className="mt-2 flex items-center gap-2">
                                {[...Array(choice.confidenceImpact)].map((_, i) => (
                                  <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                ))}
                                <span className="text-xs text-muted-foreground ml-1">
                                  Confidence Impact
                                </span>
                              </div>
                            </div>
                          </div>
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                  <h4 className="font-semibold text-accent mb-2">Why This Matters:</h4>
                  <p className="text-sm">{currentScenario.realWorldContext}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence>
        {showResult && lastAnalysis && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <Card variant="glow" size="lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-6 w-6 text-yellow-500" />
                  Challenge Complete!
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center p-6 rounded-lg bg-primary/10">
                  <h3 className="text-xl font-semibold mb-2">{lastAnalysis.encouragement}</h3>
                  <Progress 
                    value={lastAnalysis.skillLevel * 10} 
                    className="w-full max-w-xs mx-auto"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-secondary mb-3">What You Did Great:</h4>
                    <ul className="space-y-2">
                      {lastAnalysis.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <Star className="h-4 w-4 text-secondary mt-0.5 flex-shrink-0" />
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-accent mb-3">Growth Opportunities:</h4>
                    <ul className="space-y-2">
                      {lastAnalysis.improvementAreas.map((area, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <Target className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          {area}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-semibold mb-3">Ready for Your Next Challenge?</h4>
                  <p className="text-sm text-muted-foreground mb-4">{lastAnalysis.nextChallenge}</p>
                  <div className="flex gap-3">
                    <Button variant="teen" onClick={handleNewChallenge}>
                      <RefreshCw className="h-4 w-4" />
                      New Challenge
                    </Button>
                    <Button variant="outline" onClick={() => setShowResult(false)}>
                      Review Scenario
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
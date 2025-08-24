import { useState, useCallback } from 'react';
import { aiCoach } from '../services/independenceAI';
import { CoachingResponse, SkillCategory, SessionProgress } from '../types/coaching';

export const useAICoach = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentCoaching, setCurrentCoaching] = useState<CoachingResponse | null>(null);
  const [sessionProgress, setSessionProgress] = useState<Partial<SessionProgress>>({
    skillsAttempted: [],
    achievementsUnlocked: [],
    confidenceScore: 5,
    engagementLevel: 5,
    timeSpent: 0
  });

  const getCoaching = useCallback(async (
    challenge: string, 
    category: SkillCategory,
    teenAge: number = 16
  ) => {
    setIsLoading(true);
    try {
      const coaching = await aiCoach.provideInstantCoaching(
        challenge, 
        category, 
        teenAge, 
        sessionProgress
      );
      setCurrentCoaching(coaching);
      
      // Update session progress
      setSessionProgress(prev => ({
        ...prev,
        timeSpent: (prev.timeSpent || 0) + 1,
        engagementLevel: Math.min(10, (prev.engagementLevel || 5) + 0.5)
      }));
      
      return coaching;
    } catch (error) {
      console.error('Coaching error:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [sessionProgress]);

  const updateProgress = useCallback((update: Partial<SessionProgress>) => {
    setSessionProgress(prev => ({
      ...prev,
      ...update
    }));
  }, []);

  const resetSession = useCallback(() => {
    setCurrentCoaching(null);
    setSessionProgress({
      skillsAttempted: [],
      achievementsUnlocked: [],
      confidenceScore: 5,
      engagementLevel: 5,
      timeSpent: 0
    });
  }, []);

  return {
    isLoading,
    currentCoaching,
    sessionProgress,
    getCoaching,
    updateProgress,
    resetSession
  };
};
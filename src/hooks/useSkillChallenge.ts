import { useState, useCallback } from 'react';
import { aiCoach } from '../services/independenceAI';
import { InteractiveScenario, SkillCategory, SkillAttempt, InstantAnalysis } from '../types/coaching';

export const useSkillChallenge = () => {
  const [currentScenario, setCurrentScenario] = useState<InteractiveScenario | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState<InstantAnalysis | null>(null);
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);

  const generateScenario = useCallback(async (
    skillArea: SkillCategory, 
    difficulty: number = 1
  ) => {
    setIsGenerating(true);
    try {
      const scenario = await aiCoach.generateLiveScenario(skillArea, difficulty);
      setCurrentScenario(scenario);
      return scenario;
    } catch (error) {
      console.error('Scenario generation error:', error);
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const assessSkillAttempt = useCallback(async (attempt: SkillAttempt) => {
    try {
      const analysis = await aiCoach.assessCurrentSkill(attempt);
      setLastAnalysis(analysis);
      
      if (attempt.success) {
        setCompletedChallenges(prev => [...prev, attempt.skill]);
      }
      
      return analysis;
    } catch (error) {
      console.error('Skill assessment error:', error);
      return null;
    }
  }, []);

  const completeScenario = useCallback((scenarioId: string, choiceId: string) => {
    if (currentScenario) {
      const choice = currentScenario.choices.find(c => c.id === choiceId);
      if (choice) {
        setCompletedChallenges(prev => [...prev, currentScenario.id]);
        
        // Create skill attempt record
        const attempt: SkillAttempt = {
          skill: currentScenario.title,
          attempt: choice.text,
          timestamp: new Date(),
          success: choice.confidenceImpact >= 3
        };
        
        assessSkillAttempt(attempt);
      }
    }
  }, [currentScenario, assessSkillAttempt]);

  const resetChallenge = useCallback(() => {
    setCurrentScenario(null);
    setLastAnalysis(null);
  }, []);

  return {
    currentScenario,
    isGenerating,
    lastAnalysis,
    completedChallenges,
    generateScenario,
    assessSkillAttempt,
    completeScenario,
    resetChallenge
  };
};
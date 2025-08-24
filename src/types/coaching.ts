export interface CoachingSession {
  id: string;
  startTime: Date;
  skillFocus: SkillCategory;
  goals: string[];
  progress: SessionProgress;
}

export interface CoachingResponse {
  stepByStepAction: string[];
  confidenceBooster: string;
  realWorldApplication: string;
  commonChallenges: string[];
  celebrationMoments: string[];
  safetyNotes: string[];
  nextSteps: string[];
}

export interface SessionProgress {
  skillsAttempted: SkillAttempt[];
  achievementsUnlocked: string[];
  confidenceScore: number;
  engagementLevel: number;
  timeSpent: number;
}

export interface SkillAttempt {
  skill: string;
  attempt: string;
  timestamp: Date;
  feedback?: string;
  success: boolean;
}

export interface InteractiveScenario {
  id: string;
  title: string;
  description: string;
  skillCategory: SkillCategory;
  difficulty: number;
  scenario: string;
  choices: ScenarioChoice[];
  realWorldContext: string;
}

export interface ScenarioChoice {
  id: string;
  text: string;
  consequence: string;
  skillsUsed: string[];
  confidenceImpact: number;
}

export interface InstantAnalysis {
  strengths: string[];
  improvementAreas: string[];
  nextChallenge: string;
  skillLevel: number;
  encouragement: string;
}

export type SkillCategory = 
  | 'financial'
  | 'life-skills'
  | 'decision-making'
  | 'emotional'
  | 'social'
  | 'academic'
  | 'career';

export interface LifeSkill {
  id: string;
  name: string;
  category: SkillCategory;
  description: string;
  difficulty: number;
  isUnlocked: boolean;
  prerequisites: string[];
}
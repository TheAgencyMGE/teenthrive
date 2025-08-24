import { GoogleGenerativeAI } from '@google/generative-ai';
import { 
  CoachingResponse, 
  InteractiveScenario, 
  InstantAnalysis, 
  LifeSkill, 
  SkillAttempt, 
  SkillCategory,
  SessionProgress
} from '../types/coaching';

const API_KEY = import.meta.env.VITE_GOOGLE_AI_API_KEY;

export class IndependenceAICoach {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    this.genAI = new GoogleGenerativeAI(API_KEY);
    this.model = this.genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-exp" 
    });
  }

  async provideInstantCoaching(
    currentChallenge: string,
    skillCategory: SkillCategory,
    teenAge: number = 16,
    sessionContext: Partial<SessionProgress> = {}
  ): Promise<CoachingResponse> {
    try {
      const prompt = this.createCoachingPrompt(currentChallenge, skillCategory, teenAge, sessionContext);
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return this.parseCoachingResponse(text);
    } catch (error) {
      console.error('AI Coaching Error:', error);
      return this.getFallbackCoaching(currentChallenge, skillCategory);
    }
  }

  async generateLiveScenario(
    skillArea: SkillCategory, 
    difficulty: number = 1
  ): Promise<InteractiveScenario> {
    try {
      const prompt = `
        Create an interactive, realistic scenario for a teenager to practice ${skillArea} skills.
        Difficulty level: ${difficulty}/5
        
        Return JSON with:
        {
          "title": "engaging scenario title",
          "description": "brief setup",
          "scenario": "detailed realistic situation",
          "choices": [
            {
              "text": "choice option",
              "consequence": "what happens",
              "skillsUsed": ["specific skills"],
              "confidenceImpact": 1-5
            }
          ],
          "realWorldContext": "why this matters in real life"
        }
        
        Make it relatable to modern teens with current references and situations they actually face.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return this.parseScenarioResponse(text, skillArea, difficulty);
    } catch (error) {
      console.error('Scenario Generation Error:', error);
      return this.getFallbackScenario(skillArea, difficulty);
    }
  }

  async assessCurrentSkill(
    skillDemo: SkillAttempt,
    sessionFeedback: Partial<SessionProgress> = {}
  ): Promise<InstantAnalysis> {
    try {
      const prompt = `
        Analyze this teen's skill attempt and provide encouraging, constructive feedback:
        
        Skill: ${skillDemo.skill}
        Attempt: ${skillDemo.attempt}
        Context: ${JSON.stringify(sessionFeedback)}
        
        Provide supportive analysis in JSON format:
        {
          "strengths": ["specific things they did well"],
          "improvementAreas": ["gentle suggestions for growth"],
          "nextChallenge": "specific next step to try",
          "skillLevel": 1-10,
          "encouragement": "uplifting message"
        }
        
        Be encouraging, specific, and age-appropriate for teenagers.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return this.parseAnalysisResponse(text);
    } catch (error) {
      console.error('Skill Assessment Error:', error);
      return this.getFallbackAnalysis(skillDemo);
    }
  }

  private createCoachingPrompt(
    challenge: string, 
    category: SkillCategory, 
    age: number, 
    context: Partial<SessionProgress>
  ): string {
    return `
      As a supportive AI independence coach for teenagers, help this ${age}-year-old with ${category} skills:
      
      Current Challenge: ${challenge}
      Session Context: ${JSON.stringify(context)}
      
      Provide encouraging, age-appropriate guidance in JSON format with:
      {
        "stepByStepAction": ["clear, manageable steps"],
        "confidenceBooster": "positive reinforcement message",
        "realWorldApplication": "how this skill helps in daily life",
        "commonChallenges": ["what other teens struggle with"],
        "celebrationMoments": ["small wins to acknowledge"],
        "safetyNotes": ["important safety considerations"],
        "nextSteps": ["what to try next"]
      }
      
      Keep tone supportive, non-judgmental, and empowering. Focus on building confidence and practical skills.
      Use modern language that resonates with Gen Z teens.
    `;
  }

  private parseCoachingResponse(text: string): CoachingResponse {
    try {
      const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(cleanText);
      
      return {
        stepByStepAction: parsed.stepByStepAction || [],
        confidenceBooster: parsed.confidenceBooster || "You've got this! 💪",
        realWorldApplication: parsed.realWorldApplication || "This skill will help you in everyday situations.",
        commonChallenges: parsed.commonChallenges || [],
        celebrationMoments: parsed.celebrationMoments || [],
        safetyNotes: parsed.safetyNotes || [],
        nextSteps: parsed.nextSteps || []
      };
    } catch (error) {
      console.error('Parse error:', error);
      return this.getFallbackCoaching('parsing error', 'life-skills');
    }
  }

  private parseScenarioResponse(text: string, category: SkillCategory, difficulty: number): InteractiveScenario {
    try {
      const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(cleanText);
      
      return {
        id: `scenario-${Date.now()}`,
        title: parsed.title || "Independence Challenge",
        description: parsed.description || "Practice your skills!",
        skillCategory: category,
        difficulty,
        scenario: parsed.scenario || "Navigate this real-world situation.",
        choices: parsed.choices?.map((choice: any, index: number) => ({
          id: `choice-${index}`,
          text: choice.text || "Make a choice",
          consequence: choice.consequence || "See what happens next",
          skillsUsed: choice.skillsUsed || [],
          confidenceImpact: choice.confidenceImpact || 1
        })) || [],
        realWorldContext: parsed.realWorldContext || "This prepares you for real-life situations."
      };
    } catch (error) {
      console.error('Scenario parse error:', error);
      return this.getFallbackScenario(category, difficulty);
    }
  }

  private parseAnalysisResponse(text: string): InstantAnalysis {
    try {
      const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(cleanText);
      
      return {
        strengths: parsed.strengths || ["Great effort!"],
        improvementAreas: parsed.improvementAreas || ["Keep practicing"],
        nextChallenge: parsed.nextChallenge || "Try the next level",
        skillLevel: parsed.skillLevel || 5,
        encouragement: parsed.encouragement || "You're doing amazing! Keep it up! 🌟"
      };
    } catch (error) {
      console.error('Analysis parse error:', error);
      return this.getFallbackAnalysis({ skill: 'general', attempt: 'effort', timestamp: new Date(), success: true });
    }
  }

  private getFallbackCoaching(challenge: string, category: SkillCategory): CoachingResponse {
    return {
      stepByStepAction: [
        "Break this challenge into smaller parts",
        "Start with what feels most manageable",
        "Practice regularly, even for just 5 minutes"
      ],
      confidenceBooster: "Every expert was once a beginner. You're building valuable life skills! 🌟",
      realWorldApplication: "These skills will help you feel more confident and independent in daily life.",
      commonChallenges: ["Most teens find this challenging at first", "It's normal to feel uncertain"],
      celebrationMoments: ["Celebrate each small step forward", "Acknowledge your courage to try"],
      safetyNotes: ["Take your time", "Ask for help when needed", "Practice in a safe environment"],
      nextSteps: ["Start with the basics", "Practice regularly", "Build on what you learn"]
    };
  }

  private getFallbackScenario(category: SkillCategory, difficulty: number): InteractiveScenario {
    const scenarios = {
      financial: {
        title: "Budget Challenge",
        scenario: "You have $50 for the week. Plan how to spend it wisely on essentials and fun.",
        choices: [
          { text: "Make a detailed budget first", consequence: "Great planning approach!", skillsUsed: ["budgeting"], confidenceImpact: 3 },
          { text: "Buy what you want as you go", consequence: "You might run out of money early", skillsUsed: ["impulse control"], confidenceImpact: 1 }
        ]
      },
      'life-skills': {
        title: "Cooking Independence",
        scenario: "You need to prepare a healthy meal for yourself with ingredients in your kitchen.",
        choices: [
          { text: "Plan the meal and check ingredients", consequence: "Smart preparation!", skillsUsed: ["planning", "cooking"], confidenceImpact: 4 },
          { text: "Start cooking and figure it out", consequence: "You're being adventurous!", skillsUsed: ["adaptability"], confidenceImpact: 2 }
        ]
      }
    };

    const scenario = scenarios[category] || scenarios['life-skills'];
    
    return {
      id: `fallback-${Date.now()}`,
      title: scenario.title,
      description: "Practice your independence skills!",
      skillCategory: category,
      difficulty,
      scenario: scenario.scenario,
      choices: scenario.choices.map((choice, index) => ({
        id: `fallback-choice-${index}`,
        ...choice
      })),
      realWorldContext: "These situations happen in real life - practice makes perfect!"
    };
  }

  private getFallbackAnalysis(attempt: SkillAttempt): InstantAnalysis {
    return {
      strengths: ["You took initiative", "You're learning by doing", "Great effort shown"],
      improvementAreas: ["Continue practicing", "Break it into smaller steps", "Ask questions when stuck"],
      nextChallenge: "Try a similar challenge with more complexity",
      skillLevel: 5,
      encouragement: "You're on the right track! Every attempt makes you stronger and more independent! 🚀"
    };
  }
}

export const aiCoach = new IndependenceAICoach();
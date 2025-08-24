import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/enhanced-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/enhanced-card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Clock, 
  Target, 
  Star, 
  Download,
  RotateCcw,
  Trophy,
  Sparkles
} from 'lucide-react';

interface SessionProgressProps {
  sessionData: {
    skillsAttempted: Array<{ skill: string; success: boolean; timestamp: Date }>;
    achievementsUnlocked: string[];
    confidenceScore: number;
    engagementLevel: number;
    timeSpent: number;
  };
  onExportSession: () => void;
  onResetSession: () => void;
}

export const SessionProgress: React.FC<SessionProgressProps> = ({
  sessionData,
  onExportSession,
  onResetSession
}) => {
  const successRate = sessionData.skillsAttempted.length > 0 
    ? (sessionData.skillsAttempted.filter(s => s.success).length / sessionData.skillsAttempted.length) * 100 
    : 0;

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${Math.round(minutes)}m`;
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="space-y-6">
      {/* Session Overview */}
      <Card variant="gradient" size="lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="h-6 w-6 text-primary animate-pulse" />
            Your Independence Journey Today
          </CardTitle>
          <p className="text-muted-foreground">
            Track your growth and celebrate your progress toward independence
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <motion.div 
              className="text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-primary/20 flex items-center justify-center">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <div className="text-2xl font-bold text-primary">{sessionData.skillsAttempted.length}</div>
              <div className="text-sm text-muted-foreground">Skills Practiced</div>
            </motion.div>

            <motion.div 
              className="text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-secondary/20 flex items-center justify-center">
                <Trophy className="h-8 w-8 text-secondary" />
              </div>
              <div className="text-2xl font-bold text-secondary">{Math.round(successRate)}%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </motion.div>

            <motion.div 
              className="text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-muted flex items-center justify-center">
                <Clock className="h-8 w-8 text-foreground" />
              </div>
              <div className="text-2xl font-bold">{formatTime(sessionData.timeSpent)}</div>
              <div className="text-sm text-muted-foreground">Time Invested</div>
            </motion.div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Bars */}
      <Card variant="float">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Current Session Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Engagement Level</span>
              <span className="text-sm text-muted-foreground">{sessionData.engagementLevel}/10</span>
            </div>
            <Progress value={sessionData.engagementLevel * 10} className="h-3" />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Skills Success Rate</span>
              <span className="text-sm text-muted-foreground">{Math.round(successRate)}%</span>
            </div>
            <Progress value={successRate} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Skills Attempted */}
      {sessionData.skillsAttempted.length > 0 && (
        <Card variant="default">
          <CardHeader>
            <CardTitle>Skills You've Practiced Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sessionData.skillsAttempted.map((skill, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      skill.success ? 'bg-secondary' : 'bg-muted-foreground'
                    }`} />
                    <span className="font-medium">{skill.skill}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={skill.success ? "secondary" : "outline"}>
                      {skill.success ? "Success" : "Practice"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {skill.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Achievements */}
      {sessionData.achievementsUnlocked.length > 0 && (
        <Card variant="glow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Today's Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              {sessionData.achievementsUnlocked.map((achievement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20"
                >
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span className="font-medium">{achievement}</span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Session Actions */}
      <Card variant="teen">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="teen" 
              onClick={onExportSession}
              className="flex-1 sm:flex-none"
            >
              <Download className="h-4 w-4" />
              Export Session Summary
            </Button>
            <Button 
              variant="outline" 
              onClick={onResetSession}
              className="flex-1 sm:flex-none"
            >
              <RotateCcw className="h-4 w-4" />
              Start Fresh Session
            </Button>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-4">
            Your session data is private and never stored permanently
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
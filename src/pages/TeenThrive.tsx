import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation } from '@/components/navigation/Navigation';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { AICoachChat } from '@/components/coaching/AICoachChat';
import { SkillChallenge } from '@/components/challenges/SkillChallenge';
import { PeerChat } from '@/components/peer/PeerChat';
import { Resources } from '@/components/resources/Resources';
import { SafetyModal } from '@/components/safety/SafetyModal';
import { useAICoach } from '@/hooks/useAICoach';
import { exportSessionSummary, exportSessionCertificate } from '@/utils/sessionExport';
import { useToast } from '@/hooks/use-toast';

export const TeenThrive: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showSafetyModal, setShowSafetyModal] = useState(false);
  const { sessionProgress, resetSession } = useAICoach();
  const { toast } = useToast();

  // Show safety modal on first visit
  useEffect(() => {
    const hasSeenSafety = localStorage.getItem('teenthrive-safety-seen');
    if (!hasSeenSafety) {
      setShowSafetyModal(true);
      localStorage.setItem('teenthrive-safety-seen', 'true');
    }
  }, []);

  const handleExportSession = () => {
    try {
      exportSessionSummary(sessionProgress);
      toast({
        title: "Session Exported! 📄",
        description: "Your independence journey summary has been downloaded.",
      });
    } catch (error) {
      toast({
        title: "Export Error",
        description: "Sorry, there was an issue exporting your session.",
        variant: "destructive"
      });
    }
  };

  const handleResetSession = () => {
    resetSession();
    setActiveTab('dashboard');
    toast({
      title: "Fresh Start! 🌟",
      description: "Your new independence session has begun!",
    });
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            onNavigate={setActiveTab}
            sessionProgress={{
              skillsAttempted: sessionProgress.skillsAttempted || [],
              achievementsUnlocked: sessionProgress.achievementsUnlocked || [],
              confidenceScore: sessionProgress.confidenceScore || 5,
              engagementLevel: sessionProgress.engagementLevel || 5,
              timeSpent: sessionProgress.timeSpent || 0
            }}
          />
        );
      case 'coach':
        return <AICoachChat />;
      case 'challenges':
        return <SkillChallenge />;
      case 'peers':
        return <PeerChat />;
      case 'resources':
        return <Resources />;
      default:
        return (
          <Dashboard 
            onNavigate={setActiveTab}
            sessionProgress={{
              skillsAttempted: sessionProgress.skillsAttempted || [],
              achievementsUnlocked: sessionProgress.achievementsUnlocked || [],
              confidenceScore: sessionProgress.confidenceScore || 5,
              engagementLevel: sessionProgress.engagementLevel || 5,
              timeSpent: sessionProgress.timeSpent || 0
            }}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        sessionProgress={{
          skillsAttempted: sessionProgress.skillsAttempted || [],
          achievementsUnlocked: sessionProgress.achievementsUnlocked || [],
          confidenceScore: sessionProgress.confidenceScore || 5
        }}
      />
      
      <main className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderActiveTab()}
          </motion.div>
        </AnimatePresence>
      </main>
      
      {/* Floating Action Button for Quick Coach Access */}
      {activeTab !== 'coach' && (
        <motion.button
          className="fixed bottom-6 right-6 w-14 h-14 gradient-hero rounded-full shadow-glow flex items-center justify-center text-white z-40"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setActiveTab('coach')}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1, type: "spring", stiffness: 500 }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </motion.button>
      )}

      {/* Safety Modal */}
      <SafetyModal 
        isOpen={showSafetyModal} 
        onClose={() => setShowSafetyModal(false)} 
      />
    </div>
  );
};
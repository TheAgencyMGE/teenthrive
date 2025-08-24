import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/enhanced-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/enhanced-card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Heart, 
  Users, 
  MessageCircle, 
  Eye,
  Lock,
  X
} from 'lucide-react';

interface SafetyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SafetyModal: React.FC<SafetyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <Card variant="glow" size="lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Shield className="h-6 w-6 text-primary" />
                  Your Safety & Privacy Matter
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-muted-foreground">
                TeenThrive is designed to be a safe, supportive space for your independence journey
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Privacy Section */}
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Lock className="h-5 w-5 text-primary" />
                  Your Privacy is Protected
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>No personal data is stored permanently - everything is session-based</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Chat usernames are anonymous and randomly generated</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>You can export your progress but it stays on your device</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>No tracking cookies or persistent identifiers</span>
                  </li>
                </ul>
              </div>

              {/* AI Safety */}
              <div className="p-4 rounded-lg bg-secondary/10 border border-secondary/20">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-secondary" />
                  AI Coach Safety Features
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-secondary mt-1">•</span>
                    <span>Trained specifically for teen development and independence</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary mt-1">•</span>
                    <span>Cannot provide medical, legal, or emergency advice</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary mt-1">•</span>
                    <span>Encourages talking to trusted adults for serious issues</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary mt-1">•</span>
                    <span>Focuses on practical life skills and confidence building</span>
                  </li>
                </ul>
              </div>

              {/* Peer Chat Safety */}
              <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Users className="h-5 w-5 text-accent" />
                  Peer Chat Community Guidelines
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span>Be kind, supportive, and respectful to all members</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span>No sharing of personal information (real names, addresses, schools)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span>Report inappropriate behavior using the flag button</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span>Focus conversations on independence, skills, and support</span>
                  </li>
                </ul>
              </div>

              {/* Emergency Resources */}
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Heart className="h-5 w-5 text-destructive" />
                  If You Need Immediate Help
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium">Crisis/Emergency:</span>
                    <div className="mt-1">
                      <Badge variant="destructive" className="mr-2">911</Badge>
                      or your local emergency services
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">Crisis Text Line:</span>
                    <div className="mt-1">
                      <Badge variant="outline" className="mr-2">Text HOME to 741741</Badge>
                      Free, 24/7 crisis support
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">National Suicide Prevention Lifeline:</span>
                    <div className="mt-1">
                      <Badge variant="outline" className="mr-2">988</Badge>
                      Free, confidential support
                    </div>
                  </div>
                  <p className="text-muted-foreground mt-3">
                    TeenThrive is not a replacement for professional help or emergency services.
                    Always talk to a trusted adult about serious concerns.
                  </p>
                </div>
              </div>

              {/* Monitoring */}
              <div className="p-4 rounded-lg bg-muted/50 border">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Content Monitoring
                </h3>
                <p className="text-sm text-muted-foreground">
                  Our AI systems monitor conversations for safety and appropriateness. 
                  Any concerning content is flagged for review, and users who violate guidelines 
                  may be temporarily restricted from chat features.
                </p>
              </div>

              <div className="text-center pt-4">
                <Button variant="teen" onClick={onClose}>
                  I Understand - Let's Get Started!
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
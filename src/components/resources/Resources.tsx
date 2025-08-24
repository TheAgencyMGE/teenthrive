import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/enhanced-card';
import { Button } from '@/components/ui/enhanced-button';
import { Badge } from '@/components/ui/badge';
import { 
  Phone, 
  Shield, 
  BookOpen, 
  Heart, 
  AlertTriangle,
  ExternalLink,
  Lightbulb,
  Users,
  Clock,
  MapPin
} from 'lucide-react';

interface ResourceItem {
  title: string;
  description: string;
  contact?: string;
  link?: string;
  urgent?: boolean;
  category: 'crisis' | 'safety' | 'skills' | 'mental-health';
}

const emergencyResources: ResourceItem[] = [
  {
    title: "Crisis Text Line",
    description: "24/7 crisis support via text message",
    contact: "Text HOME to 741741",
    urgent: true,
    category: 'crisis'
  },
  {
    title: "National Suicide Prevention Lifeline",
    description: "Free, confidential 24/7 crisis counseling",
    contact: "988 or 1-800-273-8255",
    urgent: true,
    category: 'crisis'
  },
  {
    title: "Teen Line",
    description: "Teens helping teens with confidential support",
    contact: "Call or text: 1-800-852-8336",
    category: 'mental-health'
  }
];

const safetyResources: ResourceItem[] = [
  {
    title: "Online Safety Guide",
    description: "Tips for staying safe while building independence online",
    link: "#safety-guide",
    category: 'safety'
  },
  {
    title: "Financial Safety",
    description: "Protecting yourself from scams and financial exploitation",
    category: 'safety'
  },
  {
    title: "Personal Safety Planning",
    description: "Creating safety plans for various situations",
    category: 'safety'
  }
];

const skillResources: ResourceItem[] = [
  {
    title: "Budgeting Basics",
    description: "Simple guide to managing money as a teen",
    category: 'skills'
  },
  {
    title: "Time Management Tips",
    description: "Balancing school, work, and personal life",
    category: 'skills'
  },
  {
    title: "Communication Skills",
    description: "Having difficult conversations with confidence",
    category: 'skills'
  },
  {
    title: "Self-Care Essentials",
    description: "Building healthy habits for independence",
    category: 'skills'
  }
];

const categoryIcons = {
  crisis: AlertTriangle,
  safety: Shield,
  skills: BookOpen,
  'mental-health': Heart
};

const categoryColors = {
  crisis: 'destructive',
  safety: 'secondary',
  skills: 'default',
  'mental-health': 'teen'
} as const;

export const Resources: React.FC = () => {
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent">
          Resources & Support
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Essential resources, safety information, and helpful guides for your independence journey
        </p>
      </motion.div>

      {/* Emergency Resources */}
      <Card variant="gradient" size="lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-6 w-6" />
            Crisis & Emergency Support
          </CardTitle>
          <p className="text-muted-foreground">
            If you're in crisis or need immediate help, these resources are available 24/7
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {emergencyResources.map((resource, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-lg border border-destructive/20 bg-destructive/5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-destructive">{resource.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{resource.description}</p>
                    {resource.contact && (
                      <div className="flex items-center gap-2 mt-2">
                        <Phone className="h-4 w-4 text-destructive" />
                        <span className="font-mono text-sm font-medium">{resource.contact}</span>
                      </div>
                    )}
                  </div>
                  {resource.urgent && (
                    <Badge variant="destructive" className="ml-2">
                      URGENT
                    </Badge>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Safety Resources */}
        <Card variant="glow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-secondary" />
              Safety & Protection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {safetyResources.map((resource, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 rounded-lg bg-secondary/10 border border-secondary/20"
                >
                  <h3 className="font-medium">{resource.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{resource.description}</p>
                  {resource.link && (
                    <Button variant="ghost" size="sm" className="mt-2 p-0 h-auto text-secondary">
                      Learn More <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  )}
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Skill Building Resources */}
        <Card variant="default">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Independence Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {skillResources.map((resource, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 rounded-lg bg-muted/50"
                >
                  <h3 className="font-medium">{resource.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{resource.description}</p>
                  <Button variant="ghost" size="sm" className="mt-2 p-0 h-auto">
                    <Lightbulb className="h-3 w-3 mr-1" />
                    Quick Tips
                  </Button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Access Tools */}
      <Card variant="teen">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Session Tools & Quick Access
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Button variant="teen" className="h-auto py-4 flex-col">
              <Clock className="h-6 w-6 mb-2" />
              <span className="font-medium">Quick Safety Check</span>
              <span className="text-xs opacity-80">Am I in a safe situation?</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col">
              <MapPin className="h-6 w-6 mb-2" />
              <span className="font-medium">Local Resources</span>
              <span className="text-xs opacity-80">Find help near you</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col">
              <Heart className="h-6 w-6 mb-2" />
              <span className="font-medium">Self-Care Check</span>
              <span className="text-xs opacity-80">Quick wellness assessment</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Notice */}
      <Card variant="float">
        <CardContent className="p-6 text-center">
          <Shield className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
          <h3 className="font-semibold mb-2">Your Privacy & Safety</h3>
          <p className="text-sm text-muted-foreground">
            This app doesn't store any personal data. All conversations and activities are session-based only. 
            For crisis situations, please use the emergency contacts above or call emergency services.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
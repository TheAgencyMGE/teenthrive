import React from 'react';
import { Users, Clock, Sparkles, Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const PeerChat: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Coming Soon Header */}
      <Card className="border-2 border-dashed border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
            <Users className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Peer Support Chat
          </CardTitle>
          <Badge variant="outline" className="mx-auto w-fit bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            Coming Soon
          </Badge>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground text-lg">
            Connect with other teens on their independence journey
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="p-4 bg-background/50 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="font-medium">Anonymous Chat</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Safe, anonymous conversations with peers facing similar challenges
              </p>
            </div>
            <div className="p-4 bg-background/50 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="h-4 w-4 text-secondary" />
                <span className="font-medium">Supportive Community</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Share experiences and get encouragement from other teens
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feature Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">What to Expect</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-medium">Topic-Based Rooms</p>
                <p className="text-sm text-muted-foreground">Join conversations about specific independence skills and challenges</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-medium">Real-Time Support</p>
                <p className="text-sm text-muted-foreground">Get instant encouragement and advice from peers who understand</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-medium">Complete Privacy</p>
                <p className="text-sm text-muted-foreground">No message history stored, session-based anonymous usernames</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Temporary Alternative */}
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="text-lg">In the Meantime...</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            While we're preparing the peer chat feature, you can still connect with others through:
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Use the AI Coach to practice social scenarios</li>
            <li>• Try the Social Superstar skill challenges</li>
            <li>• Export your progress to share with trusted friends or family</li>
            <li>• Check out the Resources section for teen support communities</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
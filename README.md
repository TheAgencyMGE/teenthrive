# 🌟 TeenThrive - AI Independence Coach for Adolescents

> Empowering teenagers to develop real-world independence through AI-powered coaching, gamified challenges, and peer support.

## 🚀 Live Demo

Run locally: `npm run dev:full` (starts both client and WebSocket server)

## 📱 What is TeenThrive?

TeenThrive is an AI-powered platform that helps teenagers develop independence through interactive coaching, skill challenges, and peer support. Built with React, TypeScript, and Google's Gemini AI, it provides a safe environment for teens to practice real-world skills.

### 🎯 Core Features

- **🤖 AI Independence Coach**: Real-time personalized guidance using Google Gemini AI (gemini-2.0-flash-exp)
- **🎮 Gamified Skill Challenges**: Interactive scenarios with difficulty levels 1-5
- **👥 Anonymous Peer Support**: Coming Soon - WebSocket-powered chat rooms with real-time messaging
- **📊 Progress Tracking**: Visual skill development metrics and achievement system
- **🔒 Session-Based Privacy**: No permanent data storage - complete privacy protection
- **📄 Exportable Summaries**: Download session progress and certificates locally

## 🌟 Why TeenThrive?

### Independence Development Areas
- **💰 Financial Literacy**: Money Master challenges - budgeting, saving, and smart spending
- **🏠 Life Skills**: Life Ninja scenarios - cooking, cleaning, time management, self-care
- **🤔 Decision Making**: Choice Champion challenges - building confidence in important decisions
- **💙 Emotional Health**: Mental health tools, self-advocacy, and emotional regulation
- **👥 Social Skills**: Social Superstar scenarios - communication and relationship building
- **� Academic Skills**: Study techniques, learning strategies, and educational planning
- **�🚀 Career Preparation**: Future planning, goal setting, and career exploration

### Unique Technical Approach
- **Session-Based Architecture**: Zero persistent data storage for maximum privacy
- **AI-Powered Coaching**: Google Gemini 2.0 Flash for intelligent, contextual guidance
- **Real-Time Peer Support**: WebSocket server for instant anonymous chat connections
- **Gamified Learning**: Multi-level skill challenges with instant feedback and analysis
- **Teen-Focused UX**: Vibrant design with smooth animations and mobile-first approach

## 🛠 Technical Stack

### Frontend Architecture
- **React 18+** with TypeScript for type-safe development
- **Vite** for blazing-fast development server and optimized builds
- **Tailwind CSS** with custom teen-focused design system
- **Framer Motion** for smooth animations and engaging micro-interactions
- **Shadcn/UI + Radix UI** for accessible, customizable components
- **React Router** for client-side navigation

### AI & Real-Time Features
- **Google Gemini API** (gemini-2.0-flash-exp) for intelligent coaching responses
- **WebSocket Server** (Node.js + TypeScript) for real-time peer chat
- **Custom prompt engineering** for age-appropriate AI interactions
- **Session management** with exportable progress tracking

### Key Dependencies
```json
{
  "@google/generative-ai": "^0.24.1",
  "framer-motion": "^12.23.12",
  "react-router-dom": "^6.30.1", 
  "@tanstack/react-query": "^5.83.0",
  "lucide-react": "^0.462.0",
  "ws": "^8.18.3",
  "uuid": "^11.1.0"
}
```

### Development Tools
- **TypeScript** throughout for robust type checking
- **ESLint** with React hooks and refresh plugins
- **Concurrently** for running client + server together
- **TSX** for TypeScript execution in development

## 🎨 Design Philosophy

### Teen-Centric Design System
- **Vibrant Color Palette**: Purple (#8B5CF6) and mint green (#10B981) for energy
- **Smooth Animations**: Framer Motion for engaging micro-interactions
- **Mobile-First**: Responsive design optimized for teen device usage
- **Accessibility**: WCAG compliant with focus on readability and navigation

### Visual Elements
- **Custom gradients** and **shadow effects** for modern appeal
- **Semantic design tokens** for consistent theming
- **AI-generated imagery** optimized for teen engagement
- **Intuitive navigation** with progress indicators

## 🔒 Privacy & Safety

### Privacy Protection
- **Session-Based Architecture**: No permanent data storage
- **Anonymous Interactions**: Random usernames in peer chats
- **Local Export Only**: Progress summaries stay on user's device
- **No Tracking**: Zero persistent identifiers or cookies

### Safety Features
- **Content Moderation**: AI monitoring for appropriate conversations
- **Emergency Resources**: Built-in crisis support information
- **Safety Guidelines**: Clear community standards and reporting
- **Adult Oversight**: Encourages trusted adult involvement

### Crisis Support Integration
- **Crisis Text Line**: Text HOME to 741741
- **National Suicide Prevention Lifeline**: 988
- **Local Emergency Services**: 911
- **Professional Help Encouragement**: Clear messaging about when to seek help

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm/yarn
- Google Gemini API key (for AI coaching features)

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd teenthrive
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd server && npm install && cd ..
   ```

3. **Environment Setup**
   ```bash
   # Create .env file in root directory
   echo "VITE_GOOGLE_AI_API_KEY=your_gemini_api_key_here" > .env
   ```

4. **Start development servers**
   ```bash
   # Run both client and WebSocket server
   npm run dev:full
   
   # Or run separately:
   npm run server  # WebSocket server on port 8080
   npm run dev     # Client on port 5173
   ```

5. **Build for production**
   ```bash
   npm run build
   npm run preview
   ```

### Server Architecture
- **Client**: React app served via Vite dev server (localhost:5173)
- **WebSocket Server**: Real-time chat server (localhost:8080)
- **Concurrent Development**: Both servers run together with `npm run dev:full`

## 📁 Project Structure

```
teenthrive/
├── src/
│   ├── components/
│   │   ├── ui/                    # Shadcn/UI + enhanced components  
│   │   ├── coaching/              # AI coaching chat interface
│   │   ├── challenges/            # Gamified skill challenge system
│   │   ├── peer/                  # Real-time peer chat components
│   │   ├── progress/              # Session progress tracking
│   │   ├── navigation/            # App navigation & routing
│   │   ├── dashboard/             # Main dashboard overview
│   │   ├── resources/             # Help resources & links
│   │   └── safety/                # Privacy & safety modals
│   ├── hooks/
│   │   ├── useAICoach.ts         # AI coaching state management
│   │   ├── useSkillChallenge.ts  # Challenge generation & assessment
│   │   └── usePeerChat.ts        # WebSocket chat functionality
│   ├── services/
│   │   ├── independenceAI.ts     # Google Gemini AI integration
│   │   └── websocketService.ts   # WebSocket client connection
│   ├── types/
│   │   └── coaching.ts           # TypeScript type definitions
│   ├── utils/
│   │   └── sessionExport.ts      # Local session export utilities
│   └── pages/
│       ├── Index.tsx             # Main entry point
│       ├── TeenThrive.tsx        # Core app component
│       └── NotFound.tsx          # 404 page
├── server/
│   ├── websocket-server.ts       # WebSocket server implementation
│   ├── ChatRoomManager.ts        # Chat room state management
│   ├── PeerChatServer.ts         # Peer chat logic
│   └── types.ts                  # Server type definitions
└── public/
    └── assets/                    # Static images & icons
```

## 🌟 Core Components

### 1. AI Independence Coach (`AICoachChat.tsx`)
- **Skill Category Selection**: Choose from 7 categories (Financial, Life Skills, Decision Making, etc.)
- **Real-Time AI Conversations**: Google Gemini-powered coaching responses
- **Step-by-Step Action Plans**: Broken down into manageable tasks
- **Confidence Building**: Positive reinforcement and encouragement
- **Safety Considerations**: Built-in safety notes and crisis resources

### 2. Skill Challenges (`SkillChallenge.tsx`)
- **Challenge Types**: Money Master 💰, Life Ninja 🥷, Social Superstar ⭐, Choice Champion 🎯
- **Difficulty Levels**: Progressive challenges from level 1-5
- **Interactive Scenarios**: Real-world situations with multiple choice decisions
- **Instant Analysis**: AI-powered feedback on choices and skill development
- **Achievement System**: Track completed challenges and skill progression

### 3. Peer Support (`PeerChat.tsx`)
- **Coming Soon Feature**: Anonymous chat rooms by topic
- **Preview Interface**: Shows planned features and alternatives
- **Future Capabilities**: Real-time messaging, room management, community guidelines
- **Privacy-First Design**: No message history stored, session-based connections
- **Current Alternatives**: AI Coach social scenarios, skill challenges, resource links

### 4. Progress Tracking (`SessionProgress.tsx` + Dashboard)
- **Skill Development Metrics**: Visual progress bars and achievement badges
- **Confidence Scoring**: Track confidence levels across skill areas
- **Session Export**: Download progress summaries and certificates locally
- **Achievement Badges**: Unlock rewards for completing challenges
- **Time Tracking**: Monitor engagement and session duration

## 🎯 Target Impact

### For Teenagers
- **Increased Confidence**: Safe practice environment for real-world skills
- **Practical Skills**: Concrete abilities for daily independence
- **Peer Connection**: Supportive community of similar experiences
- **Mental Health**: Reduced anxiety around life transitions

### For Parents/Educators
- **Structured Support**: Organized approach to independence development
- **Progress Visibility**: Exportable summaries of skill development
- **Safety Assurance**: Built-in safeguards and crisis resources
- **Evidence-Based**: Grounded in adolescent development research

### Societal Benefits
- **Reduced Teen Anxiety**: Around major life transitions
- **Improved Life Skills**: Better prepared young adults
- **Stronger Communities**: Peer support extending beyond platform
- **Mental Health Support**: Early intervention and resource connection

## 🔮 Future Enhancements

### Planned Features (Phase 2)
- **Peer Chat Launch**: Anonymous topic-based chat rooms with real-time messaging
- **Voice Integration**: Hands-free AI coaching with speech recognition
- **Advanced Skill Assessment**: More sophisticated progress tracking algorithms  
- **Mentor Connection**: Connect with verified young adult mentors
- **Group Challenges**: Collaborative skill-building activities
- **Mobile App**: Native iOS/Android applications

### Technical Roadmap (Phase 3)
- **Offline Mode**: Service worker for offline AI coaching
- **Advanced Analytics**: Privacy-preserving usage insights
- **Multi-Language Support**: Internationalization for global teens
- **Integration APIs**: Connect with educational platforms and counseling services
- **Enhanced Security**: End-to-end encryption for all communications

## 🤝 Contributing

We welcome contributions that enhance teen safety, privacy, and independence development:

### Development Guidelines
1. **Safety First**: All features must prioritize teen safety and privacy protection
2. **Privacy by Design**: Maintain session-based, non-persistent data architecture
3. **Accessibility**: Ensure WCAG compliance and inclusive design practices
4. **Code Quality**: Follow TypeScript best practices and maintain test coverage

### Getting Started
```bash
# Fork the repository and create a feature branch
git checkout -b feature/your-feature-name

# Make your changes and test thoroughly
npm run dev:full  # Test both client and server
npm run build     # Ensure production build works

# Submit a pull request with detailed description
```

### Areas for Contribution
- **AI Prompt Engineering**: Improve coaching response quality
- **UI/UX Enhancements**: Better mobile experience and accessibility
- **New Skill Categories**: Expand challenge types and scenarios  
- **Testing**: Unit tests, integration tests, and E2E testing
- **Documentation**: Code comments, API docs, and user guides

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini AI** for powering intelligent coaching interactions
- **Adolescent Development Research** for informing our approach
- **Teen Safety Organizations** for crisis resource guidance
- **Open Source Community** for the amazing tools and libraries

---

**TeenThrive** - Empowering teenagers with AI-driven independence coaching! 🌟

*Built with React, TypeScript, Google Gemini AI, and lots of ❤️ for teens developing real-world skills.*

### Quick Commands
```bash
npm run dev:full    # Start both client and server
npm run build      # Build for production  
npm run preview    # Preview production build
npm run server     # WebSocket server only
npm run dev        # Client only
```
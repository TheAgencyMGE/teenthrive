import { WebSocketServer, WebSocket } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import * as http from 'http';

interface ChatMessage {
  id: string;
  username: string;
  userId: string;
  message: string;
  timestamp: Date;
  roomId: string;
}

interface ChatRoom {
  id: string;
  name: string;
  topic: string;
  memberCount: number;
  isActive: boolean;
  members: string[];
}

interface User {
  id: string;
  username: string;
  currentRoom?: string;
  isActive: boolean;
  ws: WebSocket;
}

interface WebSocketMessage {
  type: 'join_room' | 'leave_room' | 'send_message' | 'room_update' | 'message_received' | 'user_joined' | 'user_left' | 'rooms_list';
  payload: any;
}

class PeerChatServer {
  private wss: WebSocketServer;
  private users: Map<string, User> = new Map();
  private rooms: Map<string, ChatRoom> = new Map();
  private messageHistory: Map<string, ChatMessage[]> = new Map();
  private server: http.Server;

  constructor(port: number = 8080) {
    // Create HTTP server
    this.server = http.createServer();
    
    // Create WebSocket server
    this.wss = new WebSocketServer({ server: this.server });
    
    this.initializeDefaultRooms();
    this.setupWebSocketHandlers();
    
    this.server.listen(port, () => {
      console.log(`🚀 Peer Chat WebSocket server running on port ${port}`);
    });
  }

  private initializeDefaultRooms() {
    const defaultRooms = [
      {
        id: 'financial-literacy',
        name: 'Money Management Squad',
        topic: 'Budgeting, saving, and financial independence',
        memberCount: 0,
        isActive: true,
        members: []
      },
      {
        id: 'life-skills',
        name: 'Adulting Together',
        topic: 'Cooking, cleaning, and daily life skills',
        memberCount: 0,
        isActive: true,
        members: []
      },
      {
        id: 'decision-making',
        name: 'Choices & Changes',
        topic: 'Big decisions and life transitions',
        memberCount: 0,
        isActive: true,
        members: []
      },
      {
        id: 'emotional-support',
        name: 'Confidence Builders',
        topic: 'Mental health and emotional independence',
        memberCount: 0,
        isActive: true,
        members: []
      },
      {
        id: 'career-prep',
        name: 'Future Professionals',
        topic: 'Job searching, interviews, and career planning',
        memberCount: 0,
        isActive: true,
        members: []
      },
      {
        id: 'social-skills',
        name: 'Connection Circle',
        topic: 'Building relationships and social confidence',
        memberCount: 0,
        isActive: true,
        members: []
      }
    ];

    defaultRooms.forEach(room => {
      this.rooms.set(room.id, room);
      this.messageHistory.set(room.id, []);
    });

    // Add some initial messages to make rooms feel alive
    this.addInitialMessages();
  }

  private addInitialMessages() {
    const initialMessages = [
      {
        roomId: 'financial-literacy',
        messages: [
          { username: 'BudgetMaster_42', message: 'Just opened my first savings account! 🎉', timestamp: new Date(Date.now() - 3600000) },
          { username: 'SmartSpender_19', message: 'That\'s awesome! I\'m working on the 50/30/20 budgeting rule', timestamp: new Date(Date.now() - 3300000) },
          { username: 'FutureRich_7', message: 'Has anyone tried the envelope method for cash budgeting?', timestamp: new Date(Date.now() - 2700000) }
        ]
      },
      {
        roomId: 'life-skills',
        messages: [
          { username: 'ChefInTraining_33', message: 'Finally mastered scrambled eggs! 🥚', timestamp: new Date(Date.now() - 4200000) },
          { username: 'CleanFreak_88', message: 'Anyone have tips for keeping a clean room consistently?', timestamp: new Date(Date.now() - 3900000) },
          { username: 'IndependentLiving_55', message: 'Meal prep Sunday is a game changer for busy weeks!', timestamp: new Date(Date.now() - 3000000) }
        ]
      },
      {
        roomId: 'emotional-support',
        messages: [
          { username: 'MindfulTeen_21', message: 'Started journaling and it really helps with anxiety 💙', timestamp: new Date(Date.now() - 5400000) },
          { username: 'ConfidenceBuilder_66', message: 'You\'re all so inspiring! This community means a lot', timestamp: new Date(Date.now() - 4800000) },
          { username: 'StrongMinded_12', message: 'Remember: it\'s okay to ask for help when you need it', timestamp: new Date(Date.now() - 3600000) }
        ]
      }
    ];

    initialMessages.forEach(({ roomId, messages }) => {
      const roomMessages = messages.map(msg => ({
        id: uuidv4(),
        userId: `bot_${Math.random().toString(36).substring(2, 11)}`,
        ...msg,
        roomId
      }));
      
      this.messageHistory.set(roomId, roomMessages);
    });
  }

  private setupWebSocketHandlers() {
    this.wss.on('connection', (ws: WebSocket) => {
      console.log('New WebSocket connection');

      ws.on('message', (data: Buffer) => {
        try {
          const message: WebSocketMessage = JSON.parse(data.toString());
          this.handleMessage(ws, message);
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      });

      ws.on('close', () => {
        this.handleDisconnection(ws);
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
      });

      // Send initial rooms list
      this.sendMessage(ws, {
        type: 'rooms_list',
        payload: Array.from(this.rooms.values())
      });
    });
  }

  private handleMessage(ws: WebSocket, message: WebSocketMessage) {
    switch (message.type) {
      case 'join_room':
        this.handleJoinRoom(ws, message.payload);
        break;
      case 'leave_room':
        this.handleLeaveRoom(ws, message.payload);
        break;
      case 'send_message':
        this.handleSendMessage(ws, message.payload);
        break;
    }
  }

  private handleJoinRoom(ws: WebSocket, payload: any) {
    const { userId, username, roomId } = payload;
    
    // Remove user from previous room if any
    const existingUser = this.users.get(userId);
    if (existingUser && existingUser.currentRoom) {
      this.removeUserFromRoom(userId, existingUser.currentRoom);
    }

    // Create or update user
    const user: User = {
      id: userId,
      username,
      currentRoom: roomId,
      isActive: true,
      ws
    };
    
    this.users.set(userId, user);

    if (roomId) {
      // Add user to room
      const room = this.rooms.get(roomId);
      if (room) {
        if (!room.members.includes(userId)) {
          room.members.push(userId);
          room.memberCount = room.members.length;
          
          // Broadcast to room that user joined
          this.broadcastToRoom(roomId, {
            type: 'user_joined',
            payload: { username }
          }, userId);

          // Send message history to the joining user
          const history = this.messageHistory.get(roomId) || [];
          history.forEach(msg => {
            this.sendMessage(ws, {
              type: 'message_received',
              payload: { ...msg, isOwn: msg.userId === userId }
            });
          });

          // Broadcast updated room info to all users
          this.broadcastRoomUpdate();
        }
      }
    }

    // Send updated rooms list to the user
    this.sendMessage(ws, {
      type: 'rooms_list',
      payload: Array.from(this.rooms.values())
    });
  }

  private handleLeaveRoom(_ws: WebSocket, payload: any) {
    const { userId, roomId } = payload;
    
    if (roomId) {
      this.removeUserFromRoom(userId, roomId);
    }

    // Update user's current room
    const user = this.users.get(userId);
    if (user) {
      user.currentRoom = undefined;
    }
  }

  private handleSendMessage(_ws: WebSocket, payload: ChatMessage) {
    const { roomId, userId, username, message } = payload;
    
    // Validate user is in the room
    const user = this.users.get(userId);
    const room = this.rooms.get(roomId);
    
    if (user && room && room.members.includes(userId)) {
      const chatMessage: ChatMessage = {
        id: uuidv4(),
        userId,
        username,
        message,
        roomId,
        timestamp: new Date()
      };

      // Add to message history
      const history = this.messageHistory.get(roomId) || [];
      history.push(chatMessage);
      
      // Keep only last 100 messages per room
      if (history.length > 100) {
        history.splice(0, history.length - 100);
      }
      
      this.messageHistory.set(roomId, history);

      // Broadcast message to all users in the room
      this.broadcastToRoom(roomId, {
        type: 'message_received',
        payload: chatMessage
      });
    }
  }

  private handleDisconnection(ws: WebSocket) {
    // Find and remove user
    let disconnectedUserId: string | null = null;
    let disconnectedUserRoom: string | null = null;
    let disconnectedUsername: string | null = null;

    this.users.forEach((user, userId) => {
      if (user.ws === ws) {
        disconnectedUserId = userId;
        disconnectedUserRoom = user.currentRoom || null;
        disconnectedUsername = user.username;
      }
    });

    if (disconnectedUserId) {
      // Remove from room if in one
      if (disconnectedUserRoom) {
        this.removeUserFromRoom(disconnectedUserId, disconnectedUserRoom);
        
        // Broadcast that user left
        if (disconnectedUsername) {
          this.broadcastToRoom(disconnectedUserRoom, {
            type: 'user_left',
            payload: { username: disconnectedUsername }
          }, disconnectedUserId);
        }
      }

      // Remove user
      this.users.delete(disconnectedUserId);
      
      // Broadcast updated room info
      this.broadcastRoomUpdate();
    }

    console.log('User disconnected');
  }

  private removeUserFromRoom(userId: string, roomId: string) {
    const room = this.rooms.get(roomId);
    if (room) {
      const index = room.members.indexOf(userId);
      if (index > -1) {
        room.members.splice(index, 1);
        room.memberCount = room.members.length;
      }
    }
  }

  private broadcastToRoom(roomId: string, message: WebSocketMessage, excludeUserId?: string) {
    const room = this.rooms.get(roomId);
    if (room) {
      room.members.forEach(memberId => {
        if (memberId !== excludeUserId) {
          const user = this.users.get(memberId);
          if (user && user.ws.readyState === WebSocket.OPEN) {
            this.sendMessage(user.ws, message);
          }
        }
      });
    }
  }

  private broadcastRoomUpdate() {
    const roomsArray = Array.from(this.rooms.values());
    const message: WebSocketMessage = {
      type: 'rooms_list',
      payload: roomsArray
    };

    this.users.forEach(user => {
      if (user.ws.readyState === WebSocket.OPEN) {
        this.sendMessage(user.ws, message);
      }
    });
  }

  private sendMessage(ws: WebSocket, message: WebSocketMessage) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }
}

// Start the server
const server = new PeerChatServer(8080);

export default server;

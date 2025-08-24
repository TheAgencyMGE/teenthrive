import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';

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
  ws: any;
}

interface WebSocketMessage {
  type: 'create_room' | 'delete_room' | 'join_room' | 'leave_room' | 'send_message' | 'room_update' | 'message_received' | 'user_joined' | 'user_left' | 'rooms_list' | 'room_created' | 'room_creation_error' | 'room_deleted';
  payload: any;
}

class PeerChatServer {
  private wss!: WebSocketServer;
  private users: Map<string, User> = new Map();
  private rooms: Map<string, ChatRoom> = new Map();
  private messageHistory: Map<string, ChatMessage[]> = new Map();
  private server: any;
  private port: number;

  constructor(port: number = 8086) {
    this.port = port;
    this.initializeDefaultRooms();
  }

  async start(): Promise<void> {
    return new Promise((resolve, reject) => {
      const tryPort = (currentPort: number) => {
        // Create fresh server and WSS for each attempt
        this.server = createServer();
        this.wss = new WebSocketServer({ server: this.server });
        this.setupWebSocketHandlers();

        this.server.once('error', (err: any) => {
          if (err.code === 'EADDRINUSE') {
            console.log(`Port ${currentPort} is already in use, trying port ${currentPort + 1}...`);
            this.server.close();
            setTimeout(() => tryPort(currentPort + 1), 100);
          } else {
            reject(err);
          }
        });

        this.server.listen(currentPort, () => {
          console.log(`🚀 Peer Chat WebSocket server running on port ${currentPort}`);
          console.log(`WebSocket URL: ws://localhost:${currentPort}`);
          this.port = currentPort;
          resolve();
        });
      };

      tryPort(this.port);
    });
  }

  private initializeDefaultRooms() {
    // Start with no default rooms - users will create their own
    console.log('Server initialized with no default rooms');
  }


  private setupWebSocketHandlers() {
    this.wss.on('connection', (ws) => {
      console.log(`New WebSocket connection (Total: ${this.wss.clients.size})`);
      
      // Limit maximum connections to prevent resource exhaustion
      if (this.wss.clients.size > 100) {
        console.log('Connection limit reached, closing connection');
        ws.close(1013, 'Server overloaded');
        return;
      }

      ws.on('message', (data) => {
        try {
          const message = JSON.parse(data.toString());
          this.handleMessage(ws, message);
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      });

      ws.on('close', () => {
        console.log(`WebSocket connection closed (Remaining: ${this.wss.clients.size - 1})`);
        this.handleDisconnection(ws);
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        this.handleDisconnection(ws);
      });

      this.sendMessage(ws, {
        type: 'rooms_list',
        payload: Array.from(this.rooms.values())
      });
    });
  }

  private handleMessage(ws: any, message: WebSocketMessage) {
    switch (message.type) {
      case 'create_room':
        this.handleCreateRoom(ws, message.payload);
        break;
      case 'delete_room':
        this.handleDeleteRoom(ws, message.payload);
        break;
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

  private handleCreateRoom(ws: any, payload: any) {
    const { roomName, roomTopic } = payload;
    const roomId = `room_${uuidv4()}`;
    
    const newRoom: ChatRoom = {
      id: roomId,
      name: roomName,
      topic: roomTopic,
      memberCount: 0,
      isActive: true,
      members: []
    };

    this.rooms.set(roomId, newRoom);
    this.messageHistory.set(roomId, []);

    this.sendMessage(ws, {
      type: 'room_created',
      payload: { room: newRoom }
    });

    this.broadcastRoomUpdate();
  }

  private handleDeleteRoom(_ws: any, payload: any) {
    const { roomId } = payload;
    const room = this.rooms.get(roomId);
    
    if (room) {
      room.members.forEach(memberId => {
        const user = this.users.get(memberId);
        if (user) {
          if (user.currentRoom === roomId) {
            user.currentRoom = undefined;
          }
        }
      });

      this.rooms.delete(roomId);
      this.messageHistory.delete(roomId);

      this.wss.clients.forEach((client: any) => {
        if (client.readyState === 1) {
          this.sendMessage(client, {
            type: 'room_deleted',
            payload: { roomId, roomName: room.name }
          });
        }
      });

      this.broadcastRoomUpdate();
    }
  }

  private handleJoinRoom(ws: any, payload: any) {
    const { userId, username, roomId } = payload;
    
    const existingUser = this.users.get(userId);
    if (existingUser && existingUser.currentRoom) {
      this.removeUserFromRoom(userId, existingUser.currentRoom);
    }

    const user = {
      id: userId,
      username,
      currentRoom: roomId,
      isActive: true,
      ws
    };
    
    this.users.set(userId, user);

    if (roomId) {
      const room = this.rooms.get(roomId);
      if (room) {
        if (!room.members.includes(userId)) {
          room.members.push(userId);
          room.memberCount = room.members.length;
          
          this.broadcastToRoom(roomId, {
            type: 'user_joined',
            payload: { username }
          }, userId);

          const history = this.messageHistory.get(roomId) || [];
          history.forEach(msg => {
            this.sendMessage(ws, {
              type: 'message_received',
              payload: { ...msg, isOwn: msg.userId === userId }
            });
          });

          this.broadcastRoomUpdate();
        }
      }
    }

    this.sendMessage(ws, {
      type: 'rooms_list',
      payload: Array.from(this.rooms.values())
    });
  }

  private handleLeaveRoom(_ws: any, payload: any) {
    const { userId, roomId } = payload;
    
    if (roomId) {
      this.removeUserFromRoom(userId, roomId);
    }

    const user = this.users.get(userId);
    if (user) {
      user.currentRoom = undefined;
    }
  }

  private handleSendMessage(_ws: any, payload: any) {
    const { roomId, userId, username, message } = payload;
    
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

      const history = this.messageHistory.get(roomId) || [];
      history.push(chatMessage);
      
      if (history.length > 100) {
        history.splice(0, history.length - 100);
      }
      
      this.messageHistory.set(roomId, history);

      this.broadcastToRoom(roomId, {
        type: 'message_received',
        payload: chatMessage
      });
    }
  }

  private handleDisconnection(ws: any) {
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
      if (disconnectedUserRoom) {
        this.removeUserFromRoom(disconnectedUserId, disconnectedUserRoom);
        
        if (disconnectedUsername) {
          this.broadcastToRoom(disconnectedUserRoom, {
            type: 'user_left',
            payload: { username: disconnectedUsername }
          }, disconnectedUserId);
        }
      }

      this.users.delete(disconnectedUserId);
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
          if (user && user.ws.readyState === 1) {
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
      if (user.ws.readyState === 1) {
        this.sendMessage(user.ws, message);
      }
    });
  }

  private sendMessage(ws: any, message: WebSocketMessage) {
    if (ws.readyState === 1) {
      ws.send(JSON.stringify(message));
    }
  }
}

// Start the server with automatic port switching
async function startServer() {
  const server = new PeerChatServer(8086);
  try {
    await server.start();
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
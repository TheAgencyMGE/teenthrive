import { v4 as uuidv4 } from 'uuid';

export interface ChatMessage {
  id: string;
  username: string;
  userId: string;
  message: string;
  timestamp: Date;
  roomId: string;
  isOwn?: boolean;
}

export interface ChatRoom {
  id: string;
  name: string;
  topic: string;
  memberCount: number;
  isActive: boolean;
  members: string[];
  createdBy?: string;
  createdAt?: Date;
  isPrivate?: boolean;
}

export interface User {
  id: string;
  username: string;
  currentRoom?: string;
  isActive: boolean;
}

interface WebSocketMessage {
  type: 'create_room' | 'join_room' | 'leave_room' | 'send_message' | 'delete_room' | 'room_update' | 'message_received' | 'user_joined' | 'user_left' | 'rooms_list' | 'room_created' | 'room_creation_error' | 'room_join_error' | 'room_delete_error' | 'room_deleted';
  payload: any;
}

class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 3;
  private reconnectInterval = 2000;
  private userId: string;
  private username: string;
  private currentRoomId: string | null = null;
  private isConnecting = false;
  private isConnected = false;

  // Event callbacks
  private onMessageCallback: ((message: ChatMessage) => void) | null = null;
  private onRoomUpdateCallback: ((rooms: ChatRoom[]) => void) | null = null;
  private onUserJoinedCallback: ((username: string) => void) | null = null;
  private onUserLeftCallback: ((username: string) => void) | null = null;
  private onConnectionStatusCallback: ((connected: boolean) => void) | null = null;
  private onRoomCreatedCallback: ((room: ChatRoom) => void) | null = null;
  private onRoomCreationErrorCallback: ((error: string) => void) | null = null;
  private onRoomDeletedCallback: ((roomId: string, roomName: string) => void) | null = null;

  constructor() {
    this.userId = uuidv4();
    this.username = this.generateAnonymousUsername();
  }

  private generateAnonymousUsername(): string {
    const adjectives = ['Brave', 'Wise', 'Kind', 'Strong', 'Creative', 'Helpful', 'Caring', 'Bold', 'Bright', 'Gentle'];
    const nouns = ['Thriver', 'Builder', 'Explorer', 'Champion', 'Dreamer', 'Supporter', 'Leader', 'Achiever', 'Navigator', 'Pioneer'];
    
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const number = Math.floor(Math.random() * 99) + 1;
    
    return `${adjective}${noun}_${number}`;
  }

  connect(): Promise<void> {
    if (this.isConnected) {
      console.log('WebSocket already connected');
      return Promise.resolve();
    }
    
    if (this.isConnecting) {
      console.log('WebSocket connection already in progress');
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      try {
        this.isConnecting = true;
        // Use the development server port (we'll create this)
        const wsUrl = import.meta.env.DEV ? 'ws://localhost:8086' : 'ws://your-production-server.com';
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          console.log('WebSocket connected');
          this.isConnecting = false;
          this.isConnected = true;
          this.reconnectAttempts = 0;
          this.onConnectionStatusCallback?.(true);
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        this.ws.onclose = () => {
          console.log('WebSocket disconnected');
          this.isConnected = false;
          this.isConnecting = false;
          this.onConnectionStatusCallback?.(false);
          this.attemptReconnect();
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.isConnecting = false;
          // Don't reject on error if we're already connected, let onclose handle it
          if (this.ws?.readyState === WebSocket.CONNECTING) {
            reject(new Error('Failed to connect to WebSocket server'));
          }
        };
      } catch (error) {
        this.isConnecting = false;
        reject(error);
      }
    });
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connect().catch((error) => {
          console.log(`Reconnection attempt ${this.reconnectAttempts} failed:`, error.message);
          if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.log('Max reconnection attempts reached. Giving up.');
            this.onConnectionStatusCallback?.(false);
          }
        });
      }, this.reconnectInterval * this.reconnectAttempts); // Exponential backoff
    } else {
      console.log('Max reconnection attempts reached. Not trying to reconnect.');
    }
  }

  private handleMessage(message: WebSocketMessage) {
    switch (message.type) {
      case 'message_received':
        const chatMessage: ChatMessage = {
          ...message.payload,
          timestamp: new Date(message.payload.timestamp),
          isOwn: message.payload.userId === this.userId
        };
        this.onMessageCallback?.(chatMessage);
        break;

      case 'room_update':
        this.onRoomUpdateCallback?.(message.payload.rooms);
        break;

      case 'user_joined':
        this.onUserJoinedCallback?.(message.payload.username);
        break;

      case 'user_left':
        this.onUserLeftCallback?.(message.payload.username);
        break;

      case 'rooms_list':
        this.onRoomUpdateCallback?.(message.payload);
        break;

      case 'room_created':
        this.onRoomCreatedCallback?.(message.payload.room);
        break;

      case 'room_creation_error':
        this.onRoomCreationErrorCallback?.(message.payload.error);
        break;

      case 'room_deleted':
        this.onRoomDeletedCallback?.(message.payload.roomId, message.payload.roomName);
        break;
    }
  }

  private send(message: WebSocketMessage) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket not connected. Message not sent:', message);
    }
  }

  createRoom(roomName: string, roomTopic: string, isPrivate: boolean = false): void {
    this.send({
      type: 'create_room',
      payload: {
        userId: this.userId,
        username: this.username,
        roomName,
        roomTopic,
        isPrivate
      }
    });
  }

  deleteRoom(roomId: string): void {
    this.send({
      type: 'delete_room',
      payload: {
        userId: this.userId,
        roomId
      }
    });
  }

  joinRoom(roomId: string): void {
    this.currentRoomId = roomId;
    this.send({
      type: 'join_room',
      payload: {
        userId: this.userId,
        username: this.username,
        roomId
      }
    });
  }

  leaveRoom(): void {
    if (this.currentRoomId) {
      this.send({
        type: 'leave_room',
        payload: {
          userId: this.userId,
          roomId: this.currentRoomId
        }
      });
      this.currentRoomId = null;
    }
  }

  sendMessage(message: string): void {
    if (this.currentRoomId) {
      const messageData = {
        id: uuidv4(),
        userId: this.userId,
        username: this.username,
        message,
        roomId: this.currentRoomId,
        timestamp: new Date()
      };

      this.send({
        type: 'send_message',
        payload: messageData
      });
    }
  }

  // Event listener setters
  onMessage(callback: (message: ChatMessage) => void) {
    this.onMessageCallback = callback;
  }

  onRoomUpdate(callback: (rooms: ChatRoom[]) => void) {
    this.onRoomUpdateCallback = callback;
  }

  onUserJoined(callback: (username: string) => void) {
    this.onUserJoinedCallback = callback;
  }

  onUserLeft(callback: (username: string) => void) {
    this.onUserLeftCallback = callback;
  }

  onConnectionStatus(callback: (connected: boolean) => void) {
    this.onConnectionStatusCallback = callback;
  }

  onCurrentRoomUpdate(_callback: (room: ChatRoom | null) => void) {
    // Placeholder for future implementation
  }

  onRoomCreated(callback: (room: ChatRoom) => void) {
    this.onRoomCreatedCallback = callback;
  }

  onRoomCreationError(callback: (error: string) => void) {
    this.onRoomCreationErrorCallback = callback;
  }

  onRoomDeleted(callback: (roomId: string, roomName: string) => void) {
    this.onRoomDeletedCallback = callback;
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
    this.isConnecting = false;
    this.reconnectAttempts = 0;
  }

  retryConnection() {
    this.reconnectAttempts = 0;
    return this.connect();
  }

  getUserInfo() {
    return {
      userId: this.userId,
      username: this.username
    };
  }

  getCurrentRoomId() {
    return this.currentRoomId;
  }
}

// Export a singleton instance
export const websocketService = new WebSocketService();

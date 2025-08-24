import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';

class PeerChatServer {
  constructor(port = 8080) {
    this.wss = null;
    this.users = new Map();
    this.rooms = new Map();
    this.messageHistory = new Map();
    this.server = null;

    // Create HTTP server
    this.server = createServer();
    
    // Create WebSocket server
    this.wss = new WebSocketServer({ server: this.server });
    
    this.setupWebSocketHandlers();
    
    this.server.listen(port, () => {
      console.log(`🚀 Peer Chat WebSocket server running on port ${port}`);
      console.log(`No rooms are pre-created. Users can create their own rooms!`);
    });
  }

  setupWebSocketHandlers() {
    this.wss.on('connection', (ws) => {
      console.log('New WebSocket connection');

      ws.on('message', (data) => {
        try {
          const message = JSON.parse(data.toString());
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

      // Send initial empty rooms list
      this.sendMessage(ws, {
        type: 'rooms_list',
        payload: Array.from(this.rooms.values())
      });
    });
  }

  handleMessage(ws, message) {
    switch (message.type) {
      case 'create_room':
        this.handleCreateRoom(ws, message.payload);
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
      case 'delete_room':
        this.handleDeleteRoom(ws, message.payload);
        break;
    }
  }

  handleCreateRoom(ws, payload) {
    const { userId, username, roomName, roomTopic, isPrivate = false } = payload;
    
    // Generate room ID from name (sanitized)
    const roomId = roomName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || `room-${uuidv4().slice(0, 8)}`;
    
    // Check if room already exists
    if (this.rooms.has(roomId)) {
      this.sendMessage(ws, {
        type: 'room_creation_error',
        payload: { error: 'A room with this name already exists' }
      });
      return;
    }

    // Create new room
    const newRoom = {
      id: roomId,
      name: roomName,
      topic: roomTopic || 'General discussion',
      memberCount: 0,
      isActive: true,
      members: [],
      createdBy: userId,
      createdAt: new Date(),
      isPrivate: isPrivate
    };

    this.rooms.set(roomId, newRoom);
    this.messageHistory.set(roomId, []);

    console.log(`Room created: ${roomName} (${roomId}) by ${username}`);

    // Send success response to creator
    this.sendMessage(ws, {
      type: 'room_created',
      payload: { room: newRoom }
    });

    // Broadcast updated room list to all users
    this.broadcastRoomUpdate();
  }

  handleJoinRoom(ws, payload) {
    const { userId, username, roomId } = payload;
    
    // Remove user from previous room if any
    const existingUser = this.users.get(userId);
    if (existingUser && existingUser.currentRoom) {
      this.removeUserFromRoom(userId, existingUser.currentRoom);
    }

    // Create or update user
    const user = {
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
          
          console.log(`${username} joined room: ${room.name}`);

          // Broadcast to room that user joined
          this.broadcastToRoom(roomId, {
            type: 'user_joined',
            payload: { username, userId }
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
      } else {
        this.sendMessage(ws, {
          type: 'room_join_error',
          payload: { error: 'Room not found' }
        });
      }
    }

    // Send updated rooms list to the user
    this.sendMessage(ws, {
      type: 'rooms_list',
      payload: Array.from(this.rooms.values())
    });
  }

  handleLeaveRoom(ws, payload) {
    const { userId, roomId } = payload;
    
    if (roomId) {
      this.removeUserFromRoom(userId, roomId);
    }

    // Update user's current room
    const user = this.users.get(userId);
    if (user) {
      user.currentRoom = undefined;
      console.log(`${user.username} left room: ${roomId}`);
    }

    this.broadcastRoomUpdate();
  }

  handleSendMessage(ws, payload) {
    const { roomId, userId, username, message } = payload;
    
    // Validate user is in the room
    const user = this.users.get(userId);
    const room = this.rooms.get(roomId);
    
    if (user && room && room.members.includes(userId)) {
      const chatMessage = {
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

      console.log(`Message in ${room.name}: ${username}: ${message}`);

      // Broadcast message to all users in the room
      this.broadcastToRoom(roomId, {
        type: 'message_received',
        payload: chatMessage
      });
    }
  }

  handleDeleteRoom(ws, payload) {
    const { userId, roomId } = payload;
    const room = this.rooms.get(roomId);
    const user = this.users.get(userId);

    if (!room) {
      this.sendMessage(ws, {
        type: 'room_delete_error',
        payload: { error: 'Room not found' }
      });
      return;
    }

    // Only room creator can delete the room
    if (room.createdBy !== userId) {
      this.sendMessage(ws, {
        type: 'room_delete_error',
        payload: { error: 'Only the room creator can delete this room' }
      });
      return;
    }

    // Notify all room members
    this.broadcastToRoom(roomId, {
      type: 'room_deleted',
      payload: { roomId, roomName: room.name }
    });

    // Remove all users from the room
    room.members.forEach(memberId => {
      const memberUser = this.users.get(memberId);
      if (memberUser) {
        memberUser.currentRoom = undefined;
      }
    });

    // Delete room and its history
    this.rooms.delete(roomId);
    this.messageHistory.delete(roomId);

    console.log(`Room deleted: ${room.name} (${roomId}) by ${user?.username}`);

    // Broadcast updated room list
    this.broadcastRoomUpdate();
  }

  handleDisconnection(ws) {
    // Find and remove user
    let disconnectedUserId = null;
    let disconnectedUserRoom = null;
    let disconnectedUsername = null;

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
            payload: { username: disconnectedUsername, userId: disconnectedUserId }
          }, disconnectedUserId);
        }
      }

      // Remove user
      this.users.delete(disconnectedUserId);
      
      console.log(`User disconnected: ${disconnectedUsername}`);
      
      // Broadcast updated room info
      this.broadcastRoomUpdate();
    }
  }

  removeUserFromRoom(userId, roomId) {
    const room = this.rooms.get(roomId);
    if (room) {
      const index = room.members.indexOf(userId);
      if (index > -1) {
        room.members.splice(index, 1);
        room.memberCount = room.members.length;

        // If room is empty and has been inactive for a while, consider deleting it
        // For now, we'll keep empty rooms unless explicitly deleted
      }
    }
  }

  broadcastToRoom(roomId, message, excludeUserId) {
    const room = this.rooms.get(roomId);
    if (room) {
      room.members.forEach(memberId => {
        if (memberId !== excludeUserId) {
          const user = this.users.get(memberId);
          if (user && user.ws.readyState === 1) { // WebSocket.OPEN
            this.sendMessage(user.ws, message);
          }
        }
      });
    }
  }

  broadcastRoomUpdate() {
    const roomsArray = Array.from(this.rooms.values());
    const message = {
      type: 'rooms_list',
      payload: roomsArray
    };

    this.users.forEach(user => {
      if (user.ws.readyState === 1) { // WebSocket.OPEN
        this.sendMessage(user.ws, message);
      }
    });
  }

  sendMessage(ws, message) {
    if (ws.readyState === 1) { // WebSocket.OPEN
      ws.send(JSON.stringify(message));
    }
  }
}

// Start the server
console.log('Starting Peer Chat Server...');
const server = new PeerChatServer(8081);

export default server;

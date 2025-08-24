import { useState, useCallback, useEffect } from 'react';
import { websocketService, ChatMessage, ChatRoom } from '@/services/websocketService';

export type { ChatMessage, ChatRoom };

export const usePeerChat = () => {
  const [currentRoom, setCurrentRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [availableRooms, setAvailableRooms] = useState<ChatRoom[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [roomCreationError, setRoomCreationError] = useState<string | null>(null);

  // Initialize WebSocket connection
  useEffect(() => {
    let isMounted = true;
    
    const initializeConnection = async () => {
      try {
        if (!isMounted) return;
        await websocketService.connect();
        if (!isMounted) return;
        setConnectionError(null);
      } catch (error) {
        if (!isMounted) return;
        console.error('Failed to connect to WebSocket server:', error);
        setConnectionError('Failed to connect to chat server. Please try again later.');
        setAvailableRooms([]);
      }
    };

    initializeConnection();

    // Set up WebSocket event listeners
    websocketService.onMessage((message: ChatMessage) => {
      setMessages(prev => [...prev, message]);
    });

    websocketService.onRoomUpdate((rooms: ChatRoom[]) => {
      setAvailableRooms(rooms);
      
      // Update current room if it's in the list
      if (currentRoom) {
        const updatedRoom = rooms.find(room => room.id === currentRoom.id);
        if (updatedRoom) {
          setCurrentRoom(updatedRoom);
        }
      }
    });

    websocketService.onConnectionStatus((connected: boolean) => {
      setIsConnected(connected);
      if (!connected) {
        setConnectionError('Connection lost. Attempting to reconnect...');
      } else {
        setConnectionError(null);
      }
    });

    websocketService.onUserJoined((username: string) => {
      console.log(`${username} joined the room`);
    });

    websocketService.onUserLeft((username: string) => {
      console.log(`${username} left the room`);
    });

    websocketService.onRoomCreated((_room: ChatRoom) => {
      setRoomCreationError(null);
      // Room will be added via the rooms list update
    });

    websocketService.onRoomCreationError((error: string) => {
      setRoomCreationError(error);
    });

    websocketService.onRoomDeleted((roomId: string, _roomName: string) => {
      // If user was in the deleted room, leave it
      if (currentRoom && currentRoom.id === roomId) {
        setCurrentRoom(null);
        setMessages([]);
      }
    });

    // Cleanup on unmount
    return () => {
      isMounted = false;
      console.log('Cleaning up WebSocket connection...');
      websocketService.disconnect();
    };
  }, []); // Remove currentRoom dependency to prevent reconnections

  const createRoom = useCallback((roomName: string, roomTopic: string, isPrivate: boolean = false) => {
    setRoomCreationError(null);
    websocketService.createRoom(roomName, roomTopic, isPrivate);
  }, []);

  const deleteRoom = useCallback((roomId: string) => {
    websocketService.deleteRoom(roomId);
  }, []);

  const joinRoom = useCallback((roomId: string) => {
    const room = availableRooms.find(r => r.id === roomId);
    if (room) {
      setCurrentRoom(room);
      setMessages([]); // Clear previous messages
      websocketService.joinRoom(roomId);
    }
  }, [availableRooms]);

  const sendMessage = useCallback((message: string) => {
    if (!currentRoom || !message.trim()) return;

    if (isConnected) {
      websocketService.sendMessage(message);
    } else {
      // Fallback for when not connected - add message locally
      const newMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        userId: websocketService.getUserInfo().userId,
        username: websocketService.getUserInfo().username,
        message: message.trim(),
        timestamp: new Date(),
        roomId: currentRoom.id,
        isOwn: true
      };

      setMessages(prev => [...prev, newMessage]);

      // Simulate a response when offline
      setTimeout(() => {
        const responses = [
          "That's so helpful, thanks for sharing!",
          "I totally relate to that experience!",
          "Great tip! I'll definitely try that.",
          "You're inspiring me to try that too!",
          "Thanks for the encouragement! 💙",
          "I'm going through something similar!",
          "Your advice really resonates with me.",
          "This community is so supportive! 🌟"
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        const responseMessage: ChatMessage = {
          id: `response-${Date.now()}`,
          userId: `user_${Math.floor(Math.random() * 1000)}`,
          username: `SupportivePeer_${Math.floor(Math.random() * 99) + 1}`,
          message: randomResponse,
          timestamp: new Date(),
          roomId: currentRoom.id,
          isOwn: false
        };
        
        setMessages(prev => [...prev, responseMessage]);
      }, 1000 + Math.random() * 3000);
    }
  }, [currentRoom, isConnected]);

  const leaveRoom = useCallback(() => {
    if (currentRoom) {
      websocketService.leaveRoom();
      setCurrentRoom(null);
      setMessages([]);
    }
  }, [currentRoom]);

  return {
    currentRoom,
    messages,
    availableRooms,
    isConnected,
    connectionError,
    roomCreationError,
    createRoom,
    deleteRoom,
    joinRoom,
    sendMessage,
    leaveRoom,
    userInfo: websocketService.getUserInfo()
  };
};
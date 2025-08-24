import React, { useState, useEffect, useRef } from 'react';
import { Send, Users, MessageCircle, Plus, Trash2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { usePeerChat } from '@/hooks/usePeerChat';
import type { ChatMessage, ChatRoom } from '@/hooks/usePeerChat';

export const PeerChat: React.FC = () => {
  const {
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
    userInfo
  } = usePeerChat();

  const [messageInput, setMessageInput] = useState('');
  const [isCreateRoomOpen, setIsCreateRoomOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomTopic, setNewRoomTopic] = useState('');
  const [isPrivateRoom, setIsPrivateRoom] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim()) {
      sendMessage(messageInput);
      setMessageInput('');
    }
  };

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRoomName.trim() && newRoomTopic.trim()) {
      createRoom(newRoomName, newRoomTopic, isPrivateRoom);
      setNewRoomName('');
      setNewRoomTopic('');
      setIsPrivateRoom(false);
      setIsCreateRoomOpen(false);
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(new Date(date));
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const messageDate = new Date(date);
    
    if (messageDate.toDateString() === today.toDateString()) {
      return 'Today';
    }
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    
    return messageDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const groupMessagesByDate = (messages: ChatMessage[]) => {
    const groups: { [key: string]: ChatMessage[] } = {};
    
    messages.forEach(message => {
      const dateKey = formatDate(message.timestamp);
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(message);
    });
    
    return groups;
  };

  const messageGroups = groupMessagesByDate(messages);

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Sidebar - Room List */}
      <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Peer Chat
            </h2>
            <Dialog open={isCreateRoomOpen} onOpenChange={setIsCreateRoomOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Chat Room</DialogTitle>
                  <DialogDescription>
                    Start a new conversation space for peer support.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateRoom} className="space-y-4">
                  <div>
                    <Label htmlFor="roomName">Room Name</Label>
                    <Input
                      id="roomName"
                      value={newRoomName}
                      onChange={(e) => setNewRoomName(e.target.value)}
                      placeholder="Enter room name..."
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="roomTopic">Room Topic</Label>
                    <Textarea
                      id="roomTopic"
                      value={newRoomTopic}
                      onChange={(e) => setNewRoomTopic(e.target.value)}
                      placeholder="What will you discuss in this room?"
                      required
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="private"
                      checked={isPrivateRoom}
                      onCheckedChange={setIsPrivateRoom}
                    />
                    <Label htmlFor="private">Private room</Label>
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1">Create Room</Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsCreateRoomOpen(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            {isConnected ? 'Connected' : 'Disconnected'}
          </div>
        </div>

        {/* Connection Error Alert */}
        {connectionError && (
          <div className="p-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{connectionError}</AlertDescription>
            </Alert>
          </div>
        )}

        {/* Room Creation Error */}
        {roomCreationError && (
          <div className="p-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{roomCreationError}</AlertDescription>
            </Alert>
          </div>
        )}

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-2">
            {availableRooms.map((room) => (
              <Card
                key={room.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  currentRoom?.id === room.id 
                    ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-300' 
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
                onClick={() => joinRoom(room.id)}
              >
                <CardHeader className="p-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">
                      {room.name}
                    </CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      <Users className="h-3 w-3 mr-1" />
                      {room.memberCount}
                    </Badge>
                  </div>
                  <CardDescription className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                    {room.topic}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {currentRoom ? (
          <>
            {/* Chat Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {currentRoom.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {currentRoom.topic}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="secondary">
                    <Users className="h-3 w-3 mr-1" />
                    {currentRoom.memberCount} members
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={leaveRoom}
                  >
                    Leave Room
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-6">
                {Object.entries(messageGroups).map(([date, dateMessages]) => (
                  <div key={date}>
                    <div className="flex items-center justify-center mb-4">
                      <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs px-3 py-1 rounded-full">
                        {date}
                      </span>
                    </div>
                    <div className="space-y-4">
                      {dateMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              message.isOwn
                                ? 'bg-blue-600 text-white'
                                : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                            }`}
                          >
                            {!message.isOwn && (
                              <div className="text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">
                                {message.username}
                              </div>
                            )}
                            <div className="text-sm">{message.message}</div>
                            <div
                              className={`text-xs mt-1 ${
                                message.isOwn
                                  ? 'text-blue-100'
                                  : 'text-gray-500 dark:text-gray-400'
                              }`}
                            >
                              {formatTime(message.timestamp)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-6">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder={`Message ${currentRoom.name}...`}
                  className="flex-1"
                  disabled={!isConnected}
                />
                <Button 
                  type="submit" 
                  disabled={!messageInput.trim() || !isConnected}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Chatting as {userInfo.username}
              </div>
            </div>
          </>
        ) : (
          /* No Room Selected */
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Welcome to Peer Chat
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
                Connect with other teens for support, advice, and meaningful conversations. 
                Select a room to get started.
              </p>
              {availableRooms.length === 0 && (
                <Button
                  onClick={() => setIsCreateRoomOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Room
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
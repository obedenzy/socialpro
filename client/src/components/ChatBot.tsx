import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, User, Paperclip, Image, Settings, Send } from "lucide-react";
import { LocalStorage } from "@/lib/storage";
import type { ChatConversation, ChatMessage } from "@shared/schema";

export default function ChatBot() {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [botSettings, setBotSettings] = useState({
    autoReply: true,
    imageUploads: false,
    responseDelay: 2
  });

  useEffect(() => {
    const savedConversations = LocalStorage.getChatConversations();
    setConversations(savedConversations);
  }, []);

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content: currentMessage,
      sender: 'user',
      timestamp: new Date().toISOString(),
      type: 'text'
    };

    // Add user message to current conversation
    const updatedConversations = [...conversations];
    if (updatedConversations.length > 0) {
      updatedConversations[0].messages.push(newMessage);
      
      // Simulate bot response
      if (botSettings.autoReply) {
        setTimeout(() => {
          const botResponse: ChatMessage = {
            id: (Date.now() + 1).toString(),
            content: "Thank you for your message. How can I help you today?",
            sender: 'bot',
            timestamp: new Date().toISOString(),
            type: 'text'
          };
          updatedConversations[0].messages.push(botResponse);
          setConversations([...updatedConversations]);
          LocalStorage.saveChatConversations(updatedConversations);
        }, botSettings.responseDelay * 1000);
      }
    }

    setConversations(updatedConversations);
    LocalStorage.saveChatConversations(updatedConversations);
    setCurrentMessage('');
  };

  const handleFileUpload = (type: 'file' | 'image') => {
    console.log(`Uploading ${type}...`);
    // Implementation for file/image upload
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const currentConversation = conversations[0] || null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-foreground">Chat Bot Management</h2>
        <Button variant="outline">
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-2">
          <Card className="h-[500px] flex flex-col">
            <CardHeader>
              <CardTitle>Chat Interface</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0">
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {currentConversation ? (
                  currentConversation.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-start space-x-3 ${
                        message.sender === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {message.sender === 'bot' && (
                        <Avatar className="w-8 h-8 bg-blue-100">
                          <AvatarFallback>
                            <Bot className="w-4 h-4 text-blue-600" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">{formatTime(message.timestamp)}</p>
                      </div>
                      {message.sender === 'user' && (
                        <Avatar className="w-8 h-8 bg-gray-100">
                          <AvatarFallback>
                            <User className="w-4 h-4 text-gray-600" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <div className="text-center">
                      <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No active conversations</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-6 border-t border-border">
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Type your message..."
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleFileUpload('file')}
                  >
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleFileUpload('image')}
                  >
                    <Image className="w-4 h-4" />
                  </Button>
                  <Button onClick={handleSendMessage}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat Settings */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bot Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-reply">Auto-reply enabled</Label>
                <Switch
                  id="auto-reply"
                  checked={botSettings.autoReply}
                  onCheckedChange={(checked) =>
                    setBotSettings({ ...botSettings, autoReply: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="image-uploads">Image uploads allowed</Label>
                <Switch
                  id="image-uploads"
                  checked={botSettings.imageUploads}
                  onCheckedChange={(checked) =>
                    setBotSettings({ ...botSettings, imageUploads: checked })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="response-delay">Response delay (seconds)</Label>
                <Input
                  id="response-delay"
                  type="number"
                  min="1"
                  max="10"
                  value={botSettings.responseDelay}
                  onChange={(e) =>
                    setBotSettings({ ...botSettings, responseDelay: parseInt(e.target.value) })
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Chat Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total conversations</span>
                <span className="text-sm font-medium text-foreground">1,247</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Average response time</span>
                <span className="text-sm font-medium text-foreground">2.3s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Satisfaction rate</span>
                <span className="text-sm font-medium text-foreground">92%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Active chats</span>
                <span className="text-sm font-medium text-foreground">{conversations.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

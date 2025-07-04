import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RefreshCw, Search, Plus, Mail, Send, FileText, Trash2, AlertCircle } from "lucide-react";
import { LocalStorage } from "@/lib/storage";
import type { Email } from "@shared/schema";

const folders = [
  { id: 'inbox', name: 'Inbox', icon: Mail },
  { id: 'sent', name: 'Sent', icon: Send },
  { id: 'drafts', name: 'Drafts', icon: FileText },
  { id: 'spam', name: 'Spam', icon: AlertCircle },
  { id: 'trash', name: 'Trash', icon: Trash2 }
];

export default function Email() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string>('inbox');
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);

  useEffect(() => {
    const savedEmails = LocalStorage.getEmails();
    setEmails(savedEmails);
  }, []);

  const filteredEmails = emails.filter(email => email.folder === selectedFolder);
  const unreadCount = emails.filter(email => !email.isRead && email.folder === 'inbox').length;

  const getFolderEmails = (folderId: string) => {
    return emails.filter(email => email.folder === folderId);
  };

  const getFolderIcon = (folderId: string) => {
    const folder = folders.find(f => f.id === folderId);
    return folder ? folder.icon : Mail;
  };

  const handleEmailClick = (email: Email) => {
    setSelectedEmail(email);
    if (!email.isRead) {
      const updatedEmails = emails.map(e => 
        e.id === email.id ? { ...e, isRead: true } : e
      );
      setEmails(updatedEmails);
      LocalStorage.saveEmails(updatedEmails);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getPriorityColor = (priority: Email['priority']) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      normal: 'bg-blue-100 text-blue-800',
      low: 'bg-gray-100 text-gray-800'
    };
    return colors[priority] || colors.normal;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-foreground">Email Management</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Compose Email
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Email List */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="capitalize">{selectedFolder}</CardTitle>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon">
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {filteredEmails.length > 0 ? (
                  filteredEmails.map((email) => (
                    <div
                      key={email.id}
                      className={`p-6 hover:bg-muted cursor-pointer transition-colors ${
                        !email.isRead ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => handleEmailClick(email)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-blue-100 text-blue-600">
                              {getInitials(email.sender)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <p className={`text-sm font-medium ${
                                !email.isRead ? 'text-foreground' : 'text-muted-foreground'
                              }`}>
                                {email.sender}
                              </p>
                              {email.priority === 'high' && (
                                <Badge className="bg-red-100 text-red-800 text-xs">
                                  High Priority
                                </Badge>
                              )}
                              {!email.isRead && (
                                <div className="w-2 h-2 bg-primary rounded-full" />
                              )}
                            </div>
                            <p className={`text-sm ${
                              !email.isRead ? 'text-foreground' : 'text-muted-foreground'
                            } truncate`}>
                              {email.subject}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {email.content.substring(0, 100)}...
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">
                            {formatTime(email.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center h-32">
                    <p className="text-muted-foreground">No emails in this folder</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Email Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Folders</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {folders.map((folder) => {
                  const Icon = folder.icon;
                  const count = getFolderEmails(folder.id).length;
                  const unreadFolderCount = folder.id === 'inbox' ? unreadCount : 0;
                  
                  return (
                    <button
                      key={folder.id}
                      onClick={() => setSelectedFolder(folder.id)}
                      className={`w-full flex items-center justify-between p-3 text-sm hover:bg-muted rounded transition-colors ${
                        selectedFolder === folder.id ? 'bg-muted' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground">{folder.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {count > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {count}
                          </Badge>
                        )}
                        {unreadFolderCount > 0 && (
                          <Badge className="bg-primary text-primary-foreground text-xs">
                            {unreadFolderCount}
                          </Badge>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Email Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Sent today</span>
                <span className="text-sm font-medium text-foreground">
                  {emails.filter(e => e.folder === 'sent').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total emails</span>
                <span className="text-sm font-medium text-foreground">{emails.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Unread</span>
                <span className="text-sm font-medium text-foreground">{unreadCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Spam filtered</span>
                <span className="text-sm font-medium text-foreground">
                  {emails.filter(e => e.folder === 'spam').length}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

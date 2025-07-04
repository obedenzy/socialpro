import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Heart, MessageCircle, Share, Eye, Plus } from "lucide-react";
import { LocalStorage } from "@/lib/storage";
import type { SocialPost } from "@shared/schema";

const platforms = [
  { id: 'facebook', name: 'Facebook', icon: '📘', connected: true },
  { id: 'twitter', name: 'Twitter', icon: '🐦', connected: true },
  { id: 'instagram', name: 'Instagram', icon: '📷', connected: false },
  { id: 'linkedin', name: 'LinkedIn', icon: '💼', connected: true },
];

export default function SocialMedia() {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [newPost, setNewPost] = useState({
    content: '',
    scheduledDate: '',
    platforms: [] as string[]
  });

  useEffect(() => {
    const savedPosts = LocalStorage.getSocialPosts();
    setPosts(savedPosts);
  }, []);

  const handleSchedulePost = () => {
    // Implementation for scheduling posts
    console.log('Scheduling post:', newPost);
    // Reset form
    setNewPost({ content: '', scheduledDate: '', platforms: [] });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPlatformIcon = (platform: string) => {
    const icons = {
      facebook: '📘',
      twitter: '🐦',
      instagram: '📷',
      linkedin: '💼'
    };
    return icons[platform as keyof typeof icons] || '📱';
  };

  const getStatusBadge = (status: SocialPost['status']) => {
    const variants = {
      published: 'bg-green-100 text-green-800',
      scheduled: 'bg-blue-100 text-blue-800',
      draft: 'bg-gray-100 text-gray-800',
      failed: 'bg-red-100 text-red-800'
    };
    return variants[status] || variants.draft;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-foreground">Social Media Management</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Post
        </Button>
      </div>

      {/* Social Platforms */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {platforms.map((platform) => (
          <Card key={platform.id} className="metric-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{platform.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{platform.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {platform.connected ? 'Connected' : 'Disconnected'}
                    </p>
                  </div>
                </div>
                <Badge className={platform.connected ? 'status-badge success' : 'status-badge inactive'}>
                  {platform.connected ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Post Scheduler */}
      <Card>
        <CardHeader>
          <CardTitle>Schedule Post</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="content">Post Content</Label>
                <Textarea
                  id="content"
                  placeholder="What's happening?"
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  className="min-h-[100px]"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="scheduledDate">Schedule Date</Label>
                <Input
                  id="scheduledDate"
                  type="datetime-local"
                  value={newPost.scheduledDate}
                  onChange={(e) => setNewPost({ ...newPost, scheduledDate: e.target.value })}
                />
              </div>
              <div>
                <Label>Platforms</Label>
                <div className="space-y-2 mt-2">
                  {platforms.filter(p => p.connected).map((platform) => (
                    <div key={platform.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={platform.id}
                        checked={newPost.platforms.includes(platform.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setNewPost({
                              ...newPost,
                              platforms: [...newPost.platforms, platform.id]
                            });
                          } else {
                            setNewPost({
                              ...newPost,
                              platforms: newPost.platforms.filter(p => p !== platform.id)
                            });
                          }
                        }}
                      />
                      <Label htmlFor={platform.id} className="text-sm">
                        {platform.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSchedulePost}>
              Schedule Post
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Posts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Posts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{getPlatformIcon(post.platform)}</span>
                  <span className="text-sm text-muted-foreground capitalize">{post.platform}</span>
                  <Badge className={`status-badge ${getStatusBadge(post.status)}`}>
                    {post.status}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground">
                  {post.publishedDate ? formatDate(post.publishedDate) : formatDate(post.scheduledDate)}
                </span>
              </div>
              <p className="text-sm text-foreground mb-3">{post.content}</p>
              {post.status === 'published' && (
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Heart className="w-4 h-4" />
                    <span>{post.metrics.likes} likes</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.metrics.comments} comments</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Share className="w-4 h-4" />
                    <span>{post.metrics.shares} shares</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>{post.metrics.views} views</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

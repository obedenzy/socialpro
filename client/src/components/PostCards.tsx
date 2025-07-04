import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Heart, Edit, Trash2, Plus } from "lucide-react";
import { LocalStorage } from "@/lib/storage";
import type { PostCard } from "@shared/schema";

export default function PostCards() {
  const [postCards, setPostCards] = useState<PostCard[]>([]);

  useEffect(() => {
    const savedPostCards = LocalStorage.getPostCards();
    setPostCards(savedPostCards);
  }, []);

  const getStatusBadge = (status: PostCard['status']) => {
    const variants = {
      published: 'bg-green-100 text-green-800',
      draft: 'bg-gray-100 text-gray-800',
      archived: 'bg-red-100 text-red-800'
    };
    return variants[status] || variants.draft;
  };

  const handleDelete = (id: string) => {
    const updatedCards = postCards.filter(card => card.id !== id);
    setPostCards(updatedCards);
    LocalStorage.savePostCards(updatedCards);
  };

  const handleEdit = (id: string) => {
    console.log('Edit post card:', id);
    // Implementation for editing post cards
  };

  const handleCreateNew = () => {
    console.log('Create new post card');
    // Implementation for creating new post cards
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-foreground">Post Card Management</h2>
        <Button onClick={handleCreateNew}>
          <Plus className="w-4 h-4 mr-2" />
          Create Post Card
        </Button>
      </div>

      {/* Post Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {postCards.map((card) => (
          <Card key={card.id} className="overflow-hidden">
            <div className="aspect-video relative">
              <img
                src={card.imageUrl}
                alt={card.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <Badge className={`status-badge ${getStatusBadge(card.status)}`}>
                  {card.status}
                </Badge>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{card.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">{card.content}</p>
                </div>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{card.views.toLocaleString()} views</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart className="w-4 h-4" />
                      <span>{card.likes.toLocaleString()} likes</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    <p>By {card.author}</p>
                    <p>{formatDate(card.publishDate)}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(card.id)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(card.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {card.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Create New Card */}
        <Card className="border-dashed border-2 hover:border-primary/50 transition-colors duration-200">
          <CardContent className="flex items-center justify-center h-80">
            <Button
              variant="ghost"
              onClick={handleCreateNew}
              className="flex flex-col items-center space-y-4 h-full w-full"
            >
              <Plus className="w-12 h-12 text-muted-foreground" />
              <p className="text-muted-foreground font-medium">Create New Post Card</p>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="metric-card">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-semibold text-foreground">{postCards.length}</p>
              <p className="text-sm text-muted-foreground">Total Posts</p>
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-semibold text-foreground">
                {postCards.filter(card => card.status === 'published').length}
              </p>
              <p className="text-sm text-muted-foreground">Published</p>
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-semibold text-foreground">
                {postCards.reduce((sum, card) => sum + card.views, 0).toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Total Views</p>
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-semibold text-foreground">
                {postCards.reduce((sum, card) => sum + card.likes, 0).toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Total Likes</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

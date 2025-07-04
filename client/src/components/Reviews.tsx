import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Star, Reply, Clock, Plus } from "lucide-react";
import { LocalStorage } from "@/lib/storage";
import type { Review } from "@shared/schema";

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const savedReviews = LocalStorage.getReviews();
    setReviews(savedReviews);
  }, []);

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  const responseRate = reviews.length > 0 
    ? Math.round((reviews.filter(r => r.status === 'responded').length / reviews.length) * 100)
    : 0;

  const pendingReviews = reviews.filter(r => r.status === 'pending').length;

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const getStatusBadge = (status: Review['status']) => {
    const variants = {
      responded: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      archived: 'bg-gray-100 text-gray-800'
    };
    return variants[status] || variants.pending;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-foreground">Review Management</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Review
        </Button>
      </div>

      {/* Review Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="metric-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Rating</p>
                <p className="text-2xl font-semibold text-foreground">{averageRating}</p>
              </div>
              <div className="flex">
                {renderStars(Math.floor(parseFloat(averageRating)))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Response Rate</p>
                <p className="text-2xl font-semibold text-foreground">{responseRate}%</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Reply className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Reviews</p>
                <p className="text-2xl font-semibold text-foreground">{pendingReviews}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reviews Table */}
      <Card className="data-table">
        <CardHeader className="table-header">
          <CardTitle>Recent Reviews</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Review</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={review.customerAvatar} />
                        <AvatarFallback>{review.customerName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-foreground">{review.customerName}</p>
                        <p className="text-sm text-muted-foreground">{review.customerEmail}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex">
                      {renderStars(review.rating)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-foreground max-w-xs truncate">{review.comment}</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-muted-foreground">
                      {new Date(review.date).toLocaleDateString()}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge className={`status-badge ${getStatusBadge(review.status)}`}>
                      {review.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-900">
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

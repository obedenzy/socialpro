import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Star, 
  MessageSquare, 
  TrendingUp, 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  QrCode, 
  Copy, 
  Upload, 
  ExternalLink,
  Download,
  Eye,
  FileText
} from "lucide-react";
import { LocalStorage } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import type { Review, ReviewLandingPage } from "@shared/schema";

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewLandingPages, setReviewLandingPages] = useState<ReviewLandingPage[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreatingLanding, setIsCreatingLanding] = useState(false);
  
  // Form states
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [rating, setRating] = useState(5);
  const [reviewImage, setReviewImage] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    const savedReviews = LocalStorage.getReviews();
    setReviews(savedReviews);
    
    // Load review landing pages from localStorage
    const savedReviewLandingPages = JSON.parse(localStorage.getItem('reviewLandingPages') || '[]');
    setReviewLandingPages(savedReviewLandingPages);
  }, []);

  const generateQRCode = (url: string): string => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
  };

  const generateDynamicUrl = (userId: string, reviewId: string): string => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/review/${userId}/${reviewId}`;
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setImageFile(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          setReviewImage(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file.",
          variant: "destructive",
        });
      }
    }
  };

  const handleCreateReviewLanding = async () => {
    if (!reviewTitle || !reviewText || !reviewImage) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields and upload an image.",
        variant: "destructive",
      });
      return;
    }

    setIsCreatingLanding(true);
    
    // Simulate user ID (in real app, this would come from auth)
    const userId = "user123";
    const reviewId = Date.now().toString();
    const dynamicUrl = generateDynamicUrl(userId, reviewId);
    const qrCode = generateQRCode(dynamicUrl);

    const newReviewLandingPage: ReviewLandingPage = {
      id: reviewId,
      userId,
      title: reviewTitle,
      reviewText,
      image: reviewImage,
      customerName,
      rating,
      isActive: true,
      qrCode,
      dynamicUrl,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save to localStorage
    const updatedReviewLandingPages = [...reviewLandingPages, newReviewLandingPage];
    setReviewLandingPages(updatedReviewLandingPages);
    localStorage.setItem('reviewLandingPages', JSON.stringify(updatedReviewLandingPages));

    // Also create regular review
    const newReview: Review = {
      id: reviewId,
      customerName: customerName || "Anonymous Customer",
      customerEmail: "customer@example.com",
      customerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
      rating,
      comment: reviewText,
      date: new Date().toISOString().split('T')[0],
      status: 'responded',
      response: ''
    };

    const updatedReviews = [...reviews, newReview];
    setReviews(updatedReviews);
    LocalStorage.saveReviews(updatedReviews);

    // Reset form
    setReviewTitle("");
    setReviewText("");
    setCustomerName("");
    setRating(5);
    setReviewImage("");
    setImageFile(null);
    setIsCreatingLanding(false);
    setIsCreateModalOpen(false);

    toast({
      title: "Review landing page created successfully",
      description: "Your review landing page is now live with QR code!",
    });
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: `${type} copied to clipboard`,
      description: "You can now paste it anywhere.",
    });
  };

  const downloadQRCode = (qrCodeUrl: string, title: string) => {
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `${title}-review-qr-code.png`;
    link.click();
  };

  const totalReviews = reviews.length;
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;
  const positiveReviews = reviews.filter(r => r.rating >= 4).length;
  const responseRate = reviews.length > 0 
    ? (reviews.filter(r => r.response && r.response.trim() !== '').length / reviews.length) * 100 
    : 0;

  const getStatusBadge = (status: Review['status']) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800',
      responded: 'bg-green-100 text-green-800',
      archived: 'bg-gray-100 text-gray-800'
    };
    return variants[status] || variants.pending;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const renderRatingSelector = (value: number, onChange: (rating: number) => void) => {
    return (
      <div className="flex space-x-1">
        {Array.from({ length: 5 }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onChange(i + 1)}
            className="focus:outline-none"
          >
            <Star
              className={`w-6 h-6 transition-colors ${
                i < value ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 hover:text-yellow-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const reviewTemplates = [
    "We are thrilled with the exceptional service quality and attention to detail. Highly recommended!",
    "Outstanding experience from start to finish. The team exceeded our expectations in every way.",
    "Professional, reliable, and results-driven. This is exactly what we were looking for.",
    "Incredible value and top-notch customer service. We couldn't be happier with our choice."
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Reviews</h1>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Review Landing Page
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Review Landing Page</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="review-title">Review Title</Label>
                  <Input
                    id="review-title"
                    placeholder="Enter review title"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer-name">Customer Name (Optional)</Label>
                  <Input
                    id="customer-name"
                    placeholder="Enter customer name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="review-text">Review Text</Label>
                <Textarea
                  id="review-text"
                  placeholder="Enter detailed review text"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>Rating</Label>
                {renderRatingSelector(rating, setRating)}
              </div>

              {/* Review Templates */}
              <div className="space-y-2">
                <Label>Quick Templates</Label>
                <div className="grid grid-cols-1 gap-2">
                  {reviewTemplates.map((template, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="text-left justify-start h-auto p-3"
                      onClick={() => setReviewText(template)}
                    >
                      <div className="text-sm">{template}</div>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="review-image">Review Image</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <input
                    id="review-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <label htmlFor="review-image" className="cursor-pointer">
                    {reviewImage ? (
                      <div className="space-y-2">
                        <img src={reviewImage} alt="Preview" className="max-h-32 mx-auto rounded" />
                        <p className="text-sm text-green-600">✓ Image uploaded</p>
                      </div>
                    ) : (
                      <div>
                        <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm font-medium">Click to upload review image</p>
                        <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 5MB</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <Button 
                onClick={handleCreateReviewLanding} 
                disabled={isCreatingLanding}
                className="w-full"
              >
                {isCreatingLanding ? "Creating..." : "Create Review Landing Page"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="landing-pages">Review Landing Pages</TabsTrigger>
          <TabsTrigger value="all-reviews">All Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Reviews</p>
                    <p className="text-2xl font-bold">{totalReviews}</p>
                  </div>
                  <MessageSquare className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Average Rating</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-2xl font-bold">{averageRating.toFixed(1)}</p>
                      <div className="flex">{renderStars(Math.round(averageRating))}</div>
                    </div>
                  </div>
                  <Star className="w-8 h-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Positive Reviews</p>
                    <p className="text-2xl font-bold">{positiveReviews}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Response Rate</p>
                    <p className="text-2xl font-bold">{responseRate.toFixed(1)}%</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="landing-pages" className="space-y-6">
          <div className="grid gap-4">
            {reviewLandingPages.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <QrCode className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No review landing pages created yet.</p>
                  <Button variant="outline" onClick={() => setIsCreateModalOpen(true)} className="mt-4">
                    Create Your First Review Landing Page
                  </Button>
                </CardContent>
              </Card>
            ) : (
              reviewLandingPages.map((page) => (
                <Card key={page.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <img 
                          src={page.image} 
                          alt={page.title} 
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">{page.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{page.reviewText.substring(0, 100)}...</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <div className="flex items-center space-x-1">
                              {renderStars(page.rating)}
                              <span className="text-sm text-muted-foreground ml-2">{page.rating}/5</span>
                            </div>
                            {page.customerName && (
                              <span className="text-sm text-muted-foreground">by {page.customerName}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <Badge className={page.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {page.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t">
                      <div className="space-y-2">
                        <Label>QR Code</Label>
                        <div className="flex items-center space-x-2">
                          <img src={page.qrCode} alt="QR Code" className="w-16 h-16 border rounded" />
                          <div className="flex-1 space-y-1">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => copyToClipboard(page.qrCode, "QR Code URL")}
                              className="w-full"
                            >
                              <Copy className="w-4 h-4 mr-2" />
                              Copy QR Code URL
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => downloadQRCode(page.qrCode, page.title)}
                              className="w-full"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download QR Code
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Landing Page URL</Label>
                        <div className="flex items-center space-x-2">
                          <Input 
                            value={page.dynamicUrl} 
                            readOnly 
                            className="text-sm"
                          />
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => copyToClipboard(page.dynamicUrl, "Landing Page URL")}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => window.open(page.dynamicUrl, '_blank')}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => window.open(`/preview/review/${page.userId}/${page.id}`, '_blank')}
                          >
                            <FileText className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="all-reviews" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>All Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Comment</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reviews.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell className="font-medium">{review.customerName}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          {renderStars(review.rating)}
                          <span className="text-sm text-muted-foreground ml-2">{review.rating}</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{review.comment}</TableCell>
                      <TableCell>{review.date}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(review.status)}>
                          {review.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
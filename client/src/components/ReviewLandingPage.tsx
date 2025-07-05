import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, ThumbsUp, MessageSquare, ExternalLink } from "lucide-react";
import type { ReviewLandingPage } from "@shared/schema";

export default function ReviewLandingPage() {
  const params = useParams();
  const { userId, reviewId } = params;
  const [landingPage, setLandingPage] = useState<ReviewLandingPage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    // Load landing page data from localStorage
    const savedReviewLandingPages = JSON.parse(localStorage.getItem('reviewLandingPages') || '[]');
    const page = savedReviewLandingPages.find((p: ReviewLandingPage) => 
      p.userId === userId && p.id === reviewId
    );
    
    setLandingPage(page || null);
    setIsLoading(false);
  }, [userId, reviewId]);

  const handleLike = () => {
    setHasLiked(!hasLiked);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-6 h-6 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!landingPage || !landingPage.isActive) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center py-12">
            <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Review Not Found</h1>
            <p className="text-gray-600">This review is no longer available or has been removed.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold text-gray-900">Customer Review</div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-green-100 text-green-800">Verified Review</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Image Section */}
          <div className="order-2 lg:order-1">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <img 
                src={landingPage.image} 
                alt={landingPage.title}
                className="w-full h-96 object-cover"
              />
              <div className="absolute top-4 left-4">
                <Badge className="bg-white text-gray-900 shadow-lg">
                  <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                  {landingPage.rating}/5
                </Badge>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="order-1 lg:order-2 space-y-6">
            <div className="text-center lg:text-left">
              <div className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
                Customer Testimonial
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                {landingPage.title}
              </h1>
            </div>

            {/* Rating Display */}
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start space-x-2 mb-4">
                <div className="flex">{renderStars(landingPage.rating)}</div>
                <span className="text-2xl font-bold text-gray-900">{landingPage.rating}.0</span>
              </div>
              <p className="text-lg text-gray-600">Exceptional Experience</p>
            </div>

            {/* Review Text */}
            <Card className="bg-gradient-to-r from-gray-50 to-blue-50 border-2 border-blue-100">
              <CardContent className="p-6">
                <div className="relative">
                  <div className="text-6xl text-blue-200 absolute -top-2 -left-2">"</div>
                  <p className="text-lg leading-relaxed text-gray-800 pl-8 pr-4">
                    {landingPage.reviewText}
                  </p>
                  <div className="text-6xl text-blue-200 absolute -bottom-6 -right-2">"</div>
                </div>
                {landingPage.customerName && (
                  <div className="mt-6 pt-4 border-t border-blue-200">
                    <p className="font-semibold text-gray-900">— {landingPage.customerName}</p>
                    <p className="text-sm text-gray-600">Verified Customer</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Interaction Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={handleLike}
                variant={hasLiked ? "default" : "outline"}
                size="lg" 
                className={`flex-1 ${hasLiked ? 'bg-red-500 hover:bg-red-600 text-white' : ''}`}
              >
                <Heart className={`w-5 h-5 mr-2 ${hasLiked ? 'fill-current' : ''}`} />
                {hasLiked ? "Liked!" : "Like This Review"}
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="flex-1 border-2 border-gray-300 hover:border-gray-400"
                onClick={() => window.location.href = '/reviews'}
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                View More Reviews
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-green-700">
                <ThumbsUp className="w-5 h-5" />
                <span className="font-medium">This review has been verified and authenticated</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Why Our Customers Love Us</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">5-Star Quality</h4>
                <p className="text-sm text-gray-600">Consistently delivering excellence in every interaction</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Customer Care</h4>
                <p className="text-sm text-gray-600">Putting our customers first in everything we do</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ThumbsUp className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Proven Results</h4>
                <p className="text-sm text-gray-600">Real results that make a real difference</p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white max-w-xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Experience It Yourself</h3>
              <p className="mb-6 opacity-90">
                Join thousands of satisfied customers who have experienced our exceptional service.
              </p>
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100 font-semibold"
                onClick={() => window.location.href = '/'}
              >
                Get Started Today
                <ExternalLink className="w-5 h-5 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-gray-400">
            This customer review is brought to you by our SaaS Management Platform
          </p>
          <p className="text-gray-500 text-sm mt-2">
            All reviews are verified and authentic customer experiences
          </p>
        </div>
      </div>
    </div>
  );
}
import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Gift, Clock, ExternalLink } from "lucide-react";
import type { PromoLandingPage } from "@shared/schema";

export default function PromoLandingPage() {
  const params = useParams();
  const { userId, promoId } = params;
  const [landingPage, setLandingPage] = useState<PromoLandingPage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    // Load landing page data from localStorage
    const savedLandingPages = JSON.parse(localStorage.getItem('promoLandingPages') || '[]');
    const page = savedLandingPages.find((p: PromoLandingPage) => 
      p.userId === userId && p.id === promoId
    );
    
    setLandingPage(page || null);
    setIsLoading(false);
  }, [userId, promoId]);

  const copyPromoCode = () => {
    if (landingPage?.promoCode) {
      navigator.clipboard.writeText(landingPage.promoCode);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const isExpired = landingPage?.expiryDate && new Date(landingPage.expiryDate) < new Date();

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
            <Gift className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Promotion Not Found</h1>
            <p className="text-gray-600">This promotional offer is no longer available or has been removed.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getDiscountDisplay = () => {
    if (!landingPage.discountType || !landingPage.discountValue) return '';
    
    switch (landingPage.discountType) {
      case 'percentage':
        return `${landingPage.discountValue}% OFF`;
      case 'fixed':
        return `$${landingPage.discountValue} OFF`;
      case 'free_shipping':
        return 'FREE SHIPPING';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold text-gray-900">Special Offer</div>
            {landingPage.expiryDate && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>Expires: {new Date(landingPage.expiryDate).toLocaleDateString()}</span>
              </div>
            )}
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
              {isExpired && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <Badge variant="destructive" className="text-lg px-4 py-2">
                    EXPIRED
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* Content Section */}
          <div className="order-1 lg:order-2 space-y-6">
            <div className="text-center lg:text-left">
              <div className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
                Limited Time Offer
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                {landingPage.title}
              </h1>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                {landingPage.description}
              </p>
            </div>

            {/* Discount Badge */}
            {getDiscountDisplay() && (
              <div className="text-center lg:text-left">
                <div className="inline-block bg-gradient-to-r from-red-500 to-pink-500 text-white text-3xl font-bold px-8 py-4 rounded-2xl shadow-lg transform -rotate-2">
                  {getDiscountDisplay()}
                </div>
              </div>
            )}

            {/* Promo Code */}
            {landingPage.promoCode && !isExpired && (
              <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-dashed border-orange-200">
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700 mb-2">Use Promo Code:</p>
                    <div className="flex items-center justify-center space-x-3">
                      <code className="bg-white px-4 py-2 rounded-lg text-xl font-bold text-gray-900 border-2 border-orange-200">
                        {landingPage.promoCode}
                      </code>
                      <Button 
                        onClick={copyPromoCode}
                        variant={copySuccess ? "default" : "outline"}
                        size="sm"
                        className={copySuccess ? "bg-green-500 hover:bg-green-600" : ""}
                      >
                        {copySuccess ? "Copied!" : "Copy"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 text-lg"
                disabled={!!isExpired}
              >
                {isExpired ? "Offer Expired" : "Claim Offer Now"}
                {!isExpired && <ExternalLink className="w-5 h-5 ml-2" />}
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="flex-1 border-2 border-gray-300 hover:border-gray-400 py-4 text-lg"
                onClick={() => window.location.href = '/'}
              >
                Browse More Offers
              </Button>
            </div>

            {/* Urgency Message */}
            {!isExpired && landingPage.expiryDate && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 text-red-700">
                  <Clock className="w-5 h-5" />
                  <span className="font-medium">Hurry! This offer expires on {new Date(landingPage.expiryDate).toLocaleDateString()}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Why Choose This Offer?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Gift className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Exclusive Deal</h4>
                <p className="text-sm text-gray-600">Available only through this special link</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Limited Time</h4>
                <p className="text-sm text-gray-600">Don't miss out on this amazing opportunity</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ExternalLink className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Easy to Use</h4>
                <p className="text-sm text-gray-600">Simple checkout with instant savings</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-gray-400">
            This promotional offer is brought to you by our SaaS Management Platform
          </p>
        </div>
      </div>
    </div>
  );
}
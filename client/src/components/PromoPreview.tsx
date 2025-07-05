import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Printer, Edit3, Download, ArrowLeft, Copy, Check } from "lucide-react";
import QRCode from "qrcode";
import type { PromoLandingPage } from "@shared/schema";

export default function PromoPreview() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const { userId, promoId } = params;
  const [landingPage, setLandingPage] = useState<PromoLandingPage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Load landing page data from localStorage
    const savedPromoLandingPages = JSON.parse(localStorage.getItem('promoLandingPages') || '[]');
    const page = savedPromoLandingPages.find((p: PromoLandingPage) => 
      p.userId === userId && p.id === promoId
    );
    
    if (page) {
      setLandingPage(page);
      // Generate QR code for the landing page URL
      const landingPageUrl = `${window.location.origin}/promo/${userId}/${promoId}`;
      QRCode.toDataURL(landingPageUrl, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      }).then((url: string) => {
        setQrCodeUrl(url);
      });
    }
    
    setIsLoading(false);
  }, [userId, promoId]);

  const handlePrint = () => {
    window.print();
  };

  const handleEdit = () => {
    setLocation('/promotions');
  };

  const handleDownload = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.download = `promo-${promoId}-qr.png`;
      link.href = qrCodeUrl;
      link.click();
    }
  };

  const handleCopyUrl = () => {
    const url = `${window.location.origin}/promo/${userId}/${promoId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!landingPage) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Promo Not Found</h1>
            <p className="text-gray-600">This promotion preview is not available.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Hidden in print */}
      <div className="bg-white shadow-sm border-b print:hidden">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => setLocation('/promotions')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Print Preview</h1>
                <p className="text-sm text-gray-600">Promo: {landingPage.title}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleCopyUrl}>
                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied ? "Copied!" : "Copy URL"}
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Download QR
              </Button>
              <Button variant="outline" size="sm" onClick={handleEdit}>
                <Edit3 className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button size="sm" onClick={handlePrint}>
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Printable Content */}
      <div className="max-w-2xl mx-auto p-8 bg-white print:p-4 print:max-w-none print:mx-0">
        <div className="space-y-8 print:space-y-6">
          {/* Title and Description */}
          <div className="text-center">
            <div className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
              Special Offer
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4 print:text-3xl">
              {landingPage.title}
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed print:text-base">
              {landingPage.description}
            </p>
          </div>

          {/* Image */}
          <div className="flex justify-center">
            <div className="relative overflow-hidden rounded-lg shadow-lg max-w-md w-full">
              <img 
                src={landingPage.image} 
                alt={landingPage.title}
                className="w-full h-64 object-cover print:h-48"
              />
            </div>
          </div>

          {/* QR Code */}
          <div className="flex justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-gray-200 print:shadow-none print:border">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 print:text-base">
                  Scan to Access Offer
                </h3>
                {qrCodeUrl && (
                  <img 
                    src={qrCodeUrl} 
                    alt="QR Code" 
                    className="w-48 h-48 mx-auto print:w-32 print:h-32"
                  />
                )}
                <p className="text-sm text-gray-600 mt-2 print:text-xs">
                  Scan with your phone camera
                </p>
              </div>
            </div>
          </div>

          {/* Discount Offer */}
          <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg p-6 text-center print:bg-gray-800">
            <div className="text-sm font-medium mb-2">Limited Time Offer</div>
            <div className="text-3xl font-bold mb-2 print:text-2xl">
              {landingPage.discountType === 'percentage' ? `${landingPage.discountValue}% OFF` :
               landingPage.discountType === 'fixed' ? `$${landingPage.discountValue} OFF` :
               'FREE SHIPPING'}
            </div>
            <div className="text-sm opacity-90">
              Use code: <span className="font-mono font-bold">{landingPage.promoCode}</span>
            </div>
            {landingPage.expiryDate && (
              <div className="text-xs mt-2 opacity-80">
                Expires: {new Date(landingPage.expiryDate).toLocaleDateString()}
              </div>
            )}
          </div>

          {/* Call to Action */}
          <div className="text-center space-y-4">
            <div className="text-sm text-gray-600 print:text-xs">
              Visit our website or scan the QR code above to redeem this exclusive offer
            </div>
            <div className="text-xs text-gray-500 print:text-[10px]">
              {window.location.origin}/promo/{userId}/{promoId}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t pt-4 text-center text-xs text-gray-500 print:text-[10px]">
            <p>This promotional material was created using our SaaS Management Platform</p>
            <p className="mt-1">© 2025 - All rights reserved</p>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @media print {
            @page {
              margin: 0.5in;
              size: letter;
            }
            
            body {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            
            .print\\:hidden {
              display: none !important;
            }
            
            .print\\:p-4 {
              padding: 1rem !important;
            }
            
            .print\\:max-w-none {
              max-width: none !important;
            }
            
            .print\\:mx-0 {
              margin-left: 0 !important;
              margin-right: 0 !important;
            }
            
            .print\\:space-y-6 > * + * {
              margin-top: 1.5rem !important;
            }
            
            .print\\:text-3xl {
              font-size: 1.875rem !important;
            }
            
            .print\\:text-base {
              font-size: 1rem !important;
            }
            
            .print\\:text-xs {
              font-size: 0.75rem !important;
            }
            
            .print\\:text-\\[10px\\] {
              font-size: 10px !important;
            }
            
            .print\\:h-48 {
              height: 12rem !important;
            }
            
            .print\\:w-32 {
              width: 8rem !important;
            }
            
            .print\\:h-32 {
              height: 8rem !important;
            }
            
            .print\\:text-2xl {
              font-size: 1.5rem !important;
            }
            
            .print\\:shadow-none {
              box-shadow: none !important;
            }
            
            .print\\:border {
              border: 1px solid #e5e7eb !important;
            }
            
            .print\\:bg-gray-800 {
              background-color: #1f2937 !important;
            }
          }
        `
      }} />
    </div>
  );
}
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Percent, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  QrCode, 
  Copy, 
  Upload, 
  Link, 
  Eye,
  ExternalLink,
  Download
} from "lucide-react";
import { LocalStorage } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import type { Promotion, PromoLandingPage } from "@shared/schema";

export default function Promotions() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [landingPages, setLandingPages] = useState<PromoLandingPage[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Promotion | null>(null);
  const [isCreatingLanding, setIsCreatingLanding] = useState(false);
  
  // Form states
  const [promoTitle, setPromoTitle] = useState("");
  const [promoDescription, setPromoDescription] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed' | 'free_shipping'>('percentage');
  const [discountValue, setDiscountValue] = useState(0);
  const [expiryDate, setExpiryDate] = useState("");
  const [promoImage, setPromoImage] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    const savedPromotions = LocalStorage.getPromotions();
    setPromotions(savedPromotions);
    
    // Load landing pages from localStorage
    const savedLandingPages = JSON.parse(localStorage.getItem('promoLandingPages') || '[]');
    setLandingPages(savedLandingPages);
  }, []);

  const generateQRCode = (url: string): string => {
    // Generate a simple QR code using a service
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
  };

  const generateDynamicUrl = (userId: string, promoId: string): string => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/promo/${userId}/${promoId}`;
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setImageFile(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          setPromoImage(e.target?.result as string);
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

  const handleCreatePromoLanding = async () => {
    if (!promoTitle || !promoDescription || !promoImage) {
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
    const promoId = Date.now().toString();
    const dynamicUrl = generateDynamicUrl(userId, promoId);
    const qrCode = generateQRCode(dynamicUrl);

    const newLandingPage: PromoLandingPage = {
      id: promoId,
      userId,
      title: promoTitle,
      description: promoDescription,
      image: promoImage,
      promoCode,
      discountValue,
      discountType,
      expiryDate,
      isActive: true,
      qrCode,
      dynamicUrl,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save to localStorage
    const updatedLandingPages = [...landingPages, newLandingPage];
    setLandingPages(updatedLandingPages);
    localStorage.setItem('promoLandingPages', JSON.stringify(updatedLandingPages));

    // Also create regular promotion
    const newPromotion: Promotion = {
      id: promoId,
      name: promoTitle,
      code: promoCode || `PROMO${promoId}`,
      description: promoDescription,
      type: discountType,
      value: discountValue,
      currentUsage: 0,
      maxUsage: 1000,
      startDate: new Date().toISOString().split('T')[0],
      endDate: expiryDate,
      status: 'active'
    };

    const updatedPromotions = [...promotions, newPromotion];
    setPromotions(updatedPromotions);
    LocalStorage.savePromotions(updatedPromotions);

    // Reset form
    setPromoTitle("");
    setPromoDescription("");
    setPromoCode("");
    setDiscountValue(0);
    setExpiryDate("");
    setPromoImage("");
    setImageFile(null);
    setIsCreatingLanding(false);
    setIsCreateModalOpen(false);

    toast({
      title: "Promo landing page created successfully",
      description: "Your promotional landing page is now live with QR code!",
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
    link.download = `${title}-qr-code.png`;
    link.click();
  };

  const activePromotions = promotions.filter(p => p.status === 'active').length;
  const totalDiscounts = promotions.reduce((sum, p) => sum + (p.currentUsage * p.value), 0);
  const averageUsage = promotions.length > 0 
    ? promotions.reduce((sum, p) => sum + (p.currentUsage / p.maxUsage), 0) / promotions.length * 100
    : 0;
  const totalReach = promotions.reduce((sum, p) => sum + p.currentUsage, 0);

  const getStatusBadge = (status: Promotion['status']) => {
    const variants = {
      active: 'bg-green-100 text-green-800',
      expired: 'bg-red-100 text-red-800',
      disabled: 'bg-gray-100 text-gray-800'
    };
    return variants[status] || variants.disabled;
  };

  const getTypeDisplay = (type: Promotion['type'], value: number) => {
    switch (type) {
      case 'percentage':
        return `${value}%`;
      case 'fixed':
        return `$${value}`;
      case 'free_shipping':
        return 'Free Shipping';
      default:
        return value.toString();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Promotions</h1>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Promo Landing Page
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Promotional Landing Page</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="promo-title">Promotion Title</Label>
                  <Input
                    id="promo-title"
                    placeholder="Enter promotion title"
                    value={promoTitle}
                    onChange={(e) => setPromoTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="promo-code">Promo Code (Optional)</Label>
                  <Input
                    id="promo-code"
                    placeholder="Enter promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="promo-description">Promotion Description</Label>
                <Textarea
                  id="promo-description"
                  placeholder="Enter detailed promotion description"
                  value={promoDescription}
                  onChange={(e) => setPromoDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="discount-type">Discount Type</Label>
                  <Select value={discountType} onValueChange={(value: 'percentage' | 'fixed' | 'free_shipping') => setDiscountType(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select discount type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                      <SelectItem value="free_shipping">Free Shipping</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discount-value">Discount Value</Label>
                  <Input
                    id="discount-value"
                    type="number"
                    placeholder="Enter discount value"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiry-date">Expiry Date</Label>
                  <Input
                    id="expiry-date"
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="promo-image">Promotion Image</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <input
                    id="promo-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <label htmlFor="promo-image" className="cursor-pointer">
                    {promoImage ? (
                      <div className="space-y-2">
                        <img src={promoImage} alt="Preview" className="max-h-32 mx-auto rounded" />
                        <p className="text-sm text-green-600">✓ Image uploaded</p>
                      </div>
                    ) : (
                      <div>
                        <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm font-medium">Click to upload promotion image</p>
                        <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 5MB</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <Button 
                onClick={handleCreatePromoLanding} 
                disabled={isCreatingLanding}
                className="w-full"
              >
                {isCreatingLanding ? "Creating..." : "Create Promo Landing Page"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="landing-pages">Landing Pages</TabsTrigger>
          <TabsTrigger value="promotions">All Promotions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Promotions</p>
                    <p className="text-2xl font-bold">{activePromotions}</p>
                  </div>
                  <Percent className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Discounts</p>
                    <p className="text-2xl font-bold">${totalDiscounts}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Average Usage</p>
                    <p className="text-2xl font-bold">{averageUsage.toFixed(1)}%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Reach</p>
                    <p className="text-2xl font-bold">{totalReach}</p>
                  </div>
                  <Users className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="landing-pages" className="space-y-6">
          <div className="grid gap-4">
            {landingPages.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <QrCode className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No promotional landing pages created yet.</p>
                  <Button variant="outline" onClick={() => setIsCreateModalOpen(true)} className="mt-4">
                    Create Your First Landing Page
                  </Button>
                </CardContent>
              </Card>
            ) : (
              landingPages.map((page) => (
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
                          <p className="text-sm text-muted-foreground mt-1">{page.description}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            {page.promoCode && (
                              <Badge variant="outline">{page.promoCode}</Badge>
                            )}
                            <span className="text-sm text-muted-foreground">
                              {getTypeDisplay(page.discountType || 'percentage', page.discountValue || 0)} off
                            </span>
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
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="promotions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>All Promotions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {promotions.map((promo) => (
                    <TableRow key={promo.id}>
                      <TableCell className="font-medium">{promo.code}</TableCell>
                      <TableCell>{promo.description}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {getTypeDisplay(promo.type, promo.value)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span>{promo.currentUsage}/{promo.maxUsage}</span>
                            <span>{Math.round((promo.currentUsage / promo.maxUsage) * 100)}%</span>
                          </div>
                          <Progress value={(promo.currentUsage / promo.maxUsage) * 100} className="h-2" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(promo.status)}>
                          {promo.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4" />
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
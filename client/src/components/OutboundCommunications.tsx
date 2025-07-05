import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Phone, MessageSquare, Mail, Upload, Send, Users, BarChart3, Clock, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { OutboundCampaign } from "@shared/schema";

export default function OutboundCommunications() {
  const [campaigns, setCampaigns] = useState<OutboundCampaign[]>([]);
  const [activeTab, setActiveTab] = useState("create");
  const [campaignType, setCampaignType] = useState<'call' | 'sms' | 'email'>('sms');
  const [campaignName, setCampaignName] = useState("");
  const [message, setMessage] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [recipients, setRecipients] = useState<Array<{ phone?: string; email?: string; name?: string }>>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "text/csv") {
      setUploadedFile(file);
      
      // Simulate CSV parsing
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const lines = text.split('\n');
        const parsedRecipients: Array<{ phone?: string; email?: string; name?: string }> = [];
        
        lines.forEach((line, index) => {
          if (index === 0) return; // Skip header
          const [name, phone, email] = line.split(',').map(s => s.trim());
          if (name || phone || email) {
            parsedRecipients.push({ name, phone, email });
          }
        });
        
        setRecipients(parsedRecipients);
        toast({
          title: "File uploaded successfully",
          description: `Parsed ${parsedRecipients.length} recipients from CSV file.`,
        });
      };
      reader.readAsText(file);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV file.",
        variant: "destructive",
      });
    }
  };

  const handleSendCampaign = async () => {
    if (!campaignName || !message || recipients.length === 0) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields and upload recipients.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const newCampaign: OutboundCampaign = {
      id: Date.now().toString(),
      name: campaignName,
      type: campaignType,
      message,
      recipients,
      status: 'sent',
      createdAt: new Date().toISOString(),
      stats: {
        sent: recipients.length,
        delivered: Math.floor(recipients.length * 0.85),
        failed: Math.floor(recipients.length * 0.15),
        responses: Math.floor(recipients.length * 0.12)
      }
    };

    setCampaigns([newCampaign, ...campaigns]);
    
    // Reset form
    setCampaignName("");
    setMessage("");
    setRecipients([]);
    setUploadedFile(null);
    setIsProcessing(false);
    
    toast({
      title: "Campaign sent successfully",
      description: `Your ${campaignType} campaign has been sent to ${recipients.length} recipients.`,
    });

    setActiveTab("campaigns");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'call': return <Phone className="w-4 h-4" />;
      case 'sms': return <MessageSquare className="w-4 h-4" />;
      case 'email': return <Mail className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const smsTemplates = [
    "Hi {name}! Check out our special offer: {promo_link}",
    "🎉 Exclusive deal for you! Get {discount}% off: {promo_link}",
    "Last chance! Your discount expires soon: {promo_link}",
    "New arrivals just for you! Shop now: {promo_link}"
  ];

  const emailTemplates = [
    "Subject: Special Offer Just for You!\n\nHi {name},\n\nWe have an exclusive offer waiting for you: {promo_link}\n\nBest regards,\nYour Team",
    "Subject: Limited Time Deal!\n\nDear {name},\n\nDon't miss out on this amazing deal: {promo_link}\n\nHurry, offer expires soon!\n\nCheers,\nYour Team"
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Outbound Communications</h1>
        <div className="flex space-x-2">
          <Badge variant="outline" className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span>{campaigns.reduce((sum, c) => sum + c.recipients.length, 0)} Total Recipients</span>
          </Badge>
          <Badge variant="outline" className="flex items-center space-x-1">
            <Send className="w-4 h-4" />
            <span>{campaigns.length} Campaigns</span>
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="create">Create Campaign</TabsTrigger>
          <TabsTrigger value="campaigns">Campaign History</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create New Campaign</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="campaign-name">Campaign Name</Label>
                  <Input
                    id="campaign-name"
                    placeholder="Enter campaign name"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="campaign-type">Campaign Type</Label>
                  <Select value={campaignType} onValueChange={(value: 'call' | 'sms' | 'email') => setCampaignType(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select campaign type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="call">
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4" />
                          <span>Voice Call</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="sms">
                        <div className="flex items-center space-x-2">
                          <MessageSquare className="w-4 h-4" />
                          <span>SMS Text</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="email">
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4" />
                          <span>Email</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message Content</Label>
                <Textarea
                  id="message"
                  placeholder={`Enter your ${campaignType} message here...`}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                />
                <div className="text-sm text-muted-foreground">
                  Use {"{name}"} for personalization and {"{promo_link}"} for promotional links
                </div>
              </div>

              {/* Message Templates */}
              <div className="space-y-2">
                <Label>Quick Templates</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {(campaignType === 'sms' ? smsTemplates : emailTemplates).map((template, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="text-left justify-start h-auto p-3"
                      onClick={() => setMessage(template)}
                    >
                      <div className="text-sm">{template.substring(0, 60)}...</div>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="file-upload">Upload Recipients (CSV)</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <input
                    id="file-upload"
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm font-medium">Click to upload CSV file</p>
                    <p className="text-xs text-muted-foreground">
                      CSV format: Name, Phone, Email
                    </p>
                  </label>
                  {uploadedFile && (
                    <p className="text-sm text-green-600 mt-2">
                      ✓ {uploadedFile.name} uploaded ({recipients.length} recipients)
                    </p>
                  )}
                </div>
              </div>

              {recipients.length > 0 && (
                <div className="space-y-2">
                  <Label>Recipients Preview</Label>
                  <div className="max-h-32 overflow-y-auto border rounded-lg p-2">
                    {recipients.slice(0, 5).map((recipient, index) => (
                      <div key={index} className="text-sm py-1">
                        {recipient.name} - {recipient.phone || recipient.email}
                      </div>
                    ))}
                    {recipients.length > 5 && (
                      <div className="text-sm text-muted-foreground">
                        +{recipients.length - 5} more recipients...
                      </div>
                    )}
                  </div>
                </div>
              )}

              <Button 
                onClick={handleSendCampaign} 
                disabled={isProcessing}
                className="w-full"
              >
                {isProcessing ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Sending Campaign...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Campaign
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          <div className="grid gap-4">
            {campaigns.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Send className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No campaigns created yet.</p>
                  <Button variant="outline" onClick={() => setActiveTab("create")} className="mt-4">
                    Create Your First Campaign
                  </Button>
                </CardContent>
              </Card>
            ) : (
              campaigns.map((campaign) => (
                <Card key={campaign.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="mt-1">
                          {getTypeIcon(campaign.type)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">{campaign.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {campaign.message.substring(0, 100)}...
                          </p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-sm text-muted-foreground">
                              {campaign.recipients.length} recipients
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {new Date(campaign.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Badge className={getStatusColor(campaign.status)}>
                        {campaign.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-foreground">{campaign.stats.sent}</div>
                        <div className="text-sm text-muted-foreground">Sent</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{campaign.stats.delivered}</div>
                        <div className="text-sm text-muted-foreground">Delivered</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">{campaign.stats.failed}</div>
                        <div className="text-sm text-muted-foreground">Failed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{campaign.stats.responses}</div>
                        <div className="text-sm text-muted-foreground">Responses</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Campaigns</p>
                    <p className="text-2xl font-bold">{campaigns.length}</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Average Delivery Rate</p>
                    <p className="text-2xl font-bold">
                      {campaigns.length > 0 
                        ? Math.round((campaigns.reduce((sum, c) => sum + c.stats.delivered, 0) / campaigns.reduce((sum, c) => sum + c.stats.sent, 0)) * 100) || 0
                        : 0}%
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Response Rate</p>
                    <p className="text-2xl font-bold">
                      {campaigns.length > 0 
                        ? Math.round((campaigns.reduce((sum, c) => sum + c.stats.responses, 0) / campaigns.reduce((sum, c) => sum + c.stats.sent, 0)) * 100) || 0
                        : 0}%
                    </p>
                  </div>
                  <MessageSquare className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {campaigns.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Campaign Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {campaigns.map((campaign) => (
                    <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getTypeIcon(campaign.type)}
                        <div>
                          <p className="font-medium">{campaign.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {campaign.type.toUpperCase()} • {campaign.recipients.length} recipients
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {Math.round((campaign.stats.delivered / campaign.stats.sent) * 100)}% delivered
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {Math.round((campaign.stats.responses / campaign.stats.sent) * 100)}% responded
                          </p>
                        </div>
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-500 rounded-full"
                            style={{ width: `${(campaign.stats.delivered / campaign.stats.sent) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
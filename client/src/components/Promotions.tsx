import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Percent, DollarSign, TrendingUp, Users, Plus, Edit, Trash2 } from "lucide-react";
import { LocalStorage } from "@/lib/storage";
import type { Promotion } from "@shared/schema";

export default function Promotions() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);

  useEffect(() => {
    const savedPromotions = LocalStorage.getPromotions();
    setPromotions(savedPromotions);
  }, []);

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

  const handleDelete = (id: string) => {
    const updatedPromotions = promotions.filter(p => p.id !== id);
    setPromotions(updatedPromotions);
    LocalStorage.savePromotions(updatedPromotions);
  };

  const handleEdit = (id: string) => {
    console.log('Edit promotion:', id);
    // Implementation for editing promotions
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
        <h2 className="text-2xl font-semibold text-foreground">Promotion Management</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Promotion
        </Button>
      </div>

      {/* Promotion Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="metric-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Promotions</p>
                <p className="text-2xl font-semibold text-foreground">{activePromotions}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Percent className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Discounts</p>
                <p className="text-2xl font-semibold text-foreground">${totalDiscounts.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Usage</p>
                <p className="text-2xl font-semibold text-foreground">{averageUsage.toFixed(1)}%</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Users Reached</p>
                <p className="text-2xl font-semibold text-foreground">{totalReach.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Users className="w-5 h-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Promotions Table */}
      <Card className="data-table">
        <CardHeader className="table-header">
          <CardTitle>Active Promotions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Promotion</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {promotions.map((promotion) => {
                const usagePercentage = (promotion.currentUsage / promotion.maxUsage) * 100;
                
                return (
                  <TableRow key={promotion.id}>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium text-foreground">{promotion.code}</p>
                        <p className="text-sm text-muted-foreground">{promotion.name}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground capitalize">
                        {promotion.type.replace('_', ' ')}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-foreground">
                        {getTypeDisplay(promotion.type, promotion.value)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>{promotion.currentUsage}/{promotion.maxUsage}</span>
                          <span className="text-muted-foreground">{usagePercentage.toFixed(0)}%</span>
                        </div>
                        <Progress value={usagePercentage} className="h-2" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(promotion.endDate)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className={`status-badge ${getStatusBadge(promotion.status)}`}>
                        {promotion.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(promotion.id)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(promotion.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

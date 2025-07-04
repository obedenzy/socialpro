import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign, CreditCard, CheckCircle, XCircle, Plus } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { LocalStorage } from "@/lib/storage";
import type { Payment } from "@shared/schema";

const paymentMethods = [
  { id: 'visa', name: 'Visa', icon: '💳', color: 'text-blue-600', active: true },
  { id: 'mastercard', name: 'Mastercard', icon: '💳', color: 'text-red-600', active: true },
  { id: 'paypal', name: 'PayPal', icon: '🅿️', color: 'text-blue-500', active: true },
  { id: 'stripe', name: 'Stripe', icon: '💎', color: 'text-purple-600', active: true }
];

const revenueChartData = [
  { name: "Jan", revenue: 4200 },
  { name: "Feb", revenue: 5100 },
  { name: "Mar", revenue: 4800 },
  { name: "Apr", revenue: 5800 },
  { name: "May", revenue: 6900 },
  { name: "Jun", revenue: 7800 },
];

export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    const savedPayments = LocalStorage.getPayments();
    setPayments(savedPayments);
  }, []);

  const totalRevenue = payments
    .filter(p => p.status === 'success')
    .reduce((sum, payment) => sum + payment.amount, 0);

  const totalTransactions = payments.length;

  const successfulPayments = payments.filter(p => p.status === 'success').length;
  const successRate = totalTransactions > 0 ? (successfulPayments / totalTransactions) * 100 : 0;

  const failedPayments = payments.filter(p => p.status === 'failed').length;

  const getStatusBadge = (status: Payment['status']) => {
    const variants = {
      success: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800'
    };
    return variants[status] || variants.pending;
  };

  const getPaymentMethodIcon = (method: Payment['method']) => {
    const icons = {
      visa: '💳',
      mastercard: '💳',
      paypal: '🅿️',
      stripe: '💎',
      bank_transfer: '🏦'
    };
    return icons[method] || '💳';
  };

  const getPaymentMethodColor = (method: Payment['method']) => {
    const colors = {
      visa: 'text-blue-600',
      mastercard: 'text-red-600',
      paypal: 'text-blue-500',
      stripe: 'text-purple-600',
      bank_transfer: 'text-gray-600'
    };
    return colors[method] || 'text-gray-600';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-foreground">Payment Management</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Payment
        </Button>
      </div>

      {/* Payment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="metric-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-semibold text-foreground">
                  ${totalRevenue.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Transactions</p>
                <p className="text-2xl font-semibold text-foreground">
                  {totalTransactions.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <CreditCard className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-semibold text-foreground">
                  {successRate.toFixed(1)}%
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <CheckCircle className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Failed Payments</p>
                <p className="text-2xl font-semibold text-foreground">{failedPayments}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Methods and Revenue Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className="flex items-center justify-between p-3 border border-border rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{method.icon}</span>
                  <span className="text-sm font-medium text-foreground">{method.name}</span>
                </div>
                <Badge className={method.active ? 'status-badge success' : 'status-badge inactive'}>
                  {method.active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={revenueChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="hsl(var(--chart-1))" 
                  fill="hsl(var(--chart-1))" 
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card className="data-table">
        <CardHeader className="table-header">
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    <span className="text-sm text-foreground font-mono">
                      {payment.transactionId}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={payment.customerAvatar} />
                        <AvatarFallback>{getInitials(payment.customerName)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-foreground">{payment.customerName}</p>
                        <p className="text-sm text-muted-foreground">{payment.customerEmail}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-foreground font-semibold">
                      ${payment.amount.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getPaymentMethodIcon(payment.method)}</span>
                      <span className={`text-sm capitalize ${getPaymentMethodColor(payment.method)}`}>
                        {payment.method.replace('_', ' ')}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(payment.date)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge className={`status-badge ${getStatusBadge(payment.status)}`}>
                      {payment.status}
                    </Badge>
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

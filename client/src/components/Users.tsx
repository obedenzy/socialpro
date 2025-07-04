import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users as UsersIcon, UserCheck, UserPlus, Plus, Edit, Trash2 } from "lucide-react";
import { LocalStorage } from "@/lib/storage";
import type { User } from "@shared/schema";

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const savedUsers = LocalStorage.getUsers();
    setUsers(savedUsers);
  }, []);

  const activeUsers = users.filter(user => user.status === 'active').length;
  const today = new Date();
  const activeToday = users.filter(user => {
    const lastLogin = new Date(user.lastLogin);
    const diffInDays = Math.floor((today.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24));
    return diffInDays === 0 && user.status === 'active';
  }).length;

  const thisMonth = new Date();
  thisMonth.setMonth(thisMonth.getMonth() - 1);
  const newThisMonth = users.filter(user => {
    const joinDate = new Date(user.joinDate);
    return joinDate >= thisMonth;
  }).length;

  const getRoleBadge = (role: User['role']) => {
    const variants = {
      admin: 'bg-red-100 text-red-800',
      moderator: 'bg-purple-100 text-purple-800',
      user: 'bg-gray-100 text-gray-800'
    };
    return variants[role] || variants.user;
  };

  const getStatusBadge = (status: User['status']) => {
    const variants = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      suspended: 'bg-red-100 text-red-800'
    };
    return variants[status] || variants.inactive;
  };

  const handleDelete = (id: string) => {
    const updatedUsers = users.filter(user => user.id !== id);
    setUsers(updatedUsers);
    LocalStorage.saveUsers(updatedUsers);
  };

  const handleEdit = (id: string) => {
    console.log('Edit user:', id);
    // Implementation for editing users
  };

  const formatLastLogin = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-foreground">User Management</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="metric-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-semibold text-foreground">{users.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <UsersIcon className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Today</p>
                <p className="text-2xl font-semibold text-foreground">{activeToday}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <UserCheck className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">New This Month</p>
                <p className="text-2xl font-semibold text-foreground">{newThisMonth}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <UserPlus className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card className="data-table">
        <CardHeader className="table-header">
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-foreground">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`status-badge ${getRoleBadge(user.role)}`}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={`status-badge ${getStatusBadge(user.status)}`}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {formatLastLogin(user.lastLogin)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {new Date(user.joinDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(user.id)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:text-red-900"
                      >
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

      {/* Role Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Role Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {['admin', 'moderator', 'user'].map(role => {
              const count = users.filter(user => user.role === role).length;
              const percentage = users.length > 0 ? (count / users.length) * 100 : 0;
              
              return (
                <div key={role} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Badge className={`status-badge ${getRoleBadge(role as User['role'])}`}>
                      {role}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{count} users</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-12 text-right">
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

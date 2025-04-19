import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus, Search, MoreVertical, Edit, Trash2, UserPlus, Check, Users, Filter, ArrowUpDown, Download, Settings, ChevronLeft, ChevronRight, Shield } from 'lucide-react';
import { TeamMember, RolePermissions } from '@/types/team';
import {
  fetchTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  updateMemberRole,
  updateMemberStatus,
} from '@/api/team';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

const roles = [
  { value: 'admin', label: 'Administrator' },
  { value: 'manager', label: 'Manager' },
  { value: 'agent', label: 'Agent' },
];

// Default role permissions
const defaultRolePermissions: RolePermissions = {
  admin: {
    canManageTeam: true,
    canManageBilling: true,
    canViewAnalytics: true,
    canManageSettings: true,
  },
  manager: {
    canManageTeam: true,
    canManageBilling: false,
    canViewAnalytics: true,
    canManageSettings: false,
  },
  agent: {
    canManageTeam: false,
    canManageBilling: false,
    canViewAnalytics: false,
    canManageSettings: false,
  },
};

export function TeamAndPermissions() {
  const [searchQuery, setSearchQuery] = useState('');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isEditMemberOpen, setIsEditMemberOpen] = useState(false);
  const [isRoleManagementOpen, setIsRoleManagementOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [sortField, setSortField] = useState<keyof TeamMember>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filterRole, setFilterRole] = useState<TeamMember['role'] | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<TeamMember['status'] | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [rolePermissions, setRolePermissions] = useState<RolePermissions>(defaultRolePermissions);
  const [newMember, setNewMember] = useState<{
    name: string;
    email: string;
    role: TeamMember['role'];
  }>({
    name: '',
    email: '',
    role: 'agent',
  });

  useEffect(() => {
    loadTeamMembers();
  }, []);

  const loadTeamMembers = async () => {
    try {
      const members = await fetchTeamMembers();
      setTeamMembers(members);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load team members',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMember = async () => {
    try {
      const member = await createTeamMember({
        ...newMember,
        status: 'pending',
      });
      setTeamMembers([...teamMembers, member]);
      setIsAddMemberOpen(false);
      setNewMember({ name: '', email: '', role: 'agent' });
      toast({
        title: 'Success',
        description: 'Team member added successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add team member',
        variant: 'destructive',
      });
    }
  };

  const handleRoleChange = async (memberId: string, newRole: TeamMember['role']) => {
    try {
      const updatedMember = await updateMemberRole(memberId, newRole);
      setTeamMembers(teamMembers.map(member =>
        member.id === memberId ? updatedMember : member
      ));
      toast({
        title: 'Success',
        description: 'Role updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update role',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    try {
      await deleteTeamMember(memberId);
      setTeamMembers(teamMembers.filter(member => member.id !== memberId));
      toast({
        title: 'Success',
        description: 'Team member removed successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove team member',
        variant: 'destructive',
      });
    }
  };

  const handleEditMember = async () => {
    if (!editingMember) return;
    
    try {
      const updatedMember = await updateTeamMember(editingMember.id, {
        name: editingMember.name,
        email: editingMember.email,
        role: editingMember.role,
      });
      
      setTeamMembers(teamMembers.map(member =>
        member.id === editingMember.id ? updatedMember : member
      ));
      
      setIsEditMemberOpen(false);
      setEditingMember(null);
      
      toast({
        title: 'Success',
        description: 'Team member updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update team member',
        variant: 'destructive',
      });
    }
  };

  const openEditDialog = (member: TeamMember) => {
    setEditingMember({ ...member });
    setIsEditMemberOpen(true);
  };

  const handleBulkAction = async (action: 'activate' | 'deactivate' | 'delete') => {
    if (selectedMembers.length === 0) return;
    
    try {
      if (action === 'delete') {
        // Delete all selected members
        await Promise.all(selectedMembers.map(id => deleteTeamMember(id)));
        setTeamMembers(teamMembers.filter(member => !selectedMembers.includes(member.id)));
      } else {
        // Update status for all selected members
        const newStatus = action === 'activate' ? 'active' : 'inactive';
        await Promise.all(selectedMembers.map(id => updateMemberStatus(id, newStatus)));
        setTeamMembers(teamMembers.map(member => 
          selectedMembers.includes(member.id) 
            ? { ...member, status: newStatus } 
            : member
        ));
      }
      
      setSelectedMembers([]);
      toast({
        title: 'Success',
        description: `Bulk action completed successfully`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to complete bulk action',
        variant: 'destructive',
      });
    }
  };

  const toggleSelectAll = () => {
    if (selectedMembers.length === sortedAndFilteredMembers.length) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(sortedAndFilteredMembers.map(member => member.id));
    }
  };

  const toggleSelectMember = (memberId: string) => {
    if (selectedMembers.includes(memberId)) {
      setSelectedMembers(selectedMembers.filter(id => id !== memberId));
    } else {
      setSelectedMembers([...selectedMembers, memberId]);
    }
  };

  const handleSort = (field: keyof TeamMember) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Apply sorting and filtering
  const sortedAndFilteredMembers = React.useMemo(() => {
    let result = [...teamMembers];
    
    // Apply role filter
    if (filterRole !== 'all') {
      result = result.filter(member => member.role === filterRole);
    }
    
    // Apply status filter
    if (filterStatus !== 'all') {
      result = result.filter(member => member.status === filterStatus);
    }
    
    // Apply search filter
    if (searchQuery) {
      result = result.filter(
        member =>
          member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          member.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return 0;
    });
    
    return result;
  }, [teamMembers, searchQuery, sortField, sortDirection, filterRole, filterStatus]);

  // Pagination
  const totalPages = Math.ceil(sortedAndFilteredMembers.length / itemsPerPage);
  const paginatedMembers = sortedAndFilteredMembers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(parseInt(value, 10));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Export functionality
  const exportTeamData = () => {
    const csvContent = [
      // CSV header
      ['Name', 'Email', 'Role', 'Status'].join(','),
      // CSV rows
      ...sortedAndFilteredMembers.map(member => 
        [member.name, member.email, member.role, member.status].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `team-members-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Role permission management
  const handlePermissionChange = (role: keyof RolePermissions, permission: keyof RolePermissions[keyof RolePermissions], value: boolean) => {
    setRolePermissions(prev => ({
      ...prev,
      [role]: {
        ...prev[role],
        [permission]: value
      }
    }));
  };

  const saveRolePermissions = () => {
    // In a real app, this would save to the backend
    toast({
      title: 'Success',
      description: 'Role permissions updated successfully',
    });
    setIsRoleManagementOpen(false);
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'default';
      case 'manager':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'pending':
        return 'secondary';
      default:
        return 'destructive';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Team & Permissions</h2>
          <p className="text-muted-foreground">
            Manage team members and their access levels
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={exportTeamData}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" onClick={() => setIsRoleManagementOpen(true)}>
            <Shield className="mr-2 h-4 w-4" />
            Role Management
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative w-72">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search team members..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Select value={filterRole} onValueChange={(value: TeamMember['role'] | 'all') => setFilterRole(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {roles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={filterStatus} onValueChange={(value: TeamMember['status'] | 'all') => setFilterStatus(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              
              <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Team Member
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Team Member</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={newMember.name}
                        onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newMember.email}
                        onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select
                        value={newMember.role}
                        onValueChange={(value: TeamMember['role']) =>
                          setNewMember({ ...newMember, role: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map((role) => (
                            <SelectItem key={role.value} value={role.value}>
                              {role.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddMemberOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddMember}>Add Member</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {selectedMembers.length > 0 && (
            <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
              <span className="text-sm font-medium">
                {selectedMembers.length} member{selectedMembers.length !== 1 ? 's' : ''} selected
              </span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleBulkAction('activate')}
              >
                Activate
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleBulkAction('deactivate')}
              >
                Deactivate
              </Button>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => handleBulkAction('delete')}
              >
                Delete
              </Button>
            </div>
          )}

          <div className="border rounded-md">
            <div className="grid grid-cols-[auto,1fr,auto,auto,auto] gap-4 p-4 bg-muted/50 border-b">
              <div className="flex items-center">
                <Check
                  className={`h-4 w-4 mr-2 cursor-pointer ${
                    selectedMembers.length === sortedAndFilteredMembers.length ? 'text-primary' : 'text-muted-foreground'
                  }`}
                  onClick={toggleSelectAll}
                />
              </div>
              <div 
                className="flex items-center cursor-pointer"
                onClick={() => handleSort('name')}
              >
                <span className="font-medium">Name</span>
                {sortField === 'name' && (
                  <ArrowUpDown className={`ml-1 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-0' : 'rotate-180'}`} />
                )}
              </div>
              <div 
                className="flex items-center cursor-pointer"
                onClick={() => handleSort('role')}
              >
                <span className="font-medium">Role</span>
                {sortField === 'role' && (
                  <ArrowUpDown className={`ml-1 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-0' : 'rotate-180'}`} />
                )}
              </div>
              <div 
                className="flex items-center cursor-pointer"
                onClick={() => handleSort('status')}
              >
                <span className="font-medium">Status</span>
                {sortField === 'status' && (
                  <ArrowUpDown className={`ml-1 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-0' : 'rotate-180'}`} />
                )}
              </div>
              <div className="w-10"></div>
            </div>

            <div className="divide-y">
              {paginatedMembers.map((member) => (
                <div
                  key={member.id}
                  className="grid grid-cols-[auto,1fr,auto,auto,auto] gap-4 p-4 items-center"
                >
                  <div className="flex items-center">
                    <Check
                      className={`h-4 w-4 mr-2 cursor-pointer ${
                        selectedMembers.includes(member.id) ? 'text-primary' : 'text-muted-foreground'
                      }`}
                      onClick={() => toggleSelectMember(member.id)}
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>
                        {member.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {member.email}
                      </p>
                    </div>
                  </div>
                  <div>
                    <Select
                      defaultValue={member.role}
                      onValueChange={(value: TeamMember['role']) =>
                        handleRoleChange(member.id, value)
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Badge variant={getStatusBadgeVariant(member.status)}>
                      {member.status}
                    </Badge>
                  </div>
                  <div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditDialog(member)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDeleteMember(member.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between p-4 border-t">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Rows per page:</span>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={handleItemsPerPageChange}
                >
                  <SelectTrigger className="w-16">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {sortedAndFilteredMembers.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}-
                  {Math.min(currentPage * itemsPerPage, sortedAndFilteredMembers.length)} of {sortedAndFilteredMembers.length}
                </span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || totalPages === 0}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Edit Member Dialog */}
      <Dialog open={isEditMemberOpen} onOpenChange={setIsEditMemberOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Team Member</DialogTitle>
          </DialogHeader>
          {editingMember && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={editingMember.name}
                  onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editingMember.email}
                  onChange={(e) => setEditingMember({ ...editingMember, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role">Role</Label>
                <Select
                  value={editingMember.role}
                  onValueChange={(value: TeamMember['role']) =>
                    setEditingMember({ ...editingMember, role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={editingMember.status}
                  onValueChange={(value: TeamMember['status']) =>
                    setEditingMember({ ...editingMember, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsEditMemberOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditMember}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Role Management Dialog */}
      <Dialog open={isRoleManagementOpen} onOpenChange={setIsRoleManagementOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Role Management</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Tabs defaultValue="admin">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="admin">Administrator</TabsTrigger>
                <TabsTrigger value="manager">Manager</TabsTrigger>
                <TabsTrigger value="agent">Agent</TabsTrigger>
              </TabsList>
              <TabsContent value="admin" className="space-y-4 pt-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Manage Team</h3>
                      <p className="text-sm text-muted-foreground">Add, edit, and remove team members</p>
                    </div>
                    <Switch 
                      checked={rolePermissions.admin.canManageTeam} 
                      onCheckedChange={(checked) => handlePermissionChange('admin', 'canManageTeam', checked)}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Manage Billing</h3>
                      <p className="text-sm text-muted-foreground">View and manage subscription plans</p>
                    </div>
                    <Switch 
                      checked={rolePermissions.admin.canManageBilling} 
                      onCheckedChange={(checked) => handlePermissionChange('admin', 'canManageBilling', checked)}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">View Analytics</h3>
                      <p className="text-sm text-muted-foreground">Access to all analytics and reports</p>
                    </div>
                    <Switch 
                      checked={rolePermissions.admin.canViewAnalytics} 
                      onCheckedChange={(checked) => handlePermissionChange('admin', 'canViewAnalytics', checked)}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Manage Settings</h3>
                      <p className="text-sm text-muted-foreground">Configure system settings and integrations</p>
                    </div>
                    <Switch 
                      checked={rolePermissions.admin.canManageSettings} 
                      onCheckedChange={(checked) => handlePermissionChange('admin', 'canManageSettings', checked)}
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="manager" className="space-y-4 pt-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Manage Team</h3>
                      <p className="text-sm text-muted-foreground">Add, edit, and remove team members</p>
                    </div>
                    <Switch 
                      checked={rolePermissions.manager.canManageTeam} 
                      onCheckedChange={(checked) => handlePermissionChange('manager', 'canManageTeam', checked)}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Manage Billing</h3>
                      <p className="text-sm text-muted-foreground">View and manage subscription plans</p>
                    </div>
                    <Switch 
                      checked={rolePermissions.manager.canManageBilling} 
                      onCheckedChange={(checked) => handlePermissionChange('manager', 'canManageBilling', checked)}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">View Analytics</h3>
                      <p className="text-sm text-muted-foreground">Access to all analytics and reports</p>
                    </div>
                    <Switch 
                      checked={rolePermissions.manager.canViewAnalytics} 
                      onCheckedChange={(checked) => handlePermissionChange('manager', 'canViewAnalytics', checked)}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Manage Settings</h3>
                      <p className="text-sm text-muted-foreground">Configure system settings and integrations</p>
                    </div>
                    <Switch 
                      checked={rolePermissions.manager.canManageSettings} 
                      onCheckedChange={(checked) => handlePermissionChange('manager', 'canManageSettings', checked)}
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="agent" className="space-y-4 pt-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Manage Team</h3>
                      <p className="text-sm text-muted-foreground">Add, edit, and remove team members</p>
                    </div>
                    <Switch 
                      checked={rolePermissions.agent.canManageTeam} 
                      onCheckedChange={(checked) => handlePermissionChange('agent', 'canManageTeam', checked)}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Manage Billing</h3>
                      <p className="text-sm text-muted-foreground">View and manage subscription plans</p>
                    </div>
                    <Switch 
                      checked={rolePermissions.agent.canManageBilling} 
                      onCheckedChange={(checked) => handlePermissionChange('agent', 'canManageBilling', checked)}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">View Analytics</h3>
                      <p className="text-sm text-muted-foreground">Access to all analytics and reports</p>
                    </div>
                    <Switch 
                      checked={rolePermissions.agent.canViewAnalytics} 
                      onCheckedChange={(checked) => handlePermissionChange('agent', 'canViewAnalytics', checked)}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Manage Settings</h3>
                      <p className="text-sm text-muted-foreground">Configure system settings and integrations</p>
                    </div>
                    <Switch 
                      checked={rolePermissions.agent.canManageSettings} 
                      onCheckedChange={(checked) => handlePermissionChange('agent', 'canManageSettings', checked)}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRoleManagementOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveRolePermissions}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 
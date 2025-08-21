'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Badge,
//   BadgeProps
} from '@/components/ui/badge';
import {
  Button,
} from '@/components/ui/button';
import {
  Input,
} from '@/components/ui/input';
import {
  Textarea,
} from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import {
  ScrollArea,
} from '@/components/ui/scroll-area';
import {
  Separator,
} from '@/components/ui/separator';
import { 
  Clock, 
  User, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Edit, 
  MessageSquare, 
  Paperclip, 
  DollarSign,
  Package,
  Calendar,
  Phone,
  Mail,
  MapPin,
  RefreshCw,
  Search,
  Filter,
  Plus,
  FileText,
  Camera,
  Upload,
  Download
} from 'lucide-react';

// Types
interface Ticket {
  id: string;
  organization_id: string;
  reference: string;
  title: string;
  description: string;
  review_id?: string;
  order_id?: string;
  location_id?: string;
  created_by?: string;
  assigned_to?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed' | 'escalated';
  sla_due_at?: string;
  resolution_notes?: string;
  attachments?: any[];
  closed_at?: string;
  created_at: string;
  updated_at: string;
  assignee?: UserProfile;
  creator?: UserProfile;
  order?: Order;
  comments?: TicketComment[];
}

interface TicketComment {
  id: string;
  ticket_id: string;
  author_id?: string;
  body: string;
  attachments?: any[];
  is_internal: boolean;
  created_at: string;
  author?: UserProfile;
}

interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

interface Order {
  id: string;
  order_number: string;
  customer_id?: string;
  status: string;
  payment_status: string;
  total_amount: number;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  delivery_charge: number;
  delivery_address?: any;
  delivery_time?: string;
  special_instructions?: string;
  created_at: string;
  order_items?: OrderItem[];
}

interface OrderItem {
  id: string;
  menu_item_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  special_instructions?: string;
  status: string;
  menu_item?: MenuItem;
  customizations?: OrderItemCustomization[];
}

interface OrderItemCustomization {
  id: string;
  customization_name: string;
  additional_cost: number;
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
}

interface RefundRequest {
  id: string;
  ticket_id: string;
  order_id: string;
  amount: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'processed';
  evidence?: any[];
  approved_by?: string;
  processed_at?: string;
  created_at: string;
}

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function OpsTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [activeTab, setActiveTab] = useState('tickets');
  const [refundRequests, setRefundRequests] = useState<RefundRequest[]>([]);

  // Form states
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    priority: 'medium',
    assigned_to: '',
    order_id: ''
  });

  const [newComment, setNewComment] = useState('');
  const [refundForm, setRefundForm] = useState({
    amount: 0,
    reason: '',
    evidence: [] as File[]
  });

  // Load data
  const loadTickets = useCallback(async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('tickets')
        .select(`
          *,
          assignee:assigned_to(id, first_name, last_name, email, role),
          creator:created_by(id, first_name, last_name, email, role),
          order:orders(
            id, order_number, status, payment_status, total_amount, 
            subtotal, tax_amount, discount_amount, delivery_charge,
            delivery_address, delivery_time, special_instructions, created_at,
            order_items(
              id, quantity, unit_price, total_price, special_instructions, status,
              menu_item:menu_items(id, name, description, price, image_url),
              customizations:order_item_customizations(id, customization_name, additional_cost)
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }
      if (priorityFilter !== 'all') {
        query = query.eq('priority', priorityFilter);
      }
      if (assigneeFilter !== 'all') {
        query = query.eq('assigned_to', assigneeFilter);
      }
      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,reference.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      setTickets(data || []);
    } catch (error) {
      console.error('Error loading tickets:', error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, statusFilter, priorityFilter, assigneeFilter]);

  const loadUsers = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, first_name, last_name, email, role')
        .eq('is_active', true);
      
      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  }, []);

  const loadTicketDetails = useCallback(async (ticketId: string) => {
    try {
      const { data, error } = await supabase
        .from('ticket_comments')
        .select(`
          *,
          author:user_profiles(id, first_name, last_name, email, role)
        `)
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;

      setSelectedTicket(prev => prev ? {
        ...prev,
        comments: data || []
      } : null);
    } catch (error) {
      console.error('Error loading ticket details:', error);
    }
  }, []);

  const loadRefundRequests = useCallback(async () => {
    try {
      // This would be a custom table for refund requests
      // For now, we'll simulate this data
      const mockRefunds: RefundRequest[] = [
        {
          id: '1',
          ticket_id: 'ticket_1',
          order_id: 'order_1',
          amount: 150.00,
          reason: 'Food quality issue',
          status: 'pending',
          created_at: new Date().toISOString()
        }
      ];
      setRefundRequests(mockRefunds);
    } catch (error) {
      console.error('Error loading refund requests:', error);
    }
  }, []);

  useEffect(() => {
    loadTickets();
    loadUsers();
    loadRefundRequests();
  }, [loadTickets, loadUsers, loadRefundRequests]);

  // Ticket operations
  const createTicket = async () => {
    try {
      const ticketData = {
        ...newTicket,
        reference: `TKT-${Date.now()}`,
        organization_id: 'current-org-id', // Replace with actual org ID
        sla_due_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours from now
      };

      const { data, error } = await supabase
        .from('tickets')
        .insert([ticketData])
        .select()
        .single();

      if (error) throw error;

      setTickets(prev => [data, ...prev]);
      setShowCreateModal(false);
      setNewTicket({ title: '', description: '', priority: 'medium', assigned_to: '', order_id: '' });
    } catch (error) {
      console.error('Error creating ticket:', error);
    }
  };

  const updateTicketStatus = async (ticketId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('tickets')
        .update({ 
          status, 
          updated_at: new Date().toISOString(),
          ...(status === 'closed' && { closed_at: new Date().toISOString() })
        })
        .eq('id', ticketId);

      if (error) throw error;

      setTickets(prev => prev.map(ticket => 
        ticket.id === ticketId 
          ? { ...ticket, status: status as any, updated_at: new Date().toISOString() }
          : ticket
      ));

      if (selectedTicket?.id === ticketId) {
        setSelectedTicket(prev => prev ? { ...prev, status: status as any } : null);
      }
    } catch (error) {
      console.error('Error updating ticket status:', error);
    }
  };

  const assignTicket = async (ticketId: string, assigneeId: string) => {
    try {
      const { error } = await supabase
        .from('tickets')
        .update({ 
          assigned_to: assigneeId,
          updated_at: new Date().toISOString()
        })
        .eq('id', ticketId);

      if (error) throw error;

      const assignee = users.find(u => u.id === assigneeId);
      setTickets(prev => prev.map(ticket => 
        ticket.id === ticketId 
          ? { ...ticket, assigned_to: assigneeId, assignee, updated_at: new Date().toISOString() }
          : ticket
      ));

      if (selectedTicket?.id === ticketId) {
        setSelectedTicket(prev => prev ? { ...prev, assigned_to: assigneeId, assignee } : null);
      }
    } catch (error) {
      console.error('Error assigning ticket:', error);
    }
  };

  const addComment = async () => {
    if (!selectedTicket || !newComment.trim()) return;

    try {
      const commentData = {
        ticket_id: selectedTicket.id,
        author_id: 'current-user-id', // Replace with actual user ID
        body: newComment,
        is_internal: true
      };

      const { data, error } = await supabase
        .from('ticket_comments')
        .insert([commentData])
        .select(`
          *,
          author:user_profiles(id, first_name, last_name, email, role)
        `)
        .single();

      if (error) throw error;

      setSelectedTicket(prev => prev ? {
        ...prev,
        comments: [...(prev.comments || []), data]
      } : null);

      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const processRefund = async (refundId: string, action: 'approve' | 'reject') => {
    try {
      // This would update a refund requests table
      setRefundRequests(prev => prev.map(refund =>
        refund.id === refundId
          ? { ...refund, status: action === 'approve' ? 'approved' : 'rejected' }
          : refund
      ));
    } catch (error) {
      console.error('Error processing refund:', error);
    }
  };

  // Helper functions
  const getPriorityColor = (priority: string)  => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string)  => {
    switch (status) {
      case 'open': return 'default';
      case 'in_progress': return 'default';
      case 'resolved': return 'secondary';
      case 'closed': return 'secondary';
      case 'escalated': return 'destructive';
      default: return 'default';
    }
  };

  const isOverdue = (sla_due_at?: string) => {
    if (!sla_due_at) return false;
    return new Date(sla_due_at) < new Date();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN');
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Ops & Tickets</h1>
          <p className="text-muted-foreground">
            Manage customer issues, refunds, and order investigations
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Ticket
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tickets">Tickets</TabsTrigger>
          <TabsTrigger value="investigations">Investigations</TabsTrigger>
          <TabsTrigger value="refunds">Refunds</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="tickets" className="space-y-4">
          {/* Filters */}
          <Card className="gap-2">
            <CardHeader>
              <CardTitle className="text-lg">Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tickets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                    <SelectItem value="escalated">Escalated</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Assignees</SelectItem>
                    {users.map(user => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.first_name} {user.last_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={loadTickets}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tickets Table */}
          <Card>
            <CardHeader>
              <CardTitle>Tickets ({tickets.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <RefreshCw className="w-6 h-6 animate-spin mr-2" />
                  Loading tickets...
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reference</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Assignee</TableHead>
                      <TableHead>SLA</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tickets.map((ticket) => (
                      <TableRow key={ticket.id}>
                        <TableCell className="font-medium">{ticket.reference}</TableCell>
                        <TableCell>
                          <div className="max-w-xs truncate">{ticket.title}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getPriorityColor(ticket.priority)}>
                            {ticket.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(ticket.status)}>
                            {ticket.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {ticket.assignee ? (
                            <div className="flex items-center">
                              <User className="w-4 h-4 mr-1" />
                              {ticket.assignee.first_name} {ticket.assignee.last_name}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">Unassigned</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {ticket.sla_due_at && (
                            <div className={`flex items-center ${isOverdue(ticket.sla_due_at) ? 'text-red-500' : ''}`}>
                              <Clock className="w-4 h-4 mr-1" />
                              {formatDateTime(ticket.sla_due_at)}
                              {isOverdue(ticket.sla_due_at) && (
                                <AlertCircle className="w-4 h-4 ml-1" />
                              )}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>{formatDateTime(ticket.created_at)}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedTicket(ticket);
                                    loadTicketDetails(ticket.id);
                                  }}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="min-w-[1000px] max-h-[90vh] overflow-y-auto">
                                <TicketDetailView 
                                  ticket={selectedTicket}
                                  users={users}
                                  onStatusChange={updateTicketStatus}
                                  onAssigneeChange={assignTicket}
                                  onAddComment={addComment}
                                  newComment={newComment}
                                  setNewComment={setNewComment}
                                  formatCurrency={formatCurrency}
                                  formatDateTime={formatDateTime}
                                />
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="investigations">
          <OrderInvestigationView 
            tickets={tickets.filter(t => t.order_id)}
            formatCurrency={formatCurrency}
            formatDateTime={formatDateTime}
          />
        </TabsContent>

        <TabsContent value="refunds">
          <RefundManagementView
            refundRequests={refundRequests}
            onProcessRefund={processRefund}
            formatCurrency={formatCurrency}
            formatDateTime={formatDateTime}
          />
        </TabsContent>

        <TabsContent value="analytics">
          <AnalyticsView tickets={tickets} />
        </TabsContent>
      </Tabs>

      {/* Create Ticket Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Ticket</DialogTitle>
            <DialogDescription>
              Create a new support ticket for customer issues.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input
                value={newTicket.title}
                onChange={(e) => setNewTicket(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Brief description of the issue"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={newTicket.description}
                onChange={(e) => setNewTicket(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Detailed description of the issue"
                rows={3}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Priority</label>
              <Select 
                value={newTicket.priority} 
                onValueChange={(value) => setNewTicket(prev => ({ ...prev, priority: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Assign To</label>
              <Select 
                value={newTicket.assigned_to} 
                onValueChange={(value) => setNewTicket(prev => ({ ...prev, assigned_to: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent>
                  {users.map(user => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.first_name} {user.last_name} - {user.role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Order ID (Optional)</label>
              <Input
                value={newTicket.order_id}
                onChange={(e) => setNewTicket(prev => ({ ...prev, order_id: e.target.value }))}
                placeholder="Link to related order"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button onClick={createTicket}>
                Create Ticket
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Ticket Detail View Component
function TicketDetailView({ 
  ticket, 
  users, 
  onStatusChange, 
  onAssigneeChange, 
  onAddComment,
  newComment,
  setNewComment,
  formatCurrency,
  formatDateTime 
}: {
  ticket: Ticket | null;
  users: UserProfile[];
  onStatusChange: (ticketId: string, status: string) => void;
  onAssigneeChange: (ticketId: string, assigneeId: string) => void;
  onAddComment: () => void;
  newComment: string;
  setNewComment: (comment: string) => void;
  formatCurrency: (amount: number) => string;
  formatDateTime: (date: string) => string;
}) {
  if (!ticket) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <DialogHeader>
        <DialogTitle className="flex items-center justify-between">
          <span>{ticket.reference}: {ticket.title}</span>
          <Badge variant={ticket.status === 'open' ? 'default' : 'secondary'}>
            {ticket.status}
          </Badge>
        </DialogTitle>
      </DialogHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ticket Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="font-medium">Priority:</span>
              <Badge variant={ticket.priority === 'urgent' ? 'destructive' : 'default'}>
                {ticket.priority}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Created:</span>
              <span>{formatDateTime(ticket.created_at)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">SLA Due:</span>
              <span className={ticket.sla_due_at && new Date(ticket.sla_due_at) < new Date() ? 'text-red-500' : ''}>
                {ticket.sla_due_at ? formatDateTime(ticket.sla_due_at) : 'Not set'}
              </span>
            </div>
            <div>
              <span className="font-medium">Description:</span>
              <p className="mt-1 text-sm text-gray-600">{ticket.description}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-sm font-medium">Status</label>
              <Select 
                value={ticket.status} 
                onValueChange={(value) => onStatusChange(ticket.id, value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="escalated">Escalated</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Assign To</label>
              <Select 
                value={ticket.assigned_to || ''} 
                onValueChange={(value) => onAssigneeChange(ticket.id, value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent>
                  {users.map(user => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.first_name} {user.last_name} - {user.role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Information */}
      {ticket.order && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Related Order</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <span className="text-sm text-gray-500">Order Number</span>
                <p className="font-medium">{ticket.order.order_number}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Status</span>
                <p className="font-medium">{ticket.order.status}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Payment Status</span>
                <p className="font-medium">{ticket.order.payment_status}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Total Amount</span>
                <p className="font-medium">{formatCurrency(ticket.order.total_amount)}</p>
              </div>
            </div>
            
            {ticket.order.order_items && (
              <div>
                <h4 className="font-medium mb-2">Order Items</h4>
                <div className="space-y-2">
                  {ticket.order.order_items.map((item) => (
                    <div key={item.id} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-medium">{item.menu_item?.name}</h5>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                          {item.special_instructions && (
                            <p className="text-sm text-blue-600">Note: {item.special_instructions}</p>
                          )}
                          {item.customizations && item.customizations.length > 0 && (
                            <div className="mt-1">
                              <span className="text-xs text-gray-500">Customizations:</span>
                              {item.customizations.map((custom) => (
                                <span key={custom.id} className="text-xs bg-gray-100 rounded px-2 py-1 ml-1">
                                  {custom.customization_name} (+{formatCurrency(custom.additional_cost)})
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatCurrency(item.total_price)}</p>
                          <Badge variant="outline" className="text-xs">
                            {item.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Comments Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Comments & History</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64 mb-4">
            <div className="space-y-4">
              {ticket.comments && ticket.comments.length > 0 ? (
                ticket.comments.map((comment) => (
                  <div key={comment.id} className="border-l-2 border-blue-200 pl-4">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4" />
                        <span className="font-medium">
                          {comment.author ? 
                            `${comment.author.first_name} ${comment.author.last_name}` : 
                            'System'
                          }
                        </span>
                        {comment.is_internal && (
                          <Badge variant="outline" className="text-xs">Internal</Badge>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatDateTime(comment.created_at)}
                      </span>
                    </div>
                    <p className="text-sm">{comment.body}</p>
                    {comment.attachments && comment.attachments.length > 0 && (
                      <div className="flex items-center mt-2">
                        <Paperclip className="w-4 h-4 mr-1" />
                        <span className="text-xs text-gray-500">
                          {comment.attachments.length} attachment(s)
                        </span>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center">No comments yet</p>
              )}
            </div>
          </ScrollArea>
          
          <div className="flex space-x-2">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              rows={2}
              className="flex-1"
            />
            <Button onClick={onAddComment} disabled={!newComment.trim()}>
              <MessageSquare className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Order Investigation Component
function OrderInvestigationView({ 
  tickets, 
  formatCurrency, 
  formatDateTime 
}: {
  tickets: Ticket[];
  formatCurrency: (amount: number) => string;
  formatDateTime: (date: string) => string;
}) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Order Investigations</CardTitle>
          <CardDescription>
            Deep-dive into orders with reported issues
          </CardDescription>
        </CardHeader>
        <CardContent>
          {tickets.length > 0 ? (
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <Card key={ticket.id} className="border-l-4 border-l-orange-500">
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="font-medium">{ticket.title}</h4>
                        <p className="text-sm text-gray-500">{ticket.reference}</p>
                        <Badge variant="outline" className="mt-1">
                          {ticket.priority}
                        </Badge>
                      </div>
                      <div>
                        {ticket.order && (
                          <div>
                            <p className="text-sm"><strong>Order:</strong> {ticket.order.order_number}</p>
                            <p className="text-sm"><strong>Amount:</strong> {formatCurrency(ticket.order.total_amount)}</p>
                            <p className="text-sm"><strong>Status:</strong> {ticket.order.status}</p>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Created: {formatDateTime(ticket.created_at)}</p>
                        <div className="mt-2 space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-1" />
                            Investigate
                          </Button>
                          <Button size="sm">
                            <FileText className="w-4 h-4 mr-1" />
                            Generate Report
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No order-related tickets found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Refund Management Component
function RefundManagementView({
  refundRequests,
  onProcessRefund,
  formatCurrency,
  formatDateTime
}: {
  refundRequests: RefundRequest[];
  onProcessRefund: (refundId: string, action: 'approve' | 'reject') => void;
  formatCurrency: (amount: number) => string;
  formatDateTime: (date: string) => string;
}) {
  const [selectedRefund, setSelectedRefund] = useState<RefundRequest | null>(null);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Refund Requests</CardTitle>
          <CardDescription>
            Review and process customer refund requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          {refundRequests.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request ID</TableHead>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {refundRequests.map((refund) => (
                  <TableRow key={refund.id}>
                    <TableCell className="font-medium">{refund.id}</TableCell>
                    <TableCell>{refund.order_id}</TableCell>
                    <TableCell>{formatCurrency(refund.amount)}</TableCell>
                    <TableCell>{refund.reason}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          refund.status === 'approved' ? 'default' : 
                          refund.status === 'rejected' ? 'destructive' : 
                          'secondary'
                        }
                      >
                        {refund.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDateTime(refund.created_at)}</TableCell>
                    <TableCell>
                      {refund.status === 'pending' && (
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => onProcessRefund(refund.id, 'approve')}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => onProcessRefund(refund.id, 'reject')}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <DollarSign className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No refund requests found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Refund Workflow */}
      <Card>
        <CardHeader>
          <CardTitle>Refund Processing Workflow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-medium">Request</h4>
              <p className="text-sm text-gray-500">Customer submits refund request</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Eye className="w-6 h-6 text-yellow-600" />
              </div>
              <h4 className="font-medium">Validate</h4>
              <p className="text-sm text-gray-500">Review order and delivery evidence</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-medium">Approve/Reject</h4>
              <p className="text-sm text-gray-500">Make decision based on evidence</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-medium">Process</h4>
              <p className="text-sm text-gray-500">Execute refund and record transaction</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Analytics Component
function AnalyticsView({ tickets }: { tickets: Ticket[] }) {
  const getStatusCounts = () => {
    return tickets.reduce((acc, ticket) => {
      acc[ticket.status] = (acc[ticket.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  };

  const getPriorityCounts = () => {
    return tickets.reduce((acc, ticket) => {
      acc[ticket.priority] = (acc[ticket.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  };

  const getOverdueCount = () => {
    return tickets.filter(ticket => 
      ticket.sla_due_at && new Date(ticket.sla_due_at) < new Date()
    ).length;
  };

  const getAvgResolutionTime = () => {
    const resolvedTickets = tickets.filter(t => t.status === 'resolved' || t.status === 'closed');
    if (resolvedTickets.length === 0) return 0;
    
    const totalTime = resolvedTickets.reduce((acc, ticket) => {
      if (ticket.closed_at) {
        const created = new Date(ticket.created_at).getTime();
        const closed = new Date(ticket.closed_at).getTime();
        return acc + (closed - created);
      }
      return acc;
    }, 0);
    
    return Math.round(totalTime / resolvedTickets.length / (1000 * 60 * 60)); // Convert to hours
  };

  const statusCounts = getStatusCounts();
  const priorityCounts = getPriorityCounts();
  const overdueCount = getOverdueCount();
  const avgResolutionTime = getAvgResolutionTime();

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Tickets</p>
                <p className="text-2xl font-bold">{tickets.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{overdueCount}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Avg Resolution</p>
                <p className="text-2xl font-bold">{avgResolutionTime}h</p>
              </div>
              <Clock className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Open Tickets</p>
                <p className="text-2xl font-bold">{statusCounts.open || 0}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tickets by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(statusCounts).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${
                      status === 'open' ? 'bg-blue-500' :
                      status === 'in_progress' ? 'bg-yellow-500' :
                      status === 'resolved' ? 'bg-green-500' :
                      status === 'closed' ? 'bg-gray-500' :
                      'bg-red-500'
                    }`} />
                    <span className="capitalize">{status.replace('_', ' ')}</span>
                  </div>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tickets by Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(priorityCounts).map(([priority, count]) => (
                <div key={priority} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${
                      priority === 'low' ? 'bg-green-500' :
                      priority === 'medium' ? 'bg-yellow-500' :
                      priority === 'high' ? 'bg-orange-500' :
                      'bg-red-500'
                    }`} />
                    <span className="capitalize">{priority}</span>
                  </div>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tickets.slice(0, 5).map((ticket) => (
              <div key={ticket.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{ticket.title}</p>
                  <p className="text-sm text-gray-500">{ticket.reference}</p>
                </div>
                <div className="text-right">
                  <Badge variant="outline">{ticket.status}</Badge>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(ticket.updated_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
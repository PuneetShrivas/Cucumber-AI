'use client';

import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  MessageSquare,
  Star,
  Clock,
  User,
  MapPin,
  Package,
  Reply,
  Ticket,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Filter,
  Search,
  Calendar,
  MoreVertical,
  Bot,
  UserCheck,
  Archive,
  Trash2,
  ExternalLink,
  Phone,
  Mail,
  MapPinIcon,
  DollarSign
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { SiteHeader } from '@/components/site-header';

// Types
interface Review {
  id: string;
  organization_id: string;
  location_id: string;
  order_id?: string;
  customer_id?: string;
  platform: string;
  external_review_id: string;
  rating: number;
  title?: string;
  body: string;
  raw_payload?: any;
  parsed_dishes?: any[];
  sentiment_score?: number;
  sentiment_label?: string;
  status: 'unanswered' | 'answered' | 'escalated' | 'resolved';
  response_mode?: string;
  response_template_id?: string;
  response_text?: string;
  responded_at?: string;
  responded_by?: string;
  platform_created_at: string;
  aggregated: boolean;
  created_at: string;
  updated_at: string;
  // Joined data
  order?: Order;
  customer?: Customer;
  location?: Location;
}

interface SocialMessage {
  id: string;
  organization_id: string;
  platform: string;
  external_message_id: string;
  thread_id?: string;
  from_user: any;
  to_user: any;
  body: string;
  attachments?: any[];
  sentiment_label?: string;
  status: 'unread' | 'read' | 'replied' | 'escalated' | 'resolved';
  linked_review_id?: string;
  linked_ticket_id?: string;
  assigned_to?: string;
  created_at: string;
  received_at: string;
  processed_at?: string;
}

interface Order {
  id: string;
  organization_id: string;
  location_id: string;
  order_number: string;
  customer_id?: string;
  order_type: string;
  order_source: string;
  status: string;
  payment_status: string;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  delivery_charge: number;
  total_amount: number;
  delivery_address?: any;
  delivery_time?: string;
  special_instructions?: string;
  estimated_prep_time?: number;
  actual_prep_time?: number;
  created_at: string;
  updated_at: string;
  // Joined data
  order_items?: OrderItem[];
  customer?: Customer;
  location?: Location;
}

interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  special_instructions?: string;
  status: string;
  created_at: string;
  menu_item?: {
    name: string;
    category_id: string;
  };
}

interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: any;
}

interface Location {
  id: string;
  name: string;
  address: any;
  phone?: string;
}

interface Filters {
  platform: string;
  outlet: string;
  rating: string;
  status: string;
  dateRange: string;
  searchQuery: string;
  pendingOnly: boolean;
}

// Utility functions
const getPlatformIcon = (platform: string) => {
  const logos: { [key: string]: string } = {
    'zomato': '/assets/zomato-logo.png',
    'google': '/assets/google-logo.png',
    'tripadvisor': '/assets/tripadvisor-logo.png',
    'swiggy': '/assets/swiggy-logo.png',
    'easydiner': '/assets/easydiner-logo.png',
    'magicpin': '/assets/magicpin-logo.png',
    'facebook': '/assets/facebook-logo.png',
    'instagram': '/assets/instagram-logo.png',
    'whatsapp': '/assets/whatsapp-logo.png'
  };
  const src = logos[platform.toLowerCase()] || '/assets/default-logo.png';
  return (
    <img
      src={src}
      alt={platform}
      className="w-6 h-6 object-contain inline-block"
      style={{ verticalAlign: 'middle' }}
    />
  );
};

const getStatusBadge = (status: string, type: 'review' | 'social' | 'order') => {
  const variants: { [key: string]: { variant: 'default' | 'secondary' | 'destructive' | 'outline', label: string } } = {
    // Review statuses
    'unanswered': { variant: 'destructive', label: 'Pending Reply' },
    'answered': { variant: 'default', label: 'Answered' },
    'escalated': { variant: 'outline', label: 'Escalated' },
    'resolved': { variant: 'secondary', label: 'Resolved' },
    // Social message statuses
    'unread': { variant: 'destructive', label: 'Unread' },
    'read': { variant: 'outline', label: 'Read' },
    'replied': { variant: 'default', label: 'Replied' },
    // Order statuses
    'pending': { variant: 'outline', label: 'Pending' },
    'confirmed': { variant: 'default', label: 'Confirmed' },
    'preparing': { variant: 'secondary', label: 'Preparing' },
    'ready': { variant: 'default', label: 'Ready' },
    'delivered': { variant: 'secondary', label: 'Delivered' },
    'cancelled': { variant: 'destructive', label: 'Cancelled' }
  };
  
  const config = variants[status] || { variant: 'outline', label: status };
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

const getSentimentColor = (sentiment?: string) => {
  switch (sentiment?.toLowerCase()) {
    case 'positive': return 'text-green-600';
    case 'negative': return 'text-red-600';
    case 'neutral': return 'text-gray-600';
    default: return 'text-gray-500';
  }
};

export default function UnifiedInboxPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [socialMessages, setSocialMessages] = useState<SocialMessage[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [filters, setFilters] = useState<Filters>({
    platform: 'all',
    outlet: 'all',
    rating: 'all',
    status: 'all',
    dateRange: '7days',
    searchQuery: '',
    pendingOnly: false
  });
  const [replyDialog, setReplyDialog] = useState<{
    isOpen: boolean;
    item: Review | SocialMessage | null;
    type: 'review' | 'social';
  }>({
    isOpen: false,
    item: null,
    type: 'review'
  });
  const [replyText, setReplyText] = useState('');
  const [useAI, setUseAI] = useState(false);
  const [bulkActionDialog, setBulkActionDialog] = useState(false);
  const [selectedBulkAction, setSelectedBulkAction] = useState('');

  // Add filter template type and state
  interface FilterTemplate {
    name: string;
    filters: Filters;
  }
  const defaultTemplates: FilterTemplate[] = [
    { name: "All Pending", filters: { platform: 'all', outlet: 'all', rating: 'all', status: 'unanswered', dateRange: '7days', searchQuery: '', pendingOnly: true } },
    { name: "Negative Reviews", filters: { platform: 'all', outlet: 'all', rating: '1', status: 'all', dateRange: '30days', searchQuery: '', pendingOnly: false } },
    { name: "Social Unread", filters: { platform: 'all', outlet: 'all', rating: 'all', status: 'unread', dateRange: '7days', searchQuery: '', pendingOnly: false } },
  ];
  const [filterTemplates, setFilterTemplates] = useState<FilterTemplate[]>(defaultTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");

  // Add create template dialog state
  const [createTemplateDialog, setCreateTemplateDialog] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState("");

  // Add review template type and state
  interface ReviewTemplate {
    id: string;
    organization_id: string;
    name: string;
    platform?: string;
    rating_min?: number;
    rating_max?: number;
    tone?: string;
    body: string;
    variables?: any;
    is_active?: boolean;
    created_by?: string;
    created_at?: string;
    updated_at?: string;
  }
  const [reviewTemplates, setReviewTemplates] = useState<ReviewTemplate[]>([]);
  const [selectedReplyTemplateId, setSelectedReplyTemplateId] = useState<string>("");
  const [replyTemplateBody, setReplyTemplateBody] = useState<string>("");

  // Add user profiles for assignment
  interface UserProfile {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
  }
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [assignDialog, setAssignDialog] = useState<{ open: boolean; itemId: string | null }>({ open: false, itemId: null });
  const [assignLoading, setAssignLoading] = useState(false);

  const supabase = createClient();

  // Fetch data
  useEffect(() => {
    fetchData();
  }, [filters.dateRange]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Calculate date range
      const now = new Date();
      const dateRanges: { [key: string]: Date } = {
        '1day': new Date(now.getTime() - 24 * 60 * 60 * 1000),
        '7days': new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        '30days': new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        '90days': new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
      };
      const startDate = dateRanges[filters.dateRange] || dateRanges['7days'];

      // Fetch reviews with joined data
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select(`
          *,
          order:orders(*,
    order_items(*,
      menu_item:menu_items(id, name, category_id,
        menu_category:menu_categories(name)
      )
    ),
    customer:customers(id, first_name, last_name, email, phone, address, loyalty_points, loyalty_tier, total_visits, total_spent),
    location:locations(id, name, address, contact_info)
  ),
  customer:customers(id, first_name, last_name, email, phone, address, loyalty_points, loyalty_tier, total_visits, total_spent),
  location:locations(id, name, address, contact_info)
        `)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false });

      if (reviewsError) throw reviewsError;

      // Fetch social messages
      const { data: socialData, error: socialError } = await supabase
        .from('social_messages')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false });

      if (socialError) throw socialError;

      // Fetch recent orders for context
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(*,
    menu_item:menu_items(id, name, category_id,
      menu_category:menu_categories(name)
    )
  ),
  customer:customers(id, first_name, last_name, email, phone, address, loyalty_points, loyalty_tier, total_visits, total_spent),
  location:locations(id, name, address, contact_info)
        `)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      setReviews(reviewsData || []);
      setSocialMessages(socialData || []);
      setOrders(ordersData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch review templates on mount
  useEffect(() => {
    const fetchTemplates = async () => {
      const { data, error } = await supabase
        .from('review_templates')
        .select('*')
        .eq('is_active', true);
      if (!error && data) setReviewTemplates(data);
    };
    fetchTemplates();
  }, []);

  // Fetch users for assignment
  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, first_name, last_name, email, role')
        .eq('is_active', true);
      if (!error && data) setUsers(data);
    };
    fetchUsers();
  }, []);

  // Filter and search logic
  const filteredReviews = useMemo(() => {
    return reviews.filter(review => {
      // Platform filter
      if (filters.platform !== 'all' && review.platform !== filters.platform) return false;
      
      // Outlet filter
      if (filters.outlet !== 'all' && review.location_id !== filters.outlet) return false;
      
      // Rating filter
      if (filters.rating !== 'all') {
        const ratingFilter = parseInt(filters.rating);
        if (review.rating !== ratingFilter) return false;
      }
      
      // Status filter
      if (filters.status !== 'all' && review.status !== filters.status) return false;
      
      // Pending only filter
      if (filters.pendingOnly && review.status !== 'unanswered') return false;
      
      // Search query
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const searchFields = [
          review.title,
          review.body,
          review.customer?.name,
          review.order?.order_number
        ].filter(Boolean);
        
        if (!searchFields.some(field => field?.toLowerCase().includes(query))) return false;
      }
      
      return true;
    });
  }, [reviews, filters]);

  const filteredSocialMessages = useMemo(() => {
    return socialMessages.filter(message => {
      // Platform filter
      if (filters.platform !== 'all' && message.platform !== filters.platform) return false;
      
      // Status filter
      if (filters.status !== 'all' && message.status !== filters.status) return false;
      
      // Pending only filter
      if (filters.pendingOnly && !['unread', 'read'].includes(message.status)) return false;
      
      // Search query
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        if (!message.body?.toLowerCase().includes(query) && 
            !message.from_user?.name?.toLowerCase().includes(query)) return false;
      }
      
      return true;
    });
  }, [socialMessages, filters]);

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // Outlet filter
      if (filters.outlet !== 'all' && order.location_id !== filters.outlet) return false;
      
      // Status filter
      if (filters.status !== 'all' && order.status !== filters.status) return false;
      
      // Search query
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const searchFields = [
          order.order_number,
          order.customer?.name,
          order.customer?.email,
          order.customer?.phone
        ].filter(Boolean);
        
        if (!searchFields.some(field => field?.toLowerCase().includes(query))) return false;
      }
      
      return true;
    });
  }, [orders, filters]);

  // Combined and sorted items for unified view
  const unifiedItems = useMemo(() => {
    const items: Array<{ 
      id: string; 
      type: 'review' | 'social' | 'order'; 
      data: Review | SocialMessage | Order; 
      timestamp: string;
      priority: number;
    }> = [];
    
    // Add reviews with priority based on rating and status
    filteredReviews.forEach(review => {
      let priority = 1;
      if (review.status === 'unanswered') priority += 10;
      if (review.rating && review.rating <= 2) priority += 5;
      if (review.sentiment_label === 'negative') priority += 3;
      
      items.push({
        id: review.id,
        type: 'review',
        data: review,
        timestamp: review.created_at,
        priority
      });
    });
    
    // Add social messages with priority based on status
    filteredSocialMessages.forEach(message => {
      let priority = 1;
      if (message.status === 'unread') priority += 8;
      if (message.sentiment_label === 'negative') priority += 3;
      
      items.push({
        id: message.id,
        type: 'social',
        data: message,
        timestamp: message.created_at,
        priority
      });
    });
    
    // Add problematic orders
    filteredOrders.forEach(order => {
      let priority = 1;
      if (['cancelled', 'refund_pending'].includes(order.status)) priority += 6;
      if (order.delivery_time && new Date(order.delivery_time) < new Date()) priority += 4;
      
      // Only include orders that need attention
      if (priority > 1) {
        items.push({
          id: order.id,
          type: 'order',
          data: order,
          timestamp: order.created_at,
          priority
        });
      }
    });
    
    // Sort by priority (descending) then by timestamp (descending)
    return items.sort((a, b) => {
      if (a.priority !== b.priority) return b.priority - a.priority;
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  }, [filteredReviews, filteredSocialMessages, filteredOrders]);

  // Handle item selection
  const toggleItemSelection = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const selectAllItems = () => {
    const allIds = unifiedItems.map(item => item.id);
    setSelectedItems(allIds);
  };

  const clearSelection = () => {
    setSelectedItems([]);
  };

  // Handle reply
  const handleReply = async () => {
    if (!replyDialog.item || !replyText.trim()) return;
    
    try {
      if (replyDialog.type === 'review') {
        const review = replyDialog.item as Review;
        const { error } = await supabase
          .from('reviews')
          .update({
            response_text: replyText,
            status: 'answered',
            responded_at: new Date().toISOString(),
            response_mode: useAI ? 'ai' : 'manual'
          })
          .eq('id', review.id);
        
        if (error) throw error;
      } else {
        const message = replyDialog.item as SocialMessage;
        const { error } = await supabase
          .from('social_messages')
          .update({
            status: 'replied'
          })
          .eq('id', message.id);
        
        if (error) throw error;
      }
      
      setReplyDialog({ isOpen: false, item: null, type: 'review' });
      setReplyText('');
      setUseAI(false);
      await fetchData(); // Refresh data
    } catch (error) {
      console.error('Error sending reply:', error);
    }
  };

  // Handle bulk actions
  const handleBulkAction = async () => {
    if (!selectedBulkAction || selectedItems.length === 0) return;
    
    try {
      const reviewIds = selectedItems.filter(id => 
        unifiedItems.find(item => item.id === id)?.type === 'review'
      );
      const socialIds = selectedItems.filter(id => 
        unifiedItems.find(item => item.id === id)?.type === 'social'
      );
      
      switch (selectedBulkAction) {
        case 'mark-resolved':
          if (reviewIds.length > 0) {
            await supabase
              .from('reviews')
              .update({ status: 'resolved' })
              .in('id', reviewIds);
          }
          if (socialIds.length > 0) {
            await supabase
              .from('social_messages')
              .update({ status: 'resolved' })
              .in('id', socialIds);
          }
          break;
          
        case 'escalate':
          if (reviewIds.length > 0) {
            await supabase
              .from('reviews')
              .update({ status: 'escalated' })
              .in('id', reviewIds);
          }
          if (socialIds.length > 0) {
            await supabase
              .from('social_messages')
              .update({ status: 'escalated' })
              .in('id', socialIds);
          }
          break;
          
        case 'ai-reply':
          // This would trigger AI response generation for selected items
          console.log('Triggering AI replies for:', selectedItems);
          break;
      }
      
      setBulkActionDialog(false);
      setSelectedBulkAction('');
      clearSelection();
      await fetchData();
    } catch (error) {
      console.error('Error performing bulk action:', error);
    }
  };

  // Tone options for AI reply
  const TONE_OPTIONS = [
    { value: "neutral", label: "Neutral" },
    { value: "thankful", label: "Thankful" },
    { value: "apologetic", label: "Apologetic" },
    { value: "professional", label: "Professional" },
    { value: "friendly", label: "Friendly" },
  ];
  const [selectedTone, setSelectedTone] = useState<string>("neutral");
  const [showToneSelect, setShowToneSelect] = useState(false);

  // Use API endpoint for AI reply generation, send tone
  const generateAIReply = async (item: Review | SocialMessage, tone?: string) => {
    let endpoint = "/api/ai/generate-reply/";
    endpoint += item.hasOwnProperty("rating") ? "review" : "social";
    const payload: any = { item };
    if (tone) payload.tone = tone;
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      const replyText = await res.text();
      return replyText;
    }
    return "AI reply could not be generated.";
  };

  const handleGenerateAIReply = async () => {
    if (!replyDialog.item) return;
    setShowToneSelect(true);
  };

  const handleToneConfirm = async () => {
    if (!replyDialog.item) return;
    const aiReply = await generateAIReply(replyDialog.item, selectedTone);
    setReplyText(aiReply);
    setUseAI(true);
    setSelectedReplyTemplateId("");
    setShowToneSelect(false);
  };

  // Assignment logic
  const handleAssign = async (itemId: string, userId: string) => {
    setAssignLoading(true);
    try {
      // Find item type
      const item = unifiedItems.find(i => i.id === itemId);
      if (!item) return;
      if (item.type === 'review') {
        await supabase
          .from('reviews')
          .update({ responded_by: userId })
          .eq('id', itemId);
      } else if (item.type === 'social') {
        await supabase
          .from('social_messages')
          .update({ assigned_to: userId })
          .eq('id', itemId);
      }
      // Optionally refresh data
      await fetchData();
      setAssignDialog({ open: false, itemId: null });
    } catch (error) {
      console.error('Error assigning:', error);
    } finally {
      setAssignLoading(false);
    }
  };

  // Ticket creation state and logic
  const [showCreateTicketDialog, setShowCreateTicketDialog] = useState(false);
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    priority: 'medium',
    assigned_to: '',
    order_id: '',
    review_id: '',
    location_id: ''
  });
  const [ticketLoading, setTicketLoading] = useState(false);
  const [ticketSourceItem, setTicketSourceItem] = useState<Review | SocialMessage | null>(null);

  // Open ticket dialog and set template data from item
  const openCreateTicketDialog = (item?: Review | SocialMessage) => {
    if (item) {
      if ('platform' in item && 'body' in item && 'rating' in item) {
        // Review
        setNewTicket({
          title: item.title || `Review from ${item.platform}`,
          description: item.body,
          priority: item.rating <= 2 ? 'high' : 'medium',
          assigned_to: '',
          order_id: item.order_id || '',
          review_id: item.id,
          location_id: item.location_id || ''
        });
      } else if ('platform' in item && 'body' in item) {
        // SocialMessage
        setNewTicket({
          title: `${item.platform} Message`,
          description: item.body,
          priority: 'medium',
          assigned_to: '',
          order_id: '',
          review_id: '',
          location_id: ''
        });
      }
      setTicketSourceItem(item);
    } else {
      setNewTicket({
        title: '',
        description: '',
        priority: 'medium',
        assigned_to: '',
        order_id: '',
        review_id: '',
        location_id: ''
      });
      setTicketSourceItem(null);
    }
    setShowCreateTicketDialog(true);
  };

  const createTicket = async () => {
    setTicketLoading(true);
    try {
      // Remove empty string fields for assigned_to, order_id, location_id
      const ticketData = {
        ...newTicket,
        reference: `TKT-${Date.now()}`,
        location_id: window.localStorage.getItem('activeLocation'), // Replace with actual location ID
        organization_id: window.localStorage.getItem('organizationId'), // Replace with actual org ID
        sla_due_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      };
        ['assigned_to', 'order_id', 'location_id'].forEach(key => {
        if ((ticketData as Record<string, any>)[key] === '') {
          delete (ticketData as Record<string, any>)[key];
        }
      });
      const { error } = await supabase
        .from('tickets')
        .insert([ticketData]);
      if (error) throw error;
      setShowCreateTicketDialog(false);
      setNewTicket({
        title: '',
        description: '',
        priority: 'medium',
        assigned_to: '',
        order_id: '',
        review_id: '',
        location_id: ''
      });
      setTicketSourceItem(null);
    } catch (error) {
      console.error('Error creating ticket:', error);
    } finally {
      setTicketLoading(false);
    }
  };

  // Render item card
  const renderItemCard = (item: { 
    id: string; 
    type: 'review' | 'social' | 'order'; 
    data: Review | SocialMessage | Order; 
    timestamp: string;
    priority: number;
  }) => {
    const isSelected = selectedItems.includes(item.id);
    
    return (
      <Card key={item.id} className={`mb-4 ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <Checkbox 
                checked={isSelected}
                onCheckedChange={() => toggleItemSelection(item.id)}
              />
              
              {item.type === 'review' && (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">
                      {getPlatformIcon((item.data as Review).platform)}
                    </span>
                    <CardTitle className="text-lg">
                      {(item.data as Review).title || 'Review'}
                    </CardTitle>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${
                            i < (item.data as Review).rating 
                              ? 'fill-yellow-400 text-yellow-400' 
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="ml-1 text-sm text-gray-600">
                        {(item.data as Review).rating}/5
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="capitalize font-medium">
                      {(item.data as Review).platform}
                    </span>
                    {(item.data as Review).customer?.name && (
                      <>
                        <span>•</span>
                        <User className="w-4 h-4" />
                        <span>{(item.data as Review).customer?.name}</span>
                      </>
                    )}
                    {(item.data as Review).location?.name && (
                      <>
                        <span>•</span>
                        <MapPin className="w-4 h-4" />
                        <span>{(item.data as Review).location?.name}</span>
                      </>
                    )}
                    <span>•</span>
                    <Clock className="w-4 h-4" />
                    <span>{formatDistanceToNow(new Date(item.timestamp))} ago</span>
                  </div>
                </div>
              )}
              
              {item.type === 'social' && (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">
                      {getPlatformIcon((item.data as SocialMessage).platform)}
                    </span>
                    <CardTitle className="text-lg">
                      {(item.data as SocialMessage).platform} Message
                    </CardTitle>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="capitalize font-medium">
                      {(item.data as SocialMessage).platform}
                    </span>
                    <span>•</span>
                    <User className="w-4 h-4" />
                    <span>{(item.data as SocialMessage).from_user?.name || 'Unknown User'}</span>
                    <span>•</span>
                    <Clock className="w-4 h-4" />
                    <span>{formatDistanceToNow(new Date(item.timestamp))} ago</span>
                  </div>
                </div>
              )}
              
              {item.type === 'order' && (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🍽️</span>
                    <CardTitle className="text-lg">
                      Order #{(item.data as Order).order_number}
                    </CardTitle>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="capitalize font-medium">
                      {(item.data as Order).order_source}
                    </span>
                    {(item.data as Order).customer?.name && (
                      <>
                        <span>•</span>
                        <User className="w-4 h-4" />
                        <span>{(item.data as Order).customer?.name}</span>
                      </>
                    )}
                    <span>•</span>
                    <DollarSign className="w-4 h-4" />
                    <span>₹{(item.data as Order).total_amount}</span>
                    <span>•</span>
                    <Clock className="w-4 h-4" />
                    <span>{formatDistanceToNow(new Date(item.timestamp))} ago</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {item.priority > 5 && (
                <Badge variant="destructive" className="text-xs">
                  High Priority
                </Badge>
              )}
              
              {item.type === 'review' && getStatusBadge((item.data as Review).status, 'review')}
              {item.type === 'social' && getStatusBadge((item.data as SocialMessage).status, 'social')}
              {item.type === 'order' && getStatusBadge((item.data as Order).status, 'order')}
              
              {(item.data as Review).sentiment_label && (
                <Badge variant="outline" className={getSentimentColor((item.data as Review).sentiment_label)}>
                  {(item.data as Review).sentiment_label}
                </Badge>
              )}
            </div>
          </div>
          {/* Visible action buttons below header */}
          <div className="flex gap-2 mt-3">
            {(item.type === 'review' || item.type === 'social') && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setReplyDialog({ 
                    isOpen: true, 
                    item: item.type === 'review'
                      ? (item.data as Review)
                      : (item.data as SocialMessage), 
                    type: item.type === 'order' ? 'review' : item.type 
                  });
                }}
              >
                <Reply className="w-4 h-4 mr-1" />
                Reply
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => openCreateTicketDialog(item.data as Review | SocialMessage)}
            >
              <Ticket className="w-4 h-4 mr-1" />
              Create Ticket
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAssignDialog({ open: true, itemId: item.id })}
            >
              <UserCheck className="w-4 h-4 mr-1" />
              Assign
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedItems([item.id]);
                setSelectedBulkAction('mark-resolved');
                handleBulkAction();
              }}
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              Mark Resolved
            </Button>
            {item.type === 'order' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {/* TODO: implement refund request */}}
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Refund Request
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          {item.type === 'review' && (
            <div className="space-y-3">
              <p className="text-sm leading-relaxed">
                {(item.data as Review).body}
              </p>
              
              {(item.data as Review).order && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Order Context: #{(item.data as Review).order!.order_number}
                  </h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      <span className="font-medium">Items:</span> 
                      {(item.data as Review).order!.order_items?.map(item => 
                        `${item.quantity}x ${item.menu_item?.name || 'Unknown Item'}`
                      ).join(', ') || 'No items found'}
                    </p>
                    <p>
                      <span className="font-medium">Total:</span> ₹{(item.data as Review).order!.total_amount}
                    </p>
                    <p>
                      <span className="font-medium">Order Type:</span> {(item.data as Review).order!.order_type}
                    </p>
                    <p>
                      <span className="font-medium">Status:</span> {(item.data as Review).order!.status}
                    </p>
                    {(item.data as Review).order!.delivery_time && (
                      <p>
                        <span className="font-medium">Delivery Time:</span> {
                          format(new Date((item.data as Review).order!.delivery_time!), 'PPpp')
                        }
                      </p>
                    )}
                  </div>
                </div>
              )}
              
              {(item.data as Review).parsed_dishes && (item.data as Review).parsed_dishes!.length > 0 && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Mentioned Dishes
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(item.data as Review).parsed_dishes!.map((dish: any, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {dish.name || dish}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {(item.data as Review).response_text && (
                <div className="bg-green-50 p-3 rounded-lg border-l-4 border-green-400">
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                    <Reply className="w-4 h-4" />
                    Our Response
                    {(item.data as Review).response_mode === 'ai' && (
                      <Badge variant="outline" className="text-xs">
                        <Bot className="w-3 h-3 mr-1" />
                        AI Generated
                      </Badge>
                    )}
                  </h4>
                  <p className="text-sm text-gray-700">
                    {(item.data as Review).response_text}
                  </p>
                  {(item.data as Review).responded_at && (
                    <p className="text-xs text-gray-500 mt-2">
                      Responded {formatDistanceToNow(new Date((item.data as Review).responded_at!))} ago
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
          
          {item.type === 'social' && (
            <div className="space-y-3">
              <p className="text-sm leading-relaxed">
                {(item.data as SocialMessage).body}
              </p>
              
              {(item.data as SocialMessage).attachments && 
               (item.data as SocialMessage).attachments!.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {(item.data as SocialMessage).attachments!.map((attachment: any, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      📎 {attachment.type || 'Attachment'}
                    </Badge>
                  ))}
                </div>
              )}
              
              {(item.data as SocialMessage).thread_id && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Thread ID:</span> {(item.data as SocialMessage).thread_id}
                  </p>
                </div>
              )}
            </div>
          )}
          
          {item.type === 'order' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Order Type:</span>
                  <p className="capitalize">{(item.data as Order).order_type}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Source:</span>
                  <p className="capitalize">{(item.data as Order).order_source}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Payment Status:</span>
                  <p className="capitalize">{(item.data as Order).payment_status}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Total Amount:</span>
                  <p className="font-semibold">₹{(item.data as Order).total_amount}</p>
                </div>
              </div>
              
              {(item.data as Order).order_items && (item.data as Order).order_items!.length > 0 && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h4 className="font-medium text-sm mb-2">Order Items</h4>
                  <div className="space-y-2">
                    {(item.data as Order).order_items!.map((orderItem) => (
                      <div key={orderItem.id} className="flex justify-between items-center text-sm">
                        <span>
                          {orderItem.quantity}x {orderItem.menu_item?.name || 'Unknown Item'}
                        </span>
                        <span>₹{orderItem.total_price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {(item.data as Order).delivery_address && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                    <MapPinIcon className="w-4 h-4" />
                    Delivery Address
                  </h4>
                  <p className="text-sm text-gray-700">
                    {typeof (item.data as Order).delivery_address === 'string' 
                      ? (item.data as Order).delivery_address 
                      : JSON.stringify((item.data as Order).delivery_address)}
                  </p>
                </div>
              )}
              
              {(item.data as Order).special_instructions && (
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <h4 className="font-medium text-sm mb-2">Special Instructions</h4>
                  <p className="text-sm text-gray-700">
                    {(item.data as Order).special_instructions}
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div>
              <SiteHeader title="Unified Inbox"/>
              <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                  <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                    <div className="px-4 lg:px-6">
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading unified inbox...</p>
        </div>
      </div>
      </div>
            </div>
          </div>
        </div>
   </div>   
    );
  }

  return (
    <div>
    <SiteHeader title="Unified Inbox"/>
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <div className="container mx-auto p-6 max-w-7xl">
              {/* <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">Unified Inbox</h1>
                <p className="text-gray-600">
                  Manage reviews, social messages, and delivery complaints from one place
                </p>
              </div> */}

              {/* Filters and Search */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Filters & Search
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* First row: Search and Filter Template */}
                  <div className="flex flex-row gap-4 w-full justify-between mb-4">
                    <div className="space-y-2 w-full">
                      <label className="text-sm font-medium">Search</label>
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search reviews, orders, messages..."
                          value={filters.searchQuery}
                          onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Filter Template</label>
                      <Select
                        value={selectedTemplate}
                        onValueChange={tplName => {
                          if (tplName === "__create__") {
                            setCreateTemplateDialog(true);
                            return;
                          }
                          const tpl = filterTemplates.find(t => t.name === tplName);
                          if (tpl) {
                            setFilters(tpl.filters);
                            setSelectedTemplate(tpl.name);
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose Template" />
                        </SelectTrigger>
                        <SelectContent>
                          {filterTemplates.map(tpl => (
                            <SelectItem key={tpl.name} value={tpl.name}>{tpl.name}</SelectItem>
                          ))}
                          <SelectItem value="__create__">
                            <span className="text-primary font-semibold">+ Create Template</span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {/* Second row: Remaining filters */}
                  <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-6 xl:grid-cols-6 gap-4 mb-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Platform</label>
                      <Select 
                        value={filters.platform} 
                        onValueChange={(value) => setFilters(prev => ({ ...prev, platform: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="All Platforms" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Platforms</SelectItem>
                          <SelectItem value="zomato">Zomato</SelectItem>
                          <SelectItem value="google">Google</SelectItem>
                          <SelectItem value="tripadvisor">TripAdvisor</SelectItem>
                          <SelectItem value="swiggy">Swiggy</SelectItem>
                          <SelectItem value="easydiner">EazyDiner</SelectItem>
                          <SelectItem value="magicpin">Magicpin</SelectItem>
                          <SelectItem value="facebook">Facebook</SelectItem>
                          <SelectItem value="instagram">Instagram</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Status</label>
                      <Select 
                        value={filters.status} 
                        onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="All Statuses" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          <SelectItem value="unanswered">Unanswered</SelectItem>
                          <SelectItem value="answered">Answered</SelectItem>
                          <SelectItem value="escalated">Escalated</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                          <SelectItem value="unread">Unread</SelectItem>
                          <SelectItem value="read">Read</SelectItem>
                          <SelectItem value="replied">Replied</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Rating</label>
                      <Select 
                        value={filters.rating} 
                        onValueChange={(value) => setFilters(prev => ({ ...prev, rating: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="All Ratings" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Ratings</SelectItem>
                          <SelectItem value="1">1 Star</SelectItem>
                          <SelectItem value="2">2 Stars</SelectItem>
                          <SelectItem value="3">3 Stars</SelectItem>
                          <SelectItem value="4">4 Stars</SelectItem>
                          <SelectItem value="5">5 Stars</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Date Range</label>
                      <Select 
                        value={filters.dateRange} 
                        onValueChange={(value) => setFilters(prev => ({ ...prev, dateRange: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1day">Last 24 Hours</SelectItem>
                          <SelectItem value="7days">Last 7 Days</SelectItem>
                          <SelectItem value="30days">Last 30 Days</SelectItem>
                          <SelectItem value="90days">Last 90 Days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {/* <div className="flex items-center gap-2 mt-2"> */}
                      <div className='align-bottom h-full  mt-6 flex flex-col'>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {setFilters({
                        platform: 'all',
                        outlet: 'all',
                        rating: 'all',
                        status: 'all',
                        dateRange: '7days',
                        searchQuery: '',
                        pendingOnly: false
                      });
                    setSelectedTemplate('')}}
                    >
                      Clear Filters
                    </Button>
                    </div>
                    <div className='align-bottom h-full  mt-6 flex flex-col'>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={fetchData}
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh
                    </Button>
                    </div>
                  </div>
                  {/* </div> */}
                  
                </CardContent>
              </Card>

              {/* Create Template Dialog */}
              <Dialog open={createTemplateDialog} onOpenChange={setCreateTemplateDialog}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Filter Template</DialogTitle>
                    <DialogDescription>
                      Save current filters as a reusable template.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-2">
                    <Input
                      placeholder="Template Name"
                      value={newTemplateName}
                      onChange={e => setNewTemplateName(e.target.value)}
                    />
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setCreateTemplateDialog(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        if (newTemplateName.trim()) {
                          setFilterTemplates([...filterTemplates, { name: newTemplateName.trim(), filters }]);
                          setNewTemplateName("");
                          setCreateTemplateDialog(false);
                        }
                      }}
                      disabled={!newTemplateName.trim()}
                    >
                      Save Template
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Permanent Selection Bar */}
              <Card className="mb-4 bg-blue-50 border-blue-200">
                <CardContent className="">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium">
                        {selectedItems.length} items selected
                      </span>
                      <Button variant="outline" size="sm" onClick={selectAllItems}>
                        Select All ({unifiedItems.length})
                      </Button>
                      <Button variant="outline" size="sm" onClick={clearSelection}>
                        Clear Selection
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setBulkActionDialog(true)}
                        disabled={selectedItems.length === 0}
                      >
                        <Bot className="w-4 h-4 mr-2" />
                        AI Bulk Reply
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedBulkAction('mark-resolved');
                          handleBulkAction();
                        }}
                        disabled={selectedItems.length === 0}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Mark Resolved
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedBulkAction('escalate');
                          handleBulkAction();
                        }}
                        disabled={selectedItems.length === 0}
                      >
                        <AlertCircle className="w-4 h-4 mr-2" />
                        Escalate
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Main Content Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all" className="relative">
                    All Items
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {unifiedItems.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="reviews" className="relative">
                    Reviews
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {filteredReviews.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="social" className="relative">
                    Social DMs
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {filteredSocialMessages.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="orders" className="relative">
                    Orders
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {filteredOrders.length}
                    </Badge>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-6">
                  <div className="space-y-4">
                    {unifiedItems.length === 0 ? (
                      <Card>
                        <CardContent className="py-12 text-center">
                          <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
                          <p className="text-gray-500">
                            Try adjusting your filters or check back later for new reviews and messages.
                          </p>
                        </CardContent>
                      </Card>
                    ) : (
                      unifiedItems.map(renderItemCard)
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="reviews" className="mt-6">
                  <div className="space-y-4">
                    {filteredReviews.length === 0 ? (
                      <Card>
                        <CardContent className="py-12 text-center">
                          <Star className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews found</h3>
                          <p className="text-gray-500">
                            No reviews match your current filters. Try adjusting the date range or clearing filters.
                          </p>
                        </CardContent>
                      </Card>
                    ) : (
                      filteredReviews.map(review => renderItemCard({
                        id: review.id,
                        type: 'review',
                        data: review,
                        timestamp: review.created_at,
                        priority: review.status === 'unanswered' ? 10 : 1
                      }))
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="social" className="mt-6">
                  <div className="space-y-4">
                    {filteredSocialMessages.length === 0 ? (
                      <Card>
                        <CardContent className="py-12 text-center">
                          <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No messages found</h3>
                          <p className="text-gray-500">
                            No social media messages match your current filters.
                          </p>
                        </CardContent>
                      </Card>
                    ) : (
                      filteredSocialMessages.map(message => renderItemCard({
                        id: message.id,
                        type: 'social',
                        data: message,
                        timestamp: message.created_at,
                        priority: message.status === 'unread' ? 8 : 1
                      }))
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="orders" className="mt-6">
                  <div className="space-y-4">
                    {filteredOrders.length === 0 ? (
                      <Card>
                        <CardContent className="py-12 text-center">
                          <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No problematic orders found</h3>
                          <p className="text-gray-500">
                            Great! No orders currently require attention.
                          </p>
                        </CardContent>
                      </Card>
                    ) : (
                      filteredOrders.map(order => renderItemCard({
                        id: order.id,
                        type: 'order',
                        data: order,
                        timestamp: order.created_at,
                        priority: ['cancelled', 'refund_pending'].includes(order.status) ? 6 : 1
                      }))
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              {/* Reply Dialog */}
              <Dialog open={replyDialog.isOpen} onOpenChange={(open) => 
                setReplyDialog({ ...replyDialog, isOpen: open })
              }>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Reply to {replyDialog.type === 'review' ? 'Review' : 'Message'}</DialogTitle>
                    <DialogDescription>
                      {replyDialog.type === 'review' && replyDialog.item && 
                        `Replying to ${(replyDialog.item as Review).platform} review`
                      }
                      {replyDialog.type === 'social' && replyDialog.item && 
                        `Replying to ${(replyDialog.item as SocialMessage).platform} message`
                      }
                    </DialogDescription>
                  </DialogHeader>
                  {replyDialog.item && (
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Original {replyDialog.type === 'review' ? 'Review' : 'Message'}:</h4>
                        <p className="text-sm text-gray-700">
                          {replyDialog.type === 'review' 
                            ? (replyDialog.item as Review).body 
                            : (replyDialog.item as SocialMessage).body
                        }
                        </p>
                        {replyDialog.type === 'review' && (replyDialog.item as Review).rating && (
                          <div className="flex items-center gap-1 mt-2">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-4 h-4 ${
                                  i < (replyDialog.item as Review).rating! 
                                    ? 'fill-yellow-400 text-yellow-400' 
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <label className="text-sm font-medium">Reply Template:</label>
                          <Select
                            value={selectedReplyTemplateId}
                            onValueChange={setSelectedReplyTemplateId}
                          >
                            <SelectTrigger className="w-56">
                              <SelectValue placeholder="Choose a template" />
                            </SelectTrigger>
                            <SelectContent>
                              {reviewTemplates.map(tpl => (
                                <SelectItem key={tpl.id} value={tpl.id}>{tpl.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={handleGenerateAIReply}
                          >
                            <Bot className="w-4 h-4 mr-2" />
                            Generate AI Reply
                          </Button>
                        </div>
                        <Textarea 
                          placeholder="Type your reply here..."
                          value={replyText}
                          onChange={(e) => {
                            setReplyText(e.target.value);
                            setSelectedReplyTemplateId(""); // clear template selection if manually edited
                          }}
                          rows={4}
                        />
                        {useAI && (
                          <Alert>
                            <Bot className="h-4 w-4" />
                            <AlertDescription>
                              This reply was generated using AI. Please review and modify as needed before sending.
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                      {/* Tone selection modal */}
                      {showToneSelect && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-30">
                          <div className="bg-white rounded-lg shadow-lg p-6 w-[350px]">
                            <h4 className="font-medium mb-2">Choose Tone for AI Reply</h4>
                            <Select value={selectedTone} onValueChange={setSelectedTone}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select tone" />
                              </SelectTrigger>
                              <SelectContent>
                                {TONE_OPTIONS.map(tone => (
                                  <SelectItem key={tone.value} value={tone.value}>{tone.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <div className="mt-4 flex gap-2 justify-end">
                              <Button variant="outline" onClick={() => setShowToneSelect(false)}>Cancel</Button>
                              <Button onClick={handleToneConfirm}>Generate</Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <DialogFooter>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setReplyDialog({ isOpen: false, item: null, type: 'review' });
                        setSelectedReplyTemplateId("");
                        setReplyText("");
                      }}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleReply} disabled={!replyText.trim()}>
                      <Reply className="w-4 h-4 mr-2" />
                      Send Reply
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Bulk Action Dialog */}
              <Dialog open={bulkActionDialog} onOpenChange={setBulkActionDialog}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Bulk Actions</DialogTitle>
                    <DialogDescription>
                      Apply an action to {selectedItems.length} selected items
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Select Action:</label>
                      <Select value={selectedBulkAction} onValueChange={setSelectedBulkAction}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose an action" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ai-reply">Generate AI Replies</SelectItem>
                          <SelectItem value="mark-resolved">Mark as Resolved</SelectItem>
                          <SelectItem value="escalate">Escalate</SelectItem>
                          <SelectItem value="assign">Assign to Team Member</SelectItem>
                          <SelectItem value="archive">Archive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {selectedBulkAction === 'ai-reply' && (
                      <Alert>
                        <Bot className="h-4 w-4" />
                        <AlertDescription>
                          AI will generate personalized replies for each selected review based on the content and rating. 
                          You&apos;ll be able to review each reply before it&apos;s sent.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setBulkActionDialog(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleBulkAction} 
                      disabled={!selectedBulkAction}
                    >
                      Apply Action
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Assignment Dialog */}
              <Dialog open={assignDialog.open} onOpenChange={open => setAssignDialog({ open, itemId: assignDialog.itemId })}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Assign To</DialogTitle>
                    <DialogDescription>
                      Assign this item to a team member.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-2">
                    <Select
                      onValueChange={userId => handleAssign(assignDialog.itemId!, userId)}
                      disabled={assignLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select user" />
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
                  {assignLoading && (
                    <div className="mt-2 text-blue-600 text-sm">Assigning...</div>
                  )}
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setAssignDialog({ open: false, itemId: null })}>
                      Cancel
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Ticket Creation Dialog */}
              <Dialog open={showCreateTicketDialog} onOpenChange={setShowCreateTicketDialog}>
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
                    {/* Show review_id and location_id if present */}
                    {/* {newTicket.review_id && (
                      <div>
                        <label className="text-sm font-medium">Review ID</label>
                        <Input value={newTicket.review_id} disabled />
                      </div>
                    )}
                    {newTicket.location_id && (
                      <div>
                        <label className="text-sm font-medium">Location ID</label>
                        <Input value={newTicket.location_id} disabled />
                      </div>
                    )} */}
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setShowCreateTicketDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={createTicket} disabled={ticketLoading}>
                        {ticketLoading ? "Creating..." : "Create Ticket"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}
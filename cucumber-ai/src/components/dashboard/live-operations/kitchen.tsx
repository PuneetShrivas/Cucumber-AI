"use client"
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, formatDistanceToNow } from "date-fns";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

import {
    Clock,
    CheckCircle,
    AlertCircle,
    User,
    Phone,
    MapPin,
    ChefHat
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";

type Order = {
    id: string;
    order_number: string;
    order_type: string;
    status: string;
    created_at: string;
    special_instructions?: string;
    estimated_prep_time?: number;
    customers?: {
        first_name?: string;
        phone?: string;
    } | null;
    restaurant_tables?: {
        table_number?: number;
    } | null;
    order_items?: any[];
};

export default function KitchenDisplayPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [organizationId, setOrganizationId] = useState("");
    const [activeLocation, setActiveLocation] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const supabase = createClient();

    useEffect(() => {
        const storedLocation = localStorage.getItem('activeLocation') || '';
        const storedOrgId = localStorage.getItem('organizationId') || '';
        setActiveLocation(storedLocation);
        setOrganizationId(storedOrgId);
    }, []);

    // Fetch user and organization information on mount
    useEffect(() => {
        async function fetchUserAndOrganization() {
            try {
                // Get the current authenticated user
                const { data: { user }, error: userError } = await supabase.auth.getUser();

                if (userError) throw userError;

                if (user) {
                    // Get organization where the user is the owner
                    const { data: orgData, error: orgError } = await supabase
                        .from('organizations')
                        .select('id')
                        .eq('owner_id', user.id)
                        .single();

                    if (orgError) throw orgError;

                    if (orgData) {
                        setOrganizationId(orgData.id);
                        localStorage.setItem('organizationId', orgData.id);
                    }
                }
            } catch (error) {
                console.error("Error fetching user or organization:", error);

                toast.error("Please log in again.");
            }
        }

        fetchUserAndOrganization();
    }, []);

    useEffect(() => {
        if (organizationId && organizationId.length > 0) {
            loadOrders();
            // Refresh orders every 30 seconds
            const interval = setInterval(loadOrders, 30000);
            return () => clearInterval(interval);
        }
    }, [organizationId, activeLocation]);

    const loadOrders = async () => {
        if (!organizationId || !activeLocation) return;

        setIsLoading(true);
        try {
            // Get orders with pending or preparing status
            const { data: ordersData, error: ordersError } = await supabase
                .from('orders')
                .select(`
                    id, order_number, order_type, status, created_at,
                    special_instructions, estimated_prep_time,
                    restaurant_tables:table_id(table_number),
                    customers:customer_id(first_name, phone),
                    order_items(
                        id, quantity, special_instructions, status,
                        menu_items:menu_item_id(name),
                        order_item_customizations(id, customization_name, additional_cost)
                    )
                `)

                .eq('organization_id', organizationId)
                .eq('location_id', activeLocation)
                .in('status', ['pending', 'preparing'])
                .order('created_at', { ascending: false });

            if (ordersError) throw ordersError;
            setOrders(ordersData as Order[] || []);
        } catch (error) {
            console.error("Error loading orders:", error);

            toast.error("Failed to load orders. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    const updateOrderStatus = async (orderId: any, newStatus: any) => {
        try {
            const { error } = await supabase
                .from('orders')
                .update({ status: newStatus, updated_at: new Date().toISOString() })
                .eq('id', orderId);

            if (error) throw error;


            toast.success("Order status updated successfully to " + newStatus);

            loadOrders();
        } catch (error) {
            console.error("Error updating order:", error);

            toast.error("Failed to update order status. Please try again later.");
        }
    };

    const getStatusColor = (status: any) => {
        switch (status) {
            case 'pending': return 'bg-yellow-500 hover:bg-yellow-600';
            case 'preparing': return 'bg-blue-500 hover:bg-blue-600';
            case 'ready': return 'bg-emerald-500 hover:bg-emerald-600';
            default: return 'bg-muted hover:bg-muted/80';
        }
    };

    const getOrderTypeIcon = (type: any) => {
        switch (type) {
            case 'dine-in': return <MapPin className="w-4 h-4" />;
            case 'takeout': return <User className="w-4 h-4" />;
            case 'delivery': return <Phone className="w-4 h-4" />;
            default: return <User className="w-4 h-4" />;
        }
    };

    const getPriorityLevel = (order: any) => {
        const createdTime = new Date(order.created_at);
        const minutesAgo = (Date.now() - createdTime.getTime()) / (1000 * 60);

        if (minutesAgo > 20) return 'high';
        if (minutesAgo > 10) return 'medium';
        return 'normal';
    };

    const filteredOrders = selectedStatus === 'all'
        ? orders
        : orders.filter(order => order.status === selectedStatus);

    const priorityOrders = filteredOrders.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, normal: 1 };
        return priorityOrder[getPriorityLevel(b)] - priorityOrder[getPriorityLevel(a)];
    });

    return (
        
                            <div className="min-h-screen bg-background p-6">
                                <div className="max-w-7xl mx-auto">
                                    {/* Header */}
                                    <div className="mb-8">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                                                <ChefHat className="w-6 h-6 text-primary-foreground" />
                                            </div>
                                            <div>
                                                <h1 className="text-3xl font-bold">Kitchen Display</h1>
                                                <p className="text-muted-foreground">Real-time order management for kitchen staff</p>
                                            </div>
                                        </div>

                                        {/* Status Filters */}
                                        <div className="flex flex-wrap gap-3">
                                            {[
                                                { id: 'all', name: 'All Orders', variant: 'outline' },
                                                { id: 'pending', name: 'Pending', variant: 'secondary' },
                                                { id: 'preparing', name: 'Preparing', variant: 'default' }
                                            ].map((status) => (
                                                <motion.div
                                                    key={status.id}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <Button
                                                        onClick={() => setSelectedStatus(status.id)}
                                                        className={`px-6 ${selectedStatus === status.id
                                                                ? status.id === 'pending'
                                                                    ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                                                                    : status.id === 'preparing'
                                                                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                                                                        : 'bg-primary text-primary-foreground hover:bg-primary/90'
                                                                : status.id === 'pending'
                                                                    ? 'bg-yellow-100 text-yellow-900 hover:bg-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-100 dark:hover:bg-yellow-900/40'
                                                                    : status.id === 'preparing'
                                                                        ? 'bg-blue-100 text-blue-900 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-100 dark:hover:bg-blue-900/40'
                                                                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800/50 dark:text-gray-100 dark:hover:bg-gray-800/70'
                                                            } ${selectedStatus === status.id ? 'shadow-md' : ''}`}
                                                    >
                                                        {status.name}
                                                        {status.id !== 'all' && (
                                                            <Badge variant="outline" className="ml-2 bg-background">
                                                                {orders.filter(o => o.status === status.id).length}
                                                            </Badge>
                                                        )}
                                                    </Button>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>

                                    {isLoading ? (
                                        <div className="text-center py-16">
                                            <div className="h-16 w-16 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                            <p className="mt-4 text-muted-foreground">Loading orders...</p>
                                        </div>
                                    ) : (
                                        <>
                                            {/* Orders Grid */}
                                            <div className="grid grid-cols-1 @md:grid-cols-2 @lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                                <AnimatePresence mode="wait">
                                                    {priorityOrders.map((order) => {
                                                        const priority = getPriorityLevel(order);
                                                        const borderStyle = {
                                                            high: 'border-destructive/50',
                                                            medium: 'border-warning/50',
                                                            normal: 'border-border'
                                                        };

                                                        const customerName = order.customers?.first_name || 'Walk-in Customer';
                                                        const customerPhone = order.customers?.phone;
                                                        const tableNumber = order.special_instructions;

                                                        return (
                                                            <motion.div
                                                                key={order.id}
                                                                layout
                                                                initial={{ opacity: 0, scale: 0.9 }}
                                                                animate={{ opacity: 1, scale: 1 }}
                                                                exit={{ opacity: 0, scale: 0.9 }}
                                                                className={`
                                                                    w-full min-w-[320px] max-w-md mx-auto
                                                                    border-2 rounded-lg ${borderStyle[priority]} ${priority === 'high'
                                                                        ? 'bg-red-50 dark:bg-red-900/10'
                                                                        : priority === 'medium'
                                                                            ? 'bg-yellow-50 dark:bg-yellow-900/10'
                                                                            : 'bg-green-50 dark:bg-green-900/10'
                                                                    }`}
                                                            >
                                                                <Card className="border-0 bg-transparent shadow-none">
                                                                    <CardHeader className="pb-3">
                                                                        <div className="flex items-center justify-between mb-2">
                                                                            <Badge
                                                                                variant={order.status === 'pending' ? 'secondary' : 'default'}
                                                                                className={
                                                                                    priority === 'high'
                                                                                        ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200'
                                                                                        : priority === 'medium'
                                                                                            ? 'bg-yellow-100 text-yellow-900 dark:bg-yellow-900/20 dark:text-yellow-100'
                                                                                            : 'bg-green-100 text-green-900 dark:bg-green-900/20 dark:text-green-100'
                                                                                }
                                                                            >
                                                                                {order.status}
                                                                            </Badge>
                                                                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                                                {getOrderTypeIcon(order.order_type)}
                                                                                <span className="capitalize">{order.order_type}</span>
                                                                            </div>
                                                                        </div>

                                                                        <div className="flex items-center justify-between">
                                                                            <h3 className="text-xl font-bold">#{order.order_number.slice(-4)}</h3>
                                                                            <div className="text-right">
                                                                                <p className="text-sm text-muted-foreground">
                                                                                    <Clock className="w-4 h-4 inline mr-1" />
                                                                                    {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}
                                                                                </p>
                                                                                {order.estimated_prep_time && (
                                                                                    <p className="text-xs text-muted-foreground">
                                                                                        ETA: {order.estimated_prep_time} mins
                                                                                    </p>
                                                                                )}
                                                                            </div>
                                                                        </div>

                                                                        {/* Customer Info */}
                                                                        <div className="bg-muted/30 rounded-lg p-3 mt-3">
                                                                            <div className="flex items-center gap-2 text-sm">
                                                                                <User className="w-4 h-4 text-muted-foreground" />
                                                                                <span className="font-medium">{customerName}</span>
                                                                            </div>
                                                                            {tableNumber && (
                                                                                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                                                                    <MapPin className="w-4 h-4" />
                                                                                    <span>{tableNumber}</span>
                                                                                </div>
                                                                            )}
                                                                            {customerPhone && (
                                                                                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                                                                    <Phone className="w-4 h-4" />
                                                                                    <span>{customerPhone}</span>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </CardHeader>

                                                                    <CardContent className="pt-0">
                                                                        {/* Order Items */}
                                                                        <div className="space-y-2 mb-4">
                                                                            {order.order_items?.map((item) => (
                                                                                <div key={item.id} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                                                                                    <div>
                                                                                        <span className="font-medium">{item.menu_items.name}</span>
                                                                                        {item.special_instructions && (
                                                                                            <p className="text-sm italic text-amber-600 dark:text-amber-500">
                                                                                                Note: {item.special_instructions}
                                                                                            </p>
                                                                                        )}
                                                                                        {item.order_item_customizations && item.order_item_customizations.length > 0 && (
                                                                                            <p className="text-sm text-muted-foreground">
                                                                                                + {item.order_item_customizations.map((mod: { customization_name: any; }) => mod.customization_name).join(', ')}
                                                                                            </p>
                                                                                        )}
                                                                                    </div>
                                                                                    <Badge variant="outline" className="font-bold">
                                                                                        {item.quantity}x
                                                                                    </Badge>
                                                                                </div>
                                                                            ))}
                                                                        </div>

                                                                        {/* Action Buttons */}
                                                                        <div className="space-y-2">
                                                                            {order.status === 'pending' && (
                                                                                <Button
                                                                                    onClick={() => updateOrderStatus(order.id, 'preparing')}
                                                                                    className="w-full"
                                                                                    variant="default"
                                                                                >
                                                                                    <ChefHat className="w-4 h-4 mr-2" />
                                                                                    Start Preparing
                                                                                </Button>
                                                                            )}

                                                                            {order.status === 'preparing' && (
                                                                                <Button
                                                                                    onClick={() => updateOrderStatus(order.id, 'ready')}
                                                                                    className="w-full"
                                                                                    variant="default"
                                                                                >
                                                                                    <CheckCircle className="w-4 h-4 mr-2" />
                                                                                    Mark Ready
                                                                                </Button>
                                                                            )}
                                                                        </div>
                                                                    </CardContent>
                                                                </Card>
                                                            </motion.div>
                                                        );
                                                    })}
                                                </AnimatePresence>
                                            </div>

                                            {filteredOrders.length === 0 && (
                                                <div className="text-center py-16">
                                                    <ChefHat className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                                                    <h3 className="text-xl font-semibold mb-2">No Orders Found</h3>
                                                    <p className="text-muted-foreground">
                                                        {selectedStatus === 'all'
                                                            ? "No active orders in the kitchen right now."
                                                            : `No orders with status "${selectedStatus}".`
                                                        }
                                                    </p>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        
    );
}
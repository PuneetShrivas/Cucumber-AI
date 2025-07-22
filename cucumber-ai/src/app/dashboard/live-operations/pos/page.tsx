'use client'
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createClient } from "@/lib/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

import {
    Plus,
    Minus,
    ShoppingCart,
    Receipt,
    Search,
    ArrowRight
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { SiteHeader } from "@/components/site-header";

// MenuItem represents a menu item from menu_items table
interface MenuItem {
    id: string;
    name: string;
    description: string | null;
    price: number;
    image_url: string | null;
    is_available: boolean;
    category_id: string | null;
    spice_level: number | null;
    gst_rate: number | null;
    dietary_tags: string[] | null;
}

// Category represents a menu category from menu_categories table
interface Category {
    id: string;
    name: string;
    
}

// CartItem extends MenuItem with quantity for cart management
interface CartItem extends MenuItem {
    quantity: number;
}

// OrderDetails represents the order form state in the POS UI
interface OrderDetails {
    type: 'dine-in' | 'takeout' | 'delivery';
    customer_name: string;
    customer_phone: string;
    table_number: string;
    table_id?: string; // Added to allow setting table_id
}

// Order corresponds to the public.orders table
interface Order {
    id: string;
    organization_id: string;
    location_id: string;
    order_number: string;
    customer_id?: string | null;
    table_id?: string | null;
    order_type: string;
    order_source: string;
    status: string;
    payment_status: string;
    subtotal: number;
    tax_amount: number;
    discount_amount?: number;
    delivery_charge?: number;
    total_amount: number;
    delivery_address?: any;
    delivery_time?: string | null;
    special_instructions?: string | null;
    estimated_prep_time?: number | null;
    actual_prep_time?: number | null;
    created_by?: string | null;
    created_at: string;
    updated_at: string;
}

// OrderItem corresponds to the public.order_items table
interface OrderItem {
    id: string;
    order_id: string;
    menu_item_id: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    special_instructions?: string | null;
    status: string;
    created_at: string;
}

export default function POSPage() {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [currentOrder, setCurrentOrder] = useState<OrderDetails>({
        type: 'dine-in',
        customer_name: '',
        customer_phone: '',
        table_number: ''
    });
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [showCheckout, setShowCheckout] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeLocation, setActiveLocation] = useState<string | null>(null);
    const [organizationId, setOrganizationId] = useState<string | null>(null);
    const [customizations, setCustomizations] = useState<any[]>([]);
    useEffect(() => {
        const storedLocation = localStorage.getItem('activeLocation');
        const storedOrgId = localStorage.getItem('organizationId');
        setActiveLocation(storedLocation);
        setOrganizationId(storedOrgId);
    }, []);
    const supabase = createClient();
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
                toast.error("Failed to load your account information.");
            }
        }

        fetchUserAndOrganization();
    }, []);
    useEffect(() => {
        if(organizationId && organizationId.length>0)
        loadData();
    }, [organizationId]);
    const [tables, setTables] = useState<{ id: string; table_number: string; table_name?: string | null }[]>([]);

    useEffect(() => {
        async function fetchTables() {
            if (!organizationId || !activeLocation) return;
            try {
                const { data, error } = await supabase
                    .from('restaurant_tables')
                    .select('id, table_number, table_name',)
                    .eq('location_id', activeLocation)
                    .eq('is_active', true);

                if (error) throw error;
                setTables(data || []);
            } catch (error) {
                console.error("Error fetching tables:", error);
                toast.error("Failed to load tables.");
            }
        }
        fetchTables();
    }, [organizationId, activeLocation]);
    const loadData = async () => {
        setIsLoading(true);
        try {
            // Fetch categories for the current organization
            console.log("Fetching categories for organization:", localStorage.getItem('organizationId'));
            const { data: cats } = await supabase
                .from("menu_categories")
                .select("id, name")
                .eq("organization_id", localStorage.getItem('organizationId'))
                .eq("is_active", true);

            if (cats) setCategories(cats);
            
            if (cats && cats.length > 0) {
                setActiveCategory(cats[0].id);
            }

            // console.log("activeLocation", localStorage.getItem('activeLocation'));
            // Fetch menu items for the current location
            const { data: menuItemsData, error: menuItemsError } = await supabase
                .from('menu_items')
                .select(`
                    id, name, description, image_url,
                    category_id,
                    price, is_available, spice_level, gst_rate, dietary_tags,
                    menu_item_locations!inner(menu_item_id, location_id, is_available, price_override),
                    menu_categories:category_id(name)
                `)
                .eq('organization_id', localStorage.getItem('organizationId'))
                .eq('menu_item_locations.location_id', localStorage.getItem('activeLocation'));

            if (menuItemsError) throw menuItemsError;
            setMenuItems(menuItemsData || []);
        } catch (error) {
            console.error("Error loading data:", error);
            toast.error("Failed to load menu data. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    const filteredItems = menuItems.filter(item => {
        // Filter by category if one is selected
        const matchesCategory = activeCategory === null || item.category_id === activeCategory;

        // Filter by search query if one exists
        const matchesSearch = searchQuery === '' ||
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchesCategory && matchesSearch;
    });

    const addToCart = (item: MenuItem) => {
        const existingItem = cart.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
            setCart(cart.map(cartItem =>
                cartItem.id === item.id
                    ? { ...cartItem, quantity: cartItem.quantity + 1 }
                    : cartItem
            ));
        } else {
            setCart([...cart, { ...item, quantity: 1 }]);
        }
    };

    const updateQuantity = (itemId: string, newQuantity: number) => {
        if (newQuantity === 0) {
            setCart(cart.filter(item => item.id !== itemId));
        } else {
            setCart(cart.map(item =>
                item.id === itemId
                    ? { ...item, quantity: newQuantity }
                    : item
            ));
        }
    };

    const getCartTotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const getTax = () => {
        return cart.reduce((total, item) => {
            // Get GST rate for this item (default to 5% if not specified)
            const gstRate = 5.0 / 100; // 5%
            return total + (item.price * item.quantity * gstRate);
        }, 0);
    };

    const processOrder = async () => {
        if (cart.length === 0) return;

        setIsProcessing(true);
        try {
            const orderNumber = `ORD-${Date.now()}`;
            const subtotal = getCartTotal();
            const tax = getTax();
            const total = subtotal + tax;
            let customerId: string | null = null;

            // Insert customer if name or phone is provided
            if (currentOrder.customer_name || currentOrder.customer_phone) {
                const { data: customerData, error: customerError } = await supabase
                    .from('customers')
                    .insert({
                        organization_id: organizationId,
                        first_name: currentOrder.customer_name,
                        phone: currentOrder.customer_phone || null,
                    })
                    .select('id')
                    .single();

                if (customerError && customerError.code !== '23505') { // 23505: unique_violation (phone already exists)
                    throw customerError;
                }

                if (customerData && customerData.id) {
                    customerId = customerData.id;
                } else if (customerError && customerError.code === '23505' && currentOrder.customer_phone) {
                    // If phone already exists, fetch the customer id
                    const { data: existingCustomer, error: fetchError } = await supabase
                        .from('customers')
                        .select('id')
                        .eq('phone', currentOrder.customer_phone)
                        .eq('organization_id', organizationId)
                        .single();
                    if (fetchError) throw fetchError;
                    customerId = existingCustomer?.id || null;
                }
            }
            // Save the order to the database
            const { data: orderData, error: orderError } = await supabase
                .from('orders')
                .insert({
                    organization_id: organizationId,
                    location_id: activeLocation,
                    order_number: orderNumber,
                    order_type: currentOrder.type,
                    order_source: 'pos',
                    status: 'pending',
                    payment_status: 'pending',
                    subtotal: subtotal,
                    table_id: currentOrder.table_id || null,
                    tax_amount: tax,
                    total_amount: total,
                    special_instructions: '',
                    customer_id: customerId || null,
                    // If it's a dine-in order with table number, we could link it to a table_id
                    // but for now just storing it as special instructions
                    
                    ...(currentOrder.type === 'dine-in' && currentOrder.table_number 
                        ? { special_instructions: `Table: ${currentOrder.table_number}` } 
                        : {}),
                    // For delivery orders, we would add delivery address and time
                    ...(currentOrder.type === 'delivery' 
                        ? { 
                            delivery_charge: 0, // You could calculate this based on your business rules
                            delivery_address: JSON.stringify({ 
                                phone: currentOrder.customer_phone 
                            })
                        } 
                        : {})
                })
                .select()
                .single();

            if (orderError) throw orderError;
            if (currentOrder.table_id) {
                const { error: tableError } = await supabase
                    .from('restaurant_tables')
                    .update({ is_active: false })
                    .eq('id', currentOrder.table_id);

                if (tableError) throw tableError;
                else console.log(`Table ${currentOrder.table_number} is now inactive.`);
            }
            // Insert order items
            const orderItems = cart.map(item => ({
                order_id: orderData.id,
                menu_item_id: item.id,
                quantity: item.quantity,
                unit_price: item.price,
                total_price: item.price * item.quantity,
                status: 'pending'
            }));

            const { data: orderItemsData, error: orderItemsError } = await supabase
                .from('order_items')
                .insert(orderItems)
                .select();

            if (orderItemsError) throw orderItemsError;

            // If we had customizations, we would insert them here
            // For example, if cart items had a customizations array:
            // 
            // const customizations = [];
            // for (const item of orderItemsData) {
            //   const cartItem = cart.find(c => c.id === item.menu_item_id);
            //   if (cartItem?.customizations) {
            //     cartItem.customizations.forEach(custom => {
            //       customizations.push({
            //         order_item_id: item.id,
            //         variant_id: custom.variant_id,
            //         customization_name: custom.name,
            //         additional_cost: custom.price || 0
            //       });
            //     });
            //   }
            // }
            
            // if (customizations.length > 0) {
            //   const { error: customError } = await supabase
            //     .from('order_item_customizations')
            //     .insert(customizations);
              
            //   if (customError) throw customError;
            // }

            toast.success(`Order #${orderNumber} has been successfully placed!`);
            
            // Reset form
            setCart([]);
            setCurrentOrder({
                type: 'dine-in',
                customer_name: '',
                customer_phone: '',
                table_number: ''
            });
            setShowCheckout(false);

        } catch (error) {
            console.error("Error processing order:", error);
            toast.error("Failed to process order. Please try again later.");
        } finally {
            setIsProcessing(false);
        }
    };

    const getCategoryName = (categoryId: string | null) => {
        if (!categoryId) return "Uncategorized";
        const category = categories.find(cat => cat.id === categoryId);
        return category ? category.name : "Uncategorized";
    };

    return (
        <div>
            <SiteHeader title="POS Terminal" />
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 md:gap-6">
                        <div className="px-4 lg:px-6">

                            <div className="flex h-[calc(100vh-100px)] overflow-hidden ">
                                {/* Menu Items */}
                                <div className="flex-1 overflow-hidden">
                                    <div className="h-full flex flex-col overflow-auto">
                                        {/* Header */}
                                        <div className="p-6 ">
                                            <div className="max-w-5xl mx-auto">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        {/* <h1 className="text-3xl font-bold">Point of Sale</h1> */}
                                                        {/* <p className="text-muted-foreground">Take orders efficiently with our intuitive interface</p> */}
                                                    </div>
                                                    <div className="relative w-full">
                                                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                                        <Input
                                                            type="search"
                                                            placeholder="Search menu items..."
                                                            className="pl-8"
                                                            value={searchQuery}
                                                            onChange={(e) => setSearchQuery(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Category Filters */}
                                        <div className="p-4 ">
                                            <div className="max-w-5xl mx-auto">
                                                <ScrollArea className="whitespace-nowrap pb-2">
                                                    <div className="flex gap-3">
                                                        <motion.button
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            onClick={() => setActiveCategory(null)}
                                                            className={`
                                            flex-shrink-0 px-6 py-3 rounded-xl font-medium transition-all duration-200
                                            ${activeCategory === null
                                                                    ? 'bg-primary text-primary-foreground shadow-lg'
                                                                    : 'bg-muted text-muted-foreground hover:scale-105'
                                                                }
                                        `}
                                                        >
                                                            All Items
                                                        </motion.button>

                                                        {categories.map((category) => (
                                                            <motion.button
                                                                key={category.id}
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                                onClick={() => setActiveCategory(category.id)}
                                                                className={`
                                                flex-shrink-0 px-6 py-3 rounded-xl font-medium transition-all duration-200
                                                ${activeCategory === category.id
                                                                        ? 'bg-primary text-primary-foreground shadow-lg'
                                                                        : 'bg-muted text-muted-foreground hover:scale-105'
                                                                    }
                                            `}
                                                            >
                                                                {category.name}
                                                            </motion.button>
                                                        ))}
                                                    </div>
                                                </ScrollArea>
                                            </div>
                                        </div>

                                        {/* Menu Grid */}
                                        <ScrollArea className="flex-1 p-2">
                                            <div className="max-w-5xl mx-auto">
                                                {isLoading ? (
                                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                        {[...Array(8)].map((_, i) => (
                                                            <div key={i} className="flex flex-col">
                                                                <Skeleton className="aspect-square rounded-xl" />
                                                                <Skeleton className="h-6 mt-4 w-3/4" />
                                                                <Skeleton className="h-4 mt-2 w-1/2" />
                                                                <Skeleton className="h-6 mt-4 w-1/4" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="p-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                        <AnimatePresence mode="wait">
                                                            {filteredItems.length > 0 ? (
                                                                filteredItems.map((item) => (
                                                                    <motion.div
                                                                        key={item.id}
                                                                        layout
                                                                        initial={{ opacity: 0, scale: 0.9 }}
                                                                        animate={{ opacity: 1, scale: 1 }}
                                                                        exit={{ opacity: 0, scale: 0.9 }}
                                                                        whileHover={{ y: -5 }}
                                                                        whileTap={{ scale: 0.95 }}
                                                                    >
                                                                        <Card
                                                                            className="py-0 overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 border-0 shadow-lg"
                                                                            onClick={() => addToCart(item)}
                                                                        >
                                                                            <div className="aspect-square bg-muted relative overflow-hidden">
                                                                                {item.image_url ? (
                                                                                    <img
                                                                                        src={item.image_url}
                                                                                        alt={item.name}
                                                                                        className="w-full h-full object-cover"
                                                                                    />
                                                                                ) : (
                                                                                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                                                                        No image
                                                                                    </div>
                                                                                )}
                                                                                <div className="absolute top-3 right-3">
                                                                                    <Badge
                                                                                        variant="secondary"
                                                                                        className={`${item.is_available ? 'bg-green-100 text-green-700' : 'bg-destructive/20 text-destructive'}`}
                                                                                    >
                                                                                        {item.is_available ? 'Available' : 'Out of Stock'}
                                                                                    </Badge>
                                                                                </div>
                                                                                <div className="absolute top-3 left-3">
                                                                                    <Badge variant="outline" className="bg-background">
                                                                                        {getCategoryName(item.category_id)}
                                                                                    </Badge>
                                                                                </div>
                                                                            </div>
                                                                            <CardContent className="p-4">
                                                                                <h3 className="font-semibold mb-1 line-clamp-1">{item.name}</h3>
                                                                                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{item.description}</p>
                                                                                <div className="flex items-center justify-between">
                                                                                    <span className="text-xl font-bold text-primary">₹{item.price.toFixed(2)}</span>
                                                                                    <motion.div
                                                                                        whileHover={{ scale: 1.1 }}
                                                                                        whileTap={{ scale: 0.9 }}
                                                                                        className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground"
                                                                                    >
                                                                                        <Plus className="w-4 h-4" />
                                                                                    </motion.div>
                                                                                </div>
                                                                            </CardContent>
                                                                        </Card>
                                                                    </motion.div>
                                                                ))
                                                            ) : (
                                                                <div className="col-span-full text-center py-12 text-muted-foreground">
                                                                    <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                                                    <p>No items found. Try adjusting your search.</p>
                                                                </div>
                                                            )}
                                                        </AnimatePresence>
                                                    </div>
                                                )}
                                            </div>
                                        </ScrollArea>
                                    </div>
                                </div>

                                {/* Cart Sidebar */}
                                <div className="w-96 border-l flex flex-col">
                                    <div className="p-6 border-b">
                                        <div className="flex items-center gap-3 mb-4">
                                            <ShoppingCart className="w-6 h-6" />
                                            <h2 className="text-xl font-bold">Current Order</h2>
                                        </div>

                                        {/* Order Type */}
                                        <Tabs defaultValue="dine-in" value={currentOrder.type} onValueChange={(value: string) => setCurrentOrder({ ...currentOrder, type: value as any })}>
                                            <TabsList className="grid w-full grid-cols-3">
                                                <TabsTrigger value="dine-in">Dine In</TabsTrigger>
                                                <TabsTrigger value="takeout">Takeout</TabsTrigger>
                                                <TabsTrigger value="delivery">Delivery</TabsTrigger>
                                            </TabsList>
                                        </Tabs>
                                    </div>

                                    {/* Cart Items */}
                                    <ScrollArea className="flex-1 p-6">
                                        <AnimatePresence>
                                            {cart.map((item) => (
                                                <motion.div
                                                    key={item.id}
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: -20 }}
                                                    className="flex items-center gap-3 p-4 rounded-xl bg-muted mb-3"
                                                >
                                                    <div className="flex-1">
                                                        <h4 className="font-medium">{item.name}</h4>
                                                        <p className="text-sm text-muted-foreground">₹{item.price.toFixed(2)} each</p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            className="w-8 h-8 p-0"
                                                        >
                                                            <Minus className="w-3 h-3" />
                                                        </Button>
                                                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            className="w-8 h-8 p-0"
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                        </Button>
                                                    </div>
                                                    <div className="font-bold text-primary">
                                                        ₹{(item.price * item.quantity).toFixed(2)}
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>

                                        {cart.length === 0 && (
                                            <div className="text-center py-12 text-muted-foreground">
                                                <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                                <p>No items in cart</p>
                                            </div>
                                        )}
                                    </ScrollArea>

                                    {/* Cart Summary */}
                                    {cart.length > 0 && (
                                        <div className="p-6 border-t">
                                            <div className="space-y-2 mb-4">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">Subtotal</span>
                                                    <span className="font-medium">₹{getCartTotal().toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">GST (5%)</span>
                                                    <span className="font-medium">₹{getTax().toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between text-lg font-bold border-t pt-2">
                                                    <span>Total</span>
                                                    <span className="text-primary">₹{(getCartTotal() + getTax()).toFixed(2)}</span>
                                                </div>
                                            </div>
                                            <Button
                                                onClick={() => setShowCheckout(true)}
                                                className="w-full"
                                                variant="default"
                                            >
                                                <Receipt className="w-4 h-4 mr-2" />
                                                Proceed to Checkout
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                {/* Checkout Dialog */}
                                <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
                                    <DialogContent className="max-w-md">
                                        <DialogHeader>
                                            <DialogTitle>Complete Order</DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Customer Name</label>
                                                <Input
                                                    value={currentOrder.customer_name}
                                                    onChange={(e) => setCurrentOrder({ ...currentOrder, customer_name: e.target.value })}
                                                    placeholder="Enter customer name"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Contact Number</label>
                                                <Input
                                                    value={currentOrder.customer_phone}
                                                    onChange={(e) => setCurrentOrder({ ...currentOrder, customer_phone: e.target.value })}
                                                    placeholder="Enter contact number"
                                                    type="tel"
                                                />
                                            </div>
                                            {currentOrder.type === 'dine-in' && (
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium">Select Table</label>
                                                    <div className="grid grid-cols-3 gap-3">
                                                        {tables.length === 0 ? (
                                                            <div className="col-span-3 text-muted-foreground text-center py-4">No tables available</div>
                                                        ) : (
                                                            tables.map((table) => (
                                                                <button
                                                                    key={table.id}
                                                                    type="button"
                                                                    className={`
                                                                        w-16 h-16 rounded-lg flex flex-col items-center justify-center border
                                                                        transition-all duration-150 font-medium text-sm
                                                                        ${currentOrder.table_number === table.table_number
                                                                            ? 'bg-primary text-primary-foreground border-primary shadow-lg'
                                                                            : 'bg-muted text-muted-foreground hover:bg-primary/10'}
                                                                    `}
                                                                    onClick={() =>
                                                                        setCurrentOrder({
                                                                            ...currentOrder,
                                                                            table_number: table.table_number,
                                                                            table_id: table.id
                                                                        })
                                                                    }
                                                                >
                                                                    <span className="text-base">{table.table_number}</span>
                                                                    {table.table_name && (
                                                                        <span className="text-xs mt-1 opacity-70">{table.table_name}</span>
                                                                    )}
                                                                </button>
                                                            ))
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {(currentOrder.type === 'takeout' || currentOrder.type === 'delivery') && (
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium">Phone Number</label>
                                                    <Input
                                                        value={currentOrder.customer_phone}
                                                        onChange={(e) => setCurrentOrder({ ...currentOrder, customer_phone: e.target.value })}
                                                        placeholder="Enter phone number"
                                                    />
                                                </div>
                                            )}

                                            <div className="bg-muted p-4 rounded-lg">
                                                <div className="flex justify-between mb-2">
                                                    <span className="text-muted-foreground">Items</span>
                                                    <span className="font-medium">{cart.length}</span>
                                                </div>
                                                <div className="flex justify-between mb-2">
                                                    <span className="text-muted-foreground">Subtotal</span>
                                                    <span className="font-medium">₹{getCartTotal().toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between mb-2">
                                                    <span className="text-muted-foreground">GST (5%)</span>
                                                    <span className="font-medium">₹{getTax().toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                                                    <span>Total Amount</span>
                                                    <span className="text-primary">₹{(getCartTotal() + getTax()).toFixed(2)}</span>
                                                </div>
                                            </div>

                                            <Button
                                                onClick={processOrder}
                                                disabled={isProcessing}
                                                variant="default"
                                                className="w-full"
                                            >
                                                {isProcessing ? (
                                                    <div className="flex items-center">
                                                        <span className="animate-spin mr-2">⏳</span>
                                                        Processing...
                                                    </div>
                                                ) : (
                                                    <>
                                                        Complete Order <ArrowRight className="ml-2 h-4 w-4" />
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
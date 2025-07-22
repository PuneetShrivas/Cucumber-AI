"use client"

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {

    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {

    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {

    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Calendar as CalendarIcon,
    Clock,
    Edit2,
    Eye,
    History,
    MoreVertical,
    Plus,
    Settings,
    Table as TableIcon,
    Trash2,
    Users
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";

type RestaurantTable = {
    id: string;
    location_id: string;
    table_number: string;
    table_name: string | null;
    seating_capacity: number;
    table_type: string;
    position_x: number | null;
    position_y: number | null;
    qr_code: string | null;
    is_active: boolean;
    created_at: string;
};

type TableReservation = {
    id: string;
    location_id: string;
    table_id: string | null;
    customer_name: string;
    customer_phone: string | null;
    customer_email: string | null;
    party_size: number;
    reservation_date: string;
    reservation_time: string;
    duration_minutes: number;
    status: string;
    special_requests: string | null;
    created_at: string;
    updated_at: string;
    tables?: RestaurantTable | null;
};

type Order = {
    id: string;
    order_number: string;
    table_id: string | null;
    status: string;
    created_at: string;
};

const tableFormSchema = z.object({
    table_number: z.string().min(1, "Table number is required"),
    table_name: z.string().optional(),
    seating_capacity: z.coerce.number().min(1, "Capacity must be at least 1"),
    table_type: z.string(),
    is_active: z.boolean(),
});

const reservationFormSchema = z.object({
    customer_name: z.string().min(1, "Customer name is required"),
    customer_phone: z.string().optional(),
    customer_email: z.string().email().optional(),
    party_size: z.coerce.number().min(1, "Party size must be at least 1"),
    table_id: z.string().optional(),
    reservation_date: z.date({
        required_error: "Reservation date is required",
    }),
    reservation_time: z.string({
        required_error: "Reservation time is required",
    }),
    duration_minutes: z.coerce.number().min(1, "Duration must be at least 1 minute"),
    special_requests: z.string().optional(),
});

export default function TableManagementPage() {
    const [tables, setTables] = useState<RestaurantTable[]>([]);
    const [reservations, setReservations] = useState<TableReservation[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [orderHistory, setOrderHistory] = useState<Order[]>([]);
    const [organizationId, setOrganizationId] = useState("");
    const [activeLocation, setActiveLocation] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isTableDialogOpen, setIsTableDialogOpen] = useState(false);
    const [isReservationDialogOpen, setIsReservationDialogOpen] = useState(false);
    const [selectedTable, setSelectedTable] = useState<RestaurantTable | null>(null);
    const [selectedReservation, setSelectedReservation] = useState<TableReservation | null>(null);

    const supabase = createClient();

    type TableFormValues = z.infer<typeof tableFormSchema>;

    const tableForm = useForm<TableFormValues>({
        resolver: zodResolver(tableFormSchema),
        defaultValues: {
            table_number: "",
            table_name: "",
            seating_capacity: 4,
            table_type: "regular",
            is_active: true,
        },
    });

    const reservationForm = useForm<z.infer<typeof reservationFormSchema>>({
        resolver: zodResolver(reservationFormSchema),
        defaultValues: {
            customer_name: "",
            customer_phone: "",
            customer_email: "",
            party_size: 2,
            table_id: "",
            reservation_date: new Date(),
            reservation_time: "18:00",
            duration_minutes: 120,
            special_requests: "",
        },
    });

    useEffect(() => {
        const storedLocation = localStorage.getItem('activeLocation') || '';
        const storedOrgId = localStorage.getItem('organizationId') || '';
        setActiveLocation(storedLocation);
        setOrganizationId(storedOrgId);
    }, []);

    // Fetch user and organization information
    useEffect(() => {
        async function fetchUserAndOrganization() {
            try {
                // Get current authenticated user
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
                toast.error("Failed to authenticate. Please log in again.");
            }
        }

        fetchUserAndOrganization();
    }, []);

    useEffect(() => {
        if (organizationId && activeLocation) {
            loadTables();
            loadReservations();
            loadActiveOrders();
        }
    }, [organizationId, activeLocation]);

    const loadTables = async () => {
        if (!activeLocation) return;

        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('restaurant_tables')
                .select('*')
                .eq('location_id', activeLocation)
                .order('table_number');

            if (error) throw error;
            setTables(data as RestaurantTable[]);
        } catch (error) {
            console.error("Error loading tables:", error);
            toast.error("Failed to load tables");
        } finally {
            setIsLoading(false);
        }
    };

    const loadReservations = async () => {
        if (!activeLocation) return;

        try {
            const { data, error } = await supabase
                .from('table_reservations')
                .select(`
                    *,
                    tables:table_id(table_number)
                `)
                .eq('location_id', activeLocation)
                .order('reservation_date', { ascending: true })
                .order('reservation_time', { ascending: true });

            if (error) throw error;
            setReservations(data as TableReservation[]);
        } catch (error) {
            console.error("Error loading reservations:", error);
            toast.error("Failed to load reservations");
        }
    };

    const loadActiveOrders = async () => {
        if (!activeLocation) return;

        try {
            const { data, error } = await supabase
                .from('orders')
                .select('id, order_number, table_id, status, created_at')
                .eq('location_id', activeLocation)
                .in('status', ['pending', 'preparing',])
                .order('created_at', { ascending: false });

            if (error) throw error;
            setOrders(data as Order[]);

            // Load order history
            const { data: historyData, error: historyError } = await supabase
                .from('orders')
                .select('id, order_number, table_id, status, created_at')
                .eq('location_id', activeLocation)
                .in('status', ['ready', 'served', 'completed', 'cancelled'])
                .order('created_at', { ascending: false })
                .limit(100);

            if (historyError) throw historyError;
            setOrderHistory(historyData as Order[]);
        } catch (error) {
            console.error("Error loading orders:", error);
            toast.error("Failed to load orders");
        }
    };

    const handleTableSubmit = async (values: z.infer<typeof tableFormSchema>) => {
        try {
            if (selectedTable) {
                // Update existing table
                const { error } = await supabase
                    .from('restaurant_tables')
                    .update({
                        table_number: values.table_number,
                        table_name: values.table_name,
                        seating_capacity: values.seating_capacity,
                        table_type: values.table_type,
                        is_active: values.is_active,
                    })
                    .eq('id', selectedTable.id);

                if (error) throw error;
                toast.success("Table updated successfully");
            } else {
                // Create new table
                const { error } = await supabase
                    .from('restaurant_tables')
                    .insert({
                        location_id: activeLocation,
                        table_number: values.table_number,
                        table_name: values.table_name,
                        seating_capacity: values.seating_capacity,
                        table_type: values.table_type,
                        is_active: values.is_active,
                    });

                if (error) throw error;
                toast.success("Table added successfully");
            }

            setIsTableDialogOpen(false);
            loadTables();
        } catch (error) {
            console.error("Error saving table:", error);
            toast.error("Failed to save table");
        }
    };

    const handleReservationSubmit = async (values: z.infer<typeof reservationFormSchema>) => {
        try {
            const formattedDate = format(values.reservation_date, "yyyy-MM-dd");

            if (selectedReservation) {
                // Update existing reservation
                const { error } = await supabase
                    .from('table_reservations')
                    .update({
                        customer_name: values.customer_name,
                        customer_phone: values.customer_phone || null,
                        customer_email: values.customer_email || null,
                        party_size: values.party_size,
                        table_id: values.table_id || null,
                        reservation_date: formattedDate,
                        reservation_time: values.reservation_time,
                        duration_minutes: values.duration_minutes,
                        special_requests: values.special_requests || null,
                        updated_at: new Date().toISOString(),
                    })
                    .eq('id', selectedReservation.id);

                if (error) throw error;
                toast.success("Reservation updated successfully");
            } else {
                // Create new reservation
                const { error } = await supabase
                    .from('table_reservations')
                    .insert({
                        location_id: activeLocation,
                        customer_name: values.customer_name,
                        customer_phone: values.customer_phone || null,
                        customer_email: values.customer_email || null,
                        party_size: values.party_size,
                        table_id: values.table_id || null,
                        reservation_date: formattedDate,
                        reservation_time: values.reservation_time,
                        duration_minutes: values.duration_minutes,
                        special_requests: values.special_requests || null,
                        status: 'confirmed',
                    });

                if (error) throw error;
                toast.success("Reservation created successfully");
            }

            setIsReservationDialogOpen(false);
            loadReservations();
        } catch (error) {
            console.error("Error saving reservation:", error);
            toast.error("Failed to save reservation");
        }
    };

    const deleteTable = async (tableId: string) => {
        try {
            // Check if table has active orders
            const { data: activeOrders, error: ordersError } = await supabase
                .from('orders')
                .select('id')
                .eq('table_id', tableId)
                .in('status', ['pending', 'preparing', 'ready', 'served']);

            if (ordersError) throw ordersError;

            if (activeOrders && activeOrders.length > 0) {
                toast.error("Cannot delete table with active orders");
                return;
            }

            // Check for future reservations
            const { data: futureReservations, error: resError } = await supabase
                .from('table_reservations')
                .select('id')
                .eq('table_id', tableId)
                .gte('reservation_date', new Date().toISOString().split('T')[0]);

            if (resError) throw resError;

            if (futureReservations && futureReservations.length > 0) {
                toast.error("Cannot delete table with future reservations");
                return;
            }

            // Delete table
            const { error } = await supabase
                .from('restaurant_tables')
                .delete()
                .eq('id', tableId);

            if (error) throw error;
            toast.success("Table deleted successfully");
            loadTables();
        } catch (error) {
            console.error("Error deleting table:", error);
            toast.error("Failed to delete table");
        }
    };

    const deleteReservation = async (reservationId: string) => {
        try {
            const { error } = await supabase
                .from('table_reservations')
                .delete()
                .eq('id', reservationId);

            if (error) throw error;
            toast.success("Reservation deleted successfully");
            loadReservations();
        } catch (error) {
            console.error("Error deleting reservation:", error);
            toast.error("Failed to delete reservation");
        }
    };

    const editTable = (table: RestaurantTable) => {
        setSelectedTable(table);
        tableForm.reset({
            table_number: table.table_number,
            table_name: table.table_name || "",
            seating_capacity: table.seating_capacity,
            table_type: table.table_type,
            is_active: table.is_active,
        });
        setIsTableDialogOpen(true);
    };

    const editReservation = (reservation: TableReservation) => {
        setSelectedReservation(reservation);
        reservationForm.reset({
            customer_name: reservation.customer_name,
            customer_phone: reservation.customer_phone || "",
            customer_email: reservation.customer_email || "",
            party_size: reservation.party_size,
            table_id: reservation.table_id || "",
            reservation_date: new Date(reservation.reservation_date),
            reservation_time: reservation.reservation_time,
            duration_minutes: reservation.duration_minutes,
            special_requests: reservation.special_requests || "",
        });
        setIsReservationDialogOpen(true);
    };

    const addNewTable = () => {
        setSelectedTable(null);
        tableForm.reset({
            table_number: "",
            table_name: "",
            seating_capacity: 4,
            table_type: "regular",
            is_active: true,
        });
        setIsTableDialogOpen(true);
    };

    const addNewReservation = () => {
        setSelectedReservation(null);
        reservationForm.reset({
            customer_name: "",
            customer_phone: "",
            customer_email: "",
            party_size: 2,
            table_id: "",
            reservation_date: new Date(),
            reservation_time: "18:00",
            duration_minutes: 120,
            special_requests: "",
        });
        setIsReservationDialogOpen(true);
    };

    const getOrdersForTable = (tableId: string) => {
        return orders.filter(order => order.table_id === tableId);
    };

    const getOrderHistoryForTable = (tableId: string) => {
        return orderHistory.filter(order => order.table_id === tableId);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-500 text-white';
            case 'preparing': return 'bg-blue-500 text-white';
            case 'ready': return 'bg-green-500 text-white';
            case 'served': return 'bg-purple-500 text-white';
            case 'completed': return 'bg-gray-500 text-white';
            case 'cancelled': return 'bg-red-500 text-white';
            case 'confirmed': return 'bg-green-500 text-white';
            case 'no-show': return 'bg-red-500 text-white';
            default: return 'bg-gray-500 text-white';
        }
    };

    return (
        <div>
            <SiteHeader title="Table Management" />
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 md:gap-6">
                        <div className="px-4 lg:px-6">
                            <div className="min-h-screen bg-background p-6">
                                <div className="max-w-7xl mx-auto">
                                    {/* Header */}
                                    {/* <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                            <TableIcon className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">Table Management</h1>
                            <p className="text-muted-foreground">Manage restaurant tables, reservations and monitor orders</p>
                        </div>
                    </div>
                </div> */}

                                    {/* Main Content */}
                                    <Tabs defaultValue="tables" className="w-full">
                                        <TabsList className="grid w-full grid-cols-4 mb-6">
                                            <TabsTrigger value="tables">
                                                <TableIcon className="w-4 h-4 mr-2" /> Tables
                                            </TabsTrigger>
                                            <TabsTrigger value="reservations">
                                                <CalendarIcon className="w-4 h-4 mr-2" /> Reservations
                                            </TabsTrigger>
                                            <TabsTrigger value="active-orders">
                                                <Clock className="w-4 h-4 mr-2" /> Active Orders
                                            </TabsTrigger>
                                            <TabsTrigger value="order-history">
                                                <History className="w-4 h-4 mr-2" /> Order History
                                            </TabsTrigger>
                                        </TabsList>

                                        {/* Tables Tab */}
                                        <TabsContent value="tables">
                                            <Card>
                                                <CardHeader className="flex flex-row items-center justify-between">
                                                    <CardTitle>Restaurant Tables</CardTitle>
                                                    <Button onClick={addNewTable}>
                                                        <Plus className="w-4 h-4 mr-2" /> Add Table
                                                    </Button>
                                                </CardHeader>
                                                <CardContent>
                                                    {isLoading ? (
                                                        <div className="text-center py-16">
                                                            <div className="h-16 w-16 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                                            <p className="mt-4 text-muted-foreground">Loading tables...</p>
                                                        </div>
                                                    ) : (
                                                        <Table>
                                                            <TableHeader>
                                                                <TableRow>
                                                                    <TableHead>Table Number</TableHead>
                                                                    <TableHead>Name</TableHead>
                                                                    <TableHead>Capacity</TableHead>
                                                                    <TableHead>Type</TableHead>
                                                                    <TableHead>Status</TableHead>
                                                                    <TableHead className="text-right">Actions</TableHead>
                                                                </TableRow>
                                                            </TableHeader>
                                                            <TableBody>
                                                                {tables.length === 0 ? (
                                                                    <TableRow>
                                                                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                                                            No tables found. Add your first table to get started.
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ) : (
                                                                    tables.map((table) => (
                                                                        <TableRow key={table.id}>
                                                                            <TableCell>{table.table_number}</TableCell>
                                                                            <TableCell>{table.table_name || '-'}</TableCell>
                                                                            <TableCell>{table.seating_capacity} seats</TableCell>
                                                                            <TableCell className="capitalize">{table.table_type}</TableCell>
                                                                            <TableCell>
                                                                                <Badge variant={table.is_active ? "default" : "outline"}>
                                                                                    {table.is_active ? "Active" : "Inactive"}
                                                                                </Badge>
                                                                            </TableCell>
                                                                            <TableCell className="text-right">
                                                                                <DropdownMenu>
                                                                                    <DropdownMenuTrigger asChild>
                                                                                        <Button variant="ghost" size="sm">
                                                                                            <MoreVertical className="w-4 h-4" />
                                                                                        </Button>
                                                                                    </DropdownMenuTrigger>
                                                                                    <DropdownMenuContent align="end">
                                                                                        <DropdownMenuItem onClick={() => editTable(table)}>
                                                                                            <Edit2 className="w-4 h-4 mr-2" /> Edit
                                                                                        </DropdownMenuItem>
                                                                                        <DropdownMenuItem onClick={() => deleteTable(table.id)}>
                                                                                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                                                                                        </DropdownMenuItem>
                                                                                    </DropdownMenuContent>
                                                                                </DropdownMenu>
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    ))
                                                                )}
                                                            </TableBody>
                                                        </Table>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        </TabsContent>

                                        {/* Reservations Tab */}
                                        <TabsContent value="reservations">
                                            <Card>
                                                <CardHeader className="flex flex-row items-center justify-between">
                                                    <CardTitle>Table Reservations</CardTitle>
                                                    <Button onClick={addNewReservation}>
                                                        <Plus className="w-4 h-4 mr-2" /> Add Reservation
                                                    </Button>
                                                </CardHeader>
                                                <CardContent>
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow>
                                                                <TableHead>Customer</TableHead>
                                                                <TableHead>Table</TableHead>
                                                                <TableHead>Date & Time</TableHead>
                                                                <TableHead>Party Size</TableHead>
                                                                <TableHead>Status</TableHead>
                                                                <TableHead className="text-right">Actions</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {reservations.length === 0 ? (
                                                                <TableRow>
                                                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                                                        No reservations found. Create your first reservation to get started.
                                                                    </TableCell>
                                                                </TableRow>
                                                            ) : (
                                                                reservations.map((reservation) => (
                                                                    <TableRow key={reservation.id}>
                                                                        <TableCell>
                                                                            <div className="font-medium">{reservation.customer_name}</div>
                                                                            <div className="text-sm text-muted-foreground">{reservation.customer_phone || reservation.customer_email}</div>
                                                                        </TableCell>
                                                                        <TableCell>{reservation.tables?.table_number || 'Not assigned'}</TableCell>
                                                                        <TableCell>
                                                                            <div>{new Date(reservation.reservation_date).toLocaleDateString()}</div>
                                                                            <div className="text-sm text-muted-foreground">{reservation.reservation_time}</div>
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <Users className="inline w-4 h-4 mr-1" /> {reservation.party_size} people
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <Badge className={getStatusColor(reservation.status)}>{reservation.status}</Badge>
                                                                        </TableCell>
                                                                        <TableCell className="text-right">
                                                                            <DropdownMenu>
                                                                                <DropdownMenuTrigger asChild>
                                                                                    <Button variant="ghost" size="sm">
                                                                                        <MoreVertical className="w-4 h-4" />
                                                                                    </Button>
                                                                                </DropdownMenuTrigger>
                                                                                <DropdownMenuContent align="end">
                                                                                    <DropdownMenuItem onClick={() => editReservation(reservation)}>
                                                                                        <Edit2 className="w-4 h-4 mr-2" /> Edit
                                                                                    </DropdownMenuItem>
                                                                                    <DropdownMenuItem onClick={() => deleteReservation(reservation.id)}>
                                                                                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                                                                                    </DropdownMenuItem>
                                                                                </DropdownMenuContent>
                                                                            </DropdownMenu>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))
                                                            )}
                                                        </TableBody>
                                                    </Table>
                                                </CardContent>
                                            </Card>
                                        </TabsContent>

                                        {/* Active Orders Tab */}
                                        <TabsContent value="active-orders">
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle>Active Table Orders</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow>
                                                                <TableHead>Table</TableHead>
                                                                <TableHead>Order Number</TableHead>
                                                                <TableHead>Status</TableHead>
                                                                <TableHead>Created</TableHead>
                                                                <TableHead className="text-right">Actions</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {tables.map((table) => {
                                                                const tableOrders = getOrdersForTable(table.id);
                                                                if (tableOrders.length === 0) return null;

                                                                return tableOrders.map((order, index) => (
                                                                    <TableRow key={order.id}>
                                                                        <TableCell>{index === 0 ? table.table_number : ''}</TableCell>
                                                                        <TableCell>#{order.order_number}</TableCell>
                                                                        <TableCell>
                                                                            <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                                                                        </TableCell>
                                                                        <TableCell>{new Date(order.created_at).toLocaleString()}</TableCell>
                                                                        <TableCell className="text-right">
                                                                            <Button variant="outline" size="sm">
                                                                                <Eye className="w-4 h-4 mr-2" /> View Details
                                                                            </Button>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ));
                                                            })}
                                                            {orders.filter(order => order.table_id).length === 0 && (
                                                                <TableRow>
                                                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                                                        No active orders for any table.
                                                                    </TableCell>
                                                                </TableRow>
                                                            )}
                                                        </TableBody>
                                                    </Table>
                                                </CardContent>
                                            </Card>
                                        </TabsContent>

                                        {/* Order History Tab */}
                                        <TabsContent value="order-history">
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle>Table Order History</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow>
                                                                <TableHead>Table</TableHead>
                                                                <TableHead>Order Number</TableHead>
                                                                <TableHead>Status</TableHead>
                                                                <TableHead>Date</TableHead>
                                                                <TableHead className="text-right">Actions</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {tables.map((table) => {
                                                                const tableOrderHistory = getOrderHistoryForTable(table.id);
                                                                if (tableOrderHistory.length === 0) return null;

                                                                return tableOrderHistory.map((order, index) => (
                                                                    <TableRow key={order.id}>
                                                                        <TableCell>{index === 0 ? table.table_number : ''}</TableCell>
                                                                        <TableCell>#{order.order_number}</TableCell>
                                                                        <TableCell>
                                                                            <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                                                                        </TableCell>
                                                                        <TableCell>{new Date(order.created_at).toLocaleString()}</TableCell>
                                                                        <TableCell className="text-right">
                                                                            <Button variant="outline" size="sm">
                                                                                <Eye className="w-4 h-4 mr-2" /> View Details
                                                                            </Button>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ));
                                                            })}
                                                            {orderHistory.filter(order => order.table_id).length === 0 && (
                                                                <TableRow>
                                                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                                                        No order history found for tables.
                                                                    </TableCell>
                                                                </TableRow>
                                                            )}
                                                        </TableBody>
                                                    </Table>
                                                </CardContent>
                                            </Card>
                                        </TabsContent>
                                    </Tabs>

                                    {/* Table Dialog */}
                                    <Dialog open={isTableDialogOpen} onOpenChange={setIsTableDialogOpen}>
                                        <DialogContent className="sm:max-w-md">
                                            <DialogHeader>
                                                <DialogTitle>{selectedTable ? "Edit Table" : "Add New Table"}</DialogTitle>
                                                <DialogDescription>
                                                    {selectedTable ? "Update table details" : "Create a new table for your restaurant"}
                                                </DialogDescription>
                                            </DialogHeader>
                                            <Form {...tableForm}>
                                                <form onSubmit={tableForm.handleSubmit(handleTableSubmit)} className="space-y-4">
                                                    <FormField
                                                        control={tableForm.control}
                                                        name="table_number"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Table Number*</FormLabel>
                                                                <FormControl>
                                                                    <Input {...field} placeholder="e.g. T1, A12" />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />

                                                    <FormField
                                                        control={tableForm.control}
                                                        name="table_name"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Table Name (Optional)</FormLabel>
                                                                <FormControl>
                                                                    <Input {...field} placeholder="e.g. Window Table, Patio" />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />

                                                    <FormField
                                                        control={tableForm.control}
                                                        name="seating_capacity"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Seating Capacity*</FormLabel>
                                                                <FormControl>
                                                                    <Input type="number" min="1" {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />

                                                    <FormField
                                                        control={tableForm.control}
                                                        name="table_type"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Table Type</FormLabel>
                                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                    <FormControl>
                                                                        <SelectTrigger>
                                                                            <SelectValue placeholder="Select table type" />
                                                                        </SelectTrigger>
                                                                    </FormControl>
                                                                    <SelectContent>
                                                                        <SelectItem value="regular">Regular</SelectItem>
                                                                        <SelectItem value="booth">Booth</SelectItem>
                                                                        <SelectItem value="bar">Bar</SelectItem>
                                                                        <SelectItem value="outdoor">Outdoor</SelectItem>
                                                                        <SelectItem value="private">Private Room</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />

                                                    <DialogFooter>
                                                        <Button variant="outline" type="button" onClick={() => setIsTableDialogOpen(false)}>
                                                            Cancel
                                                        </Button>
                                                        <Button type="submit">
                                                            {selectedTable ? "Update Table" : "Add Table"}
                                                        </Button>
                                                    </DialogFooter>
                                                </form>
                                            </Form>
                                        </DialogContent>
                                    </Dialog>

                                    {/* Reservation Dialog */}
                                    <Dialog open={isReservationDialogOpen} onOpenChange={setIsReservationDialogOpen}>
                                        <DialogContent className="sm:max-w-lg h-[80%] overflow-y-auto">
                                            <DialogHeader>
                                                <DialogTitle>
                                                    {selectedReservation ? "Edit Reservation" : "Add New Reservation"}
                                                </DialogTitle>
                                                <DialogDescription>
                                                    {selectedReservation
                                                        ? "Update reservation details"
                                                        : "Make a new table reservation"}
                                                </DialogDescription>
                                            </DialogHeader>
                                            <Form {...reservationForm}>
                                                <form
                                                    onSubmit={reservationForm.handleSubmit(handleReservationSubmit)}
                                                    className="space-y-4"
                                                >
                                                    <div className="flex flex-col md:flex-row gap-4">
                                                        <FormField
                                                            control={reservationForm.control}
                                                            name="customer_name"
                                                            render={({ field }) => (
                                                                <FormItem className="flex-1">
                                                                    <FormLabel>Customer Name*</FormLabel>
                                                                    <FormControl>
                                                                        <Input {...field} placeholder="Full name" />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <FormField
                                                            control={reservationForm.control}
                                                            name="party_size"
                                                            render={({ field }) => (
                                                                <FormItem className="flex-1">
                                                                    <FormLabel>Party Size*</FormLabel>
                                                                    <FormControl>
                                                                        <Input type="number" min="1" {...field} />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>

                                                    <div className="flex flex-col md:flex-row gap-4">
                                                        <FormField
                                                            control={reservationForm.control}
                                                            name="customer_phone"
                                                            render={({ field }) => (
                                                                <FormItem className="flex-1">
                                                                    <FormLabel>Phone Number</FormLabel>
                                                                    <FormControl>
                                                                        <Input {...field} placeholder="Phone number" />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <FormField
                                                            control={reservationForm.control}
                                                            name="customer_email"
                                                            render={({ field }) => (
                                                                <FormItem className="flex-1">
                                                                    <FormLabel>Email Address</FormLabel>
                                                                    <FormControl>
                                                                        <Input {...field} placeholder="Email address" type="email" />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>

                                                    <FormField
                                                        control={reservationForm.control}
                                                        name="table_id"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Table (Optional)</FormLabel>
                                                                <Select
                                                                    onValueChange={field.onChange}
                                                                    value={field.value}
                                                                >
                                                                    <FormControl>
                                                                        <SelectTrigger>
                                                                            <SelectValue placeholder="Select a table" />
                                                                        </SelectTrigger>
                                                                    </FormControl>
                                                                    <SelectContent>
                                                                        <SelectItem value="not-assigned">Not assigned</SelectItem>
                                                                        {tables
                                                                            .filter((table) => table.is_active)
                                                                            .map((table) => (
                                                                                <SelectItem key={table.id} value={table.id}>
                                                                                    {table.table_number}
                                                                                    {table.table_name
                                                                                        ? ` - ${table.table_name}`
                                                                                        : ""}
                                                                                    {" "}
                                                                                    ({table.seating_capacity} seats)
                                                                                </SelectItem>
                                                                            ))}
                                                                    </SelectContent>
                                                                </Select>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />

                                                    <div className="flex flex-col md:flex-row gap-4">
                                                        <FormField
                                                            control={reservationForm.control}
                                                            name="reservation_date"
                                                            render={({ field }) => (
                                                                <FormItem className="flex-1">
                                                                    <FormLabel>Reservation Date*</FormLabel>
                                                                    <Calendar
                                                                        mode="single"
                                                                        selected={field.value}
                                                                        onSelect={field.onChange}
                                                                        disabled={(date) =>
                                                                            date < new Date(new Date().setHours(0, 0, 0, 0))
                                                                        }
                                                                        className="rounded-md border"
                                                                    />
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <div className="flex flex-col gap-4 flex-1">
                                                            <FormField
                                                                control={reservationForm.control}
                                                                name="reservation_time"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Reservation Time*</FormLabel>
                                                                        <FormControl>
                                                                            <Input type="time" {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={reservationForm.control}
                                                                name="duration_minutes"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Duration (minutes)</FormLabel>
                                                                        <Select
                                                                            onValueChange={(value) =>
                                                                                field.onChange(parseInt(value))
                                                                            }
                                                                            value={field.value.toString()}
                                                                        >
                                                                            <FormControl>
                                                                                <SelectTrigger>
                                                                                    <SelectValue placeholder="Select duration" />
                                                                                </SelectTrigger>
                                                                            </FormControl>
                                                                            <SelectContent>
                                                                                <SelectItem value="60">60 minutes</SelectItem>
                                                                                <SelectItem value="90">90 minutes</SelectItem>
                                                                                <SelectItem value="120">120 minutes</SelectItem>
                                                                                <SelectItem value="150">150 minutes</SelectItem>
                                                                                <SelectItem value="180">180 minutes</SelectItem>
                                                                                <SelectItem value="240">240 minutes</SelectItem>
                                                                            </SelectContent>
                                                                        </Select>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>
                                                    </div>

                                                    <FormField
                                                        control={reservationForm.control}
                                                        name="special_requests"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Special Requests</FormLabel>
                                                                <FormControl>
                                                                    <Textarea
                                                                        {...field}
                                                                        placeholder="Any special requests or notes"
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />

                                                    <DialogFooter>
                                                        <Button
                                                            variant="outline"
                                                            type="button"
                                                            onClick={() => setIsReservationDialogOpen(false)}
                                                        >
                                                            Cancel
                                                        </Button>
                                                        <Button type="submit">
                                                            {selectedReservation
                                                                ? "Update Reservation"
                                                                : "Create Reservation"}
                                                        </Button>
                                                    </DialogFooter>
                                                </form>
                                            </Form>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>


    );
}
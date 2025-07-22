"use client";
import { useState } from "react";
import { CalendarIcon, FilterIcon, SearchIcon, InfoIcon, ExternalLinkIcon } from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SiteHeader } from "@/components/site-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";




// Sample delivery data
const swiggyDeliveries = [
    {
        id: "SW-1234",
        customer: "John Doe",
        items: ["Butter Chicken", "Naan", "Gulab Jamun"],
        amount: "₹560",
        restaurant: "Cucumber and Spices",
        orderTime: new Date(2023, 6, 12, 19, 30),
        acceptedTime: new Date(2023, 6, 12, 19, 32),
        preparedTime: new Date(2023, 6, 12, 19, 55),
        dispatchedTime: new Date(2023, 6, 12, 20, 5),
        deliveredTime: new Date(2023, 6, 12, 20, 25),
        status: "Delivered",
        address: "123 Main St, Whitefield, Bangalore",
        deliveryPerson: "Rajesh K",
        rating: 4.5,
    },
    {
        id: "SW-1235",
        customer: "Priya Sharma",
        items: ["Masala Dosa", "Filter Coffee"],
        amount: "₹220",
        restaurant: "Cucumber and Spices",
        orderTime: new Date(2023, 6, 12, 9, 10),
        acceptedTime: new Date(2023, 6, 12, 9, 12),
        preparedTime: new Date(2023, 6, 12, 9, 25),
        dispatchedTime: new Date(2023, 6, 12, 9, 30),
        deliveredTime: new Date(2023, 6, 12, 9, 45),
        status: "Delivered",
        address: "45 Park Avenue, Indiranagar, Bangalore",
        deliveryPerson: "Sunil M",
        rating: 5,
    },
    {
        id: "SW-1236",
        customer: "Arun Kumar",
        items: ["Chicken Biryani", "Raita", "Coke"],
        amount: "₹380",
        restaurant: "Cucumber and Spices",
        orderTime: new Date(2023, 6, 12, 13, 15),
        acceptedTime: new Date(2023, 6, 12, 13, 18),
        preparedTime: new Date(2023, 6, 12, 13, 40),
        dispatchedTime: new Date(2023, 6, 12, 13, 45),
        deliveredTime: null,
        status: "In Transit",
        address: "78 Brigade Road, Bangalore",
        deliveryPerson: "Mohammed A",
        rating: null,
    },
];

const zomatoDeliveries = [
    {
        id: "ZM-7890",
        customer: "Sarah Wilson",
        items: ["Margherita Pizza", "Garlic Bread", "Coke"],
        restaurant: "Cucumber and Spices",
        amount: "₹650",
        orderTime: new Date(2023, 6, 12, 20, 10),
        acceptedTime: new Date(2023, 6, 12, 20, 12),
        preparedTime: new Date(2023, 6, 12, 20, 30),
        dispatchedTime: new Date(2023, 6, 12, 20, 35),
        deliveredTime: new Date(2023, 6, 12, 21, 0),
        status: "Delivered",
        address: "56 MG Road, Bangalore",
        deliveryPerson: "Ravi S",
        rating: 4,
    },
    {
        id: "ZM-7891",
        customer: "Vikram Singh",
        items: ["Paneer Tikka", "Roti", "Dal Makhani"],
        restaurant: "Cucumber and Spices",
        amount: "₹480",
        orderTime: new Date(2023, 6, 12, 13, 45),
        acceptedTime: new Date(2023, 6, 12, 13, 48),
        preparedTime: new Date(2023, 6, 12, 14, 10),
        dispatchedTime: new Date(2023, 6, 12, 14, 15),
        deliveredTime: new Date(2023, 6, 12, 14, 40),
        status: "Delivered",
        address: "123 Richmond Road, Bangalore",
        deliveryPerson: "Ganesh T",
        rating: 4.5,
    },
    {
        id: "ZM-7892",
        customer: "Meera Patel",
        items: ["Veg Fried Rice", "Gobi Manchurian"],
        amount: "₹340",
        restaurant: "Cucumber and Spices",
        orderTime: new Date(2023, 6, 12, 19, 20),
        acceptedTime: new Date(2023, 6, 12, 19, 23),
        preparedTime: null,
        dispatchedTime: null,
        deliveredTime: null,
        status: "Preparing",
        address: "89 Koramangala, Bangalore",
        deliveryPerson: "Not assigned",
        rating: null,
    },
];

const uberEatsDeliveries = [
    {
        id: "UE-4567",
        customer: "Michael Brown",
        items: ["Burger", "Fries", "Milkshake"],
        amount: "₹450",
        restaurant: "Cucumber and Spices",
        orderTime: new Date(2023, 6, 12, 18, 30),
        acceptedTime: new Date(2023, 6, 12, 18, 33),
        preparedTime: new Date(2023, 6, 12, 18, 50),
        dispatchedTime: new Date(2023, 6, 12, 18, 55),
        deliveredTime: new Date(2023, 6, 12, 19, 15),
        status: "Delivered",
        address: "34 Electronic City, Bangalore",
        deliveryPerson: "Prakash R",
        rating: 5,
    },
    {
        id: "UE-4568",
        customer: "Emma Thompson",
        items: ["Penne Pasta", "Garlic Bread", "Tiramisu"],
        amount: "₹720",
        restaurant: "Cucumber and Spices",
        orderTime: new Date(2023, 6, 12, 20, 15),
        acceptedTime: new Date(2023, 6, 12, 20, 18),
        preparedTime: new Date(2023, 6, 12, 20, 40),
        dispatchedTime: null,
        deliveredTime: null,
        status: "Ready for Pickup",
        address: "56 Residency Road, Bangalore",
        deliveryPerson: "Kiran J",
        rating: null,
    },
    {
        id: "UE-4569",
        customer: "David Chen",
        items: ["Sushi Platter", "Miso Soup"],
        amount: "₹850",
        restaurant: "Cucumber and Spices",
        orderTime: new Date(2023, 6, 12, 19, 45),
        acceptedTime: new Date(2023, 6, 12, 19, 48),
        preparedTime: null,
        dispatchedTime: null,
        deliveredTime: null,
        status: "Order Received",
        address: "78 Lavelle Road, Bangalore",
        deliveryPerson: "Not assigned",
        rating: null,
    },
];

const getStatusBadge = (status: string) => {
    switch (status) {
        case "Delivered":
            return <Badge className="bg-green-500">Delivered</Badge>;
        case "In Transit":
            return <Badge className="bg-blue-500">In Transit</Badge>;
        case "Preparing":
            return <Badge className="bg-yellow-500">Preparing</Badge>;
        case "Ready for Pickup":
            return <Badge className="bg-purple-500">Ready for Pickup</Badge>;
        default:
            return <Badge className="bg-gray-500">Order Received</Badge>;
    }
};

const formatTime = (date: Date | null) => {
    if (!date) return "Pending";
    return format(date, "hh:mm a");
};

export default function DeliveriesPage() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [selectedDelivery, setSelectedDelivery] = useState<any | null>(null);

    return (
        <div>
            <SiteHeader title="Delivery Management" />
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 md:gap-6">
                        <div className="px-4 lg:px-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="rounded-lg mt-4"
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                                    <div>
                                        <h1 className="text-3xl font-bold tracking-tight">Delivery Operations</h1>
                                        <p className="text-muted-foreground">
                                            Monitor and manage deliveries from various platforms
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 mt-4 md:mt-0">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline" className="flex gap-2">
                                                    <CalendarIcon className="h-4 w-4" />
                                                    {date ? format(date, "PPP") : "Pick a date"}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={date}
                                                    onSelect={setDate}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <Button variant="outline" className="flex gap-2">
                                            <FilterIcon className="h-4 w-4" />
                                            Filter
                                        </Button>
                                        <div className="relative">
                                            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                type="search"
                                                placeholder="Search orders..."
                                                className="w-[200px] pl-8"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <Tabs defaultValue="swiggy" className="w-full">
                                    <TabsList className="grid w-full grid-cols-3 mb-6">
                                        <TabsTrigger value="swiggy" className="flex items-center gap-2">
                                            <Image 
                                                src="/assets/swiggy-logo.png" 
                                                alt="Swiggy" 
                                                width={40} 
                                                height={40}
                                                className="rounded-sm"
                                            />
                                            {/* Swiggy */}
                                        </TabsTrigger>
                                        <TabsTrigger value="zomato" className="flex items-center gap-2">
                                            <Image 
                                                src="/assets/zomato-logo.png" 
                                                alt="Zomato" 
                                                width={40} 
                                                height={40}
                                                className="rounded-sm"
                                            />
                                            {/* Zomato */}
                                        </TabsTrigger>
                                        <TabsTrigger value="ubereats" className="flex items-center gap-2">
                                            <Image 
                                                src="/assets/ubereats-logo.png" 
                                                alt="UberEats" 
                                                width={40} 
                                                height={40}
                                                className="rounded-sm"
                                            />
                                            {/* UberEats */}
                                        </TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="swiggy">
                                        <Card>
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-2xl">Swiggy Deliveries</CardTitle>
                                                <CardDescription>
                                                    {swiggyDeliveries.length} orders from Swiggy today
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="rounded-md border">
                                                    <Table>
                                                        <TableHeader >
                                                            <TableRow>
                                                                <TableHead className="font-semibold">Order ID</TableHead>
                                                                <TableHead className="font-semibold">Customer</TableHead>
                                                                <TableHead className="font-semibold">Restaurant</TableHead>
                                                                <TableHead className="font-semibold">Amount</TableHead>
                                                                <TableHead className="font-semibold">Order Time</TableHead>
                                                                <TableHead className="font-semibold">Status</TableHead>
                                                                <TableHead className="font-semibold">Details</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {swiggyDeliveries.map((delivery) => (
                                                                <TableRow key={delivery.id}>
                                                                    <TableCell>{delivery.id}</TableCell>
                                                                    <TableCell>{delivery.customer}</TableCell>
                                                                    <TableCell>{delivery.restaurant}</TableCell>
                                                                    <TableCell>{delivery.amount}</TableCell>
                                                                    <TableCell>{format(delivery.orderTime, "hh:mm a")}</TableCell>
                                                                    <TableCell>{getStatusBadge(delivery.status)}</TableCell>
                                                                    <TableCell>
                                                                        <Dialog>
                                                                            <DialogTrigger asChild>
                                                                                <Button 
                                                                                    variant="ghost" 
                                                                                    size="icon"
                                                                                    onClick={() => setSelectedDelivery(delivery)}
                                                                                >
                                                                                    <InfoIcon className="h-4 w-4" />
                                                                                </Button>
                                                                            </DialogTrigger>
                                                                            <DialogContent className="max-w-2xl">
                                                                                <DialogHeader>
                                                                                    <DialogTitle className="flex items-center gap-2">
                                                                                        <Image 
                                                                                            src="/assets/swiggy-logo.png" 
                                                                                            alt="Swiggy" 
                                                                                            width={24} 
                                                                                            height={24} 
                                                                                            className="rounded-sm"
                                                                                        />
                                                                                        Order Details - {delivery.id}
                                                                                    </DialogTitle>
                                                                                    <DialogDescription>
                                                                                        Complete information about this delivery
                                                                                    </DialogDescription>
                                                                                </DialogHeader>
                                                                                <div className="grid grid-cols-2 gap-4">
                                                                                    <div>
                                                                                        <h3 className="font-semibold">Customer Information</h3>
                                                                                        <p className="text-sm text-muted-foreground">{delivery.customer}</p>
                                                                                        <p className="text-sm text-muted-foreground">{delivery.address}</p>
                                                                                    </div>
                                                                                    <div>
                                                                                        <h3 className="font-semibold">Order Information</h3>
                                                                                        <p className="text-sm text-muted-foreground">Restaurant: {delivery.restaurant}</p>
                                                                                        <p className="text-sm text-muted-foreground">Amount: {delivery.amount}</p>
                                                                                        <p className="text-sm text-muted-foreground">Status: {delivery.status}</p>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="mt-4">
                                                                                    <h3 className="font-semibold">Items</h3>
                                                                                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                                                                                        {delivery.items.map((item, i) => (
                                                                                            <li key={i}>{item}</li>
                                                                                        ))}
                                                                                    </ul>
                                                                                </div>
                                                                                <div className="mt-4">
                                                                                    <h3 className="font-semibold">Delivery Timeline</h3>
                                                                                    <div className="space-y-2 mt-2">
                                                                                        <div className="grid grid-cols-2 gap-4">
                                                                                            <div className="text-sm">Order Received:</div>
                                                                                            <div className="text-sm font-medium">{format(delivery.orderTime, "hh:mm a")}</div>
                                                                                        </div>
                                                                                        <div className="grid grid-cols-2 gap-4">
                                                                                            <div className="text-sm">Order Accepted:</div>
                                                                                            <div className="text-sm font-medium">{formatTime(delivery.acceptedTime)}</div>
                                                                                        </div>
                                                                                        <div className="grid grid-cols-2 gap-4">
                                                                                            <div className="text-sm">Food Prepared:</div>
                                                                                            <div className="text-sm font-medium">{formatTime(delivery.preparedTime)}</div>
                                                                                        </div>
                                                                                        <div className="grid grid-cols-2 gap-4">
                                                                                            <div className="text-sm">Out for Delivery:</div>
                                                                                            <div className="text-sm font-medium">{formatTime(delivery.dispatchedTime)}</div>
                                                                                        </div>
                                                                                        <div className="grid grid-cols-2 gap-4">
                                                                                            <div className="text-sm">Delivered:</div>
                                                                                            <div className="text-sm font-medium">{formatTime(delivery.deliveredTime)}</div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="mt-4">
                                                                                    <h3 className="font-semibold">Delivery Person</h3>
                                                                                    <p className="text-sm text-muted-foreground">{delivery.deliveryPerson}</p>
                                                                                    {delivery.rating && (
                                                                                        <p className="text-sm text-muted-foreground">Rating: {delivery.rating}/5</p>
                                                                                    )}
                                                                                </div>
                                                                            </DialogContent>
                                                                        </Dialog>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    <TabsContent value="zomato">
                                        <Card>
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-2xl">Zomato Deliveries</CardTitle>
                                                <CardDescription>
                                                    {zomatoDeliveries.length} orders from Zomato today
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="rounded-md border">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow>
                                                                <TableHead className="font-semibold">Order ID</TableHead>
                                                                <TableHead className="font-semibold">Customer</TableHead>
                                                                <TableHead className="font-semibold">Restaurant</TableHead>
                                                                <TableHead className="font-semibold">Amount</TableHead>
                                                                <TableHead className="font-semibold">Order Time</TableHead>
                                                                <TableHead className="font-semibold">Status</TableHead>
                                                                <TableHead className="font-semibold">Details</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {zomatoDeliveries.map((delivery) => (
                                                                <TableRow key={delivery.id}>
                                                                    <TableCell>{delivery.id}</TableCell>
                                                                    <TableCell>{delivery.customer}</TableCell>
                                                                    <TableCell>{delivery.restaurant}</TableCell>
                                                                    <TableCell>{delivery.amount}</TableCell>
                                                                    <TableCell>{format(delivery.orderTime, "hh:mm a")}</TableCell>
                                                                    <TableCell>{getStatusBadge(delivery.status)}</TableCell>
                                                                    <TableCell>
                                                                        <Dialog>
                                                                            <DialogTrigger asChild>
                                                                                <Button 
                                                                                    variant="ghost" 
                                                                                    size="icon"
                                                                                    onClick={() => setSelectedDelivery(delivery)}
                                                                                >
                                                                                    <InfoIcon className="h-4 w-4" />
                                                                                </Button>
                                                                            </DialogTrigger>
                                                                            <DialogContent className="max-w-2xl">
                                                                                <DialogHeader>
                                                                                    <DialogTitle className="flex items-center gap-2">
                                                                                        <Image 
                                                                                            src="/assets/zomato-logo.png" 
                                                                                            alt="Zomato" 
                                                                                            width={24} 
                                                                                            height={24} 
                                                                                            className="rounded-sm"
                                                                                        />
                                                                                        Order Details - {delivery.id}
                                                                                    </DialogTitle>
                                                                                    <DialogDescription>
                                                                                        Complete information about this delivery
                                                                                    </DialogDescription>
                                                                                </DialogHeader>
                                                                                <div className="grid grid-cols-2 gap-4">
                                                                                    <div>
                                                                                        <h3 className="font-semibold">Customer Information</h3>
                                                                                        <p className="text-sm text-muted-foreground">{delivery.customer}</p>
                                                                                        <p className="text-sm text-muted-foreground">{delivery.address}</p>
                                                                                    </div>
                                                                                    <div>
                                                                                        <h3 className="font-semibold">Order Information</h3>
                                                                                        <p className="text-sm text-muted-foreground">Restaurant: {delivery.restaurant}</p>
                                                                                        <p className="text-sm text-muted-foreground">Amount: {delivery.amount}</p>
                                                                                        <p className="text-sm text-muted-foreground">Status: {delivery.status}</p>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="mt-4">
                                                                                    <h3 className="font-semibold">Items</h3>
                                                                                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                                                                                        {delivery.items.map((item, i) => (
                                                                                            <li key={i}>{item}</li>
                                                                                        ))}
                                                                                    </ul>
                                                                                </div>
                                                                                <div className="mt-4">
                                                                                    <h3 className="font-semibold">Delivery Timeline</h3>
                                                                                    <div className="space-y-2 mt-2">
                                                                                        <div className="grid grid-cols-2 gap-4">
                                                                                            <div className="text-sm">Order Received:</div>
                                                                                            <div className="text-sm font-medium">{format(delivery.orderTime, "hh:mm a")}</div>
                                                                                        </div>
                                                                                        <div className="grid grid-cols-2 gap-4">
                                                                                            <div className="text-sm">Order Accepted:</div>
                                                                                            <div className="text-sm font-medium">{formatTime(delivery.acceptedTime)}</div>
                                                                                        </div>
                                                                                        <div className="grid grid-cols-2 gap-4">
                                                                                            <div className="text-sm">Food Prepared:</div>
                                                                                            <div className="text-sm font-medium">{formatTime(delivery.preparedTime)}</div>
                                                                                        </div>
                                                                                        <div className="grid grid-cols-2 gap-4">
                                                                                            <div className="text-sm">Out for Delivery:</div>
                                                                                            <div className="text-sm font-medium">{formatTime(delivery.dispatchedTime)}</div>
                                                                                        </div>
                                                                                        <div className="grid grid-cols-2 gap-4">
                                                                                            <div className="text-sm">Delivered:</div>
                                                                                            <div className="text-sm font-medium">{formatTime(delivery.deliveredTime)}</div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="mt-4">
                                                                                    <h3 className="font-semibold">Delivery Person</h3>
                                                                                    <p className="text-sm text-muted-foreground">{delivery.deliveryPerson}</p>
                                                                                    {delivery.rating && (
                                                                                        <p className="text-sm text-muted-foreground">Rating: {delivery.rating}/5</p>
                                                                                    )}
                                                                                </div>
                                                                            </DialogContent>
                                                                        </Dialog>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    <TabsContent value="ubereats">
                                        <Card>
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-2xl">UberEats Deliveries</CardTitle>
                                                <CardDescription>
                                                    {uberEatsDeliveries.length} orders from UberEats today
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="rounded-md border">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow>
                                                                <TableHead className="font-semibold">Order ID</TableHead>
                                                                <TableHead className="font-semibold">Customer</TableHead>
                                                                <TableHead className="font-semibold">Restaurant</TableHead>
                                                                <TableHead className="font-semibold">Amount</TableHead>
                                                                <TableHead className="font-semibold">Order Time</TableHead>
                                                                <TableHead className="font-semibold">Status</TableHead>
                                                                <TableHead className="font-semibold">Details</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {uberEatsDeliveries.map((delivery) => (
                                                                <TableRow key={delivery.id}>
                                                                    <TableCell>{delivery.id}</TableCell>
                                                                    <TableCell>{delivery.customer}</TableCell>
                                                                    <TableCell>{delivery.restaurant}</TableCell>
                                                                    <TableCell>{delivery.amount}</TableCell>
                                                                    <TableCell>{format(delivery.orderTime, "hh:mm a")}</TableCell>
                                                                    <TableCell>{getStatusBadge(delivery.status)}</TableCell>
                                                                    <TableCell>
                                                                        <Dialog>
                                                                            <DialogTrigger asChild>
                                                                                <Button 
                                                                                    variant="ghost" 
                                                                                    size="icon"
                                                                                    onClick={() => setSelectedDelivery(delivery)}
                                                                                >
                                                                                    <InfoIcon className="h-4 w-4" />
                                                                                </Button>
                                                                            </DialogTrigger>
                                                                            <DialogContent className="max-w-2xl">
                                                                                <DialogHeader>
                                                                                    <DialogTitle className="flex items-center gap-2">
                                                                                        <Image 
                                                                                            src="/assets/ubereats-logo.png" 
                                                                                            alt="UberEats" 
                                                                                            width={24} 
                                                                                            height={24} 
                                                                                            className="rounded-sm"
                                                                                        />
                                                                                        Order Details - {delivery.id}
                                                                                    </DialogTitle>
                                                                                    <DialogDescription>
                                                                                        Complete information about this delivery
                                                                                    </DialogDescription>
                                                                                </DialogHeader>
                                                                                <div className="grid grid-cols-2 gap-4">
                                                                                    <div>
                                                                                        <h3 className="font-semibold">Customer Information</h3>
                                                                                        <p className="text-sm text-muted-foreground">{delivery.customer}</p>
                                                                                        <p className="text-sm text-muted-foreground">{delivery.address}</p>
                                                                                    </div>
                                                                                    <div>
                                                                                        <h3 className="font-semibold">Order Information</h3>
                                                                                        <p className="text-sm text-muted-foreground">Restaurant: {delivery.restaurant}</p>
                                                                                        <p className="text-sm text-muted-foreground">Amount: {delivery.amount}</p>
                                                                                        <p className="text-sm text-muted-foreground">Status: {delivery.status}</p>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="mt-4">
                                                                                    <h3 className="font-semibold">Items</h3>
                                                                                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                                                                                        {delivery.items.map((item, i) => (
                                                                                            <li key={i}>{item}</li>
                                                                                        ))}
                                                                                    </ul>
                                                                                </div>
                                                                                <div className="mt-4">
                                                                                    <h3 className="font-semibold">Delivery Timeline</h3>
                                                                                    <div className="space-y-2 mt-2">
                                                                                        <div className="grid grid-cols-2 gap-4">
                                                                                            <div className="text-sm">Order Received:</div>
                                                                                            <div className="text-sm font-medium">{format(delivery.orderTime, "hh:mm a")}</div>
                                                                                        </div>
                                                                                        <div className="grid grid-cols-2 gap-4">
                                                                                            <div className="text-sm">Order Accepted:</div>
                                                                                            <div className="text-sm font-medium">{formatTime(delivery.acceptedTime)}</div>
                                                                                        </div>
                                                                                        <div className="grid grid-cols-2 gap-4">
                                                                                            <div className="text-sm">Food Prepared:</div>
                                                                                            <div className="text-sm font-medium">{formatTime(delivery.preparedTime)}</div>
                                                                                        </div>
                                                                                        <div className="grid grid-cols-2 gap-4">
                                                                                            <div className="text-sm">Out for Delivery:</div>
                                                                                            <div className="text-sm font-medium">{formatTime(delivery.dispatchedTime)}</div>
                                                                                        </div>
                                                                                        <div className="grid grid-cols-2 gap-4">
                                                                                            <div className="text-sm">Delivered:</div>
                                                                                            <div className="text-sm font-medium">{formatTime(delivery.deliveredTime)}</div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="mt-4">
                                                                                    <h3 className="font-semibold">Delivery Person</h3>
                                                                                    <p className="text-sm text-muted-foreground">{delivery.deliveryPerson}</p>
                                                                                    {delivery.rating && (
                                                                                        <p className="text-sm text-muted-foreground">Rating: {delivery.rating}/5</p>
                                                                                    )}
                                                                                </div>
                                                                            </DialogContent>
                                                                        </Dialog>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>
                                </Tabs>

                                <div className="mt-8 flex justify-between">
                                    <div className="flex items-center space-x-2">
                                        <p className="text-sm text-muted-foreground">Showing 9 orders</p>
                                    </div>
                                    <div className="flex items-center space-x-6">
                                        <Button variant="outline" size="sm" className="h-8">
                                            Previous
                                        </Button>
                                        <Button variant="outline" size="sm" className="h-8">
                                            Next
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
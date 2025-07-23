"use client"

import { useState } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

import {
    BarChart,
    Bell,
    Calendar,
    Facebook,
    Filter,
    Instagram,
    MoreHorizontal,
    Plus,
    Search,
    Settings,
    Trash2,
    Twitter
} from 'lucide-react'

export default function CampaignManagementPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [platformFilter, setPlatformFilter] = useState("all")
    const [statusFilter, setStatusFilter] = useState("all")
    const [showNewCampaign, setShowNewCampaign] = useState(false)

    const dummyAdCampaigns = [
        {
            id: "1",
            name: "Summer Special Promotion",
            platform: "facebook",
            status: "active",
            budget: 5000,
            spent: 1200,
            startDate: "2025-07-10",
            endDate: "2025-08-10",
            clicks: 2300,
            impressions: 45000,
            conversions: 120,
            targetAudience: "18-35 year olds in urban areas",
            description: "Promoting summer menu items with special discounts"
        },
        {
            id: "2",
            name: "Weekend Special Offer",
            platform: "instagram",
            status: "active",
            budget: 3000,
            spent: 800,
            startDate: "2025-07-15",
            endDate: "2025-07-31",
            clicks: 1500,
            impressions: 28000,
            conversions: 75,
            targetAudience: "Food enthusiasts in metropolitan areas",
            description: "Highlighting weekend specials with food photography"
        },
        {
            id: "3",
            name: "New Menu Launch",
            platform: "google",
            status: "scheduled",
            budget: 7500,
            spent: 0,
            startDate: "2025-08-01",
            endDate: "2025-09-01",
            clicks: 0,
            impressions: 0,
            conversions: 0,
            targetAudience: "Previous customers and local residents",
            description: "Introducing our new seasonal menu items for the fall season"
        },
        {
            id: "4",
            name: "Holiday Special Campaign",
            platform: "facebook",
            status: "draft",
            budget: 10000,
            spent: 0,
            startDate: "",
            endDate: "",
            clicks: 0,
            impressions: 0,
            conversions: 0,
            targetAudience: "Families and groups planning holiday meals",
            description: "Special holiday menu and catering options for festive gatherings"
        },
        {
            id: "5",
            name: "Loyalty Program Promotion",
            platform: "email",
            status: "completed",
            budget: 2000,
            spent: 2000,
            startDate: "2025-06-01",
            endDate: "2025-07-01",
            clicks: 3200,
            impressions: 15000,
            conversions: 450,
            targetAudience: "Existing customers in our database",
            description: "Encouraging sign-ups to our loyalty program with incentives"
        }
    ]

    const getPlatformIcon = (platform: string) => {
        switch (platform) {
            case 'facebook':
                return <Facebook className="w-4 h-4" />
            case 'instagram':
                return <Instagram className="w-4 h-4" />
            case 'twitter':
                return <Twitter className="w-4 h-4" />
            case 'google':
                return <Search className="w-4 h-4" />
            case 'email':
                return <Bell className="w-4 h-4" />
            default:
                return <Bell className="w-4 h-4" />
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20">Active</Badge>
            case 'scheduled':
                return <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20">Scheduled</Badge>
            case 'draft':
                return <Badge className="bg-gray-500/10 text-gray-500 hover:bg-gray-500/20 border-gray-500/20">Draft</Badge>
            case 'completed':
                return <Badge className="bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 border-purple-500/20">Completed</Badge>
            case 'paused':
                return <Badge className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-amber-500/20">Paused</Badge>
            default:
                return <Badge>{status}</Badge>
        }
    }

    const filteredCampaigns = dummyAdCampaigns.filter((campaign) => {
        const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            campaign.description.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesPlatform = platformFilter === "all" || campaign.platform === platformFilter
        const matchesStatus = statusFilter === "all" || campaign.status === statusFilter

        return matchesSearch && matchesPlatform && matchesStatus
    })

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Marketing Campaigns</h1>
                        <p className="text-muted-foreground">Create and manage your digital marketing campaigns</p>
                    </div>
                    <Button onClick={() => setShowNewCampaign(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Campaign
                    </Button>
                </div>

                {/* Analytics Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Active Campaigns</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {dummyAdCampaigns.filter(c => c.status === 'active').length}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                +2 from last month
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Budget</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                ₹{dummyAdCampaigns.reduce((sum, c) => sum + c.budget, 0).toLocaleString()}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Across all campaigns
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Spent</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                ₹{dummyAdCampaigns.reduce((sum, c) => sum + c.spent, 0).toLocaleString()}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {((dummyAdCampaigns.reduce((sum, c) => sum + c.spent, 0) /
                                    dummyAdCampaigns.reduce((sum, c) => sum + c.budget, 0)) * 100).toFixed(1)}% of budget
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Conversions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {dummyAdCampaigns.reduce((sum, c) => sum + c.conversions, 0).toLocaleString()}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                ~₹{(dummyAdCampaigns.reduce((sum, c) => sum + c.spent, 0) /
                                    Math.max(1, dummyAdCampaigns.reduce((sum, c) => sum + c.conversions, 0))).toFixed(0)} per conversion
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters Section */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <Input
                            placeholder="Search campaigns..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <Select value={platformFilter} onValueChange={setPlatformFilter}>
                        <SelectTrigger className="w-full md:w-40">
                            <SelectValue placeholder="Platform" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Platforms</SelectItem>
                            <SelectItem value="facebook">Facebook</SelectItem>
                            <SelectItem value="instagram">Instagram</SelectItem>
                            <SelectItem value="google">Google Ads</SelectItem>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="twitter">Twitter</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full md:w-40">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="scheduled">Scheduled</SelectItem>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="paused">Paused</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Campaign List */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredCampaigns.length > 0 ? (
                        filteredCampaigns.map((campaign) => (
                            <Card
                                key={campaign.id}
                                className="overflow-hidden py-4 gap-3 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-200"
                            >
                                <CardHeader className=" py-0 [.border-b]:pb-2 border-b border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2.5">
                                            <div className="p-2 rounded-md bg-slate-100 dark:bg-slate-800">
                                                {getPlatformIcon(campaign.platform)}
                                            </div>
                                            {getStatusBadge(campaign.status)}
                                        </div>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    <CardTitle className="text-lg line-clamp-1">{campaign.name}</CardTitle>
                                    <CardDescription className="line-clamp-2 mt-1 text-sm">
                                        {campaign.description}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="pt-1">
                                    <div className="space-y-3">
                                        {/* Budget Info */}
                                        <div>
                                            <div className="flex justify-between items-center mb-1.5">
                                                <p className="text-sm font-medium">Budget Utilization</p>
                                                <p className="text-sm font-medium">
                                                    ₹{campaign.spent.toLocaleString()}{" "}
                                                    <span className="text-muted-foreground">
                                                        of ₹{campaign.budget.toLocaleString()}
                                                    </span>
                                                </p>
                                            </div>
                                            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${campaign.spent / campaign.budget > 0.9
                                                            ? "bg-red-500"
                                                            : campaign.spent / campaign.budget > 0.7
                                                                ? "bg-amber-500"
                                                                : "bg-green-500"
                                                        }`}
                                                    style={{
                                                        width: `${Math.min(
                                                            100,
                                                            (campaign.spent / campaign.budget) * 100
                                                        )}%`,
                                                    }}
                                                ></div>
                                            </div>
                                        </div>

                                        {/* Timeline */}
                                        {(campaign.status === "active" ||
                                            campaign.status === "scheduled" ||
                                            campaign.status === "completed") && (
                                                <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900 p-2.5 rounded-md">
                                                    <Calendar className="w-5 h-5 text-slate-500" />
                                                    <div>
                                                        <p className="text-xs font-medium text-slate-500 mb-0.5">
                                                            Campaign Duration
                                                        </p>
                                                        <p className="text-sm font-medium">
                                                            {new Date(campaign.startDate).toLocaleDateString("en-IN", {
                                                                day: "numeric",
                                                                month: "short",
                                                            })}{" "}
                                                            -{" "}
                                                            {new Date(campaign.endDate).toLocaleDateString("en-IN", {
                                                                day: "numeric",
                                                                month: "short",
                                                                year: "numeric",
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                        {/* Conversions */}
                                        <div>
                                            <p className="text-xs text-muted-foreground">Conversions</p>
                                            <p className="font-medium">{campaign.conversions.toLocaleString()}</p>
                                        </div>

                                        {/* Performance */}
                                        <div className="mt-3">
                                            <p className="text-xs text-muted-foreground mb-1">Performance</p>
                                            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-blue-500 rounded-full"
                                                    style={{
                                                        width: `${Math.min(
                                                            100,
                                                            (campaign.clicks / campaign.impressions) * 100 * 5
                                                        )}%`,
                                                    }}
                                                ></div>
                                            </div>
                                        </div>

                                        {/* Target Audience (only if not active/scheduled/completed) */}
                                        {!(campaign.status === "active" ||
                                            campaign.status === "scheduled" ||
                                            campaign.status === "completed") && (
                                                <div>
                                                    <p className="text-sm font-medium text-muted-foreground">
                                                        Target Audience
                                                    </p>
                                                    <p className="text-sm">{campaign.targetAudience}</p>
                                                </div>
                                            )}
                                    </div>
                                </CardContent>

                                <CardFooter className="pt-0 flex justify-between">
                                    <Button variant="outline" size="sm">
                                        <BarChart className="w-4 h-4 mr-1" />
                                        {campaign.status === "active" || campaign.status === "completed"
                                            ? "View Analytics"
                                            : "Preview"}
                                    </Button>

                                    {campaign.status === "active" && (
                                        <Button variant="outline" size="sm">
                                            Edit
                                        </Button>
                                    )}

                                    {campaign.status === "draft" && <Button size="sm">Publish</Button>}

                                    {campaign.status === "scheduled" && (
                                        <Button variant="outline" size="sm">
                                            Reschedule
                                        </Button>
                                    )}
                                </CardFooter>
                            </Card>
                        ))
                    ) : (
                        <div className="text-center py-16 col-span-full">
                            <Bell className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                                No Campaigns Found
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Try changing your search or filters to find campaigns.
                            </p>
                        </div>
                    )}
                </div>


                {/* Create Campaign Dialog */}
                <Dialog open={showNewCampaign} onOpenChange={setShowNewCampaign}>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Create New Campaign</DialogTitle>
                            <DialogDescription>
                                Set up your marketing campaign details and targeting options.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-6 py-4">
                            <Tabs defaultValue="details" className="w-full">
                                <TabsList className="grid grid-cols-3 mb-6">
                                    <TabsTrigger value="details">Campaign Details</TabsTrigger>
                                    <TabsTrigger value="targeting">Audience & Targeting</TabsTrigger>
                                    <TabsTrigger value="budget">Budget & Schedule</TabsTrigger>
                                </TabsList>

                                <TabsContent value="details" className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Campaign Name *</Label>
                                        <Input id="name" placeholder="Enter campaign name" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description">Campaign Description</Label>
                                        <Input id="description" placeholder="Briefly describe your campaign" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="platform">Platform *</Label>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select platform" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="facebook">Facebook</SelectItem>
                                                <SelectItem value="instagram">Instagram</SelectItem>
                                                <SelectItem value="google">Google Ads</SelectItem>
                                                <SelectItem value="email">Email Campaign</SelectItem>
                                                <SelectItem value="twitter">Twitter</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="goal">Campaign Goal *</Label>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select primary goal" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="awareness">Brand Awareness</SelectItem>
                                                <SelectItem value="traffic">Website Traffic</SelectItem>
                                                <SelectItem value="engagement">Engagement</SelectItem>
                                                <SelectItem value="leads">Lead Generation</SelectItem>
                                                <SelectItem value="conversions">Sales & Conversions</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </TabsContent>

                                <TabsContent value="targeting" className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="demographics">Demographics</Label>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="age" className="text-xs">Age Range</Label>
                                                <Select>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select age range" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="18-24">18-24</SelectItem>
                                                        <SelectItem value="25-34">25-34</SelectItem>
                                                        <SelectItem value="35-44">35-44</SelectItem>
                                                        <SelectItem value="45-54">45-54</SelectItem>
                                                        <SelectItem value="55+">55+</SelectItem>
                                                        <SelectItem value="all">All Ages</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div>
                                                <Label htmlFor="gender" className="text-xs">Gender</Label>
                                                <Select>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select gender" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="all">All</SelectItem>
                                                        <SelectItem value="male">Male</SelectItem>
                                                        <SelectItem value="female">Female</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="location">Location Targeting</Label>
                                        <Input placeholder="Cities, regions or 'nationwide'" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="interests">Interests & Behaviors</Label>
                                        <Input placeholder="E.g., foodies, healthy eating, dining out" />
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Comma-separated list of relevant interests
                                        </p>
                                    </div>

                                    <div className="pt-2">
                                        <div className="flex items-center space-x-2">
                                            <Switch id="retargeting" />
                                            <Label htmlFor="retargeting">Enable retargeting for previous visitors</Label>
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="budget" className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="budget">Total Budget (₹) *</Label>
                                        <Input type="number" placeholder="Enter campaign budget" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="startDate">Start Date *</Label>
                                            <Input type="date" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="endDate">End Date *</Label>
                                            <Input type="date" />
                                        </div>
                                    </div>

                                    <Separator className="my-4" />

                                    <div className="space-y-2">
                                        <Label>Budget Allocation</Label>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select allocation strategy" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="even">Even Distribution</SelectItem>
                                                <SelectItem value="accelerated">Accelerated (Front-loaded)</SelectItem>
                                                <SelectItem value="manual">Manual Control</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2">
                                            <Switch id="auto-optimization" />
                                            <Label htmlFor="auto-optimization">Enable automatic budget optimization</Label>
                                        </div>
                                        <p className="text-xs text-muted-foreground ml-7">
                                            Automatically adjusts spending based on performance
                                        </p>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>

                        <DialogFooter className="flex justify-between">
                            <div className="flex items-center">
                                <Switch id="draft-mode" />
                                <Label htmlFor="draft-mode" className="ml-2">Save as draft</Label>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={() => setShowNewCampaign(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={() => setShowNewCampaign(false)}>
                                    Create Campaign
                                </Button>
                            </div>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}

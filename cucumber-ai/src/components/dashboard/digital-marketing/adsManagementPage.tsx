"use client"

import { useState } from "react"
import { 
  Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter 
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  PieChart, Pie, Cell, Legend, ResponsiveContainer,
  CartesianGrid, XAxis, YAxis, Tooltip
} from "recharts"
import {
  ChartContainer,
  ChartConfig,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { 
  ArrowUpRight, TrendingUp, TrendingDown, Zap, Search,
  Filter, Rocket, BarChart2, PieChart as PieChartIcon,
  DollarSign, Users, Activity, Target, MousePointer, Eye,
  Clock, AlertCircle, CheckCircle, Sparkle, ArrowRight, 
  Wand2, Settings, Calendar
} from "lucide-react"

// Mock data for charts and metrics
const adPerformanceData = [
  { date: "2023-06-01", clicks: 2500, impressions: 45000, ctr: 5.55 },
  { date: "2023-07-01", clicks: 3200, impressions: 55000, ctr: 5.82 },
  { date: "2023-08-01", clicks: 3800, impressions: 62000, ctr: 6.13 },
  { date: "2023-09-01", clicks: 3300, impressions: 60000, ctr: 5.50 },
  { date: "2023-10-01", clicks: 3900, impressions: 70000, ctr: 5.57 },
  { date: "2023-11-01", clicks: 4700, impressions: 82000, ctr: 5.73 },
  { date: "2023-12-01", clicks: 5200, impressions: 95000, ctr: 5.47 },
  { date: "2024-01-01", clicks: 4800, impressions: 90000, ctr: 5.33 },
  { date: "2024-02-01", clicks: 5500, impressions: 105000, ctr: 5.24 },
  { date: "2024-03-01", clicks: 6300, impressions: 118000, ctr: 5.34 },
  { date: "2024-04-01", clicks: 7100, impressions: 130000, ctr: 5.46 },
  { date: "2024-05-01", clicks: 7800, impressions: 142000, ctr: 5.49 }
]

const overviewMetrics = [
  { 
    title: "Total Clicks", 
    value: "7,843", 
    change: "+12.5%",
    trend: "up",
    icon: MousePointer,
    description: "Total ad clicks this month"
  },
  { 
    title: "Impressions", 
    value: "142K", 
    change: "+8.2%",
    trend: "up",
    icon: Eye,
    description: "Total ad views this month"
  },
  { 
    title: "Total Reach", 
    value: "85.4K", 
    change: "+5.7%",
    trend: "up",
    icon: Users,
    description: "Unique users reached"
  },
  { 
    title: "Ad Spend", 
    value: "₹62,450", 
    change: "+10.3%",
    trend: "up",
    icon: DollarSign,
    description: "Total ad spend this month"
  }
]

const performanceMetrics = [
  { 
    title: "CTR", 
    value: "5.49%", 
    target: 6.0,
    current: 5.49,
    status: "warning",
    icon: Target,
    description: "Click-through rate",
    suggestion: "Consider refreshing ad creatives"
  },
  { 
    title: "CPC", 
    value: "₹7.95", 
    target: 7.50,
    current: 7.95,
    status: "warning",
    icon: DollarSign,
    description: "Cost per click",
    suggestion: "Improve keyword targeting"
  },
  { 
    title: "CPM", 
    value: "₹439.02", 
    target: 450,
    current: 439.02,
    status: "success",
    icon: BarChart2,
    description: "Cost per 1000 impressions",
    suggestion: "Performance better than target"
  },
  { 
    title: "ROAS", 
    value: "3.82x", 
    target: 3.5,
    current: 3.82,
    status: "success",
    icon: TrendingUp,
    description: "Return on ad spend",
    suggestion: "Increase budget for top campaigns"
  }
]

const adPlatforms = [
  { 
    name: "Google Ads", 
    spend: 28450, 
    clicks: 3560, 
    impressions: 64800, 
    ctr: 5.49, 
    cpc: 7.99,
    roas: 4.1,
    color: "#4285F4"
  },
  { 
    name: "Meta Ads", 
    spend: 19800, 
    clicks: 2540, 
    impressions: 48200, 
    ctr: 5.27, 
    cpc: 7.79,
    roas: 3.7,
    color: "#1877F2"
  },
  { 
    name: "Tiktok Ads", 
    spend: 8900, 
    clicks: 890, 
    impressions: 15400, 
    ctr: 5.78, 
    cpc: 10.0,
    roas: 2.9,
    color: "#0A66C2"
  },
  { 
    name: "YouTube Ads", 
    spend: 5300, 
    clicks: 853, 
    impressions: 13600, 
    ctr: 6.27, 
    cpc: 6.21,
    roas: 3.5,
    color: "#FF0000"
  }
]

const adCampaigns = [
  {
    id: 1,
    name: "Summer Sale Campaign",
    platform: "Google Ads",
    status: "Active",
    budget: 12500,
    spend: 8745,
    clicks: 1480,
    impressions: 26200,
    ctr: 5.65,
    cpc: 5.91,
    roas: 4.2,
    startDate: "2024-05-01",
    endDate: "2024-06-30",
    objective: "Sales",
    badgeColor: "bg-emerald-500/10 text-emerald-600"
  },
  {
    id: 2,
    name: "Brand Awareness Push",
    platform: "Meta Ads",
    status: "Active",
    budget: 9500,
    spend: 6240,
    clicks: 1050,
    impressions: 22800,
    ctr: 4.61,
    cpc: 5.94,
    roas: 3.8,
    startDate: "2024-05-10",
    endDate: "2024-06-20",
    objective: "Awareness",
    badgeColor: "bg-emerald-500/10 text-emerald-600"
  },
  {
    id: 3,
    name: "Product Launch - Model X",
    platform: "Google Ads",
    status: "Active",
    budget: 15000,
    spend: 7820,
    clicks: 1250,
    impressions: 19600,
    ctr: 6.38,
    cpc: 6.26,
    roas: 4.5,
    startDate: "2024-05-15",
    endDate: "2024-07-15",
    objective: "Conversions",
    badgeColor: "bg-emerald-500/10 text-emerald-600"
  },
  {
    id: 4,
    name: "Retargeting Campaign Q2",
    platform: "Google Ads",
    status: "Active",
    budget: 8000,
    spend: 5620,
    clicks: 940,
    impressions: 14200,
    ctr: 6.62,
    cpc: 5.98,
    roas: 5.1,
    startDate: "2024-04-01",
    endDate: "2024-06-30",
    objective: "Conversions",
    badgeColor: "bg-emerald-500/10 text-emerald-600"
  },
  {
    id: 5,
    name: "Spring Collection Promo",
    platform: "Meta Ads",
    status: "Paused",
    budget: 7500,
    spend: 7320,
    clicks: 890,
    impressions: 18400,
    ctr: 4.84,
    cpc: 8.22,
    roas: 3.2,
    startDate: "2024-03-15",
    endDate: "2024-05-15",
    objective: "Sales",
    badgeColor: "bg-yellow-500/10 text-yellow-600"
  },
  {
    id: 6,
    name: "B2B Lead Generation",
    platform: "Tiktok Ads",
    status: "Active",
    budget: 10000,
    spend: 4230,
    clicks: 420,
    impressions: 7200,
    ctr: 5.83,
    cpc: 10.07,
    roas: 3.0,
    startDate: "2024-05-01",
    endDate: "2024-07-31",
    objective: "Leads",
    badgeColor: "bg-emerald-500/10 text-emerald-600"
  },
  {
    id: 7,
    name: "Tutorial Video Series",
    platform: "YouTube Ads",
    status: "Draft",
    budget: 5000,
    spend: 0,
    clicks: 0,
    impressions: 0,
    ctr: 0,
    cpc: 0,
    roas: 0,
    startDate: "2024-06-01",
    endDate: "2024-07-31",
    objective: "Engagement",
    badgeColor: "bg-slate-500/10 text-slate-600"
  }
]

const smartActions = [
  {
    id: 1,
    title: "Increase budget for 'Summer Sale Campaign'",
    description: "This campaign is performing 32% above average ROAS. Consider increasing budget by 15-20%.",
    impact: "high",
    platform: "Google Ads",
    category: "Budget Optimization"
  },
  {
    id: 2,
    title: "Pause underperforming keywords",
    description: "15 keywords have high spend but low conversion rate. Estimated savings: ₹1,240/month.",
    impact: "medium",
    platform: "Google Ads",
    category: "Performance Optimization"
  },
  {
    id: 3,
    title: "Refresh ad creatives for Meta campaigns",
    description: "Click-through rate has dropped 8% in the last 2 weeks. Fresh creatives could improve engagement.",
    impact: "medium",
    platform: "Meta Ads",
    category: "Creative Optimization"
  },
  {
    id: 4,
    title: "Optimize ad scheduling for B2B campaigns",
    description: "Performance data shows higher conversion rates on weekdays between 10 AM - 4 PM.",
    impact: "medium",
    platform: "Tiktok Ads",
    category: "Timing Optimization"
  },
  {
    id: 5,
    title: "Enable automated bidding for 'Product Launch' campaign",
    description: "Switch from manual CPC to target ROAS bidding to potentially improve returns by 15-20%.",
    impact: "high",
    platform: "Google Ads",
    category: "Bidding Strategy"
  }
]

// Chart configurations
const chartConfig = {
  clicks: {
    label: "Clicks",
    color: "oklch(0.7655 0.1366 159.1498)", // teal/cyan shade
  },
  impressions: {
    label: "Impressions",
    color: "oklch(0.7655 0.1366 200)", // slightly more blue
  },
} satisfies ChartConfig

export default function AdsManagementPage() {
  const [timeRange, setTimeRange] = useState("30d")
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [platformFilter, setPlatformFilter] = useState("all")

  // Filter campaigns based on search query and platform filter
  const filteredCampaigns = adCampaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPlatform = platformFilter === "all" || campaign.platform === platformFilter
    return matchesSearch && matchesPlatform
  })

  // Calculate platform distribution for pie chart
  const platformData = adPlatforms.map(platform => ({
    name: platform.name,
    value: platform.spend,
    color: platform.color
  }))

  return (
    <div className="min-h-screen p-2 md:p-6 bg-background">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
          <div>
            <h1 className="text-3xl font-bold">Ads Management</h1>
            <p className="text-muted-foreground">Monitor and optimize your digital marketing campaigns</p>
          </div>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Rocket className="h-4 w-4" />
                  New Campaign
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Campaign</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <p className="text-muted-foreground text-sm">
                    This feature will be available soon. Contact your account manager to set up new campaigns.
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-4 md:w-[600px]  bg-background/90 dark:shadow-sm dark:shadow-gray-900/1">
            <TabsTrigger value="overview" className="data-[state=active]:shadow-sm data-[state=active]:bg-card dark:data-[state=active]:bg-card/90 dark:hover:bg-muted/30 transition-all">Overview</TabsTrigger>
            <TabsTrigger value="campaigns" className="data-[state=active]:shadow-sm data-[state=active]:bg-card dark:data-[state=active]:bg-card/90 dark:hover:bg-muted/30 transition-all">Campaigns</TabsTrigger>
            <TabsTrigger value="performance" className="data-[state=active]:shadow-sm data-[state=active]:bg-card dark:data-[state=active]:bg-card/90 dark:hover:bg-muted/30 transition-all">Performance</TabsTrigger>
            <TabsTrigger value="insights" className="data-[state=active]:shadow-sm data-[state=active]:bg-card dark:data-[state=active]:bg-card/90 dark:hover:bg-muted/30 transition-all">AI Insights</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Overview Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {overviewMetrics.map((metric, index) => (
                <Card key={index} className="shadow-sm">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base font-medium">{metric.title}</CardTitle>
                      <div className="p-1.5 rounded-full bg-primary/10">
                        <metric.icon className="h-4 w-4 text-primary" />
                      </div>
                    </div>
                    <CardDescription>{metric.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline justify-between">
                      <div className="text-2xl font-bold">{metric.value}</div>
                      <div className={`flex items-center text-sm ${
                        metric.trend === "up" ? "text-emerald-600" : "text-red-600"
                      }`}>
                        {metric.trend === "up" ? 
                          <TrendingUp className="h-3 w-3 mr-1" /> : 
                          <TrendingDown className="h-3 w-3 mr-1" />
                        }
                        {metric.change}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="lg:col-span-2 shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base font-medium">Campaign Performance</CardTitle>
                      <CardDescription>Clicks and impressions over time</CardDescription>
                    </div>
                    <Select value={timeRange} onValueChange={setTimeRange}>
                      <SelectTrigger className="w-36 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7d">Last 7 days</SelectItem>
                        <SelectItem value="30d">Last 30 days</SelectItem>
                        <SelectItem value="90d">Last 90 days</SelectItem>
                        <SelectItem value="12m">Last 12 months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent className="pt-2">
                  <ChartContainer config={chartConfig} className="">
                    <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={adPerformanceData}
                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={chartConfig.clicks.color} stopOpacity={0.2} />
                                <stop offset="95%" stopColor={chartConfig.clicks.color} stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorImpressions" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={chartConfig.impressions.color} stopOpacity={0.1} />
                                <stop offset="95%" stopColor={chartConfig.impressions.color} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.2} />
                        <XAxis 
                            dataKey="date" 
                            tickFormatter={(value) => {
                                return new Date(value).toLocaleDateString("en-US", {
                                    month: "short",
                                    year: "2-digit"
                                });
                            }} 
                            axisLine={false}
                            tickLine={false}
                            padding={{ left: 10, right: 10 }}
                        />
                        <YAxis 
                            yAxisId="left" 
                            axisLine={false} 
                            tickLine={false} 
                            width={30}
                            tickFormatter={(value) => value >= 1000 ? `${(value/1000).toFixed(0)}k` : value}
                        />
                        <YAxis 
                            yAxisId="right" 
                            orientation="right"
                            axisLine={false} 
                            tickLine={false} 
                            width={55}
                            tickFormatter={(value) => value >= 1000 ? `${(value/1000).toFixed(0)}k` : value}
                        />
                        <Tooltip
                            formatter={(value, name) => [
                                name === "clicks" ? (value as number).toLocaleString() : ((value as number)/1000).toFixed(1) + "k", 
                                name === "clicks" ? "Clicks" : "Impressions"
                            ]}
                            labelFormatter={(value) => new Date(value).toLocaleDateString("en-US", {
                                month: "long",
                                year: "numeric"
                            })}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="clicks" 
                            stroke={chartConfig.clicks.color}
                            fillOpacity={1}
                            fill="url(#colorClicks)"
                            strokeWidth={2}
                            yAxisId="left"
                            name={chartConfig.clicks.label}
                        />
                        <Area
                            type="monotone"
                            dataKey="impressions"
                            stroke={chartConfig.impressions.color}
                            fill="url(#colorImpressions)"
                            fillOpacity={0.3}
                            strokeWidth={1.5}
                            strokeDasharray="4 4"
                            yAxisId="right"
                            name={chartConfig.impressions.label}
                        />
                        <Legend />
                    </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Ad Spend Distribution</CardTitle>
                  <CardDescription>By platform</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="h-[300px] flex flex-col justify-between">
                    <ResponsiveContainer width="100%" height="70%">
                      <PieChart>
                        <Pie
                          data={platformData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="value"
                          nameKey="name"
                        >
                          {platformData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => [`₹${value.toLocaleString()}`]} 
                          labelFormatter={(value) => value}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    
                    <div className="grid grid-cols-2 gap-2">
                      {adPlatforms.map((platform, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: platform.color }} 
                          />
                          <span className="text-xs">{platform.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {performanceMetrics.map((metric, index) => (
                <Card key={index} className="shadow-sm">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-base font-medium">{metric.title}</CardTitle>
                      <div className={`p-1.5 rounded-full ${
                        metric.status === "success" ? "bg-emerald-100" : "bg-amber-100"
                      }`}>
                        <metric.icon className={`h-4 w-4 ${
                          metric.status === "success" ? "text-emerald-600" : "text-amber-600"
                        }`} />
                      </div>
                    </div>
                    <CardDescription>{metric.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-2xl font-bold">{metric.value}</div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span>Current</span>
                          <span>Target: {metric.target}</span>
                        </div>
                        <Progress 
                          value={(metric.current / metric.target) * 100} 
                          className="h-1.5"
                          // The Progress component doesn't accept indicatorClassName
                          // We can use CSS variables or custom styling approach instead
                          style={{
                            "--progress-foreground": metric.status === "success" ? "hsl(142, 76%, 36%)" : "hsl(38, 92%, 50%)"
                          } as React.CSSProperties}
                        />
                      </div>
                      <div className="text-xs text-muted-foreground flex gap-1.5 items-center">
                        {metric.status === "success" ? (
                          <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                        ) : (
                          <AlertCircle className="h-3.5 w-3.5 text-amber-600" />
                        )}
                        {metric.suggestion}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Top Campaigns */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-medium">Top Performing Campaigns</CardTitle>
                <CardDescription>Based on ROAS</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {adCampaigns
                    .filter(campaign => campaign.status === "Active")
                    .sort((a, b) => b.roas - a.roas)
                    .slice(0, 3)
                    .map((campaign) => (
                      <Card key={campaign.id} className="border shadow-none">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start gap-2">
                            <CardTitle className="text-sm font-medium">{campaign.name}</CardTitle>
                            <Badge className={campaign.badgeColor}>{campaign.status}</Badge>
                          </div>
                          <CardDescription>{campaign.platform}</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                            <div>
                              <p className="text-muted-foreground text-xs">ROAS</p>
                              <p className="font-medium">{campaign.roas}x</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground text-xs">Spent</p>
                              <p className="font-medium">₹{campaign.spend.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground text-xs">CTR</p>
                              <p className="font-medium">{campaign.ctr}%</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground text-xs">CPC</p>
                              <p className="font-medium">₹{campaign.cpc}</p>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="pt-0">
                          <Button variant="ghost" size="sm" className="w-full">
                            View Details
                          </Button>
                        </CardFooter>
                      </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Campaigns Tab */}
          <TabsContent value="campaigns" className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex gap-3 w-full md:w-auto">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search campaigns..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 min-w-[240px]"
                  />
                </div>
                <Select value={platformFilter} onValueChange={setPlatformFilter}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="All Platforms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Platforms</SelectItem>
                    <SelectItem value="Google Ads">Google Ads</SelectItem>
                    <SelectItem value="Meta Ads">Meta Ads</SelectItem>
                    <SelectItem value="Tiktok Ads">Tiktok Ads</SelectItem>
                    <SelectItem value="YouTube Ads">YouTube Ads</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button>New Campaign</Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create New Campaign</DialogTitle>
                  </DialogHeader>
                  <div className="py-4">
                    <p className="text-muted-foreground text-sm">
                      This feature will be available soon. Contact your account manager to set up new campaigns.
                    </p>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredCampaigns.map(campaign => (
                <Card key={campaign.id} className="shadow-sm">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-base font-medium">{campaign.name}</CardTitle>
                      <Badge className={campaign.badgeColor}>{campaign.status}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{campaign.platform}</Badge>
                      <Badge variant="outline">{campaign.objective}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2 space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs text-muted-foreground">Budget</p>
                        <p className="font-medium">₹{campaign.budget.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Spent</p>
                        <p className="font-medium">₹{campaign.spend.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Remaining</p>
                        <p className="font-medium">₹{(campaign.budget - campaign.spend).toLocaleString()}</p>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Spend Progress</span>
                        <span>{Math.round((campaign.spend / campaign.budget) * 100)}%</span>
                      </div>
                      <Progress value={(campaign.spend / campaign.budget) * 100} className="h-1.5" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Clicks</p>
                        <p className="font-medium">{campaign.clicks.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Impressions</p>
                        <p className="font-medium">{campaign.impressions.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">CTR</p>
                        <p className="font-medium">{campaign.ctr}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">ROAS</p>
                        <p className="font-medium">{campaign.roas}x</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>
                        {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-1 grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm">
                      <Settings className="h-3.5 w-3.5 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="text-emerald-600">
                      <ArrowRight className="h-3.5 w-3.5 mr-1" />
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {filteredCampaigns.length === 0 && (
              <div className="text-center py-12">
                <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-1">No campaigns found</h3>
                <p className="text-muted-foreground text-sm">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            {/* Platform Performance */}
            <Card className="shadow-sm">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-base font-medium">Platform Performance</CardTitle>
                    <CardDescription>Compare metrics across advertising platforms</CardDescription>
                  </div>
                  <Select defaultValue="roas">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select metric" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="roas">ROAS</SelectItem>
                      <SelectItem value="ctr">CTR</SelectItem>
                      <SelectItem value="cpc">CPC</SelectItem>
                      <SelectItem value="spend">Spend</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={adPlatforms}
                    margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
                  >
                    <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.2} />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false}
                      tickLine={false}
                      padding={{ left: 10, right: 10 }}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      width={40}
                    />
                    <Tooltip 
                      formatter={(value, name) => [value, name === "roas" ? "ROAS" : name]}
                    />
                    <Bar 
                      dataKey="roas" 
                      name="ROAS" 
                      radius={[4, 4, 0, 0]}
                    >
                      {adPlatforms.map((platform, index) => (
                        <Cell key={`cell-${index}`} fill={platform.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Performance Metrics Table */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-medium">Detailed Platform Metrics</CardTitle>
                <CardDescription>Last 30 days data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-sm">Platform</th>
                        <th className="text-right py-3 px-4 font-medium text-sm">Spend</th>
                        <th className="text-right py-3 px-4 font-medium text-sm">Clicks</th>
                        <th className="text-right py-3 px-4 font-medium text-sm">Impressions</th>
                        <th className="text-right py-3 px-4 font-medium text-sm">CTR</th>
                        <th className="text-right py-3 px-4 font-medium text-sm">CPC</th>
                        <th className="text-right py-3 px-4 font-medium text-sm">ROAS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adPlatforms.map((platform, i) => (
                        <tr key={i} className="border-b">
                          <td className="py-3 px-4 flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: platform.color }} 
                            />
                            {platform.name}
                          </td>
                          <td className="text-right py-3 px-4">₹{platform.spend.toLocaleString()}</td>
                          <td className="text-right py-3 px-4">{platform.clicks.toLocaleString()}</td>
                          <td className="text-right py-3 px-4">{platform.impressions.toLocaleString()}</td>
                          <td className="text-right py-3 px-4">{platform.ctr}%</td>
                          <td className="text-right py-3 px-4">₹{platform.cpc}</td>
                          <td className="text-right py-3 px-4">{platform.roas}x</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t">
                        <td className="py-3 px-4 font-medium">Total</td>
                        <td className="text-right py-3 px-4 font-medium">
                          ₹{adPlatforms.reduce((sum, p) => sum + p.spend, 0).toLocaleString()}
                        </td>
                        <td className="text-right py-3 px-4 font-medium">
                          {adPlatforms.reduce((sum, p) => sum + p.clicks, 0).toLocaleString()}
                        </td>
                        <td className="text-right py-3 px-4 font-medium">
                          {adPlatforms.reduce((sum, p) => sum + p.impressions, 0).toLocaleString()}
                        </td>
                        <td className="text-right py-3 px-4 font-medium">
                          {(adPlatforms.reduce((sum, p) => sum + p.clicks, 0) / 
                            adPlatforms.reduce((sum, p) => sum + p.impressions, 0) * 100).toFixed(2)}%
                        </td>
                        <td className="text-right py-3 px-4 font-medium">
                          ₹{(adPlatforms.reduce((sum, p) => sum + p.spend, 0) / 
                             adPlatforms.reduce((sum, p) => sum + p.clicks, 0)).toFixed(2)}
                        </td>
                        <td className="text-right py-3 px-4 font-medium">
                          {(adPlatforms.reduce((sum, p) => sum + p.roas * p.spend, 0) / 
                            adPlatforms.reduce((sum, p) => sum + p.spend, 0)).toFixed(2)}x
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* CTR Trend Chart */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-medium">CTR Trend</CardTitle>
                <CardDescription>Click-through rate over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={adPerformanceData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.2} />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => {
                        return new Date(value).toLocaleDateString("en-US", {
                          month: "short",
                          year: "2-digit"
                        });
                      }} 
                      axisLine={false}
                      tickLine={false}
                      padding={{ left: 10, right: 10 }}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      width={30}
                      domain={['dataMin', 'dataMax']}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip
                      formatter={(value) => [`${value}%`, "CTR"]}
                      labelFormatter={(value) => new Date(value).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric"
                      })}
                      contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '6px', border: '1px solid #e2e8f0' }}
                      itemStyle={{ color: '#0ea5e9' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="ctr" 
                      stroke="#0ea5e9" 
                      strokeWidth={2}
                      dot={{ fill: "#0ea5e9", strokeWidth: 2, stroke: "#0ea5e9", r: 4 }}
                      activeDot={{ fill: "#0284c7", stroke: "#0284c7", r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            {/* AI Insights */}
            <Card className="shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Wand2 className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base font-medium">AI-Powered Recommendations</CardTitle>
                </div>
                <CardDescription>Smart actions to optimize your campaigns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {smartActions.map((action) => (
                    <Card key={action.id} className="py-3 gap-3 shadow-none border">
                      <CardHeader className="">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex items-center gap-2">
                            <div className={`p-1.5 rounded-full ${
                              action.impact === "high" 
                                ? "bg-emerald-100" 
                                : "bg-amber-100"
                            }`}>
                              <Sparkle className={`h-4 w-4 ${
                                action.impact === "high" 
                                  ? "text-emerald-600" 
                                  : "text-amber-600"
                              }`} />
                            </div>
                            <CardTitle className="text-base font-medium">{action.title}</CardTitle>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {action.platform}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="">
                        <p className="text-sm text-muted-foreground">{action.description}</p>
                      </CardContent>
                      <CardFooter className="pt-0 flex justify-between items-center">
                        <Badge variant="secondary" className="font-normal">
                          {action.category}
                        </Badge>
                        <Button size="sm">Apply Action</Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

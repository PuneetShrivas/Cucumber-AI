"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { 
  SparkleIcon, 
  TrendingUpIcon, 
  TrendingDownIcon, 
  SearchIcon, 
  ExternalLinkIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  UsersIcon,
  EyeIcon,
  MousePointerClickIcon,
  StarIcon,
  MapPinIcon,
  PhoneIcon,
  CalendarIcon,
  BarChart3Icon,
  LineChartIcon,
  PieChartIcon,
  RefreshCwIcon,
  SettingsIcon,
  DownloadIcon,
  FilterIcon,
  PlusIcon,
  EditIcon,
  TrashIcon,
  LinkIcon,
  FileTextIcon,
  ImageIcon,
  VideoIcon,
  GlobeIcon,
  SmartphoneIcon,
  TabletIcon,
  MonitorIcon,
  WifiIcon,
  ZapIcon,
  ShieldCheckIcon,
  AlertCircleIcon
} from "lucide-react"

const overviewMetrics = {
  organicSessions: 45230,
  organicSessionsChange: 12.5,
  newUsersPct: 68,
  newUsersChange: -2.1,
  avgPosition: 6.8,
  avgPositionChange: -1.2,
  ctr: 5.8,
  ctrChange: 0.8,
  bounceRate: 48,
  bounceRateChange: -3.2,
  conversions: 485,
  conversionsChange: 18.7,
  revenue: 28450,
  revenueChange: 22.3,
  avgSessionDuration: "3:42"
}

const keywordData = [
  { id: 1, kw: "best restaurant in bangalore", rank: 3, prevRank: 5, volume: 8900, difficulty: 68, cpc: 2.45, intent: "Commercial", category: "General" },
  { id: 2, kw: "biryani near me", rank: 2, prevRank: 2, volume: 12400, difficulty: 45, cpc: 1.89, intent: "Local", category: "Food" },
  { id: 3, kw: "fine dining bangalore", rank: 8, prevRank: 6, volume: 3200, difficulty: 72, cpc: 3.21, intent: "Commercial", category: "Dining" },
  { id: 4, kw: "authentic indian cuisine", rank: 5, prevRank: 7, volume: 5600, difficulty: 58, cpc: 2.15, intent: "Informational", category: "Cuisine" },
  { id: 5, kw: "romantic dinner bangalore", rank: 4, prevRank: 3, volume: 2800, difficulty: 62, cpc: 2.89, intent: "Commercial", category: "Experience" },
  { id: 6, kw: "restaurant delivery koramangala", rank: 1, prevRank: 1, volume: 1900, difficulty: 35, cpc: 1.45, intent: "Local", category: "Delivery" },
  { id: 7, kw: "south indian restaurant", rank: 6, prevRank: 8, volume: 7800, difficulty: 55, cpc: 1.98, intent: "Commercial", category: "Cuisine" },
  { id: 8, kw: "birthday party venue bangalore", rank: 12, prevRank: 15, volume: 4200, difficulty: 68, cpc: 3.45, intent: "Commercial", category: "Events" },
  { id: 9, kw: "vegan restaurant options", rank: 7, prevRank: 9, volume: 2100, difficulty: 48, cpc: 2.12, intent: "Commercial", category: "Dietary" },
  { id: 10, kw: "buffet lunch bangalore", rank: 9, prevRank: 11, volume: 3800, difficulty: 52, cpc: 2.67, intent: "Commercial", category: "Dining" }
]

const backlinkData = {
  total: 1248,
  referring: 342,
  new: 45,
  lost: 12,
  domains: [
    { domain: "zomato.com", links: 8, authority: 92, type: "Dofollow", status: "Active" },
    { domain: "swiggy.com", links: 5, authority: 89, type: "Dofollow", status: "Active" },
    { domain: "timesofindia.com", links: 3, authority: 85, type: "Dofollow", status: "Active" },
    { domain: "bangaloremirror.com", links: 2, authority: 72, type: "Dofollow", status: "Active" },
    { domain: "foodblogger.in", links: 12, authority: 45, type: "Dofollow", status: "Active" },
    { domain: "localguide.bangalore", links: 6, authority: 38, type: "Dofollow", status: "Active" },
    { domain: "restaurantreview.com", links: 4, authority: 62, type: "Dofollow", status: "Lost" },
    { domain: "dineout.co.in", links: 7, authority: 68, type: "Dofollow", status: "Active" }
  ]
}

const technicalIssues = [
  { id: 1, type: "Error", issue: "Mobile Usability Issues", affected: 12, priority: "High", status: "Open" },
  { id: 2, type: "Warning", issue: "Slow Loading Images", affected: 8, priority: "Medium", status: "In Progress" },
  { id: 3, type: "Error", issue: "Missing Alt Tags", affected: 23, priority: "Medium", status: "Open" },
  { id: 4, type: "Info", issue: "Meta Description Length", affected: 5, priority: "Low", status: "Resolved" },
  { id: 5, type: "Warning", issue: "Duplicate Title Tags", affected: 3, priority: "High", status: "Open" },
  { id: 6, type: "Error", issue: "Broken Internal Links", affected: 7, priority: "Medium", status: "In Progress" }
]

const contentPages = [
  { id: 1, url: "/menu", title: "Our Menu", visits: 12800, avgTime: "4:15", bounce: 35, conversions: 89, lastUpdated: "2 days ago", status: "Optimized", type: "Page" },
  { id: 2, url: "/about", title: "About Us", visits: 8200, avgTime: "2:30", bounce: 52, conversions: 23, lastUpdated: "1 week ago", status: "Needs Update", type: "Page" },
  { id: 3, url: "/location", title: "Find Us", visits: 6800, avgTime: "1:45", bounce: 48, conversions: 45, lastUpdated: "3 days ago", status: "Optimized", type: "Page" },
  { id: 4, url: "/blog/best-biryani-bangalore", title: "Best Biryani in Bangalore", visits: 4200, avgTime: "3:20", bounce: 42, conversions: 12, lastUpdated: "5 days ago", status: "Good", type: "Blog" },
  { id: 5, url: "/reservations", title: "Make a Reservation", visits: 9800, avgTime: "2:15", bounce: 28, conversions: 156, lastUpdated: "1 day ago", status: "Optimized", type: "Page" },
  { id: 6, url: "/catering", title: "Catering Services", visits: 3400, avgTime: "3:45", bounce: 45, conversions: 34, lastUpdated: "1 week ago", status: "Needs Update", type: "Page" },
  { id: 7, url: "/blog/south-indian-cuisine-guide", title: "South Indian Cuisine Guide", visits: 2800, avgTime: "5:20", bounce: 38, conversions: 8, lastUpdated: "2 weeks ago", status: "Good", type: "Blog" },
  { id: 8, url: "/events", title: "Private Events", visits: 5600, avgTime: "2:50", bounce: 41, conversions: 67, lastUpdated: "4 days ago", status: "Good", type: "Page" }
]

const localSeoData = {
  googleMyBusiness: {
    rating: 4.6,
    reviews: 1248,
    photos: 156,
    posts: 23,
    views: 45600,
    searches: 12400,
    directSearches: 8900,
    discoverySearches: 3500
  },
  citations: [
    { platform: "Google My Business", status: "Verified", accuracy: 100 },
    { platform: "Zomato", status: "Verified", accuracy: 95 },
    { platform: "Swiggy", status: "Verified", accuracy: 98 },
    { platform: "Yelp", status: "Pending", accuracy: 85 },
    { platform: "TripAdvisor", status: "Verified", accuracy: 92 },
    { platform: "JustDial", status: "Verified", accuracy: 88 }
  ]
}

const competitorData = [
  { name: "Coastal Curry", avgPosition: 4.2, backlinks: 892, traffic: 38200, budget: "High" },
  { name: "Spice Garden", avgPosition: 5.8, backlinks: 654, traffic: 29800, budget: "Medium" },
  { name: "Royal Dine", avgPosition: 7.1, backlinks: 423, traffic: 18900, budget: "Low" },
  { name: "Food Paradise", avgPosition: 6.3, backlinks: 756, traffic: 34500, budget: "High" }
]

export default function SEOManagementDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchKeyword, setSearchKeyword] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [selectedPeriod, setSelectedPeriod] = useState("30d")

  const getChangeIcon = (change: any) => {
    if (change > 0) return <TrendingUpIcon className="h-4 w-4 text-green-600" />
    if (change < 0) return <TrendingDownIcon className="h-4 w-4 text-red-600" />
    return null
  }

  const getChangeColor = (change: any) => {
    if (change > 0) return "text-green-600"
    if (change < 0) return "text-red-600"
    return "text-muted-foreground"
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "destructive" | "secondary" | "outline" | "default"> = {
      "Active": "default",
      "Lost": "destructive",
      "Optimized": "default",
      "Good": "secondary",
      "Needs Update": "destructive",
      "Open": "destructive",
      "In Progress": "secondary",
      "Resolved": "default",
      "Verified": "default",
      "Pending": "secondary"
    }
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>
  }

  const getPriorityBadge = (priority: any) => {
    const variants: Record<string, "destructive" | "secondary" | "outline" | "default"> = {
      "High": "destructive",
      "Medium": "secondary", 
      "Low": "outline"
    }
    return <Badge variant={variants[priority]}>{priority}</Badge>
  }

  const filteredKeywords = keywordData.filter(k => 
    k.kw.toLowerCase().includes(searchKeyword.toLowerCase()) &&
    (selectedFilter === "all" || k.category.toLowerCase() === selectedFilter)
  )

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">SEO Management Dashboard</h1>
          <p className="text-muted-foreground">Monitor and optimize your restaurant`&apos;`s search presence</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <DownloadIcon className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button variant="outline" size="sm">
            <SettingsIcon className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button>
            <SparkleIcon className="mr-2 h-4 w-4" />
            AI Recommendations
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 lg:grid-cols-6 w-full bg-background/90 dark:shadow-sm dark:shadow-gray-900/">
          {[
            { key: "overview", label: "Overview", icon: BarChart3Icon },
            { key: "keywords", label: "Keywords", icon: SearchIcon },
            { key: "backlinks", label: "Backlinks", icon: LinkIcon },
            { key: "technical", label: "Technical", icon: SettingsIcon },
            { key: "content", label: "Content", icon: FileTextIcon },
            { key: "local", label: "Local SEO", icon: MapPinIcon }
          ].map(({ key, label, icon: Icon }) => (
            <TabsTrigger  key={key} value={key} className="flex items-center gap-2data-[state=active]:shadow-sm data-[state=active]:bg-card dark:data-[state=active]:bg-card/90 dark:hover:bg-muted/30 transition-all">
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Organic Sessions", value: overviewMetrics.organicSessions.toLocaleString(), change: overviewMetrics.organicSessionsChange, icon: UsersIcon },
              { title: "Average Position", value: overviewMetrics.avgPosition, change: overviewMetrics.avgPositionChange, icon: TrendingUpIcon },
            //   { title: "Click-Through Rate", value: `${overviewMetrics.ctr}%`, change: overviewMetrics.ctrChange, icon: MousePointerClickIcon },
            //   { title: "Conversions", value: overviewMetrics.conversions, change: overviewMetrics.conversionsChange, icon: StarIcon },
            //   { title: "Revenue", value: `$${overviewMetrics.revenue.toLocaleString()}`, change: overviewMetrics.revenueChange, icon: BarChart3Icon },
            //   { title: "Bounce Rate", value: `${overviewMetrics.bounceRate}%`, change: overviewMetrics.bounceRateChange, icon: TrendingDownIcon },
              { title: "New Users", value: `${overviewMetrics.newUsersPct}%`, change: overviewMetrics.newUsersChange, icon: UsersIcon },
              { title: "Avg. Session Duration", value: overviewMetrics.avgSessionDuration, change: 0, icon: ClockIcon }
            ].map((metric, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                  <metric.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metric.value}</div>
                  {metric.change !== 0 && (
                    <div className={`flex items-center gap-1 text-xs ${getChangeColor(metric.change)}`}>
                      {getChangeIcon(metric.change)}
                      <span>{Math.abs(metric.change)}% from last month</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Keywords</CardTitle>
                <CardDescription>Your best ranking keywords this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {keywordData.slice(0, 5).map(kw => (
                    <div key={kw.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium text-sm">{kw.kw}</div>
                        <div className="text-xs text-muted-foreground">Volume: {kw.volume.toLocaleString()}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        {kw.rank < kw.prevRank && <TrendingUpIcon className="h-3 w-3 text-green-600" />}
                        <Badge variant="outline">#{kw.rank}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Competitor Analysis</CardTitle>
                <CardDescription>How you compare to competitors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {competitorData.map((comp, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium text-sm">{comp.name}</div>
                        <div className="text-xs text-muted-foreground">Traffic: {comp.traffic.toLocaleString()}</div>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <Badge variant={comp.budget === "High" ? "destructive" : comp.budget === "Medium" ? "secondary" : "outline"}>{comp.budget}</Badge>
                        <span>Pos: {comp.avgPosition}</span>
                        <span>Links: {comp.backlinks}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Keywords Tab */}
        <TabsContent value="keywords" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input 
                placeholder="Search keywords..." 
                value={searchKeyword} 
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <div className="flex gap-2">
              <select 
                value={selectedFilter} 
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="all">All Categories</option>
                <option value="general">General</option>
                <option value="food">Food</option>
                <option value="dining">Dining</option>
                <option value="cuisine">Cuisine</option>
                <option value="experience">Experience</option>
                <option value="delivery">Delivery</option>
                <option value="events">Events</option>
                <option value="dietary">Dietary</option>
              </select>
              <Button>
                <PlusIcon className="mr-2 h-4 w-4" />
                Add Keyword
              </Button>
            </div>
          </div>

          <ScrollArea className="h-[600px]">
            <div className="space-y-3">
              {filteredKeywords.map(kw => (
                <Card key={kw.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="space-y-2">
                        <div className="font-medium">{kw.kw}</div>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span>Volume: {kw.volume.toLocaleString()}</span>
                          <span>Difficulty: {kw.difficulty}%</span>
                          <span>CPC: ${kw.cpc}</span>
                          <span>Intent: {kw.intent}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary">{kw.category}</Badge>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">#{kw.rank}</Badge>
                          <div className="flex items-center gap-1 text-sm">
                            {kw.rank < kw.prevRank ? (
                              <>
                                <TrendingUpIcon className="h-4 w-4 text-green-600" />
                                <span className="text-green-600">+{kw.prevRank - kw.rank}</span>
                              </>
                            ) : kw.rank > kw.prevRank ? (
                              <>
                                <TrendingDownIcon className="h-4 w-4 text-red-600" />
                                <span className="text-red-600">-{kw.rank - kw.prevRank}</span>
                              </>
                            ) : (
                              <span className="text-muted-foreground">No change</span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline">
                            <EditIcon className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <TrashIcon className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Backlinks Tab */}
        <TabsContent value="backlinks" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Total Backlinks", value: backlinkData.total, icon: LinkIcon },
              { title: "Referring Domains", value: backlinkData.referring, icon: GlobeIcon },
              { title: "New This Month", value: backlinkData.new, icon: TrendingUpIcon },
              { title: "Lost This Month", value: backlinkData.lost, icon: TrendingDownIcon }
            ].map((metric, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                  <metric.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metric.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top Referring Domains</CardTitle>
              <CardDescription>Domains linking to your website</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {backlinkData.domains.map((domain, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <div className="font-medium flex items-center gap-2">
                          <GlobeIcon className="h-4 w-4" />
                          {domain.domain}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {domain.links} links • Authority: {domain.authority} • {domain.type}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(domain.status)}
                        <Button size="sm" variant="outline">
                          <ExternalLinkIcon className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Technical Tab */}
        <TabsContent value="technical" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ZapIcon className="h-5 w-5" />
                  Core Web Vitals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { metric: "Largest Contentful Paint", value: "2.1s", status: "Good" },
                  { metric: "First Input Delay", value: "89ms", status: "Good" },
                  { metric: "Cumulative Layout Shift", value: "0.08", status: "Needs Improvement" }
                ].map((vital, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm">{vital.metric}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{vital.value}</span>
                      {getStatusBadge(vital.status)}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheckIcon className="h-5 w-5" />
                  Security & HTTPS
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { check: "SSL Certificate", status: "Active" },
                  { check: "HTTPS Redirect", status: "Active" },
                  { check: "Mixed Content", status: "Resolved" },
                  { check: "Security Headers", status: "Good" }
                ].map((security, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm">{security.check}</span>
                    {getStatusBadge(security.status)}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <WifiIcon className="h-5 w-5" />
                  Mobile Optimization
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { device: "Mobile", score: 92, icon: SmartphoneIcon },
                  { device: "Tablet", score: 96, icon: TabletIcon },
                  { device: "Desktop", score: 98, icon: MonitorIcon }
                ].map((device, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <device.icon className="h-4 w-4" />
                      <span className="text-sm">{device.device}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{device.score}/100</span>
                      {device.score >= 90 ? (
                        <CheckCircleIcon className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertTriangleIcon className="h-4 w-4 text-yellow-600" />
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Technical Issues</CardTitle>
              <CardDescription>Issues found during the last crawl</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <div className="space-y-3">
                  {technicalIssues.map(issue => (
                    <div key={issue.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {issue.type === "Error" && <XCircleIcon className="h-5 w-5 text-red-600" />}
                        {issue.type === "Warning" && <AlertTriangleIcon className="h-5 w-5 text-yellow-600" />}
                        {issue.type === "Info" && <AlertCircleIcon className="h-5 w-5 text-blue-600" />}
                        <div>
                          <div className="font-medium text-sm">{issue.issue}</div>
                          <div className="text-xs text-muted-foreground">{issue.affected} pages affected</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getPriorityBadge(issue.priority)}
                        {getStatusBadge(issue.status)}
                        <Button size="sm" variant="outline">Fix</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-6">
          {/* <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-lg font-semibold">Content Performance</h3>
              <p className="text-sm text-muted-foreground">Analyze and optimize your content for better SEO</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <FilterIcon className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button size="sm">
                <PlusIcon className="mr-2 h-4 w-4" />
                New Content
              </Button>
            </div>
          </div> */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            {[
              { title: "Total Pages", value: contentPages.length, icon: FileTextIcon },
              { title: "Avg. Page Views", value: Math.round(contentPages.reduce((acc, page) => acc + page.visits, 0) / contentPages.length).toLocaleString(), icon: EyeIcon },
              { title: "Avg. Time on Page", value: "3:12", icon: ClockIcon },
              { title: "Total Conversions", value: contentPages.reduce((acc, page) => acc + page.conversions, 0), icon: StarIcon }
            ].map((metric, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                  <metric.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metric.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Page Performance Analysis</CardTitle>
              <CardDescription>Detailed metrics for all your pages and content</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-4">
                  {contentPages.map(page => (
                    <Card key={page.id} className="border-l-4 border-l-primary/20">
                      <CardContent className="p-4">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              {page.type === "Blog" ? <FileTextIcon className="h-4 w-4" /> : <GlobeIcon className="h-4 w-4" />}
                              <span className="font-medium">{page.title}</span>
                              <Badge variant="outline">{page.type}</Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">{page.url}</div>
                            <div className="flex gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <EyeIcon className="h-3 w-3" />
                                {page.visits.toLocaleString()} visits
                              </span>
                              <span className="flex items-center gap-1">
                                <ClockIcon className="h-3 w-3" />
                                {page.avgTime} avg time
                              </span>
                              <span className="flex items-center gap-1">
                                <TrendingDownIcon className="h-3 w-3" />
                                {page.bounce}% bounce
                              </span>
                              <span className="flex items-center gap-1">
                                <StarIcon className="h-3 w-3" />
                                {page.conversions} conversions
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              {getStatusBadge(page.status)}
                              <div className="text-xs text-muted-foreground mt-1">
                                Updated {page.lastUpdated}
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button size="sm" variant="outline">
                                <RefreshCwIcon className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <EditIcon className="h-3 w-3" />
                              </Button>
                              <Button size="sm">
                                Optimize
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Content Ideas</CardTitle>
                <CardDescription>AI-suggested content opportunities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { title: "Best Vegetarian Dishes in Bangalore", difficulty: "Medium", potential: "High", keywords: 3 },
                    { title: "How to Make Authentic Biryani", difficulty: "Low", potential: "Medium", keywords: 5 },
                    { title: "Restaurant Hygiene Standards Guide", difficulty: "High", potential: "High", keywords: 2 },
                    { title: "Bangalore Food Festival Events", difficulty: "Medium", potential: "Medium", keywords: 4 }
                  ].map((idea, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-medium text-sm">{idea.title}</div>
                        <Button size="sm" variant="outline">Create</Button>
                      </div>
                      <div className="flex gap-2 text-xs">
                        <Badge variant="outline">Difficulty: {idea.difficulty}</Badge>
                        <Badge variant="outline">Potential: {idea.potential}</Badge>
                        <Badge variant="outline">{idea.keywords} keywords</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Content Optimization Tasks</CardTitle>
                <CardDescription>Recommended improvements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { task: "Update meta descriptions for menu pages", priority: "High", estimated: "2 hours" },
                    { task: "Add internal links to blog posts", priority: "Medium", estimated: "1 hour" },
                    { task: "Optimize images with alt tags", priority: "High", estimated: "3 hours" },
                    { task: "Create FAQ section for reservations", priority: "Medium", estimated: "1.5 hours" }
                  ].map((task, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium text-sm">{task.task}</div>
                        <div className="text-xs text-muted-foreground">Est. time: {task.estimated}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getPriorityBadge(task.priority)}
                        <Button size="sm" variant="outline">Start</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Local SEO Tab */}
        <TabsContent value="local" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPinIcon className="h-5 w-5" />
                  Google My Business
                </CardTitle>
                <CardDescription>Your local business presence</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 border rounded-lg">
                    <div className="text-2xl font-bold flex items-center justify-center gap-1">
                      <StarIcon className="h-5 w-5 text-yellow-500 fill-current" />
                      {localSeoData.googleMyBusiness.rating}
                    </div>
                    <div className="text-sm text-muted-foreground">Rating</div>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <div className="text-2xl font-bold">{localSeoData.googleMyBusiness.reviews.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Reviews</div>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <div className="text-2xl font-bold">{localSeoData.googleMyBusiness.photos}</div>
                    <div className="text-sm text-muted-foreground">Photos</div>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <div className="text-2xl font-bold">{localSeoData.googleMyBusiness.posts}</div>
                    <div className="text-sm text-muted-foreground">Posts</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Profile Views</span>
                    <span className="font-medium">{localSeoData.googleMyBusiness.views.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Search Queries</span>
                    <span className="font-medium">{localSeoData.googleMyBusiness.searches.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Direct Searches</span>
                    <span className="font-medium">{localSeoData.googleMyBusiness.directSearches.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Discovery Searches</span>
                    <span className="font-medium">{localSeoData.googleMyBusiness.discoverySearches.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Local Citations</CardTitle>
                <CardDescription>Your business listings across platforms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {localSeoData.citations.map((citation, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <GlobeIcon className="h-4 w-4" />
                        <div>
                          <div className="font-medium text-sm">{citation.platform}</div>
                          <div className="text-xs text-muted-foreground">Accuracy: {citation.accuracy}%</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(citation.status)}
                        <Button size="sm" variant="outline">
                          <ExternalLinkIcon className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Local Keywords Performance</CardTitle>
                <CardDescription>How you rank for location-based searches</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { keyword: "restaurants in Koramangala", rank: 2, volume: 3200 },
                    { keyword: "best food in Bangalore", rank: 8, volume: 8900 },
                    { keyword: "dining near MG Road", rank: 5, volume: 1800 },
                    { keyword: "Indian restaurant Indiranagar", rank: 3, volume: 2400 },
                    { keyword: "biryani delivery Whitefield", rank: 1, volume: 1200 }
                  ].map((kw, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium text-sm">{kw.keyword}</div>
                        <div className="text-xs text-muted-foreground">Volume: {kw.volume.toLocaleString()}</div>
                      </div>
                      <Badge variant="outline">#{kw.rank}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Local SEO Tasks</CardTitle>
                <CardDescription>Actions to improve local visibility</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { task: "Request more customer reviews", priority: "High", status: "Pending" },
                    { task: "Update business hours for holidays", priority: "Medium", status: "In Progress" },
                    { task: "Add more photos to GMB profile", priority: "Medium", status: "Pending" },
                    { task: "Respond to recent reviews", priority: "High", status: "Pending" },
                    { task: "Create local landing pages", priority: "Low", status: "Pending" }
                  ].map((task, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium text-sm">{task.task}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getPriorityBadge(task.priority)}
                        {getStatusBadge(task.status)}
                        <Button size="sm" variant="outline">Start</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Review Management</CardTitle>
              <CardDescription>Recent reviews and responses</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <div className="space-y-4">
                  {[
                    { 
                      platform: "Google", 
                      rating: 5, 
                      review: "Amazing biryani and excellent service! The ambiance is perfect for family dining.", 
                      author: "Priya S.", 
                      date: "2 days ago",
                      responded: true
                    },
                    { 
                      platform: "Zomato", 
                      rating: 4, 
                      review: "Good food quality but service was a bit slow. Overall decent experience.", 
                      author: "Rajesh K.", 
                      date: "5 days ago",
                      responded: false
                    },
                    { 
                      platform: "Google", 
                      rating: 5, 
                      review: "Best South Indian restaurant in Bangalore! Highly recommended.", 
                      author: "Meera L.", 
                      date: "1 week ago",
                      responded: true
                    },
                    { 
                      platform: "TripAdvisor", 
                      rating: 3, 
                      review: "Food was okay but the wait time was too long. Could be better.", 
                      author: "Anonymous", 
                      date: "1 week ago",
                      responded: false
                    }
                  ].map((review, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{review.platform}</Badge>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <StarIcon 
                                key={i} 
                                className={`h-3 w-3 ${i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                              />
                            ))}
                          </div>
                          <span className="text-sm font-medium">{review.author}</span>
                          <span className="text-xs text-muted-foreground">{review.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {review.responded ? (
                            <Badge variant="default">Responded</Badge>
                          ) : (
                            <Badge variant="destructive">Needs Response</Badge>
                          )}
                          <Button size="sm" variant="outline">
                            {review.responded ? "View" : "Respond"}
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{review.review}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
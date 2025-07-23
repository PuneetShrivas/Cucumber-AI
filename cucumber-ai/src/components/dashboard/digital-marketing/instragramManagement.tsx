"use client"
import React, { useState } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    SparkleIcon,
    UploadIcon,
    HeartIcon,
    MessageCircleIcon,
    ShareIcon,
    EyeIcon,
    TrendingUpIcon,
    CalendarIcon,
    ClockIcon,
    UsersIcon,
    BarChart3Icon,
    PlayIcon,
    PauseIcon,
    EditIcon,
    TrashIcon,
    MoreHorizontalIcon,
    ImageIcon,
    VideoIcon,
    MapPinIcon,
    HashIcon,
    AtSignIcon,
    SendIcon,
    BookmarkIcon,
    DownloadIcon,
    FilterIcon,
    SearchIcon,
    PlusIcon,
    SettingsIcon,
    BellIcon,
    StarIcon,
    ThumbsUpIcon,
    MessageSquareIcon,
    RepeatIcon,
    ExternalLinkIcon,
    TrendingUp,
} from "lucide-react"
import { Star, Heart, MessageCircle, Share2, Eye, Calendar, Clock, Users, BarChart3, Plus, Filter, Search, MoreHorizontal, Play, Image, FileText, Send, ThumbsUp, ThumbsDown, MessageSquare, Bookmark, Edit, Trash2 } from "lucide-react"


import { CartesianGrid, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, LineChart, } from 'recharts';

const postsData = [
    { id: 1, platform: "instagram", type: "image", title: "New Menu Launch", content: "Introducing our seasonal special menu with authentic flavors!", likes: 245, comments: 32, shares: 18, views: 1200, date: "2025-07-20", status: "published", engagement: 8.2, image: "🍛", scheduled: false },
    { id: 2, platform: "facebook", type: "text", title: "Weekend Special Offer", content: "Get 20% off on all orders this weekend! Use code WEEKEND20", likes: 189, comments: 45, shares: 67, views: 890, date: "2025-07-19", status: "published", engagement: 12.4, image: "🎉", scheduled: false },
    { id: 3, platform: "twitter", type: "text", title: "Customer Appreciation", content: "Thank you to all our amazing customers for making us the #1 rated restaurant in the city!", likes: 156, comments: 23, shares: 89, views: 2300, date: "2025-07-18", status: "published", engagement: 11.7, image: "🏆", scheduled: false },
    { id: 4, platform: "linkedin", type: "image", title: "Behind the Scenes", content: "Meet our talented chefs who create magic in the kitchen every day!", likes: 78, comments: 12, shares: 34, views: 560, date: "2025-07-17", status: "published", engagement: 6.8, image: "👨‍🍳", scheduled: false },
    { id: 5, platform: "instagram", type: "carousel", title: "Recipe Tutorial", content: "Step-by-step guide to make our famous butter chicken at home!", likes: 456, comments: 78, shares: 123, views: 3400, date: "2025-07-16", status: "scheduled", engagement: 15.3, image: "📸", scheduled: true },
    { id: 6, platform: "facebook", type: "video", title: "Live Cooking Session", content: "Join our head chef for a live cooking demonstration this Friday at 7 PM!", likes: 234, comments: 56, shares: 89, views: 1800, date: "2025-07-15", status: "draft", engagement: 9.6, image: "🎥", scheduled: false }
]

const reelsData = [
    { id: 1, platform: "instagram", title: "Quick Biryani Recipe", content: "30-second recipe for perfect biryani!", views: 45600, likes: 2340, comments: 156, shares: 234, saves: 890, date: "2025-07-20", status: "published", engagement: 18.2, duration: 30, trending: true },
    { id: 2, platform: "youtube", title: "Food Preparation Behind Scenes", content: "Watch how we prepare fresh ingredients daily", views: 23400, likes: 1230, comments: 89, shares: 167, saves: 445, date: "2025-07-19", status: "published", engagement: 14.6, duration: 45, trending: false },
    { id: 3, platform: "tiktok", title: "Spice Mixing Technique", content: "Secret spice blend that makes our food special!", views: 67800, likes: 4560, comments: 234, shares: 567, saves: 1200, date: "2025-07-18", status: "published", engagement: 22.4, duration: 25, trending: true },
    { id: 4, platform: "instagram", title: "Customer Reactions", content: "Real reactions from our happy customers!", views: 34500, likes: 1890, comments: 112, shares: 234, saves: 567, date: "2025-07-17", status: "published", engagement: 16.8, duration: 35, trending: false },
    { id: 5, platform: "youtube", title: "Kitchen Tour", content: "Take a virtual tour of our modern kitchen facilities", views: 18900, likes: 890, comments: 67, shares: 123, saves: 234, date: "2025-07-16", status: "scheduled", engagement: 12.3, duration: 60, trending: false }
]

const storiesData = [
    { id: 1, platform: "instagram", type: "image", content: "Daily special: Chicken Tikka Masala", views: 1240, likes: 89, replies: 12, date: "2025-07-20", status: "active", expires: "2025-07-21", engagement: 8.1, image: "🍛" },
    { id: 2, platform: "facebook", type: "video", content: "Live from the kitchen - preparing fresh naan", views: 890, likes: 67, replies: 8, date: "2025-07-20", status: "active", expires: "2025-07-21", engagement: 9.2, image: "🎥" },
    { id: 3, platform: "snapchat", type: "image", content: "Happy customers enjoying their meal", views: 567, likes: 45, replies: 5, date: "2025-07-20", status: "active", expires: "2025-07-21", engagement: 7.8, image: "😊" },
    { id: 4, platform: "instagram", type: "poll", content: "What should be our next special dish?", views: 2100, likes: 156, replies: 34, date: "2025-07-19", status: "expired", expires: "2025-07-20", engagement: 12.4, image: "📊" },
    { id: 5, platform: "whatsapp", type: "text", content: "Order now for fast delivery!", views: 445, likes: 23, replies: 7, date: "2025-07-19", status: "expired", expires: "2025-07-20", engagement: 6.7, image: "📱" }
]



const generatePosts = (count: any) => Array.from({ length: count }).map((_, i) => ({
    id: i + 1,
    title: `Exploring the Beauty of Nature #${i + 1}`,
    description: `Captured this stunning moment during my recent adventure. The lighting was perfect and the scenery was breathtaking. Can't wait to share more from this incredible journey! 🌟`,
    image: `/api/placeholder/400/300?text=Post${i + 1}`,
    likes: Math.floor(Math.random() * 5000) + 500,
    comments: Math.floor(Math.random() * 800) + 50,
    shares: Math.floor(Math.random() * 300) + 20,
    saves: Math.floor(Math.random() * 1200) + 100,
    reach: Math.floor(Math.random() * 15000) + 2000,
    impressions: Math.floor(Math.random() * 25000) + 5000,
    engagementRate: `${(Math.random() * 8 + 2).toFixed(1)}%`,
    datePosted: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    timePosted: `${Math.floor(Math.random() * 12 + 1)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')} ${Math.random() > 0.5 ? 'AM' : 'PM'}`,
    hashtags: ['#nature', '#photography', '#adventure', '#travel', '#beautiful'],
    location: ['New York, NY', 'Los Angeles, CA', 'Miami, FL', 'Seattle, WA', 'Austin, TX'][Math.floor(Math.random() * 5)],
    status: ['Published', 'Scheduled', 'Draft'][Math.floor(Math.random() * 3)],
    type: 'photo'
}));

const MetricCard = ({ title, value, subtitle, icon: Icon, trend }: any) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
            {trend && (
                <div className="flex items-center text-xs text-green-600 mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {trend}
                </div>
            )}
        </CardContent>
    </Card>
)

const generateReels = (count: any) => Array.from({ length: count }).map((_, i) => ({
    id: i + 1,
    title: `Amazing Reel Experience #${i + 1}`,
    description: `Check out this incredible moment! This reel showcases the best of what we do. Amazing content that keeps viewers engaged.`,
    thumbnail: `/api/placeholder/300/400?text=Reel${i + 1}`,
    views: Math.floor(Math.random() * 50000) + 5000,
    likes: Math.floor(Math.random() * 8000) + 800,
    comments: Math.floor(Math.random() * 1200) + 100,
    shares: Math.floor(Math.random() * 500) + 50,
    saves: Math.floor(Math.random() * 2000) + 200,
    completionRate: `${(Math.random() * 40 + 60).toFixed(1)}%`,
    avgWatchTime: `${(Math.random() * 20 + 10).toFixed(1)}s`,
    reach: Math.floor(Math.random() * 35000) + 8000,
    plays: Math.floor(Math.random() * 60000) + 10000,
    datePosted: new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    duration: `${Math.floor(Math.random() * 25 + 5)}s`,
    hashtags: ['#reels', '#viral', '#trending', '#entertainment', '#fun'],
    location: ['Miami Beach, FL', 'Hollywood, CA', 'Brooklyn, NY', 'Venice, CA', 'South Beach, FL'][Math.floor(Math.random() * 5)],
    status: ['Published', 'Processing', 'Scheduled'][Math.floor(Math.random() * 3)],
    music: ['Original Audio', 'Trending Sound #1', 'Popular Beat', 'Acoustic Vibes'][Math.floor(Math.random() * 4)]
}));

const generateStories = (count: any) => Array.from({ length: count }).map((_, i) => ({
    id: i + 1,
    title: `Story Highlight ${i + 1}`,
    description: `Behind the scenes content that gives followers an authentic look into daily life and experiences.`,
    thumbnail: `/api/placeholder/200/300?text=Story${i + 1}`,
    views: Math.floor(Math.random() * 3000) + 300,
    replies: Math.floor(Math.random() * 150) + 10,
    exits: Math.floor(Math.random() * 200) + 20,
    tapsForward: Math.floor(Math.random() * 400) + 50,
    tapsBack: Math.floor(Math.random() * 100) + 5,
    shares: Math.floor(Math.random() * 80) + 5,
    reach: Math.floor(Math.random() * 2500) + 250,
    impressions: Math.floor(Math.random() * 3500) + 400,
    datePosted: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    timeActive: `${Math.floor(Math.random() * 20 + 4)}h remaining`,
    type: ['Photo', 'Video', 'Boomerang', 'Layout'][Math.floor(Math.random() * 4)],
    stickers: Math.floor(Math.random() * 5),
    polls: Math.floor(Math.random() * 2),
    questions: Math.floor(Math.random() * 3),
    location: ['Downtown', 'Office', 'Home', 'Cafe', 'Studio'][Math.floor(Math.random() * 5)]
}));

const chartData = [
    { date: 'Jan 1', followers: 105200, organic: 520, paid: 380 },
    { date: 'Jan 8', followers: 107800, organic: 480, paid: 420 },
    { date: 'Jan 15', followers: 110300, organic: 650, paid: 410 },
    { date: 'Jan 22', followers: 112100, organic: 700, paid: 380 },
    { date: 'Jan 29', followers: 114900, organic: 550, paid: 450 },
    { date: 'Feb 5', followers: 118200, organic: 680, paid: 520 },
    { date: 'Feb 12', followers: 120800, organic: 720, paid: 480 },
    { date: 'Feb 19', followers: 122400, organic: 650, paid: 400 },
    { date: 'Feb 26', followers: 124500, organic: 590, paid: 460 },
]

const analyticsPortedData = {

    totalPosts: postsData.length,
    totalReels: reelsData.length,
    totalStories: storiesData.length,
    totalEngagement: postsData.reduce((sum, post) => sum + post.likes + post.comments + post.shares, 0),
    avgEngagementRate: (postsData.reduce((sum, post) => sum + post.engagement, 0) / postsData.length).toFixed(1)
}

const analyticsData = {
    followers: {
        total: 124500,
        growth: '+2.3%',
        newToday: 156,
        unfollows: 23
    },
    engagement: {
        rate: '4.7%',
        totalLikes: 45600,
        totalComments: 8900,
        totalShares: 2100
    },
    reach: {
        total: 234000,
        growth: '+12.5%',
        organic: 198000,
        paid: 36000
    },
    demographics: {
        topCities: [
            { city: 'New York, NY', count: 18500 },
            { city: 'Los Angeles, CA', count: 16200 },
            { city: 'Chicago, IL', count: 12800 },
            { city: 'Houston, TX', count: 10500 },
            { city: 'Phoenix, AZ', count: 8900 }
        ],
        ageGroups: [
            { range: '18-24', percentage: 42 },
            { range: '25-34', percentage: 38 },
            { range: '35-44', percentage: 15 },
            { range: '45-54', percentage: 4 },
            { range: '55+', percentage: 1 }
        ],
        genderSplit: { male: 45, female: 53, other: 2 }
    }
};

export default function InstagramDashboard() {
    const [posts] = useState(generatePosts(12));
    const [reels] = useState(generateReels(9));
    const [stories] = useState(generateStories(8));
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedChannel, setSelectedChannel] = useState("all")
    const [selectedStatus, setSelectedStatus] = useState("all")

    const filterData = (data: any, type: any) => {
        return data.filter((item: any) => {
            const matchesSearch = item.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.name?.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesChannel = selectedChannel === "all" || item.channel === selectedChannel || item.platform === selectedChannel
            const matchesStatus = selectedStatus === "all" || item.status === selectedStatus || item.sentiment === selectedStatus
            return matchesSearch && matchesChannel && matchesStatus
        })
    }

    const StatCard = ({ title, value, change, icon: Icon, description }: { title: string; value: string; change: any; icon: any; description: string; }) => (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {change && (
                    <p className="text-xs text-muted-foreground">
                        <span className={change.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                            {change}
                        </span>
                        {description && ` ${description}`}
                    </p>
                )}
            </CardContent>
        </Card>
    );

    const PostCard = ({ post }:any) => (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{post.image}</div>
            <div>
              <CardTitle className="text-base">{post.title}</CardTitle>
              <CardDescription>
                {post.platform.charAt(0).toUpperCase() + post.platform.slice(1)} • {post.date}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={post.status === "published" ? "default" : post.status === "scheduled" ? "secondary" : "outline"}>
              {post.status}
            </Badge>
            {post.scheduled && <Clock className="h-4 w-4 text-muted-foreground" />}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm">{post.content}</p>
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div className="flex items-center space-x-1">
              <Heart className="h-4 w-4 text-red-500" />
              <span>{post.likes}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageCircle className="h-4 w-4 text-blue-500" />
              <span>{post.comments}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Share2 className="h-4 w-4 text-green-500" />
              <span>{post.shares}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye className="h-4 w-4 text-purple-500" />
              <span>{post.views}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Engagement Rate: {post.engagement}%
            </div>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline">
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button size="sm" variant="ghost">
                <BarChart3 className="h-4 w-4 mr-1" />
                Analytics
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const ReelCard = ({ reel }:any) => (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Play className="h-8 w-8 text-primary" />
              {reel.trending && (
                <TrendingUp className="h-3 w-3 text-orange-500 absolute -top-1 -right-1" />
              )}
            </div>
            <div>
              <CardTitle className="text-base">{reel.title}</CardTitle>
              <CardDescription>
                {reel.platform.charAt(0).toUpperCase() + reel.platform.slice(1)} • {reel.duration}s • {reel.date}
              </CardDescription>
            </div>
          </div>
          <Badge variant={reel.trending ? "default" : "secondary"}>
            {reel.trending ? "Trending" : "Normal"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm">{reel.content}</p>
          <div className="grid grid-cols-5 gap-2 text-sm">
            <div className="flex items-center space-x-1">
              <Eye className="h-4 w-4 text-purple-500" />
              <span>{(reel.views / 1000).toFixed(1)}k</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="h-4 w-4 text-red-500" />
              <span>{(reel.likes / 1000).toFixed(1)}k</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageCircle className="h-4 w-4 text-blue-500" />
              <span>{reel.comments}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Share2 className="h-4 w-4 text-green-500" />
              <span>{reel.shares}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Bookmark className="h-4 w-4 text-yellow-500" />
              <span>{reel.saves}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Engagement: {reel.engagement}%
            </div>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline">
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button size="sm" variant="ghost">
                <BarChart3 className="h-4 w-4 mr-1" />
                Analytics
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const StoryCard = ({ story }:any) => (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{story.image}</div>
            <div>
              <CardTitle className="text-base">Story</CardTitle>
              <CardDescription>
                {story.platform.charAt(0).toUpperCase() + story.platform.slice(1)} • {story.type}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={story.status === "active" ? "default" : "secondary"}>
              {story.status}
            </Badge>
            {story.status === "active" && (
              <div className="text-xs text-muted-foreground">
                Expires: {story.expires}
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm">{story.content}</p>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-1">
              <Eye className="h-4 w-4 text-purple-500" />
              <span>{story.views}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="h-4 w-4 text-red-500" />
              <span>{story.likes}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageSquare className="h-4 w-4 text-blue-500" />
              <span>{story.replies}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Engagement: {story.engagement}%
            </div>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline">
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
              {story.status === "expired" && (
                <Button size="sm" variant="ghost">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
    const CreateNewCard = ({ type, onClick }: { type: string; onClick: () => void }) => (
        <Card className="border-dashed border-2 border-muted-foreground hover:bg-muted/40 transition-all cursor-pointer" onClick={onClick}>
            <CardContent className="h-full min-h-[300px] flex flex-col justify-center items-center gap-4 text-center">
                <div className="p-4 rounded-full bg-muted">
                    <PlusIcon className="w-8 h-8 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                    <h3 className="font-semibold">Create New {type}</h3>
                    <p className="text-sm text-muted-foreground">
                        Start creating amazing content for your audience
                    </p>
                </div>
                <Button variant="outline">
                    <UploadIcon className="w-4 h-4 mr-2" />
                    Get Started
                </Button>
            </CardContent>
        </Card>
    );

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto p-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-bold">Creator Studio</h1>
                        <p className="text-muted-foreground mt-1">Manage your Instagram content and insights</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm">
                            <BellIcon className="h-4 w-4 mr-2" />
                            Notifications
                        </Button>
                        <Button variant="outline" size="sm">
                            <SettingsIcon className="h-4 w-4 mr-2" />
                            Settings
                        </Button>
                        <Button>
                            <SparkleIcon className="h-4 w-4 mr-2" />
                            AI Suggestions
                        </Button>
                    </div>
                </div>

                {/* Quick Stats */}
                {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        title="Total Followers"
                        value={analyticsData.followers.total.toLocaleString()}
                        change={analyticsData.followers.growth}
                        icon={UsersIcon}
                        description="vs last month"
                    />
                    <StatCard
                        title="Engagement Rate"
                        value={analyticsData.engagement.rate}
                        change="+0.3%"
                        icon={ThumbsUpIcon}
                        description="vs last week"
                    />
                    <StatCard
                        title="Total Reach"
                        value={analyticsData.reach.total.toLocaleString()}
                        change={analyticsData.reach.growth}
                        icon={TrendingUpIcon}
                        description="this month"
                    />
                    <StatCard
                        title="Content Published"
                        value="47"
                        change="+12"
                        icon={ImageIcon}
                        description="this month"
                    />
                </div> */}

                {/* Main Content Tabs */}
                <Tabs defaultValue="insights" className="w-full">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                        <TabsList className="grid w-full lg:w-auto grid-cols-4 lg:grid-cols-4  bg-background/90 dark:shadow-sm dark:shadow-gray-900/10">
                            <TabsTrigger value="insights" className="flex items-center gap-2 data-[state=active]:shadow-sm data-[state=active]:bg-card dark:data-[state=active]:bg-card/90 dark:hover:bg-muted/30 transition-all">
                                <BarChart3Icon className="h-4 w-4" />
                                Insights
                            </TabsTrigger>
                            <TabsTrigger value="posts" className="flex items-center gap-2 data-[state=active]:shadow-sm data-[state=active]:bg-card dark:data-[state=active]:bg-card/90 dark:hover:bg-muted/30 transition-all">
                                <ImageIcon className="h-4 w-4" />
                                Posts
                            </TabsTrigger>
                            <TabsTrigger value="reels" className="flex items-center gap-2 data-[state=active]:shadow-sm data-[state=active]:bg-card dark:data-[state=active]:bg-card/90 dark:hover:bg-muted/30 transition-all">
                                <VideoIcon className="h-4 w-4" />
                                Reels
                            </TabsTrigger>
                            <TabsTrigger value="stories" className="flex items-center gap-2 data-[state=active]:shadow-sm data-[state=active]:bg-card dark:data-[state=active]:bg-card/90 dark:hover:bg-muted/30 transition-all">
                                <StarIcon className="h-4 w-4" />
                                Stories
                            </TabsTrigger>

                        </TabsList>

                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search content..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 w-64"
                                />
                            </div>
                            <Button variant="outline" size="sm">
                                <FilterIcon className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>



                    <TabsContent value="insights" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Follower Growth */}
                            <Card className="lg:col-span-2">
                                <CardHeader>
                                    <CardTitle>Follower Growth</CardTitle>
                                    <CardDescription>Track your audience growth over time</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-green-600">+{analyticsData.followers.newToday}</div>
                                                <div className="text-sm text-muted-foreground">New Today</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl font-bold">{analyticsData.followers.total.toLocaleString()}</div>
                                                <div className="text-sm text-muted-foreground">Total Followers</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-red-600">-{analyticsData.followers.unfollows}</div>
                                                <div className="text-sm text-muted-foreground">Unfollows</div>
                                            </div>
                                        </div>
                                        <div className="h-80 relative">
                                            <div className="">
                                                <Tabs defaultValue="irganic">
                                                    <TabsList className="bg-muted absolute top-2 right-4 z-10">
                                                        <TabsTrigger value="organic">Organic</TabsTrigger>
                                                        <TabsTrigger value="paid">Paid</TabsTrigger>
                                                        <TabsTrigger value="followers">Followers</TabsTrigger>
                                                    </TabsList>

                                                    <TabsContent value="followers">
                                                        <div className="h-72 w-full">
                                                            <ChartLine dataKey="followers" name="Total Followers" />
                                                        </div>
                                                    </TabsContent>

                                                    <TabsContent value="organic">
                                                        <div className="h-72 w-full">
                                                            <ChartLine dataKey="organic" name="Organic Growth" dashed />
                                                        </div>
                                                    </TabsContent>

                                                    <TabsContent value="paid">
                                                        <div className="h-72 w-full">
                                                            <ChartLine dataKey="paid" name="Paid Growth" dashed />
                                                        </div>
                                                    </TabsContent>
                                                </Tabs>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Top Performing Content */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Top Performing</CardTitle>
                                    <CardDescription>Your best content this month</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {posts.slice(0, 3).map((post, index) => (
                                            <div key={post.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                                                <div className="w-8 h-8 bg-muted rounded flex items-center justify-center text-sm font-bold">
                                                    {index + 1}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-medium truncate">{post.title}</div>
                                                    <div className="text-xs text-muted-foreground">{post.likes.toLocaleString()} likes</div>
                                                </div>
                                                <TrendingUpIcon className="h-4 w-4 text-green-500" />
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Demographics */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Top Cities</CardTitle>
                                    <CardDescription>Where your audience is located</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {analyticsData.demographics.topCities.map((city, index) => (
                                            <div key={index} className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-sm font-medium">{city.city}</span>
                                                </div>
                                                <span className="text-sm text-muted-foreground">{city.count.toLocaleString()}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Age Demographics */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Audience Age</CardTitle>
                                    <CardDescription>Age distribution of your followers</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {analyticsData.demographics.ageGroups.map((group, index) => (
                                            <div key={index} className="space-y-1">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span>{group.range}</span>
                                                    <span className="font-medium">{group.percentage}%</span>
                                                </div>
                                                <div className="w-full bg-muted rounded-full h-2">
                                                    <div
                                                        className="bg-primary h-2 rounded-full transition-all duration-300"
                                                        style={{ width: `${group.percentage}%` }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Engagement Overview */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Engagement Overview</CardTitle>
                                    <CardDescription>Total interactions this month</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <HeartIcon className="h-4 w-4 text-red-500" />
                                                <span className="text-sm">Total Likes</span>
                                            </div>
                                            <span className="font-semibold">{analyticsData.engagement.totalLikes.toLocaleString()}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <MessageCircleIcon className="h-4 w-4 text-blue-500" />
                                                <span className="text-sm">Total Comments</span>
                                            </div>
                                            <span className="font-semibold">{analyticsData.engagement.totalComments.toLocaleString()}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <ShareIcon className="h-4 w-4 text-green-500" />
                                                <span className="text-sm">Total Shares</span>
                                            </div>
                                            <span className="font-semibold">{analyticsData.engagement.totalShares.toLocaleString()}</span>
                                        </div>
                                        <div className="pt-2 border-t">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium">Engagement Rate</span>
                                                <span className="font-bold text-green-600">{analyticsData.engagement.rate}</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Reach & Impressions */}
                            <Card className="lg:col-span-2">
                                <CardHeader>
                                    <CardTitle>Reach & Impressions</CardTitle>
                                    <CardDescription>How many people saw your content</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 gap-6 mb-6">
                                        <div className="text-center">
                                            <div className="text-3xl font-bold">{analyticsData.reach.total.toLocaleString()}</div>
                                            <div className="text-sm text-muted-foreground">Total Reach</div>
                                            <div className="text-xs text-green-600 mt-1">{analyticsData.reach.growth} vs last month</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-3xl font-bold">{(analyticsData.reach.total * 1.4).toLocaleString()}</div>
                                            <div className="text-sm text-muted-foreground">Total Impressions</div>
                                            <div className="text-xs text-green-600 mt-1">+8.2% vs last month</div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-muted/50 rounded-lg">
                                            <div className="text-lg font-semibold">{analyticsData.reach.organic.toLocaleString()}</div>
                                            <div className="text-sm text-muted-foreground">Organic Reach</div>
                                            <div className="text-xs text-green-600 mt-1">85% of total</div>
                                        </div>
                                        <div className="p-4 bg-muted/50 rounded-lg">
                                            <div className="text-lg font-semibold">{analyticsData.reach.paid.toLocaleString()}</div>
                                            <div className="text-sm text-muted-foreground">Paid Reach</div>
                                            <div className="text-xs text-blue-600 mt-1">15% of total</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Gender Split */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Gender Distribution</CardTitle>
                                    <CardDescription>Audience gender breakdown</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span>Female</span>
                                                <span className="font-medium">{analyticsData.demographics.genderSplit.female}%</span>
                                            </div>
                                            <div className="w-full bg-muted rounded-full h-2">
                                                <div
                                                    className="bg-pink-500 h-2 rounded-full transition-all duration-300"
                                                    style={{ width: `${analyticsData.demographics.genderSplit.female}%` }}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span>Male</span>
                                                <span className="font-medium">{analyticsData.demographics.genderSplit.male}%</span>
                                            </div>
                                            <div className="w-full bg-muted rounded-full h-2">
                                                <div
                                                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                                    style={{ width: `${analyticsData.demographics.genderSplit.male}%` }}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span>Other</span>
                                                <span className="font-medium">{analyticsData.demographics.genderSplit.other}%</span>
                                            </div>
                                            <div className="w-full bg-muted rounded-full h-2">
                                                <div
                                                    className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                                                    style={{ width: `${analyticsData.demographics.genderSplit.other}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Best Posting Times */}
                            <Card className="lg:col-span-3">
                                <CardHeader>
                                    <CardTitle>Optimal Posting Times</CardTitle>
                                    <CardDescription>When your audience is most active</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-7 gap-2">
                                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                                            <div key={day} className="text-center">
                                                <div className="text-sm font-medium mb-2">{day}</div>
                                                <div className="space-y-1">
                                                    {['9AM', '12PM', '3PM', '6PM', '9PM'].map((time, timeIndex) => (
                                                        <div
                                                            key={time}
                                                            className={`text-xs p-1 rounded ${Math.random() > 0.6 ? 'bg-green-100 text-green-800' :
                                                                Math.random() > 0.3 ? 'bg-yellow-100 text-yellow-800' :
                                                                    'bg-muted text-muted-foreground'
                                                                }`}
                                                        >
                                                            {time}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex items-center justify-center gap-6 mt-6 text-xs">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 bg-green-100 rounded"></div>
                                            <span>High Activity</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 bg-yellow-100 rounded"></div>
                                            <span>Medium Activity</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 bg-muted rounded"></div>
                                            <span>Low Activity</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Recent Activity */}
                            <Card className="lg:col-span-2">
                                <CardHeader>
                                    <CardTitle>Recent Activity</CardTitle>
                                    <CardDescription>Latest interactions and updates</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ScrollArea className="h-80">
                                        <div className="space-y-4">
                                            {Array.from({ length: 10 }).map((_, index) => (
                                                <div key={index} className="flex items-start gap-3">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage src={`/api/placeholder/32/32?text=U${index + 1}`} />
                                                        <AvatarFallback>U{index + 1}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-sm">
                                                            <span className="font-medium">user_{index + 1}</span>
                                                            <span className="text-muted-foreground">
                                                                {[' liked your post', ' commented on your reel', ' started following you', ' shared your story'][Math.floor(Math.random() * 4)]}
                                                            </span>
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {Math.floor(Math.random() * 60)} minutes ago
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                </CardContent>
                            </Card>

                            {/* Content Performance */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Content Performance</CardTitle>
                                    <CardDescription>Compare content types</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <ImageIcon className="h-4 w-4 text-blue-500" />
                                                <span className="text-sm font-medium">Posts</span>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-semibold">4.2%</div>
                                                <div className="text-xs text-muted-foreground">Avg Engagement</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <VideoIcon className="h-4 w-4 text-purple-500" />
                                                <span className="text-sm font-medium">Reels</span>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-semibold">7.8%</div>
                                                <div className="text-xs text-muted-foreground">Avg Engagement</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <StarIcon className="h-4 w-4 text-yellow-500" />
                                                <span className="text-sm font-medium">Stories</span>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-semibold">12.3%</div>
                                                <div className="text-xs text-muted-foreground">Avg Engagement</div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* <TabsContent value="posts" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            <CreateNewCard type="Post" onClick={() => console.log('Create new post')} />
                            {posts.map((post) => (
                                <PostCard key={post.id} post={post} />
                            ))}
                        </div>
                    </TabsContent> */}

                    <TabsContent value="posts" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <MetricCard
                                title="Published Posts"
                                value={postsData.filter(p => p.status === 'published').length}
                                subtitle="Live content"
                                icon={FileText}
                                trend="+3 this week"
                            />
                            <MetricCard
                                title="Scheduled Posts"
                                value={postsData.filter(p => p.status === 'scheduled').length}
                                subtitle="Upcoming content"
                                icon={Calendar}
                                trend="+2 this week"
                            />
                            <MetricCard
                                title="Total Engagement"
                                value={postsData.reduce((sum, post) => sum + post.likes + post.comments + post.shares, 0).toLocaleString()}
                                subtitle="Likes, comments & shares"
                                icon={Heart}
                                trend="+245 this week"
                            />
                            <MetricCard
                                title="Avg Engagement Rate"
                                value={`${analyticsPortedData.avgEngagementRate}%`}
                                subtitle="Across all posts"
                                icon={BarChart3}
                                trend="+1.2% this month"
                            />
                        </div>

                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold">All Posts ({filterData(postsData, 'posts').length})</h2>
                            <div className="flex space-x-2">
                                <Button size="sm">
                                    <Plus className="h-4 w-4 mr-2" />
                                    New Post
                                </Button>
                                <Button variant="outline" size="sm">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    Schedule
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {filterData(postsData, 'posts').map((post: any) => (
                                <PostCard key={post.id} post={post} />
                            ))}
                        </div>
                    </TabsContent>


                    {/* <TabsContent value="reels" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            <CreateNewCard type="Reel" onClick={() => console.log('Create new reel')} />
                            {reels.map((reel) => (
                                <ReelCard key={reel.id} reel={reel} />
                            ))}
                        </div>
                    </TabsContent> */}

                    <TabsContent value="reels" className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                  <MetricCard
                                    title="Total Reels"
                                    value={reelsData.length}
                                    subtitle="Video content"
                                    icon={Play}
                                    trend="+2 this week"
                                  />
                                  <MetricCard
                                    title="Total Views"
                                    value={`${(reelsData.reduce((sum, reel) => sum + reel.views, 0) / 1000).toFixed(1)}k`}
                                    subtitle="Across all reels"
                                    icon={Eye}
                                    trend="+12k this week"
                                  />
                                  <MetricCard
                                    title="Trending Reels"
                                    value={reelsData.filter(r => r.trending).length}
                                    subtitle="Currently trending"
                                    icon={TrendingUp}
                                    trend="+1 this week"
                                  />
                                  <MetricCard
                                    title="Avg Engagement"
                                    value={`${(reelsData.reduce((sum, reel) => sum + reel.engagement, 0) / reelsData.length).toFixed(1)}%`}
                                    subtitle="Engagement rate"
                                    icon={Heart}
                                    trend="+3.2% this month"
                                  />
                                </div>
                    
                                <div className="flex justify-between items-center">
                                  <h2 className="text-xl font-semibold">All Reels ({filterData(reelsData, 'reels').length})</h2>
                                  <div className="flex space-x-2">
                                    <Button size="sm">
                                      <Plus className="h-4 w-4 mr-2" />
                                      Create Reel
                                    </Button>
                                    <Button variant="outline" size="sm">
                                      <BarChart3 className="h-4 w-4 mr-2" />
                                      Analytics
                                    </Button>
                                  </div>
                                </div>
                    
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                  {filterData(reelsData, 'reels').map((reel:any) => (
                                    <ReelCard key={reel.id} reel={reel} />
                                  ))}
                                </div>
                              </TabsContent>

                    {/* <TabsContent value="stories" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                            <CreateNewCard type="Story" onClick={() => console.log('Create new story')} />
                            {stories.map((story) => (
                                <StoryCard key={story.id} story={story} />
                            ))}
                        </div>
                    </TabsContent> */}
                    <TabsContent value="stories" className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                  <MetricCard
                                    title="Active Stories"
                                    value={storiesData.filter(s => s.status === 'active').length}
                                    subtitle="Currently live"
                                    icon={Clock}
                                    trend="+2 today"
                                  />
                                  <MetricCard
                                    title="Total Views"
                                    value={storiesData.reduce((sum, story) => sum + story.views, 0).toLocaleString()}
                                    subtitle="Across all stories"
                                    icon={Eye}
                                    trend="+456 today"
                                  />
                                  <MetricCard
                                    title="Story Replies"
                                    value={storiesData.reduce((sum, story) => sum + story.replies, 0)}
                                    subtitle="Direct responses"
                                    icon={MessageSquare}
                                    trend="+12 today"
                                  />
                                  <MetricCard
                                    title="Avg Engagement"
                                    value={`${(storiesData.reduce((sum, story) => sum + story.engagement, 0) / storiesData.length).toFixed(1)}%`}
                                    subtitle="Story engagement"
                                    icon={Heart}
                                    trend="+1.8% this week"
                                  />
                                </div>
                    
                                <div className="flex justify-between items-center">
                                  <h2 className="text-xl font-semibold">All Stories ({filterData(storiesData, 'stories').length})</h2>
                                  <div className="flex space-x-2">
                                    <Button size="sm">
                                      <Plus className="h-4 w-4 mr-2" />
                                      Create Story
                                    </Button>
                                    <Button variant="outline" size="sm">
                                      <Image className="h-4 w-4 mr-2" />
                                      Templates
                                    </Button>
                                  </div>
                                </div>
                    
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                  {filterData(storiesData, 'stories').map((story:any) => (
                                    <StoryCard key={story.id} story={story} />
                                  ))}
                                </div>
                    
                                <Card>
                                  <CardHeader>
                                    <CardTitle>Story Analytics</CardTitle>
                                    <CardDescription>Performance insights for your stories</CardDescription>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                      <div className="space-y-2">
                                        <h4 className="font-medium">Best Performing Platform</h4>
                                        <div className="text-2xl font-bold">Instagram</div>
                                        <p className="text-sm text-muted-foreground">Highest engagement rate</p>
                                      </div>
                                      <div className="space-y-2">
                                        <h4 className="font-medium">Peak Activity Time</h4>
                                        <div className="text-2xl font-bold">7-9 PM</div>
                                        <p className="text-sm text-muted-foreground">Most views and interactions</p>
                                      </div>
                                      <div className="space-y-2">
                                        <h4 className="font-medium">Story Completion Rate</h4>
                                        <div className="text-2xl font-bold">78%</div>
                                        <p className="text-sm text-muted-foreground">Users who view full story</p>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              </TabsContent>

                </Tabs>
            </div>
        </div>
    );
}

function ChartLine({
    dataKey,
    name,
    dashed = false,
}: {
    dataKey: "followers" | "organic" | "paid"
    name: string
    dashed?: boolean
}) {
    const colorMap = {
        followers: "oklch(0.7655 0.1366 159.1498)",
        organic: "oklch(0.7138 0.1300 158.6012)",
        paid: "oklch(0.6585 0.1219 158.2401)",
    }

    const strokeColor = colorMap[dataKey]

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
                <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                    opacity={0.2}
                />
                <XAxis
                    dataKey="date"
                    fontSize={12}
                    tickMargin={10}
                    stroke="hsl(var(--foreground))"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                    fontSize={12}
                    tickFormatter={(value) => value.toLocaleString()}
                    stroke="hsl(var(--foreground))"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <Tooltip
                    formatter={(value) => [value.toLocaleString(), name]}
                    labelStyle={{ fontWeight: "bold", color: "hsl(var(--foreground))" }}
                    contentStyle={{
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                        border: "none",
                        backgroundColor: "hsl(var(--background))",
                        color: "hsl(var(--foreground))",
                    }}
                />
                <Legend
                    verticalAlign="top"
                    height={36}
                    wrapperStyle={{ color: "hsl(var(--foreground))" }}
                />
                <Line
                    type="monotone"
                    dataKey={dataKey}
                    name={name}
                    stroke={strokeColor}
                    strokeWidth={dataKey === "followers" ? 3 : 2}
                    strokeDasharray={dashed ? "3 3" : undefined}
                    dot={{ r: 3, fill: strokeColor }}
                    activeDot={{ r: 6, fill: strokeColor }}
                />
            </LineChart>
        </ResponsiveContainer>
    )
}

"use client"

import { useState } from "react"
import {
  Card, CardHeader, CardTitle, CardContent, CardDescription
} from "@/components/ui/card"
import {
  Tabs, TabsList, TabsTrigger, TabsContent
} from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Star, Heart, MessageCircle, Share2, Eye, TrendingUp, Calendar, Clock, Users, BarChart3, Plus, Filter, Search, MoreHorizontal, Play, Image, FileText, Send, ThumbsUp, ThumbsDown, MessageSquare, Bookmark, Edit, Trash2 } from "lucide-react"

// Dummy Data
const reviewsData = [
  { id: 1, channel: "zomato", name: "Amit Sharma", date: "2025-07-20", rating: 5, content: "Amazing food and service! The biryani was perfectly cooked and the staff was incredibly friendly. Will definitely order again!", sentiment: "positive", status: "new", responses: [] },
  { id: 2, channel: "swiggy", name: "Neha Patel", date: "2025-07-19", rating: 2, content: "Food arrived cold and the packaging was damaged. Very disappointed with the quality.", sentiment: "negative", status: "pending", responses: [{ text: "We apologize for the inconvenience. Please contact us for a full refund.", date: "2025-07-19" }] },
  { id: 3, channel: "google", name: "Ravi Kumar", date: "2025-07-18", rating: 4, content: "Great ambiance and delicious food. The service could be a bit faster, but overall a good experience.", sentiment: "positive", status: "resolved", responses: [] },
  { id: 4, channel: "instagram", name: "Priya Das", date: "2025-07-17", rating: 3, content: "Food looks good in photos, waiting to try it myself! The presentation seems amazing.", sentiment: "neutral", status: "new", responses: [] },
  { id: 5, channel: "inperson", name: "Anita Rao", date: "2025-07-16", rating: 1, content: "Wait time was too long, over 45 minutes for a simple order. Staff seemed overwhelmed.", sentiment: "negative", status: "pending", responses: [] },
  { id: 6, channel: "zomato", name: "Karthik Singh", date: "2025-07-15", rating: 5, content: "Best restaurant in the area! Fresh ingredients, amazing taste, and quick delivery.", sentiment: "positive", status: "resolved", responses: [] },
  { id: 7, channel: "google", name: "Sneha Gupta", date: "2025-07-14", rating: 4, content: "Good value for money. The portion sizes are generous and the tast</Button>e is authentic.", sentiment: "positive", status: "new", responses: [] },
  { id: 8, channel: "swiggy", name: "Rajesh Kumar", date: "2025-07-13", rating: 2, content: "Order was incorrect and customer service was unhelpful. Expected better quality.", sentiment: "negative", status: "pending", responses: [] }
]

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

export default function SocialMediaDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedChannel, setSelectedChannel] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")

  // Analytics Data
  const analyticsData = {
    totalReviews: reviewsData.length,
    averageRating: (reviewsData.reduce((sum, review) => sum + review.rating, 0) / reviewsData.length).toFixed(1),
    sentimentBreakdown: {
      positive: reviewsData.filter(r => r.sentiment === "positive").length,
      negative: reviewsData.filter(r => r.sentiment === "negative").length,
      neutral: reviewsData.filter(r => r.sentiment === "neutral").length
    },
    totalPosts: postsData.length,
    totalReels: reelsData.length,
    totalStories: storiesData.length,
    totalEngagement: postsData.reduce((sum, post) => sum + post.likes + post.comments + post.shares, 0),
    avgEngagementRate: (postsData.reduce((sum, post) => sum + post.engagement, 0) / postsData.length).toFixed(1)
  }

  const channels = ["all", "zomato", "swiggy", "google", "instagram", "facebook", "twitter", "linkedin", "youtube", "tiktok", "snapchat", "whatsapp", "inperson"]
  const statusOptions = ["all", "new", "pending", "resolved", "published", "scheduled", "draft", "active", "expired"]

  const filterData = (data:any, type:any) => {
    return data.filter((item:any) => {
      const matchesSearch = item.content?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.name?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesChannel = selectedChannel === "all" || item.channel === selectedChannel || item.platform === selectedChannel
      const matchesStatus = selectedStatus === "all" || item.status === selectedStatus || item.sentiment === selectedStatus
      return matchesSearch && matchesChannel && matchesStatus
    })
  }

  const MetricCard = ({ title, value, subtitle, icon: Icon, trend }:any) => (
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

  const ReviewCard = ({ review }:any) => (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarFallback>{review.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold">{review.name}</div>
              <div className="text-sm text-muted-foreground">
                {review.date} • {review.channel.charAt(0).toUpperCase() + review.channel.slice(1)}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={review.sentiment === "positive" ? "default" : review.sentiment === "negative" ? "destructive" : "secondary"}>
              {review.sentiment}
            </Badge>
            <Badge variant="outline">{review.status}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`h-4 w-4 ${i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
              />
            ))}
            <span className="text-sm text-muted-foreground ml-2">({review.rating}/5)</span>
          </div>
          <p className="text-sm">{review.content}</p>
          {review.responses.length > 0 && (
            <div className="bg-muted p-3 rounded-lg">
              <p className="text-sm font-medium">Your Response:</p>
              <p className="text-sm text-muted-foreground">{review.responses[0].text}</p>
            </div>
          )}
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="default">
              <MessageCircle className="h-4 w-4 mr-1" />
              Reply
            </Button>
            <Button size="sm" variant="outline">
              <ThumbsUp className="h-4 w-4 mr-1" />
              Mark Resolved
            </Button>
            <Button size="sm" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Reviews Management</h1>
            <p className="text-muted-foreground">Manage your reviews across all platforms</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
            <Input
              placeholder="Search reviews, or users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={selectedChannel}
            onChange={(e) => setSelectedChannel(e.target.value)}
            className="px-3 py-2 border border-input bg-background rounded-md text-sm"
          >
            {channels.map(channel => (
              <option key={channel} value={channel}>
                {channel === "all" ? "All Channels" : channel.charAt(0).toUpperCase() + channel.slice(1)}
              </option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-input bg-background rounded-md text-sm"
          >
            {statusOptions.map(status => (
              <option key={status} value={status}>
                {status === "all" ? "All Status" : status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
        </div>

        

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-background/90 dark:shadow-sm dark:shadow-gray-900/10">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:shadow-sm data-[state=active]:bg-card dark:data-[state=active]:bg-card/90 dark:hover:bg-muted/30 transition-all"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="reviews" 
              className="data-[state=active]:shadow-sm data-[state=active]:bg-card dark:data-[state=active]:bg-card/90 dark:hover:bg-muted/30 transition-all"
            >
              Reviews
            </TabsTrigger>
            {/* <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="reels">Reels</TabsTrigger>
            <TabsTrigger value="stories">Stories</TabsTrigger> */}
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Total Reviews"
                value={analyticsData.totalReviews}
                subtitle="All platforms"
                icon={MessageCircle}
                trend="+12% this month"
              />
              <MetricCard
                title="Average Rating"
                value={`${analyticsData.averageRating}/5`}
                subtitle="Across all reviews"
                icon={Star}
                trend="+0.3 this month"
              />
              <MetricCard
                title="Total Posts"
                value={analyticsData.totalPosts}
                subtitle="Published content"
                icon={FileText}
                trend="+8 this week"
              />
              <MetricCard
                title="Engagement Rate"
                value={`${analyticsData.avgEngagementRate}%`}
                subtitle="Average across posts"
                icon={TrendingUp}
                trend="+2.4% this month"
              />
            </div> */}

            

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates across all platforms</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-4">
                    {[...reviewsData, ...postsData, ...reelsData, ...storiesData]
                      .sort((a:any, b:any) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .slice(0, 8)
                      .map((item:any, index:number) => (
                        <div key={index} className="flex items-center space-x-3 p-2 rounded-lg border">
                          <div className="text-lg">
                            {item.title ? '💬' : item.type === 'video' || (item.title && item.title.includes('Reel')) ? '🎥' : item.type === 'image' ? '📸' : '📝'}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              {item.name ? `New review from ${item.name}` : 
                               item.title ? `${item.title}` : 
                               `New ${item.type || 'story'} posted`}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {item.channel || item.platform} • {item.date}
                            </p>
                          </div>
                          <Badge 
                            variant={
                              item.sentiment === "positive" || item.status === "published" || item.status === "active" ? "default" :
                              item.sentiment === "negative" || item.status === "draft" || item.status === "expired" ? "destructive" :
                              item.status === "scheduled" ? "secondary" : "outline"
                            } 
                            className="text-xs"
                          >
                            {item.sentiment || item.status}
                          </Badge>
                        </div>
                      ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Positive Reviews"
                value={analyticsData.sentimentBreakdown.positive}
                subtitle={`${((analyticsData.sentimentBreakdown.positive / analyticsData.totalReviews) * 100).toFixed(1)}% of total`}
                icon={ThumbsUp}
                trend="+5 this week"
              />
              <MetricCard
                title="Negative Reviews"
                value={analyticsData.sentimentBreakdown.negative}
                subtitle={`${((analyticsData.sentimentBreakdown.negative / analyticsData.totalReviews) * 100).toFixed(1)}% of total`}
                icon={ThumbsDown}
                trend="-2 this week"
              />
              <MetricCard
                title="Response Rate"
                value="87%"
                subtitle="Reviews responded to"
                icon={MessageCircle}
                trend="+12% this month"
              />
              <MetricCard
                title="Avg Response Time"
                value="2.4h"
                subtitle="Time to first response"
                icon={Clock}
                trend="-30min this month"
              />
            </div>

            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">All Reviews ({filterData(reviewsData, 'reviews').length})</h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  Export
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filterData(reviewsData, 'reviews').map((review:any) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </TabsContent>

          {/* Posts Tab */}
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
                value={`${analyticsData.avgEngagementRate}%`}
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
              {filterData(postsData, 'posts').map((post:any) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </TabsContent>

          {/* Reels Tab */}
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

          {/* Stories Tab */}
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

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Quick Actions Card */}
            <Card className="!gap-3">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-3 gap-2">
                        <Button variant="outline" className="h-16 flex-col space-y-1 p-2">
                            <Plus className="h-4 w-4" />
                            <span className="text-[10px]">New Post</span>
                        </Button>
                        <Button variant="outline" className="h-16 flex-col space-y-1 p-2">
                            <Calendar className="h-4 w-4" />
                            <span className="text-[10px]">Schedule</span>
                        </Button>
                        <Button variant="outline" className="h-16 flex-col space-y-1 p-2">
                            <BarChart3 className="h-4 w-4" />
                            <span className="text-[10px]">Analytics</span>
                        </Button>
                        <Button variant="outline" className="h-16 flex-col space-y-1 p-2">
                            <MessageCircle className="h-4 w-4" />
                            <span className="text-[10px]">Respond</span>
                        </Button>
                        <Button variant="outline" className="h-16 flex-col space-y-1 p-2">
                            <Users className="h-4 w-4" />
                            <span className="text-[10px]">Audience</span>
                        </Button>
                        <Button variant="outline" className="h-16 flex-col space-y-1 p-2">
                            <TrendingUp className="h-4 w-4" />
                            <span className="text-[10px]">Trends</span>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* AI Recommendations Card */}
            <Card className="!gap-3">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm">AI Recommendations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="flex items-start space-x-2 p-2 bg-muted rounded-md">
                        <TrendingUp className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <h4 className="text-xs font-medium">Optimal Posting Time</h4>
                            <p className="text-xs text-muted-foreground">Schedule posts between 7-9 PM for maximum engagement.</p>
                        </div>
                    </div>
                    <div className="flex items-start space-x-2 p-2 bg-muted rounded-md">
                        <MessageCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <h4 className="text-xs font-medium">Review Response</h4>
                            <p className="text-xs text-muted-foreground">3 negative reviews need attention to improve satisfaction.</p>
                        </div>
                    </div>
                    <div className="flex items-start space-x-2 p-2 bg-muted rounded-md">
                        <Play className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <h4 className="text-xs font-medium">Video Content</h4>
                            <p className="text-xs text-muted-foreground">Reels get 3x more engagement than static posts.</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  )
}
                      
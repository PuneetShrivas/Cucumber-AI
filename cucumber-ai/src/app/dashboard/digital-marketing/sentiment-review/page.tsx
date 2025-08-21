"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
  Scatter,
  ScatterChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Star,
  MessageSquare,
  Users,
  DollarSign,
  Clock,
  MapPin,
  Utensils,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  Eye,
  Phone,
  Globe,
  Navigation,
  Filter,
  Download,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  Info,
  Lightbulb,
  Check,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useRef } from "react";
import React from "react";
import * as XLSX from "xlsx";

// Types
interface KPIData {
  totalReviews: number;
  npsScore: number;
  pendingReplies: number;
  refundRate: number;
  avgResponseTime: number;
  sentimentTrend: number;
}

interface DishPerformance {
  id: string;
  name: string;
  category: string;
  totalMentions: number;
  positive: number;
  neutral: number;
  negative: number;
  avgSentiment: number;
  newCustomerSentiment: number;
  repeatCustomerSentiment: number;
  topComplaints: string[];
}

interface OutletData {
  id: string;
  name: string;
  city: string;
  area: string;
  rating: number;
  reviewCount: number;
  sentimentScore: number;
  responseRate: number;
  avgResponseTime: number;
  profileViews: number;
  calls: number;
  websiteClicks: number;
}

interface CompetitorData {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  avgResponseTime: number;
  sentimentScore: number;
  locations: number;
}

interface AIInsight {
  title: string;
  severity: "high" | "medium" | "low";
  description: string;
  metric: string;
  trend: "up" | "down" | "stable";
  suggestions: string[];
}

type UserType = "all" | "new" | "repeat";
type SentimentType = "all" | "positive" | "neutral" | "negative";

export default function InsightsPage() {
  // State management
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState("7d");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedInsight, setExpandedInsight] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [userType, setUserType] = useState<UserType>("all");
  const [sentimentType, setSentimentType] = useState<SentimentType>("all");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedOutlets, setSelectedOutlets] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({ from: undefined, to: undefined });
  const [reportTab, setReportTab] = useState("schedule");
  const [customExportCols, setCustomExportCols] = useState<string[]>([]);

  // Data state
  const [kpiData, setKpiData] = useState<KPIData | null>(null);
  const [dishPerformance, setDishPerformance] = useState<DishPerformance[]>([]);
  const [outletData, setOutletData] = useState<OutletData[]>([]);
  const [competitorData, setCompetitorData] = useState<CompetitorData[]>([]);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [sentimentTrendData, setSentimentTrendData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);

  // Mock data fetching (replace with actual API calls)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock KPI data
      setKpiData({
        totalReviews: 1247,
        npsScore: 72,
        pendingReplies: 23,
        refundRate: 2.1,
        avgResponseTime: 4.2,
        sentimentTrend: 8.5,
      });

      // Mock dish performance data
      setDishPerformance([
        {
          id: "1",
          name: "Butter Chicken",
          category: "Main Course",
          totalMentions: 156,
          positive: 120,
          neutral: 25,
          negative: 11,
          avgSentiment: 0.78,
          newCustomerSentiment: 0.82,
          repeatCustomerSentiment: 0.74,
          topComplaints: ["Too spicy", "Cold delivery", "Portion size"],
        },
        {
          id: "2",
          name: "Margherita Pizza",
          category: "Pizza",
          totalMentions: 143,
          positive: 98,
          neutral: 32,
          negative: 13,
          avgSentiment: 0.71,
          newCustomerSentiment: 0.69,
          repeatCustomerSentiment: 0.73,
          topComplaints: ["Burnt crust", "Late delivery", "Missing toppings"],
        },
        {
          id: "3",
          name: "Chicken Biryani",
          category: "Rice Dishes",
          totalMentions: 134,
          positive: 105,
          neutral: 18,
          negative: 11,
          avgSentiment: 0.83,
          newCustomerSentiment: 0.85,
          repeatCustomerSentiment: 0.81,
          topComplaints: ["Dry rice", "Less chicken", "Spice level"],
        },
      ]);

      // Mock outlet data
      setOutletData([
        {
          id: "1",
          name: "Downtown Branch",
          city: "Mumbai",
          area: "Bandra",
          rating: 4.2,
          reviewCount: 342,
          sentimentScore: 0.75,
          responseRate: 89,
          avgResponseTime: 3.5,
          profileViews: 1250,
          calls: 89,
          websiteClicks: 156,
        },
        {
          id: "2",
          name: "Mall Location",
          city: "Mumbai",
          area: "Andheri",
          rating: 3.8,
          reviewCount: 278,
          sentimentScore: 0.68,
          responseRate: 72,
          avgResponseTime: 6.2,
          profileViews: 890,
          calls: 45,
          websiteClicks: 98,
        },
        {
          id: "3",
          name: "Central Plaza",
          city: "Delhi",
          area: "Connaught Place",
          rating: 4.5,
          reviewCount: 456,
          sentimentScore: 0.82,
          responseRate: 94,
          avgResponseTime: 2.8,
          profileViews: 1680,
          calls: 123,
          websiteClicks: 234,
        },
      ]);

      // Mock competitor data
      setCompetitorData([
        {
          id: "1",
          name: "Pizza Palace",
          rating: 4.1,
          reviewCount: 1200,
          avgResponseTime: 5.5,
          sentimentScore: 0.72,
          locations: 8,
        },
        {
          id: "2",
          name: "Curry House",
          rating: 3.9,
          reviewCount: 890,
          avgResponseTime: 7.2,
          sentimentScore: 0.68,
          locations: 5,
        },
        {
          id: "3",
          name: "Spice Garden",
          rating: 4.3,
          reviewCount: 1450,
          avgResponseTime: 4.1,
          sentimentScore: 0.78,
          locations: 12,
        },
      ]);

      // Mock AI insights
      setAiInsights([
        {
          title: "Delivery Time Complaints Increasing",
          severity: "high",
          description: "35% increase in delivery time complaints over the past week, particularly for orders above ₹500.",
          metric: "+35%",
          trend: "up",
          suggestions: [
            "Review delivery partner performance during peak hours",
            "Consider adding more delivery staff for weekend shifts",
            "Implement real-time order tracking for high-value orders",
          ],
        },
        {
          title: "Butter Chicken Recipe Consistency",
          severity: "medium",
          description: "Multiple mentions of taste variation across different locations, especially spice levels.",
          metric: "12 mentions",
          trend: "stable",
          suggestions: [
            "Standardize spice measurements across all locations",
            "Conduct taste testing sessions with kitchen staff",
            "Create video training for signature dish preparation",
          ],
        },
        {
          title: "Positive Social Media Engagement",
          severity: "low",
          description: "Social media mentions up 22% with predominantly positive sentiment around new menu items.",
          metric: "+22%",
          trend: "up",
          suggestions: [
            "Leverage this momentum with targeted social campaigns",
            "Feature customer photos of new items",
            "Consider expanding successful new items to more locations",
          ],
        },
      ]);

      // Mock trend data
      setSentimentTrendData([
        { date: "2024-01-01", positive: 65, negative: 15, neutral: 20 },
        { date: "2024-01-02", positive: 68, negative: 12, neutral: 20 },
        { date: "2024-01-03", positive: 72, negative: 10, neutral: 18 },
        { date: "2024-01-04", positive: 69, negative: 14, neutral: 17 },
        { date: "2024-01-05", positive: 75, negative: 8, neutral: 17 },
        { date: "2024-01-06", positive: 71, negative: 11, neutral: 18 },
        { date: "2024-01-07", positive: 73, negative: 9, neutral: 18 },
      ]);

      setCategoryData([
        { name: "Main Course", positive: 78, negative: 12, total: 234 },
        { name: "Appetizers", positive: 82, negative: 8, total: 156 },
        { name: "Desserts", positive: 85, negative: 5, total: 98 },
        { name: "Beverages", positive: 75, negative: 15, total: 87 },
        { name: "Pizza", positive: 71, negative: 18, total: 203 },
      ]);

      setLoading(false);
    };

    fetchData();
  }, [selectedTimeframe, selectedLocation]);

  // Computed values
  const sentimentColors = {
    positive: "#10b981",
    negative: "#ef4444",
    neutral: "#6b7280",
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const calculateSentimentPercentage = (positive: number, total: number) => {
    return total > 0 ? Math.round((positive / total) * 100) : 0;
  };

  // Enhanced filter logic
  const filteredDishPerformance = useMemo(() => {
    let data = dishPerformance;
    if (selectedCategories.length > 0) {
      data = data.filter(d => selectedCategories.includes(d.category));
    }
    if (userType !== "all") {
      data = data.map(d => ({
        ...d,
        avgSentiment: userType === "new" ? d.newCustomerSentiment : d.repeatCustomerSentiment
      }));
    }
    if (sentimentType !== "all") {
      data = data.filter(d => {
        if (sentimentType === "positive") return d.avgSentiment >= 0.7;
        if (sentimentType === "neutral") return d.avgSentiment < 0.7 && d.avgSentiment > 0.4;
        if (sentimentType === "negative") return d.avgSentiment <= 0.4;
        return true;
      });
    }
    if (searchTerm) {
      data = data.filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    return data;
  }, [dishPerformance, selectedCategories, userType, sentimentType, searchTerm]);

  const filteredOutletData = useMemo(() => {
    let data = outletData;
    if (selectedOutlets.length > 0) {
      data = data.filter(o => selectedOutlets.includes(o.name));
    }
    if (sentimentType !== "all") {
      data = data.filter(o => {
        if (sentimentType === "positive") return o.sentimentScore >= 0.7;
        if (sentimentType === "neutral") return o.sentimentScore < 0.7 && o.sentimentScore > 0.4;
        if (sentimentType === "negative") return o.sentimentScore <= 0.4;
        return true;
      });
    }
    if (searchTerm) {
      data = data.filter(o => o.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    return data;
  }, [outletData, selectedOutlets, sentimentType, searchTerm]);

  const filteredCompetitorData = useMemo(() => {
    let data = competitorData;
    if (searchTerm) {
      data = data.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    return data;
  }, [competitorData, searchTerm]);

  // Excel export helpers
  function exportToExcel(data: any[], filename: string) {
    if (!data || data.length === 0) {
      alert("No data to export.");
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
    XLSX.writeFile(workbook, filename);
  }

  function getTopDefaulterDishesExcel() {
    return filteredDishPerformance
      .filter(d => d.avgSentiment < 0.5)
      .map(d => ({
        Dish: d.name,
        Category: d.category,
        "Mentions (New Users)": d.totalMentions,
        "Negative Reviews": d.negative,
        "Top Complaints": d.topComplaints.join(", "),
      }));
  }

  function getNewVsRepeatSentimentExcel() {
    return filteredDishPerformance.map(d => ({
      Dish: d.name,
      Category: d.category,
      "New User Sentiment": Math.round(d.newCustomerSentiment * 100) + "%",
      "Repeat User Sentiment": Math.round(d.repeatCustomerSentiment * 100) + "%",
    }));
  }

  function getASVAOVSentimentExcel() {
    return filteredDishPerformance.map(d => ({
      Dish: d.name,
      Category: d.category,
      "Avg Sentiment": Math.round(d.avgSentiment * 100) + "%",
      "Mentions": d.totalMentions,
    }));
  }

  function getPageVsFoodRatingsExcel() {
    return categoryData.map(c => ({
      Category: c.name,
      "Positive %": Math.round((c.positive / c.total) * 100) + "%",
      "Negative %": Math.round((c.negative / c.total) * 100) + "%",
      "Total Reviews": c.total,
    }));
  }

  function getCustomExportExcel(selectedCols: string[]) {
    return filteredDishPerformance.map(d => {
      const row: any = {};
      if (selectedCols.includes("Dish Name")) row["Dish Name"] = d.name;
      if (selectedCols.includes("Category")) row["Category"] = d.category;
      if (selectedCols.includes("Sentiment")) row["Sentiment"] = Math.round(d.avgSentiment * 100) + "%";
      if (selectedCols.includes("User Type")) row["User Type"] = userType;
      if (selectedCols.includes("Outlet")) row["Outlet"] = selectedOutlets.join(", ");
      if (selectedCols.includes("Date")) row["Date"] = new Date().toLocaleDateString();
      if (selectedCols.includes("Complaint")) row["Complaint"] = d.topComplaints.join(", ");
      if (selectedCols.includes("Rating")) row["Rating"] = d.avgSentiment;
      return row;
    });
  }

  if (loading) {
    return (
      <div className="flex-1 space-y-6 p-8">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <div className="flex space-x-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-7 w-16 mb-1" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // For multi-select popover
  const categoryOptions = [
    "Main Course",
    "Pizza",
    "Rice Dishes",
    "Appetizers",
    "Desserts",
    "Beverages",
  ];
  const outletOptions = outletData.map(o => o.name);

  return (
    <div className="flex-1 space-y-6 p-8">
      {/* Sticky Filter Controls */}
      <div className="z-20 bg-background p-4 rounded-md mb-4 border-b shadow-sm">
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center">
            <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
              <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 3 months</SelectItem>
              </SelectContent>
            </Select>
            {/* Date Range Picker Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  {dateRange.from && dateRange.to
                    ? `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`
                    : "Select Date Range"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={selected => setDateRange({ from: selected?.from, to: selected?.to })}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            <Select value={userType} onValueChange={v => setUserType(v as UserType)}>
              <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="new">New Users</SelectItem>
                <SelectItem value="repeat">Repeat Users</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sentimentType} onValueChange={v => setSentimentType(v as SentimentType)}>
              <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sentiments</SelectItem>
                <SelectItem value="positive">Positive</SelectItem>
                <SelectItem value="neutral">Neutral</SelectItem>
                <SelectItem value="negative">Negative</SelectItem>
              </SelectContent>
            </Select>
            {/* Categories Multi-select Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="w-48 justify-between">
                  <Filter className="mr-2 h-4 w-4" />
                  {selectedCategories.length > 0
                    ? `Categories (${selectedCategories.length})`
                    : "Filter Categories"}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-2">
                <div className="max-h-48 overflow-y-auto">
                  {categoryOptions.map(opt => (
                    <label key={opt} className="flex items-center gap-2 py-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(opt)}
                        onChange={e => {
                          if (e.target.checked) {
                            setSelectedCategories([...selectedCategories, opt]);
                          } else {
                            setSelectedCategories(selectedCategories.filter(c => c !== opt));
                          }
                        }}
                        className="accent-primary"
                      />
                      <span className="text-sm">{opt}</span>
                      {selectedCategories.includes(opt) && <Check className="h-4 w-4 text-primary" />}
                    </label>
                  ))}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 w-full"
                  onClick={() => setSelectedCategories([])}
                >
                  Clear Selection
                </Button>
              </PopoverContent>
            </Popover>
            {/* Outlets Multi-select Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="w-48 justify-between">
                  <MapPin className="mr-2 h-4 w-4" />
                  {selectedOutlets.length > 0
                    ? `Outlets (${selectedOutlets.length})`
                    : "Filter Outlets"}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-2">
                <div className="max-h-48 overflow-y-auto">
                  {outletOptions.map(opt => (
                    <label key={opt} className="flex items-center gap-2 py-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedOutlets.includes(opt)}
                        onChange={e => {
                          if (e.target.checked) {
                            setSelectedOutlets([...selectedOutlets, opt]);
                          } else {
                            setSelectedOutlets(selectedOutlets.filter(o => o !== opt));
                          }
                        }}
                        className="accent-primary"
                      />
                      <span className="text-sm">{opt}</span>
                      {selectedOutlets.includes(opt) && <Check className="h-4 w-4 text-primary" />}
                    </label>
                  ))}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 w-full"
                  onClick={() => setSelectedOutlets([])}
                >
                  Clear Selection
                </Button>
              </PopoverContent>
            </Popover>
            <Input
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search dish, outlet, competitor..."
              className="w-[750px]"
            />
            <Button variant="ghost" size="sm" onClick={() => {
              setUserType("all");
              setSentimentType("all");
              setSelectedCategories([]);
              setSelectedOutlets([]);
              setSearchTerm("");
              setDateRange({ from: undefined, to: undefined });
            }}>
              Reset Filters
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
          {/*<div className="flex gap-2 mt-2">
            <Button variant="ghost" size="sm" onClick={() => {
              setUserType("all");
              setSentimentType("all");
              setSelectedCategories([]);
              setSelectedOutlets([]);
              setSearchTerm("");
              setDateRange({ from: undefined, to: undefined });
            }}>
              Reset Filters
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>*/}
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Insights Dashboard</h2>
          <p className="text-muted-foreground">
            Comprehensive analytics covering sentiment, performance, and competitive intelligence
          </p>
        </div>
      </div>

      {/* Enhanced KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(kpiData?.totalReviews || 0)}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last period
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">NPS Score</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData?.npsScore || 0}</div>
            <Progress value={kpiData?.npsScore || 0} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              +{kpiData?.sentimentTrend || 0}% improvement
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Replies</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{kpiData?.pendingReplies || 0}</div>
            <p className="text-xs text-muted-foreground">
              Avg response: {kpiData?.avgResponseTime || 0}h
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Refund Rate</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData?.refundRate || 0}%</div>
            <p className="text-xs text-muted-foreground">
              -0.3% from last period
            </p>
          </CardContent>
        </Card>
        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Filtered Dishes</CardTitle>
            <Utensils className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredDishPerformance.length}</div>
            <p className="text-xs text-muted-foreground">
              {userType === "new" ? "New users" : userType === "repeat" ? "Repeat users" : "All users"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Filtered Outlets</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredOutletData.length}</div>
            <p className="text-xs text-muted-foreground">
              {sentimentType !== "all" ? sentimentType.charAt(0).toUpperCase() + sentimentType.slice(1) : "All"} sentiment
            </p>
          </CardContent>
        </Card> */}
      </div>

      {/* AI Insights Summary Card */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Lightbulb className="h-5 w-5 text-blue-500" />
            <CardTitle className="text-lg">AI-Powered Insights</CardTitle>
            <Badge variant="secondary">Top 3 Issues This Week</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {aiInsights.map((insight, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setExpandedInsight(expandedInsight === index ? null : index)}
              >
                <div className="flex items-center space-x-3">
                  <Badge className={getSeverityColor(insight.severity)}>
                    {insight.severity.toUpperCase()}
                  </Badge>
                  <h4 className="font-medium">{insight.title}</h4>
                  <div className="flex items-center text-sm text-muted-foreground">
                    {insight.trend === "up" && <TrendingUp className="h-4 w-4 text-red-500 mr-1" />}
                    {insight.trend === "down" && <TrendingDown className="h-4 w-4 text-green-500 mr-1" />}
                    <span>{insight.metric}</span>
                  </div>
                </div>
                {expandedInsight === index ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </div>
              
              {expandedInsight === index && (
                <div className="mt-3 pt-3 border-t space-y-3">
                  <p className="text-sm text-muted-foreground">{insight.description}</p>
                  <div>
                    <h5 className="text-sm font-medium mb-2">Recommended Actions:</h5>
                    <ul className="list-disc list-inside space-y-1">
                      {insight.suggestions.map((suggestion, i) => (
                        <li key={i} className="text-sm text-muted-foreground">{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
            <div className="flex-1 pr-4">
              <p className="text-sm text-muted-foreground">AI has identified 3 critical issues with high impact on your business.</p>
            </div>
            <Button variant="outline" size="sm">
              View All Insights
            </Button>
          </div> */}
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="dishes">Dish Performance</TabsTrigger>
          <TabsTrigger value="outlets">Outlet Heatmap</TabsTrigger>
          <TabsTrigger value="competitors">Competitors</TabsTrigger>
          <TabsTrigger value="reports">Reports & Exports</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Sentiment Trend Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Sentiment Trend</CardTitle>
                <CardDescription>Daily sentiment distribution over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={sentimentTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={(date) => new Date(date).getDate().toString()} />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="positive" 
                      stackId="1" 
                      stroke={sentimentColors.positive} 
                      fill={sentimentColors.positive}
                      fillOpacity={0.6}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="neutral" 
                      stackId="1" 
                      stroke={sentimentColors.neutral} 
                      fill={sentimentColors.neutral}
                      fillOpacity={0.6}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="negative" 
                      stackId="1" 
                      stroke={sentimentColors.negative} 
                      fill={sentimentColors.negative}
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Category Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Category Performance</CardTitle>
                <CardDescription>Sentiment distribution by food category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryData.map((category, index) => {
                    const positivePercent = calculateSentimentPercentage(category.positive, category.total);
                    return (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">{category.name}</span>
                            <span className="text-xs text-muted-foreground">{category.total} reviews</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Progress value={positivePercent} className="flex-1" />
                            <span className="text-sm font-medium">{positivePercent}%</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Reviews Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity Summary</CardTitle>
              <CardDescription>Key metrics from the last 24 hours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex items-center space-x-2">
                  <ThumbsUp className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">Positive Reviews</p>
                    <p className="text-2xl font-bold text-green-600">34</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <ThumbsDown className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="text-sm font-medium">Negative Reviews</p>
                    <p className="text-2xl font-bold text-red-600">7</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Responses Sent</p>
                    <p className="text-2xl font-bold text-blue-600">28</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Dish Performance Tab */}
        <TabsContent value="dishes" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Dish & Category Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Sentiment analysis for individual dishes and categories
              </p>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="main">Main Course</SelectItem>
                <SelectItem value="pizza">Pizza</SelectItem>
                <SelectItem value="rice">Rice Dishes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-6">
            {filteredDishPerformance.length === 0 ? (
              <Alert>
                <AlertTitle>No dishes found for selected filters.</AlertTitle>
                <AlertDescription>Try adjusting your filters or search term.</AlertDescription>
              </Alert>
            ) : (
              filteredDishPerformance.map((dish) => (
                <Card key={dish.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{dish.name}</CardTitle>
                        <CardDescription>{dish.category} • {dish.totalMentions} mentions</CardDescription>
                      </div>
                      <Badge variant="outline" className="text-lg px-3 py-1">
                        {Math.round(dish.avgSentiment * 100)}%
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Sentiment Distribution */}
                    <div>
                      <h4 className="text-sm font-medium mb-3">Sentiment Distribution</h4>
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <ThumbsUp className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium">Positive</span>
                          </div>
                          <span className="text-lg font-bold text-green-600">{dish.positive}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <span className="h-4 w-4 bg-gray-400 rounded-full"></span>
                            <span className="text-sm font-medium">Neutral</span>
                          </div>
                          <span className="text-lg font-bold text-gray-600">{dish.neutral}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <ThumbsDown className="h-4 w-4 text-red-600" />
                            <span className="text-sm font-medium">Negative</span>
                          </div>
                          <span className="text-lg font-bold text-red-600">{dish.negative}</span>
                        </div>
                      </div>
                    </div>

                    {/* Customer Type Comparison */}
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <h4 className="text-sm font-medium mb-3">New vs Repeat Customers</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">New Customers</span>
                            <span className="text-sm font-medium">
                              {Math.round(dish.newCustomerSentiment * 100)}%
                            </span>
                          </div>
                          <Progress value={dish.newCustomerSentiment * 100} />
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Repeat Customers</span>
                            <span className="text-sm font-medium">
                              {Math.round(dish.repeatCustomerSentiment * 100)}%
                            </span>
                          </div>
                          <Progress value={dish.repeatCustomerSentiment * 100} />
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-3">Top Complaints</h4>
                        <div className="space-y-2">
                          {dish.topComplaints.map((complaint, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <AlertTriangle className="h-4 w-4 text-orange-500" />
                              <span className="text-sm">{complaint}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Outlet Heatmap Tab */}
        <TabsContent value="outlets" className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Outlet Performance Heatmap</h3>
            <p className="text-sm text-muted-foreground mb-4">
              City → Area → Store sentiment and response performance
            </p>
          </div>

          <div className="grid gap-4">
            {filteredOutletData.length === 0 ? (
              <Alert>
                <AlertTitle>No outlets found for selected filters.</AlertTitle>
                <AlertDescription>Try adjusting your filters or search term.</AlertDescription>
              </Alert>
            ) : (
              filteredOutletData.map((outlet) => (
                <Card key={outlet.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <MapPin className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <CardTitle className="text-lg">{outlet.name}</CardTitle>
                          <CardDescription>{outlet.area}, {outlet.city}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium">{outlet.rating}</span>
                        <span className="text-sm text-muted-foreground">({outlet.reviewCount})</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 md:grid-cols-2">
                      {/* Performance Metrics */}
                      <div className="space-y-4">
                        <h4 className="text-sm font-medium">Performance Metrics</h4>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm">Sentiment Score</span>
                              <span className="text-sm font-medium">
                                {Math.round(outlet.sentimentScore * 100)}%
                              </span>
                            </div>
                            <Progress 
                              value={outlet.sentimentScore * 100} 
                              className={`h-2 ${outlet.sentimentScore > 0.8 ? 'bg-green-100' : outlet.sentimentScore > 0.6 ? 'bg-yellow-100' : 'bg-red-100'}`}
                            />
                          </div>
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm">Response Rate</span>
                              <span className="text-sm font-medium">{outlet.responseRate}%</span>
                            </div>
                            <Progress value={outlet.responseRate} className="h-2" />
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Avg Response Time</span>
                            <span className="text-sm font-medium">{outlet.avgResponseTime}h</span>
                          </div>
                        </div>
                      </div>

                      {/* Google Business Metrics */}
                      <div className="space-y-4">
                        <h4 className="text-sm font-medium">Google Business Performance</h4>
                        <div className="grid gap-3 grid-cols-3">
                          <div className="text-center p-2 bg-gray-50 rounded">
                            <Eye className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                            <p className="text-xs text-muted-foreground">Views</p>
                            <p className="text-sm font-medium">{formatNumber(outlet.profileViews)}</p>
                          </div>
                          <div className="text-center p-2 bg-gray-50 rounded">
                            <Phone className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                            <p className="text-xs text-muted-foreground">Calls</p>
                            <p className="text-sm font-medium">{outlet.calls}</p>
                          </div>
                          <div className="text-center p-2 bg-gray-50 rounded">
                            <Globe className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                            <p className="text-xs text-muted-foreground">Website</p>
                            <p className="text-sm font-medium">{outlet.websiteClicks}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* City-wise Summary Chart */}
          <Card>
            <CardHeader>
              <CardTitle>City-wise Performance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={[
                  { city: "Mumbai", avgRating: 4.0, avgSentiment: 72, responseRate: 81 },
                  { city: "Delhi", avgRating: 4.5, avgSentiment: 82, responseRate: 94 },
                  { city: "Bangalore", avgRating: 3.9, avgSentiment: 68, responseRate: 76 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="city" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="avgSentiment" fill="#3b82f6" name="Sentiment %" />
                  <Bar dataKey="responseRate" fill="#10b981" name="Response Rate %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Competitors Tab */}
        <TabsContent value="competitors" className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Competitor Analysis</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Side-by-side comparison with competitors in your area
            </p>
          </div>

          {/* Competitor Comparison Table */}
          <Card>
            <CardHeader>
              <CardTitle>Competitive Benchmarking</CardTitle>
              <CardDescription>Compare ratings, sentiment, and response metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Brand</th>
                      <th className="text-center p-2">Rating</th>
                      <th className="text-center p-2">Reviews</th>
                      <th className="text-center p-2">Sentiment</th>
                      <th className="text-center p-2">Avg Response</th>
                      <th className="text-center p-2">Locations</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b bg-blue-50">
                      <td className="p-3">
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary">Your Brand</Badge>
                          <span className="font-medium">Your Restaurant</span>
                        </div>
                      </td>
                      <td className="text-center p-3">
                        <div className="flex items-center justify-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="font-medium">4.2</span>
                        </div>
                      </td>
                      <td className="text-center p-3 font-medium">1,247</td>
                      <td className="text-center p-3">
                        <Badge className="bg-green-100 text-green-800">72%</Badge>
                      </td>
                      <td className="text-center p-3 font-medium">4.2h</td>
                      <td className="text-center p-3 font-medium">3</td>
                    </tr>
                    {filteredCompetitorData.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-4 text-muted-foreground">
                          No competitors found for selected filters.
                        </td>
                      </tr>
                    ) : (
                      filteredCompetitorData.map((competitor) => (
                        <tr key={competitor.id} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-medium">{competitor.name}</td>
                          <td className="text-center p-3">
                            <div className="flex items-center justify-center space-x-1">
                              <Star className="h-4 w-4 text-yellow-500" />
                              <span>{competitor.rating}</span>
                            </div>
                          </td>
                          <td className="text-center p-3">{formatNumber(competitor.reviewCount)}</td>
                          <td className="text-center p-3">
                            <Badge 
                              className={
                                competitor.sentimentScore > 0.75 
                                  ? "bg-green-100 text-green-800" 
                                  : competitor.sentimentScore > 0.65 
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }
                            >
                              {Math.round(competitor.sentimentScore * 100)}%
                            </Badge>
                          </td>
                          <td className="text-center p-3">{competitor.avgResponseTime}h</td>
                          <td className="text-center p-3">{competitor.locations}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Competitive Insights */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Market Position</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="rating" 
                      domain={[3.5, 4.5]} 
                      label={{ value: 'Rating', position: 'insideBottom', offset: -10 }}
                    />
                    <YAxis 
                      dataKey="sentimentScore" 
                      domain={[0.6, 0.9]}
                      label={{ value: 'Sentiment Score', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip />
                    <Scatter
                      data={[
                        { name: "Your Restaurant", rating: 4.2, sentimentScore: 0.72, size: 1247 },
                        ...filteredCompetitorData.map(c => ({
                          name: c.name,
                          rating: c.rating,
                          sentimentScore: c.sentimentScore,
                          size: c.reviewCount
                        }))
                      ]}
                      fill="#3b82f6"
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Competitive Advantages</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Fastest Response Time</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">4.2h vs 5.6h avg</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium">Below Market Rating</span>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">4.2 vs 4.1 avg</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Strong Review Volume</span>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">1.2K vs 1.1K avg</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Reports & Exports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Reports & Export Center</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Schedule automated reports, access pre-built insights, build custom exports, and manage report access/history.
            </p>
          </div>
          <Tabs value={reportTab} onValueChange={setReportTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-4 mb-2">
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="prebuilt">Pre-built Reports</TabsTrigger>
              <TabsTrigger value="custom">Custom Export Builder</TabsTrigger>
              <TabsTrigger value="history">Access & History</TabsTrigger>
            </TabsList>

            {/* Schedule Tab */}
            <TabsContent value="schedule">
              <Card>
                <CardHeader>
                  <CardTitle>Automated Report Scheduling</CardTitle>
                  <CardDescription>
                    Set up daily, weekly, or monthly email reports (Excel/PDF). <span className="text-muted-foreground">(Export logic not implemented)</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-4 flex-wrap">
                    <Label className="w-32">Frequency</Label>
                    <Select defaultValue="daily">
                      <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                    <Label className="w-32">Format</Label>
                    <Select defaultValue="excel">
                      <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                        <SelectItem value="pdf">PDF (.pdf)</SelectItem>
                      </SelectContent>
                    </Select>
                    <Label className="w-32">Recipients</Label>
                    <Input placeholder="Email addresses (comma separated)" className="w-64" />
                  </div>
                  <Button variant="default" className="mt-4" disabled>
                    Schedule Report
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Pre-built Reports Tab */}
            <TabsContent value="prebuilt">
              <Card>
                <CardHeader>
                  <CardTitle>Pre-built Reports</CardTitle>
                  <CardDescription>
                    Quick access to common insights and analytics.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Top Defaulter Dishes (New Users)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => exportToExcel(getTopDefaulterDishesExcel(), "TopDefaulterDishes.xlsx")}
                        >
                          Download Excel
                        </Button>
                        <Button variant="outline" size="sm" className="ml-2" disabled>
                          Download PDF
                        </Button>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>New vs Repeat Sentiment</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => exportToExcel(getNewVsRepeatSentimentExcel(), "NewVsRepeatSentiment.xlsx")}
                        >
                          Download Excel
                        </Button>
                        <Button variant="outline" size="sm" className="ml-2" disabled>
                          Download PDF
                        </Button>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>ASV/AOV Sentiment</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => exportToExcel(getASVAOVSentimentExcel(), "ASVAOVSentiment.xlsx")}
                        >
                          Download Excel
                        </Button>
                        <Button variant="outline" size="sm" className="ml-2" disabled>
                          Download PDF
                        </Button>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Page vs Food Ratings</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => exportToExcel(getPageVsFoodRatingsExcel(), "PageVsFoodRatings.xlsx")}
                        >
                          Download Excel
                        </Button>
                        <Button variant="outline" size="sm" className="ml-2" disabled>
                          Download PDF
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Custom Export Builder Tab */}
            <TabsContent value="custom">
              <Card>
                <CardHeader>
                  <CardTitle>Custom Export Builder</CardTitle>
                  <CardDescription>
                    Select filters, columns, and export format for your custom report.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-4 flex-wrap">
                    <Label className="w-32">Filter</Label>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Data</SelectItem>
                        <SelectItem value="positive">Positive Sentiment</SelectItem>
                        <SelectItem value="negative">Negative Sentiment</SelectItem>
                        <SelectItem value="new">New Users</SelectItem>
                        <SelectItem value="repeat">Repeat Users</SelectItem>
                      </SelectContent>
                    </Select>
                    <Label className="w-32">Columns</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="w-48 justify-between">
                          Select Columns <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-56 p-2">
                        <div className="max-h-48 overflow-y-auto">
                          {["Dish Name", "Category", "Sentiment", "User Type", "Outlet", "Date", "Complaint", "Rating"].map(col => (
                            <label key={col} className="flex items-center gap-2 py-1 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={customExportCols.includes(col)}
                                onChange={e => {
                                  if (e.target.checked) {
                                    setCustomExportCols([...customExportCols, col]);
                                  } else {
                                    setCustomExportCols(customExportCols.filter(c => c !== col));
                                  }
                                }}
                                className="accent-primary"
                              />
                              <span className="text-sm">{col}</span>
                            </label>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                    <Label className="w-32">Format</Label>
                    <Select defaultValue="excel">
                      <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                        <SelectItem value="pdf">PDF (.pdf)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    variant="default"
                    className="mt-4"
                    onClick={() => exportToExcel(getCustomExportExcel(customExportCols), "CustomExport.xlsx")}
                  >
                    Export Custom Report
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Access & History Tab */}
            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle>Report Access & History</CardTitle>
                  <CardDescription>
                    Manage who can access reports and view export/download history.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="mb-4">
                    <Label className="block mb-2">Grant Access</Label>
                    <Input placeholder="Add user email..." className="w-64 inline-block mr-2" />
                    <Button variant="default" size="sm">Grant</Button>
                  </div>
                  <div>
                    <Label className="block mb-2">Download History</Label>
                    <div className="border rounded p-2 bg-muted">
                      <div className="flex justify-between py-1">
                        <span className="text-sm">2024-06-01 • Top Defaulter Dishes • Excel</span>
                        <span className="text-xs text-muted-foreground">by admin</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-sm">2024-05-28 • Custom Export • PDF</span>
                        <span className="text-xs text-muted-foreground">by manager</span>
                      </div>
                      {/* ...more history rows... */}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
}

"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartConfig,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs"

export const description =
  "An interactive area chart showing digital marketing metrics."

const chartData = [
  { date: "2024-04-01", googleAds: 120, metaAds: 80, campaigns: 60, instagram: 40, reviews: 20 },
  { date: "2024-04-02", googleAds: 140, metaAds: 90, campaigns: 70, instagram: 50, reviews: 25 },
  { date: "2024-04-03", googleAds: 160, metaAds: 100, campaigns: 80, instagram: 60, reviews: 30 },
  { date: "2024-04-04", googleAds: 130, metaAds: 85, campaigns: 65, instagram: 45, reviews: 22 },
  { date: "2024-04-05", googleAds: 180, metaAds: 110, campaigns: 90, instagram: 70, reviews: 35 },
  { date: "2024-04-06", googleAds: 200, metaAds: 120, campaigns: 100, instagram: 80, reviews: 40 },
  { date: "2024-04-07", googleAds: 190, metaAds: 115, campaigns: 95, instagram: 75, reviews: 38 },
  { date: "2024-04-08", googleAds: 210, metaAds: 125, campaigns: 105, instagram: 85, reviews: 42 },
  { date: "2024-04-09", googleAds: 220, metaAds: 130, campaigns: 110, instagram: 90, reviews: 45 },
  { date: "2024-04-10", googleAds: 230, metaAds: 135, campaigns: 115, instagram: 95, reviews: 48 },
  { date: "2024-04-11", googleAds: 240, metaAds: 140, campaigns: 120, instagram: 100, reviews: 50 },
]

const chartConfig = {
  googleAds: {
    label: "Google Ads",
    color: "chart-1",
  },
  metaAds: {
    label: "Meta Ads",
    color: "chart-2",
  },
  campaigns: {
    label: "Campaigns",
    color: "chart-3",
  },
  instagram: {
    label: "Instagram Engagement",
    color: "chart-4",
  },
  reviews: {
    label: "Reviews",
    color: "chart-5",
  },
} satisfies ChartConfig

const chartKeys = [
  { key: "googleAds", label: "Google Adspend" },
  { key: "metaAds", label: "Meta Adspend" },
  { key: "campaigns", label: "Campaigns ROAS" },
  { key: "instagram", label: "Instagram CTR" },
  { key: "reviews", label: "Reviews" },
]

const chartTailwindColors = [
  "bg-chart-1 text-chart-1",
  "bg-chart-2 text-chart-2",
  "bg-chart-3 text-chart-3",
  "bg-chart-4 text-chart-4",
  "bg-chart-5 text-chart-5",
]

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [activeTab, setActiveTab] = React.useState(chartKeys[0].key)

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Digital Marketing Overview</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Metrics for the last 3 months
          </span>
          <span className="@[540px]/card:hidden">Last 3 months</span>
        </CardDescription>
        <CardAction>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="flex gap-2">
              {chartKeys.map((item, idx) => (
                <TabsTrigger
                  key={item.key}
                  value={item.key}
                  className={`px-4 py-2 rounded-lg !text-white font-medium transition-colors ${chartTailwindColors[idx]} data-[state=active]:bg-opacity-20`}
                >
                  {item.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={chartData}>
            <defs>
              {chartKeys.map((item, idx) => (
                <linearGradient
                  key={item.key}
                  id={`fill${item.key}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={`var(--${chartConfig[item.key as keyof typeof chartConfig].color})`}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={`var(--${chartConfig[item.key as keyof typeof chartConfig].color})`}
                    stopOpacity={0.1}
                  />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-IN", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <YAxis hide />
            <ChartTooltip
              cursor={false}
              defaultIndex={isMobile ? -1 : 4}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-IN", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey={activeTab}
              type="natural"
              fill={`url(#fill${activeTab})`}
              stroke={`var(--${chartConfig[activeTab as keyof typeof chartConfig].color})`}
              strokeWidth={2}
              dot
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

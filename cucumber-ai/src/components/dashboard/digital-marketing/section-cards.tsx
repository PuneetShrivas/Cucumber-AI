"use client"

import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
    Card,
    CardAction,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export function SectionCards() {
    return (
        <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
          <Card className="@container/card">
        <CardHeader>
          <CardDescription>Google/Meta Ads</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            ₹85,000
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp className="mr-1 h-4 w-4" />
              +15.2% ROAS
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Higher conversions <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Compared to last 6 months
          </div>
        </CardFooter>
          </Card>

          <Card className="@container/card">
        <CardHeader>
          <CardDescription>Campaigns</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            5 active
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingDown className="mr-1 h-4 w-4" />
              -8% reach
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Engagement dip <IconTrendingDown className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Review targeting strategy
          </div>
        </CardFooter>
          </Card>

          <Card className="@container/card">
        <CardHeader>
          <CardDescription>Instagram</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            7 actions
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp className="mr-1 h-4 w-4" />
              +22%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Strong audience growth <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Content performing well</div>
        </CardFooter>
          </Card>

          <Card className="@container/card">
        <CardHeader>
          <CardDescription>Reviews Management</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            4.6 avg
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp className="mr-1 h-4 w-4" />
              +5.1%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Positive feedback <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Improved response rate
          </div>
        </CardFooter>
          </Card>
        </div>
    )
}

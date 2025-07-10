"use client"

import * as React from "react"
import {
  LayoutDashboard,
  UtensilsCrossed,
  ChefHat,
  Table2,
  LocateFixed,
  ClipboardList,
  IndianRupee,
  BadgePercent,
  Leaf,
  Boxes,
  ShoppingCart,
  Truck,
  Trash2,
  Users,
  Gift,
  MessageSquare,
  Megaphone,
  UserCog,
  CalendarClock,
  ActivitySquare,
  GraduationCap,
  BarChart3,
  FileBarChart,
  LineChart,
  PieChart,
  Settings,
  Banknote,
  PlugZap,
} from "lucide-react"
import {
  Bolt,
  BrainCircuit,
  HelpCircle,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { NavSecondary } from "@/components/nav-secondary"
import { NavDocuments } from "@/components/nav-documents"
import { IconHelp, IconReceipt2, IconSearch } from "@tabler/icons-react"

const navItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Live Operations",
    icon: UtensilsCrossed,
    items: [
      { title: "POS Terminal", url: "/live-operations/pos-terminal", icon: ChefHat },
      { title: "Kitchen Display", url: "/live-operations/kitchen-display", icon: LocateFixed },
      { title: "Table Management", url: "/live-operations/table-management", icon: Table2 },
      { title: "Order Tracking", url: "/live-operations/order-tracking", icon: ClipboardList },
    ],
  },
  {
    title: "Menu Management",
    icon: Leaf,
    items: [
      { title: "Items & Categories", url: "/menu-management/items-categories", icon: ClipboardList },
      { title: "Pricing & Variants", url: "/menu-management/pricing-variants", icon: IndianRupee },
      { title: "Availability Control", url: "/menu-management/availability-control", icon: BadgePercent },
      { title: "Nutritional Info", url: "/menu-management/nutritional-info", icon: Leaf },
    ],
  },
  {
    title: "Inventory",
    icon: Boxes,
    items: [
      { title: "Stock Levels", url: "/inventory/stock-levels", icon: Boxes },
      { title: "Purchase Orders", url: "/inventory/purchase-orders", icon: ShoppingCart },
      { title: "Supplier Management", url: "/inventory/supplier-management", icon: Truck },
      { title: "Waste Tracking", url: "/inventory/waste-tracking", icon: Trash2 },
    ],
  },
  {
    title: "Customer Management",
    icon: Users,
    items: [
      { title: "Customer Profiles", url: "/customer-management/customer-profiles", icon: Users },
      { title: "Loyalty Programs", url: "/customer-management/loyalty-programs", icon: Gift },
      { title: "Feedback Management", url: "/customer-management/feedback-management", icon: MessageSquare },
      { title: "Marketing Campaigns", url: "/customer-management/marketing-campaigns", icon: Megaphone },
    ],
  },
  {
    title: "Staff Management",
    icon: UserCog,
    items: [
      { title: "Employee Profiles", url: "/staff-management/employee-profiles", icon: UserCog },
      { title: "Scheduling", url: "/staff-management/scheduling", icon: CalendarClock },
      { title: "Performance Tracking", url: "/staff-management/performance-tracking", icon: ActivitySquare },
      { title: "Training Management", url: "/staff-management/training-management", icon: GraduationCap },
    ],
  },
  {
    title: "Analytics & Reports",
    icon: BarChart3,
    items: [
      { title: "Sales Reports", url: "/analytics-reports/sales-reports", icon: FileBarChart },
      { title: "Performance Analytics", url: "/analytics-reports/performance-analytics", icon: LineChart },
      { title: "Customer Insights", url: "/analytics-reports/customer-insights", icon: PieChart },
      { title: "Operational Metrics", url: "/analytics-reports/operational-metrics", icon: BarChart3 },
    ],
  },
  {
    title: "Settings & Configuration",
    icon: Settings,
    items: [
      { title: "Restaurant Profile", url: "/settings-configuration/restaurant-profile", icon: ClipboardList },
      { title: "Payment Settings", url: "/settings-configuration/payment-settings", icon: Banknote },
      { title: "Tax Configuration", url: "/settings-configuration/tax-configuration", icon: IndianRupee },
      { title: "Integration Settings", url: "/settings-configuration/integration-settings", icon: PlugZap },
    ],
  },
]


const aiAssistantItems = [
  {
    name: "Quick Actions",
    url: "/ai-assistant/quick-actions",
    icon: Bolt,
  },
  {
    name: "Recommendations",
    url: "/ai-assistant/recommendations",
    icon: BrainCircuit,
  },
  {
    name: "Training Center",
    url: "/ai-assistant/training-center",
    icon: GraduationCap,
  },
  {
    name: "Help & Support",
    url: "/ai-assistant/help-support",
    icon: HelpCircle,
  },
]

const user = {
  name: "Cucumber Admin",
  email: "admin@cucumber.ai",
  avatar: "/avatars/admin.jpg",
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/">
                {/* <IconReceipt2 className="!size-5" /> */}
                <span className="text-base font-semibold">Cucumber AI</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navItems} />
        <NavDocuments items={aiAssistantItems} />
        <NavSecondary
          items={[
            { title: "Search", url: "#", icon: IconSearch },
            { title: "Get Help", url: "/ai-assistant/help-support", icon: IconHelp },
          ]}
          className="mt-auto"
        />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}

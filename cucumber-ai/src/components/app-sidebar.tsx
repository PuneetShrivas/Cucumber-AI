"use client"
import { createClient } from '@/lib/supabase/client'
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
  Camera,
  ChartBarIncreasingIcon,
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
import { User } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { ChevronDown } from "lucide-react"
import Fuse from "fuse.js"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { set } from 'zod'

const majorNavItems = [
  {
    title: "POS",
    url: "/dashboard/live-operations/pos",
    icon: ChefHat,
  },
  {
    title: "Kitchen",
    url: "/dashboard/live-operations/kitchen-display",
    icon: LocateFixed,
  },
  {
    title: "Menu",
    url: "/dashboard/menu-management",
    icon: Leaf,
  },
  {
    title: "Staff",
    url: "/dashboard/staff-management/employee-profiles",
    icon: UserCog,
  },
  {
    title: "Analytics",
    url: "/dashboard",
    icon: BarChart3,
  },
  {
    title: "Digital Marketing",
    url: "/dashboard/digital-marketing",
    icon: Megaphone,
  },
  {
    title: "AI Assistant",
    url: "/dashboard/ai-assistant/",
    icon: Bolt,
  },
]

const accordionNavItems = [
  {
    title: "Live Operations",
    icon: UtensilsCrossed,
    items: [
      { title: "POS Terminal", url: "/dashboard/live-operations/pos", icon: ChefHat },
      { title: "Kitchen Display", url: "/dashboard/live-operations/kitchen-display", icon: LocateFixed },
      { title: "Table Management", url: "/dashboard/live-operations/table-management", icon: Table2 },
      { title: "Order Tracking", url: "/dashboard/live-operations/order-tracking", icon: ClipboardList },
      { title: "Deliveries", url: "/dashboard/live-operations/deliveries", icon: Truck },
    ],
  },
  {
    title: "Menu Management",
    icon: Leaf,
    items: [
      { title: "Items & Categories", url: "/dashboard/menu-management/items-categories", icon: ClipboardList },
      { title: "Pricing & Variants", url: "/dashboard/menu-management/pricing-variants", icon: IndianRupee },
      { title: "Availability Control", url: "/dashboard/menu-management/availability-control", icon: BadgePercent },
      { title: "Nutritional Info", url: "/dashboard/menu-management/nutritional-info", icon: Leaf },
    ],
  },
  {
    title: "Inventory",
    icon: Boxes,
    items: [
      { title: "Stock Levels", url: "/dashboard/inventory/stock-levels", icon: Boxes },
      { title: "Purchase Orders", url: "/dashboard/inventory/purchase-orders", icon: ShoppingCart },
      { title: "Supplier Management", url: "/dashboard/inventory/supplier-management", icon: Truck },
      { title: "Waste Tracking", url: "/dashboard/inventory/waste-tracking", icon: Trash2 },
    ],
  },
  {
    title: "Customer Management",
    icon: Users,
    items: [
      { title: "Customer Profiles", url: "/dashboard/customer-management/customer-profiles", icon: Users },
      { title: "Loyalty Programs", url: "/dashboard/customer-management/loyalty-programs", icon: Gift },
      { title: "Feedback Management", url: "/dashboard/customer-management/feedback-management", icon: MessageSquare },
      { title: "Marketing Campaigns", url: "/dashboard/customer-management/marketing-campaigns", icon: Megaphone },
    ],
  },
  {
    title: "Staff Management",
    icon: UserCog,
    items: [
      { title: "Employee Profiles", url: "/dashboard/staff-management/employee-profiles", icon: UserCog },
      { title: "Scheduling", url: "/dashboard/staff-management/scheduling", icon: CalendarClock },
      { title: "Performance Tracking", url: "/dashboard/staff-management/performance-tracking", icon: ActivitySquare },
      { title: "Training Management", url: "/dashboard/staff-management/training-management", icon: GraduationCap },
    ],
  },
  {
    title: "Analytics & Reports",
    icon: BarChart3,
    items: [
      { title: "Sales Reports", url: "/dashboard/analytics/sales-reports", icon: FileBarChart },
      { title: "Performance Analytics", url: "/dashboard/analytics/performance-analytics", icon: LineChart },
      { title: "Customer Insights", url: "/dashboard/analytics/customer-insights", icon: PieChart },
      { title: "Operational Metrics", url: "/dashboard/analytics/operational-metrics", icon: BarChart3 },
    ],
  },
  {
    title: "Digital Marketing",
    icon: Megaphone,
    items: [
      { title: "Dashboard", url: "/dashboard/digital-marketing", icon: ChartBarIncreasingIcon },
      { title: "Google & Meta Ads", url: "/dashboard/digital-marketing/google-meta-ads", icon: Megaphone },
      { title: "Campaigns & Promotions", url: "/dashboard/digital-marketing/campaigns-promotions", icon: Gift },
      { title: "Reviews Management", url: "/dashboard/digital-marketing/reviews-management", icon: MessageSquare },
      { title: "Instagram Management", url: "/dashboard/digital-marketing/instagram-management", icon: Camera },
      { title: "SEO Optimization", url: "/dashboard/digital-marketing/seo-optimization", icon: Leaf },
    ],
  },
  {
    title: "Settings & Configuration",
    icon: Settings,
    items: [
      { title: "Restaurant Profile", url: "/dashboard/settings/restaurant-profile", icon: ClipboardList },
      { title: "Payment Settings", url: "/dashboard/settings/payment-settings", icon: Banknote },
      { title: "Tax Configuration", url: "/dashboard/settings/tax-configuration", icon: IndianRupee },
      { title: "Integration Settings", url: "/dashboard/settings/integration-settings", icon: PlugZap },
    ],
  },
]

const aiAssistantItems = [
  {
    name: "Quick Actions",
    url: "/dashboard/ai-assistant/",
    icon: Bolt,
  },
  {
    name: "Recommendations",
    url: "/dashboard/ai-assistant/recommendations",
    icon: BrainCircuit,
  },
  {
    name: "Training Center",
    url: "/dashboard/ai-assistant/training-center",
    icon: GraduationCap,
  },
  {
    name: "Help & Support",
    url: "/dashboard/ai-assistant/help-support",
    icon: HelpCircle,
  },
]

// Accordion component for sidebar
function SidebarAccordion({ items }: { items: typeof accordionNavItems }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [currentPath, setCurrentPath] = useState<string>("")

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentPath(window.location.pathname)
    }
  }, [])

  useEffect(() => {
    // Open the section if any of its items matches the current path
    const idx = items.findIndex(section =>
      section.items.some(item => item.url === currentPath)
    )
    if (idx !== -1) setOpenIndex(idx)
  }, [currentPath, items])

  return (
    <div className="mt-4">
      {items.map((section, idx) => {
        const isSectionActive = section.items.some(item => item.url === currentPath)
        return (
          <div key={section.title}>
            <button
              className={`flex w-full items-center justify-between px-3 py-2 rounded hover:bg-muted transition ${isSectionActive ? "bg-muted font-semibold" : ""}`}
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              aria-expanded={openIndex === idx}
            >
              <span className="flex items-center gap-2">
                <section.icon className="size-4" />
                <span className="text-sm">{section.title}</span>
              </span>
              <ChevronDown
                className={`size-4 transition-transform ${openIndex === idx ? "rotate-180" : ""}`}
              />
            </button>
            {openIndex === idx && (
              <div className="pl-8 pb-2">
                {section.items.map((item) => {
                  const isActive = item.url === currentPath
                  return (
                    <a
                      key={item.title}
                      href={item.url}
                      className={`flex items-center gap-2 py-1 text-sm transition rounded px-1
                        ${isActive ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:text-primary"}
                      `}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <item.icon className="size-3.5" />
                      {item.title}
                    </a>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

const allNavItems = [
  ...majorNavItems.map(item => ({
    title: item.title,
    url: item.url,
    icon: item.icon,
    section: "Major",
  })),
  ...accordionNavItems.flatMap(section =>
    section.items.map(item => ({
      title: item.title,
      url: item.url,
      icon: item.icon,
      section: section.title,
    }))
  ),
  ...aiAssistantItems.map(item => ({
    title: item.name,
    url: item.url,
    icon: item.icon,
    section: "AI Assistant",
  })),
]

function SidebarSearch() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<typeof allNavItems>([])
  const fuse = React.useMemo(
    () =>
      new Fuse(allNavItems, {
        keys: ["title", "section"],
        threshold: 0.4,
      }),
    []
  )

  useEffect(() => {
    if (query.trim().length === 0) {
      setResults([])
      return
    }
    setResults(fuse.search(query).map(res => res.item))
  }, [query, fuse])

  const [dropdownOpen, setDropdownOpen] = useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const wrapperRef = React.useRef<HTMLDivElement>(null)

  useEffect(() => {
    setDropdownOpen(results.length > 0 && query.trim().length > 3)
  }, [results, query])

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!dropdownOpen) return
    function handleClick(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false)
        setQuery("")
      }
    }
    document.addEventListener("mousedown", handleClick)
    // Clear query when dropdown closes
    return () => document.removeEventListener("mousedown", handleClick)
  }, [dropdownOpen])

  return (
    <div className="mt-2 -my-2 px-3" ref={wrapperRef}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search menu..."
          className="w-full px-8 py-1 rounded border border-muted bg-background text-sm focus:outline-none"
          id="sidebar-search-input"
          autoComplete="off"
          onFocus={() => setDropdownOpen(results.length > 0 && query.trim().length > 0)}
        />
        <IconSearch className="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
      </div>
      <DropdownMenu open={dropdownOpen} modal={false}>
        <DropdownMenuTrigger asChild>
          {/* Hidden trigger, just to anchor the menu to the input */}
          <span tabIndex={-1} />
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" align="start" className="w-[calc(100%-24px)] max-h-56 overflow-auto" style={{ marginLeft: 240 }}>
          {results.map(item => (
            <DropdownMenuItem asChild key={item.url}>
              <a
                href={item.url}
                className="flex items-center gap-2 px-2 py-1 rounded hover:bg-muted transition text-sm w-full"
                onClick={() => setDropdownOpen(false)}
              >
                <item.icon className="size-4" />
                <span>{item.title}</span>
              </a>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);
  const [restaurant, setRestaurant] = useState<{ id: string; name: string } | null>(null);
  const [locations, setLocations] = useState<{ id: string; name: string }[]>([]);
  const [activeLocation, setActiveLocation] = useState<string | null>(null);
  useEffect(() => {
    window.localStorage.setItem("organizationId", restaurant?.id || "");
  }, [restaurant]);
  useEffect(() => {
    if (!user) return;
    const fetchRestaurantAndLocations = async () => {
      // Get restaurant for this user
      const { data: orgs, error: orgErr } = await supabase
        .from("organizations")
        .select("id, name")
        .eq("owner_id", user.id)
        .limit(1)
        .maybeSingle();

      if (!orgs || orgErr) {
        window.location.href = "/dashboard/settings/restaurant-profile";
        return;
      }
      setRestaurant(orgs);

      // Get locations for this restaurant
      const { data: locs } = await supabase
        .from("locations")
        .select("id, name")
        .eq("organization_id", orgs.id)
        .order("created_at", { ascending: true });

      setLocations(locs || []);
      if (locs && locs.length > 0) setActiveLocation(locs[0].id);
      const storedLocation = window.localStorage.getItem("activeLocation");
      if (storedLocation && locs && locs.some(loc => loc.id === storedLocation)) {
        setActiveLocation(storedLocation);
      } else if (locs && locs.length > 0) {
        window.localStorage.setItem("activeLocation", locs[0].id);
      }
    };
    fetchRestaurantAndLocations();
  }, [user]);

  // Dropdown for restaurant name and locations
  const RestaurantDropdown = () => {
    if (!restaurant) return null;
    return (
      <div className="flex flex-col items-start gap-1 w-full">
        <a
          href="/dashboard/settings/restaurant-profile"
          className="flex items-center gap-2 text-base font-semibold px-2 py-1 hover:underline"
        >
          <ChefHat className="size-5 text-primary" />
          {restaurant.name}
        </a>
        {locations.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 px-2 py-1 rounded hover:bg-muted transition text-sm font-normal w-full">
                <LocateFixed className="size-4 text-muted-foreground" />
                {locations.find(l => l.id === activeLocation)?.name || "Select location"}
                <ChevronDown className="size-4 ml-1" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {locations.map(loc => (
                <DropdownMenuItem
                  key={loc.id}
                  onClick={() => {
                    setActiveLocation(loc.id);
                    window.localStorage.setItem("activeLocation", loc.id);
                  }}
                  className={activeLocation === loc.id ? "font-bold" : ""}
                >
                  <Table2 className="size-4 mr-2 text-muted-foreground" />
                  {loc.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    );
  };

  const [showMajor, setShowMajor] = useState(true);
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              {/* <a href="/dashboard/settings/restaurant-profile">
                <span className="text-b</DropdownMenuTrigger>ase font-semibold">{user?.user_metadata.restaurantName || "Cucumber AI"}  </span>
              </a> */}
              <RestaurantDropdown />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Major buttons accordion */}
        <div className="mt-2 mx-2">
          <button
            type="button"
            className="flex items-center justify-between w-full mb-1 p-1 rounded hover:bg-muted transition"
            aria-label="Toggle major sections"
            onClick={() => setShowMajor(prev => !prev)}
          >
            <span className="text-sm font-semibold">Quick Actions</span>
            <ChevronDown className={`size-4 transition-transform ${showMajor ? "" : "rotate-180"}`} />
          </button>
          {showMajor && (
            <div className="flex flex-col gap-1.5">
              {majorNavItems.map((item) => {
              const isActive = typeof window !== "undefined" && window.location.pathname === item.url
              const isAIAssistant = item.title === "AI Assistant"
              return (
                <a
                key={item.title}
                href={item.url}
                className={`
                  flex items-center gap-2 px-2.5 py-1.5 rounded-md font-semibold text-sm shadow
                  transition-all duration-150
                  bg-gradient-to-r
                  ${isActive
                  ? "from-[#206143] to-[#2E9C65]"
                  : "from-[#3CB97C] to-[#72E3AD]"}
                  hover:from-[#206143] hover:to-[#2E9C65]
                  text-white
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
                  border border-transparent
                  ${isActive ? "ring-2 ring-primary border-primary" : ""}
                  ${isAIAssistant
                  ? "eye-catching-button"
                  : ""
                  }
                `}
                style={{ letterSpacing: "0.01em" }}
                aria-current={isActive ? "page" : undefined}
                >
                <item.icon className="size-4 drop-shadow" />
                {item.title}
                </a>
              )
              })}
            </div>
          )}
        </div>

        <SidebarSearch />

        {/* Accordion menu */}
        <SidebarAccordion items={accordionNavItems} />

        {/* AI Assistant quick links */}
        {/* <NavDocuments items={aiAssistantItems} /> */}

        <NavSecondary
          items={[
            // { title: "Search", url: "/dashboard/#", icon: IconSearch },
            { title: "Get Help", url: "/dashboard//ai-assistant/help-support", icon: IconHelp },
          ]}
          className="mt-auto"
        />
      </SidebarContent>

      <SidebarFooter>
        {user && <NavUser user={user} />}
      </SidebarFooter>
    </Sidebar>
  )
}

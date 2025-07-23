import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import AdsManagementPage from "@/components/dashboard/digital-marketing/adsManagementPage"
import CampaignManagementPage from "@/components/dashboard/digital-marketing/campaignManagement"
import MenuPage from "@/components/dashboard/menu-management/MenuPage"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"


export default function Page() {
  return (
  <div>
        <SiteHeader title="Campaigns Management"/>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <CampaignManagementPage/>
              </div>
            </div>
          </div>
        </div>
   </div>   
  )
}

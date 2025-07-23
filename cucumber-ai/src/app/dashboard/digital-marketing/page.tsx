
import { SectionCards } from "@/components/dashboard/digital-marketing/section-cards"
import MenuPage from "@/components/dashboard/menu-management/MenuPage"
import { DataTable } from "@/components/data-table"
import { SiteHeader } from "@/components/site-header"
import data from "./data.json"
import { ChartAreaInteractive } from "@/components/dashboard/digital-marketing/chart-area-interactive"


export default function Page() {
    return (
        <div>
            <SiteHeader title="Digital Marketing Dashboard" />
            <div className="flex flex-1 flex-col">
                      <div className="@container/main flex flex-1 flex-col gap-2">
                        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                          <SectionCards />
                          <div className="px-4 lg:px-6">
                                <ChartAreaInteractive />
                            </div>
                            <DataTable data={data} />
                        </div>
                    </div>
                </div>
            </div>
    )
}

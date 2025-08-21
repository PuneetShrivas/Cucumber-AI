import KitchenDisplayPage from "@/components/dashboard/live-operations/kitchen"
import { SiteHeader } from "@/components/site-header"

export default function Page() {
  return (
  <div>
        <SiteHeader title="Kitchen Terminal" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <KitchenDisplayPage/>
              </div>
            </div>
          </div>
        </div>
   </div>   
  )
}

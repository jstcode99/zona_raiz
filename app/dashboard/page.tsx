import { DashboardStats } from "@/features/dashboard/dashboard-stats"
import { PropertyTypesChart } from "@/features/dashboard/property-types-chart"
import { cookies } from "next/headers";
import { COOKIE_NAMES } from "@/infrastructure/config/constants";
import { PropertyCountService } from "@/domain/services/property-count.service";
import { ListingCountService } from "@/domain/services/listing-count.service";
import { ListingViewsCountService } from "@/domain/services/listing-views-count.service";
import { ProfileCountService } from "@/domain/services/profile-count.service";
import { RealEstateCountService } from "@/domain/services/real-estate-count.service";
import { createPropertyModule } from "@/application/containers/property.container";
import { createListingModule } from "@/application/containers/listing.container";
import { createProfileModule } from "@/application/containers/profile.container";
import { createRealEstateModule } from "@/application/containers/real-estate.container";
import { getListAgentByRealEstateId } from "@/services/agent.services";
import { AgentList } from "@/features/agents/agent-list";
import { SkeletonAgentList } from "@/features/agents/skeleton-agent-list";
import { Separator } from "@/components/ui/separator";
import { Suspense } from "react";
import { AddAgentModal } from "@/features/agents/add-agent-modal";

function getMonthDateRange(date: Date): { start_date: string; end_date: string } {
  const year = date.getFullYear();
  const month = date.getMonth();
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0, 23, 59, 59, 999);

  return {
    start_date: startDate.toISOString(),
    end_date: endDate.toISOString(),
  };
}

function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}


export default async function DashboardPage() {
  const cookieStore = await cookies()
  const real_estate_id = cookieStore.get(COOKIE_NAMES.REAL_ESTATE)?.value as string

  const { repository: propertyRepository } = await createPropertyModule()
  const countService = new PropertyCountService(propertyRepository)

  const { repository: listingRepository } = await createListingModule()
  const listingCountService = new ListingCountService(listingRepository)
  const listingViewsCountService = new ListingViewsCountService(listingRepository)

  const { repository: profileRepository } = await createProfileModule()
  const profileCountService = new ProfileCountService(profileRepository)

  const { repository: realEstateRepository } = await createRealEstateModule()
  const realEstateCountService = new RealEstateCountService(realEstateRepository)

  const now = new Date()
  const currentMonthRange = getMonthDateRange(now)
  const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const previousMonthRange = getMonthDateRange(previousMonth)

  const currentMonthProperties = real_estate_id
    ? await countService.getCachedCountByRealEstateWithDateRange(real_estate_id, currentMonthRange.start_date, currentMonthRange.end_date)
    : await countService.getCachedCountWithDateRange(currentMonthRange.start_date, currentMonthRange.end_date)

  const previousMonthProperties = real_estate_id
    ? await countService.getCachedCountByRealEstateWithDateRange(real_estate_id, previousMonthRange.start_date, previousMonthRange.end_date)
    : await countService.getCachedCountWithDateRange(previousMonthRange.start_date, previousMonthRange.end_date)

  const activeProperties = currentMonthProperties
  const activePropertiesChange = calculatePercentageChange(currentMonthProperties, previousMonthProperties)

  const currentMonthListings = real_estate_id
    ? await listingCountService.getCachedCountByRealEstateWithDateRange(real_estate_id, currentMonthRange.start_date, currentMonthRange.end_date)
    : await listingCountService.getCachedCountWithDateRange(currentMonthRange.start_date, currentMonthRange.end_date)

  const previousMonthListings = real_estate_id
    ? await listingCountService.getCachedCountByRealEstateWithDateRange(real_estate_id, previousMonthRange.start_date, previousMonthRange.end_date)
    : await listingCountService.getCachedCountWithDateRange(previousMonthRange.start_date, previousMonthRange.end_date)

  const totalListings = currentMonthListings
  const totalListingsChange = calculatePercentageChange(currentMonthListings, previousMonthListings)

  const currentMonthVisits = real_estate_id
    ? await listingViewsCountService.getCachedCountByRealEstateWithDateRange(real_estate_id, currentMonthRange.start_date, currentMonthRange.end_date)
    : await listingViewsCountService.getCachedCountWithDateRange(currentMonthRange.start_date, currentMonthRange.end_date)

  const previousMonthVisits = real_estate_id
    ? await listingViewsCountService.getCachedCountByRealEstateWithDateRange(real_estate_id, previousMonthRange.start_date, previousMonthRange.end_date)
    : await listingViewsCountService.getCachedCountWithDateRange(previousMonthRange.start_date, previousMonthRange.end_date)

  const visits = currentMonthVisits
  const visitsChange = calculatePercentageChange(currentMonthVisits, previousMonthVisits)

  const currentMonthNewUsers = await profileCountService.getCachedCountWithDateRange(currentMonthRange.start_date, currentMonthRange.end_date)
  const previousMonthNewUsers = await profileCountService.getCachedCountWithDateRange(previousMonthRange.start_date, previousMonthRange.end_date)

  const newUsers = currentMonthNewUsers
  const newUsersChange = calculatePercentageChange(currentMonthNewUsers, previousMonthNewUsers)

  const currentMonthRealEstates = await realEstateCountService.getCachedCountWithDateRange(currentMonthRange.start_date, currentMonthRange.end_date)
  const previousMonthRealEstates = await realEstateCountService.getCachedCountWithDateRange(previousMonthRange.start_date, previousMonthRange.end_date)

  const totalRealEstates = currentMonthRealEstates
  const totalRealEstatesChange = calculatePercentageChange(currentMonthRealEstates, previousMonthRealEstates)

  const propertyTypesData = await countService.getCachedCountByTypes(real_estate_id)

  const agents = await getListAgentByRealEstateId(real_estate_id)

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <DashboardStats
            activeProperties={activeProperties}
            activePropertiesChange={activePropertiesChange}
            visits={visits}
            visitsChange={visitsChange}
            totalListings={totalListings}
            totalListingsChange={totalListingsChange}
            newUsers={newUsers}
            newUsersChange={newUsersChange}
            totalRealEstates={totalRealEstates}
            totalRealEstatesChange={totalRealEstatesChange}
            visibleCards={['properties', 'visits', 'listings', 'newUsers', 'realEstates']}
          />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 md:gap-6 md:py-6">
            <div className="lg:col-span-2">
              <PropertyTypesChart data={propertyTypesData} />
            </div>
            <div className="lg:col-span-1">
              <Suspense fallback={<SkeletonAgentList />}>
                <div className="bg-card rounded-xl border p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold">Agentes</h3>
                    <AddAgentModal real_estate_id={real_estate_id} />
                  </div>
                  <Separator className="mb-4" />
                  <AgentList
                    real_estate_id={real_estate_id}
                    agents={agents}
                  />
                </div>
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

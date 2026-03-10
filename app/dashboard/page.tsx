import { DashboardStats } from "@/features/dashboard/dashboard-stats"
import { PropertyTypesChart } from "@/features/dashboard/property-types-chart"
import { cookies } from "next/headers";
import { COOKIE_NAMES } from "@/infrastructure/config/constants";
import { PropertyCountService } from "@/domain/services/property-count.service";
import { ListingCountService } from "@/domain/services/listing-count.service";
import { ListingFeaturedService } from "@/domain/services/listing-featured.service";
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
import { FeaturedListingsSlider } from "@/features/dashboard/featured-listings-slider";
import {
  Card,
  CardHeader,
  CardTitle,
  CardAction,
  CardContent,
} from '@/components/ui/card';

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
  const listingFeaturedService = new ListingFeaturedService(listingRepository)

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

  const featuredListings = await listingFeaturedService.getCachedFeatured(10, real_estate_id)

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-5 auto-rows-[440px] px-4">

          {/* Row 1 */}
          <div className="md:col-span-3">
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
          </div>

          <div className="">
            <PropertyTypesChart data={propertyTypesData} />
          </div>

          <div className="">
            <Suspense fallback={<SkeletonAgentList />}>
              <Card className="pb-2">
                <CardHeader>
                  <CardTitle className="text-base">
                    Agentes
                  </CardTitle>
                  <CardAction>
                    <AddAgentModal real_estate_id={real_estate_id} />
                  </CardAction>
                </CardHeader>
                <CardContent className="border-t flex-col items-start text-sm min-h-92">
                  <AgentList
                    real_estate_id={real_estate_id}
                    agents={agents}
                  />
                </CardContent>
              </Card>
            </Suspense>          </div>

          {/* Row 2 */}
          <div className="">
            {/* Multi users */}
          </div>

          <div className="">
            {/* Long jobs */}
          </div>

          <div className="md:col-span-3">
            {featuredListings.length > 0 && (
              <FeaturedListingsSlider listings={featuredListings} />
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

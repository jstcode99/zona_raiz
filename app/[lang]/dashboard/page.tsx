import { DashboardStats } from "@/features/dashboard/dashboard-stats"
import { PropertyTypesChart } from "@/features/dashboard/property-types-chart"
import { ListingsByStatusChart, ListingsByStatusData } from "@/features/dashboard/listings-by-status-chart"
import { cookies } from "next/headers";
import { COOKIE_NAMES } from "@/infrastructure/config/constants";
import { propertyModule } from "@/application/modules/property.module";
import { listingModule } from "@/application/modules/listing.module";
import { profileModule } from "@/application/modules/profile.module";
import { realEstateModule } from "@/application/modules/real-estate.module";
import { agentModule } from "@/application/modules/agent.module";
import { AgentList } from "@/features/agents/agent-list";
import { SkeletonAgentList } from "@/features/agents/skeleton-agent-list";
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
import { Lang } from "@/i18n/settings";
import { getTranslation } from "@/i18n/server";

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


export default async function DashboardPage({
  params
}: {
  params: { lang: Lang }
}) {
  const cookieStore = await cookies()
  const real_estate_id = cookieStore.get(COOKIE_NAMES.REAL_ESTATE)?.value as string
  const { lang } = await params;
  const { t } = await getTranslation(lang, ['sections']);
  const { propertyService } = await propertyModule()

  const { listingService } = await listingModule()

  const { profileService } = await profileModule()

  const { realEstateService } = await realEstateModule()

  const { agentService } = await agentModule()

  const now = new Date()
  const currentMonthRange = getMonthDateRange(now)
  const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const previousMonthRange = getMonthDateRange(previousMonth)

  const currentMonthProperties = real_estate_id
    ? await propertyService.getCachedCountByRealEstateWithDateRange(real_estate_id, currentMonthRange.start_date, currentMonthRange.end_date)
    : await propertyService.getCachedCountWithDateRange(currentMonthRange.start_date, currentMonthRange.end_date)

  const previousMonthProperties = real_estate_id
    ? await propertyService.getCachedCountByRealEstateWithDateRange(real_estate_id, previousMonthRange.start_date, previousMonthRange.end_date)
    : await propertyService.getCachedCountWithDateRange(previousMonthRange.start_date, previousMonthRange.end_date)

  const activeProperties = currentMonthProperties
  const activePropertiesChange = calculatePercentageChange(currentMonthProperties, previousMonthProperties)

  const currentMonthListings = real_estate_id
    ? await listingService.getCachedCountByRealEstateWithDateRange(real_estate_id, currentMonthRange.start_date, currentMonthRange.end_date)
    : await listingService.getCachedCountWithDateRange(currentMonthRange.start_date, currentMonthRange.end_date)

  const previousMonthListings = real_estate_id
    ? await listingService.getCachedCountByRealEstateWithDateRange(real_estate_id, previousMonthRange.start_date, previousMonthRange.end_date)
    : await listingService.getCachedCountWithDateRange(previousMonthRange.start_date, previousMonthRange.end_date)

  const totalListings = currentMonthListings
  const totalListingsChange = calculatePercentageChange(currentMonthListings, previousMonthListings)

  const currentMonthVisits = real_estate_id
    ? await listingService.getCachedCountByRealEstateWithDateRange(real_estate_id, currentMonthRange.start_date, currentMonthRange.end_date)
    : await listingService.getCachedCountWithDateRange(currentMonthRange.start_date, currentMonthRange.end_date)

  const previousMonthVisits = real_estate_id
    ? await listingService.getCachedCountByRealEstateWithDateRange(real_estate_id, previousMonthRange.start_date, previousMonthRange.end_date)
    : await listingService.getCachedCountWithDateRange(previousMonthRange.start_date, previousMonthRange.end_date)

  const visits = currentMonthVisits
  const visitsChange = calculatePercentageChange(currentMonthVisits, previousMonthVisits)

  const currentMonthNewUsers = await profileService.getCachedCountWithDateRange(currentMonthRange.start_date, currentMonthRange.end_date)
  const previousMonthNewUsers = await profileService.getCachedCountWithDateRange(previousMonthRange.start_date, previousMonthRange.end_date)

  const newUsers = currentMonthNewUsers
  const newUsersChange = calculatePercentageChange(currentMonthNewUsers, previousMonthNewUsers)

  const currentMonthRealEstates = await realEstateService.getCachedCountWithDateRange(currentMonthRange.start_date, currentMonthRange.end_date)
  const previousMonthRealEstates = await realEstateService.getCachedCountWithDateRange(previousMonthRange.start_date, previousMonthRange.end_date)

  const totalRealEstates = currentMonthRealEstates
  const totalRealEstatesChange = calculatePercentageChange(currentMonthRealEstates, previousMonthRealEstates)

  const propertyTypesData = await propertyService.getCachedCountByTypes(real_estate_id)

  const agents = await agentService.getCachedListAgents(real_estate_id)

  const featuredListings = await listingService.getCachedFeatured(10, real_estate_id)

  const currentYear = now.getFullYear()
  const listingsByStatus = await listingService.getCachedCountByStatusAndMonth(currentYear, { real_estate_id })

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="grid grid-cols-1 gap-x-3 gap-y-22 md:grid-cols-3 lg:grid-cols-5 lg:auto-rows-4 px-8">

          {/* Row 1 */}
          <div className="col-span-full lg:col-span-3">
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

          <div className="col-span-full lg:col-span-1">
            <PropertyTypesChart data={propertyTypesData} />
          </div>

          <div className="col-span-full lg:col-span-1">
            <Suspense fallback={<SkeletonAgentList />}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-base">
                    {t('sections:agents')}
                  </CardTitle>
                  <CardAction>
                    <AddAgentModal real_estate_id={real_estate_id} />
                  </CardAction>
                </CardHeader>
                <CardContent className="border-t flex-col items-start text-sm">
                  <AgentList
                    real_estate_id={real_estate_id}
                    agents={agents}
                  />
                </CardContent>
              </Card>
            </Suspense>
          </div>
          {/* Row 2 */}
          <div className="col-span-full lg:col-span-2">
            <ListingsByStatusChart className="lg:px-0 lg:mx-4 h-full" data={listingsByStatus as ListingsByStatusData} />
          </div>

          <div className="col-span-full lg:col-span-3">
            {featuredListings.length > 0 && (
              <FeaturedListingsSlider className="lg:px-4 h-full" listings={featuredListings} />
            )}
          </div>

          <div className="md:col-span-3">

          </div>

        </div>
      </div>
    </div>
  )
}

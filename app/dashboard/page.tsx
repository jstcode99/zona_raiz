import { DashboardStats } from "@/features/dashboard/dashboard-stats"
import { cookies } from "next/headers";
import { COOKIE_NAMES } from "@/infrastructure/config/constants";
import { PropertyCountService } from "@/domain/services/property-count.service";
import { ListingCountService } from "@/domain/services/listing-count.service";
import { ListingViewsCountService } from "@/domain/services/listing-views-count.service";
import { createPropertyModule } from "@/application/containers/property.container";
import { createListingModule } from "@/application/containers/listing.container";

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
            visibleCards={['properties', 'visits', 'listings']}
          />
        </div>
      </div>
    </div>
  )
}

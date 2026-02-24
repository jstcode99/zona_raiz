import { PropertyForm } from "@/features/properties/property-form";
import { COOKIE_NAMES } from "@/infrastructure/config/constants";
import { cookies } from "next/headers";

export default async function page() {
  const cookieStore = await cookies()
  const realEstateId = cookieStore.get(COOKIE_NAMES.REAL_ESTATE)?.value as string

  return (
    <main className="py-10 px-4">
      <PropertyForm realEstateId={realEstateId} />
    </main>
  );
}

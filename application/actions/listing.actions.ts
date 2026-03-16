"use server";

import { withServerAction } from "@/shared/hooks/with-server-action";
import { createListingSchema } from "../validation/listing.validation";
import { handleError } from "../errors/handle-error";
import { revalidatePath } from "next/cache";
import { getLangServerSide } from "@/shared/utils/lang";
import { cookies } from "next/headers";
import { createRouter } from "@/i18n/router";
import { initI18n } from "@/i18n/server";
import { appModule } from "../modules/app.module";

export const createListingAction = withServerAction(
  async (formData: FormData) => {

    const lang = await getLangServerSide()
    const cookieStore = await cookies()
    const routes = createRouter(lang)
    const i18n = await initI18n(lang)
    const t = i18n.getFixedT(lang)

    const {
      propertyService,
      sessionService,
      listingService
    } = await appModule(lang, { cookies: cookieStore })

    const raw = Object.fromEntries(formData);

    const validated = await createListingSchema.validate(raw, {
      abortEarly: false,
      stripUnknown: true,
    });

    const property = await propertyService.getById(validated.property_id);
    if (!property) throw new Error(t('exceptions:data_not_found'))

    const agent_id = await sessionService.getCurrentUserId();
    if (!agent_id) throw new Error(t('exceptions:unauthorized'))


    const listing = await listingService.create({
      ...validated,
      agent_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      expenses_included: raw.expenses_included === 'on',
      featured: raw.featured === 'on',
      available_from: validated.available_from ? validated.available_from.toISOString() : undefined,
    });

    if (!listing) throw new Error(t('exceptions:create_fail'))

    revalidatePath(routes.dashboard())
    revalidatePath(routes.listings())
    revalidatePath(routes.listing(listing.id))
  }
)

export const updateListingAction = withServerAction(
  async (
    id: string,
    formData: FormData
  ) => {
    const raw = Object.fromEntries(formData)

    const validated = await createListingSchema.validate(raw, {
      abortEarly: false,
      stripUnknown: true,
    })

    const lang = await getLangServerSide()
    const cookieStore = await cookies()
    const routes = createRouter(lang)
    const i18n = await initI18n(lang)
    const t = i18n.getFixedT(lang)

    const {
      listingService
    } = await appModule(lang, { cookies: cookieStore })


    const currentListing = await listingService.findById(id);

    if (!currentListing) throw new Error(t('exceptions:data_not_found'))

    const agent_id = currentListing.agent_id; // Asumiendo que el agent_id no cambia en la actualización

    const dataToUpdate = {
      ...currentListing,
      ...validated,
      agent_id,
      updated_at: new Date().toISOString(),
      expenses_included: raw.expenses_included === 'on',
      featured: raw.featured === 'on',
      available_from: validated.available_from ? validated.available_from.toISOString() : currentListing.available_from,
      property_id: currentListing.property_id, // Asegurar que property_id se mantiene
    };

    const listing = await listingService.update(id, dataToUpdate)

    if (!listing) throw new Error(t('exceptions:update_fail'))

    revalidatePath(routes.dashboard())
    revalidatePath(routes.listings())
    revalidatePath(routes.listing(listing.id))
  }
)

export async function deleteListingAction(id: string) {

  const lang = await getLangServerSide()
  const cookieStore = await cookies()
  const routes = createRouter(lang)
  const i18n = await initI18n(lang)

  const {
    listingService
  } = await appModule(lang, { cookies: cookieStore })

  revalidatePath(routes.dashboard())
  revalidatePath(routes.listings())
  revalidatePath(routes.listing(id))

  return listingService.delete(id);
}

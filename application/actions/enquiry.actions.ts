"use server";

import { withServerAction } from "@/shared/hooks/with-server-action";
import { revalidatePath, revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { getLangServerSide } from "@/infrastructure/shared/utils/lang";
import { createRouter } from "@/i18n/router";
import { appModule } from "@/application/modules/app.module";
import { initI18n } from "@/i18n/server";
import { enquirySchema } from "@/application/validation/enquiry.schema";
import { CACHE_TAGS, COOKIE_NAMES } from "@/infrastructure/config/constants";
import { EnquirySource, EnquiryStatus } from "@/domain/entities/enquiry.enums";
import { notificationService } from "@/infrastructure/notifications/notification.service";
import { enquiryStatusLabels } from "@/domain/entities/enquiry.entity";

export const createEnquiryAction = withServerAction(
  async (formData: FormData) => {
    const lang = await getLangServerSide();
    const cookieStore = await cookies();
    const i18n = await initI18n(lang);
    const t = i18n.getFixedT(lang);
    const routes = createRouter(lang);

    const {
      listingService,
      enquiryService,
      realEstateService,
      cookiesService,
    } = await appModule(lang, {
      cookies: cookieStore,
    });

    const raw = Object.fromEntries(formData);

    const hasIP = await cookiesService.hasIP();
    if (!hasIP) {
      cookiesService.setSession(COOKIE_NAMES.IP_CLIENT, raw?.ip as string);
    }

    const input = await enquirySchema.validate(raw, {
      abortEarly: false,
      stripUnknown: true,
    });

    // real_estate_id viene del formulario (property.real_estate_id)
    // Se usa SOLO para consultar el WhatsApp, NO se guarda en BD
    const realEstateId = input.real_estate_id;
    const listingId = input.listing_id;
    const listing = await listingService.getCachedById(listingId);

    if (!listing) {
      return { success: false, error: "Listing not found" };
    }

    const urlListing = routes.listings_public(listing.property.slug);
    // Create the inquiry (sin real_estate_id - no se guarda en la tabla)
    await enquiryService.create({
      listing_id: input.listing_id,
      name: input.name as string,
      email: input.email as string | null,
      phone: input.phone as string | null,
      message: input.message as string | null,
      source: input.source as EnquirySource,
      ip_address: raw?.ip as string,
    });

    const realEstate = await realEstateService.getById(realEstateId);
    let whatsappUrl: string = "";

    if (realEstate?.whatsapp) {
      const cleanNumber = realEstate.whatsapp.replace(/[^\d+]/g, "");
      const encodeMessage = encodeURIComponent(
        t("enquiries:whatsapp.default_message", {
          name: input.name,
        }) || `Hola, me interesa esta propiedad`,
      );

      /**
       * INTEGRAR MODULOS DE shor_url
       */

      whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeMessage}`;
      return { success: true, data: { whatsappUrl } };
    }

    // Success without WhatsApp - the withServerAction will return { success: true }
    return { success: true, data: { whatsappUrl: null } };
  },
);

export const deleteEnquiryAction = withServerAction(
  async (formData: FormData) => {
    const lang = await getLangServerSide();
    const cookieStore = await cookies();
    const routes = createRouter(lang);
    const i18n = await initI18n(lang);
    const t = i18n.getFixedT(lang);

    const { sessionService, enquiryService } = await appModule(lang, {
      cookies: cookieStore,
    });

    const id = formData.get("id") as string;
    if (!id)
      throw new Error(
        t("validations:required", {
          attribute: "ID",
        }),
      );

    const userId = await sessionService.getCurrentUserId();

    if (!userId) throw new Error(t("common:exceptions.unauthorized"));

    const inquiry = await enquiryService.findById(id);
    if (!inquiry || !inquiry.listing)
      throw new Error(t("common:exceptions.data_not_found"));

    const isAdmin = await sessionService.isAdmin();
    const isCoordinator = await sessionService.isCoordinator();
    const isAssignedAgent = inquiry.assigned_to === userId;

    if (!isAdmin && !isCoordinator && !isAssignedAgent)
      throw new Error(t("common:exceptions.unauthorized"));

    await enquiryService.delete(id);

    revalidatePath(routes.enquiries());

    // Invalidar tags específicos del cache
    revalidateTag(CACHE_TAGS.ENQUIRY.PRINCIPAL, { expire: 0 });
    revalidateTag(CACHE_TAGS.ENQUIRY.ALL, { expire: 0 });
    revalidateTag(CACHE_TAGS.ENQUIRY.DETAIL(id), { expire: 0 });
    revalidateTag(CACHE_TAGS.ENQUIRY.COUNT, { expire: 0 });
    revalidateTag(CACHE_TAGS.LISTING.DETAIL(inquiry.listing_id), { expire: 0 });
    if (inquiry.assigned_to) {
      revalidateTag(CACHE_TAGS.AGENT.BY_REAL_ESTATE(inquiry.assigned_to), {
        expire: 0,
      });
    }
  },
);

export const updateEnquiryStatusAction = withServerAction(
  async (formData: FormData) => {
    const lang = await getLangServerSide();
    const cookieStore = await cookies();
    const routes = createRouter(lang);
    const i18n = await initI18n(lang);
    const t = i18n.getFixedT(lang);

    const { sessionService, enquiryService } = await appModule(lang, {
      cookies: cookieStore,
    });

    const id = formData.get("id") as string;
    const status = formData.get("status") as string;
    if (!id || !status)
      throw new Error(
        t("validations:required", { attribute: "ID and status" }),
      );

    const userId = await sessionService.getCurrentUserId();
    if (!userId) throw new Error(t("common:exceptions.unauthorized"));

    const inquiry = await enquiryService.findById(id);
    if (!inquiry || !inquiry.listing)
      throw new Error(t("common:exceptions.data_not_found"));

    const isAdmin = await sessionService.isAdmin();
    const isCoordinator = await sessionService.isCoordinator();
    const isAssignedAgent = inquiry.assigned_to === userId;

    if (!isAdmin && !isCoordinator && !isAssignedAgent)
      throw new Error(t("common:exceptions.unauthorized"));

    const oldStatus = inquiry.status;
    await enquiryService.update(id, { status: status as EnquiryStatus });

    // Enviar notificación al agente asignado si hay cambio de estado
    if (inquiry.assigned_to) {
      const agentProfile = await profileService.getById(inquiry.assigned_to);
      if (agentProfile && agentProfile.email) {
        await notificationService.enquiryStatusChanged({
          type: "enquiry_status_changed",
          enquiry: { ...inquiry, status: status as EnquiryStatus },
          agentEmail: agentProfile.email,
          agentName: agentProfile.full_name || "Agente",
          oldStatus: enquiryStatusLabels[oldStatus],
          newStatus: enquiryStatusLabels[status as EnquiryStatus],
          listingTitle: inquiry.listing?.title,
          leadName: inquiry.name || undefined,
        });
      }
    }

    revalidatePath(routes.enquiries());

    // Invalidar tags específicos del cache
    revalidateTag(CACHE_TAGS.ENQUIRY.PRINCIPAL, { expire: 0 });
    revalidateTag(CACHE_TAGS.ENQUIRY.ALL, { expire: 0 });
    revalidateTag(CACHE_TAGS.ENQUIRY.DETAIL(id), { expire: 0 });
    revalidateTag(CACHE_TAGS.ENQUIRY.COUNT, { expire: 0 });
    revalidateTag(CACHE_TAGS.LISTING.DETAIL(inquiry.listing_id), { expire: 0 });
    if (inquiry.assigned_to) {
      revalidateTag(CACHE_TAGS.AGENT.BY_REAL_ESTATE(inquiry.assigned_to), {
        expire: 0,
      });
    }
  },
);

export const assignEnquiryAction = withServerAction(
  async (formData: FormData) => {
    const lang = await getLangServerSide();
    const cookieStore = await cookies();
    const routes = createRouter(lang);
    const i18n = await initI18n(lang);
    const t = i18n.getFixedT(lang);

    const { sessionService, enquiryService, profileService } = await appModule(
      lang,
      { cookies: cookieStore },
    );

    const id = formData.get("id") as string;
    const assigned_to = formData.get("assigned_to") as string;
    if (!id || !assigned_to)
      throw new Error(t("common:exceptions.unauthorized"));

    const inquiry = await enquiryService.findById(id);
    if (!inquiry || !inquiry.listing)
      throw new Error(t("common:exceptions.data_not_found"));

    const userId = await sessionService.getCurrentUserId();
    if (!userId) throw new Error(t("common:exceptions.unauthorized"));

    const isAdmin = await sessionService.isAdmin();
    const isCoordinator = await sessionService.isCoordinator();

    if (!isAdmin && !isCoordinator)
      throw new Error(t("common:exceptions.unauthorized"));
    const realEstateId = inquiry.listing.real_estate_id;

    const targetAgent = await profileService.getAgentRoleInRealEstate(
      assigned_to,
      realEstateId,
    );
    if (!targetAgent) throw new Error(t("common:exceptions.unauthorized"));

    await enquiryService.update(id, { assigned_to });

    // Enviar notificación al agente asignado
    const targetAgentProfile = await profileService.getById(assigned_to);
    if (targetAgentProfile && targetAgentProfile.email) {
      const listingTitle = inquiry.listing?.title || undefined;
      await notificationService.enquiryAssigned({
        type: "enquiry_assigned",
        enquiry: { ...inquiry, assigned_to },
        agentEmail: targetAgentProfile.email,
        agentName: targetAgentProfile.full_name || "Agente",
        listingTitle,
        leadName: inquiry.name || undefined,
      });
    }

    revalidatePath(routes.enquiries());

    // Invalidar tags específicos del cache
    revalidateTag(CACHE_TAGS.ENQUIRY.PRINCIPAL, { expire: 0 });
    revalidateTag(CACHE_TAGS.ENQUIRY.ALL, { expire: 0 });
    revalidateTag(CACHE_TAGS.ENQUIRY.DETAIL(id), { expire: 0 });
    revalidateTag(CACHE_TAGS.ENQUIRY.COUNT, { expire: 0 });
    revalidateTag(CACHE_TAGS.LISTING.DETAIL(inquiry.listing_id), { expire: 0 });
    // Invalidar agent antiguo y nuevo
    if (inquiry.assigned_to) {
      revalidateTag(CACHE_TAGS.AGENT.BY_REAL_ESTATE(inquiry.assigned_to), {
        expire: 0,
      });
    }
    revalidateTag(CACHE_TAGS.AGENT.BY_REAL_ESTATE(assigned_to), { expire: 0 });
  },
);

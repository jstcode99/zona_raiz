"use server";

import { withServerAction } from "@/shared/hooks/with-server-action";
import { revalidatePath, revalidateTag } from "next/cache";
import { getLangServerSide } from "@/shared/utils/lang";
import { cookies } from "next/headers";
import { createRouter } from "@/i18n/router";
import { appModule } from "@/application/modules/app.module";
import { initI18n } from "@/i18n/server";
import { CACHE_TAGS } from "@/infrastructure/config/constants";

export const deleteInquiryAction = withServerAction(
  async (formData: FormData) => {
    const lang = await getLangServerSide();
    const cookieStore = await cookies();
    const routes = createRouter(lang);
    const i18n = await initI18n(lang);
    const t = i18n.getFixedT(lang);

    const { sessionService, inquiryService } = await appModule(lang, {
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

    const inquiry = await inquiryService.findById(id);
    if (!inquiry || !inquiry.listing)
      throw new Error(t("common:exceptions.data_not_found"));

    const isAdmin = await sessionService.isAdmin();
    const isCoordinator = await sessionService.isCoordinator();
    const isAssignedAgent = inquiry.assigned_to === userId;

    if (!isAdmin && !isCoordinator && !isAssignedAgent)
      throw new Error(t("common:exceptions.unauthorized"));

    await inquiryService.delete(id);

    revalidatePath(routes.inquiries());

    // Invalidar tags específicos del cache
    revalidateTag(CACHE_TAGS.INQUIRY.PRINCIPAL, { expire: 0 });
    revalidateTag(CACHE_TAGS.INQUIRY.ALL, { expire: 0 });
    revalidateTag(CACHE_TAGS.INQUIRY.DETAIL(id), { expire: 0 });
    revalidateTag(CACHE_TAGS.INQUIRY.COUNT, { expire: 0 });
    revalidateTag(CACHE_TAGS.LISTING.DETAIL(inquiry.listing_id), { expire: 0 });
    if (inquiry.assigned_to) {
      revalidateTag(CACHE_TAGS.AGENT.BY_REAL_ESTATE(inquiry.assigned_to), {
        expire: 0,
      });
    }
  },
);

export const updateInquiryStatusAction = withServerAction(
  async (formData: FormData) => {
    const lang = await getLangServerSide();
    const cookieStore = await cookies();
    const routes = createRouter(lang);
    const i18n = await initI18n(lang);
    const t = i18n.getFixedT(lang);

    const { sessionService, inquiryService } = await appModule(lang, {
      cookies: cookieStore,
    });

    const id = formData.get("id") as string;
    const status = formData.get("status") as string;
    if (!id || !status) throw new Error("ID and status required");

    const userId = await sessionService.getCurrentUserId();
    if (!userId) throw new Error("No autorizado");

    const inquiry = await inquiryService.findById(id);
    if (!inquiry || !inquiry.listing)
      throw new Error(t("common:exceptions.data_not_found"));

    const isAdmin = await sessionService.isAdmin();
    const isCoordinator = await sessionService.isCoordinator();
    const isAssignedAgent = inquiry.assigned_to === userId;

    if (!isAdmin && !isCoordinator && !isAssignedAgent)
      throw new Error(t("common:exceptions.unauthorized"));

    await inquiryService.update(id, { status: status as any });
    revalidatePath(routes.inquiries());

    // Invalidar tags específicos del cache
    revalidateTag(CACHE_TAGS.INQUIRY.PRINCIPAL, { expire: 0 });
    revalidateTag(CACHE_TAGS.INQUIRY.ALL, { expire: 0 });
    revalidateTag(CACHE_TAGS.INQUIRY.DETAIL(id), { expire: 0 });
    revalidateTag(CACHE_TAGS.INQUIRY.COUNT, { expire: 0 });
    revalidateTag(CACHE_TAGS.LISTING.DETAIL(inquiry.listing_id), { expire: 0 });
    if (inquiry.assigned_to) {
      revalidateTag(CACHE_TAGS.AGENT.BY_REAL_ESTATE(inquiry.assigned_to), {
        expire: 0,
      });
    }
  },
);

export const assignInquiryAction = withServerAction(
  async (formData: FormData) => {
    const lang = await getLangServerSide();
    const cookieStore = await cookies();
    const routes = createRouter(lang);
    const i18n = await initI18n(lang);
    const t = i18n.getFixedT(lang);

    const { sessionService, inquiryService, profileService } = await appModule(
      lang,
      { cookies: cookieStore },
    );

    const id = formData.get("id") as string;
    const assigned_to = formData.get("assigned_to") as string;
    if (!id || !assigned_to) throw new Error(t("common:exceptions.unauthorized"));

    const inquiry = await inquiryService.findById(id);
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

    await inquiryService.update(id, { assigned_to });

    revalidatePath(routes.inquiries());

    // Invalidar tags específicos del cache
    revalidateTag(CACHE_TAGS.INQUIRY.PRINCIPAL, { expire: 0 });
    revalidateTag(CACHE_TAGS.INQUIRY.ALL, { expire: 0 });
    revalidateTag(CACHE_TAGS.INQUIRY.DETAIL(id), { expire: 0 });
    revalidateTag(CACHE_TAGS.INQUIRY.COUNT, { expire: 0 });
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

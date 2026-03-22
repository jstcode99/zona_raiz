import { SupabaseServerClient } from "@/infrastructure/db/supabase.server";
import { SupabaseAuthAdapter } from "@/infrastructure/adapters/supabase/supabase-auth.adapter";
import { AuthService } from "@/domain/services/auth.service";
import { SupabaseProfileAdapter } from "@/infrastructure/adapters/supabase/supabase-profile.adapter";
import { Lang } from "@/i18n/settings";
import { SupabaseAgentAdapter } from "@/infrastructure/adapters/supabase/supabase-agent.adapter";
import { AgentService } from "@/domain/services/agent.service";
import { CookieContext } from "@/interfaces/http/http-context";
import { CookiesAdapter } from "@/infrastructure/cookies/cookies.adapter";
import { CookiesService } from "@/domain/services/cookies.service";
import { SupabaseEnquiryAdapter } from "@/infrastructure/adapters/supabase/supabase-enquiry.adapter";
import { EnquiryService } from "@/domain/services/enquire.service";
import { SupabaseListingAdapter } from "@/infrastructure/adapters/supabase/supabase-listing.adapter";
import { ListingService } from "@/domain/services/listing.service";
import { OnboardingService } from "@/domain/services/onboarding.service";
import { SupabaseSessionAdapter } from "@/infrastructure/adapters/supabase/supabase-session.adapter";
import { SessionService } from "@/domain/services/session.service";
import { ProfileService } from "@/domain/services/profile.service";
import { SupabaseUserAdapter } from "@/infrastructure/adapters/supabase/supabase-user.adapter";
import { UserService } from "@/domain/services/user.service";
import { SupabaseRealEstateAdapter } from "@/infrastructure/adapters/supabase/supabase-real-state.adapter";
import { RealEstateService } from "@/domain/services/real-estate.service";
import { SupabasePropertyAdapter } from "@/infrastructure/adapters/supabase/supabase-property.adapter";
import { PropertyService } from "@/domain/services/property.service";
import { SupabasePropertyImageAdapter } from "@/infrastructure/adapters/supabase/supabase-property-image.adapter";
import { PropertyImageService } from "@/domain/services/property-image.service";
import { SupabaseFavoriteAdapter } from "@/infrastructure/adapters/supabase/supabase-favorite.adapter";
import { FavoriteService } from "@/domain/services/favorite.service";
import { SupabaseImportAdapter } from "@/infrastructure/adapters/supabase/supabase-import.adapter";
import { SupabaseImportJobAdapter } from "@/infrastructure/adapters/supabase/supabase-import-job.adapter";
import { ImportJobService } from "@/domain/services/import-job.service";

export async function appModule(lang: Lang = "es", ctx: CookieContext) {
  const supabase = await SupabaseServerClient();
  const authAdapter = new SupabaseAuthAdapter(supabase);
  const profileAdapter = new SupabaseProfileAdapter(supabase);
  const agentAdapter = new SupabaseAgentAdapter(supabase);
  const cookiesAdapter = new CookiesAdapter(ctx);
  const propertyAdapter = new SupabasePropertyAdapter(supabase);
  const propertyImageAdapter = new SupabasePropertyImageAdapter(supabase);

  const enquiryAdapter = new SupabaseEnquiryAdapter(supabase);
  const sessionAdapter = new SupabaseSessionAdapter(supabase, profileAdapter);
  const listingAdapter = new SupabaseListingAdapter(supabase);
  const userAdapter = new SupabaseUserAdapter(supabase);
  const realEstateAdapter = new SupabaseRealEstateAdapter(supabase);
  const favoriteAdapter = new SupabaseFavoriteAdapter(supabase);

  const authService = new AuthService(authAdapter, profileAdapter, lang);

  const agentService = new AgentService(agentAdapter, lang);
  const cookiesService = new CookiesService(cookiesAdapter);
  const enquiryService = new EnquiryService(enquiryAdapter);
  const listingService = new ListingService(listingAdapter, lang);
  const sessionService = new SessionService(
    sessionAdapter,
    profileAdapter,
    cookiesAdapter,
    lang,
  );
  const onboardingService = new OnboardingService(
    sessionAdapter,
    profileAdapter,
    lang,
  );
  const profileService = new ProfileService(profileAdapter, lang);
  const userService = new UserService(userAdapter, lang);
  const realEstateService = new RealEstateService(realEstateAdapter, lang);
  const propertyService = new PropertyService(propertyAdapter, lang);
  const propertyImageService = new PropertyImageService(
    propertyImageAdapter,
    lang,
  );
  const favoriteService = new FavoriteService(favoriteAdapter);
  const importAdapter = new SupabaseImportAdapter(supabase);
  const importJobAdapter = new SupabaseImportJobAdapter(supabase);
  const importJobService = new ImportJobService(importJobAdapter, lang);

  return {
    authService,
    listingAdapter,
    agentService,
    cookiesService,
    enquiryService,
    listingService,
    sessionService,
    onboardingService,
    profileService,
    userService,
    realEstateService,
    propertyService,
    propertyImageService,
    favoriteService,
    importAdapter,
    importJobService,
  };
}

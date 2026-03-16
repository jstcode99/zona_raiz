import { CookieSessionAdapter } from "@/infrastructure/cookies/cookie-session.adapter";
import { CookiesService } from "@/domain/services/cookies.service";

export async function cookieModule() {
  const repository = new CookieSessionAdapter();
  const cookiesService = new CookiesService(repository);
  
  return {
    cookiesService
  };
}

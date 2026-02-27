import { cached } from "@/infrastructure/cache/cache";
import { createProfileModule } from "@/application/containers/profile.container";

export const getProfile = cached(
  async function (userId: string) {
    const { useCases } = await createProfileModule()

    return useCases.getProfileByUserId(userId);
  }
);
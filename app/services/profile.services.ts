import { cached } from "@/infrastructure/cache/cache";
import { createProfileModule } from "@/application/containers/profile.container";
import { mapProfilesToOptions } from "@/application/mappers/options.mapper";

export const getProfile = cached(
  async function (userId: string) {
    const { useCases } = await createProfileModule()

    return useCases.getProfileByUserId(userId);
  }
);

export const searchProfilesByEmail = async function (email: string) {
  const { useCases } = await createProfileModule()
  const profiles = await useCases.searchByEmail(email);
  return profiles.map(mapProfilesToOptions)
};

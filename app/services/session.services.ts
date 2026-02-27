import { createSessionModule } from "@/application/containers/session.container";
import { cached } from "@/infrastructure/cache/cache";

export const getCurrentUser = cached(
  async function () {
    const { useCases } = await createSessionModule()

    return useCases.getCurrentUser();
  }
);
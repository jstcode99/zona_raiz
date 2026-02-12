import { getCurrentProfileUseCase } from "@/application/use-cases/getCurrentProfileUseCase"

export async function getCurrentProfile() {
  const useCase = new getCurrentProfileUseCase()
  return await useCase.execute()
}
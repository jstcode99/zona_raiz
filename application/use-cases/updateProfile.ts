type UpdateProfileData = {
  name: string
  last_name?: string
  phone?: string
}

export async function updateProfile(
  repo: { updateProfile(data: UpdateProfileData): Promise<void> },
  data: UpdateProfileData
) {
  if (!data.name.trim()) {
    throw new Error("Name is required")
  }

  await repo.updateProfile(data)
}

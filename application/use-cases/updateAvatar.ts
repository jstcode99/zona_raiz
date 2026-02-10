type UpdateAvatarInput = {
  file: File
}

export async function updateAvatar(
  repo: {
    updateAvatar(file: File): Promise<void>
  },
  input: UpdateAvatarInput
) {
  await repo.updateAvatar(input.file)
}
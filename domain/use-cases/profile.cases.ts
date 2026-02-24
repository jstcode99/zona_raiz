import { ProfilePort } from "../ports/profile.port";
import { ProfileFormValues } from "../entities/schemas/profile.schema";

export class UpdateProfile {
  constructor(
    private profile: ProfilePort,
  ) {}

  async execute(userId:string, input: ProfileFormValues) {
    if (!input || !userId) {
      throw new Error("Datos inválidas");
    }
    await this.profile.updateProfile(userId, input);
  }
}
export class updateAvatarProfile {
  constructor(
    private profile: ProfilePort,
    
  ) {}

  async execute(userId:string, file: File) {
    if (!file || !userId) {
      throw new Error("Datos inválidas");
    }
    const avatarUrl = await this.profile.uploadAvatar(userId, file);
    await this.profile.updatePathAvatarProfile(userId, avatarUrl);
  }
}

export class GetProfileById {
  constructor(private profile: ProfilePort) {}
  async execute(userId: string) {
    if (!userId) throw new Error("UserId requerido");
    return this.profile.getProfileByUserId(userId);
  }
}
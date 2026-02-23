import { ProfilePort } from "../ports/profile.port";

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
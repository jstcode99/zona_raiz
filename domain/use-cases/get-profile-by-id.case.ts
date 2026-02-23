
import { ProfilePort } from "../ports/profile.port";

export class GetProfileById {
  constructor(private profile: ProfilePort) {}
  async execute(userId: string) {
    if (!userId) throw new Error("UserId requerido");
    return this.profile.getProfileByUserId(userId);
  }
}
import { ProfileFormValues } from "../entities/schemas/profile.schema";
import { ProfilePort } from "../ports/profile.port";

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
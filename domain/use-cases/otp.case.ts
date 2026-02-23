import { AuthPort } from "../ports/auth.port";

export class OTP {
  constructor(
    private auth: AuthPort,
  ) {}

  async execute(email: string) {
    if (!email) {
      throw new Error("No se proprociono un email");
    }
    await this.auth.otp(email);
  }
}
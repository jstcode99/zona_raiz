import { AuthPort } from "../ports/auth.port";
import { ProfilePort } from "../ports/profile.port";
import { SignUpFormValues } from "../entities/schemas/sign-up-schema";

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
export class SignUp {
  constructor(
    private auth: AuthPort,
  ) {}

  async execute(input: SignUpFormValues) {
    if (!input) {
      throw new Error("Datos inválidas");
    }
    await this.auth.signUp(input);
  }
}

export class SignOut {
  constructor(
    private auth: AuthPort,
  ) {}

  async execute() {
    await this.auth.signOut();
  }
}

export class SignIn {
  constructor(
    private auth: AuthPort,
    private profiles: ProfilePort
  ) {}

  async execute(input: { email: string; password: string }) {
    if (!input.email || !input.password) {
      throw new Error("Credenciales inválidas");
    }

    const { id, email } = await this.auth.signIn(input.email, input.password);
    const role = await this.profiles.getRoleByUserId(id);

    return { id, role };
  }
}
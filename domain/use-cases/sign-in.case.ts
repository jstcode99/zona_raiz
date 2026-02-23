import { AuthPort } from "../ports/auth.port";
import { ProfilePort } from "../ports/profile.port";

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
import { SignUpFormValues } from "../entities/schemas/sign-up-schema";
import { AuthPort } from "../ports/auth.port";

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
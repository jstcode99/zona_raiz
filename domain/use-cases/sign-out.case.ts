import { AuthPort } from "../ports/auth.port";

export class SignOut {
  constructor(
    private auth: AuthPort,
  ) {}

  async execute() {
    await this.auth.signOut();
  }
}
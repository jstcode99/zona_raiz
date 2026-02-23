import { RealEstateFormValues } from "../entities/schemas/real-estate.schema";
import { RealEstatePort } from "../ports/real-estate.port";

export class CreateRealEstate {
  constructor(
    private realEstate: RealEstatePort,
  ) {}

  async execute(input: RealEstateFormValues) {
    if (!input) {
      throw new Error("Datos inválidas");
    }
    await this.realEstate.create(input);
  }
}
import { RealEstateFormValues } from "../entities/schemas/real-estate.schema";
import { RealEstatePort } from "../ports/real-estate.port";

export class UpdateRealEstate {
  constructor(
    private realEstate: RealEstatePort,
  ) {}

  async execute(realEstateId:string, input: RealEstateFormValues) {
    if (!input || !realEstateId) {
      throw new Error("Datos inválidas");
    }
    await this.realEstate.update(realEstateId, input);
  }
}
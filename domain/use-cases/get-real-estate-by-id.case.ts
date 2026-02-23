import { RealEstatePort } from "../ports/real-estate.port";

export class GetRealEstateById {
  constructor(private realEstate: RealEstatePort) {}
  async execute(realEstateId: string) {
    if (!realEstateId) throw new Error("realEstateId requerido");
    return this.realEstate.getById(realEstateId);
  }
}
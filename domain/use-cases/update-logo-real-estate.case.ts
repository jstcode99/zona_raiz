import { RealEstatePort } from "../ports/real-estate.port";

export class UpdateLogoRealEstate {
  constructor(
    private realEstate: RealEstatePort,
  ) { }

  async execute(realEstateId: string, file: File) {
    if (!file || !realEstateId) {
      throw new Error("Datos inválidas");
    }
    const logoUrl = await this.realEstate.uploadLogo(realEstateId, file);
    console.log(logoUrl, 'logoUrl');
    
    await this.realEstate.updatePathLogo(realEstateId, logoUrl ?? '');
  }
}
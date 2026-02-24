import { RealEstateFormValues } from "../entities/schemas/real-estate.schema";
import { RealEstatePort } from "../ports/real-estate.port";
import { RealEstateFilters } from "../entities/real-estate.entity";

export class ListRealEstates {
  constructor(
    private realEstate: RealEstatePort,
  ) { }
  async execute(filters?: RealEstateFilters) {
    return await this.realEstate.all(filters);
  }
}

export class GetRealEstateById {
  constructor(private realEstate: RealEstatePort) {}
  async execute(realEstateId: string) {
    if (!realEstateId) throw new Error("realEstateId requerido");
    return this.realEstate.getById(realEstateId);
  }
}

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

export class UpdateLogoRealEstate {
  constructor(
    private realEstate: RealEstatePort,
  ) { }

  async execute(realEstateId: string, file: File) {
    if (!file || !realEstateId) {
      throw new Error("Datos inválidas");
    }
    const logoUrl = await this.realEstate.uploadLogo(realEstateId, file);
    
    await this.realEstate.updatePathLogo(realEstateId, logoUrl ?? '');
  }
}
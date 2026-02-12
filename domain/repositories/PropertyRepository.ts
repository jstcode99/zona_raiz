import { Property } from "../entities/Property"

export interface PropertyRepository {
  search(query?: string): Promise<Property[]>
  findById(id: string): Promise<Property | null>
  update(id: string, data: Partial<Property>): Promise<void>
  softDelete(id: string): Promise<void>
  create(data: Omit<Property, "id">): Promise<Property>
}

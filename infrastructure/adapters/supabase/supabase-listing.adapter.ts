import { mapListingRowToEntity } from "@/application/mappers/listing.mapper";
import { ListingEntity } from "@/domain/entities/listing.entity";
import { ListingPort } from "@/domain/ports/listing.port";
import { SupabaseClient } from "@supabase/supabase-js";

export class SupabaseListingAdapter implements ListingPort {
  constructor(private readonly supabase: SupabaseClient) { }

  async all(filters?: any): Promise<ListingEntity[]> {

    let query = this.supabase
      .from("listings")
      .select("*, property:properties(*)")
      .order("created_at", { ascending: false })

    if (filters?.real_estate_id) {
      query = query.eq("real_estate_id", filters?.real_estate_id)
    }
    if (filters?.property_id) {
      query = query.eq("property_id", filters.property_id)
    }
    if (filters?.type) {
      query = query.eq("property_type", filters.type)
    }
    if (filters?.listing_type) {
      query = query.eq("listing_type", filters.listing_type)
    }
    if (filters?.price) {
      query = query.eq("price", filters.price)
    }
    if (filters?.status) {
      query = query.eq("status", filters.status)
    }

    if (filters?.street) {
      query = query.eq("property.street", filters.street)
    }
    if (filters?.city) {
      query = query.eq("property.city", filters.city)
    }
    if (filters?.state) {
      query = query.eq("property.state", filters.state)
    }
    if (filters?.postal_code) {
      query = query.eq("property.postal_code", filters.postal_code)
    }
    if (filters?.country) {
      query = query.eq("property.country", filters.country)
    }
    if (filters?.neighborhood) {
      query = query.eq("property.neighborhood", filters.neighborhood)
    }
    if (filters?.min_bedrooms) {
      query = query.gte("property.bedrooms", filters.min_bedrooms)
    }
    if (filters?.min_bathrooms) {
      query = query.gte("property.bathrooms", filters.min_bathrooms)
    }
    if (filters?.search_query) {
      query = query.textSearch("property.search_vector", filters.search_query)
    }

    const { data, error } = await query

    if (error) throw new Error(error.message)

    return (data || []).map(item => mapListingRowToEntity(item)!) as ListingEntity[]
  }

  async create(data: Partial<ListingEntity>): Promise<ListingEntity> {

    const { data: row, error } = await this.supabase
      .from("listings")
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return row.map(mapListingRowToEntity)
  }

  async update(id: string, data: Partial<ListingEntity>): Promise<ListingEntity> {

    const { data: row, error } = await this.supabase
      .from("listings")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return mapListingRowToEntity(row)
  }

  async findById(id: string): Promise<ListingEntity | null> {
    const { data: row, error } = await this.supabase
      .from("listings")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !row) return null;
    return mapListingRowToEntity(row)
  }

  async findActive(): Promise<ListingEntity[]> {
    const { data: row, error } = await this.supabase
      .from("listings")
      .select("*")
      .eq("status", "active");

    if (error) throw error;
    return row.map(mapListingRowToEntity)
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from("listings")
      .delete()
      .eq("id", id);

    if (error) throw error;
  }
}
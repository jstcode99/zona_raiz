import { mapEnquiryRowToEntity } from "@/application/mappers/enquiry.mapper";
import { EnquiryEntity } from "@/domain/entities/enquiry.entity";
import { EnquiryStatus } from "@/domain/entities/enquiry.enums";
import { EnquiryFilters, EnquiryPort } from "@/domain/ports/enquiry.port";
import { SupabaseClient } from "@supabase/supabase-js";

export class SupabaseEnquiryAdapter implements EnquiryPort {
  constructor(private readonly supabase: SupabaseClient) {}

  async all(filters?: EnquiryFilters): Promise<EnquiryEntity[]> {
    let query = this.supabase
      .from("enquiries")
      .select(
        `
        *,
        listing:listings (
          id,
          property:properties (id, title, slug, real_estate_id)
        ),
        assigned_to_profile:real_estate_agents (
          profile:profiles (id, full_name, avatar_url, email)
        )
      `,
      )
      .order("created_at", { ascending: false });

    if (filters?.listing_id) {
      query = query.eq("listing_id", filters.listing_id);
    }
    if (filters?.status) {
      query = query.eq("status", filters.status);
    }
    if (filters?.assigned_to) {
      query = query.eq("assigned_to", filters.assigned_to);
    }
    if (filters?.source) {
      query = query.eq("source", filters.source);
    }
    if (filters?.start_date) {
      query = query.gte("created_at", filters.start_date);
    }
    if (filters?.end_date) {
      query = query.lte("created_at", filters.end_date);
    }

    const { data, error } = await query;

    if (error) throw new Error(error.message);

    return (data || []).map(mapEnquiryRowToEntity);
  }

  async create(data: Partial<EnquiryEntity>): Promise<EnquiryEntity> {
    const { data: row, error } = await this.supabase
      .from("enquiries")
      .insert({
        ...data,
        status: EnquiryStatus.NEW,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return mapEnquiryRowToEntity(row);
  }

  async update(
    id: string,
    data: Partial<EnquiryEntity>,
  ): Promise<EnquiryEntity> {
    const { data: row, error } = await this.supabase
      .from("enquiries")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return mapEnquiryRowToEntity(row);
  }

  async findById(id: string): Promise<EnquiryEntity | null> {
    const { data: row, error } = await this.supabase
      .from("enquiries")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !row) return null;
    return mapEnquiryRowToEntity(row);
  }

  async findByListingId(listingId: string): Promise<EnquiryEntity[]> {
    const { data, error } = await this.supabase
      .from("enquiries")
      .select("*")
      .eq("listing_id", listingId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return (data || []).map(mapEnquiryRowToEntity);
  }

  async findByAgentId(agentId: string): Promise<EnquiryEntity[]> {
    const { data, error } = await this.supabase
      .from("enquiries")
      .select("*")
      .eq("assigned_to", agentId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return (data || []).map(mapEnquiryRowToEntity);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from("enquiries")
      .delete()
      .eq("id", id);

    if (error) throw error;
  }

  async count(filters?: EnquiryFilters): Promise<number> {
    let query = this.supabase
      .from("enquiries")
      .select("*", { count: "exact", head: true });

    if (filters?.listing_id) {
      query = query.eq("listing_id", filters.listing_id);
    }
    if (filters?.status) {
      query = query.eq("status", filters.status);
    }
    if (filters?.assigned_to) {
      query = query.eq("assigned_to", filters.assigned_to);
    }
    if (filters?.start_date) {
      query = query.gte("created_at", filters.start_date);
    }
    if (filters?.end_date) {
      query = query.lte("created_at", filters.end_date);
    }

    const { count, error } = await query;

    if (error) throw new Error(error.message);

    return count || 0;
  }
}

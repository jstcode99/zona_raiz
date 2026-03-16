import { mapInquiryRowToEntity } from "@/application/mappers/inquiry.mapper";
import { InquiryEntity } from "@/domain/entities/inquiry.entity";
import { InquiryPort } from "@/domain/ports/inquiry.port";
import { SupabaseClient } from "@supabase/supabase-js";

export class SupabaseInquiryAdapter implements InquiryPort {
  constructor(private readonly supabase: SupabaseClient) { }

  async all(filters?: any): Promise<InquiryEntity[]> {
    let query = this.supabase
      .from("inquiries")
      .select(`
        *,
        listing:listings (
          id,
          property:properties (id, title, slug)
        ),
        assigned_to_profile:real_estate_agents (
          profile:profiles (id, full_name, avatar_url, email)
        )
      `)
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

    return (data || []).map(mapInquiryRowToEntity);
  }

  async create(data: Partial<InquiryEntity>): Promise<InquiryEntity> {
    const { data: row, error } = await this.supabase
      .from("inquiries")
      .insert(data)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return mapInquiryRowToEntity(row);
  }

  async update(id: string, data: Partial<InquiryEntity>): Promise<InquiryEntity> {
    const { data: row, error } = await this.supabase
      .from("inquiries")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return mapInquiryRowToEntity(row);
  }

  async findById(id: string): Promise<InquiryEntity | null> {
    const { data: row, error } = await this.supabase
      .from("inquiries")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !row) return null;
    return mapInquiryRowToEntity(row);
  }

  async findByListingId(listingId: string): Promise<InquiryEntity[]> {
    const { data, error } = await this.supabase
      .from("inquiries")
      .select("*")
      .eq("listing_id", listingId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return (data || []).map(mapInquiryRowToEntity);
  }

  async findByAgentId(agentId: string): Promise<InquiryEntity[]> {
    const { data, error } = await this.supabase
      .from("inquiries")
      .select("*")
      .eq("assigned_to", agentId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return (data || []).map(mapInquiryRowToEntity);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from("inquiries")
      .delete()
      .eq("id", id);

    if (error) throw error;
  }

  async count(filters?: any): Promise<number> {
    let query = this.supabase
      .from("inquiries")
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

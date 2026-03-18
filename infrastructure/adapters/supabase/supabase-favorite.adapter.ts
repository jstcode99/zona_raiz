import { mapFavoriteRowToEntity } from "@/application/mappers/favorite.mapper";
import { FavoriteEntity } from "@/domain/entities/favorite.entity";
import { FavoritePort } from "@/domain/ports/favorite.port";
import { SupabaseClient } from "@supabase/supabase-js";

export class SupabaseFavoriteAdapter implements FavoritePort {
  constructor(private readonly supabase: SupabaseClient) {}

  async all(filters?: any): Promise<FavoriteEntity[]> {
    let query = this.supabase
      .from("favorites")
      .select("*")
      .order("created_at", { ascending: false });

    if (filters?.profile_id) {
      query = query.eq("profile_id", filters.profile_id);
    }
    if (filters?.listing_id) {
      query = query.eq("listing_id", filters.listing_id);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return (data || []).map(mapFavoriteRowToEntity);
  }

  async findById(id: string): Promise<FavoriteEntity | null> {
    const { data: row, error } = await this.supabase
      .from("favorites")
      .select("*")
      .eq("id", id)
      .single();
    if (error || !row) return null;
    return mapFavoriteRowToEntity(row);
  }

  async findByProfileId(profileId: string): Promise<FavoriteEntity[]> {
    const { data, error } = await this.supabase
      .from("favorites")
      .select("*")
      .eq("profile_id", profileId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data || []).map(mapFavoriteRowToEntity);
  }

  async findByListingId(listingId: string): Promise<FavoriteEntity[]> {
    const { data, error } = await this.supabase
      .from("favorites")
      .select("*")
      .eq("listing_id", listingId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data || []).map(mapFavoriteRowToEntity);
  }

  async exists(profileId: string, listingId: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from("favorites")
      .select("id")
      .eq("profile_id", profileId)
      .eq("listing_id", listingId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return !!data;
  }

  async create(data: Partial<FavoriteEntity>): Promise<FavoriteEntity> {
    const { data: row, error } = await this.supabase
      .from("favorites")
      .insert(data)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return mapFavoriteRowToEntity(row);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from("favorites")
      .delete()
      .eq("id", id);
    if (error) throw error;
  }

  async deleteByProfileAndListing(
    profileId: string,
    listingId: string,
  ): Promise<void> {
    const { error } = await this.supabase
      .from("favorites")
      .delete()
      .eq("profile_id", profileId)
      .eq("listing_id", listingId);
    if (error) throw error;
  }

  async count(filters?: any): Promise<number> {
    let query = this.supabase
      .from("favorites")
      .select("*", { count: "exact", head: true });

    if (filters?.profile_id) {
      query = query.eq("profile_id", filters.profile_id);
    }
    if (filters?.listing_id) {
      query = query.eq("listing_id", filters.listing_id);
    }

    const { count, error } = await query;
    if (error) throw new Error(error.message);
    return count || 0;
  }
}

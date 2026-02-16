import { RealEstateRepository } from "@/domain/repositories/RealEstateRepository";
import { RealEstate } from "@/domain/entities/RealEstate";
import { createSupabaseServerClient } from "./supabase.server";
import { createSupabaseRouteClient } from "./supabase.route";
import { cache } from "react";

export class SupabaseRealEstateRepository implements RealEstateRepository {
  findAll = cache(async (): Promise<RealEstate[]> => {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("real_estates")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error("Failed to load real estates");
    }

    return data as RealEstate[];
  });

  findById = cache(async (id: string): Promise<RealEstate | null> => {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("real_estates")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return null;
    }

    return data as RealEstate;
  });

  findBySlug = cache(async (slug: string): Promise<RealEstate | null> => {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("real_estates")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      return null;
    }

    return data as RealEstate;
  });

  async create(
    data: Omit<RealEstate, "id" | "created_at">
  ): Promise<RealEstate> {
    const supabase = await createSupabaseRouteClient();

    const { data: createdData, error } = await supabase
      .from("real_estates")
      .insert(data)
      .select(`*`)
      .single();

    if (error) {
      console.log(error);
      throw new Error("Failed to create real estate");
    }

    return createdData as RealEstate;
  }

  async update(id: string, data: Partial<RealEstate>): Promise<void> {
    const supabase = await createSupabaseRouteClient();

    const { error } = await supabase
      .from("real_estates")
      .update(data)
      .eq("id", id);

    if (error) {
      throw new Error("Failed to update real estate");
    }
  }

  async delete(id: string): Promise<void> {
    const supabase = await createSupabaseRouteClient();

    const { error } = await supabase.from("real_estates").delete().eq("id", id);

    if (error) {
      throw new Error("Failed to delete real estate");
    }
  }
}

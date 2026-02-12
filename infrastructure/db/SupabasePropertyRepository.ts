import { PropertyRepository } from "@/domain/repositories/PropertyRepository"
import { createSupabaseRouteClient } from "./supabase.route"
import { Property } from "@/domain/entities/Property"
import { createSupabaseServerClient } from "./supabase.server"
import { encodedRedirect } from "@/shared/redirect"

export class SupabasePropertyRepository implements PropertyRepository {
  async search(query?: string, sort: 'asc' | 'desc' = 'asc'): Promise<Property[]> {
    console.log(query, 'query');
    
    const supabase = await createSupabaseServerClient()

    let q = supabase
      .from('properties')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: sort === 'asc' })

    if (query?.trim()) {
      q = q.ilike('title', `%${query.trim()}%`)
    }
    
    const { data, error } = await q

    if (error) {
      return encodedRedirect("error", "/dashboard", "Failed to load properties");
    }

    return data as Property[]
  }

  async findById(id: string): Promise<Property | null> {
    const supabase = await createSupabaseServerClient()

    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("id", id)
      .single()

    if (error || !data) {
      return encodedRedirect("error", "/dashboard/properties", "Property not found");
    }

    return data as Property
  }

  async update(id: string, data: Partial<Property>): Promise<void> {
    const supabase = await createSupabaseRouteClient()

    const { error } = await supabase
      .from("properties")
      .update(data)
      .eq("id", id)

    if (error) {
      return encodedRedirect("error", "/dashboard/properties", "Failed to update property");
    }
  }

  async softDelete(id: string): Promise<void> {
    const supabase = await createSupabaseRouteClient()

    const { error } = await supabase
      .from("properties")
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)

    if (error) {
      return encodedRedirect("error", "/dashboard/properties", "Failed to delete property");
    }
  }

  async create(data: Omit<Property, "id">): Promise<Property> {
    const supabase = await createSupabaseRouteClient()

    const { data: createdData, error } = await supabase
      .from("properties")
      .insert(data)
      .select("*")
      .single()

    if (error) {
      console.log(error, 'error');
      
      return encodedRedirect("error", "/dashboard/properties", "Failed to create property");
    }

    return createdData as Property
  }
}
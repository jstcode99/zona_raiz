import { PropertyRepository } from "@/domain/repositories/PropertyRepository"
import { createSupabaseRouteClient } from "./supabase.route"
import { Property } from "@/domain/entities/Property"
import { createSupabaseServerClient } from "./supabase.server"
import { cache } from 'react'

export class SupabasePropertyRepository implements PropertyRepository {

  search = cache(async (query?: string, sort: 'asc' | 'desc' = 'asc'): Promise<Property[]> => {
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
      throw new Error("Failed to load properties")
    }

    return data as Property[]
  })

  findById = cache(async (id: string): Promise<Property | null> => {
    const supabase = await createSupabaseServerClient()

    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("id", id)
      .single()

    if (error || !data) {
      console.log(error, 'error');
      throw new Error('Failed find property')
    }

    return data as Property
  })


  async update(data: Partial<Property>): Promise<void> {
    const supabase = await createSupabaseRouteClient()

    const { error } = await supabase
      .from("properties")
      .update({
        address: data.address,
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state,
        country: data.country,
        longitude: data.longitude,
        latitude: data.latitude,
        google_maps_url: data.google_maps_url,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        area_m2: data.area_m2,
      })
      .eq("id", data.id)

    if (error) {
      throw new Error("Failed to update property")
    }
  }

  async softDelete(id: string): Promise<void> {
    const supabase = await createSupabaseRouteClient()

    const { error } = await supabase
      .from("properties")
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)

    if (error) {
      throw new Error("Failed to delete property")
    }
  }

  async create(data: Omit<Property, "id">): Promise<Property> {
    const supabase = await createSupabaseRouteClient()
    const { data: auth } = await supabase.auth.getUser()

    if (!auth.user) throw new Error('Authentication required')

    const { data: createdData, error } = await supabase
      .from("properties")
      .insert({
        ...data,
        real_estate_id: auth.user?.id
      })
      .select(`
        id,
        address,
        latitude,
        longitude,
        google_maps_url,
        bedrooms,
        bathrooms,
        area_m2,
        country,
        state,
        city
      `)
      .single()

    if (error) {
      console.log(error);
      throw new Error('Failed to create property')
    }

    return createdData as Property
  }
}
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
        title: data.title,
        address: data.address,
        meta_title: data.meta_title,
        meta_description: data.meta_description,
        neighborhood: data.neighborhood,
        latitude: data.latitude,
        longitude: data.longitude,
        google_maps_url: data.google_maps_url,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        area_m2: data.area_m2,
        description: data.description,
        status: data.status,
        country: data.country,
        state: data.state,
        city: data.city,
        price: data.price,
        currency: data.currency,
        slug: data.slug,
        business_type: data.business_type,
        whatsapp_contact: data.whatsapp_contact,
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
        agent_id: auth.user?.id
      })
      .select(`
        id,
        address,
        meta_title,
        meta_description,
        neighborhood,
        latitude,
        longitude,
        google_maps_url,
        bedrooms,
        bathrooms,
        area_m2,
        title,
        description,
        status,
        country,
        state,
        city,
        price,
        currency,
        slug,
        business_type,
        whatsapp_contact
      `)
      .single()

    if (error) {
      throw new Error('Failed to create property')
    }

    return createdData as Property
  }
}
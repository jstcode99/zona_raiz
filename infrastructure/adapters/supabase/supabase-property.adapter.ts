import { mapPropertyRowToEntity } from "@/application/mappers/property.mapper";
import { PropertyEntity } from "@/domain/entities/property.entity";
import { RealEstateEntity } from "@/domain/entities/real-estate.entity";
import { PropertyPort } from "@/domain/ports/property.port";
import { SupabaseClient } from "@supabase/supabase-js";

export class SupabasePropertyAdapter implements PropertyPort {
    constructor(private supabase: SupabaseClient) { }

    async getById(id: string): Promise<PropertyEntity | null> {
        const { data, error } = await this.supabase
            .from("properties")
            .select("*, real_estate:real_estates(*)")
            .eq("id", id)
            .single()

        if (error) {
            if (error.code === "PGRST116") return null
            throw new Error(error.message)
        }

        return mapPropertyRowToEntity(data)
    }

    async getBySlug(slug: string): Promise<PropertyEntity | null> {
        const { data, error } = await this.supabase
            .from("properties")
            .select("*, real_estate:real_estates(*)")
            .eq("slug", slug)
            .single()

        if (error) {
            if (error.code === "PGRST116") return null
            throw new Error(error.message)
        }

        return mapPropertyRowToEntity(data)
    }

    async getByRealEstate(realEstateId: string): Promise<PropertyEntity[]> {
        const { data, error } = await this.supabase
            .from("properties")
            .select("*")
            .eq("real_estate_id", realEstateId)
            .order("created_at", { ascending: false })

        if (error) throw new Error(error.message)

        return (data || []).map(item => mapPropertyRowToEntity(item)!) as PropertyEntity[]
    }

    async all(filters?: any): Promise<PropertyEntity[]> {

        let query = this.supabase
            .from("properties")
            .select("*, real_estate:real_estates(*)")
            .order("created_at", { ascending: false })

        if (filters?.real_estate_id) {
            query = query.eq("real_estate_id", filters.real_estate_id)
        }
        if (filters?.country) {
            query = query.eq("country", filters.country)
        }
        if (filters?.state) {
            query = query.eq("state", filters.state)
        }
        if (filters?.city) {
            query = query.eq("city", filters.city)
        }
        if (filters?.street) {
            query = query.ilike("street", `%${filters.street}%`)
        }
        if (filters?.neighborhood) {
            query = query.ilike("neighborhood", `%${filters.neighborhood}%`)
        }
        if (filters?.bedrooms) {
            query = query.gte("bedrooms", filters.bedrooms)
        }
        if (filters?.bathrooms) {
            query = query.gte("bathrooms", filters.bathrooms)
        }
        if (filters?.search) {
            query = query.textSearch("search_vector", filters.search)
        }

        const { data, error } = await query

        if (error) throw new Error(error.message)

        return (data || []).map(item => mapPropertyRowToEntity(item)!) as PropertyEntity[]
    }

    async create(realEstateId: string, data: Partial<RealEstateEntity>): Promise<PropertyEntity> {
        const { data: inserted, error: dbError } = await this.supabase
            .from("properties")
            .insert({
                ...data,
                real_estate_id: realEstateId,
            })
            .select()
            .single()


        if (dbError) throw new Error(dbError.message)
        if (!inserted) throw new Error("Failed to create property")

        return mapPropertyRowToEntity(inserted) as PropertyEntity
    }

    async update(id: string, data: Partial<RealEstateEntity>): Promise<PropertyEntity> {

        const { data: updated, error: dbError } = await this.supabase
            .from("properties")
            .update({
                ...data,
                updated_at: new Date().toISOString(),
            })
            .eq("id", id)
            .select()
            .single()

        if (dbError) throw new Error(dbError.message)
        if (!updated) throw new Error("Failed to update property")

        return mapPropertyRowToEntity(updated) as PropertyEntity
    }

    async delete(id: string): Promise<void> {
        const { error: dbError } = await this.supabase
            .from("properties")
            .delete()
            .eq("id", id)

        if (dbError) throw new Error(dbError.message)
    }

    async generateSlug(title: string): Promise<string> {
        const baseSlug = title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .substring(0, 50)

        let slug = baseSlug
        let counter = 1
        const maxAttempts = 100

        while (!(await this.isSlugAvailable(slug)) && counter < maxAttempts) {
            slug = `${baseSlug}-${counter}`
            counter++
        }

        if (counter >= maxAttempts) {
            slug = `${baseSlug}-${Date.now()}`
        }

        return slug
    }

    async isSlugAvailable(slug: string, excludeId?: string): Promise<boolean> {
        let query = this.supabase
            .from("properties")
            .select("id")
            .eq("slug", slug)

        if (excludeId) {
            query = query.neq("id", excludeId)
        }

        const { data, error } = await query.maybeSingle()

        if (error) throw new Error(error.message)

        return data === null
    }
}
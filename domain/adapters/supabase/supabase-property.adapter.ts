import { PropertyEntity, PropertyFilters, PropertyType } from "@/domain/entities/property.entity";
import { PropertyFormValues } from "@/domain/entities/schemas/property.schema";
import { PropertyPort } from "@/domain/ports/property.port";
import { createSupabaseRouteClient } from "@/infrastructure/db/supabase.route";
import { createSupabaseServerClient } from "@/infrastructure/db/supabase.server";

export class SupabasePropertyAdapter implements PropertyPort {

    async getById(id: string): Promise<PropertyEntity | null> {
        const supabase = await createSupabaseServerClient()
        const { data, error } = await supabase
            .from("properties")
            .select("*, real_estate:real_estates(*)")
            .eq("id", id)
            .single()

        if (error) {
            if (error.code === "PGRST116") return null
            throw new Error(error.message)
        }

        return this.mapToEntity(data)
    }

    async getBySlug(slug: string): Promise<PropertyEntity | null> {
        const supabase = await createSupabaseServerClient()
        const { data, error } = await supabase
            .from("properties")
            .select("*, real_estate:real_estates(*)")
            .eq("slug", slug)
            .single()

        if (error) {
            if (error.code === "PGRST116") return null
            throw new Error(error.message)
        }

        return this.mapToEntity(data)
    }

    async getByRealEstate(realEstateId: string): Promise<PropertyEntity[]> {
        const supabase = await createSupabaseServerClient()
        const { data, error } = await supabase
            .from("properties")
            .select("*")
            .eq("real_estate_id", realEstateId)
            .order("created_at", { ascending: false })

        if (error) throw new Error(error.message)

        return (data || []).map(item => this.mapToEntity(item)!) as PropertyEntity[]
    }

    async all(filters?: PropertyFilters): Promise<PropertyEntity[]> {
        const supabase = await createSupabaseServerClient()
        
        let query = supabase
            .from("properties")
            .select("*, real_estate:real_estates(*)")
            .order("created_at", { ascending: false })

        if (filters?.realEstateId) {
            query = query.eq("real_estate_id", filters.realEstateId)
        }
        if (filters?.propertyType) {
            query = query.eq("property_type", filters.propertyType)
        }
        if (filters?.city) {
            query = query.eq("city", filters.city)
        }
        if (filters?.state) {
            query = query.eq("state", filters.state)
        }
        if (filters?.neighborhood) {
            query = query.eq("neighborhood", filters.neighborhood)
        }
        if (filters?.minBedrooms) {
            query = query.gte("bedrooms", filters.minBedrooms)
        }
        if (filters?.minBathrooms) {
            query = query.gte("bathrooms", filters.minBathrooms)
        }
        if (filters?.searchQuery) {
            query = query.textSearch("search_vector", filters.searchQuery)
        }

        const { data, error } = await query

        if (error) throw new Error(error.message)

        return (data || []).map(item => this.mapToEntity(item)!) as PropertyEntity[]
    }

    async create(realEstateId: string, data: PropertyFormValues): Promise<PropertyEntity> {
        const supabase = await createSupabaseRouteClient()

        const { data: inserted, error: dbError } = await supabase
            .from("properties")
            .insert({
                ...data,
                real_estate_id: realEstateId,
            })
            .select()
            .single()

        if (dbError) throw new Error(dbError.message)
        if (!inserted) throw new Error("Failed to create property")

        return this.mapToEntity(inserted) as PropertyEntity
    }

    async update(id: string, data: PropertyFormValues): Promise<PropertyEntity> {
        const supabase = await createSupabaseRouteClient()

        const { data: updated, error: dbError } = await supabase
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

        return this.mapToEntity(updated) as PropertyEntity
    }

    async delete(id: string): Promise<void> {
        const supabase = await createSupabaseRouteClient()

        const { error: dbError } = await supabase
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
        const supabase = await createSupabaseServerClient()

        let query = supabase
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

    private mapToEntity(data: any): PropertyEntity | null {
        if (!data) return null

        return {
            ...data,
            id: data.id,
            property_type: data.property_type as PropertyType,
        }
    }
}
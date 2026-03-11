import { mapPropertyRowToEntity } from "@/application/mappers/property.mapper";
import { PropertyEntity } from "@/domain/entities/property.entity";
import { PropertyType } from "@/domain/entities/property.enums";
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
            .select(`
                *, 
                real_estate:real_estates(*),
                property_images:property_images(*)`)
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

    async create(realEstateId: string, data: Partial<PropertyEntity>): Promise<PropertyEntity> {
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

    async update(id: string, data: Partial<PropertyEntity>): Promise<PropertyEntity> {

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

    async count(filters?: any): Promise<number> {
        let query = this.supabase
            .from("properties")
            .select("*", { count: "exact", head: true })

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
        if (filters?.property_type) {
            query = query.eq("property_type", filters.property_type)
        }
        if (filters?.agent_id || filters?.created_by) {
            const agentId = filters.agent_id || filters.created_by
            query = query.eq("created_by", agentId)
        }

        if (filters?.start_date) {
            query = query.gte("created_at", filters.start_date)
        }
        if (filters?.end_date) {
            query = query.lte("created_at", filters.end_date)
        }

        const { count, error } = await query

        if (error) throw new Error(error.message)

        return count || 0
    }

    async countByTypes(realEstateId?: string): Promise<Record<PropertyType, number>> {
        let query = this.supabase
            .from("properties")
            .select("property_type, count:property_type", { count: "exact" })

        if (realEstateId) {
            query = query.eq("real_estate_id", realEstateId)
        }

        const { data, error } = await query

        if (error) throw new Error(error.message)

        const result: Record<PropertyType, number> = {
            [PropertyType.House]: 0,
            [PropertyType.Apartment]: 0,
            [PropertyType.Condo]: 0,
            [PropertyType.TownHouse]: 0,
            [PropertyType.Land]: 0,
            [PropertyType.Commercial]: 0,
            [PropertyType.Office]: 0,
            [PropertyType.Warehouse]: 0,
            [PropertyType.Other]: 0,
        }

        const typeCounts = (data || []).reduce((acc, item) => {
            const type = item.property_type as PropertyType
            acc[type] = (acc[type] || 0) + 1
            return acc
        }, {} as Record<string, number>)

        for (const [key, value] of Object.entries(typeCounts)) {
            if (key in result) {
                result[key as PropertyType] = value
            }
        }

        return result
    }
}
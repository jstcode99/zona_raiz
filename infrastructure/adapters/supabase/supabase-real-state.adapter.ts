import { mapRealEstateRowToEntity } from "@/application/mappers/real-estate.mapper";
import { RealEstateEntity, RealEstateFilters } from "@/domain/entities/real-estate.entity";
import { RealEstatePort } from "@/domain/ports/real-estate.port";
import { STORAGE_BUCKETS } from "@/infrastructure/config/constants";
import { SupabaseClient } from "@supabase/supabase-js";

export class SupabaseRealEstateAdapter implements RealEstatePort {
  constructor(private readonly supabase: SupabaseClient) { }

  async all(filters?: RealEstateFilters): Promise<RealEstateEntity[]> {
    let query = this.supabase.from("real_estates").select("*")

    if (filters?.id) query = query.eq("id", filters.id)
    if (filters?.city) query = query.eq("city", filters.city)

    if (filters?.searchQuery) {
      query = query.ilike("name", `%${filters.searchQuery}%`)
    }

    const { data, error } = await query

    if (error) throw new Error(error.message)

    return data.map(mapRealEstateRowToEntity)
  }

  async getById(id: string): Promise<RealEstateEntity> {
    const { data, error } = await this.supabase
      .from("real_estates")
      .select("*")
      .eq("id", id)
      .single()

    if (error || !data) throw new Error("Real estate not found")

    return mapRealEstateRowToEntity(data)
  }

  async create(input: Partial<RealEstateEntity>): Promise<string> {
    const { data, error } = await this.supabase
      .from("real_estates")
      .insert(input)
      .select("id")
      .single()

    if (error || !data) {
      throw new Error(error?.message || "Failed to create real estate")
    }

    return data.id
  }

  async update(id: string, input: Partial<RealEstateEntity>): Promise<void> {
    const { error } = await this.supabase
      .from("real_estates")
      .update({
        ...input,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)

    if (error) throw new Error(error.message)
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from("real_estates")
      .delete()
      .eq("id", id)

    if (error) throw new Error(error.message)
  }

  async uploadLogo(id: string, file: File): Promise<string> {
    const ext = file.type.split("/")[1] || "webp"
    const path = `${id}/logo.${ext}`

    const { error } = await this.supabase.storage
      .from(STORAGE_BUCKETS.REAL_ESTATE_LOGOS)
      .upload(path, file, {
        upsert: true,
        contentType: file.type,
      })

    if (error) throw new Error(error.message)

    const { data } = this.supabase.storage
      .from(STORAGE_BUCKETS.REAL_ESTATE_LOGOS)
      .getPublicUrl(path)

    return `${data.publicUrl}?t=${Date.now()}`
  }
  
  async updatePathLogo(realEstateId: string, logoUrl: string): Promise<void> {
    const current = await this.getById(realEstateId)
    let oldPath: string | null = null

    if (!current) throw new Error("Real estate not found or no access")

    const { error: updateError } = await this.supabase
      .from("real_estates")
      .update({ logo_url: logoUrl })
      .eq("id", realEstateId)

    if (updateError) {
      // Rollback: eliminar logo subido
      await this.supabase.storage.from(STORAGE_BUCKETS.REAL_ESTATE_LOGOS).remove([logoUrl])
      throw new Error(`Failed to update logo URL: ${updateError.message}`)
    }
    // Extraer path antiguo para eliminarlo después
    if (current.logo_url) {
      try {
        const url = new URL(current.logo_url)
        const pathMatch = url.pathname.match(/real-estate-logos\/(.+)/)
        oldPath = pathMatch ? pathMatch[1] : null
      } catch {
        // Si no es URL válida, intentar extraer directamente
        const parts = current.logo_url.split('/')
        const bucketIndex = parts.indexOf(STORAGE_BUCKETS.REAL_ESTATE_LOGOS)
        if (bucketIndex !== -1) {
          oldPath = parts.slice(bucketIndex + 1).join('/')
        }

        // Eliminar logo antiguo solo si se subió uno nuevo exitosamente
        if (oldPath && logoUrl && oldPath !== logoUrl) {
          await this.supabase.storage
            .from(STORAGE_BUCKETS.REAL_ESTATE_LOGOS)
            .remove([oldPath])
            .catch(err => console.warn("Failed to delete old logo:", err)) // No fallar si no se puede eliminar
        }
      }
    }
  }

}
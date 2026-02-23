
import { RealEstateEntity } from "@/domain/entities/real-estate.entity";
import { RealEstateFormValues } from "@/domain/entities/schemas/real-estate.schema";
import { RealEstatePort } from "@/domain/ports/real-estate.port";
import { STORAGE_BUCKETS } from "@/infrastructure/config/constants";
import { createSupabaseRouteClient } from "@/infrastructure/db/supabase.route";
import { createSupabaseServerClient } from "@/infrastructure/db/supabase.server";

export class SupabaseRealEstateAdapter implements RealEstatePort {

  async getById(idRealEstate: string): Promise<RealEstateEntity | null> {
    const supabase = await createSupabaseServerClient()
    const { data, error } = await supabase
      .from("real_estates")
      .select("*")
      .eq("id", idRealEstate)
      .single()

    if (error) {
      if (error.code === "PGRST116") return null
      throw new Error(error.message)
    }

    return data as RealEstateEntity
  }

  async all(): Promise<RealEstateEntity[]> {

    const supabase = await createSupabaseServerClient()
    const { data, error } = await supabase
      .from("real_estates")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw new Error(error.message)

    return (data || []).map(({ real_estate_agents, ...rest }) => rest) as RealEstateEntity[]
  }

  // mutations
  async create(data: RealEstateFormValues): Promise<RealEstateEntity> {
    const supabase = await createSupabaseRouteClient()

    const {
      name,
      description,
      whatsapp,
    } = data

    const {
      street,
      city,
      state,
      postal_code,
      country
    } = data.address

    const { data: inserted, error: dbError } = await supabase
      .from("real_estates")
      .insert({
        name,
        description,
        whatsapp,
        street,
        city,
        state,
        postal_code,
        country
      })
      .select()
      .single()

    if (dbError) throw new Error(dbError.message)
    if (!inserted) throw new Error("Failed to create real estate")

    return inserted as RealEstateEntity
  }

  async update(realEstateId: string, data: RealEstateFormValues): Promise<RealEstateEntity> {
    const supabase = await createSupabaseRouteClient()

    const {
      name,
      description,
      whatsapp,
    } = data

    const {
      street,
      city,
      state,
      postal_code,
      country
    } = data.address

    const { data: updated, error: dbError } = await supabase
      .from("real_estates")
      .update({
        name,
        description,
        whatsapp,
        street,
        city,
        state,
        postal_code,
        country
      })
      .eq("id", realEstateId)
      .select()
      .single()

    if (dbError) throw new Error(dbError.message)
    if (!updated) throw new Error("Failed to update real estate")

    return updated as RealEstateEntity

  }

  async uploadLogo(realEstateId: string, file: File): Promise<string | null> {
    const supabase = await createSupabaseRouteClient()
    let uploadedPath: string | null = null

    if (file && file.size > 0) {
      const fileExt = file.name.split(".").pop()
      // Path: {real_estate_id}/{timestamp}.{ext} (según políticas RLS)
      uploadedPath = `${realEstateId}/${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase
        .storage
        .from(STORAGE_BUCKETS.REAL_ESTATE_LOGOS)
        .upload(uploadedPath, file, {
          contentType: file.type,
          upsert: false // false porque es nuevo
        })

      if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`)

      const { data: { publicUrl } } = supabase
        .storage
        .from(STORAGE_BUCKETS.REAL_ESTATE_LOGOS)
        .getPublicUrl(uploadedPath)

      return publicUrl as string
    }

    return null
  }

  async updatePathLogo(realEstateId: string, logoUrl: string): Promise<void> {
    const current = await this.getById(realEstateId)
    let oldPath: string | null = null

    if (!current) throw new Error("Real estate not found or no access")

    const supabase = await createSupabaseRouteClient()

    const { error: updateError } = await supabase
      .from("real_estates")
      .update({ logo_url: logoUrl })
      .eq("id", realEstateId)

    if (updateError) {
      // Rollback: eliminar logo subido
      await supabase.storage.from(STORAGE_BUCKETS.REAL_ESTATE_LOGOS).remove([logoUrl])
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
          await supabase.storage
            .from(STORAGE_BUCKETS.REAL_ESTATE_LOGOS)
            .remove([oldPath])
            .catch(err => console.warn("Failed to delete old logo:", err)) // No fallar si no se puede eliminar
        }
      }
    }
  }

  async delete(id: string): Promise<void> {

    const supabase = await createSupabaseRouteClient()

    const current = await this.findById(id)
    if (!current) throw new Error("Real estate not found or no access")

    let logoPath: string | null = null
    if (current.logo_url) {
      const urlParts = current.logo_url.split("/")
      logoPath = urlParts.slice(urlParts.indexOf(STORAGE_BUCKETS.REAL_ESTATE_LOGOS) + 1).join("/")
    }

    const { error: dbError } = await supabase
      .from("real_estates")
      .delete()
      .eq("id", id)

    if (dbError) throw new Error(dbError.message)

    if (logoPath) {
      await supabase.storage.from(STORAGE_BUCKETS.REAL_ESTATE_LOGOS).remove([logoPath])
    }
  }
}
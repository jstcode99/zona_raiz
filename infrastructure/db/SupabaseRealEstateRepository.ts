import { unstable_cache, revalidateTag } from "next/cache"
import { createSupabaseServerClient } from "./supabase.server"
import { createSupabaseRouteClient } from "./supabase.route"
import { RealEstateRepository } from "@/domain/repositories/RealEstateRepository"
import { RealEstate, RealEstateRole } from "@/domain/entities/RealEstate"
import { idSchema } from "@/domain/entities/fields/idSchema"
import {
  createRealEstateSchema,
  updateRealEstateSchema,
  CreateRealEstateFormValues,
  UpdateRealEstateFormValues
} from "@/domain/entities/schemas/realEstateSchema"
import {
  CACHE_TAGS,
  STORAGE_BUCKETS,
  REAL_ESTATE_ROLES,
} from "@/infrastructure/config/constants"
import { CacheConfig } from "../config/cache"

export class SupabaseRealEstateRepository implements RealEstateRepository {
  private cacheConfig: CacheConfig

  constructor(cacheConfig: Partial<CacheConfig> = {}) {
    this.cacheConfig = {
      revalidate: 3600,
      tags: [],
      ...cacheConfig
    }
  }

  // ==========================================
  // HELPERS PRIVADOS
  // ==========================================

  private async ensureAuth() {
    const supabase = await createSupabaseServerClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      throw new Error("Authentication required")
    }

    return { supabase, user }
  }

  private invalidateListCache(): void {
    revalidateTag(CACHE_TAGS.REAL_ESTATE.LIST, {})
    revalidateTag(CACHE_TAGS.REAL_ESTATE.ALL, {})
  }

  private invalidateDetailCache(id: string): void {
    revalidateTag(CACHE_TAGS.REAL_ESTATE.DETAIL(id), {})
  }

  // ==========================================
  // QUERIES
  // ==========================================

  async findByIdFresh(id: string): Promise<RealEstate | null> {
    const { user } = await this.ensureAuth()
    const validatedId = await idSchema.validate(id)

    const supabase = await createSupabaseServerClient()
    const { data, error } = await supabase
      .from("real_estates")
      .select("*")
      .eq("id", validatedId)
      .single()

    if (error) {
      if (error.code === "PGRST116") return null
      throw new Error(error.message)
    }

    return data as RealEstate
  }

  async findById(id: string): Promise<RealEstate | null> {
    const validatedId = await idSchema.validate(id)

    const fetchData = async () => {
      return this.findByIdFresh(validatedId)
    }

    const cachedFetch = unstable_cache(
      fetchData,
      [CACHE_TAGS.REAL_ESTATE.DETAIL(validatedId)],
      {
        revalidate: this.cacheConfig.revalidate,
        tags: [
          CACHE_TAGS.REAL_ESTATE.DETAIL(validatedId),
          CACHE_TAGS.REAL_ESTATE.ALL
        ]
      }
    )

    return cachedFetch()
  }

  async findAllFresh(): Promise<RealEstate[]> {
    await this.ensureAuth()

    const supabase = await createSupabaseServerClient()
    const { data, error } = await supabase
      .from("real_estates")
      .select(`
        *,
        real_estate_agents!inner(profile_id, role)
      `)
      .order("created_at", { ascending: false })

    if (error) throw new Error(error.message)

    return (data || []).map(({ real_estate_agents, ...rest }) => rest) as RealEstate[]
  }

  async findAll(): Promise<RealEstate[]> {
    const fetchData = async () => {
      return this.findAllFresh()
    }

    const cachedFetch = unstable_cache(
      fetchData,
      [CACHE_TAGS.REAL_ESTATE.LIST],
      {
        revalidate: this.cacheConfig.revalidate,
        tags: [CACHE_TAGS.REAL_ESTATE.LIST, CACHE_TAGS.REAL_ESTATE.ALL]
      }
    )

    return cachedFetch()
  }

  // ==========================================
  // MUTATIONS
  // ==========================================

  async create(data: CreateRealEstateFormValues): Promise<RealEstate> {
    const { user } = await this.ensureAuth()

    const validated = await createRealEstateSchema.validate(data, {
      abortEarly: false,
      stripUnknown: true
    })

    const supabase = await createSupabaseRouteClient()

    const {
      name,
      description,
      whatsapp,
      address,
      logo
    } = validated

    const {
      street,
      city,
      state,
      postal_code,
      country
    } = address

    let uploadedPath: string | null = null

    try {
      // 1. Crear la inmobiliaria (el trigger auto-crea el agente coordinador)
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
          country,
        })
        .select()
        .single()

      console.log(dbError);

      if (dbError) throw new Error(dbError.message)
      if (!inserted) throw new Error("Failed to create real estate")

      // 2. Subir logo si existe (después de crear, para tener el ID)
      let logoUrl: string | null = null

      if (logo && logo.size > 0) {
        const fileExt = logo.name.split(".").pop()
        // Path: {real_estate_id}/{timestamp}.{ext} (según políticas RLS)
        uploadedPath = `${inserted.id}/${Date.now()}.${fileExt}`

        const { error: uploadError } = await supabase
          .storage
          .from(STORAGE_BUCKETS.REAL_ESTATE_LOGOS)
          .upload(uploadedPath, logo, {
            contentType: logo.type,
            upsert: false // false porque es nuevo
          })

        if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`)

        const { data: { publicUrl } } = supabase
          .storage
          .from(STORAGE_BUCKETS.REAL_ESTATE_LOGOS)
          .getPublicUrl(uploadedPath)

        logoUrl = publicUrl

        // 3. Actualizar la inmobiliaria con el logo_url
        const { error: updateError } = await supabase
          .from("real_estates")
          .update({ logo_url: logoUrl })
          .eq("id", inserted.id)

        if (updateError) {
          // Rollback: eliminar logo subido
          await supabase.storage.from(STORAGE_BUCKETS.REAL_ESTATE_LOGOS).remove([uploadedPath])
          throw new Error(`Failed to update logo URL: ${updateError.message}`)
        }
      }

      this.invalidateListCache()

      return { ...inserted, logo_url: logoUrl } as RealEstate

    } catch (error) {
      // Cleanup en caso de error
      if (uploadedPath) {
        await supabase.storage.from(STORAGE_BUCKETS.REAL_ESTATE_LOGOS).remove([uploadedPath])
      }
      throw error
    }
  }

  async update(id: string, data: UpdateRealEstateFormValues): Promise<RealEstate> {
    const { user } = await this.ensureAuth()
    const validatedId = await idSchema.validate(id)

    const validated = await updateRealEstateSchema.validate(
      { ...data },
      { abortEarly: false, stripUnknown: true }
    )

    const supabase = await createSupabaseRouteClient()
    const {
      name,
      description,
      whatsapp,
      address,
      logo
    } = validated

    const {
      street,
      city,
      state,
      postal_code,
      country
    } = address


    let newPath: string | null = null
    let oldPath: string | null = null

    try {
      // Obtener datos actuales para verificar acceso y logo anterior
      const current = await this.findByIdFresh(id)
      if (!current) throw new Error("Real estate not found or no access")

      let logoUrl = current.logo_url

      // Procesar nuevo logo si se proporciona
      if (logo && logo.size > 0) {
        const fileExt = logo.name.split(".").pop()
        // Path: {real_estate_id}/{timestamp}.{ext}
        newPath = `${id}/${Date.now()}.${fileExt}`

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
          }
        }

        // Subir nuevo logo
        const { error: uploadError } = await supabase
          .storage
          .from(STORAGE_BUCKETS.REAL_ESTATE_LOGOS)
          .upload(newPath, logo, {
            contentType: logo.type,
            upsert: true // true para permitir reemplazo si existe
          })

        if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`)

        const { data: { publicUrl } } = supabase
          .storage
          .from(STORAGE_BUCKETS.REAL_ESTATE_LOGOS)
          .getPublicUrl(newPath)

        logoUrl = publicUrl
      }

      // Actualizar la inmobiliaria
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
          country,
          ...(logoUrl !== current.logo_url && { logo_url: logoUrl }),
          updated_at: new Date().toISOString()
        })
        .eq("id", validatedId)
        .select()
        .single()

      if (dbError) throw new Error(dbError.message)
      if (!updated) throw new Error("Failed to update real estate")

      // Eliminar logo antiguo solo si se subió uno nuevo exitosamente
      if (oldPath && newPath && oldPath !== newPath) {
        await supabase.storage
          .from(STORAGE_BUCKETS.REAL_ESTATE_LOGOS)
          .remove([oldPath])
          .catch(err => console.warn("Failed to delete old logo:", err)) // No fallar si no se puede eliminar
      }

      this.invalidateDetailCache(validatedId)
      this.invalidateListCache()

      return updated as RealEstate

    } catch (error) {
      // Cleanup: eliminar logo nuevo si hubo error
      if (newPath) {
        await supabase.storage
          .from(STORAGE_BUCKETS.REAL_ESTATE_LOGOS)
          .remove([newPath])
          .catch(() => { }) // Ignorar error de cleanup
      }
      throw error
    }
  }

  async delete(id: string): Promise<void> {
    const { user } = await this.ensureAuth()
    const validatedId = await idSchema.validate(id)

    const supabase = await createSupabaseRouteClient()

    const current = await this.findByIdFresh(validatedId)
    if (!current) throw new Error("Real estate not found or no access")

    let logoPath: string | null = null
    if (current.logo_url) {
      const urlParts = current.logo_url.split("/")
      logoPath = urlParts.slice(urlParts.indexOf(STORAGE_BUCKETS.REAL_ESTATE_LOGOS) + 1).join("/")
    }

    const { error: dbError } = await supabase
      .from("real_estates")
      .delete()
      .eq("id", validatedId)

    if (dbError) throw new Error(dbError.message)

    if (logoPath) {
      await supabase.storage.from(STORAGE_BUCKETS.REAL_ESTATE_LOGOS).remove([logoPath])
    }

    this.invalidateDetailCache(validatedId)
    this.invalidateListCache()
  }

  // ==========================================
  // AGENT MANAGEMENT
  // ==========================================

  async addAgent(
    realEstateId: string,
    profileId: string,
    role: RealEstateRole
  ): Promise<void> {
    await this.ensureAuth()

    const supabase = await createSupabaseRouteClient()

    if (!REAL_ESTATE_ROLES.includes(role)) {
      throw new Error("Invalid role")
    }

    const { error } = await supabase
      .from("real_estate_agents")
      .insert({
        real_estate_id: realEstateId,
        profile_id: profileId,
        role
      })

    if (error) {
      if (error.message.includes("duplicate key")) {
        throw new Error("Agent already assigned to this real estate")
      }
      throw new Error(error.message)
    }

    this.invalidateDetailCache(realEstateId)
  }

  async removeAgent(realEstateId: string, profileId: string): Promise<void> {
    await this.ensureAuth()

    const supabase = await createSupabaseRouteClient()

    const { error } = await supabase
      .from("real_estate_agents")
      .delete()
      .eq("real_estate_id", realEstateId)
      .eq("profile_id", profileId)

    if (error) throw new Error(error.message)

    this.invalidateDetailCache(realEstateId)
  }

  async getAgents(realEstateId: string): Promise<any[]> {
    await this.ensureAuth()

    const supabase = await createSupabaseServerClient()

    const { data, error } = await supabase
      .from("real_estate_agents")
      .select(`
        id,
        role,
        created_at,
        profiles (
          id,
          full_name,
          avatar_url,
          phone
        )
      `)
      .eq("real_estate_id", realEstateId)

    if (error) throw new Error(error.message)
    return data || []
  }

  invalidateAllCache(): void {
    revalidateTag(CACHE_TAGS.REAL_ESTATE.ALL, {})
  }
}

export const createRealEstateRepository = (
  cacheConfig?: Partial<CacheConfig>
): RealEstateRepository => {
  return new SupabaseRealEstateRepository(cacheConfig)
}
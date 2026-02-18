import { RealEstateRepository } from "@/domain/repositories/RealEstateRepository";
import { RealEstate, RealEstateCreateFormData, RealEstateUpdateFormData } from "@/domain/entities/RealEstate";
import { idSchema } from "@/domain/entities/fields/idSchema";
import { createRealEstateSchema, updateRealEstateSchema } from "@/domain/entities/schemas/realEstateSchema";
import { unstable_cache } from "next/cache";
import { revalidateTag } from 'next/cache'
import { createSupabaseServerClient } from "./supabase.server";
import { createSupabaseRouteClient } from "./supabase.route";

const CACHE_TAGS = {
  REAL_ESTATES_LIST: 'real-estates-list',
  REAL_ESTATE_DETAIL: (id: string) => `real-estate-${id}`,
  REAL_ESTATES_ALL: 'real-estates-all'
} as const

type CacheConfig = {
  revalidate?: number | false
  tags?: string[]
}

const defaultCacheConfig: CacheConfig = {
  revalidate: 3600, // 1 hora
  tags: []
}


export class SupabaseRealEstateRepository implements RealEstateRepository {
  private bucketName = 'real-estates'
  private cacheConfig: CacheConfig

  constructor(cacheConfig: Partial<CacheConfig> = {}) {
    this.cacheConfig = { ...defaultCacheConfig, ...cacheConfig }
  }

  private async getServerClient() {
    return createSupabaseServerClient()
  }

  private async getRouteClient() {
    return createSupabaseRouteClient()
  }

  async findByIdFresh(id: string): Promise<RealEstate | null> {
    const validatedId = await idSchema.validate(id)
    const supabase = await this.getServerClient()

    const { data, error } = await supabase
      .from('real_estates')
      .select('*')
      .eq('id', validatedId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw new Error(error.message)
    }

    return data
  }

  async findAllFresh(): Promise<RealEstate[]> {
    const supabase = await this.getServerClient()

    // RLS automáticamente filtra por real_estate_agents
    const { data, error } = await supabase
      .from('real_estates')
      .select(`
          *,
          real_estate_agents!inner(profile_id, role)
        `)
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return (data || []).map(({ real_estate_agents, ...rest }) => rest) as RealEstate[]
  }

  // ==========================================
  // MÉTODOS PÚBLICOS (con filtro por usuario)
  // ==========================================

  async findAll(): Promise<RealEstate[]> {
    const fetchData = async () => {
      const supabase = await this.getServerClient()

      // RLS automáticamente filtra por real_estate_agents
      const { data, error } = await supabase
        .from('real_estates')
        .select(`
          *,
          real_estate_agents!inner(profile_id, role)
        `)
        .order('created_at', { ascending: false })

      if (error) throw new Error(error.message)
      return (data || []).map(({ real_estate_agents, ...rest }) => rest) as RealEstate[]
    }

    const cachedFetch = unstable_cache(
      fetchData,
      [CACHE_TAGS.REAL_ESTATES_LIST],
      {
        revalidate: this.cacheConfig.revalidate,
        tags: [CACHE_TAGS.REAL_ESTATES_LIST, CACHE_TAGS.REAL_ESTATES_ALL]
      }
    )

    return cachedFetch()
  }

  async findById(id: string): Promise<RealEstate | null> {
    const validatedId = await idSchema.validate(id)

    const fetchData = async () => {
      const supabase = await this.getServerClient()

      const { data, error } = await supabase
        .from('real_estates')
        .select(`
          *,
          real_estate_agents!inner(profile_id, role)
        `)
        .eq('id', validatedId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') return null
        throw new Error(error.message)
      }

      const { real_estate_agents, ...rest } = data
      return rest as RealEstate
    }

    const cachedFetch = unstable_cache(
      fetchData,
      [CACHE_TAGS.REAL_ESTATE_DETAIL(validatedId)],
      {
        revalidate: this.cacheConfig.revalidate,
        tags: [
          CACHE_TAGS.REAL_ESTATE_DETAIL(validatedId),
          CACHE_TAGS.REAL_ESTATES_ALL
        ]
      }
    )

    return cachedFetch()
  }

  // ==========================================
  // MÉTODOS CON AUTH (usando RPC con RLS)
  // ==========================================

  async create(
    data: RealEstateCreateFormData
  ): Promise<RealEstate> {
    const validated = await createRealEstateSchema.validate(data, {
      abortEarly: false,
      stripUnknown: true
    })

    const supabase = await this.getRouteClient()
    const { name, description, whatsapp, address, logo } = validated

    let uploadedFileName: string | null = null

    try {
      // 1. Subir logo (RLS verifica que sea AGENT)
      const fileExt = logo.name.split('.').pop()
      uploadedFileName = `logos/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`

      const { error: uploadError } = await supabase
        .storage
        .from(this.bucketName)
        .upload(uploadedFileName, logo, { contentType: logo.type })

      if (uploadError) throw new Error(uploadError.message)

      // 2. Obtener URL
      const { data: { publicUrl } } = supabase
        .storage
        .from(this.bucketName)
        .getPublicUrl(uploadedFileName)

      // 3. Crear via RPC (maneja auth, trigger crea agente admin)
      const { data: inserted, error: dbError } = await supabase
        .rpc('create_real_estate', {
          p_name: name,
          p_description: description,
          p_whatsapp: whatsapp,
          p_address: address,
          p_logo_url: publicUrl
        })

      if (dbError) throw new Error(dbError.message)

      this.invalidateListCache()

      return inserted as RealEstate

    } catch (error) {
      if (uploadedFileName) {
        await supabase.storage.from(this.bucketName).remove([uploadedFileName])
      }
      throw error
    }
  }

  async update(
    id: string,
    data: Partial<RealEstateUpdateFormData>
  ): Promise<RealEstate> {
    const validated = await updateRealEstateSchema.validate({ id, ...data }, {
      abortEarly: false,
      stripUnknown: true
    })

    const supabase = await this.getRouteClient()
    const { id: validatedId, logo } = validated

    let newFileName: string | null = null
    let oldFileName: string | null = null

    try {
      // Verificar acceso (para obtener logo actual)
      const current = await this.findByIdFresh(validatedId)
      if (!current) throw new Error('No encontrado o sin acceso')

      let logoUrl = current.logo_url

      if (logo) {
        // Subir nuevo logo
        const fileExt = logo.name.split('.').pop()
        newFileName = `logos/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`

        const { error: uploadError } = await supabase
          .storage
          .from(this.bucketName)
          .upload(newFileName, logo, { contentType: logo.type })

        if (uploadError) throw new Error(uploadError.message)

        const { data: { publicUrl } } = supabase
          .storage
          .from(this.bucketName)
          .getPublicUrl(newFileName)

        logoUrl = publicUrl
        oldFileName = current.logo_url.split('/').pop() || null
      }

      // Actualizar via RPC (verifica que sea admin)
      const { data: updated, error: dbError } = await supabase
        .rpc('update_real_estate', {
          p_id: validatedId,
          p_name: validated.name || null,
          p_description: validated.description || null,
          p_whatsapp: validated.whatsapp || null,
          p_address: validated.address || null,
          p_logo_url: logoUrl
        })

      if (dbError) throw new Error(dbError.message)

      // Limpiar logo anterior
      if (oldFileName && newFileName) {
        await supabase.storage.from(this.bucketName).remove([`logos/${oldFileName}`])
      }

      this.invalidateDetailCache(validatedId)
      this.invalidateListCache()

      return updated as RealEstate

    } catch (error) {
      if (newFileName) {
        await supabase.storage.from(this.bucketName).remove([newFileName])
      }
      throw error
    }
  }

  async delete(id: string): Promise<void> {
    const validatedId = await idSchema.validate(id)
    const supabase = await this.getRouteClient()

    let fileNameToDelete: string | null = null

    try {
      // Verificar acceso y obtener logo
      const current = await this.findByIdFresh(validatedId)
      if (!current) throw new Error('No encontrado o sin acceso')

      if (current.logo_url) {
        fileNameToDelete = current.logo_url.split('/').pop() || null
      }

      // Eliminar via RPC (verifica que sea admin)
      const { error: dbError } = await supabase
        .rpc('delete_real_estate', { p_id: validatedId })

      if (dbError) throw new Error(dbError.message)

      // Limpiar storage
      if (fileNameToDelete) {
        await supabase.storage.from(this.bucketName).remove([`logos/${fileNameToDelete}`])
      }

      this.invalidateDetailCache(validatedId)
      this.invalidateListCache()

    } catch (error) {
      throw error
    }
  }

  // ==========================================
  // MÉTODOS ADICIONALES (gestión de agentes)
  // ==========================================

  async addAgent(
    realEstateId: string,
    profileId: string,
    role: 'admin' | 'agent' = 'agent'
  ): Promise<void> {
    const supabase = await this.getRouteClient()

    const { error } = await supabase
      .from('real_estate_agents')
      .insert({
        real_estate_id: realEstateId,
        profile_id: profileId,
        role
      })

    if (error) throw new Error(error.message)

    this.invalidateDetailCache(realEstateId)
  }

  async removeAgent(realEstateId: string, profileId: string): Promise<void> {
    const supabase = await this.getRouteClient()

    const { error } = await supabase
      .from('real_estate_agents')
      .delete()
      .eq('real_estate_id', realEstateId)
      .eq('profile_id', profileId)

    if (error) throw new Error(error.message)

    this.invalidateDetailCache(realEstateId)
  }

  // ==========================================
  // CACHE INVALIDATION
  // ==========================================

  private invalidateListCache(): void {
    revalidateTag(CACHE_TAGS.REAL_ESTATES_LIST, {})
    revalidateTag(CACHE_TAGS.REAL_ESTATES_ALL, {})
  }

  private invalidateDetailCache(id: string): void {
    revalidateTag(CACHE_TAGS.REAL_ESTATE_DETAIL(id), {})
  }

  invalidateAllCache(): void {
    revalidateTag(CACHE_TAGS.REAL_ESTATES_ALL, {})
  }
}

export const createRealEstateRepository = (
  cacheConfig?: Partial<CacheConfig>
): SupabaseRealEstateRepository => {
  return new SupabaseRealEstateRepository(cacheConfig)
}
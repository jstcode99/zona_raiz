import { mapListingRowToEntity } from "@/application/mappers/listing.mapper";
import { ListingEntity } from "@/domain/entities/listing.entity";
import { ProfileEntity } from "@/domain/entities/profile.entity";
import { ListingPort, ListingCountFilters, ListingSearchFilters } from "@/domain/ports/listing.port";
import { LandingCity, LandingStats } from "@/domain/types/landing.types";
import { SupabaseClient } from "@supabase/supabase-js";

interface ListingRow {
  created_at: string;
  status: string;
}

interface AgentProfile {
  id: string;
  full_name: string;
  avatar_url: string | null;
  phone: string | null;
}

interface ListingRowWithAgent extends ListingRow {
  real_estate_agent?: {
    profile?: AgentProfile;
  };
}

export class SupabaseListingAdapter implements ListingPort {
  constructor(private readonly supabase: SupabaseClient) {}

  async all(filters?: ListingSearchFilters): Promise<ListingEntity[]> {
    const sortField =
      filters?.sort_by?.toString().split("_")[0] || "created_at";
    const sortOrder = filters?.sort_by?.includes("desc") ? false : true;

    let query = this.supabase
      .from("listings")
      .select(
        `
      *,
      property:properties!inner(*, property_images(*))
    `,
      )
      .order(sortField === "price" ? "price" : "created_at", {
        ascending: sortOrder,
      });

    if (filters?.status) {
      query = query.eq("status", filters.status);
    }
    if (filters?.real_estate_id) {
      query = query.eq("properties.real_estate_id", filters.real_estate_id);
    }
    if (filters?.property_id) {
      query = query.eq("property_id", filters.property_id);
    }
    if (filters?.type) {
      query = query.eq("property.property_type", filters.type);
    }
    if (filters?.listing_type) {
      query = query.eq("listing_type", filters.listing_type);
    }
    if (filters?.price) {
      query = query.eq("price", filters.price);
    }
    if (filters?.status) {
      query = query.eq("status", filters.status);
    }

    if (filters?.street) {
      query = query.ilike("property.street", `%${filters.street}%`);
    }
    if (filters?.city) {
      query = query.ilike("property.city", `%${filters.city}%`);
    }
    if (filters?.state) {
      query = query.ilike("property.state", `%${filters.state}%`);
    }
    if (filters?.postal_code) {
      query = query.eq("property.postal_code", filters.postal_code);
    }
    if (filters?.country) {
      query = query.eq("property.country", filters.country);
    }
    if (filters?.neighborhood) {
      query = query.ilike("property.neighborhood", `%${filters.neighborhood}%`);
    }
    if (filters?.min_bedrooms) {
      query = query.gte("property.bedrooms", filters.min_bedrooms);
    }
    if (filters?.min_bathrooms) {
      query = query.gte("property.bathrooms", filters.min_bathrooms);
    }
    if (filters?.min_price) {
      query = query.gte("price", filters.min_price);
    }
    if (filters?.max_price) {
      query = query.lte("price", filters.max_price);
    }
    if (filters?.q) {
      query = query.or(
        `property.title.ilike.%${filters.q}%,property.description.ilike.%${filters.q}%`,
      );
    }
    if (filters?.search_query) {
      query = query.textSearch("property.search_vector", filters.search_query);
    }

    const { data, error } = await query;

    if (error) throw new Error(error.message);

    return (data || []).map(
      (item) => mapListingRowToEntity(item)!,
    ) as ListingEntity[];
  }

  async create(data: Partial<ListingEntity>): Promise<ListingEntity> {
    const { data: row, error } = await this.supabase
      .from("listings")
      .insert(data)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return mapListingRowToEntity(row);
  }

  async update(
    id: string,
    data: Partial<ListingEntity>,
  ): Promise<ListingEntity> {
    const { data: row, error } = await this.supabase
      .from("listings")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return mapListingRowToEntity(row);
  }

  async findById(id: string): Promise<ListingEntity | null> {
    const { data: row, error } = await this.supabase
      .from("listings")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !row) return null;
    return mapListingRowToEntity(row);
  }

  async findByIds(ids: string[]): Promise<ListingEntity[]> {
    if (ids.length === 0) return [];
    const { data: rows, error } = await this.supabase
      .from("listings")
      .select(
        `
        *,
        property:properties(*, property_images(*))
      `,
      )
      .in("id", ids);

    if (error) throw error;
    return (rows || []).map(mapListingRowToEntity);
  }

  async findActive(): Promise<ListingEntity[]> {
    const { data: row, error } = await this.supabase
      .from("listings")
      .select("*")
      .eq("status", "active");

    if (error) throw error;
    return row.map(mapListingRowToEntity);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from("listings")
      .delete()
      .eq("id", id);

    if (error) throw error;
  }

  async count(filters?: ListingCountFilters): Promise<number> {
    let query = this.supabase.from("listings").select(
      `
      *,
      property:properties!inner(*)
    `,
      { count: "exact", head: true },
    );

    if (filters?.real_estate_id) {
      query = query.eq("properties.real_estate_id", filters.real_estate_id);
    }
    if (filters?.property_id) {
      query = query.eq("property_id", filters.property_id);
    }
    if (filters?.listing_type) {
      query = query.eq("listing_type", filters.listing_type);
    }
    if (filters?.status) {
      query = query.eq("status", filters.status);
    }

    if (filters?.agent_id) {
      query = query.eq("agent_id", filters.agent_id);
    }
    if (filters?.start_date) {
      query = query.gte("created_at", filters.start_date);
    }
    if (filters?.end_date) {
      query = query.lte("created_at", filters.end_date);
    }

    const { count, error } = await query;

    if (error) throw new Error(error.message);

    return count || 0;
  }

  async countWithViews(filters?: ListingCountFilters): Promise<number> {
    let query = this.supabase
      .from("listings")
      .select(
        `
      *,
      property:properties!inner(*)
    `,
        { count: "exact", head: true },
      )
      .gt("views_count", 0);

    if (filters?.real_estate_id) {
      query = query.eq("properties.real_estate_id", filters.real_estate_id);
    }
    if (filters?.property_id) {
      query = query.eq("property_id", filters.property_id);
    }
    if (filters?.listing_type) {
      query = query.eq("listing_type", filters.listing_type);
    }
    if (filters?.status) {
      query = query.eq("status", filters.status);
    }

    if (filters?.start_date) {
      query = query.gte("created_at", filters.start_date);
    }
    if (filters?.end_date) {
      query = query.lte("created_at", filters.end_date);
    }

    const { count, error } = await query;

    if (error) throw new Error(error.message);

    return count || 0;
  }

  async findFeatured(
    limit: number = 10,
    realEstateId?: string,
  ): Promise<ListingEntity[]> {
    let query = this.supabase
      .from("listings")
      .select(
        `
        *,
        property:properties(*, property_images:property_images(*))
      `,
      )
      .eq("featured", true)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (realEstateId) {
      query = query.eq("properties.real_estate_id", realEstateId);
    }

    const { data, error } = await query;

    if (error) throw new Error(error.message);

    return (data || []).map(
      (item) => mapListingRowToEntity(item)!,
    ) as ListingEntity[];
  }

  async findBySlug(slug: string): Promise<ListingEntity | null> {
    const { data: row, error } = await this.supabase
      .from("listings")
      .select(
        `
        *,
        property:properties!inner(*, property_images(*))
      `,
      )
      .eq("properties.slug", slug)
      .eq("status", "active")
      .single();

    if (error || !row) return null;
    return mapListingRowToEntity(row) as ListingEntity;
  }

  async countByStatusAndMonth(
    year: number,
    filters?: Omit<ListingCountFilters, "start_date" | "end_date">,
  ): Promise<Record<string, Record<string, number>>> {
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;

    let query = this.supabase.from("listings").select(
      `
        status, created_at,
        property:properties!inner(*, property_images(*))
      `,
      { count: "exact", head: false },
    );

    if (filters?.real_estate_id) {
      query = query.eq("properties.real_estate_id", filters.real_estate_id);
    }

    query = query.gte("created_at", startDate).lte("created_at", endDate);

    const { data, error } = await query;

    if (error) throw new Error(error.message);

    const result: Record<string, Record<string, number>> = {};
    const months = [
      "Ene",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic",
    ];

    months.forEach((month) => {
      result[month] = { draft: 0, active: 0, paused: 0, archived: 0 };
    });

    (data || []).forEach((item: ListingRow) => {
      const date = new Date(item.created_at);
      const monthIndex = date.getMonth();
      const status = item.status as string;
      if (months[monthIndex] && result[months[monthIndex]]) {
        if (result[months[monthIndex]][status] !== undefined) {
          result[months[monthIndex]][status]++;
        }
      }
    });

    return result;
  }

  async findSimplePublished(limit: number = 10): Promise<ListingEntity[]> {
    let query = this.supabase
      .from("listings")
      .select(
        `
        *,
        property:properties!inner(*, property_images(*)),
        real_estate_agent:real_estate_agents!inner(
          profile:profiles!inner(id, full_name, avatar_url, phone)
        )
      `,
      )
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(limit);

    const { data, error } = await query;

    if (error) throw new Error(error.message);

    return (data || []).map((item: ListingRowWithAgent) => {
      const entity = mapListingRowToEntity(item);
      if (entity && item.real_estate_agent?.profile) {
        entity.agent = item.real_estate_agent.profile as ProfileEntity;
      }
      return entity;
    }) as ListingEntity[];
  }

  async findCitiesWithListings(): Promise<LandingCity[]> {
    const { data, error } = await this.supabase
      .from("properties")
      .select(`
        city,
        property_images (count)
      `)
      .not("city", "is", null)
      .eq("listing_status", "active");

    if (error) throw new Error(error.message);

    // Group by city and count listings
    const cityMap = new Map<string, number>();
    const cityImages = new Map<string, string | undefined>();

    for (const row of data || []) {
      const city = row.city;
      if (!cityMap.has(city)) {
        cityMap.set(city, 0);
      }
      cityMap.set(city, cityMap.get(city)! + 1);
    }

    // Get a sample image for each city
    const cities = Array.from(cityMap.keys());
    if (cities.length > 0) {
      const { data: images } = await this.supabase
        .from("property_images")
        .select("public_url, properties(city)")
        .in("properties.city", cities)
        .not("public_url", "is", null)
        .limit(cities.length);

      const typedImages = images as Array<{ public_url: string; properties: { city: string } }> | null;
      for (const img of typedImages || []) {
        if (img.properties?.city) {
          cityImages.set(img.properties.city, img.public_url);
        }
      }
    }

    return cities.map((city) => ({
      name: city,
      slug: city.toLowerCase().replace(/\s+/g, "-"),
      count: cityMap.get(city) || 0,
      image: cityImages.get(city),
    }));
  }

  async getStats(): Promise<LandingStats> {
    // Get total listings (active)
    const { count: totalListings } = await this.supabase
      .from("listings")
      .select("*", { count: "exact", head: true })
      .eq("status", "published");

    // Get total agents (distinct profiles in real_estate_agents)
    const { data: agents } = await this.supabase
      .from("real_estate_agents")
      .select("profile_id");

    const uniqueAgents = new Set(agents?.map((a) => a.profile_id) || []);

    // Get total cities with listings
    const { data: cities } = await this.supabase
      .from("properties")
      .select("city")
      .not("city", "is", null)
      .eq("listing_status", "active");

    const uniqueCities = new Set(cities?.map((p) => p.city) || []);

    return {
      totalListings: totalListings || 0,
      totalAgents: uniqueAgents.size,
      totalCities: uniqueCities.size,
    };
  }
}

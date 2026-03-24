// infrastructure/adapters/supabase/supabase-import-job.adapter.ts

import { SupabaseClient } from "@supabase/supabase-js";
import { ImportJobPort } from "@/domain/ports/import-job.port";
import {
  ImportJobEntity,
  ImportJobStatus,
  ImportTableName,
  ImportError,
  ImportResultSummary,
} from "@/domain/entities/import-job.entity";
import { SupabaseAdminClient } from "@/infrastructure/db/supabase.server-admin";

export class SupabaseImportJobAdapter implements ImportJobPort {
  constructor(private supabase: SupabaseClient) {}

  async createJob(params: {
    userId: string;
    realEstateId: string;
    tableName: ImportTableName;
    totalRows: number;
    batchSize: number;
  }): Promise<ImportJobEntity> {
    const { data, error } = await this.supabase
      .from("import_jobs")
      .insert({
        user_id: params.userId,
        real_estate_id: params.realEstateId,
        table_name: params.tableName,
        total_rows: params.totalRows,
        batch_size: params.batchSize,
        status: ImportJobStatus.PENDING,
      })
      .select()
      .single();

    if (error) throw new Error(`Error creating import job: ${error.message}`);

    return this.mapRowToEntity(data);
  }

  async getJobById(id: string): Promise<ImportJobEntity | null> {
    const { data, error } = await this.supabase
      .from("import_jobs")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw new Error(error.message);
    }

    return this.mapRowToEntity(data);
  }

  async getJobsByUserId(
    userId: string,
    limit?: number,
  ): Promise<ImportJobEntity[]> {
    let query = this.supabase
      .from("import_jobs")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) throw new Error(error.message);

    return (data || []).map((row) => this.mapRowToEntity(row));
  }

  async updateJobStatus(
    id: string,
    status: ImportJobStatus,
  ): Promise<ImportJobEntity> {
    const { data, error } = await this.supabase
      .from("import_jobs")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(`Error updating job status: ${error.message}`);

    return this.mapRowToEntity(data);
  }

  async updateJobProgress(
    id: string,
    processedRows: number,
    errors?: ImportError[],
  ): Promise<ImportJobEntity> {
    const { data, error } = await this.supabase
      .from("import_jobs")
      .update({
        processed_rows: processedRows,
        errors: errors || [],
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(`Error updating job progress: ${error.message}`);

    return this.mapRowToEntity(data);
  }

  async completeJob(
    id: string,
    summary: ImportResultSummary,
    errors?: ImportError[],
  ): Promise<ImportJobEntity> {
    const { data, error } = await this.supabase
      .from("import_jobs")
      .update({
        status: ImportJobStatus.COMPLETED,
        processed_rows: summary.totalRows,
        result_summary: summary,
        errors: errors || [],
        completed_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(`Error completing job: ${error.message}`);

    return this.mapRowToEntity(data);
  }

  async cancelJob(id: string): Promise<ImportJobEntity> {
    const { data, error } = await this.supabase
      .from("import_jobs")
      .update({
        status: ImportJobStatus.CANCELLED,
        completed_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(`Error cancelling job: ${error.message}`);

    return this.mapRowToEntity(data);
  }

  async addJobErrors(
    id: string,
    errors: ImportError[],
  ): Promise<ImportJobEntity> {
    const { data, error } = await this.supabase
      .from("import_jobs")
      .update({ errors })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(`Error adding job errors: ${error.message}`);

    return this.mapRowToEntity(data);
  }

  async bulkInsertProperties(
    rows: Record<string, unknown>[],
    realEstateId: string,
    userId: string,
  ): Promise<{ insertedIds: string[]; errors: ImportError[] }> {
    const insertedIds: string[] = [];
    const errors: ImportError[] = [];

    // Use admin client for bulk insert to bypass RLS
    const admin = await SupabaseAdminClient();

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      try {
        // Generate slug from title if not provided
        const title = String(row.title || "");
        const baseSlug =
          (row.slug as string) ||
          title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "") ||
          `property-${Date.now()}`;

        // Parse amenities if string
        let amenities: string[] = [];
        if (row.amenities && typeof row.amenities === "string") {
          amenities = (row.amenities as string)
            .split(",")
            .map((a) => a.trim())
            .filter(Boolean);
        }

        const insertData = {
          real_estate_id: realEstateId,
          title,
          slug: `${baseSlug}-${Date.now()}`,
          description: row.description || null,
          property_type: row.property_type || "house",
          street: row.street || null,
          city: String(row.city || ""),
          state: String(row.state || ""),
          country: String(row.country || "Colombia"),
          postal_code: row.postal_code || null,
          neighborhood: row.neighborhood || null,
          latitude: row.latitude ? Number(row.latitude) : null,
          longitude: row.longitude ? Number(row.longitude) : null,
          bedrooms: row.bedrooms ? parseInt(String(row.bedrooms)) : null,
          bathrooms: row.bathrooms ? parseInt(String(row.bathrooms)) : null,
          total_area: row.total_area ? Number(row.total_area) : null,
          built_area: row.built_area ? Number(row.built_area) : null,
          lot_area: row.lot_area ? Number(row.lot_area) : null,
          floors: row.floors ? parseInt(String(row.floors)) : null,
          year_built: row.year_built ? parseInt(String(row.year_built)) : null,
          parking_spots: row.parking_spots
            ? parseInt(String(row.parking_spots))
            : null,
          amenities,
          created_by: userId,
        };

        const { data: inserted, error: insertError } = await admin
          .from("properties")
          .insert(insertData)
          .select("id")
          .single();

        if (insertError) {
          errors.push({
            row: i + 1,
            column: "all",
            value: null,
            message: insertError.message,
          });
        } else if (inserted) {
          insertedIds.push(inserted.id);
        }
      } catch (err) {
        errors.push({
          row: i + 1,
          column: "all",
          value: null,
          message: err instanceof Error ? err.message : "Unknown error",
        });
      }
    }

    return { insertedIds, errors };
  }

  async bulkInsertListings(
    rows: Record<string, unknown>[],
    realEstateId: string,
    userId: string,
  ): Promise<{ insertedIds: string[]; errors: ImportError[] }> {
    const insertedIds: string[] = [];
    const errors: ImportError[] = [];

    // Get the agent_id for this user
    const { data: agentData } = await this.supabase
      .from("real_estate_agents")
      .select("id")
      .eq("profile_id", userId)
      .eq("real_estate_id", realEstateId)
      .single();

    if (!agentData) {
      return {
        insertedIds: [],
        errors: [
          {
            row: 0,
            column: "agent_id",
            value: null,
            message: "Agent not found",
          },
        ],
      };
    }

    const admin = await SupabaseAdminClient();

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      try {
        // If property_id is not provided, create a minimal property
        let propertyId = row.property_id as string;

        if (!propertyId) {
          // Create a placeholder property
          const { data: newProperty, error: propertyError } = await admin
            .from("properties")
            .insert({
              real_estate_id: realEstateId,
              title: `Imported Property ${Date.now()}-${i}`,
              slug: `imported-property-${Date.now()}-${i}`,
              property_type: "house",
              city: String(row.city || "Unknown"),
              state: String(row.state || "Unknown"),
              country: "Colombia",
              created_by: userId,
            })
            .select("id")
            .single();

          if (propertyError || !newProperty) {
            errors.push({
              row: i + 1,
              column: "property_id",
              value: null,
              message: propertyError?.message || "Failed to create property",
            });
            continue;
          }

          propertyId = newProperty.id;
        }

        // Parse keywords if string
        let keywords: string[] = [];
        if (row.keywords && typeof row.keywords === "string") {
          keywords = (row.keywords as string)
            .split(",")
            .map((k) => k.trim())
            .filter(Boolean);
        }

        const insertData = {
          property_id: propertyId,
          agent_id: agentData.id,
          listing_type: row.listing_type || "sale",
          price: Number(row.price) || 0,
          currency: String(row.currency || "COP"),
          price_negotiable: Boolean(row.price_negotiable),
          status: row.status || "draft",
          meta_title: row.meta_title || null,
          meta_description: row.meta_description || null,
          keywords,
          whatsapp_contact: String(row.whatsapp_contact || ""),
          expenses_amount: row.expenses_amount
            ? Number(row.expenses_amount)
            : null,
          expenses_included: Boolean(row.expenses_included),
          virtual_tour_url: row.virtual_tour_url || null,
          video_url: row.video_url || null,
          available_from: row.available_from || null,
          minimum_contract_duration: row.minimum_contract_duration
            ? parseInt(String(row.minimum_contract_duration))
            : null,
        };

        const { data: inserted, error: insertError } = await admin
          .from("listings")
          .insert(insertData)
          .select("id")
          .single();

        if (insertError) {
          errors.push({
            row: i + 1,
            column: "all",
            value: null,
            message: insertError.message,
          });
        } else if (inserted) {
          insertedIds.push(inserted.id);
        }
      } catch (err) {
        errors.push({
          row: i + 1,
          column: "all",
          value: null,
          message: err instanceof Error ? err.message : "Unknown error",
        });
      }
    }

    return { insertedIds, errors };
  }

  async bulkInsertRealEstates(
    rows: Record<string, unknown>[],
    userId: string,
  ): Promise<{ insertedIds: string[]; errors: ImportError[] }> {
    const insertedIds: string[] = [];
    const errors: ImportError[] = [];
    console.log(rows);
    const admin = await SupabaseAdminClient();

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      try {
        const insertData = {
          name: String(row.name || ""),
          description: row.description || null,
          whatsapp: String(row.whatsapp || ""),
          email: row.email || null,
          phone: row.phone || null,
          street: row.street || null,
          city: String(row.city || ""),
          state: String(row.state || ""),
          country: String(row.country || "Colombia"),
          postal_code: row.postal_code || null,
        };

        const { data: inserted, error: insertError } = await admin
          .from("real_estates")
          .insert(insertData)
          .select("id")
          .single();

        if (insertError) {
          errors.push({
            row: i + 1,
            column: "all",
            value: null,
            message: insertError.message,
          });
        } else if (inserted) {
          insertedIds.push(inserted.id);

          // Assign the creating user as coordinator
          await admin.from("real_estate_agents").insert({
            profile_id: userId,
            real_estate_id: inserted.id,
            role: "coordinator",
          });
        }
      } catch (err) {
        errors.push({
          row: i + 1,
          column: "all",
          value: null,
          message: err instanceof Error ? err.message : "Unknown error",
        });
      }
    }
    console.log(errors, "errors");

    return { insertedIds, errors };
  }

  async verifyRealEstateAccess(
    userId: string,
    realEstateId: string,
  ): Promise<boolean> {
    const { data, error } = await this.supabase
      .from("real_estate_agents")
      .select("id")
      .eq("profile_id", userId)
      .eq("real_estate_id", realEstateId)
      .single();

    if (error) return false;
    return !!data;
  }

  private mapRowToEntity(row: Record<string, unknown>): ImportJobEntity {
    return {
      id: row.id as string,
      userId: row.user_id as string,
      realEstateId: row.real_estate_id as string,
      tableName: row.table_name as ImportTableName,
      status: row.status as ImportJobStatus,
      totalRows: row.total_rows as number,
      processedRows: row.processed_rows as number,
      batchSize: row.batch_size as number,
      errors: (row.errors as ImportError[]) || [],
      resultSummary: row.result_summary as ImportResultSummary | null,
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string,
      completedAt: row.completed_at as string | null,
    };
  }
}

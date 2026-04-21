import { mapPropertyImageRowToEntity } from "@/application/mappers/property-image.mapper";
import { PropertyImageEntity } from "@/domain/entities/property-image.entity";
import { PropertyImagePort } from "@/domain/ports/property-image.port";
import { STORAGE_BUCKETS } from "@/infrastructure/config/constants";
import { SupabaseClient } from "@supabase/supabase-js";

export class SupabasePropertyImageAdapter implements PropertyImagePort {
    constructor(private supabase: SupabaseClient) { }

    async getById(id: string): Promise<PropertyImageEntity> {
        const { data, error } = await this.supabase
            .from("property_images")
            .select("*")
            .eq("id", id)
            .single()

        if (error) {
            throw new Error(error.message)
        }

        return mapPropertyImageRowToEntity(data)
    }

    async getByPropertyId(propertyId: string): Promise<PropertyImageEntity[]> {
        const { data, error } = await this.supabase
            .from("property_images")
            .select("*")
            .eq("property_id", propertyId)
            .order("display_order")

        if (error) {
            throw new Error(error.message)
        }

        return data.map(mapPropertyImageRowToEntity)
    }

    async create(propertyId: string, data: Partial<PropertyImageEntity>): Promise<PropertyImageEntity> {
        const { data: inserted, error: dbError } = await this.supabase
            .from("property_images")
            .insert({
                property_id: propertyId,
                filename: data.filename,
                file_size: data.file_size,
                mime_type: data.mime_type,
                width: data.width,
                height: data.height,
                display_order: data.display_order ?? 0,
                is_primary: data.is_primary ?? false,
                alt_text: data.alt_text,
                caption: data.caption,
                created_at: new Date().toISOString()
            })
            .select()
            .single()

        if (dbError) {
            throw new Error(dbError.message)
        }

        return mapPropertyImageRowToEntity(inserted)
    }

    async update(id: string, data: Partial<PropertyImageEntity>) {

        const { error: dbError } = await this.supabase
            .from("property_images")
            .update({
                ...data,
                updated_at: new Date().toISOString(),
            })
            .eq("id", id)

        if (dbError) {
            throw new Error(dbError.message)
        }
        const updated = await this.getById(id)

        return mapPropertyImageRowToEntity(updated) as PropertyImageEntity
    }

    async uploadFile(propertyId: string, name: string, image: File): Promise<string> {
        const ext = image.type.split("/")[1] || "webp"
        const path = `${propertyId}/${name}.${ext}`

        const { error } = await this.supabase.storage
            .from(STORAGE_BUCKETS.PROPERTIES)
            .upload(path, image, {
                upsert: true,
                contentType: image.type,
            })

        if (error) throw new Error(error.message)

        const { data } = this.supabase.storage
            .from(STORAGE_BUCKETS.PROPERTIES)
            .getPublicUrl(path)

        return `${data.publicUrl}?t=${Date.now()}`
    }

    async updatePath(propertyImageId: string, path: string): Promise<PropertyImageEntity> {

        const { data: updated, error: dbError } = await this.supabase
            .from("property_images")
            .update({
                public_url: path,
                updated_at: new Date().toISOString(),
            })
            .eq("id", propertyImageId)
            .select()
            .single()

        if (dbError) throw new Error(dbError.message)
        if (!updated) throw new Error("Failed to update property")

        return mapPropertyImageRowToEntity(updated) as PropertyImageEntity
    }


    async deleteFile(path: string): Promise<void> {
        const { error } = await this.supabase.storage
            .from(STORAGE_BUCKETS.PROPERTIES)
            .remove([path])

        if (error) throw new Error(error.message)
    }

    async existPath(public_url: string): Promise<boolean> {
        const {
            data: listData,
            error: listError
        } = await this.supabase.storage.from(STORAGE_BUCKETS.PROPERTIES)
            .list("", {
                search: public_url,
                limit: 1,
            })

        if (listError) {
            throw new Error(listError?.message || "Failed to check if path exists")
        }

        return !!listData && listData.length > 0
    }

    async delete(id: string): Promise<void> {
        const { error: dbError } = await this.supabase
            .from("property_images")
            .delete()
            .eq("id", id)

        if (dbError) throw new Error(dbError.message)
    }

    async updateDisplayOrder(updates: Array<{ id: string; display_order: number }>): Promise<void> {
        const now = new Date().toISOString();

        // Update all images in batch
        const promises = updates.map(({ id, display_order }) =>
            this.supabase
                .from("property_images")
                .update({ display_order, updated_at: now })
                .eq("id", id)
        );

        const results = await Promise.all(promises);

        // Check for errors
        const errors = results.filter((r) => r.error);
        if (errors.length > 0) {
            throw new Error(errors[0].error?.message || "Failed to update display order");
        }
    }

    async setPrimary(propertyId: string, imageId: string): Promise<void> {
        const now = new Date().toISOString();

        // First, unset all primaries for this property
        const { error: unsetError } = await this.supabase
            .from("property_images")
            .update({ is_primary: false, updated_at: now })
            .eq("property_id", propertyId)
            .eq("is_primary", true);

        if (unsetError) {
            throw new Error(unsetError.message);
        }

        // Then, set the new primary
        const { error: setError } = await this.supabase
            .from("property_images")
            .update({ is_primary: true, updated_at: now })
            .eq("id", imageId);

        if (setError) {
            throw new Error(setError.message);
        }
    }

    async deleteByPropertyId(propertyId: string): Promise<void> {
        // 1. Get all image records for this property
        const { data: images, error: fetchError } = await this.supabase
            .from("property_images")
            .select("id, public_url")
            .eq("property_id", propertyId);

        if (fetchError) {
            throw new Error(fetchError.message);
        }

        // 2. Delete files from storage in parallel
        const storagePaths = (images || [])
            .map((img: { public_url: string }) => {
                // Extract the storage path from public_url
                // public_url format: https://xxx.supabase.co/storage/v1/object/public/property-images/{propertyId}/{filename}
                const path = img.public_url.split("/property-images/")[1];
                return path;
            })
            .filter(Boolean);

        if (storagePaths.length > 0) {
            const { error: storageError } = await this.supabase.storage
                .from(STORAGE_BUCKETS.PROPERTIES)
                .remove(storagePaths);

            if (storageError) {
                throw new Error(storageError.message);
            }
        }

        // 3. Delete records from DB
        const { error: dbError } = await this.supabase
            .from("property_images")
            .delete()
            .eq("property_id", propertyId);

        if (dbError) {
            throw new Error(dbError.message);
        }
    }
}
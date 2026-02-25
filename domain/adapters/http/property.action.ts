"use server";

import { ActionResult } from "@/shared/hooks/use-server-mutation.hook";
import { revalidatePath } from "next/cache";
import { propertySchema } from "@/domain/entities/schemas/property.schema";
import {
  CreateProperty,
  DeleteProperty,
  UpdateProperty
} from "@/domain/use-cases/property.cases";
import { SupabasePropertyAdapter } from "../supabase/supabase-property.adapter";
import { withServerAction } from "@/shared/hooks/with-server-action";

export async function deletePropertyAction(id: string): Promise<ActionResult> {
  try {
    const useCase = new DeleteProperty(new SupabasePropertyAdapter());
    await useCase.execute(id);

    revalidatePath("/dashboard/properties");

    return { success: true };

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error al eliminar propiedad";
    return {
      success: false,
      error: { message },
    };
  }
}

export const createPropertyAction = withServerAction(
  async (realEstateId: string, formData: FormData) => {
    const rawData = Object.fromEntries(formData);

    const data = {
      title: rawData.title,
      slug: rawData.slug,
      description: rawData.description || null,
      property_type: rawData.property_type,
      address: rawData.address,
      street: rawData.street || null,
      city: rawData.city,
      state: rawData.state,
      postal_code: rawData.postal_code || null,
      country: rawData.country || 'Colombia',
      latitude: rawData.latitude ? parseFloat(rawData.latitude as string) : null,
      longitude: rawData.longitude ? parseFloat(rawData.longitude as string) : null,
      neighborhood: rawData.neighborhood || null,
      bedrooms: rawData.bedrooms ? parseInt(rawData.bedrooms as string) : null,
      bathrooms: rawData.bathrooms ? parseInt(rawData.bathrooms as string) : null,
      total_area: rawData.total_area ? parseFloat(rawData.total_area as string) : null,
      built_area: rawData.built_area ? parseFloat(rawData.built_area as string) : null,
      lot_area: rawData.lot_area ? parseFloat(rawData.lot_area as string) : null,
      floors: rawData.floors ? parseInt(rawData.floors as string) : null,
      year_built: rawData.year_built ? parseInt(rawData.year_built as string) : null,
      parking_spots: rawData.parking_spots ? parseInt(rawData.parking_spots as string) : null,
      amenities: rawData.amenities,
    };

    const validated = await propertySchema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
    });

    const useCase = new CreateProperty(new SupabasePropertyAdapter());
    await useCase.execute(realEstateId, validated);

    revalidatePath("/dashboard/properties");
    revalidatePath(`/dashboard/real-estate/${realEstateId}/properties`);
  }
)

export const updatePropertyAction = withServerAction(
  async (id: string, formData: FormData) => {
    const rawData = Object.fromEntries(formData);

    const data = {
      title: rawData.title,
      slug: rawData.slug,
      description: rawData.description || null,
      property_type: rawData.property_type,
      address: rawData.address,
      street: rawData.street || null,
      city: rawData.city,
      state: rawData.state,
      postal_code: rawData.postal_code || null,
      country: rawData.country || 'Colombia',
      latitude: rawData.latitude ? parseFloat(rawData.latitude as string) : null,
      longitude: rawData.longitude ? parseFloat(rawData.longitude as string) : null,
      neighborhood: rawData.neighborhood || null,
      bedrooms: rawData.bedrooms ? parseInt(rawData.bedrooms as string) : null,
      bathrooms: rawData.bathrooms ? parseInt(rawData.bathrooms as string) : null,
      total_area: rawData.total_area ? parseFloat(rawData.total_area as string) : null,
      built_area: rawData.built_area ? parseFloat(rawData.built_area as string) : null,
      lot_area: rawData.lot_area ? parseFloat(rawData.lot_area as string) : null,
      floors: rawData.floors ? parseInt(rawData.floors as string) : null,
      year_built: rawData.year_built ? parseInt(rawData.year_built as string) : null,
      parking_spots: rawData.parking_spots ? parseInt(rawData.parking_spots as string) : null,
      amenities: rawData.amenities,
    };

    const validated = await propertySchema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
    });

    const useCase = new UpdateProperty(new SupabasePropertyAdapter());
    const result = await useCase.execute(id, validated);

    revalidatePath("/dashboard/properties");
    revalidatePath(`/dashboard/properties/${id}`);
    revalidatePath(`/property/${result.slug}`);
  }
)

import { defaultPropertyValues } from "@/domain/entities/schemas/property";
import { PropertyForm } from "@/features/properties/property-form";

export default function Property() {
  return (
    <main className="min-h-screen bg-muted/40 py-10 px-4">
      <PropertyForm defaultValues={defaultPropertyValues}/>
    </main>
  );
}

import { defaultPropertyValues } from "@/domain/entities/schemas/property";
import { PropertyForm } from "@/features/properties/property-form";

export default function page() {
  return (
    <main className="py-10 px-4">
      <PropertyForm defaultValues={defaultPropertyValues}/>
    </main>
  );
}

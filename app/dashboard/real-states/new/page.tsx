import { defaultRealEstateValues } from "@/domain/entities/schemas/realEstateSchema";
import { RealEstateForm } from "@/features/real-states/real-estate-form";

export default function page() {
  return (
    <main className="min-h-screen bg-muted/40 py-10 px-4">
      <RealEstateForm defaultValues={defaultRealEstateValues}/>
    </main>
  );
}

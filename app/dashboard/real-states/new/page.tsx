import { defaultRealEstateValues } from "@/domain/entities/schemas/realEstate";
import { RealEstateForm } from "@/features/real-states/real-state-form";

export default function page() {
  return (
    <main className="min-h-screen bg-muted/40 py-10 px-4">
      <RealEstateForm defaultValues={defaultRealEstateValues}/>
    </main>
  );
}

import { RealEstateForm } from "@/features/real-states/real-state-form";

export default async function page() {

  return (
    <main className="flex items-center justify-between px-4 lg:px-6">
        <RealEstateForm />
    </main>
  );
}

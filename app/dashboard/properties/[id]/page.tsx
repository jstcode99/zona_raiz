import { PropertyForm } from "@/features/properties/property-form";

export default function Property() {
  return (
    <main className="min-h-screen bg-muted/40 py-10 px-4">
      <div className="max-w-4xl mx-auto flex flex-col gap-2 mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance">
          Nueva propiedad
        </h1>
        <p className="text-muted-foreground text-sm">
          Completa los campos para registrar una nueva propiedad en el sistema.
        </p>
      </div>
      <PropertyForm />
    </main>
  );
}

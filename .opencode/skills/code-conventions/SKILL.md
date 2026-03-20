---
name: code-conventions
description: >
  Convenciones de código reales del proyecto zona_raiz — TypeScript, Server Actions,
  React, formularios, hooks, cache, i18n. Usar SIEMPRE al escribir o revisar cualquier
  archivo TypeScript/React del proyecto, o cuando el usuario pregunte cómo implementar algo.
---

# Convenciones de Código — zona_raiz

## Server Actions

Todo action vive en `application/actions/<entidad>.actions.ts` con esta estructura exacta:

```typescript
"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { withServerAction } from "@/shared/hooks/with-server-action";
import { getLangServerSide } from "@/shared/utils/lang";
import { createRouter } from "@/i18n/router";
import { initI18n } from "@/i18n/server";
import { appModule } from "../modules/app.module";
import { CACHE_TAGS } from "@/infrastructure/config/constants";
import { myEntitySchema } from "@/application/validation/my-entity.schema";

export const createMyEntityAction = withServerAction(
  async (formData: FormData) => {
    const lang = await getLangServerSide();
    const cookieStore = await cookies();
    const routes = createRouter(lang);
    const i18n = await initI18n(lang);
    const t = i18n.getFixedT(lang);

    const { myEntityService, sessionService } = await appModule(lang, {
      cookies: cookieStore,
    });

    const raw = Object.fromEntries(formData);
    const input = await myEntitySchema.validate(raw, {
      abortEarly: false,
      stripUnknown: true,
    });

    const userId = await sessionService.getCurrentUserId();
    if (!userId) throw new Error(t("common:exceptions.unauthorized"));

    await myEntityService.create(input);

    revalidatePath(routes.dashboard());
    revalidateTag(CACHE_TAGS.MY_ENTITY.ALL, { expire: 0 });
    revalidateTag(CACHE_TAGS.MY_ENTITY.PRINCIPAL, { expire: 0 });
  },
);
```

**Reglas de actions:**
- Siempre `"use server"` al inicio del archivo
- Siempre `withServerAction` — nunca try/catch manual
- Siempre `{ abortEarly: false, stripUnknown: true }` en Yup
- Siempre invalidar cache con `revalidateTag` usando `CACHE_TAGS`
- `getLangServerSide()` y `cookies()` antes de `appModule()`
- `sessionService.getCurrentUserId()` para verificar auth cuando se necesite

## appModule — registro de servicios

`application/modules/app.module.ts` es el **único lugar** donde se instancian adapters y servicios.

```typescript
// Al agregar una entidad nueva, añadir en app.module.ts:
const myAdapter = new SupabaseMyEntityAdapter(supabase);
const myService = new MyEntityService(myAdapter, lang);

return {
  // ...resto de servicios,
  myService,
};
```

Nunca instancies adapters o servicios fuera de `appModule()`.

## Servicios de dominio con cache

```typescript
// domain/services/my-entity.service.ts
import { unstable_cache } from "next/cache";
import { CACHE_TAGS } from "@/infrastructure/config/constants";

export class MyEntityService {
  constructor(private port: MyEntityPort, private lang: Lang = "es") {}

  // Sin cache — para mutations y reads directos
  getById(id: string) {
    return this.port.getById(id);
  }

  // Con cache — para reads en Server Components
  getCachedById(id: string) {
    return unstable_cache(
      async () => this.port.getById(id),
      [`${CACHE_TAGS.MY_ENTITY.DETAIL}:${id}`],
      { revalidate: 300, tags: [CACHE_TAGS.MY_ENTITY.ALL, `${CACHE_TAGS.MY_ENTITY.DETAIL}:${id}`] }
    )();
  }
}
```

**Patrón:** método directo + método `getCached*` para cada read que se usa en Server Components.

## Formularios en Client Components

```typescript
"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useServerMutation } from "@/shared/hooks/use-server-mutation.hook";
import { Form } from "@/components/ui/form";
import { mySchema, MyInput } from "@/application/validation/my-entity.schema";
import { createMyEntityAction } from "@/application/actions/my-entity.actions";

export function MyEntityForm() {
  const { t } = useTranslation("my-namespace");

  const form = useForm<MyInput>({
    resolver: yupResolver(mySchema) as any,
    defaultValues: { name: "" },
    mode: "onBlur",
  });

  const { action, isPending } = useServerMutation({
    action: createMyEntityAction,
    setError: form.setError,
    onSuccess: () => toast.success(t("messages.created")),
    onError: (err) => toast.error(err.message),
  });

  return (
    <Form {...form}>
      <form action={action}>
        {/* campos */}
      </form>
    </Form>
  );
}
```

## Schemas Yup

```typescript
// application/validation/my-entity.schema.ts
import * as yup from "yup";
import { nameSchema } from "./base/name.schema";  // reusar base schemas

export const myEntitySchema = yup.object({
  name: nameSchema,
  description: yup.string().optional(),
});

export type MyEntityInput = yup.InferType<typeof myEntitySchema>;

export const defaultMyEntityValues: MyEntityInput = {
  name: "",
  description: "",
};
```

Schemas base disponibles en `application/validation/base/`: `name`, `email`, `phone`, `slug`, `price`, `description`, `title`, `id`, `image`, `file`, `password`, `confirm-password`, `address`, `latitude`, `bedrooms`, `bathrooms`, `total_area`, `built_area`, `lot_area`, `floors`, `year_built`, `parking_spots`, `amenities`, `status`, `whatsapp`, y más.

## TypeScript

- **Sin `any`** — excepto mappers donde el row de Supabase aún no tiene tipo
- **`interface` para props y contratos**, `type` para uniones
- **Sin `React.FC`** — funciones normales con destructuring
- **Path aliases `@/`** siempre — nunca `../../`
- Agrupar imports: librerías externas → `@/` internos → tipos

```typescript
// ✅ Props con interface
interface MyComponentProps {
  entity: MyEntity;
  onSave?: () => void;
}

export function MyComponent({ entity, onSave }: MyComponentProps) { ... }

// ❌ Evitar
const MyComponent: React.FC<Props> = ...
```

## React / Next.js

- **Server Components por defecto** — `"use client"` solo para: hooks, event handlers, useState, useEffect, APIs de browser
- Páginas en `app/[lang]/<ruta>/page.tsx`, componentes locales sin `_` prefix en `features/<dominio>/`
- Componentes UI base en `app/components/ui/` (shadcn)

```typescript
// ✅ Server Component (default) — lee datos directo
export default async function PropertiesPage() {
  const props = await propertyService.getCachedAll();
  return <PropertyList properties={props} />;
}

// ✅ Client Component — solo cuando hay interactividad
"use client";
export function PropertyForm() {
  const { action } = useServerMutation({ ... });
  return <form action={action}>...</form>;
}
```

## i18n

- Todo texto visible al usuario via `t()` de `react-i18next` por `useTranslation  (client) o `initI18n` (server)
- Namespace por dominio: `properties`, `listings`, `auth`, `common`, `dashboard`, etc.
- Rutas: `getLangServerSide()` en server, `useRoutes()` en client
- Traducciones en `locales/es/` y `locales/en/`

## Íconos e imágenes

- Íconos: `@iconify/react` → `<Icon icon="mdi:home" />` o `@tabler/icons-react`
- Imágenes: `next/image` con `fill` o dimensiones explícitas

## Estilos

- **Tailwind CSS** — clases utilitarias en JSX
- `cn()` de `@/app/lib/utils` para clases condicionales
- Variantes con `cva` (class-variance-authority) en componentes con múltiples estados
- `framer-motion` para animaciones

## Nombrado de archivos

| Tipo | Convención | Ejemplo |
|---|---|---|
| Entidad | `<nombre>.entity.ts` | `property.entity.ts` |
| Enum | `<nombre>.enums.ts` | `property.enums.ts` |
| Puerto | `<nombre>.port.ts` | `property.port.ts` |
| Servicio | `<nombre>.service.ts` | `property.service.ts` |
| Adapter | `supabase-<nombre>.adapter.ts` | `supabase-property.adapter.ts` |
| Action | `<nombre>.actions.ts` | `property.action.ts` |
| Schema | `<nombre>.schema.ts` o `.validation.ts` | `property.schema.ts` |
| Mapper | `<nombre>.mapper.ts` | `property.mapper.ts` |
| Componente | `kebab-case.tsx` | `property-form.tsx` |
| Hook | `use-<nombre>.ts` | `use-server-mutation.hook.ts` |

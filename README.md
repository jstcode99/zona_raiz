This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

``
/application
    /actions
        other.actions.ts
    /container
        other.container.ts
    /validations
        other.validations.ts // yup 
/domain
    /entities
        other.entity.ts
    /ports
        other.port.ts
    /use-cases
        other.cases.ts
/infrastructure
    /cache
    /db
        supabase.proxy.ts
        supabase.route.ts
        supabase.server.ts
    /adapters
        /supabase
            other.adapter.ts.ts
/features
    /properties
        other-form.tsx
``

# AI Project Rules

## Architecture

The project follows Domain Driven Design.

Structure:

domain/
- entities
- ports
- use-cases
- errors

application/
- actions
- containers
- validation

infrastructure/
- adapters
- auth
- db

features/
- UI components

services/
- cached queries

## Rules

1. Business logic must live in domain/use-cases
2. Server actions only orchestrate logic
3. Adapters implement domain ports
4. Components must not contain business logic
5. Use Zod for validation
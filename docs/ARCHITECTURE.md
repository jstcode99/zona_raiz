# Architecture

This project follows:

- DDD (Domain Driven Design)
- Hexagonal Architecture
- Clean separation between layers

Flow:

UI (features)
↓
Server Actions (application/actions)
↓
UseCases (domain/use-cases)
↓
Ports (domain/ports)
↓
Adapters (infrastructure)
↓
Database (Supabase)
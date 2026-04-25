-- Tipos enumerados
create type property_type as enum (
    'house',
    'apartment',
    'condo',
    'townhouse',
    'land',
    'commercial',
    'office',
    'warehouse',
    'state'
    'other'
);

create type listing_type as enum (
    'sale',
    'rent',
    'swap',
    'other'
);

create type listing_status as enum (
    'active',
    'pending',
    'sold',
    'rented',
    'inactive',
    'draft'
);

create type inquiry_status as enum (
    'new',
    'contacted',
    'qualified',
    'converted',
    'lost'
);

create type inquiry_source as enum (
    'web',
    'whatsapp',
    'phone',
    'email',
    'referral'
);

CREATE TABLE real_estates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) UNIQUE NOT NULL,
    logo_url TEXT,
    phone VARCHAR(20),
    whatsapp VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    description TEXT, -- SEO
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de perfiles de usuario
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(80) NOT NULL,
    last_name VARCHAR(80),
    phone VARCHAR(16),
    avatar_url TEXT,
    role VARCHAR(50) NOT NULL DEFAULT 'CLIENT',
    real_estate_id UUID REFERENCES real_estates(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para mejorar rendimiento
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_real_estate ON profiles(real_estate_id);

CREATE TYPE property_business_type AS ENUM ('sale', 'rent');
CREATE TYPE property_status AS ENUM ('draft', 'published', 'sold', 'rented');

CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- SEO CORE
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(250) UNIQUE NOT NULL,
    meta_title VARCHAR(255),
    meta_description VARCHAR(300),

    description TEXT NOT NULL, -- contenido largo para SEO

    business_type property_business_type NOT NULL,
    status property_status DEFAULT 'draft',

    price NUMERIC(12,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',

    -- ubicación SEO
    address TEXT,
    neighborhood VARCHAR(150),
    city VARCHAR(150) NOT NULL,
    state VARCHAR(150) NOT NULL,
    country VARCHAR(150) NOT NULL,

    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),
    google_maps_url TEXT,

    bedrooms INT,
    bathrooms INT,
    area_m2 INT,

    whatsapp_contact VARCHAR(20) NOT NULL,

    agent_id UUID NOT NULL,
    real_estate_id UUID NOT NULL,

    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    FOREIGN KEY (agent_id) REFERENCES auth.users(id),
    FOREIGN KEY (real_estate_id) REFERENCES real_estates(id)
);


CREATE TABLE favorites (
    user_id UUID NOT NULL,
    property_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),

    PRIMARY KEY (user_id, property_id),

    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

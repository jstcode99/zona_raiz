// ==========================================
// COOKIES
// ==========================================

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: 60 * 60 * 24 * 7, // 7 días
  path: "/",
} as const;

export const COOKIE_NAMES = {
  ROLE: "user_role",
  REAL_ESTATE: "real_estate_id",
  REAL_ESTATE_ROLE: "real_estate_role",
} as const;

// ==========================================
// CACHE TAGS
// ==========================================

export const CACHE_TAGS = {
  // Listing (Listados)
  LISTING: {
    PRINCIPAL: "listings",
    ALL: "listing:all",
    ACTIVE: "listing:active",
    FEATURED: "listing:featured",
    DETAIL: (id: string) => `listing:${id}`,
    SLUG: (slug: string) => `listing:slug:${slug}`,
    COUNT: "listing-count",
    SEARCH: "listing-search",
    SIMPLE_PUBLISHED: "listing:simple-published",
    CITIES: "listing:cities",
    STATS: "listing:stats",
  },

  // Property (Propiedades)
  PROPERTY: {
    PRINCIPAL: "properties",
    ALL: "property:all",
    DETAIL: (id: string) => `property:${id}`,
    SLUG: (slug: string) => `property:slug:${slug}`,
    COUNT: "property-count",
  },

  // User (Usuarios)
  USER: {
    PRINCIPAL: "users",
    DETAIL: (id: string) => `user:${id}`,
    EMAIL: (email: string) => `user:email:${email}`,
    LIST: "user:list",
  },

  // RealEstate (Inmobiliarias)
  REAL_ESTATE: {
    PRINCIPAL: "real-estates",
    ALL: "real-estate:all",
    DETAIL: (id: string) => `real-estate:${id}`,
    COUNT: "real-estate-count",
  },

  // Agent (Agentes)
  AGENT: {
    PRINCIPAL: "agents",
    BY_REAL_ESTATE: (realEstateId: string) =>
      `agent:real-estate:${realEstateId}`,
  },

  // Dashboard métricas
  DASHBOARD: {
    METRICS: "dashboard-metrics",
  },

  // Import Jobs
  IMPORT_JOB: {
    PRINCIPAL: "import-jobs",
    ALL: "import-job:all",
    DETAIL: (id: string) => `import-job:${id}`,
    BY_REAL_ESTATE: (realEstateId: string) =>
      `import-job:real-estate:${realEstateId}`,
    COUNT: "import-job-count",
  },

  // Enquiry (Solicitudes de contacto público)
  ENQUIRY: {
    PRINCIPAL: "enquiries",
    ALL: "enquiry:all",
    DETAIL: (id: string) => `enquiry:${id}`,
    BY_LISTING: (listingId: string) => `enquiry:listing:${listingId}`,
    BY_REAL_ESTATE: (realEstateId: string) =>
      `enquiry:real-estate:${realEstateId}`,
  },
} as const;

// ==========================================
// STORAGE BUCKETS
// ==========================================

export const STORAGE_BUCKETS = {
  AVATARS: "avatars",
  REAL_ESTATE_LOGOS: "real-estate-logos",
  PROPERTIES: "property-images",
} as const;

// ==========================================
// VALIDATION
// ==========================================

export const FILE_LIMITS = {
  AVATAR_MAX_SIZE: 5 * 1024 * 1024, // 5MB
  LOGO_MAX_SIZE: 2 * 1024 * 1024, // 2MB
  ALLOWED_IMAGE_TYPES: [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
  ] as const,
} as const;

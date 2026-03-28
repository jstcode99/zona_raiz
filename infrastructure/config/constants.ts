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
  //session
  SESSION: {
    SINGLE: "session",
    USER_ID: "session-user-id",
    CURRENT_USER: "session-current-user",
    REAL_ESTATES: "session-real-estates",
  },

  // Listing (Listados)
  LISTING: {
    PRINCIPAL: "listings",
    ALL: "listing-all",
    ACTIVE: "listing-active",
    FEATURED: "listing-featured",
    COUNT: "listing-count",
    SEARCH: "listing-search",
    SIMPLE_PUBLISHED: "listing-simple-published",
    CITIES: "listing-cities",
    STATS: "listing-stats",
    DETAIL: (id: string) => `listing:${id}`,
    SLUG: (slug: string) => `listing:slug:${slug}`,
    KEYS: {
      ALL: (filter?: object) =>
        filter ? `listing:all:${JSON.stringify(filter)}` : "listing:all",
      BY_ID: (id: string) => `listing:${id}`,
      ACTIVE: () => "listing:active",
      FEATURED: (limit?: number, realEstateId?: string) =>
        `listing:featured:${limit}:${realEstateId}`,
      BY_SLUG: (slug: string) => `listing:slug:${slug}`,
      COUNT: (filters?: object) =>
        filters ? `listing:count:${JSON.stringify(filters)}` : "listing:count",
      COUNT_WITH_VIEWS: (filters?: object) =>
        filters
          ? `listing:count:with-views:${JSON.stringify(filters)}`
          : "listing:count:with-views",
      COUNT_BY_REAL_ESTATE: (realEstateId: string) =>
        `listing-count:real-estate:${realEstateId}`,
      COUNT_DATE_RANGE: (start: string, end: string, filters?: object) =>
        `listing-count:date-range:${start}:${end}:${filters ? JSON.stringify(filters) : "default"}`,
      COUNT_REAL_ESTATE_DATE_RANGE: (
        realEstateId: string,
        start: string,
        end: string,
      ) =>
        `listing-count:real-estate:${realEstateId}:date-range:${start}:${end}`,
      COUNT_STATUS_MONTH: (year: number, realEstateId?: string) =>
        `listing-count:status-month:${year}:${realEstateId || "all"}`,
      SIMPLE_PUBLISHED: (limit: number) => `listing:simple-published:${limit}`,
      SIMPLE_PUBLISHED_BY_REAL_ESTATE: (realEstateId: number, limit: number) =>
        `listing:simple-published:${limit}:real-estate-id:${realEstateId}`,
      SEARCH: (key: string) => `listing-search:${key}`,
      SEARCH_WITH_COUNT: (key: string) => `listing-search:with-count:${key}`,
      CITIES: () => CACHE_TAGS.LISTING.CITIES,
      STATS: () => CACHE_TAGS.LISTING.STATS,
    },
  },

  // Property (Propiedades)
  PROPERTY: {
    PRINCIPAL: "properties",
    ALL: "property-all",
    COUNT: "property-count",
    DETAIL: (id: string) => `property:${id}`,
    SLUG: (slug: string) => `property:slug:${slug}`,
    BY_REAL_ESTATE: (realEstateId: string) =>
      `property:real-estate:${realEstateId}`,
    KEYS: {
      ALL: (filters?: object) =>
        filters ? `property:all:${JSON.stringify(filters)}` : "property:all",
      BY_ID: (id: string) => `property:${id}`,
      BY_SLUG: (slug: string) => `property:slug:${slug}`,
      BY_REAL_ESTATE: (realEstateId: string) =>
        `property:real-estate:${realEstateId}`,
      COUNT: (realEstateId?: string) =>
        realEstateId ? `property:count:${realEstateId}` : "property:count",
      COUNT_BY_TYPES: (realEstateId?: string) =>
        realEstateId
          ? `property:count:types:${realEstateId}`
          : "property:count:types",
      COUNT_BY_REAL_ESTATE: (realEstateId: string) =>
        `property:count:real-estate:${realEstateId}`,
      COUNT_DATE_RANGE: (start: string, end: string, realEstateId?: string) =>
        `property:count:date-range:${start}:${end}:${realEstateId || "all"}`,
      COUNT_REAL_ESTATE_DATE_RANGE: (
        realEstateId: string,
        start: string,
        end: string,
      ) =>
        `property:count:real-estate:${realEstateId}:date-range:${start}:${end}`,
    },
  },

  PROPERTY_IMAGE: {
    PRINCIPAL: "property-images",
    DETAIL: (id: string) => `property-image:${id}`,
    BY_PROPERTY: (propertyId: string) =>
      `property-image:property:${propertyId}`,
    KEYS: {
      BY_ID: (id: string) => `property-image:${id}`,
      BY_PROPERTY_ID: (propertyId: string) =>
        `property-image:property:${propertyId}`,
    },
  },

  // User (Usuarios)
  USER: {
    PRINCIPAL: "users",
    LIST: "user-list",
    COUNT: "user-count",
    DETAIL: (id: string) => `user:${id}`,
    EMAIL: (email: string) => `user:email:${email}`,
    ROLE: (id: string) => `user:role:${id}`,
    KEYS: {
      LIST: (filter?: object) =>
        filter ? `user:list:${JSON.stringify(filter)}` : "listing:list",
      USER_BY_EMAIL: (email: string) => `user:email:${email}`,
      SEARCH_BY_EMAIL: (email: string) => `profile:search:${email}`,
      ROLE_BY_USER: (userId: string) => `profile:role:${userId}`,
      BY_USER: (userId: string) => `profile:user:${userId}`,
      COUNT: (filters?: object) =>
        filters ? `profile:count:${JSON.stringify(filters)}` : "profile:count",
      COUNT_DATE_RANGE: (start: string, end: string) =>
        `profile:count:date-range:${start}:${end}`,
    },
  },

  // RealEstate (Inmobiliarias)
  REAL_ESTATE: {
    PRINCIPAL: "real-estates",
    ALL: "real-estate:all",
    COUNT: "real-estate-count",
    DETAIL: (id: string) => `real-estate:${id}`,
    KEYS: {
      ALL: (filters?: object) =>
        filters
          ? `real-estate:all:${JSON.stringify(filters)}`
          : "real-estate:all",
      BY_ID: (id: string) => `real-estate:${id}`,
      COUNT: (filters?: object) =>
        filters
          ? `real-estate:count:${JSON.stringify(filters)}`
          : "real-estate:count",
      COUNT_DATE_RANGE: (start: string, end: string) =>
        `real-estate:count:date-range:${start}:${end}`,
    },
  },

  // Agent (Agentes)
  AGENT: {
    PRINCIPAL: "agents",
    TOP: "agent-top",
    BY_REAL_ESTATE: (realEstateId: string) =>
      `agent:real-estate:${realEstateId}`,
    KEYS: {
      TOP: (top: number) => `agent:top:${top}`,
    },
  },

  // Dashboard métricas
  DASHBOARD: {
    METRICS: "dashboard-metrics",
  },

  // Import Jobs
  IMPORT_JOB: {
    PRINCIPAL: "import-jobs",
    ALL: "import-job:all",
    COUNT: "import-job-count",
    DETAIL: (id: string) => `import-job:${id}`,
    BY_REAL_ESTATE: (realEstateId: string) =>
      `import-job:real-estate:${realEstateId}`,
  },

  // Enquiry (Solicitudes de contacto público)
  ENQUIRY: {
    PRINCIPAL: "enquiries",
    ALL: "enquiry-all",
    COUNT: "enquiry-count",
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
// IMPORT CONFIG
// ==========================================

export const IMPORT_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_ROWS_PER_FILE: 10000,
  DEFAULT_BATCH_SIZE: 100,
  MIN_CONFIDENCE_THRESHOLD: 0.8, // 80%
  ALLOWED_FILE_TYPES: [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
    "application/vnd.ms-excel", // .xls
    "text/csv", // .csv
  ] as const,
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

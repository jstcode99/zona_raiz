export interface paths {
    "/account": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Account information */
        get: operations["accountShow"];
        /** Update account information */
        put: operations["accountUpdate"];
        post?: never;
        /** Delete Account */
        delete: operations["accountDestroy"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/account/avatar": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** Update avatar account */
        put: operations["accountUpdateAvatar"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/account/password": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** Update password account */
        put: operations["accountUpdatePassword"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/refresh": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Refresh token
         * @description Refresh token
         */
        post: operations["refreshToken"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/sign-in": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Sign in with email & password */
        post: operations["signIn"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/sign-out": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Sign Out */
        post: operations["signOut"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/social/{driver}": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                driver: string;
            };
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Sign in with social media */
        post: operations["signInSocial"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/favorite/{property}": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                property: string;
            };
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Sync a listing as favorite
         * @description Store a newly created resource in storage.
         */
        post: operations["favoriteSync"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/favorites": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Gest list paginated of favorites
         * @description Gest list paginated of favorites
         */
        get: operations["favoriteList"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/leads": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Gest list paginated of Leads
         * @description Gest list paginated of Leads
         */
        get: operations["leadList"];
        put?: never;
        /**
         * Store a new lead
         * @description Store a newly created resource in storage.
         */
        post: operations["leadStore"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/leads/{lead}": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                lead: string;
            };
            cookie?: never;
        };
        /** Get lead details */
        get: operations["leadShow"];
        /**
         * Update lead data
         * @description Update the specified resource in storage.
         */
        put: operations["leadUpdate"];
        post?: never;
        /**
         * Delete a lead
         * @description Remove the specified resource from storage.
         */
        delete: operations["leadDestroy"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/listing": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List all listing with filters, search and pagination
         * @description Display a listing of the resource.
         */
        get: operations["listingList"];
        put?: never;
        /**
         * Store a new Listing
         * @description Store a newly created resource in storage.
         */
        post: operations["listingStore"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/listing/{listing}": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                listing: string;
            };
            cookie?: never;
        };
        /** Get Listing details */
        get: operations["listingShow"];
        /**
         * Update Listing data
         * @description Update the specified resource in storage.
         */
        put: operations["ListingUpdate"];
        post?: never;
        /**
         * Delete a Listing
         * @description Remove the specified resource from storage.
         */
        delete: operations["ListingDestroy"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/locations": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Store a new location
         * @description Store a newly created resource in storage.
         */
        post: operations["locationStore"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/locations/{location}": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                location: string;
            };
            cookie?: never;
        };
        get?: never;
        /**
         * Update location data
         * @description Update the specified resource in storage.
         */
        put: operations["locationUpdate"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/properties": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List all properties with filters, search and pagination
         * @description Display a listing of the resource.
         */
        get: operations["propertyList"];
        put?: never;
        /**
         * Store a new property
         * @description Store a newly created resource in storage.
         */
        post: operations["propertyStore"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/properties/{property}": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                property: string;
            };
            cookie?: never;
        };
        /** Get property details */
        get: operations["propertyShow"];
        /**
         * Update property data
         * @description Update the specified resource in storage.
         */
        put: operations["propertyUpdate"];
        post?: never;
        /**
         * Delete a property
         * @description Remove the specified resource from storage.
         */
        delete: operations["propertyDestroy"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/properties/bulk/destroy": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /**
         * Delete multiple properties at once
         * @description Bulk delete properties.
         */
        delete: operations["propertyBulkDestroy"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/property-types": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List all properties types
         * @description Display a listing of the types.
         */
        get: operations["propertyTypeList"];
        put?: never;
        /**
         * Store a new property type
         * @description Store a newly created resource in storage.
         */
        post: operations["propertyTypeStore"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/property-types/{propertyType}": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                propertyType: string;
            };
            cookie?: never;
        };
        get?: never;
        /**
         * Update property data
         * @description Update the specified resource in storage.
         */
        put: operations["propertyTypeUpdate"];
        post?: never;
        /**
         * Delete a property type
         * @description Remove the specified resource from storage.
         */
        delete: operations["propertyTypeDestroy"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/real-estates": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Gest list paginated of real estates
         * @description Gest list paginated of real estates
         */
        get: operations["realEstateList"];
        put?: never;
        /**
         * Store a new real estate
         * @description Store a newly created resource in storage.
         */
        post: operations["realEstateStore"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/real-estates/{realEstate}": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                realEstate: string;
            };
            cookie?: never;
        };
        /** Get real estate details */
        get: operations["realEstateShow"];
        /**
         * Update real estate data
         * @description Update the specified resource in storage.
         */
        put: operations["realEstateUpdate"];
        post?: never;
        /**
         * Delete a real estate
         * @description Remove the specified resource from storage.
         */
        delete: operations["realEstateDestroy"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/recovery/resend-code": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Resend code */
        post: operations["resendResetCode"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/recovery/reset-password": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Reset password
         * @description Reset password
         */
        post: operations["resetPassword"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/recovery/send-code": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Recovery account with email code */
        post: operations["sendResetCode"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/recovery/verify-code": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Recovery account, verify code */
        post: operations["verifyResetCode"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/register/send-verification-email": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Verification of sign up with email
         * @description Send verification email
         */
        post: operations["sendVerificationEmail"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/register/sign-up": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Sign up with email & password */
        post: operations["signUp"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/register/verify-account": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Verification account
         * @description Verify account
         */
        post: operations["verifyAccount"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        AccountResource: {
            /** @example Street five */
            address: string;
            /**
             * Format: uri
             * @example https://example.com/banner.jpg
             */
            avatar: string;
            /** @example 121218511 */
            dni: string;
            /** @example joe@mail.com */
            email: string;
            /** @example 1999-04-09 03:14:29 */
            email_verified_at: string;
            /** @example 1 */
            id: number;
            /** @example Doe */
            last_name: string;
            /** @example Joe */
            name: string;
            /** @example true */
            polices: boolean;
            /** @example ACTIVE */
            status: string;
        } & {
            [key: string]: unknown;
        };
        /** @description Agent Resource */
        AgentResource: {
            /** @example joe@example.com */
            email: string;
            /** @example 1 */
            id: number;
            /** @example Joe Doe */
            name: string;
            /** @example +52 55 1234 5678 */
            phone: string;
        } & {
            [key: string]: unknown;
        };
        CommonPagination: {
            links: components["schemas"]["PaginationLinks"];
            meta: components["schemas"]["PaginationMeta"];
        } & {
            [key: string]: unknown;
        };
        /** @description Email User Resource */
        EmailUserResource: {
            /** @example joe@mail.com */
            email: string;
        } & {
            [key: string]: unknown;
        };
        ForbiddenErrorSchema: {
            /** @example Forbidden. */
            message: string;
            /** @example false */
            success: boolean;
        } & {
            [key: string]: unknown;
        };
        /** @description JWT Token Resources */
        JwtTokenResource: {
            /** @example 82|keHjILoSegGteBHO2UVXSMz6gN5mkeURtRmFtZHz569735dd */
            access_token: string;
            /** @example 123|keHjILoSegGteBHO2UVXSMz6gN5mkeURtRmFtZHz569735dd */
            refresh_token: string;
        } & {
            [key: string]: unknown;
        };
        /** @description Real Estate Resource */
        LeadResource: {
            agent: components["schemas"]["AgentResource"];
            /**
             * Format: date-time
             * @example 2023-01-01T00:00:00Z
             */
            created_at: Date;
            /** @example info@zona-raiz.com */
            email: string;
            /** @example 1 */
            id: number;
            /** @example Zona Raiz */
            name: string;
            /** @example +52 55 1234 5678 */
            phone: string;
            property: components["schemas"]["PropertyResource"];
            /** @example ACTIVE */
            status: string;
        } & {
            [key: string]: unknown;
        };
        /** @description Real Estate Resource */
        ListingResource: {
            /** @example 42 */
            followers_count: number;
            /** @example 1 */
            id: number;
            /** @example SALE */
            operation_type: string;
            property: components["schemas"]["PropertyResource"];
            /** @example true */
            published: boolean;
            /**
             * Format: date-time
             * @example 2023-01-01T00:00:00Z
             */
            published_at: Date;
        } & {
            [key: string]: unknown;
        };
        /** @description Real Estate Resource */
        LocationResource: {
            /** @example Av. Reforma 123 */
            address: string;
            /** @example Mexico City */
            city: string;
            /** @example Mexico */
            country: string;
            /** @example 19.4326 */
            latitude: number;
            /** @example -99.1332 */
            longitude: number;
            /** @example Condesa */
            neighborhood: string;
        } & {
            [key: string]: unknown;
        };
        NotFoundErrorSchema: {
            /** @example Not found. */
            message: string;
            /** @example false */
            success: boolean;
        } & {
            [key: string]: unknown;
        };
        NotFoundUserOrEmailPasswordWrong: {
            errors?: {
                [key: string]: string[];
            };
            /** @example Password o email given are invalid. */
            message: string;
            /** @example false */
            success: boolean;
        } & {
            [key: string]: unknown;
        };
        /** @description Enlaces de navegación para paginación */
        PaginationLinks: {
            /**
             * Format: uri
             * @example https://api.example.com/resource?page=1
             */
            first?: string;
            /**
             * Format: uri
             * @example https://api.example.com/resource?page=10
             */
            last?: string;
            /**
             * Format: uri
             * @example https://api.example.com/resource?page=2
             */
            next?: string | null;
            /**
             * Format: uri
             * @example null
             */
            prev?: string | null;
        } & {
            [key: string]: unknown;
        };
        PaginationMeta: {
            /** @example 1 */
            current_page?: number;
            /** @example 1 */
            from?: number;
            /** @example 10 */
            last_page?: number;
            /** @example 15 */
            per_page?: number;
            /** @example 15 */
            to?: number;
            /** @example 150 */
            total?: number;
        } & {
            [key: string]: unknown;
        };
        /** @description Property Resource */
        PropertyResource: {
            agent: components["schemas"]["AgentResource"];
            /**
             * Format: float
             * @example 250.5
             */
            area_m2: number;
            /** @example 3 */
            bathrooms: number;
            /** @example 4 */
            bedrooms: number;
            /** @example A beautiful family house located in the suburbs. */
            description: string;
            /** @example 1 */
            id: number;
            location?: components["schemas"]["LocationResource"];
            /** @example 2 */
            parking_spaces: number;
            /**
             * Format: float
             * @example 350000
             */
            price: number;
            property_type: components["schemas"]["PropertyTypeResource"];
            /** @example available */
            status: string;
            /** @example Beautiful Family House */
            title: string;
        } & {
            [key: string]: unknown;
        };
        /** @description Property type Resource */
        PropertyTypeResource: {
            /** @example 1 */
            id?: number;
            /** @example Beautiful Family House */
            name?: string;
        } & {
            [key: string]: unknown;
        };
        /** @description Real Estate Resource */
        RealEstateResource: {
            /** @example 10 */
            agents_count: number;
            /**
             * Format: date-time
             * @example 2023-01-01T00:00:00Z
             */
            created_at: Date;
            /** @example info@zona-raiz.com */
            email: string;
            /** @example 1 */
            id: number;
            /** @example Zona Raiz */
            name: string;
            /** @example +52 55 1234 5678 */
            phone: string;
            /** @example 25 */
            properties_count: number;
            /** @example ACTIVE */
            status: string;
        } & {
            [key: string]: unknown;
        };
        UnauthorizedErrorSchema: {
            /** @example Unauthenticated. */
            message: string;
            /** @example false */
            success: boolean;
        } & {
            [key: string]: unknown;
        };
        ValidationErrorSchema: {
            errors: {
                [key: string]: string[];
            };
            /** @example The given data was invalid. */
            message: string;
            /** @example false */
            success: boolean;
        } & {
            [key: string]: unknown;
        };
    };
    responses: never;
    parameters: {
        /** @description Filter by number of bathrooms */
        bathrooms: number;
        /** @description Filter by number of bedrooms */
        bedrooms: number;
        /** @description Filtrar desde esta fecha (YYYY-MM-DD) */
        date_from: string;
        /** @description Filtrar hasta esta fecha (YYYY-MM-DD) */
        date_to: string;
        /** @description Filter by maximum area */
        max_area: number;
        /** @description Filter by maximum price */
        max_price: number;
        /** @description Filter by minimum area */
        min_area: number;
        /** @description Filter by minimum price */
        min_price: number;
        /** @description Número de página para la paginación */
        page: number;
        /** @description Cantidad de elementos por página */
        per_page: number;
        /** @description Filter by property_type */
        property_type: string;
        /** @description Filter by role (e.g., admin, user, etc.) */
        role: string;
        /** @description Buscar texto libre en el contenido */
        search: string;
        /** @description Campo de ordenamiento. Usa '-' para orden descendente (ej: -created_at) */
        sort: string;
        /** @description Filter by status_id (e.g., active, etc. */
        status_id: string;
    };
    requestBodies: {
        /** @description Payload to update avatar account */
        AccountAvatarRequest: {
            content: {
                "multipart/form-data": {
                    /**
                     * Format: binary
                     * @description Archivo del avatar
                     */
                    avatar: Blob;
                } & {
                    [key: string]: unknown;
                };
            };
        };
        /** @description Payload to update password account */
        AccountPasswordRequest: {
            content: {
                "multipart/form-data": {
                    /**
                     * @description Old password
                     * @example 23d!@SD@Dad1313a
                     */
                    old_password: string;
                    /**
                     * @description Password
                     * @example !@SD@Dad1313a
                     */
                    password: string;
                    /**
                     * @description Password confirmation
                     * @example !@SD@Dad1313a
                     */
                    password_confirmation: string;
                } & {
                    [key: string]: unknown;
                };
            };
        };
        /** @description Payload to updated account information */
        AccountRequest: {
            content: {
                "multipart/form-data": {
                    /**
                     * @description Address
                     * @example Street ive
                     */
                    address: string;
                    /**
                     * @description Document of user
                     * @example Doe
                     */
                    dni: string;
                    /**
                     * @description Last name of user
                     * @example Doe
                     */
                    last_name: string;
                    /**
                     * @description Name of user
                     * @example Joe
                     */
                    name: string;
                    /**
                     * @description Phone
                     * @example 3154621821
                     */
                    phone: string;
                    /**
                     * @description Type of document of user
                     * @example CC
                     */
                    type_dni?: string;
                } & {
                    [key: string]: unknown;
                };
            };
        };
        /** @description Payload to Bulk Delete */
        BulkDeleteRequest: {
            content: {
                "application/json": {
                    /** @description Array of ids */
                    ids: number[];
                } & {
                    [key: string]: unknown;
                };
            };
        };
        /** @description Payload to refresh token with refresh token session */
        RefreshTokenRequest: {
            content: {
                "multipart/form-data": {
                    /**
                     * @description Refresh Token provided in sign in
                     * @example 134531123SA!@#ASDDfsa@GDSS
                     */
                    refresh_token: string;
                } & {
                    [key: string]: unknown;
                };
            };
        };
        /** @description Payload to re send recovery code at email account */
        ResendResetPasswordRequest: {
            content: {
                "multipart/form-data": {
                    /**
                     * @description Email of user
                     * @example joe_doe@mail.com
                     */
                    email: string;
                } & {
                    [key: string]: unknown;
                };
            };
        };
        /** @description Payload to send recovery code at email account */
        ResetPasswordAttemptRequest: {
            content: {
                "multipart/form-data": {
                    /**
                     * @description Email of user
                     * @example joe_doe@mail.com
                     */
                    email: string;
                } & {
                    [key: string]: unknown;
                };
            };
        };
        /** @description Payload to send recovery code at email account */
        ResetPasswordRequest: {
            content: {
                "multipart/form-data": {
                    /**
                     * @description Code of user
                     * @example 125464
                     */
                    code: string;
                    /**
                     * @description Email of user
                     * @example joe_doe@mail.com
                     */
                    email: string;
                    /**
                     * @description Password of user
                     * @example !@#ASDxDas123
                     */
                    password: string;
                    /**
                     * @description Password of user
                     * @example !@#ASDxDas123
                     */
                    password_confirmation?: string;
                } & {
                    [key: string]: unknown;
                };
            };
        };
        /** @description Payload to verify sign up */
        SendEmailVerifyRequest: {
            content: {
                "multipart/form-data": {
                    /**
                     * @description Email of user
                     * @example joe_doe@mail.com
                     */
                    email: string;
                } & {
                    [key: string]: unknown;
                };
            };
        };
        /** @description Payload to Sing In with email & password */
        SignInRequest: {
            content: {
                "multipart/form-data": {
                    /**
                     * @description Email of user
                     * @example joe_doe@mail.com
                     */
                    email: string;
                    /**
                     * @description Password of user
                     * @example !@#ASDxDas123
                     */
                    password: string;
                } & {
                    [key: string]: unknown;
                };
            };
        };
        /** @description Payload to Sing In with social media. */
        SignInSocialRequest: {
            content: {
                "multipart/form-data": {
                    /**
                     * @description Token provided by social media
                     * @example 134531123SA!@#ASDDfsa@GDSS
                     */
                    token?: string;
                } & {
                    [key: string]: unknown;
                };
            };
        };
        /** @description Payload to sign up with basic data */
        SignUpRequest: {
            content: {
                "multipart/form-data": {
                    /**
                     * @description Address
                     * @example Street five
                     */
                    address: string;
                    /**
                     * @description Email of user
                     * @example joe_doe@mail.com
                     */
                    email: string;
                    /**
                     * @description Last name
                     * @example Doe
                     */
                    last_name: string;
                    /**
                     * @description Name
                     * @example Joe
                     */
                    name: string;
                    /**
                     * @description Password
                     * @example !@SD@Dad1313a
                     */
                    password: string;
                    /**
                     * @description Password confirmation
                     * @example !@SD@Dad1313a
                     */
                    password_confirmation?: string;
                    /**
                     * @description Phone
                     * @example 3131521851
                     */
                    phone: string;
                    /**
                     * @description Politics and Conditions
                     * @example true
                     */
                    polices: boolean;
                } & {
                    [key: string]: unknown;
                };
            };
        };
        /** @description Payload to create a lead */
        StoreLeadRequest: {
            content: {
                "multipart/form-data": {
                    /** @description Email of the lead */
                    email: string;
                    /** @description Name of the lead */
                    name: string;
                    /** @description Phone of the lead */
                    phone?: string;
                    /** @description Status of the lead (NEW, CONTACTED, QUALIFIED, CLOSED,) */
                    status_id: string;
                } & {
                    [key: string]: unknown;
                };
            };
        };
        /** @description Payload to create a listing */
        StoreListingRequest: {
            content: {
                "multipart/form-data": {
                    /** @description Type of operation (BUY, RENT, SALE) */
                    operation_type: string;
                    /** @description ID of the property */
                    property_id: number;
                    /** @description Indicates if the listing is published */
                    published: boolean;
                } & {
                    [key: string]: unknown;
                };
            };
        };
        /** @description Payload to create a location */
        StoreLocationRequest: {
            content: {
                "multipart/form-data": {
                    /** @example Av. Reforma 123 */
                    address: string;
                    /** @example Mexico City */
                    city: string;
                    /** @example Mexico */
                    country: string;
                    /** @example 19.4326 */
                    latitude: number;
                    /** @example -99.1332 */
                    longitude: number;
                    /** @example Condesa */
                    neighborhood: string;
                } & {
                    [key: string]: unknown;
                };
            };
        };
        /** @description Payload to create a property */
        StorePropertyRequest: {
            content: {
                "multipart/form-data": {
                    /**
                     * Format: float
                     * @description Area in square meters
                     */
                    area_m2: number;
                    /** @description Number of bathrooms */
                    bathrooms: number;
                    /** @description Number of bedrooms */
                    bedrooms: number;
                    /** @description Description of the property */
                    description: string;
                    /** @description ID of the location */
                    location_id: number;
                    /** @description Number of parking spaces */
                    parking_spaces: number;
                    /**
                     * Format: float
                     * @description Price of the property
                     */
                    price: number;
                    /** @description ID of the property type */
                    property_type_id: number;
                    /** @description Status of the property (DRAFT, AVAILABLE) */
                    status_id: string;
                    /** @description Title of the property */
                    title: string;
                } & {
                    [key: string]: unknown;
                };
            };
        };
        /** @description Payload to create a real estate */
        StoreRealEstateRequest: {
            content: {
                "multipart/form-data": {
                    /** @description Email of the real estate */
                    email: string;
                    /** @description Name of the real estate */
                    name: string;
                    /** @description Phone of the real estate */
                    phone?: string;
                    /** @description Status of the real estate (ACTIVE, INACTIVE) */
                    status_id: string;
                } & {
                    [key: string]: unknown;
                };
            };
        };
        /** @description Payload to update a lead */
        UpdateLeadRequest: {
            content: {
                "multipart/form-data": {
                    /** @description Email of the lead */
                    email?: string;
                    /** @description Name of the lead */
                    name?: string;
                    /** @description Phone of the lead */
                    phone?: string;
                    /** @description Status of the lead (NEW, CONTACTED, QUALIFIED, CLOSED,) */
                    status_id?: string;
                } & {
                    [key: string]: unknown;
                };
            };
        };
        /** @description Payload to update a listing */
        UpdateListingRequest: {
            content: {
                "multipart/form-data": {
                    /** @description Indicates if the listing is published */
                    published?: boolean;
                } & {
                    [key: string]: unknown;
                };
            };
        };
        /** @description Payload to update a location */
        UpdateLocationRequest: {
            content: {
                "multipart/form-data": {
                    /** @example Av. Reforma 123 */
                    address?: string;
                    /** @example Mexico City */
                    city?: string;
                    /** @example Mexico */
                    country?: string;
                    /** @example 19.4326 */
                    latitude?: number;
                    /** @example -99.1332 */
                    longitude?: number;
                    /** @example Condesa */
                    neighborhood?: string;
                } & {
                    [key: string]: unknown;
                };
            };
        };
        /** @description Payload to update a property */
        UpdatePropertyRequest: {
            content: {
                "multipart/form-data": {
                    /**
                     * Format: float
                     * @description Area in square meters
                     */
                    area_m2?: number;
                    /** @description Number of bathrooms */
                    bathrooms?: number;
                    /** @description Number of bedrooms */
                    bedrooms?: number;
                    /** @description Description of the property */
                    description?: string;
                    /** @description Whether the property is featured */
                    is_featured?: boolean;
                    /** @description ID of the location */
                    location_id?: number;
                    /** @description Number of parking spaces */
                    parking_spaces?: number;
                    /**
                     * Format: float
                     * @description Price of the property
                     */
                    price?: number;
                    /** @description ID of the property type */
                    property_type_id?: number;
                    /** @description Status of the property (DRAFT, AVAILABLE, RESERVED, SOLD, RENTED) */
                    status_id?: string;
                    /** @description Title of the property */
                    title?: string;
                } & {
                    [key: string]: unknown;
                };
            };
        };
        /** @description Payload to update a real estate */
        UpdateRealEstateRequest: {
            content: {
                "multipart/form-data": {
                    /** @description Email of the real estate */
                    email?: string;
                    /** @description Name of the real estate */
                    name?: string;
                    /** @description Phone of the real estate */
                    phone?: string;
                    /** @description Status of the real estate (ACTIVE, INACTIVE) */
                    status_id?: string;
                } & {
                    [key: string]: unknown;
                };
            };
        };
        /** @description Payload to verify account */
        VerifyAccountRequest: {
            content: {
                "multipart/form-data": {
                    /**
                     * @description code
                     * @example 1323
                     */
                    code: number;
                } & {
                    [key: string]: unknown;
                };
            };
        };
        /** @description Payload to verify code for password reset */
        VerifyResetCodeRequest: {
            content: {
                "multipart/form-data": {
                    /**
                     * @description Refresh Token provided in sign in
                     * @example 13453
                     */
                    code: string;
                } & {
                    [key: string]: unknown;
                };
            };
        };
    };
    headers: never;
    pathItems: never;
}
export type AccountResource = components['schemas']['AccountResource'];
export type AgentResource = components['schemas']['AgentResource'];
export type CommonPagination = components['schemas']['CommonPagination'];
export type EmailUserResource = components['schemas']['EmailUserResource'];
export type ForbiddenErrorSchema = components['schemas']['ForbiddenErrorSchema'];
export type JwtTokenResource = components['schemas']['JwtTokenResource'];
export type LeadResource = components['schemas']['LeadResource'];
export type ListingResource = components['schemas']['ListingResource'];
export type LocationResource = components['schemas']['LocationResource'];
export type NotFoundErrorSchema = components['schemas']['NotFoundErrorSchema'];
export type NotFoundUserOrEmailPasswordWrong = components['schemas']['NotFoundUserOrEmailPasswordWrong'];
export type PaginationLinks = components['schemas']['PaginationLinks'];
export type PaginationMeta = components['schemas']['PaginationMeta'];
export type PropertyResource = components['schemas']['PropertyResource'];
export type PropertyTypeResource = components['schemas']['PropertyTypeResource'];
export type RealEstateResource = components['schemas']['RealEstateResource'];
export type UnauthorizedErrorSchema = components['schemas']['UnauthorizedErrorSchema'];
export type ValidationErrorSchema = components['schemas']['ValidationErrorSchema'];
export type ParameterBathrooms = components['parameters']['bathrooms'];
export type ParameterBedrooms = components['parameters']['bedrooms'];
export type ParameterDateFrom = components['parameters']['date_from'];
export type ParameterDateTo = components['parameters']['date_to'];
export type ParameterMaxArea = components['parameters']['max_area'];
export type ParameterMaxPrice = components['parameters']['max_price'];
export type ParameterMinArea = components['parameters']['min_area'];
export type ParameterMinPrice = components['parameters']['min_price'];
export type ParameterPage = components['parameters']['page'];
export type ParameterPerPage = components['parameters']['per_page'];
export type ParameterPropertyType = components['parameters']['property_type'];
export type ParameterRole = components['parameters']['role'];
export type ParameterSearch = components['parameters']['search'];
export type ParameterSort = components['parameters']['sort'];
export type ParameterStatusId = components['parameters']['status_id'];
export type RequestBodyAccountAvatarRequest = components['requestBodies']['AccountAvatarRequest'];
export type RequestBodyAccountPasswordRequest = components['requestBodies']['AccountPasswordRequest'];
export type RequestBodyAccountRequest = components['requestBodies']['AccountRequest'];
export type RequestBodyBulkDeleteRequest = components['requestBodies']['BulkDeleteRequest'];
export type RequestBodyRefreshTokenRequest = components['requestBodies']['RefreshTokenRequest'];
export type RequestBodyResendResetPasswordRequest = components['requestBodies']['ResendResetPasswordRequest'];
export type RequestBodyResetPasswordAttemptRequest = components['requestBodies']['ResetPasswordAttemptRequest'];
export type RequestBodyResetPasswordRequest = components['requestBodies']['ResetPasswordRequest'];
export type RequestBodySendEmailVerifyRequest = components['requestBodies']['SendEmailVerifyRequest'];
export type RequestBodySignInRequest = components['requestBodies']['SignInRequest'];
export type RequestBodySignInSocialRequest = components['requestBodies']['SignInSocialRequest'];
export type RequestBodySignUpRequest = components['requestBodies']['SignUpRequest'];
export type RequestBodyStoreLeadRequest = components['requestBodies']['StoreLeadRequest'];
export type RequestBodyStoreListingRequest = components['requestBodies']['StoreListingRequest'];
export type RequestBodyStoreLocationRequest = components['requestBodies']['StoreLocationRequest'];
export type RequestBodyStorePropertyRequest = components['requestBodies']['StorePropertyRequest'];
export type RequestBodyStoreRealEstateRequest = components['requestBodies']['StoreRealEstateRequest'];
export type RequestBodyUpdateLeadRequest = components['requestBodies']['UpdateLeadRequest'];
export type RequestBodyUpdateListingRequest = components['requestBodies']['UpdateListingRequest'];
export type RequestBodyUpdateLocationRequest = components['requestBodies']['UpdateLocationRequest'];
export type RequestBodyUpdatePropertyRequest = components['requestBodies']['UpdatePropertyRequest'];
export type RequestBodyUpdateRealEstateRequest = components['requestBodies']['UpdateRealEstateRequest'];
export type RequestBodyVerifyAccountRequest = components['requestBodies']['VerifyAccountRequest'];
export type RequestBodyVerifyResetCodeRequest = components['requestBodies']['VerifyResetCodeRequest'];
export type $defs = Record<string, never>;
export interface operations {
    accountShow: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Show */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AccountResource"];
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ForbiddenErrorSchema"];
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    accountUpdate: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: components["requestBodies"]["AccountRequest"];
        responses: {
            /** @description Updated */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AccountResource"];
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ForbiddenErrorSchema"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ValidationErrorSchema"];
                };
            };
        };
    };
    accountDestroy: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Deleted */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotFoundErrorSchema"];
                };
            };
        };
    };
    accountUpdateAvatar: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: components["requestBodies"]["AccountAvatarRequest"];
        responses: {
            /** @description Avatar Updated */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AccountResource"];
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ForbiddenErrorSchema"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ValidationErrorSchema"];
                };
            };
        };
    };
    accountUpdatePassword: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: components["requestBodies"]["AccountPasswordRequest"];
        responses: {
            /** @description Password update */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ForbiddenErrorSchema"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ValidationErrorSchema"];
                };
            };
        };
    };
    refreshToken: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: components["requestBodies"]["RefreshTokenRequest"];
        responses: {
            /** @description Session refresh */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JwtTokenResource"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UnauthorizedErrorSchema"];
                };
            };
            /** @description Validation error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ValidationErrorSchema"];
                };
            };
        };
    };
    signIn: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: components["requestBodies"]["SignInRequest"];
        responses: {
            /** @description Sing in success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JwtTokenResource"];
                };
            };
            /** @description Validation error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotFoundUserOrEmailPasswordWrong"];
                };
            };
        };
    };
    signOut: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Logged out */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UnauthorizedErrorSchema"];
                };
            };
            /** @description Validation error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ValidationErrorSchema"];
                };
            };
        };
    };
    signInSocial: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /**
                 * @description Red social
                 * @example google
                 */
                driver: string;
            };
            cookie?: never;
        };
        requestBody: components["requestBodies"]["SignInSocialRequest"];
        responses: {
            /** @description Authenticated */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JwtTokenResource"];
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ForbiddenErrorSchema"];
                };
            };
            /** @description Validation error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ValidationErrorSchema"];
                };
            };
        };
    };
    favoriteSync: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the property */
                property: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Synced */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UnauthorizedErrorSchema"];
                };
            };
            /** @description Validation error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ValidationErrorSchema"];
                };
            };
        };
    };
    favoriteList: {
        parameters: {
            query?: {
                /** @description Número de página para la paginación */
                page?: components["parameters"]["page"];
                /** @description Cantidad de elementos por página */
                per_page?: components["parameters"]["per_page"];
                /** @description Buscar texto libre en el contenido */
                search?: components["parameters"]["search"];
                /** @description Campo de ordenamiento. Usa '-' para orden descendente (ej: -created_at) */
                sort?: components["parameters"]["sort"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description List paginated of favorites */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CommonPagination"] & ({
                        data?: components["schemas"]["ListingResource"][];
                    } & {
                        [key: string]: unknown;
                    });
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UnauthorizedErrorSchema"];
                };
            };
        };
    };
    leadList: {
        parameters: {
            query?: {
                /** @description Número de página para la paginación */
                page?: components["parameters"]["page"];
                /** @description Cantidad de elementos por página */
                per_page?: components["parameters"]["per_page"];
                /** @description Buscar texto libre en el contenido */
                search?: components["parameters"]["search"];
                /** @description Campo de ordenamiento. Usa '-' para orden descendente (ej: -created_at) */
                sort?: components["parameters"]["sort"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description List paginated of Leads */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CommonPagination"] & ({
                        data?: components["schemas"]["LeadResource"][];
                    } & {
                        [key: string]: unknown;
                    });
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UnauthorizedErrorSchema"];
                };
            };
        };
    };
    leadStore: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: components["requestBodies"]["StoreLeadRequest"];
        responses: {
            /** @description Created */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LeadResource"];
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ForbiddenErrorSchema"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ValidationErrorSchema"];
                };
            };
        };
    };
    leadShow: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of lead */
                lead: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LeadResource"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotFoundErrorSchema"];
                };
            };
        };
    };
    leadUpdate: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                lead: number;
            };
            cookie?: never;
        };
        requestBody: components["requestBodies"]["UpdateLeadRequest"];
        responses: {
            /** @description Updated */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LeadResource"];
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ForbiddenErrorSchema"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotFoundErrorSchema"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ValidationErrorSchema"];
                };
            };
        };
    };
    leadDestroy: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                lead: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Deleted */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ForbiddenErrorSchema"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotFoundErrorSchema"];
                };
            };
        };
    };
    listingList: {
        parameters: {
            query?: {
                /** @description Número de página para la paginación */
                page?: components["parameters"]["page"];
                /** @description Cantidad de elementos por página */
                per_page?: components["parameters"]["per_page"];
                /** @description Buscar texto libre en el contenido */
                search?: components["parameters"]["search"];
                /** @description Campo de ordenamiento. Usa '-' para orden descendente (ej: -created_at) */
                sort?: components["parameters"]["sort"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description List paginated of listing */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CommonPagination"] & ({
                        data?: components["schemas"]["ListingResource"][];
                    } & {
                        [key: string]: unknown;
                    });
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ForbiddenErrorSchema"];
                };
            };
        };
    };
    listingStore: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: components["requestBodies"]["StoreListingRequest"];
        responses: {
            /** @description Created */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ListingResource"];
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ForbiddenErrorSchema"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ValidationErrorSchema"];
                };
            };
        };
    };
    listingShow: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of Listing */
                listing: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ListingResource"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotFoundErrorSchema"];
                };
            };
        };
    };
    ListingUpdate: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                listing: number;
            };
            cookie?: never;
        };
        requestBody: components["requestBodies"]["UpdateListingRequest"];
        responses: {
            /** @description Updated */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ListingResource"];
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ForbiddenErrorSchema"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotFoundErrorSchema"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ValidationErrorSchema"];
                };
            };
        };
    };
    ListingDestroy: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                listing: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Deleted */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ForbiddenErrorSchema"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotFoundErrorSchema"];
                };
            };
        };
    };
    locationStore: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: components["requestBodies"]["StoreLocationRequest"];
        responses: {
            /** @description Created */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LocationResource"];
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ForbiddenErrorSchema"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ValidationErrorSchema"];
                };
            };
        };
    };
    locationUpdate: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                location: number;
            };
            cookie?: never;
        };
        requestBody: components["requestBodies"]["UpdateLocationRequest"];
        responses: {
            /** @description Updated */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LocationResource"];
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ForbiddenErrorSchema"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotFoundErrorSchema"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ValidationErrorSchema"];
                };
            };
        };
    };
    propertyList: {
        parameters: {
            query?: {
                /** @description Filter by number of bathrooms */
                bathrooms?: components["parameters"]["bathrooms"];
                /** @description Filter by number of bedrooms */
                bedrooms?: components["parameters"]["bedrooms"];
                /** @description Filter by maximum area */
                max_area?: components["parameters"]["max_area"];
                /** @description Filter by maximum price */
                max_price?: components["parameters"]["max_price"];
                /** @description Filter by minimum area */
                min_area?: components["parameters"]["min_area"];
                /** @description Filter by minimum price */
                min_price?: components["parameters"]["min_price"];
                /** @description Número de página para la paginación */
                page?: components["parameters"]["page"];
                /** @description Cantidad de elementos por página */
                per_page?: components["parameters"]["per_page"];
                /** @description Filter by property_type */
                property_type?: components["parameters"]["property_type"];
                /** @description Filter by role (e.g., admin, user, etc.) */
                role?: components["parameters"]["role"];
                /** @description Buscar texto libre en el contenido */
                search?: components["parameters"]["search"];
                /** @description Campo de ordenamiento. Usa '-' para orden descendente (ej: -created_at) */
                sort?: components["parameters"]["sort"];
                /** @description Filter by status_id (e.g., active, etc. */
                status_id?: components["parameters"]["status_id"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description List paginated of properties */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CommonPagination"] & ({
                        data?: components["schemas"]["PropertyResource"][];
                    } & {
                        [key: string]: unknown;
                    });
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ForbiddenErrorSchema"];
                };
            };
        };
    };
    propertyStore: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: components["requestBodies"]["StorePropertyRequest"];
        responses: {
            /** @description Created */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PropertyResource"];
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ForbiddenErrorSchema"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ValidationErrorSchema"];
                };
            };
        };
    };
    propertyShow: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of property */
                property: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PropertyResource"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotFoundErrorSchema"];
                };
            };
        };
    };
    propertyUpdate: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                property: number;
            };
            cookie?: never;
        };
        requestBody: components["requestBodies"]["UpdatePropertyRequest"];
        responses: {
            /** @description Updated */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PropertyResource"];
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ForbiddenErrorSchema"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotFoundErrorSchema"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ValidationErrorSchema"];
                };
            };
        };
    };
    propertyDestroy: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                property: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Deleted */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ForbiddenErrorSchema"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotFoundErrorSchema"];
                };
            };
        };
    };
    propertyBulkDestroy: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: components["requestBodies"]["BulkDeleteRequest"];
        responses: {
            /** @description Deleted */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ForbiddenErrorSchema"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotFoundErrorSchema"];
                };
            };
        };
    };
    propertyTypeList: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description List of types */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PropertyTypeResource"][];
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ForbiddenErrorSchema"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotFoundErrorSchema"];
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    propertyTypeStore: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Payload to create a property */
        requestBody: {
            content: {
                "multipart/form-data": {
                    /**
                     * @description Title of the property type
                     * @example Apartment
                     */
                    name: string;
                } & {
                    [key: string]: unknown;
                };
            };
        };
        responses: {
            /** @description Created */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PropertyTypeResource"];
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ForbiddenErrorSchema"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ValidationErrorSchema"];
                };
            };
        };
    };
    propertyTypeUpdate: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                propertyType: number;
            };
            cookie?: never;
        };
        /** @description Payload to update a property */
        requestBody: {
            content: {
                "multipart/form-data": {
                    /** @description Title of the property */
                    name?: string;
                } & {
                    [key: string]: unknown;
                };
            };
        };
        responses: {
            /** @description Updated */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PropertyTypeResource"];
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ForbiddenErrorSchema"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotFoundErrorSchema"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ValidationErrorSchema"];
                };
            };
        };
    };
    propertyTypeDestroy: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                propertyType: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Deleted */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ForbiddenErrorSchema"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotFoundErrorSchema"];
                };
            };
        };
    };
    realEstateList: {
        parameters: {
            query?: {
                /** @description Número de página para la paginación */
                page?: components["parameters"]["page"];
                /** @description Cantidad de elementos por página */
                per_page?: components["parameters"]["per_page"];
                /** @description Buscar texto libre en el contenido */
                search?: components["parameters"]["search"];
                /** @description Campo de ordenamiento. Usa '-' para orden descendente (ej: -created_at) */
                sort?: components["parameters"]["sort"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description List paginated of real estates */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CommonPagination"] & ({
                        data?: components["schemas"]["RealEstateResource"][];
                    } & {
                        [key: string]: unknown;
                    });
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UnauthorizedErrorSchema"];
                };
            };
        };
    };
    realEstateStore: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: components["requestBodies"]["StoreRealEstateRequest"];
        responses: {
            /** @description Created */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RealEstateResource"];
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ForbiddenErrorSchema"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ValidationErrorSchema"];
                };
            };
        };
    };
    realEstateShow: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of real estate */
                realEstate: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RealEstateResource"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotFoundErrorSchema"];
                };
            };
        };
    };
    realEstateUpdate: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                realEstate: number;
            };
            cookie?: never;
        };
        requestBody: components["requestBodies"]["UpdateRealEstateRequest"];
        responses: {
            /** @description Updated */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RealEstateResource"];
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ForbiddenErrorSchema"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotFoundErrorSchema"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ValidationErrorSchema"];
                };
            };
        };
    };
    realEstateDestroy: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                realEstate: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Deleted */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ForbiddenErrorSchema"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotFoundErrorSchema"];
                };
            };
        };
    };
    resendResetCode: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: components["requestBodies"]["ResendResetPasswordRequest"];
        responses: {
            /** @description Code was re sended */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    resetPassword: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: components["requestBodies"]["ResetPasswordRequest"];
        responses: {
            /** @description Reset password successful */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    sendResetCode: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: components["requestBodies"]["ResetPasswordAttemptRequest"];
        responses: {
            /** @description Code was sended */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    verifyResetCode: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: components["requestBodies"]["VerifyResetCodeRequest"];
        responses: {
            /** @description Code is valid" */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["EmailUserResource"];
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    sendVerificationEmail: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: components["requestBodies"]["SendEmailVerifyRequest"];
        responses: {
            /** @description Email verification send */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Validation error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ValidationErrorSchema"];
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    signUp: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: components["requestBodies"]["SignUpRequest"];
        responses: {
            /** @description Authenticated */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["EmailUserResource"];
                };
            };
            /** @description Validation error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ValidationErrorSchema"];
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    verifyAccount: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: components["requestBodies"]["VerifyAccountRequest"];
        responses: {
            /** @description Sing in success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JwtTokenResource"];
                };
            };
            /** @description Validation error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ValidationErrorSchema"];
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
}
export enum ApiPaths {
    accountShow = "/account",
    accountUpdate = "/account",
    accountDestroy = "/account",
    accountUpdatePassword = "/account/password",
    accountUpdateAvatar = "/account/avatar",
    sendResetCode = "/recovery/send-code",
    verifyResetCode = "/recovery/verify-code",
    resendResetCode = "/recovery/resend-code",
    resetPassword = "/recovery/reset-password",
    refreshToken = "/auth/refresh",
    signIn = "/auth/sign-in",
    signInSocial = "/auth/social/{driver}",
    signOut = "/auth/sign-out",
    leadList = "/leads",
    leadStore = "/leads",
    leadShow = "/leads/{lead}",
    leadUpdate = "/leads/{lead}",
    leadDestroy = "/leads/{lead}",
    listingList = "/listing",
    listingStore = "/listing",
    listingShow = "/listing/{listing}",
    ListingUpdate = "/listing/{listing}",
    ListingDestroy = "/listing/{listing}",
    locationStore = "/locations",
    locationUpdate = "/locations/{location}",
    propertyList = "/properties",
    propertyStore = "/properties",
    propertyShow = "/properties/{property}",
    propertyUpdate = "/properties/{property}",
    propertyDestroy = "/properties/{property}",
    propertyBulkDestroy = "/properties/bulk/destroy",
    propertyTypeList = "/property-types",
    propertyTypeStore = "/property-types",
    propertyTypeUpdate = "/property-types/{propertyType}",
    propertyTypeDestroy = "/property-types/{propertyType}",
    realEstateList = "/real-estates",
    realEstateStore = "/real-estates",
    realEstateShow = "/real-estates/{realEstate}",
    realEstateUpdate = "/real-estates/{realEstate}",
    realEstateDestroy = "/real-estates/{realEstate}",
    signUp = "/register/sign-up",
    sendVerificationEmail = "/register/send-verification-email",
    verifyAccount = "/register/verify-account",
    favoriteList = "/favorites",
    favoriteSync = "/favorite/{property}"
}

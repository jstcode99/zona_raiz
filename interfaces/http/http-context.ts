import { cookies as nextCookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

import type {
  RequestCookies,
  ResponseCookies,
} from "next/dist/compiled/@edge-runtime/cookies"

export type ReadonlyCookies = Awaited<ReturnType<typeof nextCookies>>

export interface CookieContext {
  request?: NextRequest
  response?: NextResponse
  cookies?: ReadonlyCookies | RequestCookies
}
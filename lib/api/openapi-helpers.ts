import { paths } from "@/types/api/schema"

export type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete'

export type PathWithMethod<M extends HttpMethod> = {
  [P in keyof paths]: M extends keyof paths[P] ? P : never
}[keyof paths]

export type RequestBody<
  P extends keyof paths,
  M extends HttpMethod,
> =
  paths[P][M] extends {
    requestBody: {
      content: { 'application/json': infer B }
    }
  }
    ? B
    : never

export type ResponseBody<
  P extends keyof paths,
  M extends HttpMethod,
> =
  paths[P][M] extends {
    responses: {
      200: {
        content: { 'application/json': infer R }
      }
    }
  }
    ? R
    : never

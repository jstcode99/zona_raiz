import { ApiError } from './error'

export async function normalizeApiError(
  response: Response,
): Promise<ApiError> {
  let data: any = null

  try {
    data = await response.clone().json()
  } catch {}

  if (response.status === 401) {
    return {
      code: 'UNAUTHORIZED',
      status: 401,
      message: 'No autorizado',
    }
  }

  if (response.status === 422) {
    return {
      code: 'VALIDATION_ERROR',
      status: 422,
      message: data?.message ?? 'Datos inválidos',
      fields: data?.errors,
    }
  }

  if (response.status >= 500) {
    return {
      code: 'SERVER_ERROR',
      status: response.status,
      message: 'Error interno del servidor',
    }
  }

  return {
    code: 'UNKNOWN',
    status: response.status,
    message: data?.message ?? 'Error desconocido',
  }
}

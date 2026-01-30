import { revalidateTag } from 'next/cache'
import { pathToTag } from './tags'

export function invalidatePath(path: string) {
  revalidateTag(pathToTag(path))
}

// app/lib/utils.ts
// Re-exports from reorganized utilities
// This file provides backward compatibility for imports from @/lib/utils

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Re-export all utilities from shared/utils/
export {
  slugify,
  generateSlug,
  levenshtein,
  similarityScore,
} from "@/shared/utils/string";

export {
  formatCurrency,
  parseCurrency,
  formatPrice,
  splitByRatio,
} from "@/shared/utils/number";

export {
  isEmpty,
  toNumber,
  removeNullish,
  pickDefined,
  flatten,
} from "@/shared/utils/object";

export { objectToSearchParams } from "@/shared/utils/http";

// Infrastructure utilities (only when DOM is available)
export { optimizeImage } from "@/infrastructure/shared/utils/image";

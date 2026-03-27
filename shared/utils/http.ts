// shared/utils/http.ts
// HTTP utilities

import { isEmpty } from "./object";

export const objectToSearchParams = (obj: Record<string, unknown>) => {
  const params = new URLSearchParams();

  Object.entries(obj)
    .filter(([, v]) => !isEmpty(v))
    .forEach(([k, v]) => params.set(k, String(v)));
  return params;
};

export const flatten = (obj: any, prefix = "", formData: FormData) => {
  Object.entries(obj).forEach(([key, value]) => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (value instanceof File) {
      formData.append(fullKey, value);
    } else if (
      typeof value === "object" &&
      value !== null &&
      !(value instanceof Date)
    ) {
      formData.append(fullKey, JSON.stringify(value));
    } else if (value !== undefined && value !== null) {
      formData.append(fullKey, String(value));
    }
  });
  return formData;
};

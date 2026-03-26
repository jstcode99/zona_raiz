// shared/utils/object.ts
// Object utilities

export const isEmpty = (v: unknown) =>
  !v || v === undefined || v === null || v === "" || Number.isNaN(v);

export const toNumber = (v: string | null) => {
  if (!v) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
};

export function removeNullish<T extends Record<string, any>>(obj: T) {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => isEmpty(value)),
  ) as Partial<T>;
}

export function pickDefined<T extends object>(
  obj: T,
): {
  [K in keyof T as T[K] extends null | undefined ? never : K]: Exclude<
    T[K],
    null | undefined
  >;
} {
  const result: any = {};
  for (const key in obj) {
    const value = obj[key];
    if (value !== null && value !== undefined) {
      result[key] = value;
    }
  }
  return result;
}

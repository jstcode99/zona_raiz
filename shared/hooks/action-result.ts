export type FieldError = {
  field?: string;
  message: string;
  row?: number;
  column?: string;
  value?: string | number | null;
};

export type ActionResult<T = void> =
  | (T extends void ? { success: true } : { success: true; data: T })
  | { success: false; error?: FieldError; errors?: FieldError[] };

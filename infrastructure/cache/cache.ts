import { cache } from "react";
export const cached = <T extends (...a: any[]) => Promise<any>>(fn: T) => cache(fn);
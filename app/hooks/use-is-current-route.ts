"use client";

import { usePathname } from "next/navigation";

export function useIsCurrentRoute() {
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);

  const lang = segments[0];
  // quitamos idioma
  const routeSegments = segments.slice(1);
  const lastSegments = routeSegments.pop();

  const isCurrentRoute = (paths: string | string[]) => {
    const routes = Array.isArray(paths) ? paths : [paths];
    return routes.some((path) => {
      console.log(pathname, path, lastSegments);
      return pathname.startsWith(path);
    });
  };

  return isCurrentRoute;
}

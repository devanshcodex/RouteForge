import type { RouteDefinition } from "../routes/routeTypes";
import { normalizePathname } from "./parsePath";
import { matchPath } from "./pathMatcher";

export interface RouteMatch {
  route: RouteDefinition;
  params: Record<string, string>;
  pathname: string;
}

export function findRouteMatch(
  routes: RouteDefinition[],
  pathname: string,
): RouteMatch | null {
  const normalizedPathname = normalizePathname(pathname);

  for (const route of routes) {
    const result = matchPath(route.path, normalizedPathname);

    if (result) {
      return {
        route,
        params: result.params,
        pathname: normalizedPathname,
      };
    }
  }

  return null;
}
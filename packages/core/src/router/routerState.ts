import type { RouteMatch } from "../matcher/matchRoute";

export type RouterStatus = "idle" | "navigating" | "error";

export interface RouterLocation {
  pathname: string;
  search: string;
  hash: string;
}

export interface RouterState {
  status: RouterStatus;
  location: RouterLocation;
  match: RouteMatch | null;
  error: Error | null;
}
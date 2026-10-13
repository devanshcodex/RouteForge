export interface RouteDefinition {
  id: string;
  path: string;
}

export interface RouterConfig {
  routes: RouteDefinition[];
}
import { findRouteMatch, type RouteMatch } from "../matcher/matchRoute";
import { parsePath } from "../matcher/parsePath";
import type { RouteDefinition } from "../routes/routeTypes";
import { RouterError } from "../errors/RouterError";
import type { RouterLocation, RouterState } from "./routerState";

export type RouterListener = (state: RouterState) => void;

export interface RouterOptions {
  routes: RouteDefinition[];
  initialUrl?: string;
  browserHistory?: boolean;
}

export class Router {
  private readonly routes: RouteDefinition[];
  private readonly listeners = new Set<RouterListener>();
  private readonly browserHistory: boolean;
  private state: RouterState;

  constructor(options: RouterOptions) {
    validateRoutes(options.routes);

    this.routes = [...options.routes];
    this.browserHistory = options.browserHistory ?? true;

    const initialUrl = options.initialUrl ?? getCurrentUrl();
    this.state = this.createState(initialUrl);

    if (this.browserHistory && typeof window !== "undefined") {
      window.addEventListener("popstate", this.handlePopState);
    }
  }

  getState(): RouterState {
    return this.state;
  }

  subscribe(listener: RouterListener): () => void {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  }

  match(url: string): RouteMatch | null {
    const parsed = parsePath(url);
    return findRouteMatch(this.routes, parsed.pathname);
  }

  async navigate(url: string): Promise<RouteMatch | null> {
    this.setState({
      ...this.state,
      status: "navigating",
      error: null,
    });

    try {
      const nextState = this.createState(url);

      if (!nextState.match) {
        throw new RouterError(
          `No route matches "${nextState.location.pathname}"`,
          "ROUTE_NOT_FOUND",
        );
      }

      if (
        this.browserHistory &&
        typeof window !== "undefined" &&
        window.location.href !== new URL(url, window.location.href).href
      ) {
        window.history.pushState({}, "", url);
      }

      this.setState({
        ...nextState,
        status: "idle",
      });

      return nextState.match;
    } catch (error) {
      const normalizedError =
        error instanceof Error ? error : new Error(String(error));

      this.setState({
        ...this.state,
        status: "error",
        error: normalizedError,
      });

      throw normalizedError;
    }
  }

  destroy(): void {
    if (typeof window !== "undefined") {
      window.removeEventListener("popstate", this.handlePopState);
    }

    this.listeners.clear();
  }

  private readonly handlePopState = (): void => {
    const nextState = this.createState(getCurrentUrl());

    this.setState({
      ...nextState,
      status: "idle",
    });
  };

  private createState(url: string): RouterState {
    const location = parsePath(url);
    const match = findRouteMatch(this.routes, location.pathname);

    return {
      status: "idle",
      location,
      match,
      error: null,
    };
  }

  private setState(nextState: RouterState): void {
    this.state = nextState;

    for (const listener of this.listeners) {
      listener(this.state);
    }
  }
}

function getCurrentUrl(): string {
  if (typeof window === "undefined") {
    return "/";
  }

  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
}

function validateRoutes(routes: RouteDefinition[]): void {
  const ids = new Set<string>();

  for (const route of routes) {
    if (!route.id || !route.path) {
      throw new RouterError(
        "Every route must define a non-empty id and path.",
        "INVALID_ROUTE",
      );
    }

    if (ids.has(route.id)) {
      throw new RouterError(
        `Duplicate route id "${route.id}".`,
        "INVALID_ROUTE",
      );
    }

    ids.add(route.id);
  }
}
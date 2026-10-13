import { Router, type RouterOptions } from "./Router";

export function createRouter(options: RouterOptions): Router {
  return new Router(options);
}
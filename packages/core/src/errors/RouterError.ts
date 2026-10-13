export type RouterErrorCode =
  | "INVALID_ROUTE"
  | "ROUTE_NOT_FOUND"
  | "INVALID_URL"
  | "NAVIGATION_FAILED";

export class RouterError extends Error {
  constructor(
    message: string,
    public readonly code: RouterErrorCode,
  ) {
    super(message);
    this.name = "RouterError";
  }
}
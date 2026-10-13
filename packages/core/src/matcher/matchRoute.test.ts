import { describe, expect, it } from "vitest";
import { findRouteMatch } from "./matchRoute";

const routes = [
  { id: "home", path: "/" },
  { id: "about", path: "/about" },
  { id: "user", path: "/users/:id" },
];

describe("findRouteMatch", () => {
  it("returns the matching route", () => {
    expect(findRouteMatch(routes, "/users/123")).toMatchObject({
      route: { id: "user", path: "/users/:id" },
      params: { id: "123" },
      pathname: "/users/123",
    });
  });

  it("returns null when no route matches", () => {
    expect(findRouteMatch(routes, "/missing")).toBeNull();
  });
});
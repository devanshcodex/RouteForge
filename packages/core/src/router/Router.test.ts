import { afterEach, describe, expect, it } from "vitest";
import { createRouter } from "./createRouter";
import type { RouterState } from "./routerState";
const routes = [
  { id: "home", path: "/" },
  { id: "about", path: "/about" },
  { id: "user", path: "/users/:id" },
];

describe("Router", () => {
  afterEach(() => {
    // Tests use browserHistory=false, so there is no global browser listener.
  });

  it("initializes with the configured URL", () => {
    const router = createRouter({
      routes,
      initialUrl: "/users/42?tab=posts#activity",
      browserHistory: false,
    });

    expect(router.getState()).toMatchObject({
      status: "idle",
      location: {
        pathname: "/users/42",
        search: "?tab=posts",
        hash: "#activity",
      },
      match: {
        route: { id: "user" },
        params: { id: "42" },
      },
    });
  });

  it("navigates and notifies subscribers", async () => {
    const router = createRouter({
      routes,
      initialUrl: "/",
      browserHistory: false,
    });

    const states: RouterState[] = [];
    router.subscribe((state) => states.push(state));

    await router.navigate("/about");

    expect(router.getState().location.pathname).toBe("/about");
    expect(states).toHaveLength(2);
    expect(states[0].status).toBe("navigating");
    expect(states[1].status).toBe("idle");
  });

  it("rejects navigation to an unknown route", async () => {
    const router = createRouter({
      routes,
      initialUrl: "/",
      browserHistory: false,
    });

    await expect(router.navigate("/missing")).rejects.toMatchObject({
      code: "ROUTE_NOT_FOUND",
    });

    expect(router.getState().status).toBe("error");
  });

  it("supports unsubscribe", async () => {
    const router = createRouter({
      routes,
      initialUrl: "/",
      browserHistory: false,
    });

    let calls = 0;
    const unsubscribe = router.subscribe(() => {
      calls += 1;
    });

    unsubscribe();
    await router.navigate("/about");

    expect(calls).toBe(0);
  });

  it("rejects duplicate route ids", () => {
    expect(() =>
      createRouter({
        routes: [
          { id: "same", path: "/" },
          { id: "same", path: "/about" },
        ],
        browserHistory: false,
      }),
    ).toThrowError(/Duplicate route id/);
  });
});
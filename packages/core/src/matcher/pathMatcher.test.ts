import { describe, expect, it } from "vitest";
import { matchPath } from "./pathMatcher";

describe("matchPath", () => {
  it("matches a static route", () => {
    expect(matchPath("/about", "/about")).toEqual({ params: {} });
  });

  it("rejects a different static route", () => {
    expect(matchPath("/about", "/contact")).toBeNull();
  });

  it("captures one dynamic parameter", () => {
    expect(matchPath("/users/:id", "/users/42")).toEqual({
      params: { id: "42" },
    });
  });

  it("captures multiple parameters", () => {
    expect(matchPath("/posts/:postId/comments/:commentId", "/posts/12/comments/7"))
      .toEqual({
        params: { postId: "12", commentId: "7" },
      });
  });

  it("does not partially match a path", () => {
    expect(matchPath("/users/:id", "/users/42/settings")).toBeNull();
  });
});

it("matches an optional parameter when the value exists", () => {
  expect(matchPath("/users/:id?", "/users/42")).toEqual({
    params: {
      id: "42",
    },
  });
});

it("matches an optional parameter when the value is missing", () => {
  expect(matchPath("/users/:id?", "/users")).toEqual({
    params: {},
  });
});

it("does not partially match after an optional parameter", () => {
  expect(matchPath("/users/:id?", "/users/42/profile")).toBeNull();
});
import { describe, expect, it } from "vitest";
import { normalizePathname, parsePath } from "./parsePath";

describe("parsePath", () => {
  it("separates pathname, query string and hash", () => {
    expect(parsePath("/users/42?tab=posts#comments")).toEqual({
      pathname: "/users/42",
      search: "?tab=posts",
      hash: "#comments",
    });
  });

  it("normalizes trailing slashes", () => {
    expect(normalizePathname("/about/")).toBe("/about");
    expect(normalizePathname("/")).toBe("/");
  });
});
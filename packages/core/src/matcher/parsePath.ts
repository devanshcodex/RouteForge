export interface ParsedPath {
  pathname: string;
  search: string;
  hash: string;
}

export function parsePath(input: string): ParsedPath {
  const url = new URL(input, "http://routeforge.local");

  return {
    pathname: normalizePathname(url.pathname),
    search: url.search,
    hash: url.hash,
  };
}

export function normalizePathname(pathname: string): string {
  if (!pathname || pathname === "/") return "/";

  const withLeadingSlash = pathname.startsWith("/")
    ? pathname
    : `/${pathname}`;

  const withoutTrailingSlash = withLeadingSlash.replace(/\/+$/, "");

  return withoutTrailingSlash || "/";
}
export interface PathMatch {
  params: Record<string, string>;
}

export function matchPath(
  pattern: string,
  pathname: string,
): PathMatch | null {
  const patternSegments = splitPath(pattern);
  const pathnameSegments = splitPath(pathname);

  const optionalFinalSegment = isOptionalParameter(
    patternSegments.at(-1),
  );

  // A normal route must have exactly the same number of segments.
  //
  // An optional final parameter is the only exception:
  //
  //   /users/:id?
  //
  // can match:
  //
  //   /users
  //   /users/42
  if (
    pathnameSegments.length > patternSegments.length ||
    (!optionalFinalSegment &&
      pathnameSegments.length !== patternSegments.length) ||
    (optionalFinalSegment &&
      pathnameSegments.length < patternSegments.length - 1)
  ) {
    return null;
  }

  const params: Record<string, string> = {};

  for (let index = 0; index < patternSegments.length; index += 1) {
    const patternSegment = patternSegments[index];
    const actualSegment = pathnameSegments[index];

    if (patternSegment.startsWith(":")) {
      const rawName = patternSegment.slice(1);
      const optional = rawName.endsWith("?");
      const name = optional ? rawName.slice(0, -1) : rawName;

      if (!name) {
        return null;
      }

      if (actualSegment === undefined) {
        if (optional) {
          continue;
        }

        return null;
      }

      params[name] = decodeURIComponent(actualSegment);
      continue;
    }

    if (actualSegment === undefined || patternSegment !== actualSegment) {
      return null;
    }
  }

  return { params };
}

function isOptionalParameter(segment: string | undefined): boolean {
  return Boolean(
    segment?.startsWith(":") && segment.endsWith("?"),
  );
}

function splitPath(path: string): string[] {
  if (path === "/") return [];

  return path
    .replace(/^\/+|\/+$/g, "")
    .split("/")
    .filter(Boolean);
}
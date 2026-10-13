# RouteForge

RouteForge is an original TypeScript-first routing core built from scratch as a portfolio engineering project.

## Phase 1

- Static route matching
- Dynamic `:parameter` segments
- URL parsing
- Query/hash separation
- Router state
- Client-side navigation
- Browser history integration
- Subscriptions
- Automated tests

## Example

```ts
import { createRouter } from "@routeforge/core";

const router = createRouter({
  routes: [
    { id: "home", path: "/" },
    { id: "about", path: "/about" },
    { id: "user", path: "/users/:id" }
  ]
});

const match = router.match("/users/42");

console.log(match?.params);
// { id: "42" }

await router.navigate("/about");
```

## Development

```bash
pnpm install
pnpm test
pnpm build
```

RouteForge is currently a learning/portfolio project and is not intended to replace mature production routers.

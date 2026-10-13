# RouteForge Basic Example

The Phase 1 demo is intentionally framework-free so the routing core can be inspected independently.

```ts
import { createRouter } from "@routeforge/core";

const router = createRouter({
  routes: [
    { id: "home", path: "/" },
    { id: "about", path: "/about" },
    { id: "user", path: "/users/:id" }
  ]
});

console.log(router.match("/users/7"));
await router.navigate("/about");
```

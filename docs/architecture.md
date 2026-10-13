# RouteForge Architecture

## Phase 1

The project deliberately separates URL parsing, route matching, router state and navigation.

```text
URL
 |
 v
parsePath
 |
 v
pathname + search + hash
 |
 v
findRouteMatch
 |
 v
RouteMatch
 |
 v
Router state
 |
 v
subscribers
```

The core package has no React dependency. React integration will be added in a later phase.

## Navigation lifecycle

```text
idle
 |
 | navigate()
 v
navigating
 |
 +--> route match --> idle
 |
 +--> error -------> error
```

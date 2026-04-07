# Storefront Frontend

## Prerequisites

- [Node.js 22+]
- [Angular CLI 21]

## Run Instructions

1. Install dependencies:

```bash
cd storefront-client
npm install
```

2. Start the development server:

```bash
ng serve
```

The app starts on `http://localhost:4200`.

> The backend must be running on `http://localhost:5090` before using the app. See the backend README for setup steps.

## Test Accounts

| Email | Password | Role |
|---|---|---|
| `admin@store.com` | `password123` | Admin |
| `user@store.com` | `password123` | User |

---

## Key Technical Decisions

### Signals for All Component State
Angular 21 uses zoneless change detection by default. All mutable component state (loading flags, data arrays, form submission state) is therefore managed with `signal()`, `signal.set()`, and `signal.update()`. Regular property mutations are invisible to the change detector in this mode.

### JWT Decoded Client-Side
After login the JWT is stored in memory (not `localStorage` or `sessionStorage`) to reduce XSS exposure. `UserContextService` decodes the payload to extract the user's email, role, and derived permissions (`canCreateProduct`, `canDeleteProduct`). 

### Functional Interceptor and Guards
The HTTP interceptor (`httpInterceptor`) and route guards (`authGuard`, `adminGuard`) use the functional form. The interceptor attaches the Bearer token on every outgoing request and handles 401 (force logout) and 403/5xx (error toast) responses globally. Guards protect routes declaratively in `app.routes.ts`.

### SignalR with accessTokenFactory
WebSocket connections cannot set the `Authorization` header. The SignalR client passes the JWT as the `access_token` query parameter via `accessTokenFactory`. The backend extracts it in `OnMessageReceived` before the hub authentication middleware runs. The connection is started after a successful login and stopped on sign-out.

### Lazy-Loaded Standalone Components
Every feature route uses `loadComponent` for code splitting. All components are standalone and declare their own `imports`. This keeps bundle sizes small and makes the dependency graph for each component explicit.

### BehaviorSubject for Cross-Component State
`CartService` and `NotificationService` use `BehaviorSubject` to share state across components without a state management library. Components subscribe to the observable or read the current value synchronously via `.getValue()` where signals are not required.

---

## Trade-offs

- **Token stored in memory, not persisted.** Refreshing the page logs the user out. Persisting to `sessionStorage` would survive refreshes but increases XSS risk; a proper solution would use `HttpOnly` cookies with a refresh token endpoint.
- **Cart is not persisted.** Navigating away from the cart or refreshing loses its contents. Production would store the cart server-side or in `localStorage`.
---

## Assumptions

- The API runs on `http://localhost:5090` (configured in `src/environments/environment.ts`).
- Users are always redirected to `/login` if their token is missing or expired.
- Admin users access product management via `/admin/products`; the route is guarded and not shown in the nav for regular users.
- Real-time payment updates are delivered over SignalR; no polling fallback is implemented.
- A single checkout submits all cart items as one order.

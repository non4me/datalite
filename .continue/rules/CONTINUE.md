# CONTINUE.md: Ng18 Project Guide

This guide provides an overview of the Ng18 project, an Angular-based application for managing favorite tickets in a ticketing system. It is designed to help developers understand the codebase, set up the environment, and contribute effectively. The project appears to be a demo or prototype for a ticket widget, using mocks for data in a development context.

## 1. Project Overview

### Purpose
Ng18 is a web application focused on displaying and managing a user's favorite tickets from a ticketing system (likely integrated with a backend like TSM-Ticket). It features a simple widget interface for viewing ticket lists, adding/removing favorites, and handling basic CRUD operations on ticket favorites. Currently, it's a standalone Angular app with demo data via mocks, simulating API interactions.

### Key Technologies
- **Frontend Framework**: Angular 18 (using standalone components for modern, lightweight architecture).
- **UI Library**: PrimeNG 18 (for components like tables and buttons) with TailwindCSS for styling (via tailwindcss-primeui).
- **State Management & HTTP**: RxJS 7.8 for observables; Angular HttpClient for API calls.
- **Build Tools**: Angular CLI 18.2.21, TypeScript 5.5, SCSS for styles.
- **Testing**: Jasmine/Karma for unit tests; no E2E setup visible.
- **Other**: Zone.js for change detection; PostCSS and Autoprefixer for CSS processing.

### High-Level Architecture
- **Entry Point**: `main.ts` bootstraps `AppComponent`, which serves as the root and includes routing to `WidgetComponent`.
- **Routing**: Single route (`''`) loads `WidgetComponent` via `app.routes.ts`.
- **Components**: Minimal structure with `AppComponent` (root) and `WidgetComponent` (main ticket display using PrimeNG Table).
- **Services**: `ApiService` handles HTTP requests to backend APIs (e.g., fetching tickets, updating user parameters); `TicketService` abstracts ticket-specific logic.
- **Data Flow**: On load, `WidgetComponent` fetches favorite tickets via services. API calls fall back to mocks on errors (e.g., 401 unauthorized).
- **Models**: TypeScript interfaces define `Ticket`, `AuditInfo`, `TicketPageResponse`, etc., for type safety.
- **Environment**: Configurable via `environment.ts` (BASE_URL for API endpoints).
- **Assumptions**: This seems like a proof-of-concept or demo app. In production, integrate real auth (e.g., interceptors) and remove mocks. Backend appears to be a REST API at `/tsm-user-management` and `/tsm-ticket`.

## 2. Getting Started

### Prerequisites
- Node.js (v18+ recommended) and npm/yarn.
- Angular CLI: Install globally with `npm install -g @angular/cli@18`.
- IDE: VS Code with Angular extensions (e.g., Angular Language Service).
- Optional: PrimeNG themes/CDN for icons (already included via PrimeIcons).

### Installation
1. Clone the repository (assuming it's in a Git repo at root).
2. Navigate to the `ng18/` directory: `cd ng18`.
3. Install dependencies: `npm install`.
4. (Assumption: If API keys or env vars are needed, set them in `src/environments/environment.ts`; currently uses a placeholder BASE_URL.)

### Basic Usage
- Start the development server: `npm start` or `ng serve`.
- Open `http://localhost:4200/` in your browser. The app loads the widget with mock favorite tickets.
- Interact: View the table, add a demo ticket to favorites, or remove one (updates simulate API calls).

### Running Tests
- Unit tests: `npm test` or `ng test` (runs Jasmine/Karma; covers services and components).
- Coverage: Automatically generated; view in browser.
- No E2E tests configured; add with `ng add @angular/cypress` or similar if needed.
- (Note: Some specs exist, e.g., for services and pipes, but coverage may be partial—verify by running.)

## 3. Project Structure

### Main Directories
- **src/**: Core source code.
  - **app/**: Main application logic.
    - **components/**: UI components.
      - **app/**: Root `AppComponent` (basic router outlet).
      - **widget/**: `WidgetComponent` (ticket table, add/delete logic).
    - **services/**: Business logic.
      - `api.service.ts`: HTTP client for tickets and user params (with mock fallback).
      - `ticket.service.ts`: Wraps API for ticket operations (get list, update favorites).
    - **model/**: TypeScript interfaces/models.
      - `ticket.ts`: Core `Ticket` interface (id, key, status, etc.); extends to `CustomTicket`.
      - `audit-info.ts`, `ticket-page-response.ts`, `user-parameter.ts`: Supporting types.
    - **shared/**: Reusable utilities.
      - **pipes/**: `safe-html.pipe.ts` (sanitizes HTML for ticket descriptions).
    - **mocks/**: Demo data.
      - `list.json`: Sample `TicketPageResponse` for fallback.
  - **environments/**: Config files (e.g., `environment.ts` for BASE_URL).
  - **assets/**: None prominent; public/ for static files like favicon.
- **Root Files**:
  - `package.json`: Dependencies and scripts (e.g., build, test).
  - `angular.json`: Build config (outputs to `dist/ng18`; SCSS styles).
  - `tsconfig.json` & variants: TypeScript compilation (strict mode implied).
  - `tailwind.config.js`: Tailwind setup with PrimeUI plugin.
  - `README.md`: Basic Angular CLI info (extend this guide).
- **Other**: `.vscode/` for workspace settings; no `dist/` until built.

### Key Files and Roles
- `src/main.ts`: Bootstraps app with config.
- `src/app/app.config.ts`: Provides HTTP client, routes, etc. (not read, but standard).
- `src/app/app.routes.ts`: Defines single route to WidgetComponent.
- Important Configs: `angular.json` (build/serve options); `environment.ts` (API base URL).

## 4. Development Workflow

### Coding Standards/Conventions
- **TypeScript**: Strict typing; use interfaces for models. Follow Angular style guide (e.g., standalone components, signals if extended).
- **Styling**: SCSS for component styles; Tailwind for utility classes via PrimeUI.
- **Naming**: Kebab-case for files; PascalCase for components/services.
- **Commit Guidelines**: Standard Git (no specific linting enforced; add ESLint/Prettier if needed).
- **Rules**: Use RxJS operators (e.g., `takeUntilDestroyed`, `catchError`); handle errors gracefully.

### Testing Approach
- Unit: Focus on services (e.g., API mocks) and components (shallow rendering).
- Integration: Test HTTP flows with HttpClientTestingModule.
- Run often: `ng test --watch` during dev.
- (Gap: Add more specs for WidgetComponent interactions.)

### Build and Deployment
- Development Build: `ng build --configuration development` (no optimization, source maps).
- Production: `ng build` (minified, hashed assets; output in `dist/ng18`).
- Serve Prod: Use a static server (e.g., `npx http-server dist/ng18`).
- Deployment: Host on Vercel/Netlify (Angular universal for SSR if needed); configure proxy for API.

### Contribution Guidelines
- Fork/branch: Feature branches (e.g., `feat/add-auth`).
- PRs: Describe changes; run tests/lint.
- Review: Ensure no breaking API changes; update mocks if data evolves.
- (Assumption: Add CODE_OF_CONDUCT.md for team standards.)

## 5. Key Concepts

### Domain-Specific Terminology
- **Ticket**: Core entity representing support incidents (fields: id, key, severity, status, etc.).
- **Favorites**: User-specific list of ticket keys stored as JSON in a user parameter (ID: `019968ad-c5b6-7011-b8fa-d1e235ec2a7e`).
- **AuditInfo**: Tracks creation/edit history (version, users, timestamps).
- **Channels/Types**: E.g., "SAP", "MANUAL"; "Standardni" for ticket types.

### Core Abstractions
- **Services as Facades**: `TicketService` hides API complexity; `ApiService` manages HTTP with error handling (mocks for demo).
- **Observables**: Reactive data fetching/updates in components.
- **Standalone Components**: No NgModules; imports are explicit.

### Design Patterns Used
- **Dependency Injection**: Services injected via `inject()` or constructor.
- **Facade Pattern**: Services abstract backend details.
- **Error Handling**: Catch operators with fallbacks (e.g., 401 → mocks).
- (Potential: Extend to State Management with NgRx if scaling.)

## 6. Common Tasks

### Fetch and Display Favorite Tickets
1. Ensure `environment.BASE_URL` points to your API (or use mocks).
2. Run `ng serve`; WidgetComponent auto-fetches via `TicketService.getList()`.
3. View table: Renders tickets with safe HTML descriptions (via pipe).

### Add a Ticket to Favorites
1. In WidgetComponent: Call `addToFavorites()` (demo only; TODO: Integrate LOV component).
2. Updates local list and simulates API POST to user params.

### Remove from Favorites
1. Click delete on a ticket row.
2. Sets `deletePending` flag, filters list, POSTs updated keys to API.
3. Handles errors by reverting (demo resilience).

### Customize API Endpoints
1. Edit `src/environments/environment.ts`: Set `BASE_URL`.
2. Update `ApiService`: Modify paths (e.g., `/tsm-ticket/api/v2/tickets`).
3. Test: Mock errors to verify fallback.

### Example: Adding a New Component
1. `ng generate component new-feature --standalone`.
2. Import in routes/config if needed.
3. Add to `widget.component.ts` for integration.

## 7. Troubleshooting

### Common Issues
- **API 401 Errors**: App falls back to `mocks/list.json`. For real auth, implement `auth.interceptor.ts` (exists but not used).
- **CORS/Proxy Issues**: In dev, add proxy config to `angular.json` or serve via `--proxy-config`.
- **Build Fails**: Check Node version; run `npm audit fix`. Tailwind: Ensure PostCSS config.
- **Tests Fail**: Mock HTTP in specs (use `HttpClientTestingModule`).
- **Styles Missing**: PrimeNG requires theme import in `styles.scss` (verify); Tailwind rebuild with `npm run watch`.
- **No Tickets Load**: Check console for RxJS errors; ensure `userParamsId` in ApiService is correct.

### Debugging Tips
- Use Angular DevTools extension.
- Console.log in services for API payloads.
- `ng serve --configuration development` for verbose output.
- Inspect network tab: API calls to `/tsm-user-management` and `/tsm-ticket`.
- (Assumption: For production issues, log to backend; verify env vars.)

## 8. References
- **Official Docs**:
  - [Angular Documentation](https://angular.dev/)
  - [PrimeNG](https://primeng.org/) (Table, Button components).
  - [TailwindCSS](https://tailwindcss.com/) & [PrimeUI Plugin](https://tailwindcss-primeui.com/).
- **Project-Specific**:
  - Backend API: Assumed TSM (Ticket Service Management); docs not in repo—check external.
  - README.md: Basic setup.
- **Resources**:
  - RxJS Guide: [rxjs.dev](https://rxjs.dev/).
  - Testing: [Angular Testing](https://angular.dev/guide/testing).
  - GitHub: Extend with issues/milestones for team tracking.

This guide is based on the current codebase (Angular 18 demo). Verify assumptions (e.g., backend integration) and update as the project evolves. For sub-modules, create additional `rules.md` files in directories like `src/app/components/`.


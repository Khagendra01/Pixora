# Repository Guidelines

## Project Structure & Module Organization
The repository currently centers on the Next.js 15 frontend in `frontend/`. Application routes and React components live under `frontend/app/`; `layout.tsx` defines the shared shell and `page.tsx` holds the landing page. Global styles are collected in `frontend/app/globals.css`, while static assets such as SVGs or icons belong in `frontend/public/`. Build tooling sits alongside the app (`tsconfig.json`, `biome.json`, `next.config.ts`) and should remain versioned to keep the stack reproducible.

## Build, Test, and Development Commands
Run all commands from `frontend/`. `npm run dev` launches the Turbopack-powered development server with hot reload. `npm run build` performs a production build and surfaces type errors. `npm run start` serves the compiled output. `npm run lint` invokes Biome for linting and type-aware checks, and `npm run format` applies the repository formatting rules.

## Coding Style & Naming Conventions
TypeScript is required, and `tsconfig.json` enforces strict mode with path aliases exposed as `@/*`. Biome formats files using two-space indentation; keep JSX props on separate lines when they no longer fit within 100 characters for readability. Name React components with PascalCase (`HeroSection.tsx`), hooks with `useCamelCase`, and CSS utility wrappers with kebab-case classes. Favor co-located component folders (e.g., `app/(sections)/Hero`) that include component, styles, and tests when applicable.

## Testing Guidelines
Automated tests are not yet wired up; introduce them with Jest or Vitest and React Testing Library as features grow. Place component tests adjacent to their sources as `*.test.tsx`, and prefer descriptive `should…` blocks. When adding a test command, expose it via `package.json` (`"test": "vitest"`), and document new prerequisites in this guide. Target meaningful coverage of rendering paths and data-fetching logic.

## Commit & Pull Request Guidelines
Follow the existing short imperative commit style (`frontend init`); describe what the change does, not how. Each commit should compile and pass linting. Open pull requests with a concise summary, bullet list of notable changes, linked issue or ticket, and screenshots or GIFs when touching UI. Note any follow-up tasks or config changes in the PR body to aid reviewers.

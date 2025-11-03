# OHR — Event Horizon (frontend)

Live preview: https://only-hr.vercel.app/

A modern, componentized React frontend built with TypeScript, Vite, Tailwind CSS and shadcn-ui (Radix primitives). This repository contains the frontend for an event management / community site featuring events, teams, memberships and admin tools.

## Key technologies

- React (TypeScript)
- Vite (fast dev/build)
- Tailwind CSS (+ tailwind-animate)
- shadcn-ui + Radix UI primitives for accessible components
- TanStack Query for client data fetching/caching
- React Router for client routing
- axios for HTTP requests
- Zod + react-hook-form for validation and forms

## Highlights (what makes this project interesting)

- Fully componentized UI leveraging Radix primitives and shadcn-ui patterns for accessible, composable components.
- Uses TanStack Query for robust client-side caching and background updates.
- Modular folder structure: pages, components, ui primitives and hooks for easy maintenance and onboarding.
- Tailwind + utility-first CSS makes styling consistent and fast to iterate.

## Resume-ready / ATS-friendly bullet points

Use these lines directly on your resume (ATS optimized — start with action verbs and include technologies):

- Implemented a responsive, accessible frontend using React, TypeScript, Vite, Tailwind CSS and shadcn-ui (Radix), enabling rapid UI development and consistent design.
- Built modular UI components (events, teams, memberships, admin panels) using Radix primitives and Tailwind, improving reuse and maintainability.
- Integrated client-side data fetching and caching with TanStack Query and axios to optimize network usage and UX.
- Implemented form validation and schemas using react-hook-form and Zod to ensure strong input validation and developer ergonomics.
- Configured Vite development pipeline and SWC-based React plugin for fast cold-start and incremental builds.
- Designed and documented component APIs and folder structure to accelerate onboarding and cross-functional collaboration.
- Incorporated Tailwind CSS utility patterns and animations to produce performant, responsive UIs across devices.
- Used TypeScript types and linting to reduce runtime errors and improve developer experience.

Tip: Pick 3–5 bullets that are most relevant to the job you’re applying for and include them under the relevant project experience entry on your resume.

## Project structure (key paths)

- `src/` — application source
	- `components/` — page-level and feature components (Events, Activities, Team, Admin)
	- `components/ui/` — shadcn-style primitive components and wrappers
	- `pages/` — route pages (Home, Events, Admin, Contact, etc.)
	- `hooks/` — custom hooks (use-mobile, use-toast)
	- `lib/`, `utils/` — utility helpers

## Setup (local development)

Requirements: Node.js (16+ recommended) and npm.

1. Install dependencies

```bash
npm install
```

2. Start development server

```bash
npm run dev
```

This runs Vite's dev server. Open http://localhost:5173 (or the port Vite reports).

3. Build for production

```bash
npm run build
```

4. Preview production build locally

```bash
npm run preview
```

## Scripts (from package.json)

- `dev` — start Vite dev server
- `build` — build production bundle with Vite
- `build:dev` — build using development mode
- `preview` — preview the production build locally
- `lint` — run ESLint

## Notes on running & environment

- No runtime server is included in this repo — this is a static single-page app suitable for static hosting services (Vercel, Netlify) or an S3+CDN approach.
- API endpoints (if any) are expected to be provided by a backend service. Inspect `src/lib` or `src/utils` for axios calls or environment variable usage.

## Contributing

If you want to contribute:

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Make changes and run `npm install` if you add deps
4. Run `npm run dev` and verify locally
5. Commit and open a pull request

## Verification checklist (quick)

- Install deps: `npm install`
- Start dev server: `npm run dev` — verify app loads and routes work
- Run lint: `npm run lint`

## License

This project does not include a license file. Add a `LICENSE` file if you plan to publish this repository.

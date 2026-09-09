# Eigi_ai — Forward Deployed Engineering

An interactive FDE website with a pointer-responsive pixel hero, light/dark themes, scroll-driven AI capability cards, floating expertise cards, and engineering-discipline sections.

## Local development

Requires Node.js **22.13.0 or newer**, npm, and **Git LFS**.

```sh
git lfs install
git clone https://github.com/Pawanp-23/eigi-ai-fde.git
cd eigi-ai-fde
npm ci
npm run dev
```

Open the local URL printed by the development server (normally `http://localhost:5173`).

## Validation and production build

```sh
npm run typecheck
npm run build
```

`npm start` previews the generated static production build after `npm run build`. It does not publish the website.

## Technology

- React 19, TypeScript and Vite
- Three.js for the interactive scenes
- Motion for scroll effects and transitions
- Tailwind CSS and Base UI components
- Static Vite build output served by nginx from a Docker image

The project follows the same conventional Vite `src/` organization as Eigi School.

## Project structure

- `src/pages/LandingPage/index.tsx` — page composition and navigation
- `src/pages/LandingPage/sections/` — page sections organized in named folders with `index` entry points
- `src/pages/LandingPage/sections/HeroSection/` — active and retained hero variants
- `src/pages/LandingPage/sections/FrontierSection/`, `ExpeditionSection/` — Three.js scenes and renderers
- `src/components/common/ScrollDetail/` — shared scroll effects used by page sections
- `src/hooks/usePageMotion.jsx` — landing-page motion orchestration
- `src/components/ui/` — reusable Base UI and Shadcn-style primitives
- `public/` — favicon, model, texture and asset credits

## Website and content

[Existing hosted website](https://eigi-ai-studio.pawanpatil2305.chatgpt.site/)

Pushing to `main` runs two GitHub Actions workflows: `ci.yml` validates types and builds with advisory lint reporting, and `production_fde_deployment.yml` builds the Docker image, pushes it to Docker Hub, and deploys it to EC2.

The contact links use `pawanpatil2305@gmail.com`. Portraits and capability examples are illustrative, not employee profiles or client endorsements. Portrait images are currently loaded from their external URLs in `src/pages/LandingPage/sections/TeamSection/index.tsx`.

Motion controls and reduced-motion preferences provide simpler presentations. WebGL is required for the full 3D experience.

## Assets and configuration

Third-party model and texture attribution is recorded in [public/credits.txt](public/credits.txt). Preserve those credits when redistributing the assets.

Keep credentials in ignored local environment files. Dependencies, generated build output, local tool state, and environment files are excluded from Git.

## Repository organization and release notes

- `src/theme/` — section styles, loaded in their original cascade order
- `src/pages/LandingPage/sections/HeroSection/scroll-morph-hero.tsx` — interactive AI capability cards
- `src/pages/LandingPage/sections/HeroSection/signal-hero.tsx` — default pixel hero
- `public/media/` — active alternate video hero assets
- `src/theme/archive/media/` — superseded, unimported media preserved with Git LFS and excluded from the build
- `docs/PRODUCTION.md` — release process, validation status, and remaining limitations
- `.github/workflows/ci.yml` — pull request and main branch validation
- `.github/workflows/production_fde_deployment.yml` — Docker image build, push, and EC2 deployment

See [production handoff](docs/PRODUCTION.md) before deploying. See [design specification](docs/design.md) for design history.

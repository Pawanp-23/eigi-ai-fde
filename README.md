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

Open the local URL printed by the development server (normally `http://localhost:3000`).

## Validation and production build

```sh
npm run typecheck
npm run build
```

`npm start` runs the generated Cloudflare Worker locally through Wrangler after a successful build. It does not publish the website.

## Technology

- React 19, TypeScript, Vinext and Vite
- Three.js for the interactive scenes
- Motion for scroll effects and transitions
- Tailwind CSS and Base UI components
- Cloudflare Worker build output and Sites hosting integration

This project uses Vinext with Next-compatible imports; it is not a standard Next.js deployment.

## Project structure

- `app/page.tsx` — page sections and navigation
- `app/hero-punchline.tsx`, `app/motion.jsx` — four-part animated hero
- `app/frontier-scene.js` — landscape and hologram scenes
- `app/expedition.jsx`, `app/expedition-scene.js` — tablet, orbit, tunnel and finale
- `app/scroll-detail.jsx` — SVG followers and word reveals
- `components/ui/team.tsx` — illustrative engineering-discipline marquee
- `public/` — favicon, model, texture and asset credits
- `.openai/hosting.json` — existing Sites project association

## Website and content

[Existing hosted website](https://eigi-ai-studio.pawanpatil2305.chatgpt.site/)

Hosted access is controlled by the existing Sites sharing settings. Pushing to this repository does not automatically deploy the website; GitHub Actions validates types and builds, with advisory lint reporting. No automatic deployment is configured.

The contact links use `pawanpatil2305@gmail.com`. Portraits and capability examples are illustrative, not employee profiles or client endorsements. Portrait images are currently loaded from their external URLs in `components/ui/team.tsx`.

Motion controls and reduced-motion preferences provide simpler presentations. WebGL is required for the full 3D experience.

## Assets and configuration

Third-party model and texture attribution is recorded in [public/credits.txt](public/credits.txt). Preserve those credits when redistributing the assets.

Keep credentials in ignored local environment files. Dependencies, generated build output, local tool state, and environment files are excluded from Git. The hosting configuration contains a project identifier, not a deployment credential.

## Repository organization and release notes

- `app/styles/` — section styles, loaded in their original cascade order
- `components/ui/scroll-morph-hero.tsx` — interactive AI capability cards
- `app/signal-hero.tsx` — default pixel hero
- `public/media/` — active alternate video hero assets
- `archive/media/` — superseded media preserved with Git LFS, excluded from deployment
- `docs/production.md` — release process, validation status, and remaining limitations
- `.github/workflows/ci.yml` — pull request and main branch validation

See [production handoff](docs/production.md) before deploying. See [design specification](design.md) for design history.

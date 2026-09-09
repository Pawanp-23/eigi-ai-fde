# Eigi FDE — Development Guide

Instructions for AI coding assistants (Claude Code, Codex, and others) and
developers working on the `eigi-fde` codebase.

> This file is the **single source of truth**, read by Codex and other agents.
> Claude Code reads `CLAUDE.md`, which imports this file with `@AGENTS.md`.
> **Edit `AGENTS.md`** so both remain in sync.

Preserve the site's behavior and visual direction. Ask before taking any
destructive, irreversible, publishing, or remote Git action.

## What Eigi FDE Is

Eigi FDE is the public Forward Deployed Engineering website for Eigi_ai. It is
a static React application built with Vite and includes interactive hero
variants, scroll-driven motion, Three.js scenes, light and dark themes, and
responsive content sections.

The application uses:

- React 19 and TypeScript
- Vite 8
- Tailwind CSS 4 and reusable Base UI components
- Motion for animation and scroll effects
- Three.js for interactive scenes
- OpenAI Sites configuration for the existing hosted project

## Operating Rules

These rules apply to every change in this repository.

### Preserve behavior during structural work

- Folder cleanup must not change rendering, copy, styling, animation, or
  runtime behavior.
- Update all imports, asset paths, documentation links, and configuration
  references after moving a file.
- Keep retained hero variants unless the user explicitly approves their
  removal. They exist for comparison and rollback.
- Keep the stylesheet order in `src/main.tsx` unchanged unless a visual change
  explicitly requires adjusting the cascade.
- Preserve light/dark theme behavior, reduced-motion behavior, and pause
  controls.

### Ask before destructive or outward-facing actions

Get explicit approval before deleting source or assets, rewriting Git history,
force-pushing, merging, publishing, deploying, or changing the hosted Sites
project. A successful local build does not authorize deployment.

### Do not edit generated or dependency content

Do not hand-edit or commit:

- `node_modules/`
- `dist/`
- local environment files
- temporary logs, caches, or editor state

Keep credentials out of source code and Git. The value in
`.openai/hosting.json` is a project association, not a deployment credential.

## Development Environment

Use Node.js 22.13.0 or newer, npm, and Git LFS.

```sh
git lfs install
npm ci
npm run dev
```

The local development URL is normally `http://localhost:5173`.

Useful commands:

```sh
npm run typecheck
npm run lint
npm run build
npm run format
npm start
```

`npm start` previews an existing production build. It does not publish the
website.

## Project Structure

The filesystem is canonical. Keep new files within the closest matching area.

```text
eigi-fde/
├── .github/workflows/          # CI validation
├── .openai/hosting.json        # Existing Sites project association
├── docs/                       # Design and production documentation
├── public/                     # Publicly served static assets and credits
│   ├── media/                  # Active video hero assets
│   ├── models/                 # Public 3D models
│   └── textures/               # Public scene textures
├── src/
│   ├── components/
│   │   ├── common/             # Reusable site components
│   │   │   └── ScrollDetail/
│   │   └── ui/                 # Product-agnostic UI primitives
│   ├── hooks/                  # Shared React hooks and page orchestration
│   ├── lib/                    # Shared utilities
│   ├── pages/
│   │   └── LandingPage/
│   │       ├── sections/       # Named folders with index entry points
│   │       │   ├── ExpeditionSection/
│   │       │   ├── FrontierSection/
│   │       │   ├── HeroSection/
│   │       │   ├── ParallaxSection/
│   │       │   ├── SculptureSection/
│   │       │   ├── StudioSections/
│   │       │   └── TeamSection/
│   │       └── index.tsx       # Landing-page composition
│   ├── theme/                  # Ordered site and section styles
│   │   └── archive/media/      # Retained, unimported source media
│   ├── App.tsx                 # Application shell
│   ├── index.css               # Tailwind and global tokens
│   └── main.tsx                # Application mount and CSS import order
├── AGENTS.md                   # Development guide and agent instructions
├── CLAUDE.md                   # Claude import of AGENTS.md
├── Dockerfile                  # Static production image
├── README.md                   # Repository entry point
├── package.json                # Scripts and dependencies
└── vite.config.js              # Vite and Sites configuration
```

## Architecture and Placement

### Pages and page components

`src/pages/LandingPage/index.tsx` owns page composition, navigation, preview
selection, state shared across sections, and site copy.

Landing-page UI belongs in named folders under
`src/pages/LandingPage/sections/`. Follow the Agent 360 Landing Page pattern:
each section has its own PascalCase folder and uses `index.jsx` or `index.tsx`
as its entry point. Hero variants stay together in `HeroSection/`.

Keep tightly coupled files together. For example, a React scene wrapper and its
Three.js renderer should remain in the same scene folder.

### Shared components

`src/components/common/` is for reusable site components used by multiple page
sections. `src/components/ui/` is for product-agnostic primitives. Do not put a
complete landing-page section in either folder. Reuse an existing primitive
before adding a new one, and preserve its accessibility behavior.

### Hooks and utilities

Place React hooks and page orchestration hooks in `src/hooks/`, following the
Agent 360 Landing Page convention. Put framework-independent helpers in
`src/lib/`.

### Styles

Global Tailwind setup and tokens stay in `src/index.css`. Section and visual
styles stay in `src/theme/`. The import sequence in `src/main.tsx` is an
intentional CSS cascade; do not alphabetize it.

### Assets

Files under `public/` are served from the site root. Use `/media/...`,
`/models/...`, and `/textures/...` URLs rather than source-relative imports for
those assets.

All MP4 files are tracked through Git LFS. Preserve `public/credits.txt` and
the attribution link exposed by the website. Do not recompress, replace, or
delete media as part of routine cleanup.

### Documentation

Keep the repository overview and setup instructions in `README.md`. Put design,
implementation, handoff, and production documents in `docs/`. Update
documentation whenever a referenced path or workflow changes.

## Code Conventions

- Follow the existing file naming style: kebab-case component modules and
  PascalCase React component names.
- Use the `@/` alias for shared source imports; use short relative paths for
  files inside the same page feature.
- Preserve a file's current JavaScript or TypeScript language during structural
  work. Language conversion is a separate change.
- Keep imports organized and remove references to old paths after moves.
- Use semantic HTML and retain keyboard, focus, accessible-label, and
  reduced-motion support.
- Use the configured formatter instead of manually reformatting unrelated code.
- Do not add dependencies for functionality already supported by the current
  stack.

## Validation

For any source or structural change, run:

```sh
npm run typecheck
npm run build
```

Run `npm run lint` and report its result separately. The repository currently
has known lint findings, so lint is advisory in CI until that baseline is
resolved. Use `npm run format` only when formatting is in scope, and always
review its diff afterward.

GitHub Actions installs with `npm ci`, checks TypeScript, reports lint
advisories, and builds the static site. A passing workflow validates the code;
it does not deploy it.

## Hosting and Production

The build output is static and is served from `dist/`. Preserve the Sites Vite
plugin and `.openai/hosting.json`. Do not create a new Sites project when an
existing project ID is present.

Before any approved release, read `docs/PRODUCTION.md`, pull Git LFS content,
run the validation commands, and confirm the deployment platform accepts the
active media sizes. Publishing is always a separate, explicitly approved
action.

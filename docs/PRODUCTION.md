# Production handoff

## Build and release

Use Node 22.13+ and the committed npm lockfile. Install Git LFS before cloning;
run `git lfs pull` if video files contain pointer text rather than media bytes.
Run `npm ci`, `npm run typecheck`, and `npm run build` before release.
`npm start` previews the static Vite production build. It does not deploy.

This is a conventional Vite application with static output. Keep
`.openai/hosting.json` and the Sites plugin configuration when deploying through
the existing Sites project. A GitHub
push runs validation only; it does not update the published site.

## Assets

- `public/media/` contains the active alternate video hero and poster.
- `src/theme/archive/media/` preserves superseded videos/posters as unimported source files, outside the static build.
- All MP4 files are tracked through Git LFS. No media was recompressed for this handoff.
- The alternate video is approximately 145 MB. Git LFS is source storage, not a video CDN.
  Confirm the deployment provider accepts this asset size before enabling the video
  variant in production; if necessary serve the unchanged file through object storage/CDN.
- Portraits depend on external image URLs and have an icon fallback if loading fails.
- Preserve `public/credits.txt`; confirm rights to supplied third-party footage before public release.

## Validation status and remaining work

The production build and TypeScript checks pass locally. The preceding visual review
covered desktop/mobile layout, themes, menu, card selection, and pause/reduced motion.
The file organization preserves CSS import order and all active public asset URLs.

The existing lint configuration reports errors in both scaffold UI components and
site code (including compiler recommendations and accessibility rules). CI reports
lint as advisory rather than hiding those findings. Resolve and promote it to a
required check before claiming a clean lint baseline. Build output also reports a
large client bundle; code splitting is a separate performance task.

No live deployment, real-device performance certification, or third-party asset
availability guarantee is implied by a successful build.

## Maintenance

Section CSS lives in `src/theme/`; global Tailwind setup stays in `src/index.css`.
Import order in `src/main.tsx` is deliberate. Avoid alphabetizing those imports.
Shared UI lives in `src/components/ui/`; reusable site components live in
`src/components/common/`; page-specific UI lives in named folders under
`src/pages/LandingPage/sections/`.
Retained hero variants support comparison/rollback and should not be deleted as unused code.
Keep credentials and local tool output out of Git. Use repository secrets for any future deployment workflow.

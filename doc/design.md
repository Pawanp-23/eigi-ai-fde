# Eigi_ai — Website Design Specification

Updated: 8 September 2026

## Purpose

Help prospective clients understand forward deployed engineering: Eigi_ai engineers embed with their team, understand the problem, and design, build, integrate, and deploy useful AI products and software. The site should balance clear communication with memorable visual craft.

The core promise is close collaboration from discovery through delivery. Describe the work and expected outcomes clearly; avoid unsupported claims about being the best, guaranteed results, or exceeding every expectation.

## Design status and preview

The local default now uses the interactive pixel hero with light/dark themes. The video-backed mission hero is retained at `?hero=video`; the published site has not been updated. The original landscape is available with `?hero=original`. A new engineering hero and selected copy changes are available as an opt-in local preview. This draft has not been published.

| Version                                   | Local URL                                           |
| ----------------------------------------- | --------------------------------------------------- |
| New engineering hero and revised copy     | `http://localhost:5173/?preview=hero`               |
| Previous landscape hero and original copy | `http://localhost:5173/?preview=hero&hero=original` |
| Default website                           | `http://localhost:5173/`                            |

The comparison control appears only when `preview=hero` is present. Switching versions reloads the page. Query parameters are read after client hydration, so the original hero can appear briefly before the preview loads.

The published site is https://eigi-ai-studio.pawanpatil2305.chatgpt.site/.

## Creative direction

- A restrained engineering studio: precise typography, generous space, faint grids, and clear hierarchy.
- Use immersive 3D storytelling in the existing experience sections; make the opening message understandable without scrolling.
- Use the supplied dark FDE reference for the new hero's composition: challenges on the left, an engineering core in the center, and outcomes on the right.
- Draw inspiration from Lusion's pacing and spatial transitions while retaining Eigi_ai's identity, copy, and assets.
- Keep motion purposeful. It should explain connection, transformation, and progress rather than compete with the content.

## Visual system

| Element                 | Treatment                                                                                 |
| ----------------------- | ----------------------------------------------------------------------------------------- |
| Main typeface           | Geist Sans                                                                                |
| Technical labels        | Small uppercase text with controlled tracking; Geist Mono where used by existing sections |
| Hero background         | Near-black `#0b0d0e`                                                                      |
| Hero primary text       | Off-white `#f4f4f1`                                                                       |
| Hero supporting text    | Muted gray, approximately `#a9aeb3`                                                       |
| Grid and separators     | White at roughly 7.5% opacity                                                             |
| Connections             | Warm gray and pale gold highlights                                                        |
| Existing light sections | Pale background `#f1f1f7`, dark text `#14151a`                                            |
| Existing accent         | Electric blue `#2539ff`, with lavender and teal in the 3D experience                      |
| Controls                | Compact rounded rectangles; existing sections retain their pill controls                  |
| Icons                   | Lucide, consistent thin strokes                                                           |

Use clear headings, short paragraphs, and restrained labels. Avoid dense paragraphs, redundant slogans, or decorative badges that imply verified production status.

## New hero

### Navigation

The desktop header contains the Eigi_ai / FDE wordmark, What we do, Process, Possibilities, Experience, motion control, and Talk to us. On phones, show the wordmark, motion control, and Menu button; use the existing expanded menu.

### Main message

**Your hardest problems.**
**Our engineers, deployed.**

Supporting copy:

> We embed with your team to design, build, and deploy AI products, software, and systems that work.

Primary action: **Deploy an engineer** — opens the configured email contact.
Secondary action: **Explore the possibilities** — moves to the capability concepts.

Process line: Understand · Design · Build · Integrate · Deploy.

Desktop supporting statement: **Built for the future. Available today.** This statement is hidden below the current 1050px breakpoint to preserve space.

### Engineering diagram

| Challenges      | Engineering core                 | Outcomes       |
| --------------- | -------------------------------- | -------------- |
| Idea            | Engineers, embedded              | AI product     |
| Data            | Eigi_ai                          | Automation     |
| Workflow        | Turning complexity into progress | Platform       |
| Existing system |                                  | Working system |
| Hard problem    |                                  |                |

The core uses layered translucent HTML/CSS planes with perspective and a slow rotation. It is a lightweight CSS 3D illustration, not a photorealistic WebGL glass model. SVG curves carry subtle moving light segments between the cards and core.

Outcome descriptions explain intended capabilities. They are not customer case studies or evidence of currently live deployments.

Closing line: **Engineers on your team. From day one.**

## Page structure and copy placement

| Section                    | Purpose                                                     | Preview wording                                        |
| -------------------------- | ----------------------------------------------------------- | ------------------------------------------------------ |
| Engineering hero           | Explain the service and invite contact                      | Your hardest problems. Our engineers, deployed.        |
| Our approach               | Connect client ambition to implementation                   | The space between ambition and execution.              |
| Disciplines                | Explain the skills behind the work                          | Human ingenuity.                                       |
| Possibilities              | Show illustrative systems and their workflows               | Knowledge, connected. / Operations, reimagined.        |
| Expertise                  | Explain discovery, integration, engineering, and deployment | Areas of expertise.                                    |
| Method                     | Explain collaboration through delivery                      | Turn your vision into reality that runs your business. |
| 3D experience introduction | Introduce the tablet-to-world journey                       | Give your big idea the website it deserves.            |
| 3D experience              | Orbit, tunnel, and closing invitation                       | Existing storytelling preserved                        |
| Eigi_ai team section       | Present engineering disciplines                             | Illustrative portraits, not staff profiles             |
| Contact                    | Provide a direct next step                                  | Have a challenge in mind?                              |

The website-specific phrase belongs in the tablet introduction. Eigi_ai's overall service remains broader than website development.

Only the hero, approach heading, method heading, and experience introduction wording change in the new preview. The previous comparison retains their original wording.

## Existing hero and 3D experience

The original hero contains a landscape, astronaut, floating objects, and a changing particle form. Its four scroll-driven punchlines are:

1. Your mission.
2. Our engineers.
3. Closer to the problem.
4. Faster to the deployed solution.

Character reveals use staggered opacity and vertical movement. Reading windows separate the phrases. The later page retains the holographic disciplines section, scroll-following SVG ribbons, word reveals, expertise cards, tablet-to-space transition, orbit, tunnel flight, and astronaut finale.

## Motion and accessibility

- New hero connections use a five-second linear signal loop; the core drifts over twelve seconds.
- Pause stops the new hero's CSS animation and continues to control the existing page's motion state.
- Honor `prefers-reduced-motion`; the new hero removes animation and transitions under that preference.
- Preserve semantic headings, keyboard-operable controls, visible focus indicators, and descriptive navigation labels.
- Keep the diagram's textual information available independently of decorative SVG and glass layers.
- Do not animate React state every frame. Use CSS, Motion values, or the existing animation loop as appropriate.
- Avoid adding another global smooth-scroll controller; it could interfere with the existing pinned scenes and anchor navigation.

## Responsive behavior

- Desktop: horizontal challenge → core → outcome composition.
- At 1050px and below: tighter spacing and a smaller core; hide the supporting promise.
- At 700px and below: stack challenge cards, core, and outcome cards. Hide the horizontal SVG connections, stack CTA buttons, and expose the menu control.
- Keep text readable and controls at least 44px tall where practical.
- Check long headings and translated copy for overflow rather than shrinking everything to fit.

## Content and brand constraints

- Use Eigi_ai branding; remove third-party template branding when incorporating components.
- Do not invent clients, endorsements, staff identities, project counts, awards, or business results.
- Label concepts and illustrative portraits honestly.
- Preserve asset attribution in `public/credits.txt`.
- Contact: `pawanpatil2305@gmail.com`. Contact buttons use mailto links; no scheduling or submission backend is implied.
- Do not replace the broader site design or publish the experimental hero until the user has reviewed it.

## Implementation map

| File                                                | Responsibility                                                                 |
| --------------------------------------------------- | ------------------------------------------------------------------------------ |
| `src/pages/LandingPage.tsx`                         | Page composition, preview selection, navigation, section copy, contact actions |
| `src/components/engineering-hero.tsx`               | Experimental engineering hero and diagram                                      |
| `src/theme/engineering-hero.css`                    | Scoped hero styles, responsive rules, CSS motion, comparison control           |
| `src/components/hero-punchline.tsx`                 | Original hero's four punchlines                                                |
| `src/theme/hero-punchline.css`                      | Original hero typography and chapter presentation                              |
| `src/components/motion.jsx`                         | Shared page motion, original hero progression, text effects                    |
| `src/components/frontier` and related scene modules | Existing 3D landscape and holographic rendering                                |
| `src/components/studio-sections`                    | Disciplines, capability marquee, expertise presentation                        |
| `src/components/scroll-detail.jsx`                  | Scroll word reveals and SVG ribbons                                            |
| `src/components/expedition.jsx`                     | Tablet, orbit, tunnel, and finale sequence                                     |
| `src/components/ui/team.tsx`                        | Illustrative discipline portraits                                              |
| `src/main.tsx`                                      | Application mount and stylesheet imports                                       |

The app uses React, TypeScript, Vite, Three.js, Motion, Tailwind, and Lucide. Follow the existing stack; the new hero adds no dependency.

## Local review and rollback

```sh
npm install
npm run dev -- --host 0.0.0.0
npx tsc --noEmit --incremental false
npm run build
```

Open the preview links above. Local links work only while the development server is running on this computer.

For an immediate visual rollback, select **Previous hero** or remove the preview query parameters. The original hero is retained in the source. The pre-preview Git checkpoint is `1097ede3bcce21e2838311a4a568025febe36c5a`; review subsequent changes before restoring files, so unrelated work is not lost.

### Verification recorded for this draft

- TypeScript check passed.
- Production build passed, with existing large-chunk and route-classification warnings.
- Browser confirmed the new hero, revised copy, contact target, pause behavior, and previous-hero switch.
- No horizontal page overflow was detected at tested desktop and 390px phone widths.
- Browser error inspection returned no errors during the new hero check.
- Browser screenshots were partially clipped by the capture surface; this was not a comprehensive cross-browser or pixel-perfect visual audit.

Before publishing, review the complete page on physical mobile hardware, confirm section transitions and focus behavior, and obtain approval for the new direction. Publishing and pushing this draft are separate from local preview work.

## Video mission hero — 7 September 2026

The local default hero keeps the four character-reveal punchlines and replaces its landscape background with two silent clips. Engineers play first. Scroll progress from 38% to 54% crossfades to PAL; reverse scrolling restores the engineers clip. Playback runs at native speed rather than seeking on every scroll event.

- Engineers: supplied 1920×1080, 24 fps, 10 seconds. Video stream preserved; audio removed. Web file: about 5.5 MB.
- PAL: supplied 3840×2160, approximately 23.98 fps, 60.1 seconds. Web version: 1920×1080 H.264, approximately 20.3 MB, audio removed.
- No 90 fps claim: both sources are approximately 24 fps. Display refresh and animation frame rates depend on the device.
- MP4 fast-start enabled; JPEG posters included. Second clip uses metadata preloading and begins playback before its reveal.
- Shared pause, reduced-motion preference, offscreen detection, and tab visibility control playback. Poster imagery remains if autoplay is unavailable.
- New files: `src/components/hero-video.tsx`, `src/theme/hero-video.css`, and `public/media/`.
- Local preview: `http://localhost:5173/`. Landscape comparison: `http://localhost:5173/?hero=original`.
- This update is prepared locally; deployment is a separate action.

### 4K quality revision

The active hero now references `engineers-4k.mp4` and `pal-hero-4k.mp4`. PAL preserves the original 3840×2160 video stream without video re-encoding; only audio is removed and MP4 fast-start metadata is added. Engineers is upscaled from 1920×1080 to 3840×2160 with Lanczos and encoded as H.264 at CRF 17, slow preset. This is an upscale, not native 4K detail. Native frame rates remain unchanged. New posters are also 4K. The saturation filter is removed to preserve the footage's colors; readability overlays remain. Earlier 1080p exports remain in the folder but are not selected by the hero. Larger media requires checking the hosting platform's per-file limit or serving video from suitable media storage before deployment.

## Executive feedback refinement

A shared paper/charcoal/slate-blue palette replaces competing teal, pink, yellow, and purple accents. Original 4K video files are unchanged. Header and primary sections share a 5% desktop gutter; capability cards align along a common top edge.

Capability text bands are static. Portrait motion starts paused and remains user-controlled. Character/word travel is shorter. Expertise cards use time-based damping, smaller tilt and hover lift, and a single scroll-drawn ribbon; pause/reduced motion exposes readable card fronts. The 3D experience retains its narrative but reduces ambient speed, camera roll, field-of-view change, speed effects, and neon lighting.

## Current preview: single film, glass navigation, greeting

Supersedes the two-clip hero above. `bcg-hero-4k60.mp4` is the only active hero video: 3840�2160 at 60 fps, silent, looping, object-fit cover across the viewport. Source is 1920�1080 at 24 fps, 38.13 seconds. Lanczos scaling and scene-aware frame interpolation generate the higher resolution/frame rate; this is not native 4K detail or native 60 fps. Frame blending may be visible in fast motion. Export size is 144,621,147 bytes; external media delivery is needed before deploying to a host with smaller per-file limits. Originals remain available for rollback.

Expertise cards have slow independent vertical drift and staggered scroll-driven turns. Motion pause/reduced-motion keeps readable fronts. The fixed frosted header uses the supplied unmodified eigiLogo.ico with eigi.ai text, a translucent charcoal surface and 22px blur. Navigation stays grouped inside the header at all scroll positions.

The closing scene uses a new articulated, rounded-shell robot, with a restrained shoulder/forearm wave and a silent text greeting. The original unrigged astronaut remains in the orbital journey. The ending has fewer particles and separates desktop text from the character. Shared motion pause stops the wave.

Build passes. Local preview only; these changes have not been published.

Current polish revision: the original astronaut is retained for the entire journey, including a procedural sleeve/shoulder wave in the closing scene. This supersedes the replacement robot above. Bloom and key/rim lighting are reduced. Expertise cards scale to viewport width, with independent slow drift. The experience label and heading have separate vertical spacing; the approach mark reads eigi.ai.

## September 8 handoff

The default page now includes AI capability card morphing, a skills ribbon, neutral expertise surfaces, and bounded parallax. Section styles are under `src/theme/`; the import order in `src/main.tsx` remains unchanged. Historical implementation notes above describe retained variants as well as the earlier design. See `PRODUCTION.md` for current deployment and validation details.

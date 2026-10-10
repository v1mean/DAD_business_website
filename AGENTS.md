<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project UI and Design Rules

Before implementing or modifying any user interface, read `DESIGN.md` in the project root.

## Design requirements

* Treat `DESIGN.md` as the primary visual design reference.
* Follow its color palette, typography, spacing, component styles, borders, shadows, and layout principles.
* Keep all pages visually consistent.
* Adapt the reference to an electronics product catalog; do not copy another company's branding, logo, or proprietary assets.
* Avoid generic AI-generated layouts and unnecessary decorative gradients.
* Prioritize clear product photography, readable specifications, and intuitive navigation.

## Project requirements

* Preserve the existing project architecture and working features.
* Support both website languages.
* Support optional product price display.
* Represent inventory using the agreed product/model tracking approach.
* Provide a Telegram contact option.
* Keep the catalog simple and suitable for a small number of products.
* Ensure the website works on mobile and desktop.

## Implementation workflow

* Inspect the existing code before proposing changes.
* Explain the implementation plan before making significant changes.
* Ask for approval before the first implementation.
* Reuse existing components and dependencies when practical.
* Do not introduce a new framework or styling library without a clear reason.
* Test the completed UI and report any remaining issues.



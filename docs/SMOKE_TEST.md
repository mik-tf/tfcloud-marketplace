# Smoke Testing & Local Development

This document outlines how to run and test the **tfcloud-marketplace** project locally.

## Prerequisites

- Node.js (>=14)
- npm
- npx (included with npm)

## Makefile Commands

We've included a `Makefile` at the project root. From the repository root, run:

```bash
make help       # List available targets
make dev        # Install deps & start Vite dev server (frontend)
make build      # Install deps & build production assets
make preview    # Preview production build with Vite
make smoke      # Build & serve production build for smoke testing
```

## Smoke Test

1. Run:
   ```bash
   make smoke
   ```
2. After build, a static server will serve `dist/` (default port 5000).
3. Open `http://localhost:5000` in your browser.
4. Navigate to key routes (e.g. `/dashboard`, `/docs`) to verify SPA fallback.

## Notes

- The CI workflow copies `index.html` to `404.html` for GitHub Pages SPA fallback.
- To preview on a custom port, you can also:
  ```bash
  cd frontend
  vite preview --port 1234
  ```

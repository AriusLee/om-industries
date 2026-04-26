# This is NOT the Next.js you know

This version (Next 16) has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code.

Key things to remember in this codebase:
- `params` in route segments is a **Promise** — `await` it.
- `fetch` is **not** cached by default. Use `'use cache'` + `cacheLife()` if caching is needed.
- Default bundler is Turbopack. `next build` no longer auto-runs the linter.
- Public site is light-mode only. Brand tokens in `src/app/globals.css` follow the OM `:root` palette.
- Backend API base URL is read from `process.env.OM_API_URL` (server-side only).

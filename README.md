# The Move — Our Relocation Explorer

Interactive React (Vite + TypeScript + Tailwind) explorer of the relocation research (report dated 10 Oct 2026).
All data lives in `src/data/places.ts`.

    npm install
    npm run dev      # local dev
    npm run build    # static build to dist/ (relative paths, hash routing)

Routes: `#/`, `#/history`, `#/places`, `#/places/:id`, `#/map`, `#/compare`, `#/scorecard`, `#/food`, `#/notes`, `#/credits`.
Prices are "as of" their dates and should be re-verified; drive times are no-traffic estimates.
Photos: Wikimedia Commons (see `#/credits`). Map tiles © OpenStreetMap contributors.

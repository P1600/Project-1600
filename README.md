# Project1600 v0.7

Major update: personalized onboarding + data-driven Home dashboard.

## New in v0.7
- SAT / PSAT / first-SAT onboarding paths
- Previous score, Math, Reading & Writing, and test-date entry
- Score-report-style domain strength sliders
- Target score slider
- Short diagnostic tailored to lower reported domains
- Persistent profile data in localStorage
- SAT skill radar chart
- Real-score history line chart (no fabricated SAT scores)
- Domain strength bars
- Home dashboard connected to practice/profile data
- Original blue Project1600 visual identity preserved

## Run
npm install
npm run dev

## Build
npm run build

## v0.7 adaptive skill graphic
- Radar profile rotated 22.5° so the octagon sits on a flat top edge.
- Current skill dots and polygon animate outward from the center when the graphic appears or the profile updates.
- Added a dashed target-range outline and simplified blue/white visual treatment.
- No chart dependency was added; the graphic is native SVG.

# Wagon Allocation Planner

Internal web app to allocate store rack-lift requirements across delivery wagons from an uploaded Excel file.

## Features

- Excel upload (`.xlsx` / `.xls`)
- Parsing rules:
  - Column A = store number
  - Row 1 = rack type headers
  - Blank rows ignored
  - Blank quantities treated as zero
- Data preview after parse
- Configurable allocation settings:
  - Number of wagons
  - Target lifts per wagon (default `93`)
  - Max rack types per wagon (default `5`)
  - Optional final-wagon rack type overflow
- Greedy allocation engine:
  - Sort stores by total lifts ascending
  - Fill wagons sequentially
  - Respect rack type constraints while filling
  - Push residual stores to final wagon when needed
- Results UI includes:
  - Per-wagon stores
  - Total lifts per wagon
  - Rack types per wagon
  - Under/overfill warnings
- XLSX export with two sheets:
  - `Detailed Allocation`
  - `Wagon Manifest Summary`

## Run locally

Because this is a browser app using ES modules, run through a local web server:

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

## File structure

- `index.html` — app shell and controls
- `src/main.js` — orchestration/event handling
- `src/parser.js` — Excel parse + validation
- `src/allocation.js` — greedy allocation logic
- `src/exporter.js` — XLSX output generation
- `src/ui.js` — rendering helpers
- `src/styles.css` — app styling

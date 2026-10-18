# Finavi

A private money app for people with income that changes week to week: seasonal
farm work, packing houses, rideshare, construction, day labor.

Everything runs on the device. No accounts, no names, no tracking. All data is
stored in the browser's local storage and can be exported or erased at any time.

## What's inside

| Area           | Route             | What it does                                                       |
| -------------- | ----------------- | ------------------------------------------------------------------ |
| Home           | `/`               | Financial ladder: Survive → Stabilize → Grow → Build Wealth        |
| Benefits       | `/plan/benefits`  | Anonymous Washington benefits screening                            |
| Trap Detector  | `/plan/trap`      | Real APR for payday, installment, revolving and rent-to-own offers |
| Harvest Budget | `/plan/budget`    | Seasonal income smoothing, bills, reserve, taxes, coach            |
| Weekly plan    | `/plan/week`      | Dated cash-flow timeline, protected cash, early shortfall warnings |
| Work offers    | `/plan/work`      | Compare actual hourly take-home after costs and unpaid time        |
| Money practice | `/learn/practice` | Applied bilingual financial decisions with explanations            |
| Emergency fund | `/plan/emergency` | Starter $500 cushion tracker                                       |
| Dream Jars     | `/goals/jars`     | Named savings goals                                                |
| Tandas         | `/tandas`         | Savings-circle planner and tracker                                 |
| Learn          | `/learn`          | Credit 101 course, investing practice, tandas, college aid         |
| Settings       | `/settings`       | Language, export/import, erase data                                |

Full English / Español support across every screen.

## Layout

```
src/
  components/   AppShell, Ladder, Logo, ui-kit (shared UI primitives)
  data/         Bilingual translations and static content: programs, credit course, presets, market data
  lib/          i18n, local store, finance + harvest math, error reporting
  routes/       File-based routes (TanStack Start)
```

## Development

```sh
npm i
npm run dev
```

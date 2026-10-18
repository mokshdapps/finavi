- Define language and financial React contexts in separate non-component modules and retain their identity through Vite hot data; edits to contexts, providers or hooks must not disconnect mounted consumers.
- Keep financial calculation helpers pure and browser-safe, with regression tests beside them; this allows deterministic validation without transmitting user data.
- Bridge budget and tanda commitments into the dated timeline only through explicit user confirmation and stable source IDs; monthly estimates must not silently change cash or payment records.
- Keep debt payoff comparisons transient and separate from saved plans; estimates do not imply a verified repayment obligation or available surplus.
- Validate both imported backups and browser-saved data through the shared saved-data parser; this preserves older data and prevents divergent import behavior.
- Normalize newly added collection fields at the live store boundary as well as saved-data loading; mounted pre-update state must remain usable without clearing existing entries.
- Coaching is computed locally from the financial plan, never through a remote model; this preserves Finavi's device-only financial-data boundary.

- Keep English and Spanish copy in `src/data/translations/`; the shared language provider handles formatting and switching so page code stays concise.
- Use `BrandIcon` for product illustrations and navigation, and Lucide for familiar tool actions so the custom visual language remains consistent.
- Read renamed browser-storage keys through `readSavedValue` so existing users retain their saved financial data and language preference.
- Keep TanStack route filenames aligned with their URLs; use descriptive names for ordinary components and libraries so navigation stays predictable.

- Home is a URL-addressable journey workspace; shared tool views live in components/workspace and existing tool URLs remain thin wrappers so editing and saved state use one implementation. Home, Plan, Goals and Learn indexes render the same journey with stage-specific entry points rather than separate directories.
- The shared shell contains only brand and utility controls; Home owns quick actions and progressively revealed journey stages so task views do not compete with global navigation.
- Keep the planning-only progress score separate from financial forecasts so recording information never implies financial security.
- Monthly breathing-room projections derive from entered seasonal income, tax assumptions and monthly bills, preserving unknown months; projections never mutate actual cash or payment records.

- Check-ins are saved only by explicit user action, once per calendar day; readiness measures entered planning foundations rather than financial health.
- Saved debt entries are distinct from transient payment allocations and loan-cost simulations; no allocation marks a debt paid or changes cash.
- Benefits guidance avoids combined dollar awards and unverified thresholds; income illustrations expose only known deduction assumptions and direct users to official determinations.
- Reminders run locally on app visits, with optional calendar export; no remote notifications, feedback submission or financial-data sharing is implied.

- Reuse one walkthrough player before money setup and on Help, selecting the video and optional caption track by language and resolving hosted asset pointers against the public origin; defer loading until play, start captions disabled and use the edit's native pace so the branded opening and bilingual timing stay aligned.
- Journey actions may deep-link to a tool tab; shared page back controls return to the previous in-app screen with a direct-entry fallback so tool visits remain part of the path.

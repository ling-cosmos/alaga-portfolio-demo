# Original Alaga portfolio deployment

This fork hosts the original Expo web interface and Node/PostgreSQL API. It does not use the separate simplified portfolio simulation.

Production project: `alaga-portfolio` in the owner's Vercel account. Configure server-only `ALAGA_DATABASE_URL` with the restricted `alaga_api` role, `PORTFOLIO_DEMO=true` at runtime, and `EXPO_PUBLIC_PORTFOLIO_DEMO=true` at build time. The dedicated variable takes precedence over the Neon integration's administrator `DATABASE_URL`; normal local development still supports `DATABASE_URL`. Never expose database URLs through an `EXPO_PUBLIC_` variable. Run the original database migrations with a separate administrator connection before deploying.

The demo entry creates a unique synthetic account, patient, medicine, and six-hour session for each visitor. Existing PostgreSQL row-level security isolates visitors' edits. Standard registration and password sign-in are disabled in this deployment. The original native app keeps its normal authentication when the demo flag is absent. Use fictional information only. Native reminders are not demonstrated by the browser; paid model services are not configured. The original local assistant rules remain available.

Build with `EXPO_PUBLIC_PORTFOLIO_DEMO=true npx expo export --platform web`. Deploy with `vercel deploy --prod`. For a local web check, build first, set the test `DATABASE_URL` and `PORTFOLIO_DEMO=true`, then run `node --import tsx scripts/servePortfolio.ts`. The exported interface and real API run together at `http://127.0.0.1:4186`.

The owner approved the Neon integration and its Free database. Original migrations are applied in the dedicated demo database, and the restricted runtime role passed the visitor-isolation test against Neon. Verify `/api/health`, demo entry, dose recording, and persistence on the public URL before linking it as ready. Local credential preparation files under `.tmp/` and all `.env*` files are excluded from both Git and deployment uploads.

The web editor uses accessible HTML date/time fields; creating a fictional medicine at 09:30 starting November 11 and reloading the public app verified schedule persistence. The OCR worker uses writable temporary storage and bundled English trained data, avoiding model downloads at request time. Photo imports are limited to 2 MB in this hosted demo and have a 45-second client timeout. The parser keeps blank-line-separated instructions attached to their medicine and respects AM/PM without adding an extra clock time. All OCR fields still require review before saving.

Validation: TypeScript and a clean web export pass; 35 focused OCR, image-type, and localization tests pass. Expo Doctor passes 20 of 21 checks, with only four existing Expo SDK patch versions behind the registry recommendation. Android/iOS devices and native notification delivery were not physically exercised for these hosting changes.

Public verification on November 10, 2026 also passed the real OCR endpoint with `assets/synthetic-ocr-label.png`: it preserved the fictional label text and extracted exactly `08:00` and `20:00` in approximately 4.2 seconds. Public dose recording, persistence, visitor isolation, and browser medicine creation were verified separately.

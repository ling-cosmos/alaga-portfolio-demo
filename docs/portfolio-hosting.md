# Original Alaga portfolio deployment

This fork hosts the original Expo web interface and Node/PostgreSQL API. It does not use the separate simplified portfolio simulation.

Production project: `alaga-portfolio` in the owner's Vercel account. Configure `DATABASE_URL` with the restricted `alaga_api` role, `PORTFOLIO_DEMO=true` at runtime, and `EXPO_PUBLIC_PORTFOLIO_DEMO=true` at build time. Never expose database URLs through an `EXPO_PUBLIC_` variable. Run the original database migrations with a separate administrator connection before deploying.

The demo entry creates a unique synthetic account, patient, medicine, and six-hour session for each visitor. Existing PostgreSQL row-level security isolates visitors' edits. Standard registration and password sign-in are disabled in this deployment. The original native app keeps its normal authentication when the demo flag is absent. Use fictional information only. Native reminders are not demonstrated by the browser; paid model services are not configured. The original local assistant rules remain available.

Build with `EXPO_PUBLIC_PORTFOLIO_DEMO=true npx expo export --platform web`. Deploy with `vercel deploy --prod`. For a local web check, build first, set the test `DATABASE_URL` and `PORTFOLIO_DEMO=true`, then run `node --import tsx scripts/servePortfolio.ts`. The exported interface and real API run together at `http://127.0.0.1:4186`.

The Neon Free database still requires the owner to complete Vercel's marketplace acceptance before public API verification. Do not advertise the deployment as working until `/api/health`, demo entry, dose recording, and persistence pass on its public URL. The verified local database is disposable and is not a hosted database.

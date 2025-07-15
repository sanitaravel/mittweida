# Endpoint strategy

Based on your workspace structure and the contents of the src directory, the application appears to be related to route selection, guided tours, mapping, notifications, and user settings, with translations for multiple languages. Here are the likely backend endpoints you will need to support the frontend features:

## 1. Routes & Navigation

- `GET /routes` — Fetch all available routes.
- `GET /routes/:id` — Fetch details for a specific route.

## 2. Guided Tours

- `GET /tours` — List available guided tours.
- `GET /tours/:id` — Get details for a specific tour.
- `POST /tours/:id/complete` — Mark a tour as completed for a user.

## 3. Translations (if dynamic)

- `GET /translations/:lang` — Fetch translations for a given language (if not fully static).

## 4. Miscellaneous

- `GET /features` — List available features (for `FeatureChip`).
- `GET /story/:id` — Fetch story content for a route or tour.

Let me know if you want a more detailed API specification or want to start scaffolding the backend project.
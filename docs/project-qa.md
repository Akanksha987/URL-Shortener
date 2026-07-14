# URL Shortener Project Q&A

## 60-90 Second Pitch

I built a URL Shortener backend API using Node.js, Express, TypeScript, Prisma, PostgreSQL, and JWT authentication. The project solves the problem of sharing long links by allowing users to create short links, manage their own links, use custom aliases, and track basic click analytics. I focused on making it deployment-ready with validation, clean error handling, environment-based config, database migrations, and Render/Docker deployment support.

## Architecture

Client or Postman sends requests to the Express API. Auth routes handle signup, login, profile, refresh token, and logout. URL routes handle creating, listing, and deleting links for authenticated users. The public redirect route resolves a short code or custom alias, records analytics, increments click count, and redirects to the original URL. Prisma handles database access to PostgreSQL.

## Data Model

- `User`: stores account details and owns short URLs.
- `ShortUrl`: stores original URL, short code, custom alias, expiry, active status, and click count.
- `Analytics`: stores click events for a short URL.
- `RefreshToken`: stores refresh tokens for session renewal.

## Why This Tech Stack?

- Express is simple and fast for REST APIs.
- TypeScript catches errors before deployment.
- Prisma makes database queries type-safe and keeps migrations organized.
- PostgreSQL is reliable for relational data such as users, URLs, and analytics.
- JWT is useful for stateless API authentication.
- Zod gives clear request validation errors.

## Important Edge Cases Handled

- Duplicate email signup is rejected.
- Invalid login returns a safe generic error.
- Custom alias conflicts are rejected.
- Expired or inactive short URLs do not redirect.
- Missing or invalid access tokens are rejected.
- Invalid request bodies return validation errors.

## Possible Improvements

- Add rate limiting to protect public redirects and auth routes.
- Add QR code generation.
- Add advanced analytics such as device, country, and browser parsing.
- Add a frontend dashboard.
- Add password-protected short URLs.
- Add automated tests.

## Interview-Ready Explanation Of Redirect Flow

When a user opens `/:code`, the API checks whether the code matches either `shortCode` or `customAlias`. If the URL exists, is active, and has not expired, the API increments the click counter, stores an analytics record with IP, user agent, and referer, then sends an HTTP redirect to the original URL.

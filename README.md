# URL Shortener API

A deployment-ready backend API for shortening long URLs, tracking clicks, and managing user-owned links.

## Problem

Long URLs are hard to share, remember, and track. This API lets authenticated users create short links, optionally use custom aliases, redirect visitors to the original URL, and view basic click analytics.

## Features

- User signup, login, logout, profile
- JWT access tokens and refresh tokens
- Password hashing with bcrypt
- Create, list, and delete short URLs
- Custom aliases such as `/portfolio`
- Public redirect route such as `/abc1234`
- Click count and analytics history
- URL expiry support
- Request validation with Zod
- PostgreSQL database with Prisma ORM
- Production config for Render/Docker deployment

## Tech Stack

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT
- Zod
- bcrypt

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from `.env.example` and fill the values:

```bash
cp .env.example .env
```

3. Run database migrations:

```bash
npm run db:migrate
```

4. Start the dev server:

```bash
npm run dev
```

The API runs at `http://localhost:3000` by default.

## Environment Variables

| Variable | Required | Example |
| --- | --- | --- |
| `DATABASE_URL` | Yes | `postgresql://user:pass@host:5432/url_shortener?schema=public` |
| `JWT_SECRET` | Yes | `change-this-access-token-secret` |
| `JWT_REFRESH_SECRET` | No | `change-this-refresh-token-secret` |
| `BASE_URL` | Yes in production | `https://your-app.onrender.com` |
| `CORS_ORIGIN` | No | `*` or `https://your-frontend.com` |
| `PORT` | No | `3000` |
| `NODE_ENV` | No | `production` |

## API Endpoints

### Health

```http
GET /health
```

### Auth

```http
POST /api/auth/signup
POST /api/auth/login
POST /api/auth/refresh-token
POST /api/auth/logout
GET /api/auth/profile
```

Signup body:

```json
{
  "name": "Akanksha Agrawal",
  "email": "akanksha@example.com",
  "password": "password123"
}
```

Login body:

```json
{
  "email": "akanksha@example.com",
  "password": "password123"
}
```

Use the returned access token as:

```http
Authorization: Bearer ACCESS_TOKEN
```

### URLs

```http
POST /api/urls
GET /api/urls
DELETE /api/urls/:code
GET /:code
```

Create URL body:

```json
{
  "originalUrl": "https://example.com/a/very/long/url",
  "customAlias": "demo-link",
  "title": "Demo Link",
  "description": "A sample short link"
}
```

The response includes a full `shortUrl` using `BASE_URL`.

### Analytics

```http
GET /api/analytics/:code
```

Returns the stored URL, total clicks, and individual click events.

## Deploy On Render

1. Push this repository to GitHub.
2. Create a PostgreSQL database on Render or use any hosted PostgreSQL provider.
3. Create a new Render Web Service from this repository.
4. Use these commands:

```bash
Build Command: npm install && npm run build
Pre-Deploy Command: npm run deploy:migrate
Start Command: npm start
```

5. Add environment variables:

```text
DATABASE_URL=your_postgres_url
JWT_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
BASE_URL=https://your-render-service.onrender.com
CORS_ORIGIN=*
NODE_ENV=production
```

6. Open `/health` after deployment to verify the server is running.

This repo also includes `render.yaml`, so Render can detect the service configuration automatically.

## Demo Flow

1. Signup a user.
2. Login and copy the access token.
3. Create a short URL with `POST /api/urls`.
4. Open the returned `shortUrl` in the browser.
5. Check `GET /api/analytics/:code` to show click tracking.

## Scripts

```bash
npm run dev             # Start local development server
npm run build           # Generate Prisma client and compile TypeScript
npm start               # Run compiled production server
npm run deploy:migrate  # Apply migrations in production
npm run db:migrate      # Create/apply migrations locally
npm run typecheck       # Type-check without emitting files
```

## Project Status

Deployment-ready backend MVP is complete. A frontend can be added later, but the backend is already suitable for a placement project demo using Postman, Thunder Client, or a simple browser redirect test.


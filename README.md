# Inkwell

A full-stack blog platform with a dedicated REST API backend and two separate React frontends — one for readers and one for authors. Built as part of [The Odin Project](https://www.theodinproject.com/) curriculum.

**Live Demo**
- Reader Frontend: https://ink-well-alpha.vercel.app
- Author Frontend: https://inkwell-author.vercel.app
- API: https://inkwell-api-4qi0.onrender.com

---

## Architecture

Inkwell is a monorepo with three independent applications:

```
InkWell/
├── api/                  # Node.js + Express REST API
├── reader-frontend/      # React app for public readers
└── author-frontend/      # React app for authors (role-locked)
```

- **Backend:** Node.js, Express v5 (ESM), Prisma ORM, PostgreSQL (Neon)
- **Frontend:** Vite + React, Tailwind CSS v4
- **Auth:** JWT via `Authorization: Bearer <token>` header, stored in `localStorage`
- **Database:** PostgreSQL hosted on Neon

---

## Rate Limiting

Auth routes (`/api/v1/auth`) are limited to **20 requests per 15 minutes** per IP to protect against brute-force attacks. Public read routes (`/api/v1/posts`) are limited to **200 requests per 15 minutes** per IP.

Exceeded limits return `429 Too Many Requests`.

## Getting Started

### Prerequisites

- Node.js v18+
- A PostgreSQL database (Neon recommended)

### 1. Clone the repo

```bash
git clone https://github.com/xsupremeyx/InkWell.git
cd InkWell
```

### 2. Set up the API

```bash
cd api
npm install
```

Create a `.env` file:

```env
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
PORT=3000
JWT_SECRET=your_strong_random_secret
CLIENT_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174
```

Run database migrations and generate the Prisma client:

```bash
npx prisma migrate deploy
npx prisma generate
```

Start the API:

```bash
npm run dev
```

### 3. Set up the Reader Frontend

```bash
cd reader-frontend
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

```bash
npm run dev
```

### 4. Set up the Author Frontend

```bash
cd author-frontend
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

```bash
npm run dev
```

---

## Database Schema

```prisma
enum Role {
  AUTHOR
  READER
}

model User {
  id        Int       @id @default(autoincrement())
  username  String    @unique
  password  String
  role      Role      @default(READER)
  createdAt DateTime  @default(now())
  posts     Post[]
  comments  Comment[]
}

model Post {
  id        Int       @id @default(autoincrement())
  title     String
  content   String
  published Boolean   @default(false)
  authorId  Int
  author    User      @relation(fields: [authorId], references: [id])
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  comments  Comment[]
}

model Comment {
  id        Int      @id @default(autoincrement())
  content   String
  postId    Int
  userId    Int
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  user      User     @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

## API Reference

Base URL: `/api/v1`

All protected routes require an `Authorization` header:
```
Authorization: Bearer <token>
```

Error responses follow a consistent shape:
```json
{
  "errors": [
    { "field": "username", "message": "Username already exists" }
  ]
}
```

---

### Authentication

#### `POST /auth/register`
Create a new reader account.

**Access:** Public

**Request body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response `201`:**
```json
{
  "message": "User created successfully",
  "user": {
    "id": 1,
    "username": "johndoe"
  }
}
```

**Error `409`** — username already taken.

---

#### `POST /auth/login`
Log in and receive a JWT.

**Access:** Public

**Request body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response `200`:**
```json
{
  "token": "eyJhbGci...",
  "user": {
    "id": 1,
    "username": "johndoe",
    "role": "READER"
  }
}
```

**Error `401`** — invalid credentials.

---

#### `GET /auth/me`
Get the currently authenticated user.

**Access:** Authenticated

**Response `200`:**
```json
{
  "user": {
    "id": 1,
    "username": "johndoe",
    "role": "READER"
  }
}
```

---

#### `PATCH /auth/change-password`
Change the authenticated user's password.

**Access:** Authenticated

**Request body:**
```json
{
  "currentPassword": "string",
  "newPassword": "string"
}
```

**Response `200`:**
```json
{
  "message": "Password changed successfully"
}
```

**Error `401`** — current password incorrect.  
**Error `400`** — new password is the same as the current password.

---

### Posts

#### `GET /posts`
Get all published posts, ordered newest first. Includes author username.

**Access:** Public

**Response `200`:**
```json
{
  "message": "Posts retrieved successfully",
  "posts": [
    {
      "id": 1,
      "title": "My First Post",
      "content": "<p>Hello world</p>",
      "published": true,
      "authorId": 2,
      "createdAt": "2026-06-17T12:00:00.000Z",
      "updatedAt": "2026-06-17T12:00:00.000Z",
      "author": {
        "id": 2,
        "username": "janedoe"
      }
    }
  ]
}
```

---

#### `GET /posts/:id`
Get a single published post by ID.

**Access:** Public

**Response `200`:**
```json
{
  "message": "Post retrieved successfully",
  "post": {
    "id": 1,
    "title": "My First Post",
    "content": "<p>Hello world</p>",
    "published": true,
    "authorId": 2,
    "createdAt": "2026-06-17T12:00:00.000Z",
    "updatedAt": "2026-06-17T12:00:00.000Z",
    "author": {
      "id": 2,
      "username": "janedoe"
    }
  }
}
```

**Error `404`** — post not found or not published.

---

#### `POST /posts`
Create a new post. Defaults to draft (`published: false`).

**Access:** AUTHOR only

**Request body:**
```json
{
  "title": "string",
  "content": "string (HTML from rich text editor)",
  "published": false
}
```

**Response `201`:**
```json
{
  "message": "Post created successfully",
  "post": {
    "id": 3,
    "title": "My New Post",
    "content": "<p>Content here</p>",
    "published": false,
    "authorId": 2,
    "createdAt": "2026-06-17T12:00:00.000Z",
    "updatedAt": "2026-06-17T12:00:00.000Z"
  }
}
```

---

#### `PUT /posts/:id`
Update a post's title and content. Author must own the post.

**Access:** AUTHOR only (owner)

**Request body:**
```json
{
  "title": "string",
  "content": "string"
}
```

**Response `200`:**
```json
{
  "message": "Post updated successfully",
  "post": { ... }
}
```

**Error `404`** — post not found or not owned by the author.

---

#### `DELETE /posts/:id`
Delete a post and all its comments (cascade). Author must own the post.

**Access:** AUTHOR only (owner)

**Response `200`:**
```json
{
  "message": "Post deleted successfully"
}
```

---

#### `PATCH /posts/:id/publish`
Toggle a post's published status between `true` and `false`. Author must own the post.

**Access:** AUTHOR only (owner)

**Response `200`:**
```json
{
  "message": "Post published successfully",
  "post": {
    "id": 1,
    "published": true,
    ...
  }
}
```

---

#### `GET /posts/me`
Get all posts belonging to the authenticated author (includes drafts).

**Access:** AUTHOR only

**Response `200`:**
```json
{
  "message": "Posts retrieved successfully",
  "posts": [ ... ]
}
```

---

#### `GET /posts/me/:id`
Get a single post owned by the authenticated author (includes drafts).

**Access:** AUTHOR only (owner)

**Response `200`:**
```json
{
  "message": "Post retrieved successfully",
  "post": { ... }
}
```

---

### Comments

#### `GET /posts/:id/comments`
Get all comments for a post.

**Access:** Public

**Response `200`:**
```json
{
  "message": "Comments retrieved successfully",
  "comments": [
    {
      "id": 1,
      "content": "Great post!",
      "postId": 3,
      "userId": 5,
      "createdAt": "2026-06-17T13:00:00.000Z",
      "updatedAt": "2026-06-17T13:00:00.000Z",
      "user": {
        "id": 5,
        "username": "johndoe"
      }
    }
  ]
}
```

---

#### `POST /posts/:id/comments`
Add a comment to a post.

**Access:** Authenticated (any role)

**Request body:**
```json
{
  "content": "string"
}
```

**Response `201`:**
```json
{
  "message": "Comment created successfully",
  "comment": {
    "id": 1,
    "content": "Great post!",
    "postId": 3,
    "userId": 5,
    "createdAt": "2026-06-17T13:00:00.000Z",
    "updatedAt": "2026-06-17T13:00:00.000Z"
  }
}
```

---

#### `PUT /comments/:id`
Edit a comment. User must own the comment.

**Access:** Authenticated (owner only)

**Request body:**
```json
{
  "content": "string"
}
```

**Response `200`:**
```json
{
  "message": "Comment updated successfully",
  "comment": { ... }
}
```

**Error `403`** — not the comment owner.

---

#### `DELETE /comments/:id`
Delete a comment. Comment owner or any AUTHOR can delete.

**Access:** Authenticated (owner or AUTHOR)

**Response `200`:**
```json
{
  "message": "Comment deleted successfully"
}
```

---

### Authorization Summary

| Route | Public | Reader | Author |
|---|:---:|:---:|:---:|
| `GET /posts` | ✅ | ✅ | ✅ |
| `GET /posts/:id` | ✅ | ✅ | ✅ |
| `GET /posts/:id/comments` | ✅ | ✅ | ✅ |
| `POST /auth/register` | ✅ | ✅ | ✅ |
| `POST /auth/login` | ✅ | ✅ | ✅ |
| `GET /auth/me` | ❌ | ✅ | ✅ |
| `PATCH /auth/change-password` | ❌ | ✅ | ✅ |
| `POST /posts/:id/comments` | ❌ | ✅ | ✅ |
| `PUT /comments/:id` | ❌ | Owner only | Owner only |
| `DELETE /comments/:id` | ❌ | Owner only | ✅ |
| `POST /posts` | ❌ | ❌ | ✅ |
| `PUT /posts/:id` | ❌ | ❌ | Owner only |
| `DELETE /posts/:id` | ❌ | ❌ | Owner only |
| `PATCH /posts/:id/publish` | ❌ | ❌ | Owner only |
| `GET /posts/me` | ❌ | ❌ | ✅ |
| `GET /posts/me/:id` | ❌ | ❌ | Owner only |

---

## Middleware

| Middleware | Description |
|---|---|
| `requireAuth` | Verifies the JWT from the `Authorization` header. Attaches `req.user`. |
| `requireAuthor` | Checks `req.user.role === 'AUTHOR'`. Must stack after `requireAuth`. |
| `validationError` | Collects `express-validator` errors and returns a `422` response. |
| `notFound` | Catches unmatched routes and returns `404`. |
| `errorHandler` | Global error handler. Returns `500` for unhandled errors. |

---

## Deployment

| Layer | Service |
|---|---|
| Database | [Neon](https://neon.tech) (PostgreSQL) |
| API | [Render](https://render.com) |
| Reader Frontend | [Vercel](https://vercel.com) |
| Author Frontend | [Vercel](https://vercel.com) |

### Environment Variables

**API (`api/.env`)**

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `PORT` | Port the server listens on (default `3000`) |
| `JWT_SECRET` | Secret used to sign JWTs — use a strong random value in production |
| `CLIENT_URL` | Origin URL of the reader frontend (for CORS) |
| `ADMIN_URL` | Origin URL of the author frontend (for CORS) |

**Frontends (`.env` in each frontend directory)**

| Variable | Description |
|---|---|
| `VITE_API_URL` | Full base URL of the API including `/api/v1` |

---

## Features

**Reader Frontend**
- Browse all published posts
- Read full post content (rich HTML rendered safely)
- Register and log in
- Post, edit, and delete own comments
- Change account password
- Fully responsive with mobile hamburger menu

**Author Frontend**
- Role-locked — only users with `AUTHOR` role can access
- Dashboard showing all own posts (drafts + published)
- Create and edit posts with TinyMCE rich text editor
- Toggle publish/unpublish per post
- Delete posts (cascades to all comments)
- Moderate comments on any post
- Change account password

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express v5 (ESM) |
| ORM | Prisma 7 |
| Database | PostgreSQL |
| Validation | express-validator |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Frontend | React + Vite |
| Styling | Tailwind CSS v4 |
| Rich Text | TinyMCE |
| Fonts | Inter, Playfair Display |
# Architecture Overview

This project is a vocabulary learning application built with Next.js and MongoDB. The application allows users to store vocabulary, review words through flashcards, and schedule daily review based on simple progression logic.

## 1. System Summary

The application follows a simple client-server architecture with the following core responsibilities:

- Frontend UI in the Next.js App Router
- API routes for word management and authentication
- MongoDB for persistent data storage
- Cookie-based session authentication with role checks
- Review scheduling logic implemented as a reusable utility

## 2. High-Level Architecture

```text
+----------------------+
| Browser / User       |
| - Views vocabulary   |
| - Reviews words      |
| - Adds / edits words |
+----------+-----------+
           |
           v
+----------------------+
| Next.js Frontend     |
| app/page.tsx         |
| Client-side state    |
| fetch() API calls    |
+----------+-----------+
           |
           v
+----------------------+
| Next.js Route Handlers
| /app/api/words       |
| /app/api/auth/*      |
| input validation     |
| authorization       |
+----------+-----------+
           |
           v
+----------------------+
| Business Logic       |
| lib/auth.ts          |
| lib/permissions.ts   |
| lib/review.ts         |
| session + permission |
| scheduling logic     |
+----------+-----------+
           |
           v
+----------------------+
| MongoDB              |
| words collection     |
| users collection     |
| progress collection  |
+----------------------+
```

## 3. Architectural Layers

### 3.1 Presentation Layer

The presentation layer is implemented using React components rendered by Next.js. The main application screen is in:

- `vocab-flashcards/app/page.tsx`

This page handles:

- fetching words
- showing tabs for vocabulary, study, and daily review
- creating, editing, and deleting entries
- searching the word list
- handling review flow and card flipping
- user login/logout state changes

### 3.2 Application Layer

The application logic is split into server-side API routes and shared library functions.

#### API Routes

- `vocab-flashcards/app/api/words/route.ts`
  - Lists words
  - Creates new vocabulary entries
  - Reads progress state for the current user
  - Applies due-only filtering when needed

- `vocab-flashcards/app/api/words/[id]/route.ts`
  - Updates or deletes a word record
  - Uses the current user session for authorization

- `vocab-flashcards/app/api/auth/*`
  - login
  - logout
  - me
  - register

#### Supporting Logic

- `vocab-flashcards/lib/auth.ts`
  - password hashing and verification
  - session token creation and validation
  - current user lookup from cookies

- `vocab-flashcards/lib/permissions.ts`
  - role-based permission model
  - checks such as `word:read`, `word:create`, and `review`

- `vocab-flashcards/lib/review.ts`
  - scheduling logic for review dates
  - `know` -> next review in 3 days
  - `again` -> next review in 1 day

### 3.3 Data Layer

The data layer is MongoDB, accessed with the MongoDB Node.js driver.

- `vocab-flashcards/lib/mongodb.ts`
  - creates a shared Mongo client instance
  - loads `MONGODB_URI` from environment variables
  - reuses a singleton connection in development

The database stores data in collections related to:

- vocabulary words
- users
- review progress

## 4. Request Flow

### 4.1 Word Listing

1. The browser calls `fetch('/api/words')` from the client page.
2. The route checks whether the user is authenticated and authorized.
3. It fetches the word list and current review progress.
4. The response is transformed into the UI model and rendered in the page.

### 4.2 Creating a Word

1. User submits the vocabulary form from the frontend.
2. The page posts JSON to `/api/words`.
3. The server validates required fields.
4. The word is inserted into MongoDB.
5. A success response is returned to the frontend and the list refreshes.

### 4.3 Review Flow

1. The UI identifies words due for review.
2. The user marks a card as `know` or `again`.
3. The backend updates the review state and schedules the next review date.
4. The next review date is calculated using the reusable scheduling utility.

## 5. Design Principles

The project architecture is intentionally simple and lightweight:

- Minimal service boundaries
- Server actions are kept close to route handlers
- Data operations are centralized around MongoDB
- Role-based access checks are enforced on the server
- Review logic is isolated and testable

## 6. Key Files

```text
vocab-flashcards/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   └── words/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   ├── auth.ts
│   ├── db.ts
│   ├── mongodb.ts
│   ├── permissions.ts
│   └── review.ts
├── tests/
│   └── review.test.ts
├── .env.local
├── package.json
├── README.md
├── AI_LOG.md
└── architecture.md
```

## 7. Security Considerations

The current architecture includes important protections, but the app should continue to evolve around them:

- passwords are hashed with salt using Node's crypto APIs
- session cookies are signed and time-limited
- authorization checks are performed on the server, not only in the UI
- environment variables such as `MONGODB_URI` and `AUTH_SECRET` are kept outside source control

Additional hardening should be added over time, including stricter input validation, stronger production session settings, and user-specific data isolation.

## 8. Future Architectural Direction

The project is currently a compact MVP. Planned improvements include:

- user-specific vocabulary collections
- stronger spaced repetition algorithms
- more granular role and permission management
- centralized API validation and error handling
- CI/CD and deployment automation
- better separation between UI, domain logic, and persistence concerns

This architecture works well for a small educational application and is easy to extend as the feature set grows.

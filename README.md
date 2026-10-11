# Vocab Flashcards

A vocabulary learning web application built with Next.js and MongoDB. The application helps users manage English vocabulary, study flashcards, and review words regularly.

## 1. Project Overview

Vocab Flashcards is a minimal vocabulary learning application developed as a semester project for Advanced Software Engineering.

The main goal is to provide a simple and practical way to organize vocabulary and support regular review through flashcards.

## 2. Features

### Vocabulary Management

- Add new vocabulary words.
- View the vocabulary list.
- Edit existing vocabulary entries.
- Delete vocabulary entries.

### Flashcard Study

- Study vocabulary using flashcards.
- Review word meanings and examples.
- Practice recalling vocabulary.

### Daily Review

- Identify vocabulary scheduled for review.
- Review words that are due.
- Update review status based on the user's response.

## 3. Technology Stack

- **Frontend:** Next.js, React, TypeScript
- **Styling:** Tailwind CSS
- **Backend:** Next.js Route Handlers
- **Database:** MongoDB
- **Database Driver:** MongoDB Node.js Driver
- **Testing:** Vitest (for tests implemented in the project)
- **Version Control:** Git and GitHub

## 4. Project Structure

```text
vocab-flashcards/
├── app/
│   ├── api/
│   │   └── words/
│   │       ├── route.ts
│   │       └── [id]/
│   │           └── route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   ├── mongodb.ts
│   └── review.ts
├── tests/
│   └── review.test.ts
├── .env.local
├── .gitignore
├── package.json
├── README.md
└── AI_LOG.md
```

## 5. Getting Started

### Prerequisites

- Node.js and npm
- A MongoDB database, such as MongoDB Atlas
- Git (recommended)

### Installation

Clone the repository and enter the project directory:

```bash
git clone aaronkr-2026-2/cbnu-soft-eng-software-engineering-project-group-2
cd vocab-flashcards
npm install
```

Configure the environment variables in a root-level `.env.local` file:

```env
MONGODB_URI= ******
MONGODB_DB=vocab_flashcards
```

Replace the example connection string with your actual MongoDB connection string.

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 6. API Endpoints

The application uses Next.js Route Handlers to communicate with MongoDB.

| Method | Endpoint              | Purpose                                                                   |
| ------ | --------------------- | ------------------------------------------------------------------------- |
| GET    | `/api/words`          | Retrieve vocabulary words                                                 |
| POST   | `/api/words`          | Create a vocabulary entry                                                 |
| PATCH  | `/api/words/[id]`     | Update or review a word                                                   |
| DELETE | `/api/words/[id]`     | Delete a vocabulary entry                                                 |
| GET    | `/api/words?due=true` | Retrieve words due for review, if supported by the current implementation |

## 7. Data Model

A vocabulary entry may contain the following fields:

- `word`: the vocabulary item
- `meaning`: the definition or translation
- `example`: an example sentence
- `createdAt`: the creation date
- `nextReviewAt`: the next scheduled review date
- `lastReviewedAt`: the most recent review date
- `reviewCount`: the number of reviews completed

Dates are stored as JavaScript `Date` values and persisted through MongoDB.

## 8. Review Logic

The application can schedule the next review based on the user's response. In the current simple review logic:

- **Know:** schedule the next review three days later.
- **Again:** schedule another review one day later.

This is a basic rule-based approach rather than a full spaced-repetition algorithm.

## 9. Testing

Run the test suite with:

```bash
npm test
```

This command requires a corresponding `test` script in `package.json`. For example:

```json
"scripts": {
  "test": "vitest run"
}
```

Add tests for review scheduling, API behavior, and input validation as the project develops.

## 10. Security and Configuration

- Keep `.env.local` out of version control.
- Never commit MongoDB credentials or other secrets.
- Validate and sanitize user input on the server.
- Handle invalid MongoDB ObjectIds and database errors.
- Add authentication and authorization before exposing private vocabulary data publicly.
- Configure MongoDB Atlas network access and database permissions appropriately.

## 11. Current Project Status

The current development stage includes the frontend, MongoDB connection, and vocabulary CRUD functionality. Flashcard study and daily review are part of the intended MVP.

Testing, security improvements, deployment, and additional engineering practices should be documented as they are implemented and verified.

## 12. AI Assistance

AI tools were used as development assistance for tasks such as explaining code, suggesting implementation patterns, troubleshooting, and preparing documentation.

Details of AI-assisted work, decisions, modifications, and verification are recorded in `AI_LOG.md`.

## 13. Future Improvements

- Improve the spaced-repetition algorithm.
- Add user authentication and individual vocabulary collections.
- Improve accessibility and responsive design.
- Expand automated testing.
- Add continuous integration and deployment.
- Improve API documentation and error handling.

### Unit Tests

The project uses Vitest to test the vocabulary review scheduling logic.

Run the tests with:

```bash
npm test
```

The current unit tests verify that:

- Words marked as "know" are scheduled for review three days later.
- Words marked as "again" are scheduled for review one day later.

The tests use explicit UTC timestamps to avoid timezone-related inconsistencies.

## Example Translation

Each word can store an optional **Mongolian translation of its example sentence**, so you can see how the word is used in context and check your understanding.

### How it works

- When adding or editing a word, fill in the **"Mongolian translation of example (optional)"** field. For example:
  - Example: `I like cats.`
  - Translation: `Би мууранд дуртай.`
- The translation appears under the example sentence in the **Vocabulary** list.
- In **Study cards** and **Daily review**, it appears on the back of the card (after you flip it), below the example sentence.
- The field is optional. Words without a translation display normally.

### Data model

A new `translation` field was added to each word:

| Field         | Type   | Required | Limit      |
| ------------- | ------ | -------- | ---------- |
| `translation` | string | No       | 1000 chars |

### API changes

- `POST /api/words` accepts `translation` in the request body and saves it.
- `PATCH /api/words/:id` accepts `translation` when editing a word.
- `GET /api/words` returns `translation` with each word.

```json
POST /api/words
{
  "word": "cat",
  "meaning": "муур",
  "example": "I like cats.",
  "translation": "Би мууранд дуртай."
}
```

### Files changed

- `app/page.tsx`: new form field, and display in the list and flashcards
- `app/api/words/route.ts`: reads and stores `translation` on create
- `app/api/words/[id]/route.ts`: reads and stores `translation` on edit

### Notes

- Words created before this feature was added have no `translation`. They still work, and the field is added the next time you edit and save the word.

# Vocab

A personal vocabulary app for learning English words with Mongolian meanings. Users register and log in, study words as flashcards, and review the ones that are due. Admins manage the word list.

## Features

- **Accounts**: users register themselves; admins and regular users log in through the same screen
- **Role-based access**: permissions are checked on the server for every request
- **Vocabulary list**: browse and search words (admins can also add, edit, and delete)
- **Example sentences**: each word can have an example sentence and its Mongolian translation
- **Study cards**: flip through flashcards of the whole collection
- **Daily review**: review due words and mark each as "I know it" or "Review tomorrow"
- **Per-user progress**: every user has their own review schedule and stats

## Roles and Permissions

| Role  | View words | Study / Daily review | Add / Edit / Delete words |
| ----- | ---------- | -------------------- | ------------------------- |
| user  | Yes        | Yes                  | No                        |
| admin | Yes        | Yes                  | Yes                       |

- Anyone who registers becomes a `user`.
- Admins can only be created with the script in `scripts/create-admin.mjs`. There is no way to become admin through the UI or API.
- Permissions are defined in `lib/permissions.ts` and enforced in the API routes. Hiding buttons in the UI is only a convenience, not the security boundary.

## Tech Stack

- [Next.js](https://nextjs.org/) (App Router) with TypeScript
- [Tailwind CSS](https://tailwindcss.com/)
- [MongoDB](https://www.mongodb.com/) (native `mongodb` driver)
- [lucide-react](https://lucide.dev/) for icons
- Node.js `crypto` for password hashing (scrypt) and session signing (HMAC-SHA256)

## Getting Started

### Prerequisites

- Node.js 20.6 or newer (needed for `--env-file`)
- A MongoDB database (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### Installation

```bash
git clone aaronkr-2026-2/cbnu-soft-eng-software-engineering-project-group-2
cd vocab-flashcards
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
MONGODB_URI=your-mongodb-connection-string
MONGODB_DB=vocab_flashcards
AUTH_SECRET=your-random-64-character-secret
```

| Variable      | Required | Description                                 |
| ------------- | -------- | ------------------------------------------- |
| `MONGODB_URI` | Yes      | MongoDB connection string                   |
| `MONGODB_DB`  | No       | Database name (default: `vocab_flashcards`) |
| `AUTH_SECRET` | Yes      | Secret used to sign session cookies         |

Generate `AUTH_SECRET` randomly. Do not invent it by hand:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Never commit `.env.local`. Changing `AUTH_SECRET` logs out all users.

### Create the first admin

```bash
node --env-file=.env.local scripts/create-admin.mjs <username> "<password>"
```

- Username: 3-30 characters, lowercase letters, numbers, `_` `.` `-`
- Password: at least 8 characters
- Running it again with the same username resets that admin's password

### Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), log in as the admin, and add some words. Other people can register from the login screen.

## How Review Works

Each user has their own progress record per word, stored in the `progress` collection. A word is due when its `nextReviewAt` is today or earlier. Words a user has never reviewed are due immediately.

| Action          | Next review |
| --------------- | ----------- |
| I know it       | in 3 days   |
| Review tomorrow | in 1 day    |

The scheduling logic lives in `lib/review.ts`.

## Data Model

**`words`**: shared by everyone, managed by admins

```ts
{
  _id: ObjectId;
  word: string; // English word (max 100 chars)
  meaning: string; // Mongolian meaning (max 500 chars)
  example: string; // Example sentence (max 1000 chars, optional)
  translation: string; // Mongolian translation of the example (max 1000 chars, optional)
  createdAt: Date;
}
```

**`users`**

```ts
{
  _id: ObjectId;
  username: string; // unique, lowercase
  passwordHash: string; // "salt:hash" (scrypt)
  role: "admin" | "user";
  createdAt: Date;
}
```

**`progress`**: one document per user and word

```ts
{
  userId: string;
  wordId: ObjectId;
  nextReviewAt: Date;
  lastReviewedAt: Date;
  reviewCount: number;
}
```

## API Reference

All word endpoints require a logged-in user.

| Method | Endpoint             | Access            | Description                                                           |
| ------ | -------------------- | ----------------- | --------------------------------------------------------------------- |
| POST   | `/api/auth/register` | Public            | Create a `user` account and start a session                           |
| POST   | `/api/auth/login`    | Public            | Log in                                                                |
| POST   | `/api/auth/logout`   | Public            | Clear the session cookie                                              |
| GET    | `/api/auth/me`       | Public            | Current user, or `null`                                               |
| GET    | `/api/words`         | Logged in         | List words with the caller's own progress (`?due=true` for due words) |
| POST   | `/api/words`         | Admin             | Create a word                                                         |
| PATCH  | `/api/words/:id`     | Logged in / Admin | Submit a review (any user) or edit a word (admin only)                |
| DELETE | `/api/words/:id`     | Admin             | Delete a word and its progress records                                |

Submitting a review:

```json
PATCH /api/words/:id
{ "review": "know" }    // or "again"
```

Creating a word:

```json
POST /api/words
{
  "word": "cat",
  "meaning": "муур",
  "example": "I like cats.",
  "translation": "Би мууранд дуртай."
}
```

Unauthenticated requests return `401`. Requests without the required role return `403`.

## Security Notes

- Passwords are hashed with scrypt and a per-user random salt. Plain passwords are never stored.
- Sessions are signed (HMAC-SHA256) tokens in an `httpOnly`, `sameSite=lax` cookie (`secure` in production), valid for 7 days.
- The user's role is read from the database on every request, so role changes take effect immediately.
- Login and registration have **no rate limiting** yet. Add it before exposing the app publicly.

## Project Structure

```
app/
  page.tsx                    # UI: login, vocabulary, study cards, daily review
  api/
    auth/
      register/route.ts
      login/route.ts
      logout/route.ts
      me/route.ts
    words/
      route.ts                # GET, POST
      [id]/route.ts           # PATCH (review / edit), DELETE
lib/
  mongodb.ts                  # MongoDB client
  db.ts                       # getDb() helper
  auth.ts                     # password hashing, session tokens, getCurrentUser()
  permissions.ts              # roles and can() helper
  review.ts                   # review scheduling logic
scripts/
  create-admin.mjs            # create or update an admin account
```

## Notes

- Words created before the `translation` field existed have no translation. Editing and saving such a word adds it.
- Progress that older versions stored directly on words is no longer used. Each user starts fresh.
- Review dates use the server's time zone.

## License

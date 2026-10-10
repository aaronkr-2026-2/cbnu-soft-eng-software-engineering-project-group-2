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

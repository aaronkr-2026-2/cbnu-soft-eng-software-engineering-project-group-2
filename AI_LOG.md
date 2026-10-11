# AI_LOG.md

# AI Collaboration Log

## 1. Project Information

- **Project:** Vocab Flashcards
- **Course:** Advanced Software Engineering
- **AI Tool:** ChatGPT
- **Project Type:** Web application
- **Purpose of AI Assistance:** Code explanation, implementation guidance, debugging support, and documentation preparation.

## 2. AI Usage Principles

AI was used as a supporting tool during development, not as a replacement for understanding or verifying the code.

The development process involved reviewing AI suggestions, adapting them to the project structure, and checking whether the proposed implementation matched the application's requirements.

AI-generated code and explanations must be reviewed before being accepted into the project.

## 3. AI Assistance Log

### Entry 1: Project Planning and Technology Selection

**Task:** Define the MVP and choose the technology stack.

**Prompt summary:** Asked for guidance on developing a vocabulary flashcard application for an Advanced Software Engineering semester project.

**AI contribution:**

- Suggested a minimal vocabulary learning application.
- Recommended Next.js, TypeScript, Tailwind CSS, and MongoDB.
- Helped organize the initial MVP around vocabulary management, flashcard study, and daily review.

**Decision:** Used these suggestions as a starting point for the project architecture and feature planning.

**Verification:** Compared the proposed features with the intended project scope and current implementation.

### Entry 2: MongoDB Connection

**Task:** Connect the Next.js application to MongoDB.

**Prompt summary:** Asked how to configure `.env.local` and implement a reusable MongoDB connection module.

**AI contribution:**

- Explained environment variables.
- Suggested using the MongoDB Node.js Driver.
- Provided a reusable connection module in `lib/mongodb.ts`.
- Explained how to reuse the database connection during development.

**Decision:** Adapted the connection pattern for the project.

**Verification:** Checked that the development server started and prepared a database connection test endpoint.

**Learning outcome:** Learned how server-side environment variables and a reusable MongoDB client are used in a Next.js application.

### Entry 3: CRUD Implementation

**Task:** Implement vocabulary data management.

**Prompt summary:** Requested guidance on creating API endpoints for adding, retrieving, editing, and deleting vocabulary entries.

**AI contribution:**

- Explained the role of Next.js Route Handlers.
- Suggested GET, POST, PATCH, and DELETE endpoint patterns.
- Provided guidance on using MongoDB collections and ObjectIds.
- Discussed basic input validation and error handling.

**Decision:** Used the suggested patterns as implementation guidance and adapted them to the application's code.

**Verification:** CRUD operations should be tested individually to confirm that vocabulary entries are created, retrieved, updated, and deleted correctly.

### Entry 4: Flashcard Study and Review Logic

**Task:** Design the flashcard study flow and daily review behavior.

**Prompt summary:** Asked for a simple review scheduling approach for vocabulary flashcards.

**AI contribution:**

- Suggested tracking the next review date.
- Proposed a simple rule-based schedule: three days for words marked "know" and one day for words marked "again".
- Explained how review dates could be handled with JavaScript `Date` values.

**Decision:** Used the simple scheduling approach as an initial MVP design.

**Limitation:** This is not a scientifically validated or adaptive spaced-repetition algorithm.

**Verification:** Review scheduling should be tested with fixed dates to confirm that the calculated dates are correct.

### Entry 5: Documentation Preparation

**Task:** Prepare the README and AI collaboration log.

**Prompt summary:** Asked for documentation describing the project, setup instructions, technology stack, API endpoints, and AI assistance.

**AI contribution:**

- Prepared a README structure.
- Drafted installation and environment configuration instructions.
- Organized the AI assistance record into individual development tasks.

**Decision:** The documents will be reviewed and edited to match the actual code and completed work.

**Verification:** Confirm that every documented feature, command, endpoint, and test corresponds to the current repository.

## 4. AI Limitations and Risks

During AI-assisted development, the following risks were considered:

- Suggested code may not match the current repository structure.
- AI-generated code may contain errors or omit important edge cases.
- Documentation may describe features that have not been completed.
- Database credentials must never be shared in prompts or committed to Git.
- Security-sensitive functionality requires additional review beyond basic implementation.

AI suggestions should therefore be checked against the actual source code and tested before being considered complete.

## 5. Human Decisions and Responsibility

The developer is responsible for:

- Understanding the code included in the project.
- Deciding which AI suggestions to accept, modify, or reject.
- Testing application behavior.
- Protecting credentials and database access.
- Keeping documentation accurate.
- Explaining the architecture and implementation during the project presentation.

## 6. Reflection

AI assistance helped organize the project, explain unfamiliar implementation patterns, and prepare documentation. Working through the suggestions also provided opportunities to learn about database connectivity, REST-style API operations, environment configuration, and basic review scheduling.

The main lesson is that AI-generated code is a starting point for development, not proof that a feature works. Understanding, verification, testing, and documentation remain the developer's responsibility.

## 7. Future AI-Assisted Work

If AI is used for additional work, future entries should record:

- The date and task.
- The tool used and the prompt or a faithful prompt summary.
- The suggestions that were accepted, modified, or rejected.
- Errors or limitations discovered.
- How the final result was verified.

# AI Usage Log

This file records how AI tools were used during the development of the Vocab Flashcards project.

## Summary

| #   | Date       | Tool   | Area                   | Purpose                                   | Result                          |
| --- | ---------- | ------ | ---------------------- | ----------------------------------------- | ------------------------------- |
| 1   | 2026-10-11 | Claude | `app/page.tsx` (React) | Fix ESLint error in the initial data load | Accepted with small adaptations |

## Entry 1: Fix `react-hooks/set-state-in-effect` error

**Tool:** Claude (Anthropic)

**Task:** ESLint reported this error in `app/page.tsx`:

> Calling setState synchronously within an effect can trigger cascading renders (`react-hooks/set-state-in-effect`)

**Prompt (summary):** Pasted `page.tsx` and the ESLint message, and asked for a fix.

**Cause identified by AI:** The `useEffect` called `loadWords()`, and `loadWords()` began with `setLoading(true)` and `setError("")`. These ran synchronously inside the effect body.

**AI suggestion:**

- Remove `setLoading(true)` from `loadWords`. The `loading` state already starts as `true`, so it is not needed on first load.
- Move the initial fetch into an `init()` function inside the effect, so state is only updated after `await`.
- Add a `cancelled` flag and cleanup function to avoid updating state after the component unmounts.
- Keep `loadWords` for refreshing the list after save, delete, and review actions.

**What we did:** Replaced the `loadWords` function and the `useEffect` in `page.tsx` with the suggested versions. No other part of the file was changed. We ran `npm run lint` to confirm the error was gone and tested adding, editing, deleting, and reviewing words manually.

**Verification:** Checked by running the linter and testing the app in the browser. We read the code and confirmed we understand why the change works.

## Entry 2: Documentation drafts

**Tool:** Claude (Anthropic)

**What we did:** AI produced the first drafts based on the source code. The team checked the content against the real project (setup steps, environment variable name, API routes, project structure) and corrected anything that did not match.

## Reflection

- AI was most useful for explaining the lint rule and proposing a clean pattern for loading data in an effect.
- AI output is not always a perfect fit, so every suggestion was reviewed, tested, and understood before being committed.
- AI did not make design or architecture decisions for the project. Those were made by the team.

## Tool

- **Assistant:** Claude (Anthropic), used through the chat interface
- **Period:** October 2026
- **How it was used:** I pasted my existing code, described what I wanted, and the assistant returned updated files. I copied the code into the project myself. The assistant had no direct access to the repository, database, or environment.

## Summary of AI-assisted work

| #   | Task                                                                    | Files affected                                                                                                                    |
| --- | ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Added an optional Mongolian translation of the example sentence         | `app/page.tsx`, `app/api/words/route.ts`, `app/api/words/[id]/route.ts`                                                           |
| 2   | Reviewed and fixed UI and API issues (see "Issues found")               | `app/page.tsx`, `app/api/words/[id]/route.ts`                                                                                     |
| 3   | Wrote the first README                                                  | `README.md`                                                                                                                       |
| 4   | Added admin-only editing with a single password (first, simpler design) | later replaced by #5                                                                                                              |
| 5   | Replaced it with registration, login, roles, and per-user progress      | `lib/auth.ts`, `lib/db.ts`, `lib/permissions.ts`, `app/api/auth/*`, `app/api/words/*`, `app/page.tsx`, `scripts/create-admin.mjs` |
| 6   | Reviewed `lib/mongodb.ts` and fixed import mistakes in `lib/auth.ts`    | `lib/auth.ts`, `lib/db.ts`                                                                                                        |
| 7   | Rewrote the README and this log to match the final design               | `README.md`, `AI_LOG.md`                                                                                                          |

## Key decisions

1. **Authorization is enforced in the API, not the UI.** Hiding buttons is cosmetic. Every protected route calls `getCurrentUser()` and `can(user, permission)`.
2. **Admins cannot be created through registration.** Registration always creates `role: "user"`. Admins are created only by a local script, so nobody can claim admin by choosing a username or sending extra fields.
3. **Per-user progress in a separate `progress` collection.** Originally `nextReviewAt` and `reviewCount` were stored on each word, so one user's review changed the schedule for everyone. Moving them to `{ userId, wordId }` documents fixes this.
4. **No auth library.** Sessions use an HMAC-signed cookie and `scrypt` from Node's built-in `crypto`, to keep the project dependency-free. The trade-off is that I maintain the auth code myself.
5. **Role is read from the database on each request**, not stored in the cookie, so role changes apply immediately.
6. **`AUTH_SECRET` is generated randomly**, not chosen by hand, because anyone who knows it can forge a session for any user.

## Issues found during AI review

- **Date bug in review scheduling.** The route called `getNextReviewDate()` and then overwrote the result with `nextReviewAt.setDate(now.getDate() + n)`. `getDate()` returns the day of the month, so the date could be wrong near month ends. The duplicate line was removed. `lib/review.ts` was confirmed correct.
- **Stale form state.** Closing the form with X kept the previous edit state. A shared `closeForm()` now resets the draft, editing ID, and error.
- **Errors hidden behind the modal.** Errors are now shown inside the form while it is open.
- **Double submit.** Added a `saving` flag.
- **Fragile `maxLength` logic.** `Field` guessed the limit from its label text. It is now a prop.
- **Wrong import.** `lib/auth.ts` imported `getDb` as a default export from `@/lib/mongodb`, which actually default-exports `clientPromise`. Fixed by creating `lib/db.ts` with a named `getDb` export.
- **Missing environment check.** Added a startup error when `AUTH_SECRET` is missing, because otherwise sessions silently fail.

## Mistakes the assistant made

- An early suggestion included a Mongoose schema (`models/Word.ts`) although the project uses the native MongoDB driver. It was flagged as unnecessary and not used.
- The README initially guessed the environment variable name `MONGODB_URI`. It was later confirmed against `lib/mongodb.ts`.

## Human review and testing

- [ ] Registered a new user and confirmed the role is `user`
- [ ] Created an admin with `scripts/create-admin.mjs` and logged in
- [ ] Confirmed a regular user gets `403` from `POST /api/words`, `PATCH /api/words/:id` (edit), and `DELETE /api/words/:id`
- [ ] Confirmed two users have independent review progress
- [ ] Confirmed deleting a word removes its `progress` documents
- [ ] Confirmed logging out and an expired session return to the login screen
- [ ] Confirmed `.env.local` is in `.gitignore`

## Known limitations and follow-ups

- No rate limiting or lockout on login and registration
- No password reset flow (admins can be reset by re-running the script; regular users cannot)
- No CSRF token. The cookie uses `sameSite=lax`, which gives basic protection
- Existing words store legacy `nextReviewAt` / `reviewCount` fields that are now ignored
- No automated tests
- Review dates depend on the server's time zone

## Notes on responsible use

All AI-generated code was read and adapted by me before use. Secrets (`AUTH_SECRET`, database credentials, admin password) were never shared with the assistant.

## [Milestone name] — [Date]

**Tool(s) used:**
**What I asked for:**
**What I kept as-is:**
**What I changed or rejected, and why:**
**Something the AI got wrong that I had to catch:**

---

```

```

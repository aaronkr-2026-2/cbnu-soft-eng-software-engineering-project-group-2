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

## [Milestone name] — [Date]

**Tool(s) used:**
**What I asked for:**
**What I kept as-is:**
**What I changed or rejected, and why:**
**Something the AI got wrong that I had to catch:**

---

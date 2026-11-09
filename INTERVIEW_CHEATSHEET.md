# SpendSmart — Interview Preparation Cheat Sheet

Use this guide to master every technical detail of this project so you can answer any interview question with 100% confidence.

---

## 1. 60-Second Elevator Pitch (For "Tell me about this project")

> *"SpendSmart is a full-stack personal finance web application built using the MERN stack—React, Node.js, Express, and MongoDB. I designed it to help individuals gain real-time visibility into their spending patterns and cash flow.*
>
> *On the frontend, I built an interactive single-page dashboard with category-based visual analytics. On the backend, I implemented modular RESTful APIs secured with JWT authentication and bcrypt password hashing. One key highlight is the analytics engine: instead of fetching thousands of raw transaction rows to the client, I wrote MongoDB Aggregation Pipelines to perform server-side grouping, calculating category breakdowns and savings ratios in a single optimized database query.*
>
> *Additionally, I integrated a CI/CD pipeline using GitHub Actions that automatically runs Jest test suites and build checks on every git push to ensure production reliability."*

---

## 2. Key Architecture Concepts You Must Know

### A. How Authentication Works (JWT & Bcrypt)
* **Registration:** When a user registers, their raw password is never stored directly. We use `bcryptjs` to generate a salt (10 rounds) and hash the password before saving to MongoDB.
* **Login:** When logging in, `bcrypt.compare()` checks the entered password against the hashed password.
* **Token Issuance:** If valid, the server signs a **JSON Web Token (JWT)** containing the user's `_id` using a private secret key (`JWT_SECRET`) and a 30-day expiration.
* **Protected Routes:** For every subsequent request to `/api/transactions` or `/api/analytics`, the React frontend sends `Authorization: Bearer <token>`. An Express middleware (`protect`) intercepts the request, verifies the token's cryptographic signature, extracts the user ID, and attaches `req.user`.

### B. What is the MongoDB Aggregation Pipeline?
* **Why not simple `find()`?** If a user has 5,000 transactions, fetching all of them to calculate category totals wastes bandwidth and CPU on both server and client.
* **How Aggregation solves it:** It processes data directly inside the database engine in stages:
  1. `$match`: Filters transactions for the authenticated user and where `type === 'expense'`.
  2. `$group`: Groups documents by `_id: "$category"` and uses `$sum: "$amount"` to compute category totals.
  3. `$project`: Formats output fields cleanly.
  4. `$sort`: Sorts highest expense categories first (`totalAmount: -1`).

### C. Database Indexing & Performance
* In `Transaction.js`, compound indexes are created:
  * `{ user: 1, date: -1 }`: Optimizes chronological sorting of recent user transactions.
  * `{ user: 1, category: 1 }`: Optimizes category-based filtering.
* **Why it matters:** Without indexes, MongoDB performs a full collection scan ($O(N)$). With compound indexes, lookups are logarithmic ($O(\log N)$).

### D. CI/CD Pipeline (GitHub Actions)
* Defined in `.github/workflows/ci.yml`.
* **Triggers:** Runs automatically whenever code is pushed to `main` or a Pull Request is opened.
* **Steps executed:**
  1. Spins up an Ubuntu container.
  2. Sets up Node.js.
  3. Installs backend dependencies and executes automated tests (`npm test` via Jest & Supertest).
  4. Builds the frontend React production bundle to ensure zero syntax or bundling errors.

---

## 3. Likely Interview Questions & Sample Answers

### Q1: "Why did you choose MongoDB over a SQL database like MySQL or PostgreSQL?"
**Answer:**
> *"MongoDB offers flexible schema modeling for transaction metadata and nested category tags. However, because financial transactions require high consistency, I enforced strict Mongoose schema validation at the application level. For a traditional core banking ledger handling multi-account ACID fund transfers, PostgreSQL would be my choice; for personal finance tracking with dynamic categories and fast analytical reads, MongoDB's aggregation pipeline was ideal."*

### Q2: "How do you prevent a user from seeing or deleting someone else's transactions?"
**Answer:**
> *"I implemented authorization at two levels: First, all transaction routes pass through the `protect` middleware which verifies the JWT token. Second, on `update` and `delete` endpoints, the controller verifies that `transaction.user.toString() === req.user.id`. If they don't match, it immediately rejects the request with a 403 Forbidden status."*

### Q3: "What is CI/CD, and why did you add it to this project?"
**Answer:**
> *"CI/CD stands for Continuous Integration and Continuous Deployment. In this project, I used GitHub Actions to automate the integration phase. Whenever new features or bug fixes are pushed, the automated pipeline runs our test suite (checking health endpoints and JWT auth guards) and builds the React app. This prevents broken code or regressions from ever reaching production."*

### Q4: "How would you scale this application if active users increased from 100 to 100,000?"
**Answer:**
> *"To scale horizontally:*
> 1. *Stateless Backend: The Express API is already stateless because sessions are handled via JWT tokens. We can place multiple Node.js instances behind an Nginx or AWS Application Load Balancer.*
> 2. *Caching Layer: Cache read-heavy analytics summaries in Redis with a 5-minute TTL so the database isn't queried on every page refresh.*
> 3. *Database Optimization: Leverage read replicas for aggregation queries and partition/shard transaction data by `userId`."*

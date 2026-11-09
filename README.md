# SpendSmart — Personal Expense & Financial Tracker

[![SpendSmart CI/CD](https://github.com/Tarun-K8/spendsmart-expense-tracker/actions/workflows/ci.yml/badge.svg)](https://github.com/Tarun-K8/spendsmart-expense-tracker/actions)
![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Node](https://img.shields.io/badge/Node.js-v18%2B-green.svg)
![React](https://img.shields.io/badge/React-18-blue.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen.svg)

A modern, production-grade **Full-Stack (MERN) Financial Tracker Application** built with clean architecture, robust security, database aggregation pipelines, and automated **CI/CD pipelines**.

---

## 🚀 Key Highlights

* **Full-Stack MERN Architecture:** Built with React 18, Node.js, Express.js, and MongoDB.
* **Real-Time Financial Analytics:** Leverages **MongoDB Aggregation Pipelines** (`$match`, `$group`, `$project`, `$sort`) for category-wise expense breakdowns and net savings ratios.
* **Authentication & Route Security:** Stateless **JWT (JSON Web Token)** authentication, **bcryptjs** password hashing (10 salt rounds), and protected middleware guards.
* **Database Optimization:** Compound indexing (`{ user: 1, date: -1 }`, `{ user: 1, category: 1 }`) ensuring sub-100ms query performance.
* **Automated CI/CD Workflows:** GitHub Actions workflow running automated unit and integration tests (Jest & Supertest) on every push and pull request.
* **Responsive Dashboard UI:** Clean fintech interface inspired by modern digital banking design with INR currency formatting.

---

## 🛠️ System Architecture

```text
[ React Frontend (Vite) ]
          │  REST APIs / JSON
          ▼
[ Express.js / Node.js Server ] ────► [ JWT Auth Middleware ]
          │                                  │
          ├──────────────────────────────────┤
          ▼                                  ▼
[ Controllers & Services ]         [ Bcrypt Hashing ]
          │
          ▼
[ MongoDB Database ] (Indexes: { user, date }, { user, category })
          │
          └──► Aggregation Pipeline (Category breakdown, Monthly trends)
```

---

## 📡 REST API Documentation

### Authentication Endpoints
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user account | No |
| `POST` | `/api/auth/login` | Authenticate and return JWT | No |
| `GET` | `/api/auth/me` | Fetch logged-in user profile | **Yes (Bearer Token)** |

### Transaction Endpoints
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/transactions` | Fetch user transactions (filter by type/date) | **Yes (Bearer Token)** |
| `POST` | `/api/transactions` | Add a new income/expense entry | **Yes (Bearer Token)** |
| `PUT` | `/api/transactions/:id` | Update an existing transaction | **Yes (Bearer Token)** |
| `DELETE` | `/api/transactions/:id` | Remove a transaction | **Yes (Bearer Token)** |

### Financial Analytics Endpoints
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/analytics/summary` | Aggregated totals, category distribution | **Yes (Bearer Token)** |

---

## 💻 Local Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/Tarun-K8/spendsmart-expense-tracker.git
cd spendsmart-expense-tracker
```

### 2. Configure Backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### 3. Configure Frontend
```bash
cd ../frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Running Automated Tests
```bash
cd backend
npm test
```

---

## 🧪 CI/CD Automation
The project includes a GitHub Actions configuration located at `.github/workflows/ci.yml`. On every commit or PR:
1. Provisions an Ubuntu runner with Node.js.
2. Runs unit and integration test suites against backend API endpoints.
3. Tests production build bundles for the React frontend.

---

## 👤 Author
**Tarun Kumar**  
Indian Institute of Technology (BHU), Varanasi  
Email: [tarunbjn7@gmail.com](mailto:tarunbjn7@gmail.com) | GitHub: [@Tarun-K8](https://github.com/Tarun-K8)

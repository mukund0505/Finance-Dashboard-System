# Finance Dashboard Backend API

A production-ready RESTful backend API for a Finance Dashboard system, built with **Node.js**, **Express.js**, and **MongoDB**. The system supports multi-role user access, complete financial record management, role-based access control, and aggregation-powered dashboard analytics — all secured with a **JWT dual-token authentication strategy** using access tokens and refresh tokens.

>  **Live API:** `https://your-deployed-link.onrender.com`

---

## What This Project Does

Different users in an organization need different levels of access to financial data. A viewer should only be able to see the dashboard. An analyst should be able to explore summaries and trends. An admin should have full control over records and users. This backend enforces exactly that — cleanly, securely, and consistently.

**Core capabilities built:**

- User registration, login, logout, and token refresh with JWT + refresh token rotation
- Role-based access control with three roles: `viewer`, `analyst`, `admin`
- Full CRUD for financial records with filtering, search, and pagination
- Dashboard analytics APIs powered by MongoDB aggregation pipeline
- Global error handling with consistent response format across all endpoints
- Auto-expiring refresh tokens via MongoDB TTL index

---

## Tech Stack

| Technology | Purpose |
|---|---|
| Node.js + Express.js | Server and REST API framework |
| MongoDB + Mongoose | Database and ODM with schema validation |
| JWT (jsonwebtoken) | Stateless access token authentication |
| bcryptjs | Secure password hashing (12 rounds) |
| express-validator | Request body validation |
| cookie-parser | httpOnly cookie support for refresh tokens |
| helmet | HTTP security headers |
| cors | Cross-origin request support |
| Render | Cloud deployment platform |

---

## API Reference

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login, returns token pair |
| POST | `/api/auth/refresh` | Refresh token | Rotate tokens |
| POST | `/api/auth/logout` | Refresh token | Revoke refresh token |

### Users

| Method | Endpoint | Role | Description |
|---|---|---|---|
| GET | `/api/users` | admin | List all users |
| GET | `/api/users/me` | any | Own profile |
| PATCH | `/api/users/:id` | admin | Update role or status |

### Financial Records

| Method | Endpoint | Role | Description |
|---|---|---|---|
| GET | `/api/records` | all | List records with filters + pagination |
| GET | `/api/records/:id` | all | Single record by ID |
| POST | `/api/records` | admin | Create new record |
| PUT | `/api/records/:id` | admin | Update record |
| DELETE | `/api/records/:id` | admin | Delete record |

### Dashboard Analytics

| Method | Endpoint | Role | Description |
|---|---|---|---|
| GET | `/api/dashboard/summary` | all | Total income, expenses, net balance |
| GET | `/api/dashboard/categories` | analyst, admin | Category-wise totals |
| GET | `/api/dashboard/trends` | analyst, admin | Monthly income/expense trends |
| GET | `/api/dashboard/recent` | analyst, admin | Recent financial activity |

---

## Testing the API

The API is live and fully testable. You can use **Postman**, **Insomnia**, **Thunder Client**, or any HTTP client.

### Base URL

```
https://your-deployed-link.onrender.com
```

**Required environment variables:**

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/finance_dashboard
NODE_ENV=development
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
```

---

*Built with Node.js · Express.js · MongoDB · JWT*

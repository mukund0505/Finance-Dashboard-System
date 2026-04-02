# Finance Dashboard Backend API

A production-ready RESTful backend API for a Finance Dashboard system, built with **Node.js**, **Express.js**, and **MongoDB**. The system supports multi-role user access, complete financial record management, role-based access control, and aggregation-powered dashboard analytics — all secured with a **JWT dual-token authentication strategy** using access tokens and refresh tokens.

>  **Live API:** `https://finance-dashboard-system-9enh.onrender.com`

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
| cors | Cross-origin request support |
| Render | Cloud deployment platform |

---

## Architecture
 
The project follows a strict **5-layer architecture** where each layer has exactly one responsibility:
 
```
Request
   │
   ▼
Routes          → Define URL paths, attach middleware and controllers
   │
   ▼
Middleware       → authenticate (JWT) → authorizeRoles (RBAC) → validate (input)
   │
   ▼
Controllers      → Handle HTTP request/response only, no business logic
   │
   ▼
Services         → All business logic, database queries, aggregations
   │
   ▼
Models           → Mongoose schemas, validation rules, database hooks
   │
   ▼
MongoDB
```
 
### Project Structure
 
```
src/
├── config/
│   └── db.js                    # MongoDB connection
├── models/
│   ├── User.model.js            # User schema with bcrypt hook
│   ├── FinancialRecord.model.js # Record schema with indexes
│   └── RefreshToken.model.js    # Refresh token with TTL index
├── controllers/
│   ├── auth.controller.js
│   ├── user.controller.js
│   ├── record.controller.js
│   └── dashboard.controller.js
├── services/
│   ├── auth.service.js
│   ├── user.service.js
│   ├── record.service.js
│   └── dashboard.service.js
├── middleware/
│   ├── authenticate.js          # JWT verification + live user check
│   ├── authorizeRoles.js        # Role-based access enforcement
│   └── errorHandler.js          # Global error handler
├── routes/
│   ├── auth.routes.js
│   ├── user.routes.js
│   ├── record.routes.js
│   └── dashboard.routes.js
├── validators/
│   ├── auth.validator.js
│   └── record.validator.js
└── utils/
    ├── ApiError.js              # Custom error class
    ├── ApiResponse.js           # Consistent response wrapper
    └── generateTokens.js        # Access + refresh token helpers
```
 
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
https://finance-dashboard-system-9enh.onrender.com
```

### Step 1 — Register a user
 
```http
POST /api/auth/register
Content-Type: application/json
 
{
  "name": "John Admin",
  "email": "admin@example.com",
  "password": "password123",
  "role": "admin"
}
```
 
**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { "id": "...", "name": "John Admin", "email": "admin@example.com", "role": "admin" },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```
 
### Step 2 — Login
 
```http
POST /api/auth/login
Content-Type: application/json
 
{
  "email": "admin@example.com",
  "password": "password123"
}
```
 
Copy the `accessToken` from the response.
 
### Step 3 — Set Authorization Header
 
For all protected routes, add this header:
 
```
Authorization: Bearer <paste_access_token_here>
```
 
### Step 4 — Create a financial record (admin only)
 
```http
POST /api/records
Authorization: Bearer <access_token>
Content-Type: application/json
 
{
  "amount": 50000,
  "type": "income",
  "category": "Salary",
  "date": "2025-01-15",
  "description": "Monthly salary credit"
}
```
 
### Step 5 — View all records
 
```http
GET /api/records
Authorization: Bearer <access_token>
```
 
### Step 6 — View dashboard summary
 
```http
GET /api/dashboard/summary
Authorization: Bearer <access_token>
```
 
**Response:**
```json
{
  "success": true,
  "data": {
    "totalIncome": 50000,
    "totalExpenses": 12000,
    "netBalance": 38000,
    "totalRecords": 5
  }
}
```
 
### Step 7 — Refresh your access token
 
```http
POST /api/auth/refresh
Content-Type: application/json
 
{
  "refreshToken": "<paste_refresh_token_here>"
}
```
 
### Step 8 — Test role restrictions
 
Register a viewer account and try to create a record — you will receive a `403 Forbidden` response, confirming RBAC is enforced correctly.
 
```http
POST /api/auth/register
Content-Type: application/json
 
{
  "name": "Jane Viewer",
  "email": "viewer@example.com",
  "password": "password123",
  "role": "viewer"
}
```
 
Then attempt:
 
```http
POST /api/records
Authorization: Bearer <viewer_access_token>
Content-Type: application/json
 
{
  "amount": 1000,
  "type": "expense",
  "category": "Food"
}
```
 
Expected response:
 
```json
{
  "success": false,
  "message": "Role 'viewer' is not allowed to perform this action"
}
```
 
---
 
## Response Format
 
Every API response — success or error — follows the same consistent structure:
 
**Success:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Records fetched",
  "data": { ... }
}
```
 
**Error:**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": ["Amount must be a positive number"]
}
```

---

## Running Locally
 
```bash
# Clone the repository
git clone https://github.com/your-username/finance-dashboard-backend.git
cd finance-dashboard-backend
 
# Install dependencies
npm install
 
# Create environment file
cp .env.example .env
# Fill in your MONGO_URI and JWT secrets in .env
 
# Start development server
npm run dev
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

# Store Ratings Platform

A full-stack web application where customers can rate stores, administrators can manage users and stores, and store owners can see ratings for their own stores.

Built as a coding challenge using:

- **Backend:** Node.js, Express, TypeScript, PostgreSQL, Knex
- **Frontend:** React, Vite, TypeScript, Tailwind CSS
- **Auth:** JWT-based authentication with role-based access (`user`, `admin`, `store_owner`)

---

## ✨ Features

### 👤 Customer (Normal User)

- Sign up and log in
- View a list of all stores
- Search stores by **name** or **address**
- See for each store:
  - Store name
  - Address
  - Overall rating (average of all ratings)
  - Their own rating (if submitted)
- Submit a new rating (1–5) for a store
- Update their existing rating (optimistic UI + toasts)
- Change password after login
- Logout (protected routes, back button disabled for auth pages)

### 🛠 System Administrator

- Add new **users** (normal users, admins, store owners)
- Add new **stores**, optionally assigning a store owner
- Dashboard showing:
  - Total number of users
  - Total number of stores
  - Total number of ratings submitted
- View list of **users** with:
  - Name, Email, Address, Role, Rating (for store owners)
- View list of **stores** with:
  - Name, Email, Address, Average Rating
- Filter user and store listings by:
  - Name, Email, Address, Role
- View individual user details (including rating if store owner)
- Logout

### 🏪 Store Owner

- Log in with store owner account
- Change password after login
- Dashboard:
  - Cards for each owned store showing average rating and total ratings
- Ratings view:
  - Select one of their stores
  - See all ratings for that store:
    - Customer name
    - Customer email
    - Rating
    - Comment (if provided)
    - Created time
- Logout

---

## 🔐 Demo Accounts

These accounts are pre-created (assuming seed / initial setup has been run):

**Store Owner**

- Email: `owner@gmail.com`
- Password: `Owner@12345`

**Admin**

- Email: `admin@example.com`
- Password: `Admin!2345`

**Customer**

- Email: `johndoe@gmail.com`
- Password: `Johndoe@12345`

> Note: Password policies are enforced (length, uppercase, special char, etc.) for admin-created users.

---

## 🧱 Tech Stack

**Backend**

- Node.js
- Express
- TypeScript
- PostgreSQL
- Knex
- JWT (jsonwebtoken)
- bcrypt (password hashing)
- Joi (admin validation)
- ts-node-dev (development)

**Frontend**

- React (with hooks)
- Vite
- TypeScript
- Tailwind CSS
- Custom UI components (`Button`, `Card`, `Input`)
- `react-hook-form` + schema validation
- `axios` for API calls
- `react-hot-toast` for notifications
- `lucide-react` icons

---

## 📂 Project Structure

At the root:

```txt
.
├── backend/          # Express + PostgreSQL API (TypeScript)
├── frontend/         # React + Vite SPA (TypeScript)
├── docker-compose.yml
└── README.md
```

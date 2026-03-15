# Jeeva Eats - Backend & API Blueprint

This document outlines the database schema and API design for the Jeeva Eats management system.

## 1. Database Schema (Firestore)

### `admins` (Collection)
Manages administrative access and roles.
- `id`: string (auto-gen)
- `username`: string (e.g., "jeevaadmin")
- `password`: string (Plan-text for prototype, hashed in production)
- `role`: "owner" | "manager"
- `name`: string

**Initial Seed:**
- `username`: "jeevaadmin"
- `password`: "Admin@123"
- `role`: "owner"

### `students` (Collection)
Member profiles for mess subscribers.
- `id`: string (Serial Number, e.g., "2401")
- `name`: string
- `mobile`: string
- `email`: string
- `status`: "active" | "blocked"
- `createdAt`: timestamp

### `orders` (Collection)
Transaction records for meal selections.
- `id`: string (e.g., "ORD123")
- `studentId`: string (ref to students/id)
- `studentName`: string (denormalized for speed)
- `items`: array of objects
  - `name`: string
  - `quantity`: number
  - `price`: number
- `total`: number
- `status`: "Pending" | "Dispatched" | "Cancelled"
- `createdAt`: timestamp

### `thali_menu` (Collection)
Configuration for Lunch and Dinner services.
- `id`: "lunch" | "dinner"
- `items`: array of objects
  - `id`: string
  - `name`: string
  - `isCore`: boolean

---

## 2. API Design (Next.js Route Handlers)

Routes will be located in `src/app/api/`.

### Auth
- `POST /api/auth/admin/login`: Validates admin credentials against the `admins` collection.
- `POST /api/auth/student/login`: Validates student serial number and password.

### Menu Management
- `GET /api/menu`: Fetches the current Lunch and Dinner thali configurations.
- `PATCH /api/menu/[type]`: Updates items within a specific thali (Lunch/Dinner).

### Order Operations
- `GET /api/orders`: (Admin) Retrieves all orders with optional status filters.
- `POST /api/orders`: (Student) Places a new order from the cart.
- `PATCH /api/orders/[id]`: (Admin) Updates order status (e.g., to "Dispatched").

### Student Management
- `POST /api/students/register`: (Admin) Onboards a new student.
- `PATCH /api/students/[id]/status`: (Admin) Blocks or activates a student.

---

## 3. Security Design
- **Firestore Rules**: Restricted read/write access. Students can only see their own orders. Admins have full read/write access to all collections.
- **Role Verification**: Admin routes will verify the `role` field from the `admins` collection session.

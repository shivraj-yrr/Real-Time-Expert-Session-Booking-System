# Real-Time Expert Session Booking System

A full-stack real-time expert session booking platform built with:

- React (Frontend)

- Node.js + Express (Backend)

- MongoDB (Database)

- Socket.io (Real-Time Updates)

This system prevents double booking, supports pagination & filtering, and updates available slots instantly across connected clients

## Features

### ✅Expert Listing

- Pagination support

- Filter by category

- Search by name

- Proper loading & error handling
### ✅Expert Details
- View expert details

- Available slots grouped by date

- Real-time slot updates when another user books
### ✅Booking System
- Name, Email, Phone, Date, Slot, Notes

- Server-side validation

- Prevents double booking (database-level protection)

- Slot removed immediately after booking

- Success & error responses handled properly
###My Bookings

- Fetch bookings by email

- Booking status:

    - Pending

    - Confirmed

    - Completed

## 🔒Double Booking Prevention
The system prevents race conditions using a compound unique index in MongoDB:
```javascript
{ expert: 1, date: 1, timeSlot: 1 }
```
Even if two users try to book the same slot at the same time:
- One succeeds

- One fails cleanly

Database enforces consistency.

## ⚡ Real-Time Updates
Uses **Socket.io.**

When a booking is created:

1. Backend emits a slotBooked event

2. Clients subscribed to that expert receive the update

3. Slot is removed instantly in all open browsers

**How to test real-time:**

1. Open the same expert in two browser tabs

2. Book a slot in one tab

3. The slot disappears instantly in the other tab

No page refresh required.


## Project Structure

```
root/
  backend/
    config/
      db.js
    controllers/
      bookingController.js
      expertController.js
    middlewares/
        errorMiddleware.js
    models/
      booking.js
      expert.js
    routes/
      bookingRoutes.js
      expertRoutes.js
    utils/
      validate.js
    seed.js
    server.js
    package.json
  frontend/
    public/
    src/
      pages/
      services/
      App.jsx
      main.jsx
      index.css
    package.json
```

## API

Base URL: `http://localhost:<PORT>` (default `3000`)

### Experts

- `GET /experts`
  - Query params: `page`, `limit`, `category`, `sort`, `search`
  - `sort` supports `createdAt`, `rating`, `experience` (rating/experience are highest-first)

- `GET /experts/:id`
  - Returns a single expert with `availableSlots`

### Bookings

- `POST /bookings`
  - Body:
    ```json
    {
      "expert": "<expertId>",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "phone": "9876543210",
      "date": "2026-02-22",
      "timeSlot": "10:00",
      "notes": "Optional notes"
    }
    ```

- `GET /bookings?email=<email>`
  - Returns bookings for the email, sorted by date and time

- `PATCH /bookings/:id/status`
  - Body:
    ```json
    { "status": "pending" }
    ```
  - Allowed: `pending`, `confirmed`, `completed`

### Socket Events

- Server emits `slotBooked` with `{ expertId, date, timeSlot }` to update UI in real time.

## Installation

### Prerequisites

- Node.js 18+ (recommended)
- MongoDB instance

### Backend Setup

**Install dependencies:**
```
cd backend
npm install
```

Create a `.env` file in `backend/`:

```
MONGO_URL=mongodb://localhost:27017/expertsystem
PORT=3000
```
Seed experts:

```
node seed.js
```

Start the server:

```
node server.js
```

### Frontend
**Install dependencies:**
```
cd frontend
npm install
```
**Start Frontend:**
```
npm run dev
```
By default, the frontend connects to the backend at `http://localhost:3000`. To use a different backend URL, create `frontend/.env` with:
```
VITE_API_URL=http://localhost:3000
```
The variable is used by both Axios and Socket.io. Restart the Vite server after changing it.

The UI will be available at the Vite dev server URL (typically `http://localhost:5173`).

## Notes

- If port `3000` is in use, change `PORT` in `backend/.env`.
- Seeding clears existing experts before inserting sample data.

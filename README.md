# Australian Fitness Aggregator Platform

A full-stack gym discovery and membership platform — search gyms, check in via
QR pass, book classes, and manage memberships, with separate dashboards for
gym owners and platform admins.


---

## Tech stack

| Layer      | Tech |
|------------|------|
| Frontend   | React js, Redux Toolkit, Axios, React Router, Tailwind CSS |
| Backend    | Node.js, Express.js, MongoDB (Mongoose), JWT |
| Bonus      | Dark mode, Google Maps,  QR scanner, Recharts, responsive UI |

---


---

## Modules implemented

| # | Module | Backend | Frontend |
|---|--------|---------|----------|
| 1 | User Authentication (register, login, forgot/reset password, JWT, protected routes) 
| 2 | Gym Listing & Search (search, filters, gym cards) 
| 3 | Gym Detail (gallery, facilities, timetable, map, directions) 
| 4 | QR Pass (dynamic QR, 60-second expiry, backend validation)
| 5 | One Gym Per Day Rule (`POST /api/checkin` with validation) 
| 6 | Membership Plans (subscribe, upgrade, downgrade, cancel, renewal) 
| 7 | User Dashboard (membership, visits, upcoming classes, favourite gym) 
| 8 | Booking System (book/cancel classes, prevent overbooking) 
| 9 | Gym Owner Dashboard (check-ins, revenue, bookings, capacity, analytics) 
| 10 | Admin Dashboard (users, gyms, payments, memberships, reports) 

**Bonus features:** Dark mode · Responsive UI · Google Maps · QR  · Charts 

---

## Quick start

### Prerequisites
- Node.js 18+
- A MongoDB instance — local (`mongod`) or [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier is enough)

###  clone repo
git clone <repository-url>

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# edit .env: set MONGODB_URI, JWT_SECRET, QR_JWT_SECRET
npm run dev            # starts on http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env
# edit .env: set VITE_API_URL=http://localhost:5000/api
# (optional) VITE_GOOGLE_MAPS_API_KEY for the interactive map
npm run dev             # starts on http://localhost:5173
```


## API documentation

Base URL: `http://localhost:5000/api`
Swagger URL: `http://localhost:5000/api-docs`

All protected routes require `Authorization: Bearer <token>`.


---

## Database schema

8 collections, all with Mongoose validation and appropriate indexes:

```
User            name, email (unique), password (hashed), role [user|owner|admin],
                ownedGyms[], favouriteGym, isActive

Gym             name, owner→User, location (GeoJSON, 2dsphere index),
                address, facilities[], images[], timetable[],
                capacity, status [pending|approved|rejected|suspended]

MembershipPlan  name, gym→Gym, price, billingCycle, perks[]

Membership      user→User, gym→Gym, plan→MembershipPlan,
                status [active|cancelled|expired|pending_payment],
                renewalDate, history[]
                (unique index: one active membership per user per gym)

Checkin         user→User, gym→Gym, checkinDate (YYYY-MM-DD),
                checkedInAt, method [qr|manual|geofence]

GymClass        gym→Gym, name, instructor, startTime, endTime,
                capacity, bookedCount, status [scheduled|cancelled|completed]

Booking         user→User, gymClass→GymClass, gym→Gym,
                status [booked|cancelled|attended|no_show]
                (unique index: one active booking per user per class)

Payment         user→User, gym→Gym, membership→Membership, amount,
                status [pending|succeeded|failed|refunded],
                type [subscription|renewal|upgrade|one_off]
```

Full schema definitions with validation rules: `backend/models/*.js`.

---

## Key design decisions

- **One-gym-per-day rule** is enforced in `checkinController.js`, not via a
  unique index — same-gym re-entry must stay allowed while different-gym
  same-day must be blocked, which a plain unique index can't express.
- **QR pass expiry** is a signed JWT with a real 60-second `expiresIn`,
  cryptographically enforced server-side on check-in, not just a frontend
  countdown.
- **Overbooking prevention** uses a MongoDB transaction with an atomic
  so two simultaneous booking requests can't both claim the last spot.
- **Role-based access control**: `role` lives in the JWT;.

---
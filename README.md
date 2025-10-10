# PG/Hostel Management System - Backend

## Tech Stack
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + Bcrypt
- **Validation**: Joi

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file:
   ```bash
   cp .env.example .env
   ```
   Update the values in `.env` file.

3. Start development server:
   ```bash
   npm run dev
   ```

4. Run tests:
   ```bash
   npm test
   ```

## API Documentation

Base URL: `http://localhost:5000/api`

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Rooms
- `GET /api/rooms` - Get all rooms
- `POST /api/rooms` - Create room
- `GET /api/rooms/:id` - Get room by ID
- `PUT /api/rooms/:id` - Update room
- `DELETE /api/rooms/:id` - Delete room

### Tenants
- `GET /api/tenants` - Get all tenants
- `POST /api/tenants` - Create tenant
- `GET /api/tenants/:id` - Get tenant by ID
- `PUT /api/tenants/:id` - Update tenant
- `DELETE /api/tenants/:id` - Delete tenant

### Fees
- `GET /api/fees` - Get all fees
- `POST /api/fees` - Create fee record
- `PUT /api/fees/:id` - Update fee record

### Bills
- `GET /api/bills` - Get all bills
- `POST /api/bills` - Create bill
- `DELETE /api/bills/:id` - Delete bill

## Project Structure

```
src/
 ├── config/         # Configuration files
 ├── controllers/    # Route handlers
 ├── middlewares/    # Custom middlewares
 ├── models/         # Mongoose models
 ├── routes/         # Route definitions
 ├── services/       # Business logic
 ├── repositories/   # Database operations
 ├── utils/          # Helper functions
 ├── validations/    # Validation schemas
 ├── app.js          # Express app setup
 └── server.js       # Entry point
```

# Arys Bilim Innovation School Platform (School Management System)

Fullstack app: **React + Vite + TypeScript** (client), **Node.js + Express + MongoDB** (server).

## 0) Prerequisites (Windows)
- Node.js 18+ (recommended 20)
- Docker Desktop (for MongoDB) OR local MongoDB
- Gmail account with **App Password** (for OTP email verification)

## 1) Project structure
- `server/` Express API + MongoDB
- `client/` React app

## 2) Quick start (MongoDB with Docker)
Open PowerShell in the project root and run:

```powershell
docker run -d --name mongodb -p 27017:27017 mongo
```

Check it:
```powershell
docker ps
```

## 3) Backend setup
```powershell
cd server
copy .env.example .env
npm install
npm run dev
```

### Seed admin (from .env)
In another terminal:
```powershell
cd server
npm run seed:admin
```

If admin already exists, it will not recreate.

## 4) Frontend setup
```powershell
cd client
copy .env.example .env
npm install
npm run dev
```

Frontend: http://localhost:5173  
Backend: http://localhost:4000

## 5) Email verification (Gmail SMTP App Password)
In `server/.env` set:
- `SMTP_USER` = your gmail (example: yourname@gmail.com)
- `SMTP_PASS` = Gmail **App Password** (16 chars)

**How to create App Password**
1) Enable 2-Step Verification in your Google Account.
2) Go to Google Account → Security → App passwords.
3) Create an app password and paste it into `SMTP_PASS`.

## 6) Default routes
- Auth:
  - `POST /api/auth/register`
  - `POST /api/auth/verify-email`
  - `POST /api/auth/login`
- Users:
  - `GET /api/users/me` (auth)
- Achievements:
  - `GET/POST /api/achievements` (auth)
  - `DELETE /api/achievements/:id` (auth)
- Portfolio:
  - `GET /api/portfolio/:userId` (public)
  - `PUT /api/portfolio/me` (auth)
- Graduates:
  - `GET /api/graduates` (public)
  - `GET /api/graduates/:id` (public)
- Admin:
  - `GET /api/admin/users` (admin)
  - `POST /api/admin/create-user` (admin)
  - `GET/POST/PUT/DELETE /api/admin/graduates` (admin CRUD)

## 7) Uploads
Certificates are uploaded to:
- `server/uploads/`

Static served at:
- `http://localhost:4000/uploads/<filename>`

## 8) Troubleshooting
- If email doesn't send:
  - make sure App Password is correct
  - check `SMTP_USER` matches the same Gmail
- If Mongo doesn't connect:
  - ensure container is running: `docker ps`
  - verify `MONGO_URI` in `server/.env`

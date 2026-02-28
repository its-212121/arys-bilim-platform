

# Arys Bilim Innovation School Platform

Fullstack School Management System built with:

- React + Vite + TypeScript
- Node.js + Express
- MongoDB
- JWT Authentication
- Role-based Authorization
- File Upload (Multer)

---

## Features

### Authentication & Authorization
- Register with email verification (OTP)
- Login with JWT
- Role-based access (student / teacher / admin)
- Protected routes

### Student Portfolio
- Add achievements
- Upload certificates (image/pdf)
- Public portfolio page
- About Me & Motivation Letter

###  Graduates Section
- Public graduates list
- Detailed graduate profiles
- Admin-only CRUD

### Admin Panel
- Create teacher/admin accounts
- View all users
- Manage graduates

---

##  Tech Stack

### Frontend
- React
- Vite
- TypeScript
- Tailwind CSS
- React Router

### Backend
- Node.js
- Express
- MongoDB (Mongoose)
- JWT
- Multer
- Nodemailer

---

##  Local Development Setup

###  Start MongoDB (Docker)

```bash
docker run -d --name mongodb -p 27017:27017 mongo
````

Or if container already exists:

```bash
docker start mongodb
```

---

###  Backend Setup

```bash
cd server
cp .env.example .env
npm install
npm run dev
```

To create admin user:

```bash
npm run seed:admin
```

---

###  Frontend Setup

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

Backend runs on:

```
http://localhost:4000
```

---

##  Environment Variables

### Server (.env)

```
PORT=4000
MONGO_URI=mongodb://localhost:27017/arys_bilim
JWT_SECRET=your_secret_here
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_password
SMTP_USER=yourgmail@gmail.com
SMTP_PASS=app_password
```

### Client (.env)

```
VITE_API_URL=http://localhost:4000
```

---

##  Project Structure

```
client/
server/
.gitignore
README.md
```

---

## Security Notes

* `.env` files are excluded from Git
* JWT secret should be changed in production
* SMTP App Password required for OTP emails

---

##  Future Improvements

* Real-time diary system
* Attendance tracking
* Teacher grading panel
* Production deployment (Vercel + Render + Mongo Atlas)

---

## Author

Danial Sman








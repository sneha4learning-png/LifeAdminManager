# 🚀 Life Admin Manager — Document & Deadline Tracker

A production-ready, secure, and mobile-responsive web application to help you manage important documents and never miss a deadline.

---

## ✨ Features
- **Secure Authentication**: JWT-based login and registration with bcrypt password hashing.
- **Document Management**: Add, edit, delete, and track documents like IDs, passports, insurance, and bills.
- **Smart Status Calculation**: Automatic categorization into `Safe`, `Upcoming`, or `Overdue` based on expiry dates.
- **Automated Reminders**: Daily checks for upcoming deadlines with email notifications via `node-cron` & `Nodemailer`.
- **Premium UI**: Modern, mobile-first design with dark/light mode aesthetics, glassmorphism, and smooth animations.

---

## 🛠️ Tech Stack
- **Frontend**: React.js, Tailwind CSS, React Router, React Hook Form, Lucide React, Framer Motion.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose).
- **Other**: node-cron, Nodemailer, Axios, JWT.

---

## 🔐 Security Best Practices
- **No Hardcoded Secrets**: All sensitive data is stored in `.env` files.
- **Input Validation**: Sanitization and validation on both frontend and backend.
- **Private Routes**: Secure access using JWT middleware.
- **Password Hashing**: Bcrypt for storage.
- **Production-Ready**: Error handling that masks stack traces in production.

---

## 🚀 Setup Guide

### 1. Prerequisites
- Node.js (v16+)
- MongoDB (Atlas or local)

### 2. Backend Setup
1. Navigate to the `server` directory: `cd server`
2. Install dependencies: `npm install`
3. Create a `.env` file based on `.env.example`.
4. Run the server: `npm run dev` (using nodemon) or `npm start`.

### 3. Frontend Setup
1. Navigate to the `client` directory: `cd client`
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`.
4. Open the app at `http://localhost:5173`.

---

## 📋 Environment Variables
Ensure you have the following in your `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=...
EMAIL_SERVICE=...
EMAIL_USER=...
EMAIL_PASS=...
NODE_ENV=development
```

---

## 🎨 UI/UX Color Indicators
- 🟢 **Green**: Safe (Beyond 7 days)
- 🟡 **Yellow**: Upcoming (Within 7 days)
- 🔴 **Red**: Overdue (Past expiry)

---

## 🛠️ Dev Mode Credentials
For quick testing, use the following credentials:
- **Email**: `admin@lifeadmin.com`
- **Password**: `password123`
*(A "Auto-Fill" button is also available on the Login page for convenience.)*


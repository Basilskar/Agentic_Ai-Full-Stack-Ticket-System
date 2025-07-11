# 🎫 AI-Powered Ticket Management System

A modern, AI-driven ticketing solution built with **React**, **Node.js**, **MongoDB Atlas**, and **Google Gemini AI**. It intelligently categorizes, prioritizes, and routes tickets using advanced NLP, delivering a seamless experience for support teams and end users.

---

## ✨ Key Features

### 🤖 AI-Powered Intelligence
- **Automatic Ticket Categorization** – Smart tagging using Gemini AI
- **Priority Prediction** – AI predicts urgency level
- **Skill-Based Moderator Assignment** – Assigns tickets to the most relevant team member
- **Sentiment Analysis** – Understand user tone and urgency for better handling

### 💻 User Interface
- **Built with Google Material-UI** – Clean, accessible, and responsive design
- **Progressive Web App (PWA)** – Offline access and app-like experience

### 🔐 Authentication & Authorization
- **JWT Authentication** – Secure login
- **Role-Based Access** – Supports Admin, Moderator, and User roles

### 🛠️ Ticket Management
- **Full CRUD** – Create, view, edit, and delete tickets
- **Status Lifecycle** – Track tickets across Open, In Progress, Resolved, and Closed
- **Comments & File Attachments** – Collaborate easily within tickets

### 🔔 Notifications
- **Email Alerts** – For new assignments and status changes (via Mailtrap)
- **Optional Slack Integration** – (Planned) for team communication

### 🔍 Productivity Tools
- **Search & Filters** – Find tickets fast
- **Bulk Actions** – Manage multiple tickets efficiently

---

## 🏗️ Tech Stack

| Layer       | Tools & Technologies                    |
|-------------|----------------------------------------|
| Frontend    | React 18, Material-UI 5, Axios        |
| Backend     | Node.js, Express.js, MongoDB Atlas    |
| AI Layer    | Google Gemini AI (via custom AI service) |
| Deployment  | Vercel (frontend), Render (backend)   |

---

## 🚀 Getting Started

### 📦 Prerequisites

- **Node.js v16+**
- **MongoDB Atlas account**
- **Google Gemini API access**
- **Vercel account** (for frontend)
- **Render account** (for backend)
- **Mailtrap account** (for email testing)

---

## ⚙️ Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

### Backend Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
MONGO_URI=mongodb+srv://your-username:your-password@cluster0.mongodb.net/ticket-management?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-here
MAILTRAP_SMTP_HOST=sandbox.smtp.mailtrap.io
MAILTRAP_SMTP_PORT=2525
MAILTRAP_SMTP_USER=your-mailtrap-user
MAILTRAP_SMTP_PASS=your-mailtrap-password
GEMINI_API_KEY=your-gemini-api-key
APP_URL=http://localhost:3000
PORT=5000
NODE_ENV=development

# Inngest Configuration
INNGEST_SIGNING_KEY=your-inngest-signing-key
INNGEST_EVENT_KEY=your-inngest-event-key
```

> **Replace placeholders with your actual credentials and settings.**

---

## ⚙️ Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

### Frontend Environment Variables

Create a `.env` file in the `frontend` directory with the following variables:

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ENV=development
```

> **For production, update `REACT_APP_API_URL` to your deployed backend API URL (e.g., your Render service URL).**

---

## 🏃 Running the Application

### Local Development

1. **Start the backend server:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start Inngest local development server:**
   ```bash
   npx inngest-cli@latest dev
   ```
   
   > **Note:** For production, connect with Inngest Cloud instead of running local dev server.

3. **Start the frontend development server:**
   ```bash
   cd frontend
   npm start
   ```

### Production

1. **Start the backend:**
   ```bash
   cd backend
   npm start
   ```

2. **Start the frontend:**
   ```bash
   cd frontend
   npm start
   ```

---

## 🎯 Usage

- **End Users:** Sign up, submit tickets, track progress, and communicate with support
- **Support Team:** View assigned tickets, update status, add comments, resolve issues
- **Administrators:** Manage users, assign roles, view analytics, and configure settings

---

## 🚀 Deployment

- **Frontend:** Deploy to [Vercel](https://vercel.com/)
- **Backend:** Deploy to [Render](https://render.com/)

---

## 🔒 Security

- **Password Hashing:** bcrypt
- **JWT Authentication:** Secure token-based login
- **Input Validation:** Sanitize user inputs
- **CORS Protection:** Configured for security

---

## 📝 Tips for Production

- **Update API URLs:** Ensure your frontend points to the correct backend URL in production
- **Environment Variables:** Set all required variables in Vercel and Render dashboards
- **Rotate Secrets:** Regularly update sensitive keys and credentials

---

AI-Powered Ticket Management System 
A streamlined ticket management system built with React, Node.js, MongoDB, and Google Material-UI. Uses Google Gemini AI for intelligent ticket categorization, routing, and assignment.

✨ Key Features
AI-Powered Intelligence

Automatic ticket categorization

Smart priority assignment

Skill-based routing

Sentiment analysis for urgency and tone

Modern Google Material-UI Design

Clean, responsive, accessible interface

Secure Authentication

JWT-based login

Role-based access (Admin, Moderator, User)

Ticket Management

Create, read, update, and delete tickets

Status tracking (Open, In Progress, Resolved, Closed)

Comment system and file attachments

Notifications

Email and in-app notifications

Optional Slack integration

Advanced Features

Search and filtering

Bulk operations

PWA and offline capability

🏗️ Stack Overview
Layer	Technologies/Tools
Frontend	React 18, Material-UI 5, Axios
Backend	Node.js, Express.js, MongoDB
AI	Google Gemini AI, NLP
Deployment	Vercel (frontend), Node.js (API)
🚀 Quick Start
Prerequisites
Node.js (v16 or higher)

MongoDB (v4.4 or higher)

npm or yarn

Installation
Clone the repository

bash
git clone https://github.com/yourusername/ai-ticket-management.git
cd ai-ticket-management
Install Backend Dependencies

bash
cd backend
npm install
Install Frontend Dependencies

bash
cd ../frontend
npm install
Environment Setup

Create .env file in the backend directory:

text
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
Database Setup

bash
# Start MongoDB (if running locally)
mongod
# Or use MongoDB Atlas (cloud) - update MONGO_URI in .env
Start the Application

Backend:

bash
cd backend
npm run dev
Frontend:

bash
cd ../frontend
npm start
Inngest Local Dev Server (if using Inngest):

bash
npx inngest-cli@latest dev
Access the Application

Frontend: http://localhost:3000

Backend API: http://localhost:5000

🔧 Configuration
Google Gemini AI

Visit Google AI Studio

Create a new API key

Add the key to .env as GEMINI_API_KEY

Email (Development)

Use Mailtrap for SMTP testing

🎯 Usage
End Users: Sign up, submit tickets, track progress, communicate

Support Team: View assigned tickets, update status, add comments, resolve issues

Administrators: Manage users, assign roles, view analytics, configure settings

🧪 Testing
Backend Tests

bash
cd backend
npm test
Frontend Tests

bash
cd frontend
npm test
🚀 Deployment
Frontend: Deploy to Vercel

Backend: Deploy to your preferred Node.js hosting provider

🔒 Security
Password Hashing: bcrypt

JWT Authentication: Secure token-based login

Input Validation: Sanitize user inputs

CORS Protection: Configured for security

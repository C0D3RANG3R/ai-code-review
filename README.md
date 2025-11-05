# 🤖 AI Code Reviewer Application

This project is a **full-stack AI-powered code reviewer** built using the **Google Gemini API**.  
It instantly provides **expert-level code reviews** with actionable feedback and metrics.  
Backend URL: 
The application is structured as a **monorepo**, separating backend and frontend logic for better scalability and maintainability.

---

## 🗂️ Project Structure

The project consists of two main subfolders, managed from the root directory:

| Folder | Technology | Purpose |
|--------|-------------|----------|
| **backend/** | Node.js, Express, Gemini API | Hosts the REST API, manages environment secrets, handles API requests to Google Gemini, and implements robust error handling. |
| **frontend/** | React, Vite, Tailwind CSS | Provides the user interface with a code editor, API integration, and structured AI review display. |

---

## 🌐 Production URLs

| Service | URL |
|----------|-----|
| **Frontend (Vercel)** | [https://ai-code-review-dun.vercel.app/](https://ai-code-review-dun.vercel.app/) |
| **Backend (Render)** | [https://ai-code-review-backend.onrender.com](https://ai-code-review-backend.onrender.com) |

> The frontend communicates with the backend’s `/ai/get-review` endpoint for AI-powered review generation.

---

## 🚀 Getting Started

Follow these steps to set up and run the application locally.

### 1️⃣ Prerequisites

Ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)  
- **npm** (comes with Node.js)  
- **Gemini API Key** – Obtain from [Google AI Studio](https://aistudio.google.com/u/1/api-keys)

---

### 2️⃣ Installation

Install dependencies for all directories (root, backend, frontend) by running:

```bash
npm run install:all
```

> 💡 This command installs dependencies for all subprojects automatically.

---

### 3️⃣ Environment Variables

Two separate `.env` files must be created for secure configuration.  
These files are ignored by `.gitignore` — **never commit them**.

#### 🧠 Backend Configuration (`backend/.env`)

```env
# CRITICAL: Replace with your actual Gemini API Key
GOOGLE_GEMINI_KEY="YOUR_ACTUAL_GEMINI_API_KEY_HERE"

# Server configuration
PORT=8000
NODE_ENV=development

# IMPORTANT: Must match the frontend URL for CORS security
CLIENT_URL="http://localhost:5173"
```

#### 💻 Frontend Configuration (`frontend/.env.local`)

```env
# Set this to the backend’s running address
VITE_API_URL="http://localhost:8000"
```

---

### 4️⃣ Running Locally

From the **root directory**, run:

```bash
npm run start:dev
```

This uses **concurrently** to start both backend and frontend together.  
Once started, visit your app at:

👉 **http://localhost:5173**

---

## 🖥️ Available Scripts (Root)

| Script | Command | Description |
|---------|----------|-------------|
| **install:all** | `npm run install:all` | Installs dependencies in root, backend, and frontend. |
| **start:dev** | `npm run start:dev` | Starts both backend and frontend in development mode (Recommended). |
| **build** | `npm run build` | Builds the frontend for production and generates `/dist`. |
| **start** | `npm run start` | Starts the production backend server (requires a frontend build). |

---

## 📘 AI Review Output Format

The AI is configured with strict system instructions to ensure **consistent, senior-level feedback**.

Each review follows this **markdown structure**:

```markdown
## ❌ Issues Found

- Detailed explanation of logic, syntax, or performance issues.

## ✅ Recommended Fix
```js
// Complete corrected version of the code

## 💡 Improvements Summary

- Suggestions to enhance readability, maintainability, and best practices.

## 📊 Key Metrics

| Metric | Score (out of 10) |
|---------|-------------------|
| Performance | 🔹 |
| Readability | 🔹 |
| Security | 🔹 |
```

---

## 🧩 Tech Stack Summary

| Layer | Technology |
|-------|-------------|
| **Backend** | Node.js, Express, Google Gemini API |
| **Frontend** | React, Vite, Tailwind CSS |
| **Communication** | REST API |
| **AI Engine** | Google Gemini (Code Understanding & Review) |

---

## 🛡️ Notes

- Never expose your API key publicly.  
- Ensure CORS settings match frontend and backend URLs.  
- For deployment, use production builds and secure environment configurations.

---

### 💬 Author

Developed with ❤️ to help developers get **instant, AI-powered code reviews**.

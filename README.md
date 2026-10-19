# 🌿 Harbor Garden — Royal Botanical Living

> A full-featured, luxury botanical management web application with a built-in authentication portal, role-based access control, local JSON database, and a Node.js API server.

[![Live Demo](https://img.shields.io/badge/Demo-Live_Website-10b981?style=for-the-badge&logo=githubpages&logoColor=white)](https://mohdmoazzamq-pixel.github.io/harbor-garden/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/mohdmoazzamq-pixel/harbor-garden)

---

## 🌐 Live Demo & Shareable Link

Experience Harbor Garden live directly in your browser:

👉 **Live Demo:** [https://mohdmoazzamq-pixel.github.io/harbor-garden/](https://mohdmoazzamq-pixel.github.io/harbor-garden/)

You can share this link with anyone to explore the botanical catalog, services, shopping cart, and security portal without any local setup or installation!

---

## 📸 Preview

| Home — Botanical Catalog | Services Page | Security Portal |
|:---:|:---:|:---:|
| Filter & browse plants | Browse garden services | Login / Signup with RBAC |

---

## 🌟 About the Project

**Harbor Garden** is a richly styled botanical catalogue and garden management platform built with pure **HTML, CSS, and JavaScript** on the frontend, backed by a lightweight **Node.js** web + REST API server. It allows users to browse a curated collection of flowers and plants, read growing guides, submit service inquiries, and manage the catalogue — all governed by a role-based security portal.

The project features a distinctive **Harbor Royal** dark gold & emerald design theme (`harbor-theme.css`) that gives it a luxury estate aesthetic throughout every page.

---

## 🗂️ Project Structure

```
My garden/
│
├── index.html            # 🏠 Home — Botanical plant/flower catalogue with dynamic cards
├── about.html            # ℹ️ About — Mission, plant types, and team information
├── services.html         # 🛠️ Services — Garden design, planting, and care services
├── contact.html          # 📬 Contact — Service inquiry form (saved to local DB)
├── database.html         # 📊 Database — Admin view of all inquiries & audit logs
├── portal.html           # 🛡️ Security Portal — User management & audit dashboard
├── login.html            # 🔑 Login / Sign Up page
├── forgot-password.html  # 🔒 Password recovery page
│
├── harbor-theme.css      # 🎨 Global luxury dark Harbor design theme
├── style.css             # Additional global styles
├── about.css             # About page specific styles
├── services.css          # Services page specific styles
├── contactus.css         # Contact page specific styles
│
├── auth.js               # 🔐 HarborAuth — Authentication, RBAC & session manager
├── db.js                 # 💾 HarborDB — Client-side local storage data engine
├── server.js             # 🚀 Node.js web server + REST API (zero dependencies)
│
├── package.json          # Node.js project config
├── start.bat             # Windows quick-start script
│
└── data/                 # 📁 JSON flat-file database (auto-created by server)
    ├── users.json        # Registered user accounts
    ├── contacts.json     # Contact/service inquiry submissions
    ├── plants.json       # Custom plant listings added by Authors
    └── audit.json        # Server & security audit log
```

---

## ✨ Features

### 🌸 Botanical Catalogue (Home Page)
- Dynamic flower/plant card grid populated from **HarborDB**
- Filter by **Spring Bloomers**, **Summer & Fall**, or **Custom Listed**
- Each card shows: plant image, bloom season, scientific name, speciality description
- **"How to Grow" modal** — step-by-step growing guide with specs (sunlight, hydration, bloom period)
- **Add New Plant** form (restricted to **Author** role only) with preset image picker

### 🛡️ Security Portal & Authentication
- **Sign Up / Sign In** with persistent session via `localStorage`
- **Role-Based Access Control (RBAC)**:
  - 👑 **Author** — Can list new plants, view the inquiries database, audit logs, and manage users
  - 👤 **User / Member** — Can browse the catalogue and submit contact inquiries
- **Forgot Password** recovery flow
- **2FA support** flag on user accounts
- Live security score per user profile

### 📊 Local Database (Admin Panel)
- View all **contact/service inquiries** submitted through the site
- View **all registered users** (passwords masked)
- View **audit logs** of server events
- Real-time status management for inquiries (New → In Progress → Resolved)

### 📬 Contact & Services
- **6 Garden Services**: Garden Design, Plant Installation, Seasonal Maintenance, Organic Care, Landscape Architecture, Irrigation Systems
- Contact form with service selection, name, email, mobile, and message
- Submissions stored persistently via the Node.js API

### 🎨 Harbor Royal Theme
- Dark luxury design with **deep navy** background, **gold** accents, and **emerald green** highlights
- Glassmorphism cards with subtle glows and hover animations
- Fully **responsive** — mobile-friendly hamburger navigation
- Custom toast notification system for all user actions

---

## 🛠️ Tech Stack

| Technology | Usage |
|---|---|
| **HTML5** | Semantic page structure across all pages |
| **CSS3** | Custom luxury Harbor theme, responsive grid layouts, animations |
| **Vanilla JavaScript** | Dynamic UI, DOM manipulation, localStorage data engine |
| **Node.js** (built-in modules only) | Web server + REST API — **zero npm dependencies** |
| **JSON flat files** | Lightweight persistent storage for users, contacts, plants, audit |

> ⚡ **No frameworks, no build tools, no npm packages required.** The server uses only Node.js built-in modules (`http`, `fs`, `path`, `url`).

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v14 or higher

### Installation & Running

**Option 1 — Windows Quick Start (Recommended)**
```bat
double-click start.bat
```

**Option 2 — Command Line**
```bash
# Navigate into the project folder
cd "My garden"

# Start the server
node server.js
```

**Option 3 — npm start**
```bash
cd "My garden"
npm start
```

The server starts on **http://localhost:3000** (auto-increments port if 3000 is busy).

```
🌿 HARBOR ROYAL GARDEN • WEB & DATABASE SERVER
======================================================
📍 Web Application:  http://localhost:3000/
🛡️ Harbor Login:     http://localhost:3000/login.html
🔑 Forgot Password:  http://localhost:3000/forgot-password.html
📊 Local Database:   http://localhost:3000/database.html
```

---

## 🔑 Default Demo Accounts

| Name | Email | Password | Role |
|---|---|---|---|
| Alex Morgan | `alex.morgan@harbor.io` | `Harbor@2026` | 👑 Author |
| Moazzam Qureshi | `moazzam@mygarden.com` | `Garden@2026` | 👑 Author |
| Elena Vance | `user@mygarden.com` | `User@2026` | 👤 User |

> **Note:** These accounts are seeded automatically when the server first starts. Authors can add plants and access the full admin database. Users can only browse and submit inquiries.

---

## 🌐 REST API Endpoints

The Node.js server exposes a simple REST API at `http://localhost:3000`:

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/plants` | Get all custom-listed plants |
| `POST` | `/api/plants` | Add a new plant to the catalogue |
| `GET` | `/api/contacts` | Get all contact inquiries |
| `POST` | `/api/contacts` | Submit a new contact inquiry |
| `GET` | `/api/users` | Get all users (passwords masked) |
| `POST` | `/api/auth/register` | Register a new user account |
| `POST` | `/api/auth/reset-password` | Reset a user's password |
| `GET` | `/api/audit` | Get all audit log entries |

---

## 📄 Pages Overview

| Page | URL | Description |
|---|---|---|
| Home / Catalogue | `/index.html` | Browse all botanical species with filters and growing guides |
| About | `/about.html` | Our mission, plant categories, and garden philosophy |
| Services | `/services.html` | Explore all 6 professional garden services |
| Contact | `/contact.html` | Submit a service inquiry (saved to database) |
| Database | `/database.html` | Admin dashboard — inquiries, users, and audit logs |
| Security Portal | `/portal.html` | User management and security overview |
| Login | `/login.html` | Sign in or create a new account |
| Forgot Password | `/forgot-password.html` | Password recovery |

---

## 📍 Contact Information

- **Address:** 123 Green Garden Road, Haldwani, Uttarakhand, India
- **Phone:** +91 98765 43210
- **Email:** info@mygarden.com

---

## 👨‍💻 Author

**Mohd Moazzam**
- GitHub: [@mohdmoazzamq-pixel](https://github.com/mohdmoazzamq-pixel)

---

## 📜 License

This project is licensed under the **MIT License** — feel free to use, modify, and distribute it.

---

<p align="center">
  🌿 Built with passion for nature and clean code &bull; Harbor Garden &copy; 2026
</p>

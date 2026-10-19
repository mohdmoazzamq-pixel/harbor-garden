# 🌿 Harbor Garden — Royal Botanical Living & Flora Boutique (v3.0)

> A full-featured, luxury botanical e-commerce and garden management platform with built-in authentication portal, role-based access control, shopping cart, multi-step delivery & payment checkout, 3-step service bookings with flower pairing, author management controls, local database, and a zero-dependency Node.js REST API server.

[![Live Demo](https://img.shields.io/badge/Demo-Live_Website-10b981?style=for-the-badge&logo=githubpages&logoColor=white)](https://mohdmoazzamq-pixel.github.io/harbor-garden/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/mohdmoazzamq-pixel/harbor-garden)

---

## 🌐 Live Demo & Shareable Link

Experience Harbor Garden live directly in your browser:

👉 **Live Demo:** [https://mohdmoazzamq-pixel.github.io/harbor-garden/](https://mohdmoazzamq-pixel.github.io/harbor-garden/)

You can share this link with anyone to explore the botanical catalog, services, shopping cart, and security portal without any local setup or installation!

---

## 📸 Preview & Highlights

| 🌸 Flower Shop & Catalog | 🛒 Cart & Checkout | 🛠️ 3-Step Service Booking | 🛡️ Security & Recovery |
|:---:|:---:|:---:|:---:|
| Search, filter, prices (₹), Buy Now | Floating Cart FAB, drawer, address & payment | Bundle companion flowers, site scheduling, billing | RBAC Author/User, email OTP reset gateway |

---

## 🌟 About the Project

**Harbor Garden** is an end-to-end botanical e-commerce platform and estate horticultural management suite built with pure **HTML5, CSS3, and modern Vanilla JavaScript**, supported by a lightweight **Node.js** web + REST API server with **zero external dependencies**.

It empowers customers to search and purchase heirloom Himalayan flowers, manage an interactive shopping cart, select delivery addresses, and pay via UPI, Cards, Net Banking, or Cash on Delivery. Customers can also schedule professional gardening services through an interactive **3-step booking flow** that allows bundling nursery flowers directly with the service.

The entire platform is governed by an **Author vs. User Role-Based Access Control (RBAC)** security portal. Authors can list new plants with pricing, introduce custom services, publish heritage about cards, and inspect real-time database inquiries and security audit trails.

---

## 🗂️ Project Structure

```
My garden/
│
├── index.html            # 🏠 Home — Flower Shop, Real-Time Search, Cart Drawer & Multi-Step Checkout
├── services.html         # 🛠️ Services — Dynamic service listings & 3-Step Service Booking Flow
├── about.html            # ℹ️ About — Botanical heritage, mission, dynamic About Cards & horticultural tips
├── contact.html          # 📬 Contact — Custom inquiry form (persisted in local DB & syncs to API)
├── database.html         # 📊 Database — Admin inquiries management & audit logs (Author only)
├── portal.html           # 🛡️ Security Portal — User management, 2FA & security score dashboard
├── login.html            # 🔑 Login / Sign Up — Gateway with password strength meter & demo quick-fills
├── forgot-password.html  # 🔒 Password Recovery — 4-step cryptographic OTP verification & reset
│
├── harbor-theme.css      # 🎨 Royal Harbor Theme (Gold, Emerald, White Canvas, Keyframe Animations)
├── style.css             # Additional layout styles
├── about.css             # About page specific styles
├── services.css          # Services page specific styles
├── contactus.css         # Contact page specific styles
│
├── auth.js               # 🔐 HarborAuth — Session manager, RBAC navbar & toast notifications
├── db.js                 # 💾 HarborDB — Client database engine (Cart, Orders, Services, About Cards)
├── server.js             # 🚀 Node.js server + REST API (Zero dependencies, persistent flat JSON storage)
│
├── package.json          # Node.js project config
├── start.bat             # Windows one-click start launcher
│
└── data/                 # 📁 Flat-file JSON database (auto-seeded by server)
    ├── plants.json       # Custom botanical listings added by Authors
    ├── services.json     # Custom garden services added by Authors
    ├── about-cards.json  # Custom heritage story cards added by Authors
    ├── orders.json       # Customer plant orders & service bookings
    ├── contacts.json     # Inquiries submitted via Contact form
    ├── users.json        # User profiles & role credentials
    └── audit.json        # Security and administrative audit trail
```

---

## ✨ Comprehensive Features (v3.0)

### 🌸 Botanical Flower Shop (`index.html`)
- **Real-Time Flower Search Bar:** Instant client-side filtering by flower name, botanical title, season, or speciality.
- **Season Category Pills:** Quick-switch between All, Spring Bloomers, Summer & Fall, and Custom Listed.
- **Prominent Flower Pricing:** All flowers display clear prices in Indian Rupees (₹), e.g., Peony (₹450), Sunflower (₹180), Azalea (₹520).
- **Seller / Author Pricing Control:** When Authors list new plants via the "+ List New Plant" modal, they specify the price in ₹ alongside botanical specs.
- **Buy Section on Every Flower Card:**
  - `🛒 Add to Cart`: Increments cart quantity, triggers cart badge count update, and plays a luxury toast alert.
  - `⚡ Buy Now`: Adds plant to cart and immediately opens the checkout modal.
  - `🌱 How to Grow Guide`: Opens an extensive modal detailing sunlight, hydration, bloom period, and growing instructions.
  - `🗑️ Delete Plant`: Author-exclusive button to remove custom plants.

### 🛒 Floating Cart & Slide-Out Drawer
- **Floating Cart FAB:** Fixed bottom-right button with dynamic item count badge and bounce animation on item addition.
- **Interactive Slide-Out Drawer:** Shows cart thumbnail, unit price, quantity steppers (`-` / `+`), item deletion, subtotal calculation, and clear cart option.
- **Free Delivery Threshold:** Automatic complimentary shipping on orders over ₹999 (standard shipping: ₹99).

### 📦 Customer Delivery & Multi-Step Checkout
- **Step 1: Delivery Address:** Customer Full Name, Mobile Phone, Email, Delivery Street Address, City, and Pincode (auto-filled if signed in).
- **Step 2: Payment Gateway:**
  - 📱 **UPI / QR** (Google Pay, PhonePe, Paytm, BHIM, UPI ID input).
  - 💳 **Credit / Debit Cards** (Visa, Mastercard, RuPay).
  - 🏦 **Net Banking** (All major Indian banks).
  - 💵 **Cash on Delivery (COD)** (Pay upon inspection).
- **Step 3: Order Confirmation:** Celebratory confirmation modal displaying the generated Order ID (`HBR-XXXX-XXX`), delivery summary, payment mode, and estimated transit time.

### 🛠️ Garden Services & 3-Step Booking (`services.html`)
- **Dynamic Service Catalog:** Garden Design (₹4,999), Plant Installation (₹2,499), Seasonal Maintenance (₹1,499), Organic Care (₹1,999), Landscape Architecture (₹8,999), and Smart Irrigation (₹5,499).
- **Author Service Creator:** Authors can introduce new services with custom icons, pricing, duration, description, and cover images.
- **Interactive 3-Step Customer Booking Flow:**
  - **Step 1: Service Confirmation & Add Flower Section:** Confirms selected service and allows customers to bundle companion nursery flowers directly with the service!
  - **Step 2: Service Site Address:** Estate location, contact information, preferred service date, and appointment time slot (Morning / Afternoon / Evening).
  - **Step 3: Itemized Billing & Payment:** Complete billing summary (Base Service + Selected Plants + Complimentary Dispatch = Grand Total) and payment choice (UPI, Card, Net Banking, or Pay After Service).
  - **Booking Reference:** Generates instant Booking Reference ID (`HBR-SVC-XXXX`).

### 📖 Heritage & Dynamic About Cards (`about.html`)
- **Author-Managed Story Cards:** Authors can add new milestone cards with custom emoji icons, titles, subtitles, cover images, and narratives.
- **Horticultural Classifications:** Explanations of Perennials, Biennials, and Annuals.
- **Best Practices:** Deep morning watering, pine mulching, deadheading, and organic soil balancing.

### 🔒 Security Portal, RBAC & Email OTP Recovery
- **Role-Based Access Control:**
  - 👑 **Author:** Full administrative privileges (list/delete flowers, add services, add about cards, inspect database, view audit logs).
  - 👤 **User / Member:** Customer shopping, cart management, and booking inquiries.
- **Password Recovery (`forgot-password.html`):**
  - Step 1: User enters registered email.
  - Step 2: 6-digit cryptographic security code is generated and dispatched (with simulated email gateway and console broadcast), valid for 15 minutes. Supports clipboard paste.
  - Step 3: Verified user sets new password (with confirmation and minimum character checks).
  - Step 4: Instant confirmation and redirect to sign in.

---

## 🔑 Demo Accounts

| Name | Email | Password | Role & Clearance |
|---|---|---|---|
| **Alex Morgan** | `alex.morgan@harbor.io` | `Harbor@2026` | 👑 **Author** (Full Access) |
| **Moazzam Qureshi** | `moazzam@mygarden.com` | `Garden@2026` | 👑 **Author** (Full Access) |
| **Elena Vance** | `user@mygarden.com` | `User@2026` | 👤 **User** (Member / Shopping) |

> ⚡ **Quick Test Tip:** On `login.html`, click either "⚡ Sign In as Author (Alex Morgan)" or "👤 Sign In as Member (Elena Vance)" for one-click authentication.

---

## 🌐 REST API Endpoints

The native Node.js server (`server.js`) operates on port 3000 (or the next available port):

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/plants` | Fetch all botanical species and custom additions |
| `POST` | `/api/plants` | Publish a new plant listing (Author) |
| `GET` | `/api/services` | Fetch all active gardening services |
| `POST` | `/api/services` | Introduce a new service (Author) |
| `GET` | `/api/about-cards` | Fetch all heritage story cards |
| `POST` | `/api/about-cards` | Publish a new about card (Author) |
| `GET` | `/api/orders` | Retrieve customer orders and service bookings |
| `POST` | `/api/orders` | Record a customer order or booking |
| `GET` | `/api/contacts` | Retrieve customer contact inquiries |
| `POST` | `/api/contacts` | Submit a new contact inquiry |
| `POST` | `/api/auth/send-otp` | Dispatch 6-digit password recovery code to email |
| `POST` | `/api/auth/reset-password` | Update account password using verified token |
| `GET` | `/api/audit` | Fetch cryptographic security audit log (Author) |

---

## 🚀 How to Run

### Method 1: Windows One-Click (Recommended)
Double-click `start.bat` in the project folder.

### Method 2: Command Line
```bash
# Navigate to the project directory
cd "E:\HTML & CSS\My garden"

# Start the server (zero external dependencies required)
node server.js
```

Open your browser to: **http://localhost:3000/**

---

## 👨‍💻 Author

**Mohd Moazzam**
- GitHub: [@mohdmoazzamq-pixel](https://github.com/mohdmoazzamq-pixel)
- Repository: [harbor-garden](https://github.com/mohdmoazzamq-pixel/harbor-garden)

---

<p align="center">
  🌿 Crafted with passion for botanical living &bull; Harbor Garden &copy; 2026
</p>

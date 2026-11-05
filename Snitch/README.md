# NOIRVAYN // Technical Streetwear & Atelier E-Commerce

Noirvayn is a production-grade full-stack e-commerce web application engineered for a modern luxury streetwear label. It combines an editorial brutalist user interface with a hardened Node.js/Express backend, secure Razorpay checkout, live catalog search, and automated order confirmation emails.

---

## Architecture Overview

```
Snitch/
├── Backend/                 # Express 5 REST API (ESM)
│   ├── src/
│   │   ├── config/          # Environment, CORS, and cookie settings
│   │   ├── controllers/     # Auth, Cart, Product, and Payment business logic
│   │   ├── dao/             # Data access layer (stock, inventory queries)
│   │   ├── middlewares/     # JWT authentication, rate limiting, error handling
│   │   ├── models/          # Mongoose schemas (User, Product, Cart, Payment)
│   │   ├── routes/          # Express route definitions
│   │   ├── services/        # Razorpay integration, Nodemailer email transport
│   │   ├── templates/       # Responsive HTML order confirmation email templates
│   │   ├── utils/           # Standardized ApiError & ApiResponse envelopes
│   │   └── validator/       # Express-validator request sanitization schemas
│   ├── .env.example
│   ├── server.js            # HTTP server entry point
│   └── package.json
│
└── Frontend/                # React 19 + Vite Single Page Application
    ├── src/
    │   ├── app/             # Root routing, global layout, and 404 page
    │   ├── components/      # Reusable UI controls, navbar, custom cursor, modals
    │   ├── features/
    │   │   ├── auth/        # Login, registration, OAuth, and profile popover
    │   │   ├── cart/        # Slide-over cart drawer, quantity state, Razorpay modal
    │   │   └── products/    # Home sections, runway catalog, product detail pages
    │   ├── lib/             # Utility helpers (clsx, tailwind-merge)
    │   └── store/           # Redux Toolkit global state slices
    ├── public/              # Lookbook assets, model photography, webp mockups
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## Tech Stack

### Frontend
- **React 19** with Vite for fast local HMR and production bundle optimization
- **Tailwind CSS v4** for styling and fluid responsive layout grids
- **Motion (Framer Motion)** for scroll-driven animations and editorial transitions
- **Lenis** for inertial smooth-scrolling momentum across home catalog strips
- **Redux Toolkit** for cart, product catalog, and user session state
- **Lucide React** for lightweight system iconography

### Backend
- **Node.js (ESM)** & **Express 5**
- **MongoDB** & **Mongoose** for data modeling and transactions
- **Razorpay SDK** for payment order creation and webhook/signature verification
- **Nodemailer** for asynchronous, non-blocking transactional order confirmation emails
- **Passport.js & JWT** for standard email/password registration and Google OAuth 2.0
- **Helmet & Express-Rate-Limit** for security headers and brute-force mitigation
- **ImageKit** for product asset hosting and image transformations

---

## Core Engineering Features

### 1. Brutalist Editorial Frontend
- **Custom Cursor Engine:** Obsidian hairline pointer tracking mouse coordinates, automatically disabled on mobile/touch screens (`@media (pointer: coarse)`) and auth pages for native input accessibility.
- **Horizontal Runway Strip:** Scroll-pinned product showcase utilizing Lenis momentum and direct CSS transforms without page jitter.
- **Interactive 404 Page:** 1:1 procedural 2D ASCII Knight canvas with dynamic wind physics, waving red cloak, and swaying grass blades rendered in real time.
- **Universal Responsiveness:** Tested across 320px mobile displays (e.g., iPhone SE, Galaxy Fold), standard tablets, laptops, and ultra-wide screens.

### 2. Live Catalog Search (`Ctrl+K`)
- Instant modal triggered via keyboard shortcut or navbar icon.
- Debounced server-side regex search coupled with local Redux store caching for zero-latency queries.
- Trending tags filter for one-click discovery.

### 3. Payment & Order Verification
- Server-side Razorpay order generation based on current cart items and stock check.
- Cryptographic HMAC SHA256 signature validation before marking orders as `SUCCESS`.
- Automatic cart cleanup upon confirmed payment.

### 4. Automated Transactional Emails
- Once payment is verified, the backend dispatches a high-contrast editorial order confirmation email.
- Displays order reference `#NV-ORD-...`, itemized list with product thumbnails, subtotal, shipping status, and customer shipping address.
- Table-based inline CSS compatible with Gmail, Apple Mail, Outlook, and mobile email clients.
- Graceful fallback: If SMTP credentials are not configured, orders still complete safely without throwing unhandled exceptions.

### 5. Security & Production Hardening
- **HttpOnly Cookies:** Authentication tokens are stored with `httpOnly: true`, `secure: true` (in production), and `sameSite: "strict"|"lax"`.
- **Granular Rate Limiting:** Dedicated limits for auth routes (10 req/15m), checkout routes (30 req/15m), and general API traffic (300 req/15m).
- **Standardized Error Envelopes:** Uniform `ApiError` and `ApiResponse` wrappers with centralized Express middleware.
- **Payload Limits:** JSON payload capped at 16kb to prevent denial-of-service memory exhaustion.

---

## Getting Started

### Prerequisites
- Node.js (v20 or higher recommended)
- MongoDB instance (Local or MongoDB Atlas)
- Razorpay test account keys

### 1. Clone the Repository
```bash
git clone https://github.com/adarsh-devx/Backend.git noirvayn
cd noirvayn
```

### 2. Backend Configuration & Setup
Navigate to `Backend/` and install dependencies:
```bash
cd Backend
npm install
```

Create a `.env` file inside `Backend/`:
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Database & Authentication
MONGO_URI=mongodb://localhost:27017/snitch
JWT_SECRET=your_jwt_secret_key

# Google OAuth (Optional for social login)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# ImageKit (For media uploads)
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_endpoint

# Razorpay Payment Gateway
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Email Dispatch (Nodemailer / Gmail App Password)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_USER=your_store_email@gmail.com
EMAIL_PASS=your_16_digit_app_password
EMAIL_FROM="Noirvayn Atelier" <your_store_email@gmail.com>
```

Start the backend development server:
```bash
npm run dev
```

### 3. Frontend Setup
In a new terminal window, navigate to `Frontend/` and install dependencies:
```bash
cd Frontend
npm install
```

Start the Vite development server:
```bash
npm run dev
```

The application will be live at `http://localhost:5173`.

---

## Available Scripts

### Backend (`Backend/package.json`)
- `npm run dev` - Starts the API server with live nodemon reload
- `npm start` - Starts the API server in production mode

### Frontend (`Frontend/package.json`)
- `npm run dev` - Runs the Vite local development server
- `npm run build` - Compiles production assets into `Frontend/dist`
- `npm run preview` - Locally previews the production build
- `npm run lint` - Runs ESLint across the codebase

---

## License

This project is licensed under the ISC License.


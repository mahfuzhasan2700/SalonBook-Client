# SalonBook - Client (Frontend Application)

Modern, role-based salon appointment booking web application built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**. Designed for premier beauty salons, spas, and styling studios to manage clientele, schedules, and Stripe transactions.

## Repository Links
- **Client Repository:** [SalonBook-Client](https://github.com/mahfuzhasan2700/SalonBook-Client)
- **Server Repository:** [SalonBook-Server](https://github.com/mahfuzhasan2700/SalonBook-Server)
- **Live Application:** [SalonBook Live](https://salonbook-client.vercel.app)

---

## Important Features

### 🌟 Public & Customer Experience
- **Luxury Salon Themed Interface:** Elegant aesthetic with responsive layouts across mobile, tablet, and desktop viewports.
- **Dynamic Service Discovery:**
  - Real-time search by service name with instant debounced filtering.
  - Category-based filters across 7 specialized departments (Haircuts, Color, Treatments, Skincare, Makeup, Nails, Spa).
  - Price sorting controls (Low to High, High to Low).
- **Service Details & Scheduling:**
  - Dynamic route `/services/[id]` with full descriptions, pricing, duration, and styling details.
  - Interactive appointment booking modal with date selection, predefined time windows, and conflict prevention.
- **Customer Dashboard:**
  - Real-time booking metrics (Total Requests, Pending, Confirmed, Cancelled).
  - Personal appointments ledger with status badges and cancellation for pending bookings.
  - One-click Stripe Checkout integration for confirmed appointments.
  - Customer profile management with photo uploads and phone contact updates.

### 👑 Administrator Control Suite
- **Secure Role-Based Dashboard (`/dashboard/admin`):**
  - KPI overview: Registered customers, active services, pending requests, confirmed bookings, and total Stripe revenue.
- **Salon Catalog CRUD:**
  - Add new treatments with direct image upload via ImgBB.
  - Update pricing, session duration, and active/inactive visibility toggles.
  - Deletion controls with confirmation prompts.
- **Appointment Management:**
  - Review incoming client scheduling requests.
  - Confirm pending requests or cancel bookings.
- **Clientele Governance:**
  - View all registered customers.
  - One-click account suspension (blocking) and reinstatement toggles.
- **Financial Audit Ledger:**
  - Complete list of Stripe verified transactions with session reference IDs and timestamps.

---

## Technology Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, PostCSS, Autoprefixer
- **Icons:** Lucide React
- **Notifications:** Sonner (Toast notifications)
- **State & Auth:** React Context API with LocalStorage token persistence
- **Payments:** Stripe Checkout Integration
- **Image Hosting:** ImgBB API

---

## Environment Variables
Create a `.env.local` file in the root directory following `.env.example`:
- `NEXT_PUBLIC_API_URL` - Express backend API base endpoint (e.g., `http://localhost:5000/api`)
- `NEXT_PUBLIC_IMGBB_API_KEY` - API key for uploading images to ImgBB
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key for client payments

---

## Installation & Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mahfuzhasan2700/SalonBook-Client.git
   cd SalonBook-Client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   ```bash
   cp .env.example .env.local
   # Set NEXT_PUBLIC_API_URL to your running server URL
   ```

4. **Run development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for production:**
   ```bash
   npm run build
   npm run start
   ```

---

## Default Test Accounts (For Evaluation)

| Role | Email | Password |
|---|---|---|
| **Administrator** | `admin@salonbook.com` | `Admin@123456` |
| **Customer** | `sophia@example.com` | `Customer@123` |

# Glowroot by Ishita — Premium Bridal Makeup Artist Website

A complete, luxurious, fully responsive bridal makeup artist portfolio and appointment booking website built for **Glowroot by Ishita** (`@glowroot.by.ishita`).

Designed with an aesthetic feminine identity using **Ivory, Cream, Dusty Rose, Powder Blue, and Champagne Gold**, sophisticated serif typography (Playfair Display & Cormorant Garamond), soft shadows, delicate gold borders, and smooth animations.

---

## 🌸 Key Highlights

### 1. Public Website Experience
- **Home Page**:
  - Hero section featuring large bridal photography and the signature heading: *"Where Every Bride Finds Her Glow."*
  - Dual CTAs: *"Book Your Appointment"* and *"Explore My Work"*.
  - Trust indicators: 450+ Brides Styled, 6+ Years Artistry, 100% Luxury Vanity, 35+ Destinations.
  - Featured makeup services preview.
  - Recent bridal transformations preview with full-screen lightbox.
  - *"Why Brides Trust Ishita"* (Dior/Charlotte Tilbury vanity, skin-first philosophy, one-bride-a-day dedication, destination ready).
  - Client love notes & reviews.
  - Instagram gallery preview linking to `@glowroot.by.ishita`.
  - Signature bridal footer with contact info and discrete Admin Portal access.

- **About Page** (*"The Artist Behind Your Glow"*):
  - High-fashion portrait of Ishita with artistic signature.
  - Personal introduction & story.
  - Makeup philosophy (skin-first, dewy, timeless).
  - Experience, training certifications, and why clients trust her.
  - Bridal journey guarantee checklist.
  - Direct CTAs to explore services and book consultations.

- **Services Page**:
  - Detailed cards for all 5 signature offerings:
    1. **Bridal Makeup**
    2. **Engagement Makeup**
    3. **Reception Makeup**
    4. **Cocktail / Sangeet Makeup**
    5. **Party Makeup**
  - High-res photography, starting prices in INR, duration, inclusions list.
  - *"Book This Service"* button with automated service pre-selection.
  - Luxury Vanity guarantee (Dior, Charlotte Tilbury, Tom Ford, Chanel, NARS, Pat McGrath, MAC).

- **My Work / Portfolio Page**:
  - Masonry-style responsive gallery.
  - Category filters: **All, Bridal, Engagement, Reception, Cocktail, Party**.
  - Image captions, client names, and descriptions.
  - Full-screen image lightbox with navigation arrows, image counter, and keyboard shortcuts (`Esc`, `←`, `→`).

- **Booking Page**:
  - Appointment enquiry form (Full Name, Mobile Number with validation, Email, Service select, Event Date, Event Location, Additional Message).
  - Validation with inline error feedback.
  - Clear confirmation notice: *"A booking is confirmed only after the artist approves it."*
  - Instant WhatsApp enquiry button.
  - Saves booking enquiries directly to the database.

- **Contact Page**:
  - One-click WhatsApp contact button.
  - Phone, email, and Instagram profile links.
  - Studio address in Greater Kailash II, New Delhi.
  - Embedded Google Map.
  - Contact enquiry message form.

---

### 2. Private Admin Dashboard
**Strict Single-Admin Architecture**:
- **No customer registration or login.**
- **No public signup API.**
- Dedicated admin portal at `/admin/login`.
- Initial Credentials:
  - **Admin ID**: `ishita`
  - **Password**: `Glowroot@Ishita2026!` *(hashed securely via bcrypt)*
- Features:
  - **Overview Stats**: Total Bookings, Pending Bookings, Approved Bookings, Portfolio Photographs, Active Services.
  - **Booking Management**: View details, Approve, Reject, Mark as Completed, add/edit private notes, filter by status and date, search by name/venue/phone.
  - **Portfolio Management**: Upload photographs (file upload or URL), edit title/category/caption/description/client name, reorder photographs, preview before publishing, delete.
  - **Services Management**: Create new services, update pricing and inclusions, upload service photos, toggle active/inactive status, delete.
  - **Website Content Management**: Update homepage hero heading & subtitle, update About Me story & philosophy, manage client testimonials (add/edit/delete), update contact details and Instagram URL, edit availability notice.

---

## 💻 Tech Stack

- **Frontend**: React 18, Vite, React Router DOM, Framer Motion, Lucide React, Axios.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT, bcryptjs, Multer for image uploads, Cookie Parser.
- **Persistence**: Hybrid Mongoose connection with resilient local JSON fallback (`backend/data/db.json`), ensuring seamless execution both with or without a running MongoDB daemon.

---

## 🚀 Running the Project

### Prerequisites
- Node.js (v18 or higher)
- npm

### 1. Start Backend Server
```bash
cd backend
npm install
node server.js
```
The backend server runs at `http://localhost:5000`.

### 2. Start Frontend Development Server
In another terminal:
```bash
cd frontend
npm install
npm run dev
```
The frontend website runs at `http://localhost:5173`.

---

## 🔐 Admin Login Credentials

| Role | Admin ID / Username | Password |
|---|---|---|
| **Master Admin** | `ishita` | `Glowroot@Ishita2026!` |

- Admin Login URL: `http://localhost:5173/admin/login`
- Admin Dashboard URL: `http://localhost:5173/admin/dashboard`

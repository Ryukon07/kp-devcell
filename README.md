# KP Dev Cell — Official Website

> The official website of **Kammand Prompt Club**, the developer club of IIT Mandi.  
> Built by students, for students. 🚀

---

## 🖥️ Live Site

| Service | URL |
|---|---|
| Frontend | Deployed on Vercel |
| Backend API | Deployed on Render |

---

## 📖 What Is This?

This is the full-stack web application for KP Dev Cell. It's not just a static club page — it has a real backend, a login system, and an admin panel that we actively use to manage club content.

**What the site does:**
- Showcases the club, the team, and our projects
- Lists upcoming and past events with filtering
- Hosts study resources (PDFs, slides) organized by category
- Shows live announcements on the homepage
- Has a protected admin dashboard for club leads to manage everything

---

## 🛠️ Tech Stack

### Frontend
- **React** — UI framework, functional components + hooks throughout
- **React Router** — client-side routing with protected and public-only route guards
- **Framer Motion** — animations (scroll-linked effects, spring transitions, card stacking)
- **Canvas 2D API** — Matrix Rain on the homepage, floating code particles on the login page
- **Fira Code / Inter** — typography (monospace for the terminal look, Inter for readable text)

### Backend
- **Node.js + Express** — REST API for events, members, and announcements
- **MongoDB** — primary database

### Auth & Infra
- **Firebase Authentication** — email/password login, sessions, re-authentication
- **Docker** — containerisation for consistent environments
- **Vercel** — frontend hosting (auto-deploys from GitHub)
- **Render** — backend API hosting (auto-deploys from GitHub)

---

## 📁 Project Structure

```
KP-DEVCELL/
├── backend/
│   ├── src/
│   │   ├── middleware/       # Auth middleware
│   │   ├── models/           # Mongoose models (Event, Member, Announcement)
│   │   └── routes/           # API routes
│   ├── index.js
│   └── Dockerfile
│
├── frontend/
│   ├── public/               # Static assets (logo, favicon)
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/        # Admin panel components
│   │   │   ├── home/         # Homepage sections
│   │   │   └── shared/       # Reusable components
│   │   ├── pages/            # Page-level components
│   │   ├── context/          # Auth context
│   │   ├── hooks/            # Custom hooks
│   │   ├── constants/        # Theme tokens
│   │   └── utils/
│   ├── index.html
│   └── Dockerfile
│
└── docker-compose.yml
```

---

## ✨ Features & Design

Every page has its own loading animation and unique layout, while sharing the same dark terminal-inspired design language.

### 🏠 Homepage
- Full-screen boot loader with a fake terminal session ID and step-by-step log
- Matrix Rain canvas in the hero (falling monospace characters)
- Live announcements floating as terminal-window cards (desktop) or a scrolling ticker (mobile)
- Typewriter effect cycling through club mottos
- Scroll-driven text scramble effects in the About section
- Stat counters (members, projects, sessions) that scramble from random digits as you scroll
- 3D-stacked project cards that flip on scroll

### 👥 Core Team
- Member cards styled as macOS terminal windows
- Desktop: cards stacked at angles, fan out on hover with spring-physics animations
- Mobile: horizontal swipe scroll with snap alignment

### 📅 Events
- Radar-style boot loader (unique to this page)
- Header types out `ls -la ./events` on load
- Events shown as horizontal cards with date column, pulsing status dot (upcoming/today/past)
- Filter tabs with live event counts

### 📚 Resources
- Document-scanner boot loader animation
- GitHub-style file explorer layout
- Accordion folder cards with tree-connector lines inside
- File type badges (PDF, PPT) with colour coding

### 🔐 Admin Dashboard
- Full VS Code–style layout: top bar, left EXPLORER sidebar, tab bar
- Live clock in the top bar, `root@kp-admin` status chip
- Manage members, events, announcements, and admin access
- Smooth fade-slide transition when switching tabs
- Collapsible sidebar on mobile with hamburger toggle

### 🔑 Login Page
- Background canvas with 240 floating code tokens (`const`, `async`, `===`, etc.)
- Frosted-glass login card with a teal scanline animation
- Custom animated logo (SVG bracket + two orbiting dots)
- Glow-on-focus input fields
- Dual modes: Login and Set Password, with animated transition between them

---



## 🔑 Auth Flow

- `/admin` — protected route, redirects to `/login` if not authenticated
- `/login` — public-only route, redirects to `/admin` if already logged in
- Auth state is managed via `AuthContext` using Firebase
- The admin panel supports password change for first-time users

---

## 👨‍💻 Built by DeCoders

## 🎨 Design System

All theme values live in `src/constants/theme.js`:

```js
export const C = {
  bg:     '#0d1117',   // page background
  card:   '#161b22',   // card/surface background
  border: '#21262d',   // borders
  fg:     '#e6edf3',   // primary text
  muted:  '#7d8590',   // secondary text
  cyan:   '#14b8a6',   // primary accent
  purple: '#a855f7',   // secondary accent
}
```

Typography uses **Inter** for body text and **Fira Code / Cascadia Code** for all terminal-style elements.

---



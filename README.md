# Harshad Jethva — Premium Portfolio

![Harshad Jethva Portfolio](public/assets/user_photo.jpg)

A high-end, immersive digital experience showcasing the intersection of visual design and creative engineering. Built with **Next.js 16**, **Three.js**, **GSAP**, and **Tailwind CSS 4**.

## ✨ Core Features

- **3D Immersion**: Interactive WebGL backgrounds and elements powered by Three.js & React Three Fiber.
- **Cinematic Animations**: Ultra-smooth entrance sequences and scroll-triggered transformations using GSAP.
- **Precision Scrolling**: Implementation of Lenis for natural, buttery-smooth momentum scrolling.
- **Adaptive UI**: A custom cursor system that reacts to background contrast and interactive elements.
- **Responsive Mastery**: A design system that scales elegantly from mobile devices to ultra-wide displays.
- **Admin Dashboard**: A secure, integrated backend for managing projects, skills, and messages.

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) & [CSS Modules](https://github.com/css-modules/css-modules)
- **3D Engine**: [Three.js](https://threejs.org/) & [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- **Animations**: [GSAP (GreenSock)](https://greensock.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

### Tools & Utilities
- **Scrolling**: [Lenis](https://lenis.darkroom.engineering/)
- **State Management**: React Context & Hooks
- **Typography**: Optimized via `next/font`

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/profile.git
   cd profile
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   Update `DATABASE_URL` to match your local PostgreSQL instance.

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open the application:**
   Navigate to [http://localhost:3000](http://localhost:3000) to view the project.

## Local PostgreSQL Setup

This project now uses local PostgreSQL for:
- Skills CRUD
- Projects CRUD
- Achievements CRUD (including image URLs)
- Contact form message storage and admin viewing

On first API request, tables are created automatically and default portfolio content is seeded.

### Required database
- PostgreSQL running locally
- A database (for example: `portfolio`)

### Example connection string
```env
DATABASE_URL=postgres://postgres:postgres@localhost:5432/portfolio
```

## Admin Panel

Open these routes while running locally:
- `/admin/dashboard`
- `/admin/skills`
- `/admin/projects`
- `/admin/achievements`
- `/admin/messages`

## 📂 Project Structure

```text
src/
├── app/            # Next.js App Router (Pages, Layouts, API)
│   ├── admin/      # Secure Admin Dashboard
│   ├── sections/   # Major homepage sections (Hero, About, Projects, etc.)
│   └── globals.css # Global design tokens
├── components/     # Reusable UI components (Cursor, Navbar, 3D Canvas)
└── public/         # Static assets (Images, Icons)
```

## 🎨 Design Philosophy

This project prioritizes **Visual Excellence** and **Micro-interactions**. Every element is designed to feel alive, using glassmorphism, depth through Z-index layering, and motion that guides the user's eye naturally across the narrative of the portfolio.

## 📄 License

This project is licensed under the ISC License.

---

*Built with ❤️ by Harshad Jethva*

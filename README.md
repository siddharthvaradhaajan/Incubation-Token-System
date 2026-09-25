# 🎓 Campus Incubator - Student Project & Food Token Management System

A modern, full-featured web application designed to streamline student project tracking and automate daily food token distribution for college incubators, research labs, and project centers. Built with **React 19**, **Vite**, **TypeScript**, and **Tailwind CSS v4**.

---

## 🌟 Key Features

### 📊 Dashboard & Overview (`/dashboard`)
- Real-time statistics on active students, ongoing projects, today's meal eligibility count, printed tokens, and redeemed meals.
- Quick navigation shortcuts and real-time activity feed.

### 👥 Student Directory (`/students`)
- Comprehensive student directory with Student IDs (e.g., `23CS101`), department, academic year, contact information, and active status.
- Department filtering (CSE, ECE, ME) and live search by name or ID.
- Student creation/editing and project affiliation management.

### 📁 Project Catalog (`/projects`)
- Track project codes (e.g., `AGRI-01`, `SMRT-02`), descriptions, statuses (*Active*, *Inactive*, *Completed*), and creation dates.
- Assign lead developers and team members with custom roles.
- Overview of enrolled students per project.

### 📋 Daily Food Eligibility List (`/daily-food-list`)
- Manage date-specific meal eligibility (Today, Tomorrow, or custom dates).
- **Draft & Finalization Workflow**: Prepare lists in *Draft* mode; lock entries once *Finalized* by administrative staff.
- Bulk addition of eligible students by project group or individual search.
- Audit tracking of entry additions and finalization timestamps.

### 🔍 Token Scanner & Receipt Generator (`/scan-token`)
- Student ID lookup with simulated barcode/QR scanner integration.
- Instant validation against the finalized daily eligibility list.
- **Meal Token Generation & Thermal Receipt Printing**: One-click token issuance with thermal ticket preview, student details, project code, and unique token serial numbers (e.g., `INC-250925-001`).

### 🎟️ Food Token Tracker (`/food-tokens`)
- Complete lifecycle tracking for all issued food tokens (*Generated*, *Printed*, *Used*, *Cancelled*, *Expired*).
- Multi-field search and status filtering.
- Quick redemption actions to mark tokens as *Used* upon cafeteria serving.

### 📈 Reports & Analytics (`/reports`)
- Visual breakdown of food distribution trends by project and department.
- Print-ready summary tables for catering verification and administrative audit.

---

## 🛠️ Tech Stack

| Category | Technology |
| :--- | :--- |
| **Frontend Framework** | [React 19](https://react.dev/) |
| **Routing** | [React Router v7](https://reactrouter.com/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) via `@tailwindcss/vite` |
| **Build Tooling** | [Vite 8](https://vitejs.dev/) |
| **Language** | [TypeScript 5.7](https://www.typescriptlang.org/) |
| **Formatting** | `oxfmt` |

---

## 📁 Project Structure

```
├── public/                # Public static assets
├── src/
│   ├── components/        # Reusable UI components (Layout, Badge, etc.)
│   ├── data/              # Mock dataset, TypeScript interfaces & initial state
│   ├── pages/             # Application views & pages
│   │   ├── Dashboard.tsx      # Overview stats & recent activity log
│   │   ├── Students.tsx       # Student directory & management
│   │   ├── Projects.tsx       # Project management & team assignment
│   │   ├── DailyFoodList.tsx  # Daily food eligibility list builder & finalizer
│   │   ├── ScanToken.tsx      # Verification scanner & thermal receipt generator
│   │   ├── FoodTokens.tsx     # Token history & cafeteria redemption tracking
│   │   ├── Reports.tsx        # Analytics & exportable reports
│   │   └── Login.tsx          # Login interface
│   ├── App.tsx            # Main router configuration
│   ├── main.tsx           # React entrypoint
│   └── index.css          # Global CSS and Tailwind CSS v4 imports
├── index.html             # Vite HTML root shell
├── package.json           # Dependencies and scripts
├── vite.config.ts         # Vite configuration with React & Tailwind plugins
└── tsconfig.json          # TypeScript setup
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **Package Manager**: `pnpm` (recommended) or `npm`

### Installation

1. Clone or download the repository.
2. Install dependencies:

```bash
pnpm install
```
*(or `npm install`)*

### Development Server

Run the development server:

```bash
pnpm dev
```
*(or `npm run dev`)*

Open your browser at `http://localhost:8443` (or the port specified by Vite).

### Production Build

Create an optimized production build:

```bash
pnpm build
```

Preview the build locally:

```bash
pnpm preview
```

### Code Formatting

Format code using `oxfmt`:

```bash
pnpm format
```

---

## 🔄 Application Workflow

1. **Student & Project Management**: Register students under `/students` and assign them to incubators/projects under `/projects`.
2. **Daily List Finalization**: Go to `/daily-food-list`, add eligible members for the date, and click **Finalize List**.
3. **Issuing Food Tokens**: Cafeteria desk staff uses `/scan-token` to search student IDs, verify eligibility, and print thermal token receipts.
4. **Cafeteria Redemption**: Food service staff marks tokens as **Used** under `/food-tokens`.
5. **Auditing**: Admins inspect daily metrics and summary reports under `/reports`.

# AMMA Spares – Job Tracking System
## Full System Specification (Claude.md)

---

## 1. Overview

This project is a **modern, full-stack job tracking system** built specifically for **AMMA Spares**, a specialist VW Amarok parts supplier and mechanical workshop.

The system is designed to:
- Track mechanical jobs from intake to completion
- Manage customers, vehicles, and parts
- Monitor workshop workflow and technician assignments
- Provide a clean, fast, and mobile-friendly experience

The application must be built **in one complete implementation pass**, production-ready.

---

## 2. Tech Stack

- **Frontend:** React + TypeScript
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Backend / DB / Auth:** Supabase
- **Hosting:** Vercel

---

## 3. Design System

### 3.1 Visual Identity

- **Primary Background:** White
- **Dark Mode:** Fully supported
- **Primary Accent:** Orange
- **Secondary Accent:** Subtle Blue highlights
- **Typography:** Clean, modern sans-serif (Inter or similar)

### 3.2 Design Principles

- Minimal, clean, high-contrast UI
- Soft shadows, rounded corners (lg/2xl)
- Bento-style dashboard layout
- Smooth transitions and hover states
- No emojis — use icon libraries (Lucide or similar)

---

## 4. Layout Structure

### 4.1 Global Layout

- **Left Sidebar Navigation (fixed)**
- **Top Bar (optional):**
  - User profile
  - Notifications
  - Quick search

- **Main Content Area (responsive)**

---

### 4.2 Sidebar Navigation Tabs

1. Dashboard
2. Jobs
3. Customers
4. Vehicles
5. Parts & Inventory
6. Technicians
7. Calendar / Scheduling
8. Reports & Analytics
9. Settings

---

## 5. Core Modules

---

## 5.1 Dashboard (Bento Layout)

### Purpose:
Quick overview of entire business operations.

### Components:

- Active Jobs (count + status breakdown)
- Jobs in Progress
- Completed Jobs Today
- Pending Parts Orders
- Technician Workload
- Revenue Snapshot
- Recent Activity Feed
- Upcoming Scheduled Jobs

### Layout:
- Grid-based Bento layout
- Cards of varying sizes
- Real-time updates (Supabase subscriptions)

---

## 5.2 Jobs Module

### Core Feature of the System

### Job Fields:

- Job ID (auto-generated)
- Customer ID
- Vehicle ID
- Job Title
- Description
- Status:
  - Pending
  - In Progress
  - Waiting for Parts
  - Completed
  - Cancelled
- Priority (Low, Medium, High)
- Assigned Technician(s)
- Estimated Cost
- Final Cost
- Start Date
- Due Date
- Completion Date

---

### Features:

- Create / Edit / Delete Jobs
- Drag-and-drop Kanban view (status columns)
- Table view (sortable, filterable)
- Job timeline tracking
- Attach notes and updates
- Upload images/documents
- Link parts used to job

---

## 5.3 Customers Module

### Fields:

- Full Name
- Contact Number
- Email
- Address
- Notes
- Linked Vehicles

### Features:

- Customer history
- All jobs per customer
- Total spend tracking

---

## 5.4 Vehicles Module

### Fields:

- Make (VW)
- Model (Amarok)
- Year
- VIN Number
- Registration Number
- Mileage
- Linked Customer

### Features:

- Vehicle service history
- Linked jobs
- Notes and diagnostics

---

## 5.5 Parts & Inventory

### Fields:

- Part Name
- Category
- Type:
  - New
  - Used
  - Genuine
  - Economy / Exchange
- Stock Quantity
- Cost Price
- Selling Price
- Supplier
- Notes

---

### Features:

- Inventory tracking
- Low stock alerts
- Assign parts to jobs
- Track part usage history

---

## 5.6 Technicians Module

### Fields:

- Name
- Role
- Contact Info
- Active Jobs
- Skill Tags

---

### Features:

- Assign technicians to jobs
- Workload tracking
- Performance overview

---

## 5.7 Calendar / Scheduling

### Features:

- Job scheduling
- Drag-and-drop calendar
- Technician availability
- Daily / Weekly / Monthly views

---

## 5.8 Reports & Analytics

### Metrics:

- Jobs completed per period
- Revenue trends
- Most common repairs
- Technician productivity
- Parts usage trends

### Visuals:

- Charts (Recharts)
- Tables
- Export to CSV

---

## 5.9 Settings

- User management
- Role-based access
- Business info
- Theme toggle (light/dark)

---

## 6. Database Design (Supabase)

### Tables:

#### users
- id
- email
- role

#### customers
- id
- name
- phone
- email
- address
- notes

#### vehicles
- id
- customer_id
- make
- model
- year
- vin
- registration
- mileage

#### jobs
- id
- customer_id
- vehicle_id
- title
- description
- status
- priority
- assigned_to
- estimated_cost
- final_cost
- start_date
- due_date
- completed_at

#### parts
- id
- name
- category
- type
- stock
- cost_price
- selling_price
- supplier

#### job_parts
- id
- job_id
- part_id
- quantity

#### technicians
- id
- name
- role
- contact

---

## 7. Authentication & Security

- Supabase Auth (email/password)
- Role-based access:
  - Admin
  - Manager
  - Technician

---

## 8. UX Features

- Global search (jobs, customers, vehicles)
- Filters and sorting everywhere
- Toast notifications
- Loading skeletons
- Mobile-first responsiveness
- Keyboard shortcuts for power users

---

## 9. Performance Requirements

- Fast initial load (Next.js SSR/ISR)
- Optimized queries
- Pagination for large datasets
- Lazy loading components

---

## 10. Deployment

- Deploy via Vercel
- Environment variables for Supabase
- Production-ready build

---

## 11. Final Notes

- Entire system must be cohesive and polished
- No placeholder UI
- No incomplete modules
- Every feature must be fully functional
- Design must feel premium, modern, and clean

This system should replace manual workflows, spreadsheets, and disconnected tools with a unified, efficient platform tailored for AMMA Spares operations.
# Amma Spares Galore — Strip Job Tracking System

A salvage vehicle dismantling and parts sales management system for Amma Spares Galore, a South African salvage yard and parts stripping operation. Tracks donor vehicles from acquisition through dismantling, parts cataloguing, and sale.

---

## Core Domain

### Strip Job
The central entity. A strip job represents a single donor vehicle acquired for dismantling. The job tracks the vehicle from acquisition through full or partial stripping, parts cataloguing, and final disposition. Jobs are never hard-deleted.

**Key attributes:** job number, description, donor vehicle, status, dismantler, category (Full Strip / Partial Strip / Parts Only / Write-off Assessment), branch, archived flag, acquired date.

### Donor Vehicle
The vehicle being dismantled. Acquired 2nd-hand, accident-damaged, flood-damaged, or as a written-off unit. Vehicle details (make, model, year, variant, engine, VIN, odometer) are captured for accurate parts cataloguing and cross-referencing.

**Key attributes:** registration, make, model, year, variant, engine, VIN, odometer, condition, acquisition source, acquisition cost.

### Harvested Parts
Parts stripped from a donor vehicle. Each part is catalogued with condition, internal part number, allocated acquisition cost, and a list price for sale. Parts can be in stock, reserved for a buyer, sold, or scrapped.

**Key attributes:** associated strip job, part number, description, quantity, condition (Good / Fair / Refurb Required / Scrap), acquisition cost, list price, status (In Stock / Reserved / Sold / Scrapped), buyer reference.

### Buyer
A person or business that purchases harvested parts. Buyers can be retail customers (individuals) or trade buyers (workshops, dealers, other resellers).

**Key attributes:** name, email, phone, branch, type (Trade / Retail / Dealer).

### Dismantler
The technician assigned to strip the donor vehicle. A strip job has one primary dismantler (optional). Dismantlers are associated with a branch.

---

## Strip Job Lifecycle

```
Assessment → Awaiting Collection → Vehicle Received → Stripping → Parts Catalogued
→ Quality Check → Parts Listed → Completed / Scrapped / Cancelled
```

Statuses are defined in configurable metadata rather than hardcoded enums. Each status has flags for:
- `show_on_dashboard` — whether to surface on the main board
- `is_terminal` — marks end states (Completed, Scrapped, Cancelled)

Every status change is recorded in a history log with entry time, exit time, and duration in minutes.

---

## Workflow Summary

1. Strip job created (Assessment) — donor vehicle details, acquisition source, and cost captured; estimated completion date set.
2. Vehicle collected from seller or auction — status moves to "Awaiting Collection" until physical arrival.
3. Vehicle arrives at yard — status moves to "Vehicle Received"; odometer and condition confirmed.
4. Dismantler assigned; stripping begins — status moves to "Stripping".
5. All usable parts removed and photographed — status moves to "Parts Catalogued".
6. Parts condition-graded and priced — quality check performed.
7. Parts listed in system as available for sale — status moves to "Parts Listed".
8. All parts sold, scrapped, or allocated — job closed as "Completed".
9. Vehicles with no usable parts close as "Scrapped".
10. Archived jobs can be restored (separate permission required).

---

## Parts & Inventory

- Strip jobs have harvested parts (catalogued line items). Each part records allocated acquisition cost and sell price for margin tracking.
- Parts have four condition grades: **Good** (direct sale), **Fair** (minor cosmetic issues), **Refurb Required** (needs work before sale), **Scrap** (no sale value).
- Parts can be **In Stock** (available), **Reserved** (buyer committed, awaiting collection/payment), **Sold** (transaction complete), or **Scrapped** (disposed of).
- Acquisition cost per part is allocated from the total donor vehicle purchase price.
- No full inventory module in v1 — parts on jobs are catalogued with free-text description + internal part number.

---

## In-App Alerts

- Strip jobs past estimated completion date
- Parts reserved for >7 days without sale finalisation
- Jobs in "Stripping" status for >5 days

---

## Multi-Branch

A `branch` field on Strip Job, Buyer, Donor Vehicle, and Dismantler supports multiple physical yard locations sharing one system. Branch selection is available in the sidebar so users can work within the correct location context.

---

## Permissions

| Permission | Access |
|---|---|
| `jobs.view` | View strip jobs |
| `jobs.create` | Create new strip jobs |
| `jobs.edit` | Edit job details and harvested parts |
| `jobs.status` | Change job status |
| `jobs.archive` | Archive / restore jobs |
| `archive.view` | View archived jobs |
| `invoices.create` | Generate invoices / sales receipts from parts |
| `reports.view` | Access reporting module |

---

## Key Design Decisions

- **Soft deletes** — `is_archived` flag; nothing is hard-deleted.
- **Donor vehicle as first-class entity** — enables full strip history per VIN (which parts were harvested, what sold for how much).
- **Status as data** — adding or renaming statuses (e.g. "Awaiting Compliance Check") requires no code change.
- **Harvested parts on job** — sales receipts are generated directly from catalogued parts, no separate entry.
- **Branch isolation** — multi-location safe from day one.

---

## Tech Stack

- **Framework:** Next.js (React + TypeScript) — deployed on Vercel
- **Persistence:** MVP data managed in local app state / browser storage, with room to add a backend later.
- **Styling:** Tailwind CSS
- **Forms:** react-hook-form
- **Auth:** simple session or mock auth for MVP; production auth can be added after initial release.

---

## UI / UX Design System

Inspired by the SHE Risk & Compliance platform — same structural DNA, adapted for an operations/yard context.

### Visual Style

- **Classification:** Minimal flat — clean surfaces, no glassmorphism, subtle layered shadows
- **Mode:** Light mode primary; dark sidebar for persistent navigation contrast
- **Tone:** Professional, dense-but-scannable, operations-first

### Color Palette

| Token | Hex | Usage |
|---|---|---|
| `--primary` | `#84cc16` | Active nav, primary buttons, key accents |
| `--primary-dark` | `#65a30d` | Button hover state |
| `--bg` | `#f0f1f5` | Page background |
| `--surface` | `#ffffff` | Card / modal background |
| `--surface-soft` | `#f8fafc` | Alternate row, input background |
| `--sidebar-bg` | `#0c0d14` | Sidebar background |
| `--text-primary` | `#0f172a` | Body text |
| `--text-muted` | `#64748b` | Secondary labels, metadata |
| `--border` | `rgba(15,23,42,0.08)` | Card and input borders |
| Success | `#10b981` | Completed, Sold, parts catalogued |
| Warning | `#f59e0b` | Reserved parts, overdue completion |
| Danger | `#e11d48` | Overdue jobs, Cancelled, Scrapped |
| Info | `#0ea5e9` | Informational states |

### Typography

- **Font family:** Geist Sans, system-ui fallback; Geist Mono for job numbers / part numbers
- **Scale:** `xs` 12px · `sm` 14px · `base` 16px · `lg` 18px · `2xl` 24px
- **Weights:** Regular 400 (body) · Medium 500 (labels) · Semibold 600 (headings)
- **Labels:** Uppercase + `tracking-wide` for section headers and sidebar nav categories

### Layout

- **Sidebar:** 256px fixed, dark `#0c0d14`, hidden on mobile
- **Mobile header:** 56px top bar with hamburger + branch switcher
- **Content area:** Full remaining width, `p-6` padding, `max-w-7xl` container
- **Spacing rhythm:** 4 / 8 / 12 / 16 / 24 / 32px increments
- **Breakpoints:** 375 (mobile) · 768 (tablet) · 1024 (desktop) · 1440 (wide)

### Component Patterns

**Cards**
- `bg-white rounded-2xl` with two-layer shadow: `0 1px 3px rgba(15,23,42,0.04), 0 6px 20px rgba(15,23,42,0.06)`
- Consistent `p-5` padding; section header `px-6 py-4 border-b`

**Status Badges**
- Pill-shaped `rounded-full`, semantic background + text color pairs
- Variants: `assessment` (slate) · `awaiting-collection` (sky) · `vehicle-received` (sky) · `stripping` (blue) · `parts-catalogued` (indigo) · `quality-check` (emerald) · `parts-listed` (emerald) · `completed` (slate muted) · `written-off-scrap` (rose) · `cancelled` (rose)
- Overdue indicator: red dot or `-N days` chip in danger color

**Buttons**
- Primary: lime `#84cc16`, dark text, shadow, hover `#65a30d`
- Secondary: `slate-950` bg, white text
- Danger: `rose-600` bg, white text
- Ghost: white + subtle border
- Sizes: sm · md · lg — consistent `rounded-xl`

**Data Table (Strip Jobs List)**
- Sticky header, alternating row subtle tint (`surface-soft`)
- Inline status badge per row; completion date chip (green → amber → red)
- Row actions: icon-only (Lucide) with `title` tooltip + `cursor-pointer`
- Sortable column headers with `aria-sort`
- Virtualized for large datasets (50+ rows)

**Sidebar Navigation**
- Active item: 3px left lime border + subtle lime-tinted bg
- Nav category labels: uppercase, `tracking-[0.2em]`, `text-xs`, muted
- Icons: Lucide, stroke-consistent, 20px, aligned to text baseline
- Branch switcher at top of sidebar

**Forms / Modals**
- `rounded-2xl` modal, `bg-black/30` backdrop
- Inputs: `rounded-xl`, focus `ring-2 ring-[#84cc16]`
- Error state: `bg-rose-50 border-rose-300` + message below field
- Labels visible (never placeholder-only); required fields marked `*`

**Dashboard KPI Cards**
- 2-col mobile → 4-col desktop grid, `gap-4`
- Icon + metric + label + trend delta (colored arrow)
- Key metrics: Active Strip Jobs · Overdue Completion · Parts In Stock · Parts Listed for Sale

### Page Structure

#### Dashboard
- KPI row (Active Strip Jobs, Overdue, Parts In Stock, Parts Listed)
- Jobs by Status bar chart (Recharts) + daily completions trend line
- Recent Activity feed (status changes, new acquisitions, parts catalogued)
- Quick Actions: New Strip Job · Catalogue Parts · Update Status

#### Strip Jobs List
- Filter bar: Status · Dismantler · Branch · Date range · Search (job no, rego, make/model)
- Sortable table with status badge, vehicle rego, make/model, dismantler, estimated completion date
- Bulk actions (archive, status change) via checkbox selection
- Mobile: collapses to card-stack view

#### Strip Job Detail
- Header: Job No · Donor Vehicle (Rego + Make/Model) · Status badge · Action buttons
- Tabs: Overview · Harvested Parts · Notes · Status History
- Overview: donor vehicle details, acquisition info, dismantler, dates, description
- Harvested Parts: catalogued parts table with condition, acquisition cost, list price, status, add/edit/remove rows
- Status History: timeline with duration per stage

#### Buyers
- List of buyers with part purchase count and total spend
- Buyer detail: contact info + type (Trade/Retail/Dealer) + purchase history

#### Archive
- Separate view, requires `archive.view` permission
- Restore action visible only with `jobs.archive` permission

### UX Rules

- Every status transition is confirmed (dialog) before firing — prevents accidental moves
- Overdue completion jobs surface to the top of the default list sort
- Completion date displayed as: `+N days` (green) · `Today` (amber) · `-N days` (red)
- Destructive actions (archive, cancel, scrap) use `rose-600` and are separated from primary actions
- No horizontal scroll on mobile; table collapses to card-stack view at < 768px
- Toasts auto-dismiss in 4s; success = emerald, error = rose, info = sky
- Empty states include an icon, message, and primary CTA ("Create your first strip job")
- Skeleton loaders for async content (no blank frames)

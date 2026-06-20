# Engineering Operations Platform - Implementation Plan

**Date:** 2026-06-15
**Baseline:** KYP UI Prototype (current repo state)
**Goal:** Evolve standalone KYP app into a multi-module Engineering Operations Platform

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Current State](#2-current-state)
3. [Target State](#3-target-state)
4. [Implementation Phases](#4-implementation-phases)
5. [Phase 1: Platform Shell & KYP Migration](#phase-1-platform-shell--kyp-migration)
6. [Phase 2: Shared Infrastructure](#phase-2-shared-infrastructure)
7. [Phase 3: Employee Onboarding Module](#phase-3-employee-onboarding-module)
8. [Phase 4: Infrastructure Module](#phase-4-infrastructure-module)
9. [Phase 5: Training Management Module](#phase-5-training-management-module)
10. [Phase 6: Stakeholder Reports Placeholder](#phase-6-stakeholder-reports-placeholder)
11. [Phase 7: Platform Dashboard (Home)](#phase-7-platform-dashboard-home)
12. [Phase 8: Polish, Tests & Validation](#phase-8-polish-tests--validation)
13. [File-by-File Change Manifest](#file-by-file-change-manifest)
14. [New File Inventory](#new-file-inventory)
15. [Testing Strategy](#testing-strategy)
16. [Risk Notes](#risk-notes)

---

## 1. Executive Summary

KYP is becoming one module inside a larger **Engineering Operations Platform**. The platform will contain:

| Module | Status |
|--------|--------|
| **Dashboard / Home** | New - platform-level overview |
| **KYP** (Know Your Performance) | Existing - migrate under `/kyp` prefix |
| **Employee Onboarding** | New - full workflow prototype |
| **Infrastructure** | New - inventory & ownership views |
| **Training Management** | New - learning & certification tracking |
| **Stakeholder Reports** | New - placeholder only |

All modules use mock data, no auth/RBAC/real integrations.

---

## 2. Current State

### Existing File Structure
```
src/
├── lib/
│   ├── assets/favicon.svg
│   ├── components/
│   │   ├── AlertPanel.svelte
│   │   ├── CohortDistributionPanel.svelte
│   │   ├── ContributionSources.svelte
│   │   ├── MetricCard.svelte
│   │   ├── PeriodSelector.svelte
│   │   ├── RadarDimensionsChart.svelte
│   │   ├── TeamRosterTable.svelte
│   │   ├── TeamRosterTable.test.ts
│   │   └── TrendSparklineGrid.svelte
│   ├── mock/
│   │   └── kypData.ts                    (976 lines, monolithic)
│   ├── stores/
│   │   ├── period.ts
│   │   └── period.test.ts
│   ├── styles/
│   │   └── app.css                       (195 lines)
│   ├── types/
│   │   └── kyp.ts                        (202 lines)
│   ├── utils/
│   │   ├── csv.ts
│   │   ├── csv.test.ts
│   │   ├── sorting.ts
│   │   ├── sorting.test.ts
│   │   ├── supervisorMetrics.ts
│   │   └── supervisorMetrics.test.ts
│   └── index.ts
├── routes/
│   ├── +layout.svelte                    (root layout with KYP-specific nav)
│   ├── +page.svelte                      (home page)
│   ├── teams/
│   │   ├── +page.svelte
│   │   ├── +page.server.ts
│   │   ├── page.test.ts
│   │   └── [teamId]/
│   │       ├── +page.svelte
│   │       ├── +page.server.ts
│   │       └── page.test.ts
│   ├── employees/[id]/
│   │   ├── +page.svelte
│   │   └── +page.server.ts
│   ├── employee/[id]/                    (legacy alias)
│   │   ├── +page.svelte
│   │   ├── +page.ts
│   │   └── page.test.ts
│   ├── supervisor/
│   │   ├── +page.svelte
│   │   ├── +page.server.ts
│   │   └── page.test.ts
│   ├── admin/scoring/
│   │   ├── +page.svelte
│   │   ├── +page.server.ts
│   │   └── page.test.ts
│   └── api/v1/
│       ├── teams/+server.ts
│       ├── teams/[teamId]/+server.ts
│       ├── teams/[teamId]/members/+server.ts
│       ├── search/suggest/+server.ts
│       └── admin/scoring-config/[scope]/[id]/+server.ts
├── app.d.ts
└── test/setup.ts
```

### Current Routes
| Route | Purpose |
|-------|---------|
| `/` | Home page with links |
| `/teams` | Team directory |
| `/teams/[teamId]` | Team detail |
| `/employees/[id]` | Employee detail |
| `/employee/[id]` | Legacy employee alias |
| `/supervisor` | Supervisor dashboard |
| `/admin/scoring` | Scoring admin |

### Key Tech Details
- **Framework:** SvelteKit with Svelte 5 (runes enabled)
- **Styling:** CSS custom properties in `app.css` + component-scoped styles
- **Testing:** Vitest + jsdom + Svelte Testing Library
- **Types:** All in `src/lib/types/kyp.ts`
- **Mock data:** All in `src/lib/mock/kypData.ts` (976 lines)
- **Reactivity:** Svelte 5 `$props()`, `$derived`, `$state` runes

---

## 3. Target State

### Target File Structure
```
src/
├── lib/
│   ├── assets/favicon.svg
│   ├── components/
│   │   ├── shared/                       ← NEW: platform-wide reusable components
│   │   │   ├── DataTable.svelte
│   │   │   ├── FilterBar.svelte
│   │   │   ├── SearchInput.svelte
│   │   │   ├── StatusBadge.svelte
│   │   │   ├── KpiCard.svelte
│   │   │   ├── ProgressBar.svelte
│   │   │   └── EmptyState.svelte
│   │   └── kyp/                          ← MOVED: existing KYP components
│   │       ├── AlertPanel.svelte
│   │       ├── CohortDistributionPanel.svelte
│   │       ├── ContributionSources.svelte
│   │       ├── MetricCard.svelte
│   │       ├── PeriodSelector.svelte
│   │       ├── RadarDimensionsChart.svelte
│   │       ├── TeamRosterTable.svelte
│   │       ├── TeamRosterTable.test.ts
│   │       └── TrendSparklineGrid.svelte
│   ├── mock/
│   │   ├── kyp/                          ← REFACTORED from kypData.ts
│   │   │   ├── seed.ts
│   │   │   ├── queries.ts
│   │   │   ├── scoring.ts
│   │   │   └── index.ts
│   │   ├── onboarding/                   ← NEW
│   │   │   ├── seed.ts
│   │   │   ├── queries.ts
│   │   │   └── index.ts
│   │   ├── infrastructure/               ← NEW
│   │   │   ├── seed.ts
│   │   │   ├── queries.ts
│   │   │   └── index.ts
│   │   ├── training/                     ← NEW
│   │   │   ├── seed.ts
│   │   │   ├── queries.ts
│   │   │   └── index.ts
│   │   └── shared/                       ← NEW: cross-module shared data
│   │       └── employees.ts
│   ├── stores/
│   │   ├── period.ts                     (keep)
│   │   ├── period.test.ts               (keep)
│   │   └── navigation.ts                ← NEW: active module tracking
│   ├── styles/
│   │   └── app.css                       ← UPDATED: platform shell styles
│   ├── types/
│   │   ├── kyp.ts                        (keep, no changes)
│   │   ├── onboarding.ts                ← NEW
│   │   ├── infrastructure.ts            ← NEW
│   │   ├── training.ts                  ← NEW
│   │   └── shared.ts                    ← NEW: cross-module types
│   ├── utils/
│   │   ├── csv.ts                        (keep)
│   │   ├── csv.test.ts                  (keep)
│   │   ├── sorting.ts                   (keep)
│   │   ├── sorting.test.ts             (keep)
│   │   ├── supervisorMetrics.ts         (keep)
│   │   └── supervisorMetrics.test.ts    (keep)
│   └── index.ts
├── routes/
│   ├── +layout.svelte                    ← REWRITTEN: platform shell
│   ├── +page.svelte                      ← REWRITTEN: platform dashboard
│   ├── kyp/                              ← NEW route group for KYP module
│   │   ├── +layout.svelte               ← NEW: KYP sub-navigation
│   │   ├── +page.svelte                 ← NEW: KYP landing/overview
│   │   ├── teams/                        (moved from /teams)
│   │   │   ├── +page.svelte
│   │   │   ├── +page.server.ts
│   │   │   ├── page.test.ts
│   │   │   └── [teamId]/
│   │   │       ├── +page.svelte
│   │   │       ├── +page.server.ts
│   │   │       └── page.test.ts
│   │   ├── employees/[id]/
│   │   │   ├── +page.svelte
│   │   │   └── +page.server.ts
│   │   ├── supervisor/
│   │   │   ├── +page.svelte
│   │   │   ├── +page.server.ts
│   │   │   └── page.test.ts
│   │   └── admin/scoring/
│   │       ├── +page.svelte
│   │       ├── +page.server.ts
│   │       └── page.test.ts
│   ├── onboarding/                       ← NEW module
│   │   ├── +layout.svelte
│   │   ├── +page.svelte                 (dashboard)
│   │   ├── +page.server.ts
│   │   ├── employees/
│   │   │   ├── +page.svelte             (employee list)
│   │   │   ├── +page.server.ts
│   │   │   └── [id]/
│   │   │       ├── +page.svelte         (employee onboarding detail)
│   │   │       └── +page.server.ts
│   │   └── templates/
│   │       ├── +page.svelte             (team templates)
│   │       └── +page.server.ts
│   ├── infrastructure/                   ← NEW module
│   │   ├── +layout.svelte
│   │   ├── +page.svelte                 (dashboard)
│   │   ├── +page.server.ts
│   │   ├── assets/
│   │   │   ├── +page.svelte             (asset directory)
│   │   │   ├── +page.server.ts
│   │   │   └── [assetId]/
│   │   │       ├── +page.svelte         (asset detail)
│   │   │       └── +page.server.ts
│   │   └── teams/
│   │       ├── +page.svelte             (team infrastructure view)
│   │       ├── +page.server.ts
│   │       └── [teamId]/
│   │           ├── +page.svelte
│   │           └── +page.server.ts
│   ├── training/                         ← NEW module
│   │   ├── +layout.svelte
│   │   ├── +page.svelte                 (dashboard)
│   │   ├── +page.server.ts
│   │   ├── catalog/
│   │   │   ├── +page.svelte             (training catalog)
│   │   │   ├── +page.server.ts
│   │   │   └── [courseId]/
│   │   │       ├── +page.svelte         (course detail)
│   │   │       └── +page.server.ts
│   │   ├── employees/
│   │   │   ├── +page.svelte             (employee training profiles)
│   │   │   ├── +page.server.ts
│   │   │   └── [id]/
│   │   │       ├── +page.svelte         (individual training profile)
│   │   │       └── +page.server.ts
│   │   └── manager/
│   │       ├── +page.svelte             (manager team view)
│   │       └── +page.server.ts
│   ├── reports/                          ← NEW placeholder module
│   │   ├── +layout.svelte
│   │   └── +page.svelte
│   ├── teams/                            ← KEEP as redirect → /kyp/teams
│   │   ├── +page.server.ts              (redirect)
│   │   └── [teamId]/+page.server.ts     (redirect)
│   ├── employees/[id]/                   ← KEEP as redirect → /kyp/employees/[id]
│   │   └── +page.server.ts              (redirect)
│   ├── employee/[id]/                    ← KEEP as redirect → /kyp/employees/[id]
│   │   └── +page.server.ts              (redirect)
│   ├── supervisor/                       ← KEEP as redirect → /kyp/supervisor
│   │   └── +page.server.ts              (redirect)
│   ├── admin/scoring/                    ← KEEP as redirect → /kyp/admin/scoring
│   │   └── +page.server.ts              (redirect)
│   └── api/v1/                           (keep all existing API routes unchanged)
│       ├── teams/+server.ts
│       ├── teams/[teamId]/+server.ts
│       ├── teams/[teamId]/members/+server.ts
│       ├── search/suggest/+server.ts
│       ├── admin/scoring-config/[scope]/[id]/+server.ts
│       ├── onboarding/                   ← NEW API routes
│       │   ├── employees/+server.ts
│       │   ├── employees/[id]/+server.ts
│       │   └── dashboard/+server.ts
│       ├── infrastructure/               ← NEW API routes
│       │   ├── assets/+server.ts
│       │   ├── assets/[assetId]/+server.ts
│       │   └── teams/[teamId]/+server.ts
│       └── training/                     ← NEW API routes
│           ├── catalog/+server.ts
│           ├── employees/[id]/+server.ts
│           └── dashboard/+server.ts
├── app.d.ts
└── test/setup.ts
```

### Target Routes
| Route | Module | Purpose |
|-------|--------|---------|
| `/` | Platform | Platform dashboard with cross-module KPIs |
| `/kyp` | KYP | KYP module landing page |
| `/kyp/teams` | KYP | Team directory |
| `/kyp/teams/[teamId]` | KYP | Team detail |
| `/kyp/employees/[id]` | KYP | Employee performance detail |
| `/kyp/supervisor` | KYP | Supervisor dashboard |
| `/kyp/admin/scoring` | KYP | Scoring configuration |
| `/onboarding` | Onboarding | Onboarding dashboard |
| `/onboarding/employees` | Onboarding | New hire list |
| `/onboarding/employees/[id]` | Onboarding | Individual onboarding tracker |
| `/onboarding/templates` | Onboarding | Team onboarding templates |
| `/infrastructure` | Infrastructure | Infrastructure dashboard |
| `/infrastructure/assets` | Infrastructure | Asset directory |
| `/infrastructure/assets/[assetId]` | Infrastructure | Asset detail |
| `/infrastructure/teams` | Infrastructure | Team infrastructure overview |
| `/infrastructure/teams/[teamId]` | Infrastructure | Team-specific infrastructure |
| `/training` | Training | Training dashboard |
| `/training/catalog` | Training | Course catalog |
| `/training/catalog/[courseId]` | Training | Course detail |
| `/training/employees` | Training | Employee training profiles |
| `/training/employees/[id]` | Training | Individual training profile |
| `/training/manager` | Training | Manager team training view |
| `/reports` | Reports | Placeholder landing page |

### Legacy Redirects (backward compatibility)
| Old Route | Redirects To |
|-----------|-------------|
| `/teams` | `/kyp/teams` |
| `/teams/[teamId]` | `/kyp/teams/[teamId]` |
| `/employees/[id]` | `/kyp/employees/[id]` |
| `/employee/[id]` | `/kyp/employees/[id]` |
| `/supervisor` | `/kyp/supervisor` |
| `/admin/scoring` | `/kyp/admin/scoring` |

---

## 4. Implementation Phases

Execute phases in order. Each phase should pass `npm run check` and `npm run test` before proceeding.

| Phase | Description | Estimated New Files | Estimated Modified Files |
|-------|-------------|--------------------:|-------------------------:|
| 1 | Platform Shell & KYP Migration | ~12 | ~8 |
| 2 | Shared Infrastructure | ~12 | ~3 |
| 3 | Employee Onboarding Module | ~14 | ~2 |
| 4 | Infrastructure Module | ~14 | ~2 |
| 5 | Training Management Module | ~16 | ~2 |
| 6 | Stakeholder Reports Placeholder | ~3 | ~1 |
| 7 | Platform Dashboard | ~1 | ~2 |
| 8 | Polish, Tests & Validation | ~4 | ~5 |

---

## Phase 1: Platform Shell & KYP Migration

**Goal:** Transform the root layout into a platform shell and move all KYP routes under `/kyp`.

### Step 1.1: Update Global Styles

**File:** `src/lib/styles/app.css`
**Action:** MODIFY

Add platform shell styles while keeping all existing styles. New additions:

```css
/* Platform sidebar navigation */
.platform {
  display: grid;
  grid-template-columns: 240px 1fr;
  grid-template-rows: 56px 1fr;
  min-height: 100vh;
}
.platform__header {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  padding: 0 24px;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
}
.platform__sidebar {
  background: var(--surface);
  border-right: 1px solid var(--border);
  padding: 16px 0;
  overflow-y: auto;
}
.platform__sidebar nav { display: flex; flex-direction: column; gap: 2px; padding: 0 8px; }
.platform__sidebar a {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 16px; border-radius: var(--radius);
  color: var(--muted); text-decoration: none; font-size: 0.9rem;
  transition: background 0.15s, color 0.15s;
}
.platform__sidebar a:hover { background: var(--surface-muted); color: var(--ink); }
.platform__sidebar a.active { background: var(--accent-soft); color: var(--accent); font-weight: 600; }
.platform__main { padding: 24px 32px; overflow-y: auto; background: var(--bg); }
/* Module sub-navigation */
.module-nav { display: flex; gap: 4px; padding: 0 0 20px; border-bottom: 1px solid var(--border); margin-bottom: 20px; }
.module-nav a {
  padding: 8px 16px; border-radius: var(--radius);
  color: var(--muted); text-decoration: none; font-size: 0.85rem;
}
.module-nav a:hover { background: var(--surface-muted); }
.module-nav a.active { background: var(--accent-soft); color: var(--accent); font-weight: 600; }
/* Responsive: collapse sidebar on small screens */
@media (max-width: 900px) {
  .platform { grid-template-columns: 1fr; }
  .platform__sidebar { display: none; }
}
```

Keep all existing `.shell__*`, `.panel`, `.button`, `.home` styles intact for compatibility during migration.

### Step 1.2: Create Navigation Store

**File:** `src/lib/stores/navigation.ts`
**Action:** CREATE

```typescript
import { writable, derived } from 'svelte/store';

export type ModuleId = 'home' | 'kyp' | 'onboarding' | 'infrastructure' | 'training' | 'reports';

export interface ModuleDefinition {
  id: ModuleId;
  label: string;
  href: string;
  icon: string;  // emoji or text icon for prototype
  description: string;
}

export const modules: ModuleDefinition[] = [
  { id: 'home', label: 'Dashboard', href: '/', icon: '📊', description: 'Platform overview' },
  { id: 'kyp', label: 'KYP', href: '/kyp', icon: '⚡', description: 'Know Your Performance' },
  { id: 'onboarding', label: 'Onboarding', href: '/onboarding', icon: '🚀', description: 'Employee Onboarding' },
  { id: 'infrastructure', label: 'Infrastructure', href: '/infrastructure', icon: '🏗️', description: 'Infrastructure Inventory' },
  { id: 'training', label: 'Training', href: '/training', icon: '📚', description: 'Training Management' },
  { id: 'reports', label: 'Reports', href: '/reports', icon: '📋', description: 'Stakeholder Reports' },
];

export const activeModule = writable<ModuleId>('home');
```

### Step 1.3: Rewrite Root Layout

**File:** `src/routes/+layout.svelte`
**Action:** REWRITE

Replace the KYP-specific shell with a platform shell. The layout should:

1. Import `app.css` (keep existing import)
2. Render a platform grid layout with:
   - **Header bar:** Platform brand name "Engineering Ops" (left), optional global controls (right)
   - **Sidebar:** Vertical nav listing all modules from the `modules` array. Use `$page.url.pathname` to determine which module link gets the `.active` class. A link is active if the current path starts with the module's `href` (with special handling for `/` which is exact-match only).
   - **Main content area:** `<slot />` (or `{@render children()}` for Svelte 5 snippets — check which pattern the existing layout uses and match it)
3. The sidebar should show module icon + label for each module
4. On mobile (< 900px), hide the sidebar

**Important:** Check the existing `+layout.svelte` to see if it uses Svelte 5 snippet syntax (`{@render children()}`) or slot syntax (`<slot />`). Match whichever pattern is already in use.

### Step 1.4: Move KYP Components

**Action:** Move (git mv) all existing components into a `kyp/` subdirectory:

```bash
mkdir -p src/lib/components/kyp
git mv src/lib/components/AlertPanel.svelte src/lib/components/kyp/
git mv src/lib/components/CohortDistributionPanel.svelte src/lib/components/kyp/
git mv src/lib/components/ContributionSources.svelte src/lib/components/kyp/
git mv src/lib/components/MetricCard.svelte src/lib/components/kyp/
git mv src/lib/components/PeriodSelector.svelte src/lib/components/kyp/
git mv src/lib/components/RadarDimensionsChart.svelte src/lib/components/kyp/
git mv src/lib/components/TeamRosterTable.svelte src/lib/components/kyp/
git mv src/lib/components/TeamRosterTable.test.ts src/lib/components/kyp/
git mv src/lib/components/TrendSparklineGrid.svelte src/lib/components/kyp/
```

Then update all import paths in files that reference these components. The affected files are:
- `src/routes/teams/+page.svelte` → imports MetricCard
- `src/routes/teams/[teamId]/+page.svelte` → imports AlertPanel, MetricCard
- `src/routes/supervisor/+page.svelte` → imports MetricCard, PeriodSelector, TeamRosterTable, CohortDistributionPanel, AlertPanel
- `src/routes/employees/[id]/+page.svelte` → imports RadarDimensionsChart, TrendSparklineGrid, ContributionSources, MetricCard
- `src/routes/employee/[id]/+page.svelte` → imports RadarDimensionsChart, TrendSparklineGrid, ContributionSources

Change import paths from `$lib/components/X.svelte` to `$lib/components/kyp/X.svelte`.

### Step 1.5: Create KYP Route Group

**Action:** Create `/kyp` route group and move existing route files.

1. Create `src/routes/kyp/+layout.svelte` — KYP module sub-navigation:
   - Sub-nav links: Teams (`/kyp/teams`), Team Detail (`/kyp/teams/team-alpha`), Employee (`/kyp/employees/alex-rivera`), Admin (`/kyp/admin/scoring`)
   - Uses the `.module-nav` CSS class
   - Renders `<slot />` or `{@render children()}` below the sub-nav

2. Create `src/routes/kyp/+page.svelte` — KYP module landing page:
   - Title: "Know Your Performance"
   - Brief description of the module
   - Quick-links cards to Teams, Employee View, Admin Scoring
   - Summary KPIs (total teams, total employees, active sources count) loaded from mock data

3. Create `src/routes/kyp/+page.server.ts` — loads KYP overview data from mock service

4. **Move route files** (use `git mv` to preserve history):

```bash
# Teams
mkdir -p src/routes/kyp/teams/\[teamId\]
git mv src/routes/teams/+page.svelte src/routes/kyp/teams/
git mv src/routes/teams/+page.server.ts src/routes/kyp/teams/
git mv src/routes/teams/page.test.ts src/routes/kyp/teams/
git mv src/routes/teams/\[teamId\]/+page.svelte src/routes/kyp/teams/\[teamId\]/
git mv src/routes/teams/\[teamId\]/+page.server.ts src/routes/kyp/teams/\[teamId\]/
git mv src/routes/teams/\[teamId\]/page.test.ts src/routes/kyp/teams/\[teamId\]/

# Employees
mkdir -p src/routes/kyp/employees/\[id\]
git mv src/routes/employees/\[id\]/+page.svelte src/routes/kyp/employees/\[id\]/
git mv src/routes/employees/\[id\]/+page.server.ts src/routes/kyp/employees/\[id\]/

# Supervisor
mkdir -p src/routes/kyp/supervisor
git mv src/routes/supervisor/+page.svelte src/routes/kyp/supervisor/
git mv src/routes/supervisor/+page.server.ts src/routes/kyp/supervisor/
git mv src/routes/supervisor/page.test.ts src/routes/kyp/supervisor/

# Admin Scoring
mkdir -p src/routes/kyp/admin/scoring
git mv src/routes/admin/scoring/+page.svelte src/routes/kyp/admin/scoring/
git mv src/routes/admin/scoring/+page.server.ts src/routes/kyp/admin/scoring/
git mv src/routes/admin/scoring/page.test.ts src/routes/kyp/admin/scoring/
```

5. **Update internal links** within moved KYP files:
   - Any `href="/teams"` → `href="/kyp/teams"`
   - Any `href="/teams/..."` → `href="/kyp/teams/..."`
   - Any `href="/employees/..."` → `href="/kyp/employees/..."`
   - Any `href="/admin/scoring"` → `href="/kyp/admin/scoring"`
   - Any `goto('/teams...')` → `goto('/kyp/teams...')`
   - Any `goto('/employees...')` → `goto('/kyp/employees...')`

   **Files to update (check each for internal links):**
   - `src/routes/kyp/teams/+page.svelte`
   - `src/routes/kyp/teams/[teamId]/+page.svelte`
   - `src/routes/kyp/employees/[id]/+page.svelte`
   - `src/routes/kyp/supervisor/+page.svelte`
   - `src/routes/kyp/admin/scoring/+page.svelte`
   - `src/routes/kyp/teams/+page.server.ts`
   - `src/routes/kyp/supervisor/+page.server.ts`
   - `src/lib/components/kyp/TeamRosterTable.svelte` (if it has employee links)

### Step 1.6: Create Legacy Redirects

Create redirect-only server files at the old route locations. These should return 307 redirects.

**Pattern for each redirect file (example: `src/routes/teams/+page.server.ts`):**

```typescript
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
  redirect(307, '/kyp/teams');
};
```

Create redirects for:
| Old File | Redirect Target |
|----------|----------------|
| `src/routes/teams/+page.server.ts` | `/kyp/teams` (plus pass query string) |
| `src/routes/teams/[teamId]/+page.server.ts` | `/kyp/teams/${params.teamId}` |
| `src/routes/employees/[id]/+page.server.ts` | `/kyp/employees/${params.id}` |
| `src/routes/employee/[id]/+page.server.ts` (or +page.ts) | `/kyp/employees/${params.id}` |
| `src/routes/supervisor/+page.server.ts` | `/kyp/supervisor` |
| `src/routes/admin/scoring/+page.server.ts` | `/kyp/admin/scoring` |

Remove the old `+page.svelte` files from legacy routes since they'll never render (the server load redirects first). Keep the directory structure for the redirect files.

**Note on legacy `/employee/[id]`:** This currently has a `+page.ts` (not `+page.server.ts`). Convert it to a `+page.server.ts` redirect targeting `/kyp/employees/${params.id}`.

### Step 1.7: Validate Phase 1

```bash
npm run check    # Must pass with 0 errors
npm run test     # Existing tests should pass (update import paths in test files if needed)
npm run build    # Must build successfully
```

Fix any broken imports. The main risk is missed import path updates after the component and route moves.

---

## Phase 2: Shared Infrastructure

**Goal:** Create shared types, components, and refactor mock data into module-based structure.

### Step 2.1: Create Shared Types

**File:** `src/lib/types/shared.ts`
**Action:** CREATE

```typescript
export type StatusType = 'active' | 'inactive' | 'pending' | 'blocked' | 'completed';

export interface Person {
  id: string;
  name: string;
  email: string;
  role: string;
  team: string;
  avatarUrl?: string;
}

export interface TeamRef {
  id: string;
  name: string;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface KpiSummary {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  trend?: 'up' | 'down' | 'flat';
}
```

### Step 2.2: Create Shared Components

Create `src/lib/components/shared/` with these reusable components:

#### `DataTable.svelte`
A generic sortable, paginated table component. Props:
- `columns: { key: string; label: string; sortable?: boolean; align?: string }[]`
- `rows: Record<string, any>[]`
- `sortKey: string`
- `sortDirection: 'asc' | 'desc'`
- `onSort: (key: string) => void`
- `onRowClick?: (row: any) => void`

Renders a styled `<table>` with sortable headers, hover rows, and click handling. Use the existing TeamRosterTable as style reference.

#### `FilterBar.svelte`
A horizontal filter bar. Props:
- `filters: { key: string; label: string; options: { value: string; label: string }[]; value: string }[]`
- `onFilterChange: (key: string, value: string) => void`
- `onReset: () => void`

Renders a row of `<select>` dropdowns with a reset button.

#### `SearchInput.svelte`
A search input with debounce. Props:
- `value: string`
- `placeholder: string`
- `onSearch: (query: string) => void`

#### `StatusBadge.svelte`
A colored status pill. Props:
- `status: string`
- `variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral'`

Renders a small colored badge. Map common statuses to variants automatically (e.g., "completed" → success, "blocked" → danger).

#### `KpiCard.svelte`
A KPI summary card (generalized from MetricCard). Props:
- `label: string`
- `value: string | number`
- `subtitle?: string`
- `trend?: 'up' | 'down' | 'flat'`
- `change?: string`

#### `ProgressBar.svelte`
A simple progress indicator. Props:
- `value: number` (0-100)
- `label?: string`
- `variant?: 'default' | 'success' | 'warning' | 'danger'`

#### `EmptyState.svelte`
A placeholder for empty/coming-soon states. Props:
- `title: string`
- `message: string`
- `icon?: string`

### Step 2.3: Refactor Mock Data

Split `src/lib/mock/kypData.ts` (976 lines) into module-based files.

**Important:** Do NOT delete `kypData.ts` yet. Instead, create the new modular files and then update `kypData.ts` to re-export from them. This avoids breaking existing imports during migration.

#### `src/lib/mock/kyp/seed.ts`
Move from `kypData.ts`:
- `periodOptions`, `defaultPeriod`, `reportLastUpdated`, `teamName`
- `metricLabels`, `weightPresets`, `weightPresetMap`, `weightPresetDescriptions`, `periodDescriptions`
- `alerts`
- Team blueprint data (Team Alpha, Beacon, Cirrus, Delta)
- Employee generation functions
- `teamRoster` export

#### `src/lib/mock/kyp/scoring.ts`
Move from `kypData.ts`:
- `sourceLabels`, `defaultScoringConfig`
- `activeScoringConfig` (mutable state)
- `getScoringConfig()`, `getDefaultScoringConfig()`, `validateScoringConfig()`, `updateScoringConfig()`, `getAdminScorePreview()`

#### `src/lib/mock/kyp/queries.ts`
Move from `kypData.ts`:
- `listTeams()`, `parseTeamFilters()`, `getTeamDetail()`, `getTeamRoster()`
- `getEmployeeDetail()`, `getAllEmployeeListItems()`
- `getTeamSearchTypeahead()`
- `defaultTeamFilterState`

#### `src/lib/mock/kyp/index.ts`
Re-export everything from `seed.ts`, `scoring.ts`, `queries.ts`:
```typescript
export * from './seed';
export * from './scoring';
export * from './queries';
```

#### `src/lib/mock/kypData.ts` (update)
Replace the 976-line file with:
```typescript
// Backward-compatible re-export — all consumers continue to work
export * from './kyp/index';
```

This ensures zero breakage: all existing `import { X } from '$lib/mock/kypData'` statements still resolve.

#### `src/lib/mock/shared/employees.ts`
Create a shared employee registry that can be referenced by Onboarding, Training, and KYP. This provides cross-module employee identity:

```typescript
import type { Person, TeamRef } from '$lib/types/shared';

export const teams: TeamRef[] = [
  { id: 'team-alpha', name: 'Team Alpha' },
  { id: 'team-beacon', name: 'Team Beacon' },
  { id: 'team-cirrus', name: 'Team Cirrus' },
  { id: 'team-delta', name: 'Team Delta' },
];

export const employees: Person[] = [
  { id: 'alex-rivera', name: 'Alex Rivera', email: 'alex.rivera@company.com', role: 'Senior Engineer', team: 'team-alpha' },
  { id: 'jordan-lee', name: 'Jordan Lee', email: 'jordan.lee@company.com', role: 'Engineer', team: 'team-alpha' },
  // ... 15-20 employees across all teams
];

export function getEmployee(id: string): Person | undefined { ... }
export function getTeamEmployees(teamId: string): Person[] { ... }
export function getTeam(id: string): TeamRef | undefined { ... }
```

### Step 2.4: Validate Phase 2

```bash
npm run check
npm run test
npm run build
```

All existing tests must still pass. The mock data refactor should be transparent due to re-exports.

---

## Phase 3: Employee Onboarding Module

**Goal:** Create a complete onboarding workflow prototype with dashboards, checklists, and team templates.

### Step 3.1: Create Onboarding Types

**File:** `src/lib/types/onboarding.ts`
**Action:** CREATE

```typescript
import type { Person, TeamRef } from './shared';

export type OnboardingStatus = 'not_started' | 'in_progress' | 'completed' | 'blocked';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'blocked' | 'approved';
export type TaskCategory = 'hardware' | 'accounts' | 'access' | 'team_specific' | 'hr' | 'orientation';

export interface OnboardingTask {
  id: string;
  title: string;
  category: TaskCategory;
  status: TaskStatus;
  assignedTo?: string;
  dueDate?: string;
  completedDate?: string;
  notes?: string;
  blockedReason?: string;
}

export interface OnboardingEmployee {
  person: Person;
  startDate: string;
  manager: Person;
  team: TeamRef;
  location: string;
  employmentType: 'full_time' | 'contract' | 'intern';
  status: OnboardingStatus;
  completionPercent: number;
  tasks: OnboardingTask[];
  teamSpecificTasks: OnboardingTask[];
}

export interface OnboardingTemplate {
  teamId: string;
  teamName: string;
  tasks: Omit<OnboardingTask, 'id' | 'status' | 'completedDate'>[];
}

export interface OnboardingDashboardStats {
  newHiresThisMonth: number;
  activeOnboardings: number;
  completedThisMonth: number;
  blockedTasks: number;
  averageCompletionPercent: number;
  upcomingStartDates: { person: Person; startDate: string; team: TeamRef }[];
  delayedTasks: { task: OnboardingTask; employee: Person }[];
}
```

### Step 3.2: Create Onboarding Mock Data

**File:** `src/lib/mock/onboarding/seed.ts`

Generate realistic mock data:
- 8-10 onboarding employees in various stages (not_started, in_progress, completed, blocked)
- Common tasks: laptop requested/delivered, corporate account, email, VPN, source control, Jira, Confluence, Slack
- Team-specific tasks per team template (Platform: K8s + cloud console; Frontend: design tools + Storybook; Data: warehouse + analytics)
- 3-4 team templates

**File:** `src/lib/mock/onboarding/queries.ts`

Functions:
- `getOnboardingDashboard(): OnboardingDashboardStats`
- `listOnboardingEmployees(filters?): OnboardingEmployee[]`
- `getOnboardingEmployee(id: string): OnboardingEmployee | undefined`
- `getOnboardingTemplates(): OnboardingTemplate[]`
- `getOnboardingTemplate(teamId: string): OnboardingTemplate | undefined`
- `updateTaskStatus(employeeId: string, taskId: string, status: TaskStatus): void`

**File:** `src/lib/mock/onboarding/index.ts` — re-exports

### Step 3.3: Create Onboarding Routes

#### `src/routes/onboarding/+layout.svelte`
Module sub-navigation:
- Dashboard (`/onboarding`)
- Employees (`/onboarding/employees`)
- Templates (`/onboarding/templates`)

#### `src/routes/onboarding/+page.svelte` + `+page.server.ts`
**Onboarding Dashboard:**
- KPI row: New Hires This Month, Active Onboardings, Completion Rate, Blocked Tasks
- Upcoming Start Dates table (next 30 days)
- Delayed Tasks list with employee name and task title
- Status breakdown chart (not_started / in_progress / completed / blocked counts)

#### `src/routes/onboarding/employees/+page.svelte` + `+page.server.ts`
**Employee List:**
- DataTable showing all onboarding employees
- Columns: Name, Team, Start Date, Status, Completion %, Manager
- Filter by status, team
- Search by name
- Click row → employee detail

#### `src/routes/onboarding/employees/[id]/+page.svelte` + `+page.server.ts`
**Employee Onboarding Detail:**
- Employee info card: name, email, team, manager, start date, location, employment type
- Overall progress bar
- Checklist grouped by category (Hardware, Accounts, Access, Team-Specific, HR, Orientation)
- Each task shows: title, status badge, assigned to, due date, notes
- Status can be toggled (prototype only — calls mock function)

#### `src/routes/onboarding/templates/+page.svelte` + `+page.server.ts`
**Team Templates:**
- List of team onboarding templates
- Each template shows team name and task list
- Tasks grouped by category
- Read-only view for prototype

### Step 3.4: Create Onboarding API Routes

#### `src/routes/api/v1/onboarding/employees/+server.ts`
- `GET` — list onboarding employees (supports `?status=` and `?team=` filters)

#### `src/routes/api/v1/onboarding/employees/[id]/+server.ts`
- `GET` — get single onboarding employee detail

#### `src/routes/api/v1/onboarding/dashboard/+server.ts`
- `GET` — get dashboard stats

### Step 3.5: Validate Phase 3

```bash
npm run check
npm run test
npm run build
```

---

## Phase 4: Infrastructure Module

**Goal:** Create an infrastructure inventory and ownership visibility module.

### Step 4.1: Create Infrastructure Types

**File:** `src/lib/types/infrastructure.ts`
**Action:** CREATE

```typescript
import type { TeamRef } from './shared';

export type AssetType = 'cloud_project' | 'kubernetes_cluster' | 'database' | 'repository' |
  'cicd_pipeline' | 'monitoring' | 'internal_service' | 'shared_platform';
export type Environment = 'production' | 'staging' | 'development' | 'shared';
export type Criticality = 'critical' | 'high' | 'medium' | 'low';

export interface InfraAsset {
  id: string;
  name: string;
  type: AssetType;
  description: string;
  environment: Environment;
  criticality: Criticality;
  ownerTeam: TeamRef;
  consumedByTeams: TeamRef[];
  dependencies: { assetId: string; assetName: string }[];
  tags: string[];
  createdAt: string;
  lastUpdated: string;
  url?: string;
}

export interface TeamInfrastructure {
  team: TeamRef;
  ownedAssets: InfraAsset[];
  consumedAssets: InfraAsset[];
  sharedResources: InfraAsset[];
}

export interface InfraDashboardStats {
  totalAssets: number;
  byType: { type: AssetType; count: number }[];
  byEnvironment: { environment: Environment; count: number }[];
  criticalSystems: InfraAsset[];
  ownershipCoverage: number; // percent of assets with an owner
  recentlyUpdated: InfraAsset[];
}
```

### Step 4.2: Create Infrastructure Mock Data

**File:** `src/lib/mock/infrastructure/seed.ts`

Generate 25-30 infrastructure assets:
- 4-5 cloud projects (GCP/AWS accounts per team)
- 3-4 Kubernetes clusters (prod, staging, dev, shared)
- 5-6 databases (PostgreSQL, Redis, Elasticsearch instances)
- 6-8 repositories (core repos, shared libs)
- 3-4 CI/CD pipelines (Jenkins, GitHub Actions)
- 2-3 monitoring systems (Datadog, PagerDuty)
- 3-4 internal services (API gateway, auth service, notification service)
- 2-3 shared platforms (logging, feature flags)

Each asset should have realistic ownership (mapped to Team Alpha/Beacon/Cirrus/Delta), dependencies, and metadata.

**File:** `src/lib/mock/infrastructure/queries.ts`

Functions:
- `getInfraDashboard(): InfraDashboardStats`
- `listAssets(filters?): InfraAsset[]`
- `getAsset(id: string): InfraAsset | undefined`
- `getTeamInfrastructure(teamId: string): TeamInfrastructure`
- `listTeamsInfra(): { team: TeamRef; ownedCount: number; consumedCount: number }[]`

**File:** `src/lib/mock/infrastructure/index.ts` — re-exports

### Step 4.3: Create Infrastructure Routes

#### `src/routes/infrastructure/+layout.svelte`
Sub-navigation: Dashboard, Assets, Teams

#### `src/routes/infrastructure/+page.svelte` + `+page.server.ts`
**Infrastructure Dashboard:**
- KPI row: Total Assets, Critical Systems, Ownership Coverage %, Environments
- Assets by Type breakdown (bar/list)
- Assets by Environment breakdown
- Critical Systems list
- Recently Updated assets

#### `src/routes/infrastructure/assets/+page.svelte` + `+page.server.ts`
**Asset Directory:**
- DataTable: Name, Type, Environment, Criticality, Owner Team, Dependencies count
- Filter by type, environment, criticality, owner team
- Search by name
- Click → asset detail

#### `src/routes/infrastructure/assets/[assetId]/+page.svelte` + `+page.server.ts`
**Asset Detail:**
- Asset info: name, type, environment, criticality, description, URL
- Owner team (linked)
- Consumed by teams list
- Dependencies list (linked to other assets)
- Tags
- Timestamps

#### `src/routes/infrastructure/teams/+page.svelte` + `+page.server.ts`
**Team Infrastructure Overview:**
- Table of teams with owned/consumed/shared asset counts
- Click → team detail

#### `src/routes/infrastructure/teams/[teamId]/+page.svelte` + `+page.server.ts`
**Team Infrastructure Detail:**
- Team name and summary
- Three sections: Owned Assets, Consumed Assets, Shared Resources
- Each section is a DataTable with asset name, type, environment, criticality

### Step 4.4: Create Infrastructure API Routes

#### `src/routes/api/v1/infrastructure/assets/+server.ts`
- `GET` — list/filter assets

#### `src/routes/api/v1/infrastructure/assets/[assetId]/+server.ts`
- `GET` — single asset detail

#### `src/routes/api/v1/infrastructure/teams/[teamId]/+server.ts`
- `GET` — team infrastructure view

### Step 4.5: Validate Phase 4

```bash
npm run check
npm run test
npm run build
```

---

## Phase 5: Training Management Module

**Goal:** Create a training and learning management prototype with catalog, profiles, and manager views.

### Step 5.1: Create Training Types

**File:** `src/lib/types/training.ts`
**Action:** CREATE

```typescript
import type { Person, TeamRef } from './shared';

export type TrainingStatus = 'not_started' | 'in_progress' | 'completed' | 'expired' | 'overdue';
export type TrainingCategory = 'security' | 'compliance' | 'technical' | 'leadership' | 'onboarding' | 'certification';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface TrainingCourse {
  id: string;
  title: string;
  category: TrainingCategory;
  description: string;
  duration: string; // e.g. "2 hours", "3 days"
  difficulty: Difficulty;
  provider: string;
  required: boolean;
  tags: string[];
  recommendedFor: { roles: string[]; teams: string[]; tracks: string[] };
}

export interface EmployeeTraining {
  courseId: string;
  course: TrainingCourse;
  status: TrainingStatus;
  assignedDate: string;
  dueDate?: string;
  completedDate?: string;
  expiryDate?: string;
  score?: number;
}

export interface EmployeeTrainingProfile {
  person: Person;
  team: TeamRef;
  trainings: EmployeeTraining[];
  certifications: Certification[];
  completionRate: number;
  overdueCount: number;
  recommendedCourses: TrainingCourse[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  earnedDate: string;
  expiryDate?: string;
  status: 'active' | 'expired' | 'expiring_soon';
}

export interface TrainingDashboardStats {
  totalCourses: number;
  overallCompletionRate: number;
  overdueTrainings: number;
  upcomingDeadlines: { person: Person; course: TrainingCourse; dueDate: string }[];
  expiringCertifications: { person: Person; certification: Certification }[];
  completionByCategory: { category: TrainingCategory; rate: number }[];
  completionByTeam: { team: TeamRef; rate: number; overdueCount: number }[];
}

export interface ManagerTrainingView {
  team: TeamRef;
  members: {
    person: Person;
    completionRate: number;
    overdueCount: number;
    upcomingDeadlines: number;
    expiringCerts: number;
  }[];
  teamCompletionRate: number;
  trainingGaps: { course: TrainingCourse; missingCount: number }[];
}
```

### Step 5.2: Create Training Mock Data

**File:** `src/lib/mock/training/seed.ts`

Generate:
- 15-20 training courses across categories (security awareness, OWASP, cloud cert prep, leadership 101, compliance, K8s fundamentals, etc.)
- Employee training assignments (each employee has 4-8 trainings in various states)
- 10-15 certifications across employees (AWS, GCP, K8s, security certs)
- Recommendation logic: match courses to employee role/team

**File:** `src/lib/mock/training/queries.ts`

Functions:
- `getTrainingDashboard(): TrainingDashboardStats`
- `listCourses(filters?): TrainingCourse[]`
- `getCourse(id: string): TrainingCourse | undefined`
- `listEmployeeProfiles(filters?): EmployeeTrainingProfile[]`
- `getEmployeeTrainingProfile(id: string): EmployeeTrainingProfile | undefined`
- `getManagerView(teamId: string): ManagerTrainingView`

**File:** `src/lib/mock/training/index.ts` — re-exports

### Step 5.3: Create Training Routes

#### `src/routes/training/+layout.svelte`
Sub-navigation: Dashboard, Catalog, Employees, Manager View

#### `src/routes/training/+page.svelte` + `+page.server.ts`
**Training Dashboard:**
- KPI row: Total Courses, Completion Rate, Overdue Trainings, Expiring Certs
- Upcoming Deadlines table
- Completion by Category breakdown
- Completion by Team breakdown
- Expiring Certifications list

#### `src/routes/training/catalog/+page.svelte` + `+page.server.ts`
**Training Catalog:**
- DataTable: Title, Category, Duration, Difficulty, Required badge, Provider
- Filter by category, difficulty, required/optional
- Search by title
- Click → course detail

#### `src/routes/training/catalog/[courseId]/+page.svelte` + `+page.server.ts`
**Course Detail:**
- Course info: title, category, description, duration, difficulty, provider
- Required badge
- Tags
- Recommended for roles/teams/tracks
- Enrollment stats (how many assigned, completed, in progress)

#### `src/routes/training/employees/+page.svelte` + `+page.server.ts`
**Employee Training Profiles:**
- DataTable: Name, Team, Completion Rate, Overdue, Certifications count
- Filter by team, status
- Search by name
- Click → individual profile

#### `src/routes/training/employees/[id]/+page.svelte` + `+page.server.ts`
**Individual Training Profile:**
- Employee info card
- Overall completion progress bar
- Assigned Trainings table: Course, Status, Due Date, Completed Date, Score
- Certifications section: Name, Issuer, Earned, Expiry, Status badge
- Recommended Courses section

#### `src/routes/training/manager/+page.svelte` + `+page.server.ts`
**Manager Team View:**
- Team selector (dropdown of teams)
- Team completion rate
- Member table: Name, Completion %, Overdue, Upcoming Deadlines, Expiring Certs
- Training Gaps section: courses where team members are missing required training

### Step 5.4: Create Training API Routes

#### `src/routes/api/v1/training/catalog/+server.ts`
- `GET` — list/filter courses

#### `src/routes/api/v1/training/employees/[id]/+server.ts`
- `GET` — employee training profile

#### `src/routes/api/v1/training/dashboard/+server.ts`
- `GET` — dashboard stats

### Step 5.5: Validate Phase 5

```bash
npm run check
npm run test
npm run build
```

---

## Phase 6: Stakeholder Reports Placeholder

**Goal:** Create a minimal placeholder module that can be extended later.

### Step 6.1: Create Routes

#### `src/routes/reports/+layout.svelte`
Minimal layout with module header. No sub-navigation yet.

#### `src/routes/reports/+page.svelte`
**Placeholder Landing Page:**
- Module title: "Stakeholder Reports"
- EmptyState component with:
  - Title: "Coming Soon"
  - Message: "Stakeholder reporting functionality is under development. This module will provide executive dashboards, team health reports, and custom report generation."
  - Icon: 📋
- A few placeholder cards showing planned report types:
  - Executive Summary
  - Team Health Report
  - Quarterly Review
  - Custom Report Builder
- Each card should have a title, brief description, and a "Coming Soon" badge

### Step 6.2: Validate Phase 6

```bash
npm run check
npm run build
```

---

## Phase 7: Platform Dashboard (Home)

**Goal:** Create the platform-level home dashboard with cross-module KPIs.

### Step 7.1: Rewrite Home Page

**File:** `src/routes/+page.svelte`
**Action:** REWRITE

**File:** `src/routes/+page.server.ts`
**Action:** CREATE (new — loads dashboard data from all modules)

The server load function should import dashboard stats from each module's mock data:
```typescript
import { getOnboardingDashboard } from '$lib/mock/onboarding';
import { getInfraDashboard } from '$lib/mock/infrastructure';
import { getTrainingDashboard } from '$lib/mock/training';
// KYP summary: team count, employee count, etc.
```

**Platform Dashboard page should include:**
- Platform title: "Engineering Operations Platform"
- KPI row (one per module):
  - KYP: Active Teams count, Average Team Score
  - Onboarding: Active Onboardings, Completion Rate
  - Infrastructure: Total Assets, Critical Systems
  - Training: Overall Completion Rate, Overdue count
- Module cards grid (one card per module):
  - Each card: module icon, name, 2-3 key stats, "View Module →" link
  - Reports card should show "Coming Soon" styling

### Step 7.2: Validate Phase 7

```bash
npm run check
npm run build
```

---

## Phase 8: Polish, Tests & Validation

**Goal:** Add tests for new modules, fix any remaining issues, ensure full build passes.

### Step 8.1: Update Existing Tests

Review and fix any test files that broke due to import path changes:
- `src/lib/components/kyp/TeamRosterTable.test.ts` — update component import path
- `src/lib/stores/period.test.ts` — should be unaffected
- `src/lib/utils/*.test.ts` — should be unaffected
- `src/routes/kyp/teams/page.test.ts` — update if route imports changed
- `src/routes/kyp/teams/[teamId]/page.test.ts` — update if route imports changed
- `src/routes/kyp/supervisor/page.test.ts` — update if route imports changed
- `src/routes/kyp/admin/scoring/page.test.ts` — update if route imports changed

### Step 8.2: Add New Module Tests

Create at minimum one test file per new module:

#### `src/lib/mock/onboarding/queries.test.ts`
- Test `getOnboardingDashboard()` returns valid stats
- Test `listOnboardingEmployees()` returns employees and supports filters
- Test `getOnboardingEmployee()` returns correct employee

#### `src/lib/mock/infrastructure/queries.test.ts`
- Test `getInfraDashboard()` returns valid stats
- Test `listAssets()` returns assets and supports filters
- Test `getTeamInfrastructure()` returns correct team data

#### `src/lib/mock/training/queries.test.ts`
- Test `getTrainingDashboard()` returns valid stats
- Test `listCourses()` returns courses and supports filters
- Test `getEmployeeTrainingProfile()` returns correct profile

#### `src/routes/onboarding/page.test.ts`
- Test dashboard page renders KPIs

#### `src/routes/infrastructure/page.test.ts`
- Test dashboard page renders KPIs

#### `src/routes/training/page.test.ts`
- Test dashboard page renders KPIs

### Step 8.3: Final Validation

```bash
npm run check    # 0 errors, 0 warnings
npm run test     # All tests pass
npm run build    # Successful build
```

### Step 8.4: Manual Smoke Test Routes

Verify each route loads without errors in the dev server (`npm run dev`):

| Route | Expected |
|-------|----------|
| `/` | Platform dashboard with cross-module KPIs |
| `/kyp` | KYP module landing |
| `/kyp/teams` | Team directory (existing functionality) |
| `/kyp/teams/team-alpha` | Team detail (existing) |
| `/kyp/employees/alex-rivera` | Employee detail (existing) |
| `/kyp/admin/scoring` | Scoring admin (existing) |
| `/onboarding` | Onboarding dashboard |
| `/onboarding/employees` | New hire list |
| `/onboarding/employees/{id}` | Onboarding detail |
| `/onboarding/templates` | Team templates |
| `/infrastructure` | Infra dashboard |
| `/infrastructure/assets` | Asset directory |
| `/infrastructure/assets/{id}` | Asset detail |
| `/infrastructure/teams` | Team infra overview |
| `/infrastructure/teams/{teamId}` | Team infra detail |
| `/training` | Training dashboard |
| `/training/catalog` | Course catalog |
| `/training/catalog/{id}` | Course detail |
| `/training/employees` | Employee profiles |
| `/training/employees/{id}` | Individual profile |
| `/training/manager` | Manager view |
| `/reports` | Placeholder page |
| `/teams` | Redirects to `/kyp/teams` |
| `/employees/alex-rivera` | Redirects to `/kyp/employees/alex-rivera` |

---

## File-by-File Change Manifest

### Files to MODIFY (existing)

| File | Change |
|------|--------|
| `src/lib/styles/app.css` | Add platform shell + module nav styles |
| `src/routes/+layout.svelte` | Rewrite: KYP shell → platform shell |
| `src/routes/+page.svelte` | Rewrite: KYP home → platform dashboard |
| `src/lib/mock/kypData.ts` | Replace with re-export from `./kyp/index` |
| All moved KYP route files | Update internal `href` and `goto()` paths |
| All moved KYP component imports | Update `$lib/components/X` → `$lib/components/kyp/X` |
| Legacy redirect routes | Replace page content with server-side redirects |

### Files to MOVE (git mv)

| From | To |
|------|-----|
| `src/lib/components/*.svelte` (9 files) | `src/lib/components/kyp/*.svelte` |
| `src/lib/components/TeamRosterTable.test.ts` | `src/lib/components/kyp/TeamRosterTable.test.ts` |
| `src/routes/teams/**` | `src/routes/kyp/teams/**` |
| `src/routes/employees/**` | `src/routes/kyp/employees/**` |
| `src/routes/supervisor/**` | `src/routes/kyp/supervisor/**` |
| `src/routes/admin/**` | `src/routes/kyp/admin/**` |

### Files to CREATE (new)

See [New File Inventory](#new-file-inventory) below.

### Files to DELETE

| File | Reason |
|------|--------|
| `src/routes/employee/[id]/+page.svelte` | Replace with redirect only |
| `src/routes/employee/[id]/+page.ts` | Replace with `+page.server.ts` redirect |

---

## New File Inventory

Total new files: ~75

### Platform Shell & Navigation (3)
- `src/lib/stores/navigation.ts`
- `src/routes/+page.server.ts`
- `src/routes/kyp/+layout.svelte`

### KYP Module (2 new, rest are moved)
- `src/routes/kyp/+page.svelte`
- `src/routes/kyp/+page.server.ts`

### Shared Types (1)
- `src/lib/types/shared.ts`

### Shared Components (7)
- `src/lib/components/shared/DataTable.svelte`
- `src/lib/components/shared/FilterBar.svelte`
- `src/lib/components/shared/SearchInput.svelte`
- `src/lib/components/shared/StatusBadge.svelte`
- `src/lib/components/shared/KpiCard.svelte`
- `src/lib/components/shared/ProgressBar.svelte`
- `src/lib/components/shared/EmptyState.svelte`

### Mock Data — KYP Refactor (4)
- `src/lib/mock/kyp/seed.ts`
- `src/lib/mock/kyp/scoring.ts`
- `src/lib/mock/kyp/queries.ts`
- `src/lib/mock/kyp/index.ts`

### Mock Data — Shared (1)
- `src/lib/mock/shared/employees.ts`

### Onboarding Module Types (1)
- `src/lib/types/onboarding.ts`

### Onboarding Mock Data (3)
- `src/lib/mock/onboarding/seed.ts`
- `src/lib/mock/onboarding/queries.ts`
- `src/lib/mock/onboarding/index.ts`

### Onboarding Routes (8)
- `src/routes/onboarding/+layout.svelte`
- `src/routes/onboarding/+page.svelte`
- `src/routes/onboarding/+page.server.ts`
- `src/routes/onboarding/employees/+page.svelte`
- `src/routes/onboarding/employees/+page.server.ts`
- `src/routes/onboarding/employees/[id]/+page.svelte`
- `src/routes/onboarding/employees/[id]/+page.server.ts`
- `src/routes/onboarding/templates/+page.svelte`
- `src/routes/onboarding/templates/+page.server.ts`

### Onboarding API Routes (3)
- `src/routes/api/v1/onboarding/employees/+server.ts`
- `src/routes/api/v1/onboarding/employees/[id]/+server.ts`
- `src/routes/api/v1/onboarding/dashboard/+server.ts`

### Infrastructure Module Types (1)
- `src/lib/types/infrastructure.ts`

### Infrastructure Mock Data (3)
- `src/lib/mock/infrastructure/seed.ts`
- `src/lib/mock/infrastructure/queries.ts`
- `src/lib/mock/infrastructure/index.ts`

### Infrastructure Routes (10)
- `src/routes/infrastructure/+layout.svelte`
- `src/routes/infrastructure/+page.svelte`
- `src/routes/infrastructure/+page.server.ts`
- `src/routes/infrastructure/assets/+page.svelte`
- `src/routes/infrastructure/assets/+page.server.ts`
- `src/routes/infrastructure/assets/[assetId]/+page.svelte`
- `src/routes/infrastructure/assets/[assetId]/+page.server.ts`
- `src/routes/infrastructure/teams/+page.svelte`
- `src/routes/infrastructure/teams/+page.server.ts`
- `src/routes/infrastructure/teams/[teamId]/+page.svelte`
- `src/routes/infrastructure/teams/[teamId]/+page.server.ts`

### Infrastructure API Routes (3)
- `src/routes/api/v1/infrastructure/assets/+server.ts`
- `src/routes/api/v1/infrastructure/assets/[assetId]/+server.ts`
- `src/routes/api/v1/infrastructure/teams/[teamId]/+server.ts`

### Training Module Types (1)
- `src/lib/types/training.ts`

### Training Mock Data (3)
- `src/lib/mock/training/seed.ts`
- `src/lib/mock/training/queries.ts`
- `src/lib/mock/training/index.ts`

### Training Routes (12)
- `src/routes/training/+layout.svelte`
- `src/routes/training/+page.svelte`
- `src/routes/training/+page.server.ts`
- `src/routes/training/catalog/+page.svelte`
- `src/routes/training/catalog/+page.server.ts`
- `src/routes/training/catalog/[courseId]/+page.svelte`
- `src/routes/training/catalog/[courseId]/+page.server.ts`
- `src/routes/training/employees/+page.svelte`
- `src/routes/training/employees/+page.server.ts`
- `src/routes/training/employees/[id]/+page.svelte`
- `src/routes/training/employees/[id]/+page.server.ts`
- `src/routes/training/manager/+page.svelte`
- `src/routes/training/manager/+page.server.ts`

### Training API Routes (3)
- `src/routes/api/v1/training/catalog/+server.ts`
- `src/routes/api/v1/training/employees/[id]/+server.ts`
- `src/routes/api/v1/training/dashboard/+server.ts`

### Reports Placeholder (2)
- `src/routes/reports/+layout.svelte`
- `src/routes/reports/+page.svelte`

### Legacy Redirects (6)
- `src/routes/teams/+page.server.ts` (rewritten as redirect)
- `src/routes/teams/[teamId]/+page.server.ts` (rewritten as redirect)
- `src/routes/employees/[id]/+page.server.ts` (rewritten as redirect)
- `src/routes/employee/[id]/+page.server.ts` (new, replaces +page.ts)
- `src/routes/supervisor/+page.server.ts` (rewritten as redirect)
- `src/routes/admin/scoring/+page.server.ts` (rewritten as redirect)

### Test Files (6)
- `src/lib/mock/onboarding/queries.test.ts`
- `src/lib/mock/infrastructure/queries.test.ts`
- `src/lib/mock/training/queries.test.ts`
- `src/routes/onboarding/page.test.ts`
- `src/routes/infrastructure/page.test.ts`
- `src/routes/training/page.test.ts`

---

## Testing Strategy

### Existing Tests (must continue passing)
- `src/lib/utils/sorting.test.ts`
- `src/lib/utils/csv.test.ts`
- `src/lib/utils/supervisorMetrics.test.ts`
- `src/lib/stores/period.test.ts`
- `src/lib/components/kyp/TeamRosterTable.test.ts` (path updated)
- `src/routes/kyp/teams/page.test.ts` (path updated)
- `src/routes/kyp/teams/[teamId]/page.test.ts` (path updated)
- `src/routes/kyp/supervisor/page.test.ts` (path updated)
- `src/routes/kyp/admin/scoring/page.test.ts` (path updated)
- `src/routes/employee/[id]/page.test.ts` (may need update or removal)

### New Tests
- Mock data query tests for each new module (3 files)
- Route rendering tests for each new module dashboard (3 files)

### Validation Commands
```bash
npm run check     # TypeScript + Svelte type checking
npm run test      # Vitest unit/component tests
npm run build     # Production build
npm run dev       # Manual smoke testing
```

---

## Risk Notes

1. **Import path breakage after moves** — The biggest risk in Phase 1. After moving components and routes, grep the entire `src/` directory for old import paths (`$lib/components/AlertPanel`, `$lib/components/MetricCard`, etc.) and update them all.

2. **Svelte 5 runes compatibility** — All new components must use Svelte 5 runes (`$props()`, `$derived`, `$state`), not legacy `export let` or `$:`. Check existing components for the pattern to follow.

3. **Test file imports** — Test files that import from route files (e.g., `page.test.ts` files) may use relative imports that break after moves. Update them.

4. **kypData.ts re-export** — The mock data refactor uses a re-export strategy to avoid breaking existing imports. This must be done carefully: every export from the original file must be available from the new modular files.

5. **SvelteKit $types imports** — Moved route files that import from `./$types` will auto-generate new types at the new location. The types should regenerate correctly, but run `npm run check` after each phase.

6. **Legacy redirect handling** — The old route files at `/teams`, `/employees`, etc. must have their `+page.svelte` files removed (or the redirect won't trigger because SvelteKit will try to render the page). Only keep the `+page.server.ts` redirect files.

7. **Cross-module employee identity** — The shared employee registry (`mock/shared/employees.ts`) should use the same IDs as KYP mock data so that an employee visible in KYP can also appear in Onboarding and Training.

8. **Mock data volume** — Each new module needs 200-400 lines of realistic mock data. Keep it focused on demonstrating the UI, not on data completeness.

---

*This plan is designed to be executed phase-by-phase by an implementation agent. Each phase is self-contained with clear inputs, outputs, and validation criteria.*

## 1. Project Overview

**What it is**  
`KYP UI Prototype` is a SvelteKit-based internal performance intelligence application for engineering organizations. It aggregates team and employee delivery signals into normalized scores and exposes them through supervisor, team, employee, and admin views.

**Core mission**  
Help engineering leaders answer:
- Which teams are healthy or at risk?
- Which employees are contributing strongly, and in what ways?
- How do scoring rules change when priorities or data sources change?

**Problem it solves**
- Delivery data is fragmented across code, review, quality, deployment, and incident systems.
- Managers need a single place to browse teams and inspect contributors.
- Leadership needs configurable scoring, not a one-size-fits-all rubric.

**Business context**
- The current repo is a **prototype/demo product**, not a production system.
- It simulates a multi-team engineering performance platform using **mock data and in-memory config**.
- It appears intended as a stepping stone toward a real org-wide internal analytics product.

**Value proposition**
- One consolidated view for engineering health.
- Team-level and individual-level drilldowns.
- Tunable scoring model by source and weight.
- Faster alignment between engineering leaders and delivery reality.

---

## 2. End Users & Stakeholders

| User Type | Who They Are | Goals | Pain Points | How They Use It | Success Looks Like |
|---|---|---|---|---|---|
| Supervisors / Engineering Managers | First-line people managers | See team performance, compare members, monitor delivery signals | Data lives in too many systems; metrics are hard to explain | Use team pages, member lists, employee detail | Faster review prep, better coaching, fewer blind spots |
| Directors / Org Leaders | Multi-team leaders | Browse all teams, compare health, identify risk | Hard to compare teams consistently | Use `/teams`, filtering, sorting, score previews | Reliable org-level prioritization |
| Individual Employees | Contributors | Understand personal performance signals | Metrics often feel opaque or unfair | Use employee view | Clearer feedback and actionable improvement areas |
| Admin / Ops / Analytics Owners | People who manage scoring rules | Enable/disable sources, tune weights, validate score behavior | Scoring drift, lack of governance | Use `/admin/scoring` | Controlled, explainable scoring behavior |
| Engineers / Maintainers | Developers supporting the app | Extend features safely | Mock-heavy architecture, no persistence, duplicated routes | Read routes/components/tests | Faster iteration with less hidden coupling |

---

## 3. Current Functionality (Product Manager View)

### Major feature areas

#### A. Organization Teams List
Route: `/teams`

**What it does**
- Lists teams across the org
- Supports search, filter, sort, pagination
- Shows summary fields like region, size, score, last deployment, stack

**Why it exists**
- Leadership needs an org-wide browse surface, not just single-team views

**How it works end-to-end**
1. User opens `/teams`
2. `+page.server.ts` reads query params
3. Filters are parsed from URL
4. `listTeams()` in mock data layer returns filtered team summaries and suggestions
5. Page renders filters, table, pagination, typeahead suggestions

---

#### B. Team Detail
Route: `/teams/[teamId]`

**What it does**
- Shows team score and score breakdown
- Provides tabs for metrics, members, deployments, defects
- Includes period selector
- Lets user filter member roster inside the team

**Why it exists**
- Team-level health needs explanation, not just a number

**How it works**
1. Loader fetches a single team via `getTeamDetail(teamId)`
2. UI uses global period store
3. Period-specific display values are derived using `periodCompositeMultipliers` and `periodViewScalars`
4. Members tab filters in-memory by name/role/status
5. Clicking a member routes to employee detail

---

#### C. Employee Detail
Routes:
- `/employees/[id]`
- legacy alias `/employee/[id]`

**What it does**
- Shows employee composite score
- Displays radar chart, trend charts, contribution sources, suggestions
- Shares the global period selector

**Why it exists**
- Gives a contributor-level explanation behind team and roster views

**How it works**
1. Loader fetches `EmployeeDetail` from mock data
2. Period-adjusted composite is computed client-side
3. Charts and suggestion panels render from prebuilt mock detail data

---

#### D. Supervisor Dashboard
Route: `/supervisor`

**What it does**
- Original single-team dashboard
- Applies period transforms and “metric weight preset” transforms
- Shows sortable roster and cohort distribution

**Why it exists**
- This is the earlier prototype surface the newer team model evolved from

**How it works**
- Reads `teamRoster` from mock data
- Applies `applyPeriodMetrics()`
- Applies `applyWeightPreset()`
- Renders cards, roster table, histogram, alerts

---

#### E. Admin Scoring
Route: `/admin/scoring`

**What it does**
- Enables/disables sources
- Edits scoring weights
- Validates weight totals and source selection
- Resets defaults
- Shows preview of team scores under current draft

**Why it exists**
- Scoring must be configurable and governed, not hardcoded

**How it works**
1. Loader gets current config, validation, preview
2. Form posts back to server action
3. Server parses toggles/weights
4. Validation ensures:
   - at least one source enabled
   - weights are finite and 0–100
   - total weight equals 100
5. If valid, config is updated in module memory
6. Preview is recomputed

---

### Data flow

```text
User UI
  -> Svelte page/server loader
  -> mock data service (kypData.ts)
  -> derived scoring / filters / validation
  -> page render

Admin form
  -> SvelteKit server action
  -> validateScoringConfig()
  -> updateScoringConfig()
  -> preview recomputation
  -> UI refresh
```

### Backend processes
Current “backend” is lightweight:
- SvelteKit server loaders
- SvelteKit API handlers
- In-memory config mutation
- No persistent database
- No queue/worker
- No real connector ingestion

### Integrations
Simulated only:
- Bitbucket
- GitHub
- Jenkins
- Jira / production defects
- Sonar / coverage
- GCP

These are represented as mock source types and mock-derived metrics, not live integrations.

### Dashboards / metrics
Current surfaced metrics include:
- Composite score
- PR throughput
- Review time / engagement
- Merge rate
- Deployment frequency
- Production build success
- MTTR
- Defect counts
- Hotfix counts
- GCP changes / incidents

---

## 4. Component-Level Technical Analysis

### Frontend routes

| Component | Purpose | Inputs | Outputs | Dependencies | Strengths | Weaknesses |
|---|---|---|---|---|---|---|
| `routes/+layout.svelte` | App shell/navigation | children, period store | shell UI | app CSS, store | Simple shared frame | Global nav is static/manual |
| `routes/+page.svelte` | Home/entry page | none | nav CTAs | app shell | Lightweight | Not much onboarding/context |
| `routes/teams/+page.server.ts` | Team list loader | URL params | filter/result props | mock service | Clean server-side filter entry | Still mock-only |
| `routes/teams/+page.svelte` | Team directory UI | filters/result/config | searchable team table | loader data | Good browse surface | Typeahead is render-only, not interactive async |
| `routes/teams/[teamId]/+page.server.ts` | Team detail loader | teamId | team detail | mock service | Clear separation | No auth or error nuance beyond 404 |
| `routes/teams/[teamId]/+page.svelte` | Team detail UI | `TeamDetail`, period store | tabs, metrics, member filtering | period store, derived scalars | Strong PM-style explanation surface | Period logic is display scaling, not true historical slicing |
| `routes/employees/[id]/*` | Current employee route | employeeId | employee page | mock detail + period store | Period-aware, stable | Duplicate with legacy route |
| `routes/employee/[id]/*` | Legacy alias route | employeeId | employee page | same as above | Backward compatibility | Duplication / maintenance risk |
| `routes/supervisor/+page.svelte` | Original dashboard | mock roster, period, preset | cards, table, cohort chart | metrics utils | Good prototype baseline | Parallel UX model vs new `/teams` product |
| `routes/admin/scoring/*` | Admin config screen | config, validation, form input | saved/failed config state | mock config + preview | Real validation loop now exists | Still session-local memory |

### Reusable UI components

| Component | Purpose | Internal Logic | Notes |
|---|---|---|---|
| `MetricCard.svelte` | KPI card | Pure display | Reused broadly |
| `AlertPanel.svelte` | Alert list | Severity -> class mapping | Useful but static |
| `TeamRosterTable.svelte` | Sortable employee metric table | sorts via external callback, sticky table headers | Strong single-team table component |
| `CohortDistributionPanel.svelte` | Distribution histogram | computes bins, quartiles, avg | Nice visualization for prototype |
| `PeriodSelector.svelte` | Shared period control | binds `selectedPeriod` store | Key global control |
| `RadarDimensionsChart.svelte` | Radar chart | SVG polygon from dimension scores | Prototype-only math |
| `TrendSparklineGrid.svelte` | Trend sparklines | SVG polyline from trend points | Static mock trends |
| `ContributionSources.svelte` | Source breakdown | simple list/details | Useful for explainability |

### Backend/services/utilities

| Module | Purpose | Inputs / Outputs | Strengths | Weaknesses |
|---|---|---|---|---|
| `lib/mock/kypData.ts` | Central mock domain/service layer | filters/config/team IDs -> mock entities | Single source of truth | Very large, mixes domain/data/service/state |
| `lib/utils/supervisorMetrics.ts` | Period transforms + preset scoring | employee rows -> transformed rows | Clear transformation logic | Team period view uses separate scaling model |
| `lib/utils/sorting.ts` | table sorting | rows/key/direction | simple, readable | limited sorting modes |
| `lib/utils/csv.ts` | export CSV | rows -> csv string/download | practical | client-only utility |
| `lib/stores/period.ts` | global period state | writable store | simple cross-page sharing | global mutable state across tabs/pages |

### APIs

| Endpoint | Purpose | Reality |
|---|---|---|
| `GET /api/v1/teams` | list/filter teams | backed by mock list service |
| `GET /api/v1/teams/[teamId]` | team detail | mock-backed |
| `GET /api/v1/teams/[teamId]/members` | filtered members | mock-backed |
| `GET /api/v1/search/suggest` | typeahead | mock-backed |
| `GET/PUT /api/v1/admin/scoring-config/[scope]/[id]` | config read/write | mock-backed, validated |

### Databases / pipelines / auth / deployment architecture
Current state:
- **Database:** none
- **Persistent config store:** none
- **Ingestion pipeline:** none
- **Authentication:** none
- **Authorization:** none
- **Deployment architecture:** default SvelteKit app, adapter-auto
- **Monitoring:** none
- **Background jobs:** none

That absence is itself a major architectural fact.

---

## 5. Tech Stack Breakdown

| Layer | Technology | Why Used | Pros | Cons / Limits |
|---|---|---|---|---|
| Frontend framework | Svelte 5 / SvelteKit 2 | Fast UI iteration, server routes, TS support | Lightweight, strong DX | Smaller enterprise ecosystem than React |
| Build tooling | Vite | Fast dev/build | Excellent speed | Minimal opinionation |
| Language | TypeScript | Safer models and UI contracts | Strong static typing | Current repo still under-models some domain states |
| Styling | Plain CSS | Simple global/component styling | Low overhead | No design tokens system beyond CSS vars |
| Testing | Vitest + Testing Library | Component and utility tests | Fast, modern | No E2E/browser automation |
| Runtime API | SvelteKit server routes | No separate backend needed yet | Good for prototype | Blurs frontend/backend boundaries as app grows |
| Mock data layer | `kypData.ts` | Rapid prototyping | Easy to demo | Becomes monolithic, no persistence |
| Adapter | `@sveltejs/adapter-auto` | Generic deployability | Easy setup | Not explicit about real hosting target |

### Missing stack pieces
Not yet present but eventually necessary:
- Postgres or similar database
- Search engine (OpenSearch/Elasticsearch)
- Job queue / worker
- Auth provider
- Logging/metrics platform
- CI pipeline and deployment config

---

## 6. Scope for Improvement (Prioritized)

### Priority 1: Architecture / persistence
1. **Replace module-level mutable config with persistence**
   - Issue: admin settings live only in server memory
   - Why: changes reset on restart/redeploy
   - Fix: move config to DB
   - Impact: makes admin trustworthy

2. **Split `kypData.ts` into domain/data/service modules**
   - Issue: one giant file owns mock records, scoring config, search, previews, and entity generation
   - Why: high coupling and growing maintenance cost
   - Fix: split into `seed`, `queries`, `scoring`, `validation`
   - Impact: easier future backend replacement

3. **Unify duplicate employee routes**
   - Issue: `/employee/[id]` and `/employees/[id]`
   - Why: duplicated views and tests
   - Fix: keep one canonical route and redirect legacy alias
   - Impact: less duplication

### Priority 2: Product correctness
4. **Make period filtering data-real instead of display-scaled**
   - Issue: period changes currently scale values rather than query true period-specific history
   - Why: good demo, weak analytical fidelity
   - Fix: store period-bucketed aggregates or event history
   - Impact: trust in metrics

5. **Fix residual text encoding artifacts in mock strings**
   - Issue: some strings still show encoding corruption in mock content
   - Why: harms polish and trust
   - Fix: normalize ASCII/UTF-8 source strings
   - Impact: cleaner UI

6. **Add explicit metric definitions/help text**
   - Issue: some derived metrics still need business definitions
   - Why: scores are only useful if explainable
   - Fix: tooltip/help panel for “contribution activity”, “source health”, etc.
   - Impact: better adoption

### Priority 3: Security / governance
7. **Add authentication and RBAC**
   - Issue: no auth
   - Why: app is supposed to show sensitive employee performance data
   - Fix: org-bound auth + admin/supervisor roles
   - Impact: production viability

8. **Add audit logging for config changes**
   - Issue: no durable audit trail
   - Why: score model changes need traceability
   - Fix: config version history + actor + timestamp
   - Impact: governance/compliance

### Priority 4: Observability / operations
9. **Add logging and runtime telemetry**
   - Issue: no observability
   - Why: hard to debug failures or user behavior
   - Fix: structured logs, request timings, error capture
   - Impact: supportability

10. **Add E2E test coverage**
   - Issue: current tests are component/unit-focused
   - Why: route/action/API interactions can still regress
   - Fix: Playwright flows
   - Impact: safer iteration

---

## 7. Risks & Bottlenecks

### Architectural risks
- In-memory mutable config means non-durable admin state
- Frontend/server/mock logic are tightly coupled
- The mock data file is becoming a pseudo-backend

### Scalability risks
- All search/filter logic is in-memory
- No DB, no caching, no pagination backed by real storage
- No ingestion or aggregation pipeline

### Data quality risks
- Metrics are simulated, not source-of-truth
- Period view is scaling math, not actual time-sliced data
- Some labels imply operational accuracy the system does not yet truly have

### Operational risks
- No auth, no audit trail, no monitoring
- No deployment target or environment config strategy
- No persistence means difficult demos across sessions/environments

### Maintainability concerns
- Duplicate employee routes
- Mixed concerns in `kypData.ts`
- Current API shape may drift from future real backend if not formalized early

---

## 8. Future Roadmap Suggestions

### Short-term
- Persist scoring config
- Remove duplicate routes
- Clean remaining encoding issues
- Add help text/definitions for metrics
- Add Playwright smoke tests for:
  - teams browse
  - team detail period changes
  - admin validation/save/reset

### Medium-term
- Introduce Postgres-backed team/employee/config tables
- Move mock services behind repository interfaces
- Add auth/RBAC
- Implement real source connector contracts
- Add search index for typeahead

### Long-term
- Real ingestion pipeline for GitHub/Jenkins/Jira/GCP
- Historical scoring and trend storage
- org/scoped multi-tenant model
- calibration tools, benchmarking, anomaly detection
- observability dashboards and admin audit history

---

## 9. Final Executive Summary

This application is a strong **multi-team engineering performance prototype** built in SvelteKit. It already demonstrates the right product concepts: org-wide team browsing, team drilldown, employee explainability, configurable source-weighted scoring, and shared period controls.

Its biggest strength is clarity of product intent. The UI communicates the scoring model well, and the codebase already has the bones of a real internal analytics platform. The admin flow now validates configuration properly, the team detail view is period-aware, and the route/API layer is coherent for a prototype.

Its biggest limitation is architectural maturity. There is **no persistent backend, no authentication, no real ingestion, and no true historical data model**. The system currently simulates a production platform rather than operating as one. The mock layer is useful but now overloaded, and it should be split and progressively replaced with persistent services.

For leadership: this is a credible prototype that proves product direction.  
For stakeholders: it is ready for demos and design validation, not production rollout.  
For new engineers: the fastest next step is to replace in-memory config and mock team data with a DB-backed service layer while preserving the current route and UI contracts.
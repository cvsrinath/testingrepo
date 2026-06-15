# KYP UI Prototype - Current Implementation Snapshot

Snapshot date: 2026-06-15

This document preserves the current project state before the next major requirement change. It is intended as a stable baseline for product, engineering, and future agents working on the repo.

## 1. Project Purpose

KYP, short for Know Your Performance, is currently implemented as a SvelteKit prototype for an internal engineering performance intelligence product.

The original roadmap describes KYP as a company-wide engineering intelligence platform that aggregates behavioral and technical signals from Git/Bitbucket, Jira, Confluence, CI/CD, and code coverage systems. The intended product goals are visibility, fairness, auditability, and scalability for engineering performance reviews.

Current repo reality: this project is a frontend-heavy prototype with SvelteKit server loaders, mock data, in-memory scoring configuration, and mock API routes. It demonstrates product workflows and UI behavior, but it does not yet implement real ingestion, persistence, auth, RBAC, audit logging, or production data processing.

## 2. Roadmap References From `KYP_Architecture_Roadmap.docx`

These are the most relevant source references from the roadmap for understanding why the current implementation exists:

| Roadmap Section | Requirement / Concept | Current Implementation Status |
|---|---|---|
| 1. High-Level Summary | Single pane of glass for engineering activity, fair normalized metrics, auditable scoring, scalable platform | Partially represented in UI concepts only; no production platform pieces yet |
| 2. MVP Scope | Supervisor dashboard and employee view backed by Git/Jira signals | Implemented as mock-data UI flows |
| 2. MVP Scope | Five core metrics: commits/week, PR throughput, review engagement, impact score, code quality | Represented in `EmployeeSummary`, supervisor roster, employee detail, and scoring transforms |
| 2. MVP Scope | Supervisor dashboard: sortable team roster, time-range filter, cohort comparison, CSV export | Implemented in `/supervisor` |
| 2. MVP Scope | Employee view: personal metrics, trendlines, linked source events | Implemented in `/employees/[id]` and legacy `/employee/[id]` |
| 3. Source Mapping | Bitbucket, GitHub/Jira-like work tracking, CI/coverage, HR/SCIM | Simulated through mock source labels and contribution records |
| 5. Metric Definitions | Normalized metrics, active-week adjustment, cohort comparisons | Simulated with mock formulas and period transforms |
| 6. Scoring Strategy | Role-based weight presets for IC, Senior, Staff, Manager | Implemented for supervisor scoring presets |
| 7. Fairness and Auditability | Cohort comparison, leave adjustment, traceable formulas, immutable logs | Partially represented visually; no durable audit/event trace exists |
| 8. Privacy and Access Control | Employee, manager, HR, admin RBAC and transparency controls | Not implemented; UI is unauthenticated |
| 9. UI/UX and Dashboards | Supervisor dashboard, employee view, admin console, deep-dive view | Supervisor, employee, and scoring admin exist; deep-dive is not implemented |
| 10. Architecture and Scalability | Kafka, S3 lake, warehouse, ClickHouse, API layer, frontend | Not implemented; current app is local/mock SvelteKit |
| 12. Roadmap and Timeline | Frontend v1 in MVP sprint, admin/deep-dive later | Current prototype blends MVP and later admin/team-browse concepts |
| 13. Testing | Unit, integration, RBAC, performance testing | Current repo has unit/component/route tests only |

## 3. Current User-Facing Routes

| Route | Purpose | Current Behavior |
|---|---|---|
| `/` | Entry page | Links into the main prototype views |
| `/teams` | Organization team directory | Server-loaded team search, filters, sorting, pagination, typeahead suggestions |
| `/teams/[teamId]` | Team detail | Team score, breakdown, tabs for metrics/members/deployments/defects, member drilldown |
| `/supervisor` | Original supervisor dashboard | Team Alpha roster, sortable metrics, period selector, weight preset picker, cohort histogram, alerts, CSV export |
| `/employees/[id]` | Current employee detail route | Employee score, radar chart, trend charts, sources, suggestions, sharing toggle, alias link |
| `/employee/[id]` | Legacy employee detail route | Older alias retained for compatibility |
| `/admin/scoring` | Scoring admin | Enables/disables sources, edits weights, validates totals, previews team scores |

The main navigation currently points to `/teams`, `/teams/team-alpha`, `/employees/alex-rivera`, and `/admin/scoring`.

## 4. Current API Routes

| Endpoint | Purpose | Backing Data |
|---|---|---|
| `GET /api/v1/teams` | List/filter teams | Mock data service |
| `GET /api/v1/teams/[teamId]` | Team detail | Mock data service |
| `GET /api/v1/teams/[teamId]/members` | Team members | Mock data service |
| `GET /api/v1/search/suggest` | Search suggestions | Mock data service |
| `GET/PUT /api/v1/admin/scoring-config/[scope]/[id]` | Read/update scoring config | In-memory config |

These APIs are useful shape prototypes, not production contracts. They have no authentication, persistence, authorization checks, rate limiting, or audit logging.

## 5. Implemented Product Capabilities

### Team Directory

The `/teams` page provides an org-level browse surface. It supports:

- Search by team name, team ID, or member name
- Filters for region, size bucket, active flag, tech stack, and score minimum
- Sort modes for score, relevance, name, and last activity
- Pagination
- Typeahead suggestions that link to team or employee detail pages
- Admin scoring link and active source count

### Team Detail

The `/teams/[teamId]` page presents team-level health. It includes:

- Team score and score breakdown
- Period-aware display scaling through the global period store
- Tabs for metrics, members, deployments, and defects
- Member filtering by name, role, or status
- Member links into employee detail
- Team alerts merged with shared alert data

### Supervisor Dashboard

The `/supervisor` page is the original MVP-style dashboard from roadmap section 9.1. It includes:

- Team Alpha header and reporting period
- Global review period selector: `Q`, `6M`, `YTD`, `Custom`
- Metric weight preset picker: `IC Engineer`, `Senior Engineer`, `Staff Engineer`, `Engineering Manager`
- Period transforms via `applyPeriodMetrics()`
- Preset-based composite recalculation via `applyWeightPreset()`
- Sortable roster table with sticky employee column
- Clickable employee rows/cells that open employee detail
- Cohort distribution histogram for the selected metric
- Alert panel
- CSV export of the currently sorted roster

### Employee Detail

The employee detail pages show personal performance explainability. They include:

- Composite score card
- Active weeks and period coverage
- Five-dimension radar chart: Output, Impact, Quality, Collaboration, Knowledge Sharing
- 13-week trend sparklines
- Improvement suggestions
- Contribution sources list with counts and source links
- Sharing toggle UI
- Alias management placeholder link

### Admin Scoring

The `/admin/scoring` page gives a basic scoring governance workflow:

- Toggle source systems on/off
- Edit score weights
- Validate weight values and total weight
- Require at least one enabled source
- Reset to defaults
- Preview team scores under the draft/current configuration

The config is stored in module memory, so it resets on server restart or reload behavior. This is acceptable for a prototype but not a production model.

## 6. Data Model and Mock Services

Core typed models live in `src/lib/types/kyp.ts`. Key types include:

- `EmployeeSummary`
- `EmployeeDetail`
- `MetricSnapshot`
- `DimensionScore`
- `TrendPoint`
- `ContributionSource`
- `AlertItem`
- `TeamListItem`
- `TeamDetail`
- `TeamMemberListItem`
- `ScoringConfig`
- `ScoringWeights`
- `TeamSearchResponse`

The mock service/data layer lives in `src/lib/mock/kypData.ts`. It currently owns:

- Period options and labels
- Weight presets and descriptions
- Source labels and default scoring config
- In-memory active scoring config
- Team seed data for Team Alpha, Beacon, Cirrus, and Delta
- Employee generation
- Team score calculation
- Team filtering/search/typeahead
- Employee detail construction
- Admin scoring validation and preview

This file is intentionally doing a lot for prototype speed. It is now the biggest future refactor candidate.

## 7. Scoring and Metrics Behavior

Current scoring is mock/simulated, but maps to roadmap concepts:

- Supervisor employee scores are adjusted by review period and weight preset.
- Team scores are source-weighted from code quality, PR activity, deployments, defects/MTTR, hotfixes, and GCP.
- Admin scoring weights must sum to 100.
- Disabled sources are excluded from team scoring.
- Missing-data policy exists as config shape but is not deeply implemented.
- Employee trend and contribution data is generated from static mock values.

Important limitation: period changes are not real time-sliced queries. They are display/scoring transforms over static data.

## 8. Reusable UI Components

| Component | Purpose |
|---|---|
| `MetricCard.svelte` | Reusable KPI card |
| `PeriodSelector.svelte` | Shared global period selector |
| `TeamRosterTable.svelte` | Sortable, clickable employee metric table |
| `CohortDistributionPanel.svelte` | Histogram and cohort summary stats |
| `RadarDimensionsChart.svelte` | Employee dimension radar chart |
| `TrendSparklineGrid.svelte` | Employee trend sparkline grid |
| `ContributionSources.svelte` | Expandable source contribution list |
| `AlertPanel.svelte` | Severity-styled alert list |

Global styling lives in `src/lib/styles/app.css`. The app uses plain CSS plus component-scoped styles.

## 9. Current Test Coverage

The project uses Vitest, jsdom, and Svelte Testing Library. Existing tests cover:

- Sorting utility behavior
- CSV generation
- Period store propagation
- Supervisor metric transforms
- Supervisor dropdown behavior
- Team roster rendering and employee detail links
- Employee page radar/trend rendering
- Mock data behavior
- Teams route behavior
- Admin scoring behavior

Commands:

```bash
npm run check
npm run test
npm run build
```

The last known validation before this documentation update was passing after the supervisor dropdown work:

- `npm run check`: 0 errors, 0 warnings
- `npm run test`: 10 tests passing at that point

The current repo has additional tests under `src/routes/teams`, `src/routes/admin/scoring`, and `src/lib/mock`, so the total test count may be higher now.

## 10. Architecture Reality Check

Implemented:

- SvelteKit frontend routes
- SvelteKit server loaders/actions
- SvelteKit mock API handlers
- TypeScript domain types
- Mock data and generated team/member records
- In-memory scoring configuration
- Component and utility tests

Not implemented:

- Real Bitbucket/GitHub/Jira/CI/GCP ingestion
- Kafka, Flink, Spark, S3 raw lake, warehouse, ClickHouse, or GraphQL service
- Database persistence
- SSO/OIDC/SAML
- SCIM identity provisioning
- RBAC
- Audit log
- Employee data privacy controls
- Immutable source event traceability
- Production monitoring
- Deployment-specific adapter/config

The current code should be treated as a product prototype and UI/API shape exercise, not as a production architecture.

## 11. Known Gaps and Risks

- `kypData.ts` mixes seed data, scoring logic, service functions, validation, and mutable state.
- Admin scoring changes are stored in memory and are not durable.
- Employee detail has both `/employees/[id]` and `/employee/[id]`; this duplication should eventually be resolved with a canonical route plus redirect.
- Period selectors currently transform static data rather than querying period-specific aggregates.
- No auth/RBAC despite sensitive employee-performance data.
- No audit logging despite roadmap requirements for read/write traceability.
- No real identity resolution or alias conflict workflow.
- API routes do not enforce access control or versioned contracts beyond the URL naming.
- Some UI labels imply production-level data freshness/source health, while the data is simulated.

## 12. Suggested Baseline for Upcoming Requirement Changes

Before making large requirement changes, preserve these current assumptions:

- SvelteKit remains the current app framework.
- `src/lib/types/kyp.ts` is the best starting point for explicit contracts.
- `src/lib/mock/kypData.ts` is the current source of truth for demo data and should be split only when the new requirement direction is clear.
- `/teams` and `/teams/[teamId]` represent the newer product direction.
- `/supervisor` represents the original MVP dashboard and may be kept, merged, or retired depending on the new requirements.
- `/employees/[id]` should be treated as the canonical employee detail direction.
- `/admin/scoring` is the current prototype for scoring governance.

Useful next refactor points once requirements settle:

- Split mock data into `seed`, `queries`, `scoring`, and `adminConfig` modules.
- Replace in-memory scoring config with persistent storage.
- Choose one employee route and redirect the legacy alias.
- Introduce real API contracts before adding a database or connector layer.
- Add Playwright smoke tests for the primary user journeys.

## 13. Executive Summary

The current KYP repo is a working SvelteKit prototype for engineering performance intelligence. It demonstrates the core roadmap ideas: manager dashboards, employee explainability, cohort comparison, period filters, role-weighted scoring, team browse/detail views, and admin scoring controls.

The strongest part of the current version is the product flow. A user can browse teams, inspect a team, drill into an employee, adjust scoring behavior, and see how mock metrics change across UI surfaces.

The most important limitation is that the app is not backed by real systems. There is no persistent backend, no ingestion pipeline, no authentication, no authorization, and no audit trail. The current app is best understood as a demoable baseline for requirement discovery and UI/API contract discussion.

This file should be used as the starting snapshot before the next requirement change.

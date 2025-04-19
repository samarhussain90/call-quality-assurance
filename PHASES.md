# Fundamental Application Restructure & Data Flow Correction Phases

This document outlines the sequential phases, goals, and detailed tasks required to implement the correct sidebar hierarchy, campaign context state management, contextual data filtering, and user-driven campaign creation in the Neural Call application.

---

## Phase 1: Correct Sidebar Structure & Header Cleanup
**Goal:** Establish the correct sidebar hierarchy and remove all conflicting or obsolete campaign navigation elements.

1. **Move "Campaign Call Logs" to Top**
   - In `src/components/layout/Sidebar.tsx`, reposition the entire "Campaign Call Logs" section immediately below the "Dashboard" link.
2. **Verify Remaining Sections Order**
   - Ensure the order in the sidebar is now:
     1. Dashboard
     2. Campaign Call Logs
     3. Analytics
     4. Performance
     5. Reports
     6. Settings
     7. Services
3. **Remove Old "Campaigns" Section**
   - Delete any code rendering the previous static/collapsible "Campaigns" sidebar group (All, Active, Templates).
4. **Clean Up Header Navigation**
   - In `src/components/layout/Header.tsx`, remove the top-level "Campaigns" link/tab.
   - Confirm header now lists: Dashboard, Analytics, Settings (and no Campaigns).

---

## Phase 2: Implement Global State & Contextual Dashboard
**Goal:** Create/refine a global campaign context and make the Dashboard reflect the selected campaign or aggregate data.

1. **Global Campaign Context**
   - Verify or implement `CampaignContext` in `src/contexts/CampaignContext.tsx` that tracks:
     - `selectedCampaign: Campaign | null`
     - `setSelectedCampaign(campaign: Campaign | null)`
     - `clearSelectedCampaign()`
     - `getCampaignById(id: string): Campaign` and `getAllCampaigns()` helpers
2. **Sidebar Click State Update**
   - On campaign link click in `Sidebar.tsx`, call `setSelectedCampaign(...)` and navigate to `/call-log/{campaignId}`.
3. **State Clearance on Dashboard**
   - On clicking the Dashboard link, invoke `clearSelectedCampaign()` before navigation to `/dashboard`.
4. **Dashboard Content Logic**
   - In `src/pages/dashboard/DashboardPage.tsx`:
     - **No campaign selected:** Fetch metrics across *all* calls (aggregate) and display header "Dashboard: All Campaigns" or similar.
     - **Campaign selected:** Filter calls by `selectedCampaign.id`, compute metrics for that campaign only, and display header indicating the campaign name.

---

## Phase 3: Connect Analytics, Performance, and Reports to Global Context
**Goal:** Ensure every data view (Analytics, Performance, Reports) dynamically filters by the selected campaign.

1. **Consume `CampaignContext`**
   - In all major pages/components under:
     - `src/pages/analytics/*`
     - `src/pages/performance/*`
     - `src/pages/ReportsPage.tsx`
   - Import and read `selectedCampaign` from `useCampaign()`.
2. **Conditional Data Filtering**
   - If `selectedCampaign` is set, filter underlying mock data (`mockCallsByCampaign`) by `selectedCampaign.id` before any calculations.
   - If not set, use all calls or show a prompt: "Please select a campaign from the sidebar...".
3. **Update Titles & Messages**
   - Prefix titles with the campaign name when filtered (e.g., "Analytics Overview: Debt Calls").
   - Display a neutral title (e.g., "All Campaigns") or prompt message when no campaign is selected.
4. **Verify Sub-Views**
   - Confirm routes/components for:
     - `/analytics/overview`, `/analytics/calls`, `/analytics/performance`, `/analytics/historical`, `/analytics/builder`, `/analytics/insights`, `/analytics/warehouse`, `/analytics/reports`
     - `/performance/agents`, `/performance/campaigns`, `/performance/compliance`, `/performance/quality`
     - `/reports`, `/reports/scheduled`, `/reports/builder`
   - Ensure each applies the above filtering logic.

---

## Phase 4: Implement "Add New Campaign" Functionality
**Goal:** Enable users to create new campaigns, list them in the sidebar, and generate unique webhook URLs.

1. **Add New Campaign Button**
   - Place a persistent "+ New Campaign" button near the "Campaign Call Logs" header in `Sidebar.tsx` (or in `Header.tsx`).
2. **Campaign Creation UI**
   - Create a form view or modal (`/campaigns/new`) with:
     - Input for Campaign Name
   - On save:
     - Generate a unique ID (e.g., `uuid()` or incremental)
     - Create a webhook URL: `https://api.neuralcall.com/webhook/{newId}`
     - Append the new campaign to `mockCampaigns` in `src/mocks/campaigns.ts` or a central store
     - Call `setSelectedCampaign(newCampaign)` and navigate to `/call-log/{newId}`
3. **Display Webhook in Edit Flow**
   - When editing an existing campaign (if edit UI exists), render the read-only webhook URL field.

---

## Phase 5: Final Testing & Verification
**Goal:** Validate end-to-end functionality, context switching, and campaign management.

1. **Sidebar & Header Sanity Check**
   - Confirm "Campaign Call Logs" sits directly beneath Dashboard and all old Campaigns sections/tabs are removed.
2. **Dashboard Context Tests**
   - Click Dashboard → see aggregate metrics.
   - Select a campaign → Dashboard updates to campaign-specific metrics.
   - Clear selection (Dashboard click) → revert to aggregate.
3. **Analytics/Performance/Reports Tests**
   - With no campaign selected → confirm prompt or aggregate view.
   - Select a campaign → navigate through all sub-sections, verify data and titles update accordingly.
4. **Call Log & Detail Tests**
   - Select campaigns (Debt Calls, Roofing, Medicare ACA) → call log loads filtered data.
   - Click through call details → verify calls belong to the selected campaign.
5. **Campaign Creation Tests**
   - Use "+ New Campaign" to create "Solar" → appears in sidebar.
   - Navigate to Solar call log → empty table.
   - Edit Solar campaign → webhook URL is shown.
6. **Code Review & Cleanup**
   - Remove any stray old campaign code.
   - Ensure no console errors or linter warnings.

---

*End of Phases* 
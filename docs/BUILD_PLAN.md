# 🚀 Build Execution Plan: Projecxy

**Version:** 1.0.0 (Execution Focus)  
**Lead:** Antigravity (Senior Startup CTO)  
**Objective:** From 0 to Production-Ready in 4 Weeks.

---

## 1. 🧱 Phase-Wise Build Plan

### Phase 1: Week 1–2 (MVP Core - "The Governance Engine")
*Goal: Enable students to propose ideas and admins to approve them.*

- **Module 1: Auth & Identity (High Priority)**
    - Supabase Auth integration (Email/Password).
    - `profiles` table setup with Role Assignment (Student/Dept Admin).
- **Module 2: Project Proposal (High Priority)**
    - "Submit Idea" form for students.
    - Basic duplicate check (Unique Title constraint per department).
- **Module 3: Admin Approval Queue (High Priority)**
    - A list-view for Admins to Approve/Reject/Request Changes on projects.

### Phase 2: Week 3–4 (Expansion - "The Collaboration Hub")
*Goal: Project teams forming and milestones being tracked.*

- **Module 4: Team Recruitment (High Priority)**
    - Project cards with "Open Roles" (Frontend, Backend, etc.).
    - Join Request workflow (Pending -> Accepted/Rejected).
- **Module 5: Milestone Tracker (Medium Priority)**
    - List of project milestones (e.g., Abstract, SRS, Final Report).
    - PDF upload functionality to Supabase Storage.
- **Module 6: Notifications (Low Priority but essential for UX)**
    - Basic internal alerts for approvals and requests.

### Phase 3: Advanced (Post-Launch - "The Innovation Scale")
*Goal: AI-Driven originality and monetization.*

- **Module 7:** AI Duplicate Detection (Vector similarity on abstracts).
- **Module 8:** Mentor Marketplace (Mentors setting their "available" status).
- **Module 9:** Public Portfolio Generator (Auto-gen public resume of projects).

---

## 2. 🗄 Database Build Order (Dependency Map)

**Build these in the EXACT order to avoid foreign key errors:**

1.  **`departments`**: Root entity (Must exist first).
2.  **`auth.users`**: (Internal Supabase handled).
3.  **`profiles`**: Linked to `auth.users` via trigger; depends on `departments`.
4.  **`projects`**: Depends on `profiles` (creator) and `departments`.
5.  **`project_members`**: Join table; depends on `projects` and `profiles`.
6.  **`join_requests`**: Depends on `projects` and `profiles`.
7.  **`milestones`**: Depends on `projects`.

**Minimal MVP Schema Focus:** (Skip `embeddings` and `mentorships` tables in Week 1).

---

## 3. 🔗 Frontend Build Flow (Page Hierarchy)

**Build Order:**

1.  **Auth Pages (`/login`, `/signup`):** The entry point.
2.  **Profile Setup (`/onboarding`):** Required flow to select role/department.
3.  **Department Admin Dash (`/admin`):** Lists pending projects (Simple CRUD).
4.  **Student Dashboard (`/dashboard`):** Show "My Projects" + "Explore Feed".
5.  **Project Creation Form (`/projects/new`):** The core "Value Trigger."
6.  **Team Management (`/projects/:id/team`):** Manage members and requests.

---

## 4. 🔐 Auth & Role Logic Flow

### 4.1 Role Assignment
- **Logic:** During signup, user chooses "Student" or "Faculty".
- **Validation:** "Dept Admin" role is manually assigned/promoted by a Super Admin in Supabase dashboard for the initial pilot.
- **Enforcement:** `role` column in `public.profiles`.

### 4.2 Routing Logic (Frontend Middleware)
- **Shared Dashboard:** `/dashboard` redirects based on role metadata.
- **Restricted Access:** 
    - `src/routes/AdminRoute.jsx`: Checks `user.role === 'dept_admin'`.
    - `src/routes/StudentRoute.jsx`: Checks `user.role === 'student'`.

---

## 5. ⚙️ Simplified MVP (The "Lean" Cut)

To hit the 4-week deadline, we **EXCLUDE (DELETE)** from the initial build:
- ❌ **No AI Embeddings:** Basic title/keyword search using `ILIKE` is sufficient for V1.
- ❌ **No Paid Mentorship:** Use "Faculty Advisor" as a free label for now.
- ❌ **No Live Chat:** Use a simple discussion board or external WhatsApp links inside the project page.
- ❌ **No Multiple Colleges:** Focus on 1 college (Single Tenant).

---

## 6. ⚠️ Risk Reduction Plan (What to Delay)

- **Delay Real-time:** Use standard polling or periodic refetching instead of full Supabase Realtime for the MVP list views.
- **Delay Analytics:** Use Supabase's SQL editor for manual reporting in the first month.
- **Don't Build Custom Storage:** Use Supabase Storage out-of-the-box with public/private buckets; don't build a complex file manager UI yet.

---

## 7. 🚀 Deployment Strategy

1.  **Local Dev:** Shared Supabase project with local React development.
2.  **Staging (Week 2):** Deploy to **Vercel** early. Connect to a Supabase "Staging" branch for internal testing by the core team.
3.  **UAT (Week 3):** Invite 5 departmental heads to the staging URL for feedback.
4.  **Production (Week 4):** Final deployment on a university-friendly domain (e.g., `projexy.university.edu`).

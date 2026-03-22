# 📘 Startup Product Requirements Document: Projecxy

**Version:** 1.1.0  
**Status:** Strategic Build  
**Strategic Goal:** The Academic OS for Innovation & Project Governance.

---

## 1. 🔥 Unique Selling Proposition (USP)
Projecxy is the **Academic OS for Innovation**. Unlike fragmented messaging apps or generic file repositories, Projecxy solves the "Originality Gap":

- **The Originality Guard:** AI-driven semantic and keyword analysis prevents the submission of redundant project ideas, forcing students to innovate.
- **Integrated Mentorship Economy:** A formal, intra-college marketplace where senior students (certified by department) can guide juniors.
- **Institutional Continuity:** Departments retain a searchable, structured "Institutional Memory" of every project, even after the student graduates.

---

## 2. 🧠 System Boundaries & Scope

### 2.1 In-Scope
- **Campus SaaS:** Multi-departmental project lifecycle (Idea -> Recruitment -> Submission).
- **Project CRM:** Comprehensive team formation and join-request management.
- **Governance:** Faculty-led approval and grading workflows.

### 2.2 Out-of-Scope
- **General LMS:** Attendance tracking, lecture delivery, and course examinations are excluded.
- **File Hosting:** Long-term large-scale source code hosting (GitHub/GitLab integrations are preferred).
- **Public Freelancing:** Mentorship remains within the institutional domain for academic integrity.

---

## 3. 👥 Target Users & Personas

| Role | Strategic Goal | Primary Engagement |
| :--- | :--- | :--- |
| **Student** | Build a high-quality portfolio. | Creating/Joining projects, logging progress. |
| **Team Leader** | Project delivery & leadership. | Recruiting, submitting deliverables. |
| **Mentor** | Expertise sharing & monetization. | Guiding teams, providing feedback. |
| **Faculty** | Quality assurance & grading. | Monitoring progress, evaluating submissions. |
| **Dept Admin** | Innovation oversight. | Approving proposals, monitoring department stats. |

---

## 4. 🧩 Onboarding Flow
- **Verification:** Users must sign up with a verified `.edu` or department-provided email.
- **Mapping:** Department Admins initialize the ecosystem by defining the "Academic Structure" (Batches, Semesters, Courses).
- **Frictionless Start:** Students land on a "Find Your Next Project" dashboard to either create a unique idea or browse recruiting teams.

---

## 5. 🛠 High-Level User Flows

### 5.1 Project Proposal & Approval
1. **Student** creates a proposal (Title, Abstract, Tech Stack).
2. **System** runs a "Duplicate Check" against the historical project database.
3. **Department Admin** reviews proposal (Approve / Reject / Request Revision).

### 5.2 Team Formation & Recruitment
1. **Team Leader** defines open slots (e.g., UI Designer, Backend Dev).
2. **System** notifies relevant students based on their profile tags (Skills/Interests).
3. **Applicants** send join requests; **Leader** reviews profiles and accepts.

### 5.3 Lifecycle & Evaluation
1. **Milestones:** Teams log project progress on a weekly/monthly basis.
2. **Mentorship (Optional):** Teams hire/request a mentor for specific technical guidance.
3. **Final Submission:** Leads upload final reports; Faculty assigns ratings/grades.

---

## 6. ⚙️ Feature Roadmap

### Phase 1: MVP (Core Governance)
- **RBAC:** Auth and role assignment (Student/Faculty/Admin).
- **Project Proposals:** Creation and status tracking logic.
- **Basic Duplicate Detection:** Keyword and title-based similarity.
- **Recruitment:** Simple Join/Request system.

### Phase 2: V2 (Optimization & Collaboration)
- **Milestone Tracking:** Progress logging with file attachments.
- **Smart Notifications:** Real-time push/email alerts for approvals and requests.
- **Multi-Department Support:** Segregation of data with cross-department visibility permissions.
- **Grading Portal:** Rubric-based evaluation system for Faculty.

### Phase 3: V3 (The Innovation Hub)
- **AI Duplicate Detection:** Vector-based abstract similarity search.
- **Mentor Marketplace:** Monetization/Bounty system for peer guidance.
- **Automated Portfolio:** One-click generation of a public project showcase page.

---

## 7. 🛡 Non-Functional Requirements (NFRs)
- **Performance:** Dashboard load time < 1.5s; CRUD interaction < 200ms.
- **Scalability:** System architecture must support 10,000+ active projects per institution.
- **Security:** AES-256 encryption for all documents; Strict Row Level Security (RLS) for data privacy.
- **Reliability:** 99.9% uptime requirement during the "Final Submission Week".

---

## 8. ⚠️ Edge Case Management
| Edge Case | Solution |
| :--- | :--- |
| **Team Leader Dropout** | System triggers "Leader Proxy" election; project is paused if no lead is assigned within 7 days. |
| **Duplicate Squatting** | "Idea Proposals" expire after 14 days of inactivity if a team is not successfully formed. |
| **Mentor Disputes** | Faculty/Admin mediation view for resolving payment or guidance quality issues. |
| **Data Migration** | Exportable "Project Archives" at the end of every academic year for the Admin. |

---

## 9. 🚀 Expansion Strategy
1. **Pilot:** Department-specific roll-out (e.g., Computer Science).
2. **Intramural Scale:** Expanding to all engineering and arts departments within the same campus.
3. **Intercollegiate (SaaS):** Offering a multi-tenant platform for other universities to adopt Projecxy.
4. **Market Bridge:** Connecting high-rated student projects directly to industry recruiters.

---

## 10. 📊 Success & Strategy Metrics
- **PMF (Product-Market Fit) Score:** % of students who would find project-building "Significantly harder" without Projecxy.
- **Originality Index:** Average "Uniqueness Score" of project proposals over time.
- **Collaborative Yield:** Average count of members per team vs. solo project submissions.
- **Data Ownership:** Students retain IP for public display; Institutions retain "Academic Audit" rights.

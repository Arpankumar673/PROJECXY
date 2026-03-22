-- -----------------------------------------------------------------------------
-- PRODUCTION-GRADE ROW LEVEL SECURITY (RLS) POLICIES FOR PROJECXY
-- -----------------------------------------------------------------------------

-- 1. Enable & Force RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles FORCE ROW LEVEL SECURITY;

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects FORCE ROW LEVEL SECURITY;

ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_members FORCE ROW LEVEL SECURITY;

ALTER TABLE join_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE join_requests FORCE ROW LEVEL SECURITY;

ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones FORCE ROW LEVEL SECURITY;

-- 2. PROFILES POLICIES
CREATE POLICY "Profiles: Users can insert their own" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Profiles: Users can view their own" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Profiles: Users can update their own" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- 3. PROJECTS POLICIES
CREATE POLICY "Projects: Departmental isolation" ON projects
    FOR SELECT USING (
        projects.department_id IS NOT NULL 
        AND projects.department_id = (SELECT p.department_id FROM profiles p WHERE p.id = auth.uid())
    );

CREATE POLICY "Projects: Creator can insert" ON projects
    FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Projects: Members or creators can update" ON projects
    FOR UPDATE USING (
        auth.uid() = projects.created_by 
        OR EXISTS (
            SELECT 1 FROM project_members pm
            WHERE pm.project_id = projects.id AND pm.user_id = auth.uid()
        )
    );

CREATE POLICY "Projects: Only creator can delete" ON projects
    FOR DELETE USING (auth.uid() = projects.created_by);

-- 4. PROJECT_MEMBERS POLICIES
CREATE POLICY "Members: Departmental visibility" ON project_members
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM projects p
            WHERE p.id = project_members.project_id 
            AND p.department_id = (SELECT pr.department_id FROM profiles pr WHERE pr.id = auth.uid())
        )
    );

CREATE POLICY "Members: Project creator can add/manage members" ON project_members
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM projects p 
            WHERE p.id = project_members.project_id AND p.created_by = auth.uid()
        )
    );

-- 5. JOIN_REQUESTS POLICIES
CREATE POLICY "Requests: View own or as project creator" ON join_requests
    FOR SELECT USING (
        join_requests.user_id = auth.uid() 
        OR EXISTS (
            SELECT 1 FROM projects p 
            WHERE p.id = join_requests.project_id AND p.created_by = auth.uid()
        )
    );

CREATE POLICY "Requests: Users can submit join requests" ON join_requests
    FOR INSERT WITH CHECK (join_requests.user_id = auth.uid());

CREATE POLICY "Requests: Project creators can decide" ON join_requests
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM projects p 
            WHERE p.id = join_requests.project_id AND p.created_by = auth.uid()
        )
    );

-- 6. MILESTONES POLICIES
CREATE POLICY "Milestones: Members or creators can view" ON milestones
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM projects p 
            WHERE p.id = milestones.project_id 
            AND (
                p.created_by = auth.uid() 
                OR EXISTS (
                    SELECT 1 FROM project_members pm 
                    WHERE pm.project_id = p.id AND pm.user_id = auth.uid()
                )
            )
        )
    );

CREATE POLICY "Milestones: Members or creators can insert/manage" ON milestones
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM projects p 
            WHERE p.id = milestones.project_id 
            AND (
                p.created_by = auth.uid() 
                OR EXISTS (
                    SELECT 1 FROM project_members pm 
                    WHERE pm.project_id = p.id AND pm.user_id = auth.uid()
                )
            )
        )
    );

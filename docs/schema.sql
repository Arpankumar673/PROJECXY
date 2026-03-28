-- 🏛️ Projecxy v1.2.0: Institutional Collaboration Schema
-- 🚀 Features: RBAC, Project Membership, Unique Usernames, Advanced Status Tracking

-- 1. Create Profiles Table (Core Identity)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  roll_number TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  department TEXT NOT NULL,
  branch TEXT NOT NULL,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  avatar_url TEXT,
  skills TEXT[], --- Using array for efficient skill matching
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Projects Table (Innovation Hub)
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  domain TEXT NOT NULL,
  required_skills TEXT[],
  status TEXT DEFAULT 'idea' CHECK (status IN ('idea', 'ongoing', 'completed')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Project Members Table (Teaming System)
CREATE TABLE IF NOT EXISTS public.project_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'member', 'mentor')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);

-- 4. Create Messages Table (Transmission Layer)
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- 🛡️ Profile Policies
CREATE POLICY "Profiles are public readable" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 🛡️ Project Policies
CREATE POLICY "Projects are public readable" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Owners can manage own projects" ON public.projects FOR ALL USING (auth.uid() = owner_id);
CREATE POLICY "Admins can view all projects in department" ON public.projects FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin' AND department = projects.domain));

-- 🛡️ Project Member Policies
CREATE POLICY "Membership is public readable" ON public.project_members FOR SELECT USING (true);
CREATE POLICY "Users can join projects" ON public.project_members FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owners can remove members" ON public.project_members FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND owner_id = auth.uid())
);

-- 🛡️ Message Policies
CREATE POLICY "Users can see own messages" ON public.messages FOR SELECT 
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users can send messages" ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- 🛠️ RPC: Get Conversations for Inbox
CREATE OR REPLACE FUNCTION get_conversations(user_uuid UUID)
RETURNS TABLE (
  id UUID,
  full_name TEXT,
  username TEXT,
  avatar_url TEXT,
  last_message_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT ON (p.id)
    p.id,
    p.full_name,
    p.username,
    p.avatar_url,
    MAX(m.created_at) OVER(PARTITION BY p.id) as last_message_at
  FROM public.profiles p
  JOIN public.messages m ON (m.sender_id = p.id OR m.receiver_id = p.id)
  WHERE (m.sender_id = user_uuid OR m.receiver_id = user_uuid)
  AND p.id != user_uuid
  ORDER BY p.id, last_message_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

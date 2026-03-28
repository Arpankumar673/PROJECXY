-- ⚙️ Projecxy Database Schema

-- 1. Departments
create table public.departments (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    code text unique not null,
    head_id uuid -- FK to profiles, handled later
);

-- 2. Profiles (Linked to auth.users)
create type public.user_role as enum ('student', 'lead', 'mentor', 'faculty', 'admin');

create table public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    email text not null,
    full_name text,
    role user_role default 'student',
    department_id uuid references public.departments(id),
    avatar_url text,
    bio text,
    skills text[],
    interests text[],
    created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. Projects
create type public.project_status as enum ('pending', 'recruiting', 'in_progress', 'completed', 'rejected');

create table public.projects (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    abstract text not null,
    status project_status default 'pending',
    department_id uuid references public.departments(id),
    created_by uuid references public.profiles(id),
    tags text[],
    -- embedding vector(1536), -- Needs pgvector extension
    created_at timestamp with time zone default timezone('utc'::text, now()),
    updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 4. Project Members
create table public.project_members (
    id uuid primary key default gen_random_uuid(),
    project_id uuid references public.projects(id) on delete cascade,
    user_id uuid references public.profiles(id) on delete cascade,
    role_in_team text,
    joined_at timestamp with time zone default timezone('utc'::text, now()),
    unique(project_id, user_id)
);

-- 5. Join Requests
create type public.request_status as enum ('pending', 'accepted', 'rejected');

create table public.join_requests (
    id uuid primary key default gen_random_uuid(),
    project_id uuid references public.projects(id) on delete cascade,
    user_id uuid references public.profiles(id) on delete cascade,
    message text,
    status request_status default 'pending',
    created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 6. Milestones
create type public.milestone_status as enum ('pending', 'approved', 'revision_requested');

create table public.milestones (
    id uuid primary key default gen_random_uuid(),
    project_id uuid references public.projects(id) on delete cascade,
    title text not null,
    description text,
    status milestone_status default 'pending',
    file_url text,
    feedback text,
    submitted_at timestamp with time zone default timezone('utc'::text, now())
);

-- 7. Evaluations
create table public.evaluations (
    id uuid primary key default gen_random_uuid(),
    project_id uuid references public.projects(id) on delete cascade,
    faculty_id uuid references public.profiles(id),
    score integer check (score >= 0 and score <= 100),
    comments text,
    final_grade text,
    evaluated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS
alter table public.departments enable row level security;
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.project_members enable row level security;
alter table public.join_requests enable row level security;
alter table public.milestones enable row level security;
alter table public.evaluations enable row level security;

-- Basic Policies
create policy "Public departments are viewable by everyone." on departments for select using (true);

create policy "Profiles are viewable by everyone in the same department."
on profiles for select using (auth.uid() = id or department_id in (
    select department_id from profiles where id = auth.uid()
));

create policy "Users can update their own profile."
on profiles for update using (auth.uid() = id);

create policy "Projects are viewable if status is recruiting or user is member."
on projects for select using (
    status = 'recruiting' or 
    exists (
        select 1 from project_members where project_id = projects.id and user_id = auth.uid()
    )
);

create policy "Admins can see all projects in their department."
on projects for select using (
    exists (
        select 1 from profiles where id = auth.uid() and role = 'admin' and department_id = projects.department_id
    )
);

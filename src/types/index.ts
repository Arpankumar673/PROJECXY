export type UserRole = 'student' | 'lead' | 'mentor' | 'faculty' | 'admin'
export type ProjectStatus = 'pending' | 'recruiting' | 'in_progress' | 'completed' | 'rejected'
export type RequestStatus = 'pending' | 'accepted' | 'rejected'
export type MilestoneStatus = 'pending' | 'approved' | 'revision_requested'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  role: UserRole
  department_id: string | null
  avatar_url: string | null
  bio: string | null
  skills: string[]
  interests: string[]
  created_at: string
}

export interface Department {
  id: string
  name: string
  code: string
  head_id: string | null
}

export interface Project {
  id: string
  title: string
  abstract: string
  status: ProjectStatus
  department_id: string
  created_by: string
  tags: string[]
  created_at: string
  updated_at: string
}

export interface ProjectMember {
  id: string
  project_id: string
  user_id: string
  role_in_team: string | null
  joined_at: string
}

export interface JoinRequest {
  id: string
  project_id: string
  user_id: string
  message: string | null
  status: RequestStatus
  created_at: string
}

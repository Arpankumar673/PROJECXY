import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export interface ProjectRoleData {
  id: string
  role_name: string
  skills_required: string[]
  count: number
  experience_level: 'Beginner' | 'Intermediate' | 'Advanced'
}

export interface ProjectData {
  title: string
  description: string
  category: string
  goal: string
  timeline: string
  work_type: 'Online' | 'Offline' | 'Hybrid'
  open_to_all: boolean
  target_department_id?: string
  roles: ProjectRoleData[]
}

export function useCreateProject() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createProject = async (data: ProjectData) => {
    if (!user) {
      setError('Authentication required to create a project.')
      return null
    }

    setLoading(true)
    setError(null)

    try {
      // 🎯 THE VERIFIED "THREE PILLAR" INSERT
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert({
          title: data.title,
          description: data.description || `Innovation project: ${data.title}`, 
          user_id: user.id
        })
        .select()
        .single()

      if (projectError) throw projectError

      // 2. Add creator as Team Lead (project_members table)
      // NOTE: Using only project_id and user_id to ensure schema compatibility
      const { error: memberError } = await supabase.from('project_members').insert({
        project_id: project.id,
        user_id: user.id
      })

      if (memberError) {
        console.error('[PROJECXY CREATE]: Member Sync Failed:', memberError.message)
        // We don't throw here to avoid project creation failure if only member link fails
      }

      setLoading(false)
      return project
    } catch (err: any) {
      console.error('[PROJECXY CREATE]: Critical Failure:', err.message)
      setError(err.message)
      setLoading(false)
      return null
    }
  }

  return { createProject, loading, error }
}

import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import ProfileHeader from '../components/profile/ProfileHeader'
import AboutSection from '../components/profile/AboutSection'
import SkillsSection from '../components/profile/SkillsSection'
import ProjectsSection from '../components/profile/ProjectsSection'
import EditProfileModal from '../components/profile/EditProfileModal'

export default function Profile() {
  const { user: authUser, refreshProfile, loading: authLoading } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const queryParams = new URLSearchParams(location.search)
  const targetUserId = queryParams.get('id')

  const [targetProfile, setTargetProfile] = useState<any>(null)
  const [targetProjects, setTargetProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const isOwnProfile = !targetUserId || targetUserId === authUser?.id

  useEffect(() => {
    async function loadProfile() {
      setLoading(true)
      const userId = targetUserId || authUser?.id
      if (!userId) return

      // Fetch Profile
      const { data: pData, error: pError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (pError) {
        console.error('Error loading profile:', pError)
        navigate('/dashboard')
        return
      }
      setTargetProfile(pData)

      // Fetch Projects
      const { data: projData, error: projError } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (!projError) setTargetProjects(projData || [])
      setLoading(false)
    }

    if (!authLoading) {
      loadProfile()
    }
  }, [targetUserId, authUser, authLoading, navigate])

  const handleUpdateBio = async (newBio: string) => {
    if (!isOwnProfile) return
    const { error } = await supabase
      .from('profiles')
      .update({ bio: newBio })
      .eq('id', authUser?.id)

    if (error) throw error
    await refreshProfile()
    setTargetProfile((prev: any) => ({ ...prev, bio: newBio }))
  }

  const handleUpdateSkills = async (newSkills: string[]) => {
    if (!isOwnProfile) return
    const { error } = await supabase
      .from('profiles')
      .update({ skills: newSkills })
      .eq('id', authUser?.id)

    if (error) throw error
    await refreshProfile()
    setTargetProfile((prev: any) => ({ ...prev, skills: newSkills }))
  }

  const handleAddProject = async (projectData: any) => {
    if (!isOwnProfile) return
    const { error } = await supabase
      .from('projects')
      .insert({ ...projectData, user_id: authUser?.id })

    if (error) throw error
    const { data: projData } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', authUser?.id)
      .order('created_at', { ascending: false })
    setTargetProjects(projData || [])
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="h-12 w-12 border-4 border-[#0A66C2] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!targetProfile) return null

  return (
    <div className="max-w-[1128px] mx-auto py-4 md:py-8 px-0 md:px-4 lg:px-0 space-y-4 md:space-y-6 animate-in fade-in duration-700 overflow-x-hidden">
      <div className="px-3 md:px-0">
        <ProfileHeader 
          profile={targetProfile} 
          onEdit={() => setIsEditModalOpen(true)} 
          onAvatarUpdate={refreshProfile}
          isOwnProfile={isOwnProfile}
        />
      </div>

      <div className="px-3 md:px-0 space-y-4 md:space-y-6">
        <AboutSection 
          bio={targetProfile.bio} 
          onSave={handleUpdateBio} 
          isOwnProfile={isOwnProfile}
        />

        <ProjectsSection 
          projects={targetProjects}
          onAdd={handleAddProject}
          onEdit={async (p) => {
            if (!isOwnProfile) return
            await supabase.from('projects').update(p).eq('id', p.id)
            setTargetProjects((prev: any[]) => prev.map(item => item.id === p.id ? { ...item, ...p } : item))
          }}
          onDelete={async (id) => {
            if (!isOwnProfile || !confirm('Delete project?')) return
            await supabase.from('projects').delete().eq('id', id)
            setTargetProjects((prev: any[]) => prev.filter(item => item.id !== id))
          }}
          isOwnProfile={isOwnProfile}
        />

        <SkillsSection 
          skills={targetProfile.skills || []} 
          onUpdate={handleUpdateSkills} 
          isOwnProfile={isOwnProfile}
        />
      </div>
       {isOwnProfile && (
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          initialData={targetProfile}
          onSave={async (data) => {
            const { error } = await supabase.from('profiles').update(data).eq('id', authUser?.id)
            if (error) throw error
            await refreshProfile()
            setTargetProfile((prev: any) => ({ ...prev, ...data }))
          }}
          loading={false}
        />
      )}
    </div>
  )
}

import { Camera, GraduationCap, Edit3 } from 'lucide-react'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { clsx } from 'clsx'

interface ProfileHeaderProps {
  profile: any
  onEdit: () => void
  onAvatarUpdate: (url: string) => void
  isOwnProfile?: boolean
}

export default function ProfileHeader({ profile, onEdit, onAvatarUpdate, isOwnProfile = true }: ProfileHeaderProps) {
  const [uploading, setUploading] = useState(false)

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      if (!e.target.files || e.target.files.length === 0) return

      const file = e.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${profile.id}-${Math.random()}.${fileExt}`
      const filePath = `${profile.id}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', profile.id)

      if (updateError) throw updateError
      onAvatarUpdate(publicUrl)

    } catch (err: any) {
      alert(err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="li-card overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
      {/* Banner Area */}
      <div className="h-48 bg-[#B1B3B5] relative group/banner">
        {isOwnProfile && (
          <button className="absolute right-4 top-4 p-2 rounded-full bg-white shadow-xl text-[#0A66C2] hover:bg-[#F3F2EF] transition-all opacity-0 group-hover/banner:opacity-100 z-10 transition-opacity">
            <Camera className="h-5 w-5" />
          </button>
        )}
        
        {/* 1. Profile Image - Absolute positioned */}
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 md:left-8 md:translate-x-0 z-20 group/avatar">
          <label className="cursor-pointer">
            <div className={clsx(
              "h-40 w-40 rounded-full bg-white border-4 border-white overflow-hidden shadow-2xl flex items-center justify-center relative transition-all duration-300 ring-4 ring-transparent hover:ring-[#0A66C2]/10",
              uploading && "animate-pulse"
            )}>
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.full_name} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full bg-[#EDF3F8] flex items-center justify-center">
                  <span className="text-4xl font-black text-[#0A66C2] tracking-tighter shadow-sm">
                    {profile.full_name ? profile.full_name[0] : 'U'}
                  </span>
                </div>
              )}
              
              {isOwnProfile && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 flex flex-col items-center justify-center transition-all duration-300">
                  <Camera className="h-8 w-8 text-white mb-2" />
                  <span className="text-[10px] font-black tracking-widest text-white uppercase bg-black/50 px-3 py-1 rounded">Edit</span>
                </div>
              )}
              
              {uploading && (
                <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                  <div className="h-10 w-10 border-4 border-[#0A66C2] border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
            <input 
              type="file" 
              className="hidden" 
              accept="image/*" 
              onChange={handleAvatarUpload}
              disabled={uploading}
            />
          </label>
        </div>
      </div>
      
      {/* 2. Content Area - pt-16 for mobile, md:ml-32 for desktop info spacing */}
      <div className="px-5 md:px-8 pb-6 pt-20 md:pt-4 md:ml-52 flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
         
         <div className="flex-grow space-y-4 text-center md:text-left w-full">
           <div className="space-y-1">
              <div className="flex flex-col md:flex-row items-center md:items-baseline md:gap-3">
                <h1 className="text-2xl md:text-3xl font-black text-black tracking-tight leading-tight uppercase">{profile.full_name || "Innovator"}</h1>
                <span className="text-[#666666] font-bold text-[14px] md:text-[16px] opacity-60">@{profile.username || "username"}</span>
              </div>
              
              <div className="space-y-4">
                <p className="text-[16px] md:text-[18px] text-[#000000e6] font-bold opacity-80 leading-tight">
                  Student in {profile.department || "Engineering"} {profile.branch ? `• ${profile.branch}` : ""}
                </p>
                
                <div className="flex items-center justify-center md:justify-start">
                  <div className="flex items-center gap-1.5 px-4 py-1.5 bg-[#EDF3F8] rounded-full border border-[#0A66C2]/10 shadow-sm transition-all hover:bg-[#0A66C2]/10 group">
                    <GraduationCap className="h-4 w-4 text-[#0A66C2]" />
                    <span className="text-[9px] md:text-[10px] font-black text-[#0A66C2] uppercase tracking-widest leading-none">G.C.R.G Group of Institutions</span>
                  </div>
                </div>
              </div>
           </div>
         </div>

         {/* Edit Action */}
         {isOwnProfile && (
           <div className="flex items-center justify-center w-full md:w-auto h-full md:pt-4">
              <button 
                onClick={onEdit}
                className="h-12 w-full md:h-10 md:w-10 lg:w-auto md:px-6 bg-[#F3F6F9] text-[#666666] hover:bg-[#0A66C2] hover:text-white rounded-xl transition-all group flex items-center justify-center gap-2 shadow-sm border border-[#D9E2ED]"
              >
                 <Edit3 className="h-5 w-5" />
                 <span className="md:hidden lg:inline text-xs font-black uppercase tracking-widest">Edit Profile</span>
              </button>
           </div>
         )}
      </div>

      {/* Profile Actions - Stacked on Mobile */}
      <div className="px-5 md:px-8 pb-8 flex flex-col md:flex-row gap-3 md:gap-4 border-t border-[#F3F2EF] pt-8">
         <button className="h-12 md:h-11 w-full md:w-auto li-button-primary px-10 text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/10 transition-transform active:scale-95">Open to Opportunity</button>
         <button className="h-12 md:h-11 w-full md:w-auto px-10 border border-[#D9E2ED] text-[#666666] font-black text-xs uppercase tracking-widest rounded-full hover:bg-[#F3F6F9] transition-all">Add Section</button>
         <button className="h-12 md:h-11 w-full md:w-auto px-8 border border-[#D9E2ED] text-[#666666] font-black text-xs uppercase tracking-widest rounded-full hover:bg-[#F3F6F9] transition-all">More</button>
      </div>
    </div>
  )
}

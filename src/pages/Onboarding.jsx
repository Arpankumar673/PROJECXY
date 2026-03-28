import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { 
  User, 
  BookOpen, 
  Hash, 
  GraduationCap, 
  Camera, 
  Loader2, 
  Sparkles, 
  AlertCircle, 
  ArrowRight, 
  Code2, 
  ShieldCheck, 
  UserCheck,
  Building2,
  ChevronRight
} from 'lucide-react'

// Institutional Metadata for Projecxy v1.2
const DEPARTMENTS = {
  "Comp Sci & Engg": ["AI ML", "Data Science", "Cyber Security", "Full Stack", "Blockchain"],
  "Information Tech": ["Cloud Computing", "IoT", "DevOps", "Software Engineering"],
  "Electronics & Comm": ["VLSI", "Signal Processing", "Embedded Systems", "Communication Systems"],
  "Mechanical Engg": ["Robotics", "Automobile", "Thermodynamics", "Design"],
  "Civil Engg": ["Structural", "Environmental", "Geotechnical"],
  "Biotech": ["Bioinformatics", "Genetics", "Pharmaceutical"],
  "MBA": ["Marketing", "Finance", "HR", "Operations"]
}

export default function Onboarding() {
  const { profile, fetchProfile } = useOutletContext()
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [department, setDepartment] = useState('')
  const [branch, setBranch] = useState('')
  const [rollNumber, setRollNumber] = useState('')
  const [role, setRole] = useState('student')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '')
      setUsername(profile.username || '')
      setDepartment(profile.department || '')
      setBranch(profile.branch || '')
      setRollNumber(profile.roll_number || '')
      setRole(profile.role || 'student')
      setAvatarUrl(profile.avatar_url || '')
      
      // Strict Check: Only redirect if ALL institutional identity fields are present
      if (profile.username && profile.department && profile.branch && profile.roll_number && profile.role) {
        navigate('/dashboard')
      }
    }
  }, [profile, navigate])

  const handleAvatarUpload = async (e) => {
    try {
      setUploading(true)
      const file = e.target.files[0]
      if (!file) return
      
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      setAvatarUrl(publicUrl)
    } catch (err) {
      setError(`Avatar Upload Failed: ${err.message}`)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      // 1. Authenticate Request
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) throw new Error("Authentication failed. Please login again.")

      // 2. Format Identifiers
      const cleanUsername = username.trim().toLowerCase().replace(/\s/g, '')

      // 3. Uniqueness Check (Client-side fail fast)
      const { data: existing } = await supabase
        .from('profiles')
        .select('username, roll_number')
        .or(`username.eq.${cleanUsername},roll_number.eq.${rollNumber}`)
        .neq('id', user.id) // ignore self if editing
      
      if (existing && existing.length > 0) {
        if (existing.some(e => e.username === cleanUsername)) throw new Error("Username already claimed.")
        if (existing.some(e => e.roll_number === rollNumber)) throw new Error("Roll Number already registered.")
      }

      // 4. Update Profile
      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: fullName,
          username: cleanUsername,
          department,
          branch,
          roll_number: rollNumber,
          avatar_url: avatarUrl,
          role,
          updated_at: new Date().toISOString()
        })

      if (updateError) throw updateError
      
      // 5. Success Flow
      await fetchProfile()
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const branches = department ? DEPARTMENTS[department] : []

  return (
    <div className="min-h-screen bg-[#F3F2EF] flex flex-col items-center pt-8 pb-20 selection:bg-brand/10 antialiased">
      {/* Brand Header */}
      <div className="flex items-center gap-3 mb-10 group select-none">
        <div className="w-10 h-10 bg-brand rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
          <Code2 className="text-white w-6 h-6" />
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-black tracking-tighter text-brand">PROJECXY</span>
          <span className="text-[10px] font-black uppercase tracking-[3px] text-text-secondary leading-none">Institutional System</span>
        </div>
      </div>

      <div className="w-full max-w-2xl px-4 animate-fade-in">
        <div className="card p-8 md:p-12 shadow-2xl border-none ring-1 ring-black/5">
          <div className="text-center mb-10 space-y-2">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/5 border border-brand/20 text-brand text-[10px] font-black uppercase tracking-widest mb-4">
               <Sparkles size={12} /> Version 1.2 Setup
             </div>
             <h1 className="text-3xl font-extrabold text-[#1d2226] tracking-tight">Onboarding Gateway</h1>
             <p className="text-text-secondary font-medium">Define your professional identity within the university ecosystem.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-12">
            {/* Role Strategy */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-text-secondary uppercase tracking-[3px] ml-1">Identity Type</label>
              <div className="grid grid-cols-2 gap-4">
                 <button 
                   type="button"
                   onClick={() => setRole('student')}
                   className={`group flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-300 text-left ${
                     role === 'student' ? 'border-brand bg-brand/5 shadow-inner' : 'border-border-subtle hover:border-brand/40 bg-white'
                   }`}
                 >
                   <div className={`p-3 rounded-xl transition-colors ${role === 'student' ? 'bg-brand text-white' : 'bg-gray-100 text-text-secondary'}`}>
                      <UserCheck size={24} />
                   </div>
                   <div className="flex-1">
                      <p className={`text-sm font-black uppercase tracking-widest ${role === 'student' ? 'text-brand' : 'text-text-secondary'}`}>Student</p>
                      <p className="text-[10px] font-bold text-text-secondary opacity-60">Build & Collaborate</p>
                   </div>
                 </button>
                 <button 
                   type="button"
                   onClick={() => setRole('admin')}
                   className={`group flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-300 text-left ${
                     role === 'admin' ? 'border-brand bg-brand/5 shadow-inner' : 'border-border-subtle hover:border-brand/40 bg-white'
                   }`}
                 >
                   <div className={`p-3 rounded-xl transition-colors ${role === 'admin' ? 'bg-brand text-white' : 'bg-gray-100 text-text-secondary'}`}>
                      <ShieldCheck size={24} />
                   </div>
                   <div className="flex-1">
                      <p className={`text-sm font-black uppercase tracking-widest ${role === 'admin' ? 'text-brand' : 'text-text-secondary'}`}>Admin</p>
                      <p className="text-[10px] font-bold text-text-secondary opacity-60">Oversight & Review</p>
                   </div>
                 </button>
              </div>
            </div>

            {/* Avatar Engine */}
            <div className="flex flex-col items-center">
               <div className="relative group/avatar">
                  <div className="w-32 h-32 rounded-full bg-white border-2 border-border-subtle overflow-hidden flex items-center justify-center shadow-xl ring-8 ring-gray-50 group-hover/avatar:ring-brand/5 transition-all duration-500">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-16 h-16 text-slate-200" />
                    )}
                    {uploading && (
                      <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center backdrop-blur-sm">
                        <Loader2 className="w-8 h-8 animate-spin text-brand" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-brand mt-2">Syncing</span>
                      </div>
                    )}
                  </div>
                  <label className="absolute bottom-1 right-1 w-10 h-10 bg-brand text-white rounded-full flex items-center justify-center cursor-pointer shadow-2xl border-4 border-white hover:scale-110 active:scale-90 transition-all">
                    <Camera size={18} />
                    <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={uploading} />
                  </label>
               </div>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl flex gap-3 items-center animate-slide-up">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-xs font-bold text-red-700 tracking-tight">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-secondary uppercase tracking-[2px] pl-1">Legal Full Name</label>
                <div className="relative">
                   <User className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary w-4 h-4" />
                   <input
                     type="text"
                     placeholder="John Doe"
                     value={fullName}
                     onChange={(e) => setFullName(e.target.value)}
                     className="input-professional border border-border-subtle bg-white h-11 pl-10 ring-brand/5 focus:ring-4"
                     required
                   />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-secondary uppercase tracking-[2px] pl-1">Professional Username</label>
                <div className="relative">
                   <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary w-4 h-4" />
                   <input
                     type="text"
                     placeholder="john_dev"
                     value={username}
                     onChange={(e) => setUsername(e.target.value)}
                     className="input-professional border border-border-subtle bg-white h-11 pl-10"
                     required
                   />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-secondary uppercase tracking-[2px] pl-1">Institutional Roll ID</label>
                <div className="relative">
                   <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary w-4 h-4" />
                   <input
                     type="text"
                     placeholder="Ex. CSE/24/001"
                     value={rollNumber}
                     onChange={(e) => setRollNumber(e.target.value)}
                     className="input-professional border border-border-subtle bg-white h-11 pl-10"
                     required
                   />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-secondary uppercase tracking-[2px] pl-1">Home Department</label>
                <div className="relative">
                   <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary w-4 h-4" />
                   <select
                     value={department}
                     onChange={(e) => {
                       setDepartment(e.target.value)
                       setBranch('')
                     }}
                     className="input-professional border border-border-subtle bg-white h-11 pl-10 appearance-none cursor-pointer"
                     required
                   >
                     <option value="" disabled>Choose Department</option>
                     {Object.keys(DEPARTMENTS).map(dept => (
                       <option key={dept} value={dept}>{dept}</option>
                     ))}
                   </select>
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-black text-text-secondary uppercase tracking-[2px] pl-1">Primary Branch / Specialty</label>
                <div className="relative">
                   <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 text-brand w-4 h-4" />
                   <select
                     value={branch}
                     onChange={(e) => setBranch(e.target.value)}
                     className="input-professional border border-border-subtle bg-white h-11 pl-10 appearance-none cursor-pointer disabled:opacity-50"
                     disabled={!department}
                     required
                   >
                     <option value="" disabled>Select specialization</option>
                     {branches.map(b => (
                       <option key={b} value={b}>{b}</option>
                     ))}
                   </select>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving || uploading}
              className="btn-primary w-full h-14 text-sm font-black uppercase tracking-[3px] shadow-xl disabled:opacity-50 mt-4 transition-all group flex items-center justify-center gap-3"
            >
              {saving ? (
                <Loader2 className="w-6 h-6 animate-spin text-white/70" />
              ) : (
                <>
                  Establish My Gateway <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
        
        <p className="mt-8 text-center text-[10px] font-bold text-text-secondary/60 uppercase tracking-widest">
          Verification Required for Institutional Access &bull; Projecxy v1.2
        </p>
      </div>
    </div>
  )
}

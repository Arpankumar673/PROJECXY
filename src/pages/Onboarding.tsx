import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'
import { Search, ArrowRight, User, Building2, ShieldCheck } from 'lucide-react'
import Input from '../components/ui/Input'
import { clsx } from 'clsx'

const departmentsList = [
  "Electrical Engineering",
  "Civil Engineering",
  "Agriculture Engineering",
  "Biotechnology",
  "Mechanical Engineering",
  "Computer Science",
  "MBA"
]

const csBranches = [ "AI/ML", "CSE Core", "Data Science", "Cyber Security"]

export default function Onboarding() {
  const navigate = useNavigate()
  const { user, profile, refreshProfile, signOut } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [form, setForm] = useState({
    username: '',
    department: '',
    branch: '',
    chosenRole: '' // Fallback if role missing
  })

  const isAlreadyOnboarded = profile?.is_onboarded && profile?.role
  const currentRole = profile?.role || form.chosenRole
  const isDept = currentRole === 'department'
  const isStudent = currentRole === 'student'

  useEffect(() => {
    if (isAlreadyOnboarded) {
      console.log('[PROJECXY ONBOARDING]: Profile complete. Redirecting to:', currentRole)
      navigate(isDept ? '/dept-dashboard' : '/dashboard')
    }
  }, [isAlreadyOnboarded, currentRole, isDept, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    if (!currentRole) {
      setError('Please select your role explicitly.')
      return
    }

    setLoading(true)
    setError('')

    try {
      // 1. Check Username availability
      const { data: existing } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', form.username)
        .maybeSingle()

      if (existing && existing.username !== profile?.username) {
        throw new Error('Username already taken')
      }

      // 2. Perform Atomic Update
      console.log('[PROJECXY ONBOARDING]: Persisting profile for user:', user.id)
      
      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          username: form.username,
          department: isStudent ? form.department : (profile?.full_name || form.department),
          branch: isStudent ? (form.branch || null) : null,
          role: currentRole as any,
          is_onboarded: true,
          full_name: profile?.full_name || form.username
        })

      if (updateError) throw updateError

      console.log('[PROJECXY ONBOARDING]: Persisted. Refreshing...')
      await refreshProfile()
      
      // Navigate immediately to break any possible loops
      navigate(isDept ? '/dept-dashboard' : '/dashboard')

    } catch (err: any) {
      console.error('[PROJECXY ONBOARDING]: Fatal error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F3F2EF] flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="li-card w-full max-w-md p-8 shadow-xl space-y-8"
      >
        <div className="text-center space-y-2">
           <div className="h-16 w-16 bg-[#0A66C2] rounded-full mx-auto flex items-center justify-center text-white mb-4 shadow-lg shadow-primary/20">
              {isDept ? <Building2 size={32} /> : <User size={32} />}
           </div>
           <h1 className="text-2xl font-black text-gray-900 tracking-tight">Onboarding Setup</h1>
           <p className="text-sm text-[#666666]">Finalize your innovation profile handles.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Missing Role Selection - Final Guard */}
          {!profile?.role && (
             <div className="space-y-4">
                <p className="text-[10px] font-black text-[#666666] uppercase tracking-widest text-center">Confirm Identity Access</p>
                <div className="grid grid-cols-2 gap-3">
                   <button type="button" onClick={() => setForm({...form, chosenRole: 'student'})} className={clsx("p-3 border-2 rounded-xl text-center transition-all", form.chosenRole === 'student' ? "border-blue-600 bg-blue-50 text-blue-600" : "border-gray-100 hover:border-gray-200")}>
                      <span className="text-xs font-bold block">Student</span>
                   </button>
                   <button type="button" onClick={() => setForm({...form, chosenRole: 'department'})} className={clsx("p-3 border-2 rounded-xl text-center transition-all", form.chosenRole === 'department' ? "border-blue-600 bg-blue-50 text-blue-600" : "border-gray-100 hover:border-gray-200")}>
                      <span className="text-xs font-bold block">Department</span>
                   </button>
                </div>
             </div>
          )}

          <div className="space-y-5">
             <Input
                label={isDept ? "Administrative Handle" : "Unique Username"}
                icon={Search}
                placeholder={isDept ? "cse_official" : "john_doe"}
                required
                value={form.username}
                onChange={(e) => setForm({...form, username: e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, '')})}
             />

             {isStudent && (
               <div className="space-y-5">
                  <div className="space-y-1.5 group">
                     <label className="text-[10px] font-black text-[#666666] tracking-widest uppercase">Department</label>
                     <select required value={form.department} onChange={e => setForm({...form, department: e.target.value, branch: ''})} className="w-full h-12 bg-gray-100 border-transparent rounded-lg px-4 font-bold outline-none focus:bg-white focus:ring-1 focus:ring-blue-600 transition-all cursor-pointer">
                        <option value="">Select Dept</option>
                        {departmentsList.map(d => <option key={d} value={d}>{d}</option>)}
                     </select>
                  </div>
                  {form.department === 'Computer Science' && (
                    <div className="space-y-1.5 group">
                       <label className="text-[10px] font-black text-[#666666] tracking-widest uppercase">Academic Branch</label>
                       <select required value={form.branch} onChange={e => setForm({...form, branch: e.target.value})} className="w-full h-12 bg-gray-100 border-transparent rounded-lg px-4 font-bold outline-none focus:bg-white focus:ring-1 focus:ring-blue-600 transition-all cursor-pointer">
                          <option value="">Select Branch</option>
                          {csBranches.map(b => <option key={b} value={b}>{b}</option>)}
                       </select>
                    </div>
                  )}
               </div>
             )}

             {isDept && (
                <div className="p-4 bg-blue-600 text-white rounded-xl space-y-2">
                   <div className="flex items-center gap-2"><ShieldCheck size={16} /> <span className="text-[10px] font-black uppercase tracking-widest">Institutional Mode</span></div>
                   <p className="text-sm font-bold">You are registering as a Department Head. Your username will be your official tag.</p>
                </div>
             )}
          </div>

          {error && <div className="p-3 bg-red-50 text-red-600 text-xs font-bold rounded-lg border border-red-100">{error}</div>}

          <button 
            type="submit" 
            disabled={loading || !currentRole}
            className="li-button-primary w-full h-14 text-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50"
          >
            {loading ? 'Finalizing...' : (isDept ? 'Access Admin Hub' : 'Enter Dashboard')}
            <ArrowRight className="h-5 w-5" />
          </button>
        </form>
      </motion.div>
      <button onClick={() => signOut()} className="mt-8 text-red-600 font-bold hover:underline text-sm uppercase tracking-widest">Sign Out</button>
    </div>
  )
}

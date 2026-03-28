import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

type AuthStep = 'role' | 'auth'
type Role = 'student' | 'department'

export default function Auth() {
  const navigate = useNavigate()
  const { } = useAuth()
  const [step, setStep] = useState<AuthStep>('role')
  const [role, setRole] = useState<Role>('student')
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Form State
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [rollNumber, setRollNumber] = useState('')
  const [deptName, setDeptName] = useState('')
  const [deptCode, setDeptCode] = useState('')
  const [hodName, setHodName] = useState('')

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isLogin) {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password })
        if (authError) throw authError
        
        // REFRESH CONTEXT: Fetch latest profile to check onboarding status
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_onboarded, role')
          .eq('id', authData.user.id)
          .single()
        
        console.log('[PROJECXY LOGIN]: Profile setup status:', profile?.is_onboarded)
        
        // Decide Redirect Logic
        if (!profile?.is_onboarded) {
          navigate('/onboarding')
        } else if (profile?.role === 'department') {
          navigate('/dept-dashboard')
        } else {
          navigate('/dashboard')
        }
      } else {
        // Signup logic
        const { data: authData, error: authError } = await supabase.auth.signUp({ 
          email, 
          password,
          options: { data: { full_name: role === 'student' ? fullName : deptName } }
        })
        if (authError) throw authError
        if (!authData.user) throw new Error('Signup failed')

        // Force create profile row - Requirement: Create profile with is_onboarded = false
        const { error: profileError } = await supabase.from('profiles').upsert({ 
          id: authData.user.id, 
          full_name: role === 'student' ? fullName : deptName, 
          role: role, 
          is_onboarded: false 
        })
        if (profileError) {
           console.warn('Profile creation failed (check RLS):', profileError.message)
        }

        if (role === 'student') {
          await supabase.from('students').upsert({ id: authData.user.id, roll_number: rollNumber })
        } else {
          await supabase.from('departments').upsert({ id: authData.user.id, dept_name: deptName, dept_code: deptCode, hod_name: hodName })
        }

        // Fresh signups ALWAYS go to onboarding
        navigate('/onboarding')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F3F2EF] flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {step === 'role' ? (
          <motion.div 
            key="role-selection"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-xl border border-gray-100 space-y-8"
          >
             <div className="text-center space-y-2">
               <h1 className="text-3xl font-bold text-gray-900 tracking-tight leading-relaxed">Welcome back to Projecxy</h1>
               <p className="text-gray-500 font-medium">Choose how you want to use the platform</p>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <button 
                 onClick={() => { setRole('student'); setStep('auth'); }}
                 className="p-6 border-2 border-gray-100 rounded-xl hover:border-blue-600 hover:bg-blue-50 transition-all text-left space-y-3 group"
               >
                 <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-xl transition-colors group-hover:bg-blue-600 group-hover:text-white">S</div>
                 <div>
                   <h3 className="font-bold text-gray-900 uppercase text-xs tracking-wider">Student Hub</h3>
                   <p className="text-xs text-gray-500 leading-relaxed">Collaborate on innovative projects.</p>
                 </div>
               </button>

               <button 
                 onClick={() => { setRole('department'); setStep('auth'); }}
                 className="p-6 border-2 border-gray-100 rounded-xl hover:border-blue-600 hover:bg-blue-50 transition-all text-left space-y-3 group"
               >
                 <div className="h-12 w-12 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center font-bold text-xl transition-colors group-hover:bg-blue-600 group-hover:text-white">D</div>
                 <div>
                   <h3 className="font-bold text-gray-900 uppercase text-xs tracking-wider">Dept Portal</h3>
                   <p className="text-xs text-gray-500 leading-relaxed">Manage monitoring & oversight.</p>
                 </div>
               </button>
             </div>

             <div className="text-center pt-4">
               <button 
                 onClick={() => setIsLogin(!isLogin)} 
                 className="text-sm font-semibold text-blue-600 hover:underline"
               >
                 {isLogin ? "New user? Create your account" : "Back to Sign In"}
               </button>
             </div>
          </motion.div>
        ) : (
          <motion.div 
            key="auth-form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-xl border border-gray-100"
          >
             <button 
               onClick={() => setStep('role')} 
               className="text-gray-400 hover:text-gray-600 text-sm font-medium flex items-center gap-1 mb-8"
             >
               ← Back
             </button>

             <div className="mb-8">
               <h1 className="text-2xl font-black text-gray-900">{isLogin ? "Sign In" : role === 'student' ? "Join as Student" : "Institution Access"}</h1>
               <p className="text-sm text-gray-500">{isLogin ? "Authentication required to enter" : role === 'student' ? "Join the innovation network" : "Official departmental setup"}</p>
             </div>

             {error && (
               <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg border border-red-100 text-sm font-medium">
                 {error}
               </div>
             )}

             <form onSubmit={handleAuth} className="space-y-5">
                {!isLogin && role === 'student' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Full (Real) Name</label>
                      <input required value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Full Name" className="w-full px-4 py-3 rounded-lg border bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder:text-gray-400" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Roll/Register No.</label>
                      <input required value={rollNumber} onChange={e => setRollNumber(e.target.value)} placeholder="e.g. 21001" className="w-full px-4 py-3 rounded-lg border bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder:text-gray-400" />
                    </div>
                  </div>
                )}

                {!isLogin && role === 'department' && (
                  <div className="space-y-5">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 font-sans">Full Department Name</label>
                      <input required value={deptName} onChange={e => setDeptName(e.target.value)} placeholder="e.g. Computer Science" className="w-full px-4 py-3 rounded-lg border bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder:text-gray-400" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 font-sans">Short ID (Code)</label>
                        <input required value={deptCode} onChange={e => setDeptCode(e.target.value)} placeholder="CSE01" className="w-full px-4 py-3 rounded-lg border bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder:text-gray-400" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 font-sans">HOD Presence</label>
                        <input required value={hodName} onChange={e => setHodName(e.target.value)} placeholder="Dr. XYZ" className="w-full px-4 py-3 rounded-lg border bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder:text-gray-400" />
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Institutional Email</label>
                  <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@college.edu" className="w-full px-4 py-3 rounded-lg border bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder:text-gray-400" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Secure Password</label>
                  <input required type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-3 rounded-lg border bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder:text-gray-400" />
                </div>

                <button 
                  disabled={loading}
                  className="w-full py-3 rounded-lg bg-blue-600 text-white font-black hover:bg-blue-700 transition shadow-lg shadow-blue-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? "Authenticating..." : isLogin ? "Sign In" : "Register Credentials"} 
                  {!loading && <ArrowRight size={18} />}
                </button>
             </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

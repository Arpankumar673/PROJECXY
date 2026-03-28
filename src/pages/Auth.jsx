import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Mail, Lock, User, AlertCircle, Loader2, Code2, ArrowLeft } from 'lucide-react'

export default function Auth() {
  const [searchParams] = useSearchParams()
  const initialMode = searchParams.get('mode') === 'signup'
  const [isSignUp, setIsSignUp] = useState(initialMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    setIsSignUp(searchParams.get('mode') === 'signup')
  }, [searchParams])

  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      let targetUser = null
      if (isSignUp) {
        const { data, error: signupError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        })
        if (signupError) throw signupError
        targetUser = data.user
      } else {
        const { data, error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (loginError) throw loginError
        targetUser = data.user
      }

      if (targetUser) {
        // 🛡️ Post-Auth Profile Check
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, username')
          .eq('id', targetUser.id)
          .single()

        if (!profile || !profile.username) {
          navigate('/onboarding')
        } else {
          navigate('/dashboard')
        }
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center pt-8">
      {/* Brand Header */}
      <Link to="/" className="flex items-center gap-2 mb-10 group">
        <div className="w-8 h-8 bg-brand rounded-sm flex items-center justify-center shrink-0">
          <Code2 className="text-white w-5 h-5" />
        </div>
        <span className="text-2xl font-bold tracking-tight group-hover:text-brand transition-colors">Projecxy</span>
      </Link>

      <div className="w-full max-w-[400px] px-6">
        <div className="card p-8 shadow-2xl border-none">
          <h1 className="text-2xl font-semibold text-text-main mb-1">
            {isSignUp ? 'Join Projecxy' : 'Sign in'}
          </h1>
          <p className="text-sm text-text-secondary mb-8">
            {isSignUp ? 'Stay updated on your campus world.' : 'Stay updated on your innovation network.'}
          </p>

          <form onSubmit={handleAuth} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center gap-3 text-xs font-semibold">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {isSignUp && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-secondary pl-1">Full Name</label>
                <input
                  type="text"
                  placeholder="Arpan Kumar"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="input-professional border border-border-subtle bg-white focus:bg-white h-11"
                  required
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary pl-1">Email Address</label>
              <input
                type="email"
                placeholder="name@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-professional border border-border-subtle bg-white focus:bg-white h-11"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary pl-1">Password (6+ characters)</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-professional border border-border-subtle bg-white focus:bg-white h-11"
                required
                minLength={6}
              />
            </div>

            <p className="text-[11px] text-text-secondary leading-tight text-center">
              By clicking Agree & Join or Sign In, you agree to the Projecxy <span className="text-brand font-bold hover:underline cursor-pointer">User Agreement</span>, <span className="text-brand font-bold hover:underline cursor-pointer">Privacy Policy</span>, and <span className="text-brand font-bold hover:underline cursor-pointer">Cookie Policy</span>.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full h-12 text-base shadow-sm disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin mx-auto text-white" />
              ) : (
                isSignUp ? 'Agree & Join' : 'Sign In'
              )}
            </button>

            <div className="relative py-4 flex items-center">
               <div className="flex-1 border-t border-border-subtle" />
               <span className="px-4 text-xs font-semibold text-text-secondary bg-white">or</span>
               <div className="flex-1 border-t border-border-subtle" />
            </div>

            <div className="text-center group">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="w-full h-12 btn-outline text-brand font-bold"
              >
                {isSignUp ? 'Already on Projecxy? Sign in' : "New to Projecxy? Join now"}
              </button>
            </div>
          </form>
        </div>

        <p className="mt-8 text-center text-sm text-text-main">
          Looking to help someone? <span className="text-brand font-bold hover:underline cursor-pointer">Explore the Hub</span>
        </p>

        <div className="mt-12 text-center">
           <Link to="/" className="text-xs font-bold text-text-secondary hover:text-brand flex items-center justify-center gap-2 group">
              <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" /> Back to Landing Page
           </Link>
        </div>
      </div>
    </div>
  )
}

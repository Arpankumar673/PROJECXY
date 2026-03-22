import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Rocket, GraduationCap, Building2, UserCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { Button, Card, Input } from '../components/ui';
import { useAuth } from '../hooks/useAuth';

// Login Page
export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle, user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  React.useEffect(() => {
     if (!authLoading && user) {
        navigate('/dashboard');
     }
  }, [user, authLoading, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Verification failed. Review credentials.');
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
     try {
       await loginWithGoogle();
     } catch (err) {
       setError(err.message);
     }
  };

  return (
    <div className="min-h-screen bg-white md:bg-linkedin-bg flex items-center justify-center py-12 px-4 animate-fade-in">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center group cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-linkedin-blue mx-auto mb-6 group-hover:scale-110 transition-transform shadow-sm">
             <Rocket className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-extrabold text-[#1D2226]">Sign in</h2>
          <p className="mt-2 text-sm text-gray-500 font-medium">Connect with Projecxy. Elevate your studies.</p>
        </div>
        
        <Card className="p-10 border border-gray-100 shadow-xl bg-white space-y-6">
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-xs font-bold border border-red-100">{error}</div>}
          <Input label="Email address" type="email" placeholder="jack@university.edu" value={email} onChange={(e) => setEmail(e.target.value)} />
          <div className="space-y-1">
             <div className="flex justify-between items-center"><label className="text-sm font-medium">Password</label><a href="#" className="text-xs text-linkedin-blue font-bold hover:underline">Forgot?</a></div>
             <Input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button size="lg" className="w-full text-lg py-4" onClick={handleLogin} disabled={loading}>
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Sign in'}
          </Button>
          
          <div className="relative py-4"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div><div className="relative flex justify-center text-sm font-medium"><span className="px-3 bg-white text-gray-400">or use single sign-on</span></div></div>
          
          <Button variant="outline" className="w-full py-3 flex items-center gap-3" onClick={handleGoogleLogin}>
             <img src="https://www.google.com/favicon.ico" className="w-4 h-4 opacity-70" alt="Google" />
             Continue with Google
          </Button>
        </Card>
        
        <p className="text-center text-gray-600 text-sm font-medium">
          New to Projecxy? <Link to="/signup" className="text-linkedin-blue font-bold hover:underline">Join now</Link>
        </p>
      </div>
    </div>
  );
};

// Signup Page
export const SignupPage = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signup(email, password, fullName, role);
      navigate('/onboarding');
    } catch (err) {
      setError(err.message || 'Institutional registration failed.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white md:bg-linkedin-bg flex items-center justify-center py-12 px-4 animate-fade-in">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center group cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-linkedin-blue mx-auto mb-6 group-hover:scale-110 transition-transform shadow-sm">
             <Rocket className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-extrabold text-[#1D2226]">Create Account</h2>
          <p className="mt-2 text-sm text-gray-500 font-medium">Join 2000+ students on the innovation hub.</p>
        </div>

        <Card className="p-8 border border-gray-100 shadow-xl bg-white overflow-hidden relative">
          <div className="flex mb-8 gap-2">
            <div className={`h-1 flex-1 rounded-full transition-colors ${step >= 1 ? 'bg-linkedin-blue' : 'bg-gray-100'}`}></div>
            <div className={`h-1 flex-1 rounded-full transition-colors ${step >= 2 ? 'bg-linkedin-blue' : 'bg-gray-100'}`}></div>
          </div>

          {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-xs font-bold border border-red-100 mb-6">{error}</div>}

          {step === 1 ? (
            <div className="space-y-6 animate-fade-in-right">
              <h3 className="text-lg font-black text-linkedin-text">I am a...</h3>
              <div className="grid grid-cols-1 gap-4">
                {[
                  { id: 'student', label: 'Student', icon: GraduationCap, desc: 'Building & contributing to projects.' },
                  { id: 'dept_admin', label: 'Department Admin', icon: Building2, desc: 'Managing departmental projects.' },
                ].map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setRole(r.id)}
                    className={`flex items-start gap-4 p-5 rounded-2xl border-2 transition-all text-left group ${role === r.id ? 'border-linkedin-blue bg-blue-50' : 'border-gray-50 hover:border-blue-100'}`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${role === r.id ? 'bg-linkedin-blue text-white' : 'bg-gray-50 text-gray-400 group-hover:text-linkedin-blue'}`}>
                      <r.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className={`font-bold ${role === r.id ? 'text-linkedin-blue' : 'text-linkedin-text'}`}>{r.label}</p>
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-widest mt-0.5">{r.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
              <Button size="lg" className="w-full mt-6" disabled={!role} onClick={() => setStep(2)}>
                 Next Step <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSignup} className="space-y-5 animate-fade-in-right">
              <Input label="Full Name" placeholder="Jack Robinson" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
              <Input label="University Email" type="email" placeholder="jack@university.edu" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <Input label="Create Password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <div className="flex gap-4 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>Back</Button>
                <Button className="flex-[2]" type="submit" disabled={loading}>
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Create Account'}
                </Button>
              </div>
            </form>
          )}
        </Card>

        <p className="text-center text-gray-600 text-sm font-medium">
          Already have an account? <Link to="/login" className="text-linkedin-blue font-bold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Rocket, GraduationCap, Building2, UserCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { Button, Card, Input } from '../components/ui';
import { supabase } from '../services/supabase';

// Login Page
export const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate('/dashboard');
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
          
          <Button variant="outline" className="w-full py-3 flex items-center gap-3">
             <img src="https://www.google.com/favicon.ico" className="w-4 h-4 opacity-70" alt="G" />
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

    // 1. Signup user
    const { data: authData, error: authError } = await supabase.auth.signUp({ 
       email, 
       password,
       options: { data: { full_name: fullName, role } } 
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // 2. Create profile entry (Required by RLS/Schema)
    const { error: profileError } = await supabase.from('profiles').insert([
       { id: authData.user.id, full_name: fullName, role: role }
    ]);

    if (profileError) {
        setError(profileError.message);
        setLoading(false);
    } else {
        navigate('/onboarding');
    }
  };

  const roles = [
    { id: 'student', title: 'Student', desc: 'Find teams & build innovative projects.', icon: GraduationCap },
    { id: 'faculty', title: 'Faculty', desc: 'Guide projects & mentor your juniors.', icon: UserCircle2 },
    { id: 'dept_admin', title: 'Admin', desc: 'Manage your department ecosystem.', icon: Building2 }, // Consistent with SQL Enum
  ];

  return (
    <div className="min-h-screen bg-white md:bg-linkedin-bg flex items-center justify-center py-12 px-4 animate-fade-in">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-10">
           <Link to="/" className="inline-flex items-center gap-2 text-linkedin-blue font-bold text-2xl mb-6">
              <Rocket className="w-7 h-7" />
              <span>Projecxy</span>
           </Link>
           <h2 className="text-3xl font-extrabold text-gray-900">Make the most of your professional life</h2>
        </div>

        {step === 1 ? (
          <div className="space-y-6">
             <div className="grid sm:grid-cols-3 gap-4">
                {roles.map((r) => (
                   <Card 
                      key={r.id} 
                      onClick={() => setRole(r.id)}
                      className={`p-10 border-2 cursor-pointer transition-all hover:scale-105 h-full flex flex-col items-center text-center ${role === r.id ? 'border-linkedin-blue bg-blue-50 shadow-blue-100' : 'border-transparent bg-white shadow-sm'}`}
                   >
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-colors ${role === r.id ? 'bg-linkedin-blue text-white shadow-lg shadow-blue-200' : 'bg-gray-100 text-gray-500'}`}>
                         <r.icon className="w-8 h-8" />
                      </div>
                      <h4 className="font-bold text-gray-900 text-lg mb-2">{r.title}</h4>
                      <p className="text-xs text-gray-400 font-medium leading-relaxed">{r.desc}</p>
                   </Card>
                ))}
             </div>
             <Button size="lg" className="w-full py-4 text-xl group h-14" disabled={!role} onClick={() => setStep(2)}>
                Agree and Join
                <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
             </Button>
          </div>
        ) : (
          <Card className="p-10 border border-gray-100 shadow-2xl bg-white space-y-6 max-w-md mx-auto relative group overflow-hidden">
             {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-xs font-bold border border-red-100">{error}</div>}
             <div className="flex items-center gap-4 py-2 mb-2 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                <div className="bg-linkedin-blue text-white p-2 rounded-lg">
                   {role === 'student' ? <GraduationCap className="w-6 h-6" /> : role === 'faculty' ? <UserCircle2 className="w-6 h-6" /> : <Building2 className="w-6 h-6" />}
                </div>
                <div className="text-left">
                   <p className="text-xs text-linkedin-blue font-bold uppercase tracking-wider">Step {step}</p>
                   <p className="font-bold text-linkedin-text text-sm capitalize">Finishing {role?.replace('_', ' ')} setup...</p>
                </div>
             </div>
             <Input label="Full name" placeholder="E.g. Sarah Jenkins" value={fullName} onChange={(e) => setFullName(e.target.value)} />
             <Input label="Email address" type="email" placeholder="sarah@university.edu" value={email} onChange={(e) => setEmail(e.target.value)} />
             <Input label="New Password" type="password" placeholder="Min. 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} />
             <Button size="lg" className="w-full text-lg py-4" onClick={handleSignup} disabled={loading}>
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Sign up'}
             </Button>
             <button onClick={() => setStep(1)} className="w-full text-sm text-gray-500 font-semibold hover:text-black mt-2">Change role</button>
          </Card>
        )}
      </div>
    </div>
  );
};

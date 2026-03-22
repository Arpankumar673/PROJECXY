import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Rocket, Loader2, Sparkles, ChevronRight, 
  User, Building2, Hash, AlertCircle, CheckCircle2
} from 'lucide-react';
import { supabase } from '../services/supabase';
import { useAuth } from '../hooks/useAuth';
import { Button, Card, Input, cn } from '../components/ui';

export const OnboardingPage = () => {
    const navigate = useNavigate();
    const { user, profile, refreshProfile } = useAuth();
    
    const [step, setStep] = useState(1);
    const [department, setDepartment] = useState('');
    const [rollNo, setRollNo] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        // Prevent infinite redirect or re-onboarding
        if (profile?.onboarding_completed) {
            navigate('/dashboard');
        }
    }, [profile, navigate]);

    const validateRollNo = async (number) => {
        const { data, error } = await supabase
            .from('profiles')
            .select('id')
            .eq('roll_no', number.toUpperCase())
            .single();
        
        if (data) return false; // Duplicate
        return true;
    };

    const handleComplete = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // 1. Validate Format
            const rollFormat = /^[A-Z]{2,4}\d{4}-\d{3}$/; // Example: CSE2024-001
            if (!rollFormat.test(rollNo.toUpperCase())) {
               throw new Error("Invalid format. Use example: CSE2024-001");
            }

            // 2. Check Uniqueness
            const isUnique = await validateRollNo(rollNo);
            if (!isUnique) {
                throw new Error("This Roll Number is already registered.");
            }

            // 3. Update Profile
            const { error: updateError } = await supabase
                .from('profiles')
                .update({
                    department: department,
                    roll_no: rollNo.toUpperCase(),
                    onboarding_completed: true,
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id);

            if (updateError) throw updateError;

            setSuccess(true);
            await refreshProfile();
            
            // 4. Smooth Handoff
            setTimeout(() => {
                navigate('/dashboard');
            }, 1500);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-projecxy-dark flex items-center justify-center p-4 selection:bg-projecxy-blue/30 overflow-hidden relative">
            
            {/* 🪐 BACKGROUND AMBIENCE */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-projecxy-blue/10 blur-[120px] rounded-full" />
                <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-purple-500/10 blur-[120px] rounded-full" />
            </div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-xl relative z-10"
            >
                <Card className="bg-projecxy-card/80 backdrop-blur-3xl border-white/[0.06] p-8 md:p-12 shadow-linear rounded-[32px] overflow-hidden relative">
                    
                    {/* 🚀 ANIMATED ICON HEADER */}
                    <div className="mb-10 text-center">
                        <motion.div 
                            animate={{ 
                                y: [0, -10, 0],
                                rotate: [0, 5, 0]
                            }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="w-20 h-20 bg-projecxy-blue/10 rounded-3xl flex items-center justify-center text-projecxy-blue mx-auto mb-6 border border-projecxy-blue/20"
                        >
                            <Rocket className="w-10 h-10 fill-projecxy-blue/20" />
                        </motion.div>
                        <h1 className="text-3xl font-black text-white tracking-tighter mb-2">Initialize Identity</h1>
                        <p className="text-projecxy-secondary font-medium tracking-tight">Sync your institutional credentials to enter the workspace.</p>
                    </div>

                    <form onSubmit={handleComplete} className="space-y-6">
                        <AnimatePresence mode="wait">
                            <motion.div 
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                            >
                                <div className="space-y-4">
                                    <div className="relative group">
                                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-projecxy-secondary group-focus-within:text-projecxy-blue transition-colors" />
                                        <input 
                                            required
                                            value={department}
                                            onChange={(e) => setDepartment(e.target.value)}
                                            placeholder="Department (e.g. Computer Science)"
                                            className="w-full h-14 bg-white/[0.03] border border-white/[0.08] rounded-xl pl-12 pr-4 text-white focus:ring-2 focus:ring-projecxy-blue/50 focus:border-projecxy-blue outline-none transition-all placeholder:text-projecxy-secondary"
                                        />
                                    </div>

                                    <div className="relative group">
                                        <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-projecxy-secondary group-focus-within:text-projecxy-blue transition-colors" />
                                        <input 
                                            required
                                            value={rollNo}
                                            onChange={(e) => setRollNo(e.target.value)}
                                            placeholder="Roll Number (e.g. CSE2024-001)"
                                            className="w-full h-14 bg-white/[0.03] border border-white/[0.08] rounded-xl pl-12 pr-4 text-white focus:ring-2 focus:ring-projecxy-blue/50 focus:border-projecxy-blue outline-none transition-all placeholder:text-projecxy-secondary"
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm font-bold"
                                    >
                                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                        {error}
                                    </motion.div>
                                )}

                                {success && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 text-emerald-400 text-sm font-bold"
                                    >
                                        <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                                        Identity Anchored! Redirecting...
                                    </motion.div>
                                )}

                                <Button 
                                    type="submit"
                                    disabled={loading || success || !department || !rollNo}
                                    className="w-full h-14 rounded-xl bg-projecxy-blue hover:bg-projecxy-blue/90 text-white font-black uppercase tracking-[0.1em] text-xs shadow-lg shadow-projecxy-blue/20 transition-all active:scale-[0.98]"
                                >
                                    {loading ? (
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>Syncing Identity...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <span>Enter Workspace</span>
                                            <ChevronRight className="w-4 h-4" />
                                        </div>
                                    )}
                                </Button>
                            </motion.div>
                        </AnimatePresence>
                    </form>

                    {/* ✨ DECORATIVE GLOW */}
                    <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-projecxy-blue/5 blur-[100px] rounded-full pointer-events-none" />
                </Card>

                {/* 🏷️ FOOTER HINT */}
                <p className="mt-8 text-center text-projecxy-secondary text-[10px] font-bold uppercase tracking-[0.2em] opacity-50">
                    Projecxy Security Protocol v4.0.2
                </p>
            </motion.div>
        </div>
    );
};

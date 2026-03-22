import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Rocket, Loader2, ChevronRight, 
  Building2, Hash, AlertCircle, CheckCircle2
} from 'lucide-react';
import { supabase } from '../services/supabase';
import { useAuth } from '../hooks/useAuth';
import { Button, Card, cn } from '../components/ui';

export const OnboardingPage = () => {
    const navigate = useNavigate();
    const { user, profile, refreshProfile } = useAuth();
    
    const [department, setDepartment] = useState('');
    const [rollNo, setRollNo] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [validationError, setValidationError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (profile?.onboarding_completed) {
            navigate('/dashboard');
        }
    }, [profile, navigate]);

    // ✨ REAL-TIME VALIDATION
    useEffect(() => {
        if (!rollNo) {
            setValidationError(null);
            return;
        }

        const rollRegex = /^[A-Za-z0-9-]+$/;
        if (!rollRegex.test(rollNo)) {
            setValidationError("Only letters, numbers, and dashes allowed");
        } else if (rollNo.length < 5) {
            setValidationError("Minimum 5 characters required");
        } else if (rollNo.length > 20) {
            setValidationError("Maximum 20 characters allowed");
        } else if (/\s/.test(rollNo)) {
            setValidationError("Spaces are not allowed");
        } else {
            setValidationError(null);
        }
    }, [rollNo]);

    const checkUniqueness = async (number) => {
        const { data } = await supabase
            .from('profiles')
            .select('id')
            .eq('roll_no', number.toUpperCase())
            .single();
        return !data; 
    };

    const handleComplete = async (e) => {
        e.preventDefault();
        if (validationError) return;

        setLoading(true);
        setError(null);

        try {
            const isUnique = await checkUniqueness(rollNo);
            if (!isUnique) {
                throw new Error("This Roll Number is already registered");
            }

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
            setTimeout(() => navigate('/dashboard'), 1500);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-projecxy-dark flex items-center justify-center p-6 selection:bg-projecxy-blue/30 font-sans relative">
            
            {/* 🪐 CLEAN BACKGROUND */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-projecxy-blue/10 via-transparent to-transparent" />
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="mb-10 text-center">
                    <div className="w-16 h-16 bg-projecxy-blue/10 rounded-2xl flex items-center justify-center text-projecxy-blue mx-auto mb-6 border border-projecxy-blue/20">
                        <Rocket className="w-8 h-8 fill-projecxy-blue/10" />
                    </div>
                    <h1 className="text-2xl font-black text-white tracking-tight mb-2 uppercase">Complete Profile</h1>
                    <p className="text-projecxy-secondary text-sm font-medium px-4">Initialize your institutional identity to unlock the workspace.</p>
                </div>

                <Card className="bg-projecxy-card border-white/[0.06] p-8 md:p-10 rounded-[32px] shadow-2xl relative overflow-hidden">
                    <form onSubmit={handleComplete} className="space-y-6">
                        <div className="space-y-5">
                            {/* Department Field */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-projecxy-secondary uppercase tracking-widest pl-1">Department</label>
                                <div className="relative group">
                                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-projecxy-secondary group-focus-within:text-projecxy-blue transition-colors" />
                                    <input 
                                        required
                                        value={department}
                                        onChange={(e) => setDepartment(e.target.value)}
                                        placeholder="Engineering / Arts / Science"
                                        className="w-full h-12 bg-white/[0.03] border border-white/[0.08] rounded-xl pl-12 pr-4 text-white focus:ring-1 focus:ring-projecxy-blue focus:border-projecxy-blue outline-none transition-all placeholder:text-projecxy-secondary/50 text-sm"
                                    />
                                </div>
                            </div>

                            {/* Roll Number Field */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-projecxy-secondary uppercase tracking-widest pl-1">Roll Number</label>
                                <div className="relative group">
                                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-projecxy-secondary group-focus-within:text-projecxy-blue transition-colors" />
                                    <input 
                                        required
                                        value={rollNo}
                                        onChange={(e) => setRollNo(e.target.value)}
                                        placeholder="e.g. 2024-CSE-01"
                                        className={cn(
                                            "w-full h-12 bg-white/[0.03] border rounded-xl pl-12 pr-4 text-white focus:ring-1 outline-none transition-all placeholder:text-projecxy-secondary/50 text-sm",
                                            validationError ? "border-red-500/50 focus:ring-red-500/30" : "border-white/[0.08] focus:ring-projecxy-blue focus:border-projecxy-blue"
                                        )}
                                    />
                                </div>
                                <AnimatePresence>
                                    {validationError && (
                                        <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-[10px] text-red-400 font-bold mt-1 pl-1">
                                            {validationError}
                                        </motion.p>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-xs font-bold">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 text-emerald-400 text-xs font-bold">
                                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                                Profile updated. Entering workspace...
                            </div>
                        )}

                        <button 
                            type="submit"
                            disabled={loading || success || !!validationError || !department || !rollNo}
                            className={cn(
                                "w-full h-12 rounded-xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2",
                                (loading || success || !!validationError || !department || !rollNo)
                                    ? "bg-white/10 text-white/40 cursor-not-allowed" 
                                    : "bg-projecxy-blue text-white hover:brightness-110 active:scale-[0.98] shadow-lg shadow-projecxy-blue/20"
                            )}
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Complete Onboarding</span>}
                            {!loading && <ChevronRight className="w-4 h-4" />}
                        </button>
                    </form>
                </Card>

                <p className="mt-8 text-center text-projecxy-secondary text-[10px] font-bold uppercase tracking-[0.3em] opacity-40">
                    Projecxy Identity Gateway
                </p>
            </motion.div>
        </div>
    );
};

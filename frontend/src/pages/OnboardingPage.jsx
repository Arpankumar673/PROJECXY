import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Rocket, Loader2, ChevronRight, 
  Building2, Hash, AlertCircle, CheckCircle2,
  ChevronDown, GraduationCap
} from 'lucide-react';
import { supabase } from '../services/supabase';
import { useAuth } from '../hooks/useAuth';
import { useUser } from '../context/UserContext';
import { Button, Card, cn } from '../components/ui';

export const OnboardingPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { profile, refreshProfile } = useUser();
    
    const [department, setDepartment] = useState('');
    const [branch, setBranch] = useState('');
    const [rollNo, setRollNo] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const departments = [
        "Computer Science",
        "IT",
        "Mechanical",
        "Civil",
        "Biotech",
        "Agriculture"
    ];

    const csBranches = [
        "AI ML",
        "Cyber Security",
        "CSE Core",
        "Data Science"
    ];

    useEffect(() => {
        if (profile?.onboarding_completed) {
            navigate('/dashboard');
        }
    }, [profile, navigate]);

    // Cleanup branch if department changes
    useEffect(() => {
        if (department !== "Computer Science") {
            setBranch('');
        }
    }, [department]);

    const checkUniqueness = async (number) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('roll_no')
                .eq('roll_no', number.toUpperCase().trim())
                .maybeSingle();
            
            if (error) throw error;
            return !data; 
        } catch (err) {
            console.error("Check uniqueness failure:", err);
            return true; 
        }
    };

    const handleOnboarding = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);

        const userId = user?.id;
        if (!userId) {
            alert("Protocol Failure: Identity Hub missing. Please re-login.");
            setLoading(false);
            return;
        }

        console.log("Onboarding Synchro-Matrix: COMMENCING...");
        
        let pulseInterval = setInterval(() => {
            console.log("Watchdog Pulse: Still waiting for PostgreSQL response...");
        }, 2000);

        try {
            const profileData = {
                id: userId,
                full_name: user?.user_metadata?.full_name || user?.user_metadata?.name || "Hub Innovator",
                department,
                branch: branch || null,
                roll_number: rollNo.toUpperCase().trim(),
                onboarding_completed: true,
                updated_at: new Date().toISOString()
            };

            console.log("PostgreSQL Hub Sync: Initiating Split-Sync Strategy...");

            // 1. ATTEMPT INSERT FIRST (Identity Anchor)
            const { error: insertError } = await supabase
                .from("profiles")
                .insert([profileData]);

            if (insertError && insertError.code === '23505') {
                console.log("Identity Already Anchored. Executing Matrix Update...");
                // 2. IF EXISTS, PERFORM UPDATE
                const { error: updateError } = await supabase
                    .from("profiles")
                    .update(profileData)
                    .eq('id', userId);

                if (updateError) throw updateError;
            } else if (insertError) {
                throw insertError;
            }

            console.log("Anchoring Successful. Terminating Pulse.");
            clearInterval(pulseInterval);

            // Success Handshake
            await refreshProfile();
            window.location.href = "/dashboard";

        } catch (err) {
            clearInterval(pulseInterval);
            console.error("Critical Synchronization Failure:", err);
            alert("Hub Synchronization Failed: " + (err.message || "Unknown connectivity error"));
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="h-screen bg-projecxy-bg flex flex-col items-center justify-center space-y-6">
                <Loader2 className="w-16 h-16 animate-spin text-projecxy-blue/20" />
                <p className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-300">Synchronizing Institutional Registry...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-projecxy-bg flex items-center justify-center p-6 selection:bg-blue-100 selection:text-projecxy-blue">
            
            {/* 🛸 DECORATIVE BACKGROUND */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
                <div className="absolute top-0 right-1/4 w-[60%] h-[60%] bg-blue-100 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 left-1/4 w-[60%] h-[60%] bg-indigo-50 blur-[120px] rounded-full" />
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-xl relative z-10"
            >
                <div className="mb-12 text-center space-y-3">
                    <div className="w-20 h-20 bg-blue-50 text-projecxy-blue rounded-[32px] flex items-center justify-center border border-blue-100 shadow-soft mx-auto group">
                        <Rocket className="w-10 h-10 group-hover:-translate-y-1 transition-transform" />
                    </div>
                    <h1 className="text-4xl font-black text-projecxy-text tracking-tighter uppercase">Initialize Identity</h1>
                    <p className="text-projecxy-secondary font-bold text-sm uppercase tracking-widest opacity-60">Campus OS Protocol Hub</p>
                </div>

                <Card className="p-10 md:p-14 bg-white rounded-[48px] shadow-soft border border-gray-100 overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-12 transition-transform duration-1000"><Building2 className="w-64 h-64" /></div>
                    
                    <form onSubmit={handleOnboarding} className="space-y-8 relative z-10">
                        <div className="space-y-6">
                            {/* Department Selection */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase text-projecxy-secondary tracking-[0.2em] pl-2">Select Department</label>
                                <div className="relative">
                                    <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                                    <select 
                                        required
                                        value={department}
                                        onChange={(e) => setDepartment(e.target.value)}
                                        className="w-full h-16 bg-gray-50 border border-transparent rounded-2xl pl-14 pr-12 text-projecxy-text font-bold focus:bg-white focus:border-projecxy-blue focus:ring-4 focus:ring-blue-50 outline-none transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="" disabled>Choose Department</option>
                                        {departments.map(dept => (
                                            <option key={dept} value={dept}>{dept}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 pointer-events-none" />
                                </div>
                            </div>

                            {/* Conditional Branch Selection */}
                            <AnimatePresence>
                                {department === "Computer Science" && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-3 overflow-hidden"
                                    >
                                        <label className="text-[10px] font-black uppercase text-projecxy-secondary tracking-[0.2em] pl-2">Branch Specialization</label>
                                        <div className="relative">
                                            <GraduationCap className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                                            <select 
                                                required
                                                value={branch}
                                                onChange={(e) => setBranch(e.target.value)}
                                                className="w-full h-16 bg-gray-50 border border-transparent rounded-2xl pl-14 pr-12 text-projecxy-text font-bold focus:bg-white focus:border-projecxy-blue focus:ring-4 focus:ring-blue-50 outline-none transition-all appearance-none cursor-pointer"
                                            >
                                                <option value="" disabled>Select Branch</option>
                                                {csBranches.map(b => (
                                                    <option key={b} value={b}>{b}</option>
                                                ))}
                                            </select>
                                            <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 pointer-events-none" />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Roll Number Input */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase text-projecxy-secondary tracking-[0.2em] pl-2">Institution Roll Number</label>
                                <div className="relative group/input">
                                    <Hash className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within/input:text-projecxy-blue transition-colors" />
                                    <input 
                                        required
                                        value={rollNo}
                                        onChange={(e) => setRollNo(e.target.value)}
                                        placeholder="e.g. 2024-CSE-001"
                                        className={cn(
                                            "w-full h-16 bg-gray-50 border rounded-2xl pl-14 pr-6 text-projecxy-text font-bold outline-none transition-all placeholder:text-gray-300 focus:bg-white uppercase",
                                            error ? "border-red-500/50 focus:ring-red-50" : "border-transparent focus:border-projecxy-blue focus:ring-4 focus:ring-blue-50"
                                        )}
                                    />
                                </div>
                                {error && (
                                    <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-[10px] text-red-500 font-bold px-2 uppercase tracking-widest flex items-center gap-2">
                                        <AlertCircle className="w-3.5 h-3.5" />
                                        {error}
                                    </motion.p>
                                )}
                            </div>
                        </div>

                        <div className="pt-4">
                            {success ? (
                                <div className="w-full h-16 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center gap-3 font-black uppercase tracking-widest text-xs">
                                    <CheckCircle2 className="w-6 h-6" /> Anchoring Successful!
                                </div>
                            ) : (
                                <Button 
                                    size="lg" 
                                    type="submit"
                                    disabled={loading || !department || !rollNo || (department === "Computer Science" && !branch)}
                                    className="w-full h-18 rounded-3xl text-lg font-black uppercase tracking-[0.15em] shadow-xl shadow-blue-100 flex items-center justify-center gap-3"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-6 h-6 animate-spin" />
                                            <span>Setting up...</span>
                                        </>
                                    ) : (
                                        <>
                                            Complete Onboarding <ChevronRight className="w-6 h-6" />
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                    </form>
                </Card>

                <div className="mt-12 text-center opacity-40">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Innovation Protocol Secured &copy; 2026</p>
                </div>
            </motion.div>
        </div>
    );
};

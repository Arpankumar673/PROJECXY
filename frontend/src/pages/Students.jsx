import React, { useState, useEffect } from 'react';
import { 
  Users, Search, Activity, 
  Loader2, Rocket, Globe, 
  Target, GraduationCap 
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../services/supabase';
import { StudentCard } from '../components/students/StudentCard';
import { StudentSearch } from '../components/students/StudentSearch';
import { Card, Button, cn } from '../components/ui';

export const StudentsPage = () => {
    const { user } = useAuth();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        department: '',
        skill: ''
    });

    const fetchStudents = async () => {
        if (!user) return;
        setLoading(true);
        try {
            // 🔍 GLOBAL DISCOVERY QUERY
            let query = supabase
                .from('profiles')
                .select(`
                    id, 
                    full_name, 
                    avatar_url, 
                    department, 
                    branch, 
                    skills, 
                    role, 
                    onboarding_completed
                `)
                .neq('id', user.id) // Exclude self
                .order('full_name', { ascending: true });

            if (filters.department) {
                query = query.eq('department', filters.department);
            }

            const { data, error } = await query;
            if (error) throw error;

            // Manual skill filtering for now (or use Supabase pg_trgm for complex search)
            let filteredResults = data || [];
            
            if (searchQuery) {
                const q = searchQuery.toLowerCase();
                filteredResults = filteredResults.filter(s => 
                    s.full_name?.toLowerCase().includes(q) || 
                    s.department?.toLowerCase().includes(q) ||
                    (s.skills || []).some(skill => skill.toLowerCase().includes(q))
                );
            }

            if (filters.skill) {
                filteredResults = filteredResults.filter(s => 
                    (s.skills || []).some(skill => skill === filters.skill)
                );
            }

            setStudents(filteredResults);
        } catch (err) {
            console.error("Discovery Sequence Failure:", err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchStudents();
        }, 300); // Debounce
        return () => clearTimeout(timer);
    }, [user, searchQuery, filters]);

    const handleFilterChange = (type, value) => {
        setFilters(prev => ({ ...prev, [type]: value }));
    };

    return (
        <div className="max-w-[1600px] mx-auto py-10 px-4 md:px-10 lg:px-20 space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            
            {/* 🛰️ DISCOVERY TERMINAL */}
            <StudentSearch 
                onSearch={setSearchQuery}
                onFilter={handleFilterChange}
                filters={filters}
                loading={loading}
            />

            {/* 📋 RESULTS HUB */}
            <div className="space-y-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
                    <div className="space-y-1">
                        <h2 className="text-4xl font-black text-projecxy-text tracking-tighter uppercase leading-none">Innovation Partners</h2>
                        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-projecxy-secondary opacity-50 pl-1">Legacy Verification Index: Current Sector</p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                       <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">Hub Count: <span className="text-projecxy-blue">{students.length}</span></p>
                       <div className="h-6 w-px bg-gray-100" />
                       <Button size="sm" variant="outline" className="h-10 rounded-xl text-[9px] uppercase tracking-widest border-gray-100 px-6">Export Matrix</Button>
                    </div>
                </div>

                {loading && students.length === 0 ? (
                    <div className="py-40 flex flex-col items-center justify-center space-y-6">
                        <div className="relative">
                            <div className="absolute inset-0 bg-projecxy-blue blur-3xl opacity-10 animate-pulse" />
                            <Loader2 className="w-16 h-16 animate-spin text-projecxy-blue/20 relative z-10" />
                        </div>
                        <p className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-300">Synchronizing Global Hub Index...</p>
                    </div>
                ) : students.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                        {students.map(student => (
                            <StudentCard key={student.id} student={student} />
                        ))}
                    </div>
                ) : (
                    <Card className="p-32 rounded-[56px] border-none shadow-soft text-center bg-white space-y-6">
                         <div className="w-24 h-24 bg-gray-50 text-gray-200 rounded-[32px] flex items-center justify-center mx-auto shadow-inner border border-gray-100">
                            <Users className="w-10 h-10" />
                         </div>
                         <div className="space-y-2">
                             <h3 className="text-2xl font-black text-projecxy-text tracking-tighter uppercase leading-none">Identity Matrix Empty</h3>
                             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">No student profiles discovered matching your query protocol.</p>
                         </div>
                         <Button onClick={() => { setSearchQuery(''); setFilters({ department: '', skill: '' }); }} className="h-14 rounded-2xl px-10 text-[10px] font-black uppercase tracking-widest bg-gray-100 hover:bg-gray-200 text-gray-500 shadow-none">Reset Protocol</Button>
                    </Card>
                )}
            </div>

            <div className="text-center pt-20 pb-32 opacity-20">
                <div className="inline-flex flex-col items-center gap-6">
                   <div className="w-16 h-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent rounded-full" />
                   <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400">Hub Discovery v1.0.12 Synchronized</p>
                      <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">PostgreSQL Identity Ledger Hub</p>
                   </div>
                </div>
            </div>
        </div>
    );
};

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Rocket, Loader2, Save, Users, Hash, Briefcase } from 'lucide-react';
import { Button, Card, Input, cn } from '../ui';
import { supabase } from '../../services/supabase';

export const CreateProjectModal = ({ isOpen, onClose, userId, onCreated }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tech_stack: '',
    max_members: 5,
    department: 'Computer Science',
    status: 'open'
  });

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert([{
          title: formData.title,
          description: formData.description,
          tech_stack: formData.tech_stack.split(',').map(s => s.trim()).filter(Boolean),
          created_by: userId,
          department: formData.department,
          max_members: formData.max_members,
          status: formData.status
        }])
        .select()
        .single();

      if (projectError) throw projectError;

      // Automatically add creator as first member
      const { error: memberError } = await supabase
        .from('project_members')
        .insert([{ project_id: project.id, user_id: userId }]);

      if (memberError) console.error("Initial Sync Error:", memberError.message);

      onCreated?.();
      onClose();
    } catch (err) {
      console.error("Transmission Error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-projecxy-text/40 backdrop-blur-md"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto no-scrollbar"
          >
            <Card className="p-8 md:p-12 rounded-[48px] border-none shadow-2xl bg-white space-y-10">
              
              <div className="flex items-center justify-between pl-2">
                <div className="space-y-1">
                  <h2 className="text-3xl font-black text-projecxy-text tracking-tighter uppercase leading-none">Initiate Hub</h2>
                  <p className="text-[10px] font-black uppercase tracking-[0.5em] text-projecxy-blue pl-px">New Institutional Project</p>
                </div>
                <button onClick={onClose} className="p-3 bg-gray-50 text-gray-400 hover:text-projecxy-blue rounded-2xl transition-all hover:rotate-90">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-10">
                <Input 
                  label="Project Title Mapping" 
                  value={formData.title}
                  onChange={(e) => setFormData(d => ({ ...d, title: e.target.value }))}
                  placeholder="e.g. Decentralized Identity Matrix"
                  required
                />
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-projecxy-secondary opacity-50 pl-1">Project Abstract</label>
                  <textarea 
                    className="w-full h-32 px-5 py-4 bg-white border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-projecxy-blue outline-none transition-all shadow-soft text-sm font-medium resize-none placeholder:text-gray-300 placeholder:font-medium"
                    value={formData.description}
                    onChange={(e) => setFormData(d => ({ ...d, description: e.target.value }))}
                    placeholder="Brief architectural overview of the innovation..."
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <Input 
                    label="Core Stack (Comma Separated)" 
                    value={formData.tech_stack}
                    onChange={(e) => setFormData(d => ({ ...d, tech_stack: e.target.value }))}
                    placeholder="React, Supabase, AI..."
                  />
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-projecxy-secondary opacity-50 pl-1">Target Personnel</label>
                    <select 
                      className="w-full h-14 px-4 bg-white border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-projecxy-blue outline-none transition-all shadow-soft text-sm font-medium"
                      value={formData.max_members}
                      onChange={(e) => setFormData(d => ({ ...d, max_members: Number(e.target.value) }))}
                    >
                      {[2, 3, 4, 5, 8, 10].map(m => (
                        <option key={m} value={m}>{m} Members</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-projecxy-secondary opacity-50 pl-1">Institutional Sector</label>
                    <select 
                      className="w-full h-14 px-4 bg-white border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-projecxy-blue outline-none transition-all shadow-soft text-sm font-medium"
                      value={formData.department}
                      onChange={(e) => setFormData(d => ({ ...d, department: e.target.value }))}
                    >
                      {['Computer Science', 'IT', 'Mechanical', 'Biotech', 'Electronics'].map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-projecxy-secondary opacity-50 pl-1">Sync Status</label>
                    <div className="flex bg-gray-50 p-1.5 rounded-2xl gap-1">
                      {['open', 'ongoing'].map(s => (
                        <button 
                          key={s}
                          type="button"
                          onClick={() => setFormData(d => ({ ...d, status: s }))}
                          className={cn(
                            "flex-1 h-11 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                            formData.status === s ? "bg-white text-projecxy-blue shadow-soft" : "text-gray-400 hover:text-projecxy-text"
                          )}
                        >
                          {s} hub
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <Button 
                    type="submit" 
                    size="lg" 
                    disabled={loading}
                    className="w-full h-16 rounded-[24px] uppercase tracking-[0.3em] text-[10px] font-black group transition-all"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : (
                      <span className="flex items-center justify-center gap-3">
                        <Rocket className="w-5 h-5 group-hover:scale-110 group-hover:fill-current transition-all" /> Synchronize Innovation Hub
                      </span>
                    )}
                  </Button>
                </div>
              </form>

              <div className="pt-10 text-center opacity-20">
                 <p className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-400">Institutional Ledger Verified @ 2026</p>
              </div>

            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

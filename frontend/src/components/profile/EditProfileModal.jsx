import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Save, User, GraduationCap, 
  Briefcase, Camera, Loader2, 
  CheckCircle2, AlertCircle, Hash
} from 'lucide-react';
import { Button, Card, Input, cn } from '../ui';
import { SkillsInput } from './SkillsInput';
import { SocialLinks } from './SocialLinks';
import { supabase } from '../../services/supabase';
import { useUser } from '../../context/UserContext';

export const EditProfileModal = ({ isOpen, onClose, profile, onUpdate }) => {
  const { setProfile } = useUser();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    department: profile?.department || '',
    branch: profile?.branch || '',
    skills: profile?.skills || [],
    role: profile?.role || 'Senior Contributor',
    avatar_url: profile?.avatar_url || '',
    social: {
        github_url: profile?.github_url || '',
        linkedin_url: profile?.linkedin_url || '',
        twitter_url: profile?.twitter_url || '',
        portfolio_url: profile?.portfolio_url || ''
    }
  });

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${profile.id}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, avatar_url: publicUrl }));
    } catch (err) {
      console.error("Transmission Error:", err.message);
      setError("Avatar sync failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated session discovered");

      const updatePayload = {
        full_name: formData.full_name,
        department: formData.department,
        branch: formData.branch,
        skills: formData.skills,
        avatar_url: formData.avatar_url,
        github_url: formData.social.github_url,
        linkedin_url: formData.social.linkedin_url,
        twitter_url: formData.social.twitter_url,
        portfolio_url: formData.social.portfolio_url,
        onboarding_completed: true,
        updated_at: new Date().toISOString()
      };

      const { error: updateError } = await supabase
        .from('profiles')
        .update(updatePayload)
        .eq('id', user.id);

      if (updateError) throw updateError;

      // 🔥 Update Global State
      setProfile(prev => ({ ...prev, ...updatePayload }));

      setSuccess(true);
      setTimeout(() => {
        onUpdate();
        onClose();
        setSuccess(false);
      }, 1500);
    } catch (err) {
      setError(err.message);
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
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto no-scrollbar"
          >
            <Card className="p-8 md:p-12 rounded-[48px] border-none shadow-2xl bg-white space-y-10">
              
              <div className="flex items-center justify-between pl-2">
                <div className="space-y-1">
                  <h2 className="text-3xl font-black text-projecxy-text tracking-tighter uppercase leading-none">Modify Core Core</h2>
                  <p className="text-[10px] font-black uppercase tracking-[0.5em] text-projecxy-blue pl-px">Pilot Profile Synchronization</p>
                </div>
                <button onClick={onClose} className="p-3 bg-gray-50 text-gray-400 hover:text-projecxy-blue rounded-2xl transition-all hover:rotate-90">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-10">
                
                {/* 🛡️ AVATAR SYNC */}
                <div className="flex flex-col items-center gap-6 group">
                   <div className="relative">
                      <div className="absolute inset-0 bg-projecxy-blue blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-700" />
                      <img 
                        src={formData.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.full_name}`} 
                        className="w-32 h-32 rounded-[40px] object-cover border-4 border-white shadow-soft relative z-10 transition-transform duration-500 group-hover:scale-105" 
                        alt="Profile" 
                      />
                      <button 
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute -bottom-2 -right-2 w-12 h-12 bg-projecxy-blue text-white rounded-2xl shadow-xl flex items-center justify-center border-4 border-white z-20 hover:scale-110 active:scale-95 transition-all"
                      >
                        <Camera className="w-5 h-5 mx-auto" />
                      </button>
                      <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} className="hidden" accept="image/*" />
                   </div>
                   <p className="text-[9px] font-black uppercase tracking-widest text-gray-300">Synchronize Identity Visualization</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <Input 
                    label="Full Name Protocol" 
                    value={formData.full_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                    placeholder="Innovator Name"
                    required
                  />
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-projecxy-secondary opacity-50 pl-1">Department</label>
                    <select 
                      className="w-full h-14 px-4 bg-white border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-projecxy-blue outline-none transition-all shadow-soft text-sm font-medium"
                      value={formData.department}
                      onChange={(e) => setFormData(p => ({ ...p, department: e.target.value }))}
                    >
                      {['Computer Science', 'IT', 'Mechanical', 'Civil', 'Biotech', 'Agriculture'].map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                   <Input 
                    label="Branch (Option)" 
                    value={formData.branch}
                    onChange={(e) => setFormData(prev => ({ ...prev, branch: e.target.value }))}
                    placeholder="e.g. AI ML"
                   />
                   <Input 
                    label="Current Role" 
                    value={formData.role}
                    disabled
                    placeholder="Senior Architect"
                    className="opacity-50 cursor-not-allowed bg-gray-50 border-transparent shadow-none"
                   />
                </div>

                {/* 🛠️ SKILLS INTEGRATION */}
                <SkillsInput 
                  skills={formData.skills} 
                  onChange={(newSkills) => setFormData(p => ({ ...p, skills: newSkills }))} 
                />

                {/* 🔗 DIGITAL CONNECTIONS */}
                <div className="space-y-6">
                   <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-projecxy-blue opacity-50 px-2 pb-2 border-b border-gray-50 flex items-center gap-2">
                    <Hash className="w-3.5 h-3.5" /> Social Communication Hub
                   </h3>
                   <SocialLinks 
                    editable 
                    links={formData.social} 
                    onChange={(newSocial) => setFormData(p => ({ ...p, social: newSocial }))} 
                   />
                </div>

                {/* 🌪️ STATUS TRANSITIONS */}
                {success && (
                  <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex items-center gap-3 p-6 bg-emerald-50 text-emerald-600 rounded-3xl border border-emerald-100 shadow-sm">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                    <p className="text-xs font-black uppercase tracking-widest leading-none">Profile Matrix Synchronized Successfully</p>
                  </motion.div>
                )}

                {error && (
                  <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex items-center gap-3 p-6 bg-red-50 text-red-500 rounded-3xl border border-red-100 shadow-sm">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-xs font-black uppercase tracking-widest leading-none">Transmission Error: {error}</p>
                  </motion.div>
                )}

                <div className="pt-6 flex flex-col md:flex-row gap-4">
                  <Button 
                    type="submit" 
                    size="lg" 
                    disabled={loading || success}
                    className="flex-1 h-16 rounded-[24px] uppercase tracking-[0.3em] text-[10px] font-black group transition-all"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : (
                      <span className="flex items-center justify-center gap-3">
                        <Save className="w-5 h-5 group-hover:scale-110 transition-transform" /> Sync Profile Change
                      </span>
                    )}
                  </Button>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="lg" 
                    onClick={onClose}
                    className="h-16 rounded-[24px] uppercase tracking-[0.3em] text-[10px] font-black opacity-40 hover:opacity-100"
                  >
                    Abort Adjustment
                  </Button>
                </div>

              </form>

              <div className="pt-10 text-center opacity-20 group-hover:opacity-40 transition-opacity">
                 <p className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-400">Institutional Ledger Verified &copy; 2026</p>
              </div>

            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

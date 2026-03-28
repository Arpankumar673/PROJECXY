import { motion, AnimatePresence } from 'framer-motion'
import { Star, ShieldCheck, MessageSquare, Search, Filter, Calendar, Clock, ArrowRight, Shield, Award, Users, Plus, X, CheckCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { clsx } from 'clsx'

// Mock Data for display
const initialMentors = [
  { id: '1', name: 'Dr. Sarah Wilson', expertise: 'Deep Learning / AI Research', exp: '15+ Years', rating: 4.9, reviews: 128, price: '₹2,500', university: 'Stanford University', verified: true, bio: 'Lead Scientist at Google DeepMind and specialized in neural architecture.' },
  { id: '2', name: 'Arnav Singh', expertise: 'Product Management / Dev', exp: '8 Years', rating: 4.8, reviews: 92, price: 'Free', university: 'MIT Alumnus', verified: true, bio: 'Helped 200+ students launch their first production-ready projects.' },
  { id: '3', name: 'Mila Kunis', expertise: 'Aerospace / Robotics', exp: '10 Years', rating: 5.0, reviews: 45, price: '₹4,000', university: 'Aerospace Lead @ NASA', verified: true, bio: 'Currently optimizing autonomous flight patterns for the next-gen drone swarms.' },
]

const mySessions = [
  { id: 101, mentorName: 'Dr. Sarah Wilson', topic: 'AI Project Review', date: 'Tomorrow', time: '10:30 AM', status: 'Confirmed' },
]

const fields = ["All Fields", "Computer Science", "Management", "Aerospace", "Biotechnology", "Electronics"]
const prices = ["All Prices", "Free", "Under ₹1000", "₹1000 - ₹3000", "Over ₹3000"]

export default function Mentorship() {
  const { user, profile } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedField, setSelectedField] = useState('All Fields')
  const [selectedPrice, setSelectedPrice] = useState('All Prices')
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false)
  const [isMentor, setIsMentor] = useState(false)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  // Form State
  const [formData, setFormData] = useState({
    expertise: '',
    experience: '',
    price: '',
    bio: ''
  })

  useEffect(() => {
    async function checkMentorStatus() {
      if (!user) return
      const { data } = await supabase.from('mentors').select('id').eq('id', user.id).single()
      if (data) setIsMentor(true)
    }
    checkMentorStatus()
  }, [user])

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setLoading(true)

    const { error } = await supabase
      .from('mentors')
      .insert({
        id: user.id,
        expertise: formData.expertise,
        experience: formData.experience,
        price: formData.price,
        bio: formData.bio
      })

    setLoading(false)
    if (!error) {
      setIsMentor(true)
      setIsApplyModalOpen(false)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } else {
      console.error('Apply error:', error)
    }
  }

  const filteredMentors = initialMentors.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         m.expertise.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesField = selectedField === 'All Fields' || m.expertise.includes(selectedField)
    return matchesSearch && matchesField
  })

  return (
    <div className="max-w-[1128px] mx-auto px-4 lg:px-0 py-8 space-y-12 animate-in fade-in duration-700 relative">
      
      {/* 1. Intro Section & Become a Mentor Button */}
      <section className="text-center space-y-3 py-4 relative">
        <div className="absolute top-0 right-0">
           <button 
             disabled={isMentor}
             onClick={() => setIsApplyModalOpen(true)}
             className={clsx(
               "h-10 px-6 rounded-full font-black text-xs uppercase tracking-widest transition-all",
               isMentor 
                 ? "bg-green-50 text-green-600 border border-green-200 cursor-default flex items-center gap-2" 
                 : "bg-[#0A66C2] text-white hover:bg-[#004182] shadow-lg shadow-[#0A66C2]/20"
             )}
           >
             {isMentor ? <><CheckCircle size={14} /> You are a Mentor</> : "Become a Mentor"}
           </button>
        </div>

        <motion.div 
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#EDF3F8] text-[#0A66C2] rounded-full text-[10px] font-black uppercase tracking-widest"
        >
           <Award size={14} /> Expert Guidance
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-black text-black tracking-tight uppercase">Learn from Experts</h1>
        <p className="text-[#666666] text-lg font-medium max-w-2xl mx-auto">Connect with industry leaders and academic scholars to accelerate your project growth.</p>
      </section>

      {/* Success Notification */}
      <AnimatePresence>
        {success && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full shadow-2xl z-[100] flex items-center gap-3 font-black text-xs uppercase tracking-widest"
          >
            <CheckCircle size={18} /> Successfully joined the Mentor Network!
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. My Sessions Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
           <Calendar size={20} className="text-[#0A66C2]" />
           <h2 className="text-xl font-bold text-black tracking-tight tracking-tight">Your Upcoming Sessions</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {mySessions.map((session) => (
             <div key={session.id} className="li-card p-5 bg-white border-[#D9E2ED] shadow-sm flex items-center justify-between border-l-4 border-l-[#0A66C2]">
               <div className="space-y-1">
                 <h3 className="text-[15px] font-extrabold text-black tracking-tight leading-tight">{session.topic}</h3>
                 <p className="text-xs text-[#666666] font-medium">with {session.mentorName}</p>
                 <div className="flex items-center gap-3 pt-1">
                    <span className="flex items-center gap-1 text-[10px] font-bold text-[#0A66C2] uppercase"><Clock size={12} /> {session.date}, {session.time}</span>
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 bg-[#EDF3F8] text-[#0A66C2] rounded-sm">{session.status}</span>
                 </div>
               </div>
               <button className="text-[#666666] hover:text-[#0A66C2] transition-colors"><MessageSquare size={20} /></button>
             </div>
           ))}
        </div>
      </section>

      {/* 3. Top Search + Filters */}
      <section className="li-card p-4 bg-white border-[#D9E2ED] shadow-md space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-grow group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#666666] group-focus-within:text-[#0A66C2]" />
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search mentors by name or expertise..." 
              className="w-full h-12 pl-10 pr-4 bg-[#F3F6F9] border-none rounded-lg text-sm font-medium focus:ring-1 focus:ring-[#0A66C2] focus:bg-white outline-none transition-all placeholder:text-[#666666]/60"
            />
          </div>
          <div className="flex gap-2">
             <select 
               value={selectedField}
               onChange={(e) => setSelectedField(e.target.value)}
               className="h-12 px-4 bg-[#F3F6F9] border-none rounded-lg text-sm font-bold text-[#666666] focus:ring-1 focus:ring-[#0A66C2] outline-none cursor-pointer hover:bg-[#EBEBEB] transition-colors"
             >
               {fields.map(f => <option key={f} value={f}>{f}</option>)}
             </select>
             <select 
               value={selectedPrice}
               onChange={(e) => setSelectedPrice(e.target.value)}
               className="h-12 px-4 bg-[#F3F6F9] border-none rounded-lg text-sm font-bold text-[#666666] focus:ring-1 focus:ring-[#0A66C2] outline-none cursor-pointer hover:bg-[#EBEBEB] transition-colors"
             >
               {prices.map(p => <option key={p} value={p}>{p}</option>)}
             </select>
          </div>
        </div>
      </section>

      {/* 4. Mentor Catalog */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-2">
              <Users size={20} className="text-[#0A66C2]" />
              <h2 className="text-xl font-bold text-black tracking-tight">Find your Guide</h2>
           </div>
           <span className="text-xs font-black text-[#666666] bg-[#F3F2EF] px-3 py-1 rounded-full uppercase tracking-[0.1em]">{filteredMentors.length} found</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredMentors.map((m) => (
              <motion.div 
                key={m.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="li-card p-6 bg-white border-[#D9E2ED] shadow-sm hover:shadow-lg transition-all group relative overflow-hidden flex flex-col h-full rounded-2xl"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                       <div className="h-14 w-14 rounded-full bg-neutral-100 flex items-center justify-center text-xl font-black text-[#666666] border border-[#D9E2ED] group-hover:bg-[#EDF3F8] group-hover:text-[#0A66C2] transition-all">
                          {m.name[0]}
                       </div>
                       <div>
                          <div className="flex items-center gap-1.5">
                             <h3 className="text-lg font-extrabold text-black group-hover:text-[#0A66C2] transition-colors">{m.name}</h3>
                             {m.verified && <ShieldCheck size={16} className="text-[#0A66C2]" />}
                          </div>
                          <p className="text-xs font-black text-[#0A66C2] uppercase tracking-tighter leading-none">{m.expertise}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-xl font-black text-black leading-none">{m.price}</p>
                       <p className="text-[9px] font-black text-[#666666] uppercase tracking-widest mt-1">per session</p>
                    </div>
                  </div>

                  <p className="text-sm text-[#666666] font-medium leading-relaxed line-clamp-2">{m.bio}</p>

                  <div className="flex flex-wrap gap-4 pt-2">
                     <div className="flex items-center gap-1.5 text-[10px] font-black text-[#666666] uppercase bg-[#F3F6F9] px-2.5 py-1 rounded-sm">
                        <Star size={12} className="text-yellow-500 fill-yellow-500" /> {m.rating} ({m.reviews})
                     </div>
                     <div className="flex items-center gap-1.5 text-[10px] font-black text-[#666666] uppercase bg-[#F3F6F9] px-2.5 py-1 rounded-sm">
                        <Shield size={12} className="text-[#0A66C2]" /> {m.exp} Exp
                     </div>
                  </div>
                </div>

                <div className="pt-6 flex items-center justify-between mt-auto">
                   <p className="text-[10px] font-bold text-[#666666] tracking-tight truncate max-w-[150px]">{m.university}</p>
                   <button className="li-button-primary h-10 px-8 text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/10 transition-all flex items-center gap-2 rounded-lg">
                      Book Now <ArrowRight size={14} />
                   </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* BECOME A MENTOR MODAL */}
      <AnimatePresence>
        {isApplyModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setIsApplyModalOpen(false)}
               className="absolute inset-0 bg-black/40 backdrop-blur-sm"
             />
             <motion.div 
               initial={{ scale: 0.95, opacity: 0, y: 20 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.95, opacity: 0, y: 20 }}
               className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl shadow-black/20 p-8 space-y-6 overflow-hidden"
             >
                <div className="flex items-center justify-between">
                   <div className="space-y-1">
                      <h2 className="text-2xl font-black text-black uppercase tracking-tight">Become a Mentor</h2>
                      <p className="text-sm text-[#666666] font-medium">Share your expertise and guide the next generation.</p>
                   </div>
                   <button onClick={() => setIsApplyModalOpen(false)} className="p-2 hover:bg-[#F3F6F9] rounded-full transition-colors">
                      <X size={24} className="text-[#666666]" />
                   </button>
                </div>

                <form onSubmit={handleApply} className="space-y-5">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-[#666666] uppercase tracking-widest">Expertise</label>
                      <input 
                        required
                        placeholder="e.g. Deep Learning, UI/UX, Product Mgmt..."
                        value={formData.expertise}
                        onChange={(e) => setFormData({...formData, expertise: e.target.value})}
                        className="w-full h-12 bg-[#F3F6F9] border-none rounded-xl px-4 text-sm font-medium focus:ring-1 focus:ring-[#0A66C2] focus:bg-white transition-all outline-none"
                      />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-[#666666] uppercase tracking-widest">Experience</label>
                        <input 
                          required
                          placeholder="e.g. 5+ Years"
                          value={formData.experience}
                          onChange={(e) => setFormData({...formData, experience: e.target.value})}
                          className="w-full h-12 bg-[#F3F6F9] border-none rounded-xl px-4 text-sm font-medium focus:ring-1 focus:ring-[#0A66C2] focus:bg-white transition-all outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-[#666666] uppercase tracking-widest">Price per session</label>
                        <input 
                          required
                          placeholder="e.g. Free or ₹1500"
                          value={formData.price}
                          onChange={(e) => setFormData({...formData, price: e.target.value})}
                          className="w-full h-12 bg-[#F3F6F9] border-none rounded-xl px-4 text-sm font-medium focus:ring-1 focus:ring-[#0A66C2] focus:bg-white transition-all outline-none"
                        />
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-[#666666] uppercase tracking-widest">Short Bio</label>
                      <textarea 
                        required
                        rows={3}
                        placeholder="Give students a reason to book your session..."
                        value={formData.bio}
                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                        className="w-full bg-[#F3F6F9] border-none rounded-xl p-4 text-sm font-medium focus:ring-1 focus:ring-[#0A66C2] focus:bg-white transition-all outline-none resize-none"
                      />
                   </div>

                   <button 
                     type="submit"
                     disabled={loading}
                     className="w-full h-12 bg-[#0A66C2] text-white font-black text-[13px] uppercase tracking-widest rounded-xl hover:bg-[#004182] shadow-xl shadow-[#0A66C2]/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                   >
                     {loading ? "Joining Network..." : "Register as Mentor"}
                   </button>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}

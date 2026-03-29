import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Flag, CheckCircle2, AlertCircle, FileText } from 'lucide-react'

export default function ProjectAudit() {
  const { id } = useParams()
  const navigate = useNavigate()

  return (
    <div className="max-w-[1128px] mx-auto px-4 lg:px-0 py-8 space-y-8 animate-in fade-in duration-700">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-[#666666] hover:text-black font-bold transition-colors"
      >
        <ArrowLeft size={20} /> Project Repository
      </button>

      <section className="li-card p-10 bg-white border-[#D9E2ED] shadow-sm space-y-8">
        <div className="flex justify-between items-start">
           <div className="space-y-4">
              <div className="flex items-center gap-3">
                 <div className="h-14 w-14 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600">
                    <Flag size={32} />
                 </div>
                 <div>
                    <h1 className="text-3xl font-black text-black tracking-tight uppercase italic">Audit Archive</h1>
                    <p className="text-[#666666] font-bold text-sm uppercase tracking-widest">Security Token: {id?.slice(8)}</p>
                 </div>
              </div>
           </div>
           <div className="px-6 py-2 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full font-black text-xs uppercase tracking-widest flex items-center gap-2">
             <CheckCircle2 size={16} /> Verified Stage
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="p-8 bg-[#F9FAFB] rounded-[32px] border border-gray-100 space-y-6">
              <h2 className="text-lg font-black text-gray-900 border-b border-gray-100 pb-4 uppercase tracking-tighter">Audit Checklist</h2>
              <ul className="space-y-4 font-bold text-sm text-gray-600">
                <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-emerald-500" /> Identity Verification Complete</li>
                <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-emerald-500" /> Squad Registration Active</li>
                <li className="flex items-center gap-3"><AlertCircle size={18} className="text-amber-500" /> Pending Progress Verification</li>
              </ul>
           </div>
           <div className="p-8 bg-gray-900 rounded-[32px] text-white space-y-6">
              <h2 className="text-lg font-black uppercase tracking-widest text-gray-400">Security Insights</h2>
              <div className="space-y-2">
                 <div className="flex justify-between text-xs font-black uppercase"><span className="text-gray-400">Integrity Score</span> <span className="text-emerald-400">92%</span></div>
                 <div className="h-4 bg-white/5 rounded-full overflow-hidden border border-white/10 p-0.5">
                   <motion.div initial={{ width: 0 }} animate={{ width: '92%' }} className="h-full bg-emerald-500 rounded-full" />
                 </div>
              </div>
              <button className="w-full py-4 bg-white text-black font-black uppercase text-xs tracking-widest rounded-xl hover:bg-gray-100 transition-all flex items-center justify-center gap-2">
                 <FileText size={16} /> Download Token Report
              </button>
           </div>
        </div>
      </section>
    </div>
  )
}

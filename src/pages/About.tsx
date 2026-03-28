import { motion } from 'framer-motion'
import { ShieldCheck, Target, Award, Mail, Users, Globe, ExternalLink } from 'lucide-react'

export default function About() {
  return (
    <div className="max-w-[1128px] mx-auto px-4 lg:px-0 py-16 space-y-24 animate-in fade-in duration-700">
      
      {/* 1. Header & Platform Overview */}
      <section className="text-center space-y-6 max-w-3xl mx-auto">
        <motion.div 
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           className="inline-flex items-center gap-2 px-5 py-2 bg-[#EDF3F8] text-[#0A66C2] rounded-full text-[12px] font-black uppercase tracking-widest shadow-sm"
        >
           <Globe size={18} /> Digital Campus Ecosystem
        </motion.div>
        <h1 className="text-5xl md:text-6xl font-black text-black tracking-tight uppercase leading-none">About Projecxy</h1>
        <p className="text-lg text-[#666666] font-medium leading-relaxed">
          Projecxy was founded out of a simple need: to bridge the gap between academic projects and industry-ready products. We believe that every student has an innovator inside them, and our platform is built to amplify that potential by connecting minds across campus.
        </p>
      </section>

      {/* 2. Vision Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
         <div className="li-card p-10 bg-[#EDF3F8] space-y-6 relative overflow-hidden border-none shadow-none rounded-[32px]">
            <div className="h-20 w-20 bg-white rounded-2xl flex items-center justify-center text-[#0A66C2] shadow-xl">
               <Target size={40} />
            </div>
            <h2 className="text-3xl font-black text-black uppercase tracking-tight">Our Vision</h2>
            <p className="text-lg text-[#0A66C2] font-semibold leading-relaxed">
              Our vision is to build the world's largest student-driven project network, where innovation has no barriers and collaboration is as easy as a single click.
            </p>
            <div className="absolute right-0 bottom-0 opacity-10 translate-x-1/2 translate-y-1/2">
               <Target size={240} />
            </div>
         </div>
         
         <div className="space-y-6 p-4">
            <h2 className="text-3xl font-black text-black uppercase tracking-tight">Real-time Collaboration</h2>
            <p className="text-[#666666] text-lg font-medium leading-relaxed">
              Connect with students from diverse backgrounds—Aeronautical Engineering, Computer Science, Biotechnology, and more. Projecxy offers a real-time messaging engine, application tracking, and expert mentorship under one roof.
            </p>
            <div className="grid grid-cols-2 gap-4">
               {[
                 { label: '500+', sub: 'Innovators' },
                 { label: '50+', sub: 'Campus Projects' }
               ].map((stat, i) => (
                 <div key={i} className="li-card p-6 border-[#D9E2ED] shadow-sm hover:shadow-md transition-all">
                    <p className="text-2xl font-black text-[#0A66C2]">{stat.label}</p>
                    <p className="text-xs font-black text-[#666666] uppercase tracking-widest">{stat.sub}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* 3. Founder Section */}
      <section className="li-card p-12 bg-white flex flex-col md:flex-row items-center gap-12 border-[#D9E2ED] shadow-xl rounded-[32px]">
         <div className="h-48 w-48 rounded-[48px] overflow-hidden bg-neutral-100 flex-shrink-0 border-4 border-[#0A66C2]/10 rotate-3 transition-transform hover:rotate-0">
            <div className="h-full w-full bg-[#EDF3F8] flex items-center justify-center">
               <span className="text-5xl font-black text-[#0A66C2]">AK</span>
            </div>
         </div>
         <div className="space-y-6 flex-grow text-center md:text-left">
            <div className="space-y-2">
               <h2 className="text-3xl font-black text-black uppercase tracking-tight">Founder: Arpan Kumar</h2>
               <p className="text-[#0A66C2] font-black uppercase tracking-[0.2em] text-xs">Visionary & Lead Architect</p>
            </div>
            <p className="text-lg text-[#666666] font-medium leading-relaxed">
              Arpan Kumar is a passionate developer and innovator who envisioned Projecxy as a way for students to showcase their practical skills and work on high-impact projects. With a background in Computer Science and a passion for community building, Arpan is dedicated to simplifying the collaborative student journey.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
               <a href="mailto:arpan@projecxy.com" className="h-12 px-8 bg-[#0A66C2] text-white flex items-center justify-center rounded-xl font-black text-xs uppercase tracking-widest gap-2 shadow-xl shadow-[#0A66C2]/20 hover:bg-[#004182] transition-all">
                  Contact Arpan <Mail size={16} />
               </a>
               <button className="h-12 px-8 bg-white border border-[#D9E2ED] text-[#666666] flex items-center justify-center rounded-xl font-black text-xs uppercase tracking-widest gap-2 hover:bg-[#F3F6F9] transition-all">
                  Founder Journey <ExternalLink size={16} />
               </button>
            </div>
         </div>
      </section>

      {/* 4. Contact / Join Section */}
      <section className="text-center py-16 bg-[#F3F6F9] rounded-[48px] space-y-8">
         <h2 className="text-4xl font-black text-black uppercase tracking-tight">Join the Campus Network</h2>
         <p className="max-w-xl mx-auto text-[#666666] font-medium pb-4">Whether you're a first-year student or a final-year researcher, Projecxy is ready for your innovations.</p>
         <div className="flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-3 text-sm font-black uppercase text-[#666666] tracking-widest">
               <ShieldCheck size={20} className="text-[#0A66C2]" /> Secure & Verified
            </div>
            <div className="flex items-center gap-3 text-sm font-black uppercase text-[#666666] tracking-widest">
               <Users size={20} className="text-[#0A66C2]" /> Real-time Teams
            </div>
            <div className="flex items-center gap-3 text-sm font-black uppercase text-[#666666] tracking-widest">
               <Award size={20} className="text-[#0A66C2]" /> Awarded Innovation
            </div>
         </div>
      </section>

    </div>
  )
}

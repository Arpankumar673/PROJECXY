import { Link } from 'react-router-dom'
import { Rocket, Shield, Users, ArrowRight, Code2, Sparkles, BrainCircuit, Search, CheckCircle } from 'lucide-react'

export default function Landing() {
  return (
    <div className="min-h-screen bg-white text-text-main font-sans selection:bg-brand/10 antialiased overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white border-b border-border-subtle h-14 px-6 lg:px-12 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand rounded-sm flex items-center justify-center shrink-0">
            <Code2 className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-text-main">Projecxy</span>
        </div>
        <div className="flex items-center gap-8">
          <Link to="/auth" className="text-sm font-semibold text-text-secondary hover:text-brand transition-colors hidden sm:block">Sign in</Link>
          <Link to="/auth?mode=signup" className="btn-outline h-9 px-6 uppercase text-[10px] font-black tracking-widest hidden sm:flex">Join Hub</Link>
          <Link to="/auth?mode=signup" className="btn-primary h-9 px-6 uppercase text-[10px] font-black tracking-widest">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
         <div className="flex-1 space-y-8 text-left max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/5 border border-brand/10 text-brand text-xs font-bold uppercase tracking-[2px] mb-2">
               <Sparkles size={14} className="fill-brand/10" /> V1.1.0 Institutional Release
            </div>
            <h1 className="text-5xl md:text-6xl font-semibold text-text-main leading-[1.1] tracking-tight">
               Build your <span className="text-brand">Professional</span> Campus Network.
            </h1>
            <p className="text-lg md:text-xl text-text-secondary leading-relaxed">
               The dedicated academic OS for innovation governance. Connect with peers, showcase research, and accelerate institutional growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
               <Link to="/auth?mode=signup" className="btn-primary h-12 px-10 text-base shadow-xl shadow-brand/20">
                  Join Your Campus <ArrowRight size={18} />
               </Link>
               <Link to="/search" className="btn-outline h-12 px-10 text-base bg-white">
                  Discover Projects
               </Link>
            </div>
         </div>
         <div className="flex-1 w-full max-w-md hidden md:block relative">
            {/* Abstract Professional Illustration Placeholder */}
            <div className="relative z-10 p-8 card bg-brand/5 border-2 border-brand/5 shadow-2xl rotate-2">
               <div className="space-y-4">
                  <div className="h-4 w-32 bg-brand/10 rounded-full" />
                  <div className="h-4 w-48 bg-brand/5 rounded-full" />
                  <div className="space-y-2 mt-8">
                     {[1, 2, 3].map(i => (
                        <div key={i} className="card p-3 flex gap-3 -mx-2">
                           <div className="w-10 h-10 rounded-full bg-gray-100" />
                           <div className="flex-1 space-y-2">
                              <div className="h-3 w-20 bg-gray-100 rounded-full" />
                              <div className="h-2 w-full bg-gray-50 rounded-full" />
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
               <div className="absolute -top-4 -right-4 w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-xl shadow-emerald-500/30">
                  <CheckCircle size={24} />
               </div>
            </div>
            {/* Background blobs */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand/5 blur-[100px] rounded-full -z-10" />
         </div>
      </section>

      {/* Feature Section */}
      <section className="py-24 bg-gray-50 border-y border-border-subtle overflow-hidden relative">
         <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
               { icon: BrainCircuit, title: 'Innovation Guard', desc: 'Semantic project analysis ensures high academic integrity and discourages redundancy.', color: 'text-blue-600' },
               { icon: Users, title: 'Peer Collaboration', desc: 'Secure peer-to-peer messaging protocols for seamless project transmission and feedback.', color: 'text-[#0A66C2]' },
               { icon: Shield, title: 'Academic Privacy', desc: 'Robust RLS policies protecting institutional intellectual property and student data.', color: 'text-emerald-600' }
            ].map((feature, i) => (
               <div key={i} className="text-center space-y-4 group">
                  <div className="w-16 h-16 bg-white border border-border-subtle rounded-2xl flex items-center justify-center mx-auto shadow-sm group-hover:shadow-xl group-hover:border-brand/30 transition-all duration-300">
                     <feature.icon className={`w-8 h-8 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-text-main">{feature.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed px-4">{feature.desc}</p>
               </div>
            ))}
         </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 text-center max-w-4xl mx-auto space-y-8 relative overflow-hidden">
         <h2 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight">
            Ready to scale your <span className="text-brand">Academic</span> footprint?
         </h2>
         <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Join thousands of innovators who are already restructuring their campus governance through the Projecxy ecosystem.
         </p>
         <div className="pt-6">
            <Link to="/auth?mode=signup" className="btn-primary h-14 px-12 text-lg shadow-2xl shadow-brand/30 mx-auto">
               Agree & Join Now
            </Link>
         </div>
         <p className="text-xs font-bold text-text-secondary uppercase tracking-[3px] pt-12">LinkedIn-Ready Efficiency • Built for Success</p>

         {/* Decorative background logo */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] pointer-events-none -z-10">
            <Code2 size={400} />
         </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border-subtle flex flex-col md:flex-row items-center justify-between px-6 lg:px-12 gap-6 bg-white">
         <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
               <div className="w-6 h-6 bg-brand rounded-sm flex items-center justify-center shrink-0">
                  <Code2 className="text-white w-4 h-4" />
               </div>
               <span className="text-sm font-bold tracking-tight text-text-main">Projecxy &copy; 2026</span>
            </div>
            <div className="flex items-center gap-4 text-xs font-bold text-text-secondary uppercase tracking-widest">
               <button className="hover:text-brand transition-colors">User Agreement</button>
               <button className="hover:text-brand transition-colors">Privacy Policy</button>
               <button className="hover:text-brand transition-colors">Community Help</button>
            </div>
         </div>
         <div className="text-xs text-text-secondary font-medium">
            Developed with <span className="text-red-600">❤</span> for the Global Academic Community.
         </div>
      </footer>
    </div>
  )
}

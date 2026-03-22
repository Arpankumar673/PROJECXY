import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Rocket, ShieldCheck, Users, TrendingUp, 
  ChevronRight, CheckCircle, Heart, Zap, Globe
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Button, Card, cn } from '../components/ui';

export const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    { title: 'Plagiarism Engine', icon: ShieldCheck, desc: 'Our semantic AI ensures every project proposal is unique within your department archives.' },
    { title: 'Global Team Sourcing', icon: Users, desc: 'Connect with students across batches. Form high-performance cross-functional teams.' },
    { title: 'Guided Roadmaps', icon: Zap, desc: 'Intelligent project roadmaps that guide you from ideation to final institutional approval.' },
    { title: 'Live Progress Tracking', icon: TrendingUp, desc: 'Real-time dashboard for HODs and students to monitor project health and milestones.' },
  ];

  return (
    <div className="bg-white min-h-screen text-projecxy-text selection:bg-blue-100 selection:text-projecxy-blue">
      <Navbar />
      
      {/* 🚀 IMPACT HERO */}
      <header className="max-w-7xl mx-auto px-6 pt-24 pb-32 text-center lg:text-left flex flex-col lg:flex-row items-center gap-20">
        <div className="flex-1 space-y-10 animate-in fade-in slide-in-from-left-8 duration-1000">
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-2xl bg-blue-50 text-projecxy-blue text-xs font-black uppercase tracking-widest shadow-soft border border-blue-100">
                <Rocket className="w-4 h-4" /> Campus Innovation Protocol
            </div>
            <h1 className="text-5xl lg:text-7xl font-black leading-[1.05] tracking-tighter">
                Every <span className="text-projecxy-blue">Innovation</span> <br/> 
                Needs a Reliable <br/>
                <span className="underline decoration-[12px] underline-offset-8 decoration-blue-100">Operating System.</span>
            </h1>
            <p className="text-xl text-projecxy-secondary font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed">
                The centralized hub for academic product development. Recruit teammates, protect your originality, and showcase your professional legacy.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-6 pt-4">
                <Button size="lg" onClick={() => navigate('/signup')} className="w-full sm:w-auto h-16 px-12 rounded-3xl text-lg shadow-xl shadow-blue-100">Ignite Your Project</Button>
                <button className="flex items-center gap-2 font-black text-xs uppercase tracking-widest text-projecxy-secondary hover:text-projecxy-blue transition-colors group">
                    Explore Public Hub <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
        
        <div className="flex-1 relative hidden lg:block animate-in fade-in slide-in-from-right-8 duration-1000">
            <div className="absolute inset-0 bg-blue-50/50 rounded-[80px] -rotate-6 scale-95 opacity-50" />
            <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800" 
                className="rounded-[60px] shadow-soft border-[12px] border-white relative z-10" 
                alt="Collaboration" 
            />
            <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-3xl shadow-soft border border-gray-100 z-20 animate-bounce">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center"><CheckCircle className="w-6 h-6" /></div>
                    <div><p className="text-[10px] font-black uppercase tracking-widest text-gray-400 leading-none mb-1">Status</p><p className="font-bold text-sm text-projecxy-text leading-none">Originality Verified</p></div>
                </div>
            </div>
        </div>
      </header>

      {/* 🌪️ FEATURE MATRIX */}
      <section className="bg-projecxy-bg py-32 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
           <div className="text-center mb-24 max-w-3xl mx-auto space-y-4">
              <h2 className="text-4xl font-black uppercase tracking-tighter">Campus Utility at Scale</h2>
              <p className="text-lg text-projecxy-secondary font-medium">Engineered for departmental rigor and student-level speed.</p>
           </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <Card key={i} className="p-10 border border-gray-100 hover:shadow-soft transition-all group hover:-translate-y-2 bg-white rounded-3xl">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-projecxy-blue mb-8 group-hover:scale-110 transition-transform">
                  <f.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-4 tracking-tight">{f.title}</h3>
                <p className="text-projecxy-secondary text-sm leading-relaxed font-medium">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 🏢 INSTITUTIONAL TRUST */}
      <section className="py-32">
        <div className="max-w-5xl mx-auto px-6 text-center">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 mb-12">Trusted by Institutional Innovations</h3>
            <div className="flex flex-wrap justify-between items-center gap-12 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all">
                <span className="text-xl font-black tracking-tighter">NIT SRINAGAR</span>
                <span className="text-xl font-black tracking-tighter">BITS PILANI</span>
                <span className="text-xl font-black tracking-tighter">DTU INNOVATION</span>
                <span className="text-xl font-black tracking-tighter">IIT KHARAGPUR</span>
            </div>
        </div>
      </section>

      {/* 🏁 FINAL CTA & FOOTER */}
      <footer className="bg-projecxy-bg border-t border-gray-100 py-24">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="text-center md:text-left space-y-5">
              <div className="flex items-center gap-3 justify-center md:justify-start text-projecxy-blue font-black text-3xl tracking-tighter uppercase relative group">
                <Rocket className="w-8 h-8 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                <span>Projecxy</span>
              </div>
              <p className="text-sm font-medium text-projecxy-secondary max-w-xs">Building the future of academic collaboration, one repository at a time.</p>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex gap-10 text-[10px] font-black uppercase tracking-widest text-projecxy-secondary">
                  <a href="#" className="hover:text-projecxy-blue">Registry</a>
                  <a href="#" className="hover:text-projecxy-blue">Privacy</a>
                  <a href="#" className="hover:text-projecxy-blue">Support</a>
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-300 flex items-center gap-2">
                 Crafted with <Heart className="w-3.5 h-3.5 text-red-500 fill-current" /> by the Innovation Protocol &copy; 2026.
              </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

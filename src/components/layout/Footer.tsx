import { Link } from 'react-router-dom'
import { Mail, Globe, MessageSquare, Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="footer-bg border-t border-[#EBEBEB] pt-12 pb-8 bg-white mt-auto">
      <div className="max-w-[1128px] mx-auto px-4 lg:px-0">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand & Description */}
          <div className="md:col-span-2 space-y-4">
             <div className="flex items-center gap-2 group">
                <div className="h-7 w-7 bg-[#0A66C2] rounded-[3px] flex items-center justify-center group-hover:bg-[#004182] transition-colors">
                  <span className="text-white font-black text-lg italic leading-none">P</span>
                </div>
                <span className="text-lg font-black text-black tracking-widest uppercase">Projecxy</span>
             </div>
             <p className="text-sm text-[#666666] max-w-sm leading-relaxed font-medium">
               An innovative ecosystem where students collaborate, innovate, and turn academic projects into industry-ready solutions.
             </p>
             <div className="flex items-center gap-4 text-[#666666]">
                <a href="#" className="hover:text-[#0A66C2] transition-colors"><Globe size={18} /></a>
                <a href="#" className="hover:text-[#0A66C2] transition-colors"><MessageSquare size={18} /></a>
                <a href="#" className="hover:text-[#0A66C2] transition-colors"><Mail size={18} /></a>
             </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
             <h3 className="text-xs font-black text-black uppercase tracking-widest">Platform</h3>
             <ul className="space-y-2 text-sm text-[#666666] font-medium">
                <li><Link to="/about" className="hover:text-[#0A66C2] hover:underline">About Projecxy</Link></li>
                <li><Link to="/projects" className="hover:text-[#0A66C2] hover:underline">Discover Projects</Link></li>
                <li><Link to="/mentorship" className="hover:text-[#0A66C2] hover:underline">Expert Guidance</Link></li>
             </ul>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
             <h3 className="text-xs font-black text-black uppercase tracking-widest">Get in Touch</h3>
             <div className="space-y-3">
                <a href="mailto:support@projecxy.com" className="flex items-center gap-2 text-sm text-[#666666] hover:text-[#0A66C2] font-medium transition-colors">
                   <Mail size={16} /> support@projecxy.com
                </a>
                <p className="text-[11px] text-[#666666] font-bold uppercase tracking-tighter">G.C.R.G Group of Institutions Campus Hub</p>
             </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#F3F2EF] flex flex-col md:flex-row justify-between items-center gap-4">
           <p className="text-xs text-[#666666] font-bold uppercase tracking-widest">
             © {new Date().getFullYear()} Projecxy Network. All rights reserved.
           </p>
           <p className="text-[10px] text-[#666666] flex items-center gap-1.5 font-black uppercase tracking-widest">
             Crafted with <Heart size={12} className="text-red-500 fill-current" /> by students for students.
           </p>
        </div>
      </div>
    </footer>
  )
}
